import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://workout_ai:workout_ai@localhost:5432/workout_ai",
});

export default pool;
