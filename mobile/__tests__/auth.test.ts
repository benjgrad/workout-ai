import { login, loadStoredToken, logout } from "../src/api/auth";
import { getAuthToken } from "../src/api/client";

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

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
  Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
});

describe("Auth", () => {
  it("login stores token and userId", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "jwt-123", userId: "user-1" }),
    });

    const result = await login("test@test.com", "password");

    expect(result.token).toBe("jwt-123");
    expect(result.userId).toBe("user-1");
    expect(mockStorage["auth_token"]).toBe("jwt-123");
    expect(mockStorage["user_id"]).toBe("user-1");
    expect(getAuthToken()).toBe("jwt-123");
  });

  it("loadStoredToken returns true when token exists", async () => {
    mockStorage["auth_token"] = "stored-token";
    const result = await loadStoredToken();
    expect(result).toBe(true);
    expect(getAuthToken()).toBe("stored-token");
  });

  it("loadStoredToken returns false when no token", async () => {
    const result = await loadStoredToken();
    expect(result).toBe(false);
  });

  it("logout clears token", async () => {
    mockStorage["auth_token"] = "token";
    mockStorage["user_id"] = "user";
    await logout();
    expect(mockStorage["auth_token"]).toBeUndefined();
    expect(mockStorage["user_id"]).toBeUndefined();
    expect(getAuthToken()).toBeNull();
  });
});
