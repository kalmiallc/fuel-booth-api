import { Application } from "express";
import { NextFunction, Request, Response } from "../http";
import {
  PopulateStrategy,
  RouteErrorCode,
  SerializedStrategy,
} from "../config/values";
import { ResourceError, ValidationError } from "../lib/errors";
import { User } from "../models/user";
import { submitRaceScore } from "../fuel/submit-contract-score";
import { env } from "../config/env";

export function inject(app: Application) {
  app.post(
    "/users/score",
    (req: Request, res: Response, next: NextFunction) => {
      resolve(req, res).catch(next);
    }
  );
}

export async function resolve(req: Request, res: Response): Promise<void> {
  const { body } = req;

  const user = await new User({}, req.context).populateByUsername(
    body.username
  );
  if (!user) {
    throw new ResourceError(RouteErrorCode.USER_DOES_NOT_EXIST, req.context);
  }

  user.populate(
    {
      ...body,
      high_score:
        user.high_score > body.high_score ? user.high_score : body.high_score,
    },
    PopulateStrategy.SCORE
  );

  await user.validate();

  console.log("user ", user.serialize(SerializedStrategy.ADMIN));

  try {
    let result = await submitRaceScore(
      user.score_type,
      user.username,
      user.time_seconds,
      user.distance,
    );
    user.high_score = parseInt(result.high_score);
    await user.update(SerializedStrategy.SCORE);

    return res.respond(200, {
      ...user.serialize(SerializedStrategy.PROFILE),
      transactionId: result.transactionId,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("UsernameDoesNotExists")
    ) {
      throw new ResourceError(RouteErrorCode.USER_DOES_NOT_EXIST, req.context);
    } else {
      throw error;
    }
  }
}
