import { Application } from "express";
import { NextFunction, Request, Response } from "../http";
import { RouteErrorCode, SerializedStrategy } from "../config/values";
import { ResourceError, ValidationError } from "../lib/errors";
import { User } from "../models/user";
import { get_sorted_players_profiles } from "../fuel/get-contract-users";
import { env } from "../config/env";

export function inject(app: Application) {
  app.get("/players", (req: Request, res: Response, next: NextFunction) => {
    resolve(req, res).catch(next);
  });
}

export async function resolve(req: Request, res: Response): Promise<void> {
  const { context, params, query } = req;
  if (!params || !params.username) {
    try {
      const decoded_users = await get_sorted_players_profiles();
      return res.respond(200, {
        decoded_users: decoded_users,
      });
    } catch (error) {
      throw new ResourceError(
        RouteErrorCode.INVALID_REQUEST,
        context,
        "players-route"
      );
    }
  } else {
    throw new ResourceError(
      RouteErrorCode.INVALID_REQUEST,
      context,
      "players-route"
    );
  }
}
