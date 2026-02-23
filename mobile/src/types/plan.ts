export interface WorkoutStep {
  stepIndex: number;
  type: string;
  durationSec: number | null;
  distanceMeters: number | null;
  target: Record<string, unknown>;
  note: string | null;
}

export interface Workout {
  workoutId: string;
  scheduledFor: string;
  title: string;
  sportType: string;
  steps: WorkoutStep[];
}

export interface PlanResponse {
  planVersion: number;
  generatedAt: string;
  workouts: Workout[];
  checksum: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
}
