import type {
  IPlatformAdapter,
  PlatformCapabilities,
  PlatformProfile,
  PlatformSubmissionItem,
} from "./types";

export class AtCoderAdapter implements IPlatformAdapter {
  platform = "AtCoder" as const;

  getCapabilities(): PlatformCapabilities {
    return {
      supportsLiveSync: true,
      supportsRatingHistory: false,
      supportsSubmissionSync: true,
      notes: "Uses AtCoder Problems API (Kenkoooo). Rate limited to 1 request per second.",
    };
  }

  async fetchProfile(handle: string): Promise<PlatformProfile> {
    // AtCoder does not have an official user profile JSON endpoint, so we verify handle via submission activity
    const res = await fetch(
      `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${encodeURIComponent(handle)}&from_second=0`
    );
    if (!res.ok) {
      throw new Error(`AtCoder API error: ${res.statusText}`);
    }
    const submissions = await res.json();

    return {
      handle,
      profileUrl: `https://atcoder.jp/users/${handle}`,
      rankTitle: submissions.length > 0 ? "Active Contestant" : "New User",
    };
  }

  async fetchSubmissions(handle: string, count = 20): Promise<PlatformSubmissionItem[]> {
    const res = await fetch(
      `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${encodeURIComponent(handle)}&from_second=0`
    );
    if (!res.ok) {
      throw new Error(`AtCoder API error: ${res.statusText}`);
    }
    const data = await res.json();

    return (data || []).slice(0, count).map((sub: any) => ({
      id: `atc-${sub.id}`,
      problemTitle: sub.problem_id,
      problemUrl: `https://atcoder.jp/contests/${sub.contest_id}/tasks/${sub.problem_id}`,
      verdict: sub.result,
      timestamp: new Date(sub.epoch_second * 1000).toISOString(),
    }));
  }
}
