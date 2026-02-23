import { Router, Response } from "express";
import { AuthRequest, authenticateToken } from "../middleware/auth";
import { getLatestPlan } from "../services/planService";

const router = Router();

router.get(
  "/v1/plan/latest",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const plan = await getLatestPlan(req.userId!);

    if (!plan) {
      res.status(404).json({ error: "No plan found" });
      return;
    }

    res.json(plan);
  }
);

export default router;
