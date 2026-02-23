import { Router, Request, Response } from "express";
import { getLatestPlan } from "../services/planService";

const WATCH_API_KEY =
  process.env.WATCH_API_KEY || "dev-watch-key-change-in-production";

const router = Router();

router.get(
  "/v1/watch/plan/:userId",
  async (req: Request, res: Response) => {
    const key = req.query.key as string;

    if (!key || key !== WATCH_API_KEY) {
      res.status(401).json({ error: "Invalid or missing API key" });
      return;
    }

    const plan = await getLatestPlan(req.params.userId as string);

    if (!plan) {
      res.status(404).json({ error: "No plan found" });
      return;
    }

    res.json(plan);
  }
);

export default router;
