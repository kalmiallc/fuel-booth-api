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

  const user = await new User({}, req.context).populateByUsername(username);
  if (!user) {  throw new Error('User not found');  }


  const parsedSpeed = typeof speed === 'string' ? parseFloat(speed) : speed;
  const parsedDamage = typeof damage === 'string' ? parseFloat(damage) : damage;
  const parsedDistance = typeof distance === 'string' ? parseFloat(distance) : distance;

  user.speed = Math.round(parsedSpeed * 10000);
  user.damage = Math.round(parsedDamage * 100);
  user.distance = Math.round(parsedDistance);
  user.time_seconds = time_seconds;
  user.score_type = score_type;  

  console.log("user ", user.serialize(SerializedStrategy.ADMIN));

  try {
    let result = await submit_race_score(score_type, username, Number(time_seconds), Number(damage), Number(distance), Number(speed));
    if (user.high_score < Number(result.high_score)){
      user.high_score = Number(result.high_score);
    }
    

    user.update(SerializedStrategy.SCORE);
    
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
