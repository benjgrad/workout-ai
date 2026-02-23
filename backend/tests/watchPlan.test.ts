import request from "supertest";
import app from "../src/app";
import pool from "../src/db";

afterAll(async () => {
  await pool.end();
});

const userId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
const validKey = "dev-watch-key-change-in-production";

describe("GET /v1/watch/plan/:userId", () => {
  it("returns plan for valid API key", async () => {
    const response = await request(app).get(
      `/v1/watch/plan/${userId}?key=${validKey}`
    );

    expect(response.status).toBe(200);
    expect(response.body.planVersion).toBe(1);
    expect(response.body.workouts).toHaveLength(3);
    expect(response.body.checksum).toMatch(/^sha256:/);
  });

  it("returns 401 for missing API key", async () => {
    const response = await request(app).get(`/v1/watch/plan/${userId}`);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid or missing API key");
  });

  it("returns 401 for invalid API key", async () => {
    const response = await request(app).get(
      `/v1/watch/plan/${userId}?key=wrong-key`
    );

    expect(response.status).toBe(401);
  });

  it("returns 404 for unknown user", async () => {
    const response = await request(app).get(
      `/v1/watch/plan/00000000-0000-0000-0000-000000000000?key=${validKey}`
    );

    expect(response.status).toBe(404);
  });

  it("returns same data shape as authenticated plan endpoint", async () => {
    const response = await request(app).get(
      `/v1/watch/plan/${userId}?key=${validKey}`
    );

    expect(response.body).toHaveProperty("planVersion");
    expect(response.body).toHaveProperty("generatedAt");
    expect(response.body).toHaveProperty("workouts");
    expect(response.body).toHaveProperty("checksum");
    expect(response.body.workouts[0]).toHaveProperty("workoutId");
    expect(response.body.workouts[0]).toHaveProperty("scheduledFor");
    expect(response.body.workouts[0]).toHaveProperty("steps");
  });
});
