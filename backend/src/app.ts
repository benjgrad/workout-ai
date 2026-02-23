import express from "express";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import planRouter from "./routes/plan";
import watchPlanRouter from "./routes/watchPlan";

const app = express();

app.use(express.json());
app.use(healthRouter);
app.use(authRouter);
app.use(planRouter);
app.use(watchPlanRouter);

export default app;
