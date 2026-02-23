import request from "supertest";
import app from "../src/app";
import pool from "../src/db";
import { generateToken } from "../src/middleware/auth";

afterAll(async () => {
  await pool.end();
});

describe("GET /v1/plan/latest", () => {
  const token = generateToken("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");

  it("returns the latest plan with workouts and steps", async () => {
    const response = await request(app)
      .get("/v1/plan/latest")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.planVersion).toBe(1);
    expect(response.body.generatedAt).toBeDefined();
    expect(response.body.checksum).toMatch(/^sha256:/);
    expect(response.body.workouts).toHaveLength(3);
  });

  it("returns workouts in correct order", async () => {
    const response = await request(app)
      .get("/v1/plan/latest")
      .set("Authorization", `Bearer ${token}`);

    const titles = response.body.workouts.map(
      (w: { title: string }) => w.title
    );
    expect(titles).toEqual(["Easy Run", "Intervals", "Rest Day"]);
  });

  it("includes steps for Easy Run", async () => {
    const response = await request(app)
      .get("/v1/plan/latest")
      .set("Authorization", `Bearer ${token}`);

    const easyRun = response.body.workouts[0];
    expect(easyRun.sportType).toBe("RUN");
    expect(easyRun.steps).toHaveLength(3);
    expect(easyRun.steps[0]).toMatchObject({
      stepIndex: 0,
      type: "WARMUP",
      durationSec: 300,
    });
  });

  it("includes correct step count for Intervals", async () => {
    const response = await request(app)
      .get("/v1/plan/latest")
      .set("Authorization", `Bearer ${token}`);

    const intervals = response.body.workouts[1];
    expect(intervals.steps).toHaveLength(14);
  });

  it("Rest Day has no steps", async () => {
    const response = await request(app)
      .get("/v1/plan/latest")
      .set("Authorization", `Bearer ${token}`);

    const restDay = response.body.workouts[2];
    expect(restDay.steps).toHaveLength(0);
  });

  it("returns 404 for user with no plan", async () => {
    const noplanToken = generateToken("00000000-0000-0000-0000-000000000000");
    const response = await request(app)
      .get("/v1/plan/latest")
      .set("Authorization", `Bearer ${noplanToken}`);

    expect(response.status).toBe(404);
  });
});
