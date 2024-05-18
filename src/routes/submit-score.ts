import { Application } from 'express';
import { NextFunction, Request, Response } from '../http';
import { RouteErrorCode, SerializedStrategy } from '../config/values';
import { ResourceError, ValidationError } from '../lib/errors';
import { User } from '../models/user';
import {submit_final_score, submit_track_score} from '../fuel_web3/submit-contract-score';
import { env } from "../config/env";


export function inject(app: Application) {
    app.post('/final-score-user', (req: Request, res: Response, next: NextFunction) => {
      resolveFinalScore(req, res).catch(next);
    });
  
    // http://127.0.0.1:3002/track-score-user/direktor?time_seconds=120&damage=15&distance=300&speed=300
    app.get('/track-score-user/:username', (req: Request, res: Response, next: NextFunction) => {
      resolveTrackScore(req, res).catch(next);
    });
}
  
export async function resolveFinalScore(req: Request, res: Response): Promise<void> {
    const { body } = req;
    const { username, time_seconds, damage } = body;
  
    if (!username || !time_seconds || !damage) {
      throw new ValidationError(null, null, "Missing required fields");
    }
  
    try {
      const transactionId = await submit_final_score(username, time_seconds, damage);
      return res.respond(201, { success: "ok", transactionId });
    } catch (error) {
      if (error instanceof Error && error.message.includes("UsernameDoesNotExists")) {
        return res.respond(409, { error: "Username does not exists" });
      } else {
        console.error("An unknown error occurred:", error);
        return res.respond(500, { error: "Internal Server Error" });
      }
    }
}


export async function resolveTrackScore(req: Request, res: Response): Promise<void> {
    const { params, query } = req;
    const { username } = params;
    const { time_seconds, damage, distance, speed } = query;
  
    if (!username || !time_seconds || !damage || !distance|| !speed) {
      throw new ResourceError(RouteErrorCode.INVALID_REQUEST, null, 'track-score-users');
    }
  
    try {
      const transactionId = await submit_track_score(username, Number(time_seconds), Number(damage), Number(distance), Number(speed));
      return res.respond(200, { success: "ok", transactionId });
    } catch (error) {
      if (error instanceof Error && error.message.includes("UsernameDoesNotExists")) {
        return res.respond(409, { error: "Username does not exists" });
      } else {
        console.error("An unknown error occurred:", error);
        return res.respond(500, { error: "Internal Server Error" });
      }
    }
  }
