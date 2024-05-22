import {
  createContextAndStartServer,
  Stage,
  stopServerAndCloseMySqlContext,
} from "../helpers/context";
import * as request from "supertest";
import { setupTestDatabase, clearTestDatabase } from "../helpers/migrations";
import { User } from "../../models/user";
let stage: Stage;

describe("get user", () => {
  beforeAll(async () => {
    stage = await createContextAndStartServer();
    await setupTestDatabase();
    await new User({}, stage.context).fake().create();
    await new User({}, stage.context)
      .populate({ email: "test@test.com", username: "test5", high_score: 10 })
      .create();

    await new User({}, stage.context)
      .populate({
        email: "test6@test.com",
        username: "test6",
        high_score: 6,
      })
      .create();
  });

  afterAll(async () => {
    await clearTestDatabase();
    await stopServerAndCloseMySqlContext(stage);
  });

  test("get users", async () => {
    const res = await request(stage.app).get("/users");

    expect(res.body.data.items.length).toBe(3);
    expect(res.body.data.total).toBe(3);
    expect(res.body.data.items[0].high_score).toBe(10);
  });
});
