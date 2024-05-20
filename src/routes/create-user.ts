import { Application } from "express";
import { NextFunction, Request, Response } from "../http";
import { PopulateStrategy } from "../config/values";
import { ValidationError } from "../lib/errors";
import { User } from "../models/user";
import { register_player_profile } from '../fuel_web3/register-contract-user';
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
  const users = new User({}, context).populate(body, PopulateStrategy.ADMIN);

  try {
    await users.validate();
  } catch (err) {
    await users.handle(err);
  }

  if (users.isValid()) {

    try {
      let email = "";
      if ('email' in body) {
        email = body["email"];
      }
      const player_profile = await register_player_profile(body["username"], email);
      console.log("player_profile --------------------------------------", player_profile);

      await users.create();
      //await users.update();
      return res.respond(201, { success: "ok" , player_profile: player_profile});

    } catch (error) {
      
      if (error instanceof Error && error.message.includes("UsernameExists")) {
        return res.respond(409, { error: "Username already exists On Chain" });
      }
      return res.respond(500, { error: "Internal Server Error" });
      
    }
  } else {
    throw new ValidationError(users, context, "create-user");
  }
}
