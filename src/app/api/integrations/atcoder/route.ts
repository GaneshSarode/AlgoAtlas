import { NextRequest, NextResponse } from "next/server";
import { AtCoderAdapter } from "@/services/platformAdapters/atcoderAdapter";
import { getDbRepository } from "@/lib/db/repository";

export async function POST(req: NextRequest) {
  try {
    const { handle } = await req.json();
    if (!handle || typeof handle !== "string") {
      return NextResponse.json({ error: "Handle is required" }, { status: 400 });
    }

    const adapter = new AtCoderAdapter();
    const profile = await adapter.fetchProfile(handle);
    const submissions = await adapter.fetchSubmissions(handle, 20);

    const repo = getDbRepository();
    await repo.updatePlatformAccount("AtCoder", {
      handle: profile.handle,
      profile_url: profile.profileUrl,
      is_connected: true,
      last_synced_at: new Date().toISOString(),
      sync_status: "SUCCESS",
    });

    await repo.logSync({
      platform: "AtCoder",
      status: "SUCCESS",
      synced_items_count: submissions.length,
      details: `Profile and ${submissions.length} submissions synced for ${profile.handle}`,
    });

    return NextResponse.json({
      success: true,
      profile,
      submissionsCount: submissions.length,
    });
  } catch (err: any) {
    const repo = getDbRepository();
    await repo.logSync({
      platform: "AtCoder",
      status: "FAILED",
      synced_items_count: 0,
      error_message: err.message || "Failed to sync AtCoder submissions",
    });

    return NextResponse.json(
      { error: err.message || "Failed to sync AtCoder data" },
      { status: 500 }
    );
  }
}
