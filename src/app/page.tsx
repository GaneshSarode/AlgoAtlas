"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Code2,
  Plus,
  Compass,
  Repeat,
  Trophy,
  BrainCircuit,
  Map,
  Sparkles,
  BarChart3,
  Calendar,
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
    <div className="space-y-6 pb-12">
      {/* Hero Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#121422] via-[#15192b] to-[#121422] border border-[#21273b] p-6 rounded-2xl shadow-xl shadow-brand-950/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-400 font-mono px-2 py-0.5 rounded bg-brand-950 border border-brand-800">
              Personal DSA Learning OS
            </span>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Engine Online
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AlgoAtlas
          </h1>
          <p className="text-xs text-gray-300 max-w-xl">
            Don't just count solved problems. Measure actual learning, understanding, problem-solving ability, and long-term pattern mastery.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link
            href="/recommendations"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#181d2c] border border-[#2a344d] hover:border-brand-500/60 text-xs font-semibold text-gray-200 hover:text-white transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Next Steps</span>
          </Link>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-initial bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/30 flex items-center justify-center gap-1.5 text-xs py-2 px-4"
          >
            <Plus className="w-4 h-4" />
            <span>Add Problem</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
          Loading your learning metrics...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section A: Overall Statistics */}
          {stats && <OverallStats stats={stats} />}

          {/* Section D: Learning Intelligence Diagnostic Summary */}
          {learningSummary && (
            <LearningIntelligenceSummary summary={learningSummary} />
          )}

          {/* Section B: Platform Breakdown */}
          <PlatformBreakdown platformStats={platformStats} />

          {/* Section C: Daily Consistency Heatmap */}
          <Card className="border-[#1f2433] bg-[#12141e]">
            <CardContent className="p-5">
              <HeatmapCalendar activities={activities} />
            </CardContent>
          </Card>

          {/* Section E: 2-Column Grid (Pending Revisions & Recent Activity) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
