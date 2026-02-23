import crypto from "crypto";
import pool from "../db";
import { PlanResponse, WorkoutResponse, WorkoutStepResponse } from "../types";

export async function getLatestPlan(
  userId: string
): Promise<PlanResponse | null> {
  // Get latest plan for user
  const planResult = await pool.query(
    `SELECT id, version, created_at FROM plans
     WHERE user_id = $1
     ORDER BY version DESC
     LIMIT 1`,
    [userId]
  );

  if (planResult.rows.length === 0) {
    return null;
  }

  const plan = planResult.rows[0];

  // Get workouts with steps
  const workoutResult = await pool.query(
    `SELECT id, scheduled_for, title, sport_type
     FROM workouts
     WHERE plan_id = $1
     ORDER BY sort_index`,
    [plan.id]
  );

  const workouts: WorkoutResponse[] = [];

  for (const workout of workoutResult.rows) {
    const stepResult = await pool.query(
      `SELECT step_index, type, duration_sec, distance_meters, target, note
       FROM workout_steps
       WHERE workout_id = $1
       ORDER BY step_index`,
      [workout.id]
    );

    const steps: WorkoutStepResponse[] = stepResult.rows.map((s) => ({
      stepIndex: s.step_index,
      type: s.type,
      durationSec: s.duration_sec,
      distanceMeters: s.distance_meters,
      target: s.target,
      note: s.note,
    }));

    workouts.push({
      workoutId: workout.id,
      scheduledFor: workout.scheduled_for.toISOString().split("T")[0],
      title: workout.title,
      sportType: workout.sport_type,
      steps,
    });
  }

  const responseBody = {
    planVersion: plan.version,
    generatedAt: plan.created_at.toISOString(),
    workouts,
  };

  const checksum =
    "sha256:" +
    crypto
      .createHash("sha256")
      .update(JSON.stringify(responseBody))
      .digest("hex");

  return { ...responseBody, checksum };
}
