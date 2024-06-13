import { Application } from "express";
import { NextFunction, Request, Response } from "../http";
import { RouteErrorCode, SerializedStrategy } from "../config/values";
import { PopulateStrategy } from "../config/values";
import { ResourceError, ValidationError } from "../lib/errors";
import { User } from "../models/user";
import { registerPlayerProfile } from "../fuel/register-contract-user";
/**
 * Installs new route on the provided application.
 * @param app ExpressJS application.
 */
export function inject(app: Application) {
  app.post("/users", (req: Request, res: Response, next: NextFunction) => {
    resolve(req, res).catch(next);
  });
}

export async function resolve(req: Request, res: Response): Promise<void> {
  const { context, body } = req;
  
  if (body.email) {
    const existingUser = await new User({}, context).populateByEmail(body.email);  
    if (existingUser.isValid() && existingUser.email && body.username === existingUser.username) {
      return res.respond(201, existingUser.serialize(SerializedStrategy.PROFILE));
    }
  }

  const user = new User({}, context).populate(body, PopulateStrategy.ADMIN);

  try {
    await user.validate();
  } catch (err) {
    await user.handle(err);
  }

  if (user.isValid()) {
    try {
      // register on chain
      const playerProfile = await registerPlayerProfile(
        user.username,
        user.email
      );

      // save data from chain
      user.populate(
        {
          register_transaction_id: playerProfile.registerTransactionId,
          player_contract_index_id: playerProfile.playerId,
          username_email_hash: playerProfile.usernameEmailHash,
          username_hash: playerProfile.usernameHash,
          high_score: playerProfile.highScore,
        },
        PopulateStrategy.ADMIN
      );

      // store in DB
      await user.create();

      return res.respond(201, user.serialize(SerializedStrategy.PROFILE));
    } catch (error) {
      if (error instanceof Error && error.message.includes("UsernameExists")) {
        throw new ResourceError(RouteErrorCode.USER_ALREADY_EXISTS, context);
      }
      throw error;
    }
  } else {
    throw new ValidationError(user, context, "create-user");
  }
}
