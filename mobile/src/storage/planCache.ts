import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlanResponse } from "../types/plan";

const PLAN_CACHE_KEY = "cached_plan";
const PLAN_VERSION_KEY = "cached_plan_version";

export async function cachePlan(plan: PlanResponse): Promise<void> {
  await AsyncStorage.setItem(PLAN_CACHE_KEY, JSON.stringify(plan));
  await AsyncStorage.setItem(
    PLAN_VERSION_KEY,
    String(plan.planVersion)
  );
}

export async function getCachedPlan(): Promise<PlanResponse | null> {
  const data = await AsyncStorage.getItem(PLAN_CACHE_KEY);
  if (!data) return null;
  return JSON.parse(data);
}

export async function getCachedPlanVersion(): Promise<number | null> {
  const version = await AsyncStorage.getItem(PLAN_VERSION_KEY);
  if (!version) return null;
  return parseInt(version, 10);
}

export async function clearPlanCache(): Promise<void> {
  await AsyncStorage.removeItem(PLAN_CACHE_KEY);
  await AsyncStorage.removeItem(PLAN_VERSION_KEY);
}
