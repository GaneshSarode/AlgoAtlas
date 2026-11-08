import type {
  IPlatformAdapter,
  PlatformCapabilities,
  PlatformProfile,
  PlatformRatingHistoryPoint,
  PlatformSubmissionItem,
} from "./types";

export class CodeforcesAdapter implements IPlatformAdapter {
  platform = "Codeforces" as const;

  getCapabilities(): PlatformCapabilities {
    return {
      supportsLiveSync: true,
      supportsRatingHistory: true,
      supportsSubmissionSync: true,
      notes: "Official public API without authentication requirement. Rate limited to 1 req / 2s.",
    };
  }

  async fetchProfile(handle: string): Promise<PlatformProfile> {
    const res = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`);
    const data = await res.json();

    if (data.status !== "OK") {
      throw new Error(data.comment || "Failed to fetch Codeforces profile");
    }

    const user = data.result[0];
    return {
      handle: user.handle,
      rating: user.rating,
      maxRating: user.maxRating,
      rankTitle: user.rank,
      profileUrl: `https://codeforces.com/profile/${user.handle}`,
      avatarUrl: user.titlePhoto,
    };
  }

  async fetchRatingHistory(handle: string): Promise<PlatformRatingHistoryPoint[]> {
    const res = await fetch(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(handle)}`);
    const data = await res.json();

    if (data.status !== "OK") {
      throw new Error(data.comment || "Failed to fetch Codeforces rating history");
    }

    return (data.result || []).map((r: any) => ({
      contestName: r.contestName,
      rating: r.newRating,
      rank: r.rank,
      date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().split("T")[0],
    }));
  }

  async fetchSubmissions(handle: string, count = 20): Promise<PlatformSubmissionItem[]> {
    const res = await fetch(
      `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=${count}`
    );
    const data = await res.json();

    if (data.status !== "OK") {
      throw new Error(data.comment || "Failed to fetch Codeforces submissions");
    }

    return (data.result || []).map((sub: any) => {
      const prob = sub.problem || {};
      const contestId = prob.contestId || "";
      const index = prob.index || "";
      return {
        id: `cf-${sub.id}`,
        problemTitle: prob.name || `${contestId}${index}`,
        problemUrl: `https://codeforces.com/contest/${contestId}/problem/${index}`,
        verdict: sub.verdict,
        timestamp: new Date(sub.creationTimeSeconds * 1000).toISOString(),
      };
    });
  }
}
