"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Flame,
  CheckCircle,
  Calendar,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  Terminal,
  FolderTree,
  RotateCw,
  Clock,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { getDbRepository } from "@/lib/db/repository";
import type { Problem, RevisionItem } from "@/types";

export default function ConceptBPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);

  useEffect(() => {
    async function load() {
      const repo = getDbRepository();
      repo.seedSampleWorkspaceData();
      const pr = await repo.getProblems();
      const rv = await repo.getRevisionItems();
      setProblems(pr);
      setRevisions(rv);
    }
    load();
  }, []);

  const overdue = revisions.filter((r) => r.is_overdue);

  return (
    <div className="space-y-4 pb-12 font-sans">
      {/* Concept Switcher Banner */}
      <div className="p-2.5 px-3 rounded-lg bg-surface-raised border border-border-default flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-cyan-400 font-semibold uppercase tracking-wider text-[11px]">
            Concept Preview B
          </span>
          <span className="text-neutral-400">•</span>
          <span className="text-foreground font-medium">The Competitive Arena (Codeforces & LeetCode HUD)</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard-preview/concept-a" className="text-neutral-400 hover:text-foreground">
            ← View Concept A
          </Link>
          <span className="text-neutral-600">|</span>
          <Link href="/dashboard-preview/concept-c" className="text-neutral-400 hover:text-foreground">
            View Concept C →
          </Link>
        </div>
      </div>

      {/* Top Competitive Performance HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Codeforces Rating */}
        <div className="p-3.5 rounded-xl bg-surface-base border border-border-default flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-neutral-400 block uppercase tracking-wider">
              Codeforces Rating
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold font-mono text-cyan-400">1715</span>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +75
              </span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">tourist • Specialist</span>
          </div>
          <Trophy className="w-6 h-6 text-cyan-500/30" />
        </div>

        {/* LeetCode Contest Rating */}
        <div className="p-3.5 rounded-xl bg-surface-base border border-border-default flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-neutral-400 block uppercase tracking-wider">
              LeetCode Rating
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold font-mono text-amber-400">1945</span>
              <span className="text-[10px] font-mono text-neutral-400">Top 4.2%</span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">Knight Tier • 18 contests</span>
          </div>
          <Flame className="w-6 h-6 text-amber-500/30" />
        </div>

        {/* Total Solved Across Platforms */}
        <div className="p-3.5 rounded-xl bg-surface-base border border-border-default flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-neutral-400 block uppercase tracking-wider">
              Total Questions Logged
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold font-mono text-foreground">{problems.length + 180}</span>
              <span className="text-[10px] text-neutral-400">problems</span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">LC: 184 • CF: 72 • AC: 24</span>
          </div>
          <Terminal className="w-6 h-6 text-neutral-500/30" />
        </div>

        {/* Active Practice Streak */}
        <div className="p-3.5 rounded-xl bg-surface-base border border-border-default flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-neutral-400 block uppercase tracking-wider">
              Learning Habit
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold font-mono text-emerald-400">14 Days</span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">Daily target: 2h active</span>
          </div>
          <CheckCircle className="w-6 h-6 text-emerald-500/30" />
        </div>
      </div>

      {/* 3-Column Technical Grid (28% Left / 44% Center / 28% Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* COLUMN 1: Structured Roadmap Tree (28% - 3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="p-3.5 rounded-xl bg-surface-base border border-border-default space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-border-subtle">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5 text-accent" />
                NeetCode 150 Tree
              </span>
              <span className="text-[10px] font-mono text-neutral-400">18/150</span>
            </div>

            <div className="space-y-2 text-xs">
              {/* Category 1 */}
              <div className="p-2 rounded-lg bg-surface-raised border border-border-subtle">
                <div className="flex justify-between items-center text-[11px] font-medium text-foreground mb-1">
                  <span>1. Arrays & Hashing</span>
                  <span className="text-emerald-400 font-mono">5/5 (100%)</span>
                </div>
                <div className="w-full h-1 bg-surface-base rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full" />
                </div>
              </div>

              {/* Category 2 (Active) */}
              <div className="p-2 rounded-lg bg-accent-muted border border-accent-border">
                <div className="flex justify-between items-center text-[11px] font-medium text-foreground mb-1">
                  <span className="text-accent font-semibold">2. Two Pointers</span>
                  <span className="text-accent font-mono">3/5 (60%)</span>
                </div>
                <div className="w-full h-1 bg-surface-base rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-accent w-3/5" />
                </div>

                <div className="space-y-1 pl-1 text-[11px]">
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <span className="text-emerald-400">✓</span>
                    <span>Valid Palindrome</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <span className="text-emerald-400">✓</span>
                    <span>Two Sum II</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <span className="text-emerald-400">✓</span>
                    <span>3Sum</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-foreground font-semibold">
                    <span className="text-amber-400 font-bold">→</span>
                    <span>Trapping Rain Water</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-500">
                    <span>○</span>
                    <span>Container With Most Water</span>
                  </div>
                </div>
              </div>

              {/* Category 3 */}
              <div className="p-2 rounded-lg bg-surface-raised border border-border-subtle">
                <div className="flex justify-between items-center text-[11px] font-medium text-foreground mb-1">
                  <span>3. Sliding Window</span>
                  <span className="text-neutral-400 font-mono">1/4 (25%)</span>
                </div>
                <div className="w-full h-1 bg-surface-base rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-1/4" />
                </div>
              </div>

              {/* Category 4 */}
              <div className="p-2 rounded-lg bg-surface-raised border border-border-subtle">
                <div className="flex justify-between items-center text-[11px] font-medium text-foreground mb-1">
                  <span>4. Binary Search</span>
                  <span className="text-neutral-400 font-mono">1/4 (25%)</span>
                </div>
                <div className="w-full h-1 bg-surface-base rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-1/4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Daily Arena & Practice Feed (44% - 6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Daily Deliberate Targets */}
          <div className="p-4 rounded-xl bg-surface-base border border-border-default space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Today's Deliberate Practice Checklist</span>
              <span className="text-[11px] font-mono text-emerald-400">2 of 3 Done</span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-raised border border-border-subtle cursor-pointer text-neutral-400 line-through">
                <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
                <span>1. Warmup: Valid Anagram (String frequency array)</span>
                <span className="ml-auto font-mono text-[10px] text-neutral-500">15m</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-raised border border-border-subtle cursor-pointer text-neutral-400 line-through">
                <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
                <span>2. Core Solve: Two Sum II - Input Array Is Sorted</span>
                <span className="ml-auto font-mono text-[10px] text-neutral-500">25m</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-accent-muted border border-accent-border cursor-pointer text-foreground font-medium">
                <input type="checkbox" className="rounded accent-accent" />
                <span>3. Challenge Target: Trapping Rain Water (Two Pointers)</span>
                <span className="ml-auto font-mono text-[10px] text-rose-400">Overdue</span>
              </label>
            </div>
          </div>

          {/* Activity Matrix */}
          <div className="p-4 rounded-xl bg-surface-base border border-border-default space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground">Daily Practice Consistency</span>
              <span className="text-[11px] font-mono text-neutral-400">Past 120 Days</span>
            </div>

            <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto py-1">
              {Array.from({ length: 112 }).map((_, i) => {
                const active = i % 5 !== 0;
                const level = (i % 4) + 1;
                return (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-sm ${
                      !active
                        ? "bg-surface-raised border border-border-subtle"
                        : level === 1
                        ? "bg-emerald-950 border border-emerald-900"
                        : level === 2
                        ? "bg-emerald-800"
                        : level === 3
                        ? "bg-emerald-600"
                        : "bg-emerald-400"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Terminal-style Recent Submissions */}
          <div className="rounded-xl bg-surface-base border border-border-default overflow-hidden">
            <div className="p-3 px-4 border-b border-border-subtle flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-neutral-400" />
                Submissions Feed
              </span>
              <span className="text-[10px] font-mono text-neutral-500">Live Telemetry</span>
            </div>

            <div className="divide-y divide-border-subtle text-xs font-mono">
              <div className="p-2.5 px-4 flex items-center justify-between hover:bg-surface-raised">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">AC</span>
                  <span className="text-foreground">Two Sum II</span>
                  <span className="text-[10px] text-neutral-500">C++20</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400 text-[11px]">
                  <span>4ms</span>
                  <span>14.2MB</span>
                  <span>2h ago</span>
                </div>
              </div>

              <div className="p-2.5 px-4 flex items-center justify-between hover:bg-surface-raised">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">AC</span>
                  <span className="text-foreground">Valid Anagram</span>
                  <span className="text-[10px] text-neutral-500">C++20</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400 text-[11px]">
                  <span>7ms</span>
                  <span>8.1MB</span>
                  <span>4h ago</span>
                </div>
              </div>

              <div className="p-2.5 px-4 flex items-center justify-between hover:bg-surface-raised">
                <div className="flex items-center gap-2">
                  <span className="text-rose-400 font-bold">TLE</span>
                  <span className="text-foreground">3Sum (Brute Force)</span>
                  <span className="text-[10px] text-neutral-500">C++20</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400 text-[11px]">
                  <span>&gt;2000ms</span>
                  <span>Case 42</span>
                  <span>1d ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Revision & Contest Horizon (28% - 3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          {/* Spaced Recall Inbox */}
          <div className="p-3.5 rounded-xl bg-surface-base border border-border-default space-y-2.5">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-border-subtle">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-rose-400" />
                Spaced Recall Inbox
              </span>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30">
                {overdue.length} Overdue
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-rose-500/[0.05] border border-rose-500/20">
                <span className="font-semibold text-foreground block">Trapping Rain Water</span>
                <span className="text-[10px] text-rose-400 font-mono flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> Overdue by 2 days
                </span>
                <Link href="/revision/practice" className="mt-2 block">
                  <Button size="sm" variant="danger" className="w-full text-xs h-6">
                    Solve Recall
                  </Button>
                </Link>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-raised border border-border-subtle">
                <span className="font-semibold text-foreground block">3Sum</span>
                <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> Due in 6 hours
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Contest Horizon */}
          <div className="p-3.5 rounded-xl bg-surface-base border border-border-default space-y-2.5">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-border-subtle">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Contest Horizon
              </span>
              <Link href="/contests" className="text-[10px] text-accent hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-surface-raised border border-border-subtle">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-foreground block">Codeforces Round 985</span>
                    <span className="text-[10px] text-cyan-400 font-mono">Div. 2 • Rated</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">In 2d 4h</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-raised border border-border-subtle">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-foreground block">LeetCode Weekly 420</span>
                    <span className="text-[10px] text-amber-400 font-mono">Rank 500 Target</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">In 3d 12h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
