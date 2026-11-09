"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Compass,
} from "lucide-react";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { OverallStats } from "@/components/dashboard/OverallStats";
import { PlatformBreakdown } from "@/components/dashboard/PlatformBreakdown";
import { LearningIntelligenceSummary } from "@/components/dashboard/LearningIntelligenceSummary";
import { UpcomingRevisionsWidget } from "@/components/dashboard/UpcomingRevisionsWidget";
import { RecentActivityWidget } from "@/components/dashboard/RecentActivityWidget";
import { HeatmapCalendar } from "@/components/analytics/HeatmapCalendar";
import { AddProblemModal } from "@/components/problems/AddProblemModal";
import { getDbRepository } from "@/lib/db/repository";
import type {
  OverallStats as IOverallStats,
  PlatformStat,
  LearningIntelligenceSummary as ILearningSummary,
  RevisionItem,
  Problem,
  UserActivity,
} from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<IOverallStats | null>(null);
  const [platformStats, setPlatformStats] = useState<PlatformStat[]>([]);
  const [learningSummary, setLearningSummary] = useState<ILearningSummary | null>(null);
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [recentProblems, setRecentProblems] = useState<Problem[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    setIsLoading(true);
    const repo = getDbRepository();
    const st = await repo.getOverallStats();
    const ps = await repo.getPlatformStats();
    const ls = await repo.getLearningIntelligenceSummary();
    const revs = await repo.getRevisionItems();
    const probs = await repo.getProblems();
    const acts = await repo.getUserActivity();

    setStats(st);
    setPlatformStats(ps);
    setLearningSummary(ls);
    setRevisions(revs);
    setRecentProblems(probs);
    setActivities(acts);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-5 pb-10">
      {/* Executive Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#141414] border border-[#232323] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-medium text-neutral-400 tracking-wider uppercase px-2 py-0.5 rounded bg-neutral-900 border border-[#262626]">
              Personal DSA Learning OS
            </span>
            <span className="text-[11px] text-emerald-400 font-mono font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              Continuous Telemetry
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
            AlgoAtlas Overview
          </h1>
          <p className="text-xs text-neutral-400 max-w-xl font-sans">
            Measuring genuine problem-solving understanding, algorithmic patterns, and long-term retention.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href="/recommendations"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-[#262626] hover:border-neutral-700 text-xs font-medium text-neutral-200 hover:text-white transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
          >
            <Compass className="w-3.5 h-3.5 text-neutral-400" />
            <span>Next Steps</span>
          </Link>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-initial bg-white hover:bg-neutral-200 text-neutral-950 font-semibold shadow-sm flex items-center justify-center gap-1.5 text-xs py-1.5 px-3.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Problem</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center text-xs text-neutral-500 font-mono">
          Loading learning telemetry...
        </div>
      ) : (
        <div className="space-y-4">
          {/* Section A: Overall Statistics */}
          {stats && <OverallStats stats={stats} />}

          {/* Section D: Learning Intelligence Diagnostic Summary */}
          {learningSummary && (
            <LearningIntelligenceSummary summary={learningSummary} />
          )}

          {/* Section B: Platform Breakdown */}
          <PlatformBreakdown platformStats={platformStats} />

          {/* Section C: Daily Consistency Heatmap */}
          <Card className="border border-[#232323] bg-[#141414]">
            <CardContent className="p-4 sm:p-5">
              <HeatmapCalendar activities={activities} />
            </CardContent>
          </Card>

          {/* Section E: 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <UpcomingRevisionsWidget revisions={revisions} />
            <RecentActivityWidget problems={recentProblems} />
          </div>
        </div>
      )}

      {/* Add Problem Modal */}
      <AddProblemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProblemAdded={loadDashboardData}
      />
    </div>
  );
}
