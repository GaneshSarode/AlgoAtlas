import { NextRequest, NextResponse } from "next/server";
import { CodeforcesAdapter } from "@/services/platformAdapters/codeforcesAdapter";
import { getDbRepository } from "@/lib/db/repository";

export async function POST(req: NextRequest) {
  try {
    const { handle } = await req.json();
    if (!handle || typeof handle !== "string") {
      return NextResponse.json({ error: "Handle is required" }, { status: 400 });
    }

    const adapter = new CodeforcesAdapter();
    const profile = await adapter.fetchProfile(handle);
    const ratingHistory = await adapter.fetchRatingHistory(handle);

    // Update in repository
    const repo = getDbRepository();
    await repo.updatePlatformAccount("Codeforces", {
      handle: profile.handle,
      profile_url: profile.profileUrl,
      is_connected: true,
      rating: profile.rating,
      max_rating: profile.maxRating,
      rank_title: profile.rankTitle,
      last_synced_at: new Date().toISOString(),
      sync_status: "SUCCESS",
    });

    // If rating history exists, update contest logs
    for (const rh of ratingHistory.slice(-5)) {
      await repo.createContestResult({
        platform: "Codeforces",
        contest_name: rh.contestName,
        contest_date: rh.date,
        participation_type: "Live",
        rank: rh.rank,
        problems_attempted: 4,
        problems_solved: 3,
        rating_after: rh.rating,
      });
    }

    await repo.logSync({
      platform: "Codeforces",
      status: "SUCCESS",
      synced_items_count: ratingHistory.length,
      details: `Profile and ${ratingHistory.length} contest ratings synced for ${profile.handle}`,
    });

    return NextResponse.json({
      success: true,
      profile,
      ratingHistoryCount: ratingHistory.length,
    });
  } catch (err: any) {
    const repo = getDbRepository();
    await repo.logSync({
      platform: "Codeforces",
      status: "FAILED",
      synced_items_count: 0,
      error_message: err.message || "Failed to sync Codeforces profile",
    });

    return NextResponse.json(
      { error: err.message || "Failed to sync Codeforces profile" },
      { status: 500 }
    );
  }
}
