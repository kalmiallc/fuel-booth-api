import { Application } from 'express';
import { NextFunction, Request, Response } from '../http';
import { RouteErrorCode, SerializedStrategy } from '../config/values';
import { ResourceError, ValidationError } from '../lib/errors';
import { User } from '../models/user';
import {submit_race_score} from '../fuel_web3/submit-contract-score';
import { env } from "../config/env";


export function inject(app: Application) {
    app.post('/users/score', (req: Request, res: Response, next: NextFunction) => {
      resolveScore(req, res).catch(next);
    });
  
}
  

export async function resolveScore(req: Request, res: Response): Promise<void> {
  const {  body } = req;
  const { username, time_seconds, damage, distance, speed, score_type } = body;

  // Log the incoming request data
  console.log('Request Data:', { username, time_seconds, damage, distance, speed, score_type });
  

  // Validate the presence of required fields
  if (!username || !time_seconds || !damage || !distance || !speed || !score_type) {
    throw new ValidationError(null, null, "Missing required fields");
  }

  // Fetch the user and update their score details
  const user = await new User({}, req.context).populateByUsername(username);
  if (!user) {  throw new Error('User not found');  }


  user.speed = 0.0; 
  user.damage = 0.0;  // Number(Number(damage).toFixed(2));
  user.distance = 0.0;  // Number(Number(distance).toFixed(2));
  user.time_seconds = 0.0;  // Number(Number(time_seconds).toFixed(2));
  user.score_type = score_type;
  

  console.log("user ", user.serialize(SerializedStrategy.ADMIN));

  try {
    let result = await submit_race_score(score_type, username, Number(time_seconds), Number(damage), Number(distance), Number(speed));
    user.high_score = Number(result.high_score);
    user.update();
    return res.respond(200, { success: "ok", transactionId: result.transactionId, high_score: result.high_score });
  } catch (error) {
    if (error instanceof Error && error.message.includes("UsernameDoesNotExists")) {
      return res.respond(409, { error: "Username does not exists", msg: error.message });
    } else {
      console.error("An unknown error occurred:", error);
      return res.respond(500, { error: "Internal Server Error" });
    }
  }
}
