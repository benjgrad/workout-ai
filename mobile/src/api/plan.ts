import { apiRequest } from "./client";
import { PlanResponse } from "../types/plan";

export async function fetchLatestPlan(): Promise<PlanResponse> {
  return apiRequest<PlanResponse>("/v1/plan/latest");
}
