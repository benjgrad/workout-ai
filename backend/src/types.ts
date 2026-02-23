export interface User {
  id: string;
  email: string;
  password_hash: string;
  display_name: string;
  profile: Record<string, unknown>;
  created_at: Date;
}

export interface Plan {
  id: string;
  user_id: string;
  version: number;
  start_date: string;
  end_date: string;
  metadata: Record<string, unknown>;
  created_at: Date;
}

export interface Workout {
  id: string;
  plan_id: string;
  scheduled_for: string;
  title: string;
  sport_type: string;
  targets: Record<string, unknown>;
  sort_index: number;
}

export interface WorkoutStep {
  id: string;
  workout_id: string;
  step_index: number;
  type: string;
  duration_sec: number | null;
  distance_meters: number | null;
  target: Record<string, unknown>;
  note: string | null;
}

export interface PlanResponse {
  planVersion: number;
  generatedAt: string;
  workouts: WorkoutResponse[];
  checksum: string;
}

export interface WorkoutResponse {
  workoutId: string;
  scheduledFor: string;
  title: string;
  sportType: string;
  steps: WorkoutStepResponse[];
}

export interface WorkoutStepResponse {
  stepIndex: number;
  type: string;
  durationSec: number | null;
  distanceMeters: number | null;
  target: Record<string, unknown>;
  note: string | null;
}
