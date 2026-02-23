import { setAuthToken, getAuthToken, apiRequest } from "../src/api/client";

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
  setAuthToken(null);
});

describe("API Client", () => {
  it("sets and gets auth token", () => {
    expect(getAuthToken()).toBeNull();
    setAuthToken("test-token");
    expect(getAuthToken()).toBe("test-token");
  });

  it("makes GET request with auth header when token is set", async () => {
    setAuthToken("my-jwt");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: "test" }),
    });

    const result = await apiRequest("/v1/test");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/v1/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer my-jwt",
        }),
      })
    );
    expect(result).toEqual({ data: "test" });
  });

  it("makes request without auth header when no token", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: "test" }),
    });

    await apiRequest("/v1/test");

    const headers = mockFetch.mock.calls[0][1].headers;
    expect(headers.Authorization).toBeUndefined();
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "Unauthorized" }),
    });

    await expect(apiRequest("/v1/test")).rejects.toThrow("Unauthorized");
  });
});
