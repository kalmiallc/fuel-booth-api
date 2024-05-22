import {
  createContextAndStartServer,
  Stage,
  stopServerAndCloseMySqlContext,
} from "../helpers/context";
import * as request from "supertest";
import { setupTestDatabase, clearTestDatabase } from "../helpers/migrations";
import { env } from "../../config/env";
import { generateAdminAuthToken } from "../../lib/jwt";
import { User } from "../../models/user";
let stage: Stage;
let token;

describe("create user", () => {
  beforeAll(async () => {
    stage = await createContextAndStartServer();
    await setupTestDatabase();
    await new User(
      { email: "test@test.com", username: "test5" },
      stage.context
    ).create();
  });

  afterAll(async () => {
    await clearTestDatabase();
    await stopServerAndCloseMySqlContext(stage);
  });

  test("submit score", async () => {
    const data = {
      email: "test@test.com",
      username: "test5",
      high_score: 10,
      damage: 10,
      distance: 10,
      speed: 10,
      time_seconds: 10,
    };

    const res = await request(stage.app).post("/users/score").send(data);

    expect(res.status).toBe(200);
    expect(res.body.data.damage).toBe(10);
    expect(res.body.data.transactionId).toBeDefined();
    const dbRes = await stage.context.mysql.paramExecute("SELECT * FROM user");
    expect(dbRes[0].speed).toBe(10);
  });
});
