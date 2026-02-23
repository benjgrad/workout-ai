import {
  cachePlan,
  getCachedPlan,
  getCachedPlanVersion,
  clearPlanCache,
} from "../src/storage/planCache";
import { PlanResponse } from "../src/types/plan";

// Mock AsyncStorage
const mockStorage: Record<string, string> = {};
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn((key: string, value: string) => {
    mockStorage[key] = value;
    return Promise.resolve();
  }),
  getItem: jest.fn((key: string) => Promise.resolve(mockStorage[key] || null)),
  removeItem: jest.fn((key: string) => {
    delete mockStorage[key];
    return Promise.resolve();
  }),
}));

beforeEach(() => {
  Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
});

const testPlan: PlanResponse = {
  planVersion: 1,
  generatedAt: "2026-02-21T15:00:00Z",
  workouts: [
    {
      workoutId: "w1",
      scheduledFor: "2026-02-23",
      title: "Easy Run",
      sportType: "RUN",
      steps: [
        {
          stepIndex: 0,
          type: "WARMUP",
          durationSec: 300,
          distanceMeters: null,
          target: {},
          note: "5 min easy jog",
        },
      ],
    },
  ],
  checksum: "sha256:abc123",
};

describe("Plan Cache", () => {
  it("caches and retrieves plan", async () => {
    await cachePlan(testPlan);
    const cached = await getCachedPlan();
    expect(cached).toEqual(testPlan);
  });

  it("returns cached plan version", async () => {
    await cachePlan(testPlan);
    const version = await getCachedPlanVersion();
    expect(version).toBe(1);
  });

  it("returns null when no cached plan", async () => {
    const cached = await getCachedPlan();
    expect(cached).toBeNull();
  });

  it("clears cache", async () => {
    await cachePlan(testPlan);
    await clearPlanCache();
    const cached = await getCachedPlan();
    expect(cached).toBeNull();
  });
});
