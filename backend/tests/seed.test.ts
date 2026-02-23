import pool from "../src/db";

afterAll(async () => {
  await pool.end();
});

describe("Seed data", () => {
  it("has a test user", async () => {
    const result = await pool.query(
      "SELECT email, display_name FROM users WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'"
    );
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].email).toBe("test@workout.ai");
    expect(result.rows[0].display_name).toBe("Test Runner");
  });

  it("has a plan with version 1", async () => {
    const result = await pool.query(
      "SELECT version, start_date, end_date FROM plans WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'"
    );
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].version).toBe(1);
  });

  it("has 3 workouts", async () => {
    const result = await pool.query(
      `SELECT w.title, w.sport_type FROM workouts w
       JOIN plans p ON w.plan_id = p.id
       WHERE p.user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
       ORDER BY w.sort_index`
    );
    expect(result.rows.length).toBe(3);
    expect(result.rows[0].title).toBe("Easy Run");
    expect(result.rows[1].title).toBe("Intervals");
    expect(result.rows[2].title).toBe("Rest Day");
  });

  it("Easy Run has 3 steps", async () => {
    const result = await pool.query(
      `SELECT ws.type, ws.duration_sec, ws.note FROM workout_steps ws
       JOIN workouts w ON ws.workout_id = w.id
       WHERE w.id = 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
       ORDER BY ws.step_index`
    );
    expect(result.rows.length).toBe(3);
    expect(result.rows[0]).toMatchObject({ type: "WARMUP", duration_sec: 300 });
    expect(result.rows[1]).toMatchObject({ type: "ACTIVE", duration_sec: 1200 });
    expect(result.rows[2]).toMatchObject({ type: "COOLDOWN", duration_sec: 300 });
  });

  it("Intervals has 14 steps", async () => {
    const result = await pool.query(
      `SELECT COUNT(*) FROM workout_steps
       WHERE workout_id = 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'`
    );
    expect(parseInt(result.rows[0].count)).toBe(14);
  });

  it("Rest Day has no steps", async () => {
    const result = await pool.query(
      `SELECT COUNT(*) FROM workout_steps
       WHERE workout_id = 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'`
    );
    expect(parseInt(result.rows[0].count)).toBe(0);
  });
});
