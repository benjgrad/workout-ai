import request from "supertest";
import app from "../src/app";
import pool from "../src/db";
import { generateToken } from "../src/middleware/auth";

afterAll(async () => {
  await pool.end();
});

describe("POST /v1/auth/login", () => {
  it("returns JWT for valid credentials", async () => {
    const response = await request(app)
      .post("/v1/auth/login")
      .send({ email: "test@workout.ai", password: "testpass123" });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.userId).toBe("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
  });

  it("rejects invalid password", async () => {
    const response = await request(app)
      .post("/v1/auth/login")
      .send({ email: "test@workout.ai", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid email or password");
  });

  it("rejects unknown email", async () => {
    const response = await request(app)
      .post("/v1/auth/login")
      .send({ email: "nobody@test.com", password: "testpass123" });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid email or password");
  });

  it("rejects missing fields", async () => {
    const response = await request(app)
      .post("/v1/auth/login")
      .send({ email: "test@workout.ai" });

    expect(response.status).toBe(400);
  });
});

describe("Auth middleware", () => {
  it("rejects request with no Authorization header", async () => {
    const response = await request(app).get("/v1/plan/latest");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Missing authentication token");
  });

  it("rejects request with invalid token", async () => {
    const response = await request(app)
      .get("/v1/plan/latest")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid authentication token");
  });

  it("passes request with valid token", async () => {
    const token = generateToken("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
    const response = await request(app)
      .get("/v1/plan/latest")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
