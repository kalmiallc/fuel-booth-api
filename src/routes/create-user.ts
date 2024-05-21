import { Application } from "express";
import { NextFunction, Request, Response } from "../http";
import { RouteErrorCode, SerializedStrategy } from '../config/values';
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
  const user = new User({}, context).populate(body, PopulateStrategy.ADMIN);

  try {
    await user.validate();
  } catch (err) {
    await user.handle(err);
  }

  if (user.isValid()) {

    try {
      // register on chain
      const player_profile = await register_player_profile(user.username, user.email);
      console.log("player_profile ", player_profile);

      // save data from chain
      user.register_transaction_id = player_profile.register_transaction_id;
      user.player_contract_index_id = player_profile.player_id;
      user.username_email_hash = player_profile.username_and_email_hash;
      user.username_hash = player_profile.username_hash;
      user.high_score = Number(player_profile.high_score);

      // store in DB
      await user.create();

      return res.respond(201, user.serialize(SerializedStrategy.PROFILE));      

    } catch (error) {
      
      if (error instanceof Error && error.message.includes("UsernameExists")) {
        return res.respond(409, { error: "Username already exists On Chain" });
      }
      return res.respond(500, { error: "Internal Server Error" });
      
    }
  } else {
    throw new ValidationError(user, context, "create-user");
  }
}
