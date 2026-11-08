import { describe, it, expect, vi, beforeEach } from "vitest";
import { CodeforcesAdapter } from "../codeforcesAdapter";

describe("Codeforces Adapter", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("reports accurate platform capabilities", () => {
    const adapter = new CodeforcesAdapter();
    const caps = adapter.getCapabilities();
    expect(caps.supportsLiveSync).toBe(true);
    expect(caps.supportsRatingHistory).toBe(true);
    expect(caps.supportsSubmissionSync).toBe(true);
  });

  it("parses user profile from Codeforces public API", async () => {
    const adapter = new CodeforcesAdapter();
    const mockResponse = {
      status: "OK",
      result: [
        {
          handle: "tourist",
          rating: 3850,
          maxRating: 4009,
          rank: "legendary grandmaster",
          titlePhoto: "https://userpic.codeforces.org/tourist.jpg",
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const profile = await adapter.fetchProfile("tourist");
    expect(profile.handle).toBe("tourist");
    expect(profile.rating).toBe(3850);
    expect(profile.maxRating).toBe(4009);
    expect(profile.rankTitle).toBe("legendary grandmaster");
    expect(profile.profileUrl).toBe("https://codeforces.com/profile/tourist");
  });

  it("throws descriptive error when user is not found", async () => {
    const adapter = new CodeforcesAdapter();
    const mockResponse = {
      status: "FAILED",
      comment: "handles: User not found",
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    await expect(adapter.fetchProfile("nonexistent_user_xyz")).rejects.toThrow(
      "handles: User not found"
    );
  });
});
