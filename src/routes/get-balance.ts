import { Application } from "express";
import { NextFunction, Request, Response } from "../http";
import { env } from "../config/env";
import { Provider } from "fuels";

/**
 * Installs new route on the provided application.
 * @param app ExpressJS application.
 */
export function inject(app: Application) {
  app.get("/balance", (req: Request, res: Response, next: NextFunction) => {
    resolve(req, res).catch(next);
  });
}

/**
 * A middleware that responds with server information.
 * @param req ExpressJS request object.
 * @param res ExpressJS response object.
 */
// @ts-ignore
export async function resolve(req: Request, res: Response): Promise<void> {
  const provider = await Provider.create("https://beta-5.fuel.network/graphql");

  // const { name } = provider.getChain();
  // console.log(name);

  const balances = await provider.getBalances(
    "fuel1hr8m76dfsptlx5lfewgezvj62jz7creef7ra0hw3rl5dk9jfs0uqwgssqf"
  );

  // console.log(balances);

  return res.respond(200, {
    balances,
  });
}
