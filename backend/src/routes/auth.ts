import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import pool from "../db";
import { generateToken } from "../middleware/auth";

const router = Router();

router.post("/v1/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const result = await pool.query("SELECT id, password_hash FROM users WHERE email = $1", [
    email,
  ]);

  if (result.rows.length === 0) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const user = result.rows[0];
  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = generateToken(user.id);
  res.json({ token, userId: user.id });
});

export default router;
