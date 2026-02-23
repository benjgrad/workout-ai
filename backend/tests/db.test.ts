import pool from "../src/db";

afterAll(async () => {
  await pool.end();
});

describe("Database", () => {
  it("connects to PostgreSQL", async () => {
    const result = await pool.query("SELECT 1 AS connected");
    expect(result.rows[0].connected).toBe(1);
  });

  it("has users table", async () => {
    const result = await pool.query(
      `SELECT column_name FROM information_schema.columns
       WHERE table_name = 'users' ORDER BY ordinal_position`
    );
    const columns = result.rows.map((r) => r.column_name);
    expect(columns).toEqual([
      "id",
      "email",
      "password_hash",
      "display_name",
      "profile",
      "created_at",
    ]);
  });

  it("has plans table", async () => {
    const result = await pool.query(
      `SELECT column_name FROM information_schema.columns
       WHERE table_name = 'plans' ORDER BY ordinal_position`
    );
    const columns = result.rows.map((r) => r.column_name);
    expect(columns).toEqual([
      "id",
      "user_id",
      "version",
      "start_date",
      "end_date",
      "metadata",
      "created_at",
    ]);
  });

  it("has workouts table", async () => {
    const result = await pool.query(
      `SELECT column_name FROM information_schema.columns
       WHERE table_name = 'workouts' ORDER BY ordinal_position`
    );
    const columns = result.rows.map((r) => r.column_name);
    expect(columns).toEqual([
      "id",
      "plan_id",
      "scheduled_for",
      "title",
      "sport_type",
      "targets",
      "sort_index",
    ]);
  });

  it("has workout_steps table", async () => {
    const result = await pool.query(
      `SELECT column_name FROM information_schema.columns
       WHERE table_name = 'workout_steps' ORDER BY ordinal_position`
    );
    const columns = result.rows.map((r) => r.column_name);
    expect(columns).toEqual([
      "id",
      "workout_id",
      "step_index",
      "type",
      "duration_sec",
      "distance_meters",
      "target",
      "note",
    ]);
  });
});
