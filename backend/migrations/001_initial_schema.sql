CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  profile JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  version INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, version)
);

CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id),
  scheduled_for DATE NOT NULL,
  title TEXT NOT NULL,
  sport_type TEXT NOT NULL,
  targets JSONB NOT NULL DEFAULT '{}',
  sort_index INT NOT NULL
);

CREATE TABLE workout_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES workouts(id),
  step_index INT NOT NULL,
  type TEXT NOT NULL,
  duration_sec INT,
  distance_meters INT,
  target JSONB NOT NULL DEFAULT '{}',
  note TEXT
);
