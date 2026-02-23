import bcrypt from "bcryptjs";
import pool from "../src/db";

async function seed() {
  // Create test user
  const passwordHash = await bcrypt.hash("testpass123", 10);
  const userResult = await pool.query(
    `INSERT INTO users (id, email, password_hash, display_name)
     VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'test@workout.ai', $1, 'Test Runner')
     ON CONFLICT (email) DO UPDATE SET password_hash = $1
     RETURNING id`,
    [passwordHash]
  );
  const userId = userResult.rows[0].id;
  console.log(`User: ${userId}`);

  // Delete existing plan data for idempotent re-seeding
  await pool.query(
    `DELETE FROM workout_steps WHERE workout_id IN (
       SELECT w.id FROM workouts w
       JOIN plans p ON w.plan_id = p.id
       WHERE p.user_id = $1
     )`,
    [userId]
  );
  await pool.query(
    `DELETE FROM workouts WHERE plan_id IN (
       SELECT id FROM plans WHERE user_id = $1
     )`,
    [userId]
  );
  await pool.query(`DELETE FROM plans WHERE user_id = $1`, [userId]);

  // Create plan
  const planResult = await pool.query(
    `INSERT INTO plans (id, user_id, version, start_date, end_date, metadata)
     VALUES ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', $1, 1, '2026-02-23', '2026-02-28',
       '{"name": "Week 1 Running", "goal": "base_building"}')
     RETURNING id`,
    [userId]
  );
  const planId = planResult.rows[0].id;
  console.log(`Plan: ${planId}`);

  // Workout 1: Easy Run (Feb 23)
  const w1 = await pool.query(
    `INSERT INTO workouts (id, plan_id, scheduled_for, title, sport_type, sort_index)
     VALUES ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', $1, '2026-02-23', 'Easy Run', 'RUN', 0)
     RETURNING id`,
    [planId]
  );
  await pool.query(
    `INSERT INTO workout_steps (workout_id, step_index, type, duration_sec, note) VALUES
     ($1, 0, 'WARMUP', 300, '5 min easy jog'),
     ($1, 1, 'ACTIVE', 1200, '20 min steady run'),
     ($1, 2, 'COOLDOWN', 300, '5 min easy jog')`,
    [w1.rows[0].id]
  );

  // Workout 2: Intervals (Feb 25)
  const w2 = await pool.query(
    `INSERT INTO workouts (id, plan_id, scheduled_for, title, sport_type, sort_index)
     VALUES ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', $1, '2026-02-25', 'Intervals', 'RUN', 1)
     RETURNING id`,
    [planId]
  );
  const intervalSteps: [number, string, number, string][] = [
    [0, "WARMUP", 600, "10 min easy jog"],
  ];
  for (let i = 0; i < 6; i++) {
    intervalSteps.push([
      1 + i * 2,
      "INTERVAL",
      120,
      `Hard interval ${i + 1}`,
    ]);
    intervalSteps.push([2 + i * 2, "RECOVERY", 120, `Recovery jog ${i + 1}`]);
  }
  intervalSteps.push([13, "COOLDOWN", 600, "10 min easy jog"]);

  for (const [stepIndex, type, durationSec, note] of intervalSteps) {
    await pool.query(
      `INSERT INTO workout_steps (workout_id, step_index, type, duration_sec, note)
       VALUES ($1, $2, $3, $4, $5)`,
      [w2.rows[0].id, stepIndex, type, durationSec, note]
    );
  }

  // Workout 3: Rest Day (Feb 26) — no steps
  await pool.query(
    `INSERT INTO workouts (id, plan_id, scheduled_for, title, sport_type, sort_index)
     VALUES ('c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', $1, '2026-02-26', 'Rest Day', 'REST', 2)`,
    [planId]
  );

  await pool.end();
  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
