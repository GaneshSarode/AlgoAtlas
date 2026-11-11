"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  ArrowRight,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Code2,
  Plus,
  BookOpen,
  Trophy,
  Calendar,
  Terminal,
  AlertOctagon,
  Eye,
  EyeOff,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { AddProblemModal } from "@/components/problems/AddProblemModal";
import { getDbRepository } from "@/lib/db/repository";
import type { Problem, RevisionItem, OverallStats, PlatformStat } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [platformStats, setPlatformStats] = useState<PlatformStat[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [flashcardRevealed, setFlashcardRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const repo = getDbRepository();
    repo.seedSampleWorkspaceData();
    const st = await repo.getOverallStats();
    const ps = await repo.getPlatformStats();
    const pr = await repo.getProblems();
    const rv = await repo.getRevisionItems();
    setStats(st);
    setPlatformStats(ps);
    setProblems(pr);
    setRevisions(rv);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const overdueRevisions = revisions.filter((r) => r.is_overdue);
  const dueTodayRevisions = revisions.filter(
    (r) => !r.is_overdue && r.scheduled_for <= new Date().toISOString().split("T")[0]
  );

  // Heatmap generation: 16 weeks x 7 days
  const weeks = Array.from({ length: 16 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const val = (w * 7 + d) % 5 === 0 ? 0 : ((w + d) % 4) + 1;
      return val;
    })
  );

  // Telemetry map correlated to recent problems for Concept B 20% element
  const telemetryBySlug: Record<
    string,
    { verdict: "AC" | "TLE" | "WA"; runtime: string; memory: string; lang: string; timeAgo: string }
  > = {
    "two-sum": { verdict: "AC", runtime: "4ms", memory: "10.4MB", lang: "C++20", timeAgo: "1h ago" },
    "valid-anagram": { verdict: "AC", runtime: "7ms", memory: "8.1MB", lang: "C++20", timeAgo: "3h ago" },
    "group-anagrams": { verdict: "AC", runtime: "28ms", memory: "19.5MB", lang: "C++20", timeAgo: "1d ago" },
    "two-sum-ii-input-array-is-sorted": { verdict: "AC", runtime: "6ms", memory: "14.2MB", lang: "C++20", timeAgo: "2d ago" },
    "3sum": { verdict: "AC", runtime: "64ms", memory: "22.8MB", lang: "C++20", timeAgo: "2d ago" },
    "container-with-most-water": { verdict: "AC", runtime: "48ms", memory: "59.1MB", lang: "C++20", timeAgo: "3d ago" },
    "trapping-rain-water": { verdict: "AC", runtime: "8ms", memory: "20.1MB", lang: "C++20", timeAgo: "4d ago" },
  };

  return (
    <div className="space-y-4 pb-12 font-sans">
      {/* Hidden SEO heading for semantic structure & accessibility */}
      <h1 className="sr-only">AlgoAtlas Developer Workspace</h1>

      {/* Top Command Status Strip (70% Concept A Cockpit + 20% Concept B subtle CP rating pill) */}
      <div className="p-3.5 px-4 rounded-xl bg-surface-base border border-border-default shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        {/* Active Focus Pill */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-muted border border-accent-border flex items-center justify-center text-accent shrink-0">
            <Code2 className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">AlgoAtlas Cockpit</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-raised border border-border-subtle text-neutral-400">
                Personal DSA Learning OS
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-raised border border-border-subtle text-neutral-400">
                NeetCode 150
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Active Focus: <strong className="text-foreground font-medium">Two Pointers & Monotonic Stack</strong>
            </p>
          </div>
        </div>

        {/* Middle Daily Practice Progress Target */}
        <div className="flex items-center gap-3 border-y xl:border-y-0 xl:border-x border-border-subtle py-2 xl:py-0 xl:px-5">
          <div className="text-left">
            <span className="text-[10px] font-mono text-neutral-400 block uppercase tracking-wider">
              Today's Practice Target
            </span>
            <span className="text-xs font-semibold text-foreground">
              3 of 4 Solved <span className="text-emerald-400 text-[11px] font-mono font-normal">(75%)</span>
            </span>
          </div>
          <div className="w-24 h-2 bg-surface-raised rounded-full overflow-hidden border border-border-subtle">
            <div className="h-full bg-emerald-500 rounded-full w-3/4" />
          </div>
        </div>

        {/* Right HUD: Streak + Restrained CP Rating Pill (Concept B) + Action */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Daily Streak */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-raised border border-border-default text-xs font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-amber-400">{stats?.current_streak || 14}d</span>
            <span className="text-neutral-500 text-[11px]">streak</span>
          </div>

          {/* Restrained Codeforces & LeetCode Rating Pill (Concept B 20%) */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-raised border border-border-default text-xs font-mono">
            <Trophy className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-neutral-400 text-[11px]">CF</span>
            <span className="font-semibold text-foreground">1715</span>
            <span className="text-emerald-400 text-[10px] flex items-center">
              <TrendingUp className="w-2.5 h-2.5 mr-0.5" />+75
            </span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400 text-[11px]">LC</span>
            <span className="font-semibold text-foreground">1945</span>
          </div>

          {/* Add Problem Modal Trigger */}
          <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="gap-1 text-xs">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Problem</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center text-xs text-neutral-500 font-mono">
          Loading learning telemetry...
        </div>
      ) : (
        /* Asymmetric 62% / 38% Grid Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT COLUMN (62% - lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* 1. Active Roadmap Milestone Target (Hero - Concept A) */}
            <div className="p-4 rounded-xl bg-surface-base border border-border-default relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
                      Current Roadmap Target
                    </span>
                    <Badge variant="danger" dot>Hard</Badge>
                    <span className="text-[10px] font-mono text-neutral-400">LeetCode #42</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mt-1 flex items-center gap-2">
                    Trapping Rain Water
                    <a
                      href="https://leetcode.com/problems/trapping-rain-water/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-neutral-500 hover:text-foreground"
                      title="Open on LeetCode"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Key Observation: Water trapped above bar <code className="text-accent font-mono text-[11px]">i</code> is strictly bounded by <code className="text-accent font-mono text-[11px]">min(max_left, max_right) - height[i]</code>. Solvable in <code className="font-mono text-neutral-300">O(1)</code> space using converging Two Pointers.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <Link href="/problems/prob-trapping-rain-water">
                    <Button size="sm" variant="secondary" className="gap-1 text-xs w-full">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Journal</span>
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="mt-3.5 pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                <span className="text-neutral-400 text-[11px]">
                  Roadmap: <strong>NeetCode 150</strong> › Two Pointers (Problem 4 of 5)
                </span>
                <span className="text-rose-400 text-[11px] font-mono flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3 h-3" /> Scheduled for spaced recall today
                </span>
              </div>
            </div>

            {/* 2. Coding Activity Heatmap (Concept A) */}
            <div className="p-4 rounded-xl bg-surface-base border border-border-default">
              <div className="flex items-center justify-between mb-3 text-xs">
                <div>
                  <span className="font-semibold text-foreground">Daily Problem-Solving Consistency</span>
                  <span className="text-neutral-400 text-[11px] ml-2">Last 16 weeks</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
                  <span>Less</span>
                  <span className="w-2.5 h-2.5 rounded-sm bg-surface-raised border border-border-subtle" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-950 border border-emerald-900" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-800" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                  <span>More</span>
                </div>
              </div>

              {/* Matrix */}
              <div className="flex gap-1 overflow-x-auto pb-1">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1">
                    {week.map((level, dIdx) => (
                      <div
                        key={dIdx}
                        className={`w-3 h-3 rounded-sm border transition-colors ${
                          level === 0
                            ? "bg-surface-raised border-border-subtle"
                            : level === 1
                            ? "bg-emerald-950 border-emerald-900"
                            : level === 2
                            ? "bg-emerald-800 border-emerald-700"
                            : level === 3
                            ? "bg-emerald-600 border-emerald-500"
                            : "bg-emerald-400 border-emerald-300"
                        }`}
                        title={`Week ${wIdx + 1}, Day ${dIdx + 1}: ${level} solves`}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Solved breakdown tally */}
              <div className="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">
                  Total Solved: <strong className="text-foreground">{stats?.total_problems || 10}</strong>
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400">14 Easy</span>
                  <span className="text-amber-400">8 Med</span>
                  <span className="text-rose-400">3 Hard</span>
                </div>
              </div>
            </div>

            {/* 3. Compact Recent Problem History + Concept B Submission Telemetry */}
            <div className="rounded-xl bg-surface-base border border-border-default overflow-hidden">
              <div className="p-3 px-4 border-b border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-xs font-semibold text-foreground">Recent Problem History & Telemetry</span>
                </div>
                <Link href="/problems" className="text-[11px] text-accent hover:underline flex items-center gap-1">
                  View all ({problems.length}) <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="divide-y divide-border-subtle text-xs">
                {problems.slice(0, 6).map((p) => {
                  const telem = telemetryBySlug[p.slug] || {
                    verdict: "AC",
                    runtime: "12ms",
                    memory: "16.4MB",
                    lang: "C++20",
                    timeAgo: "2d ago",
                  };

                  return (
                    <div
                      key={p.id}
                      className="p-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-surface-raised transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Concept B Telemetry Badge */}
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                          {telem.verdict}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 bg-surface-raised px-1.5 py-0.5 rounded border border-border-subtle shrink-0">
                          {p.platform === "LeetCode" ? "LC" : p.platform === "Codeforces" ? "CF" : p.platform}
                        </span>
                        <Link
                          href={`/problems/${p.id}`}
                          className="font-medium text-foreground hover:text-accent truncate"
                        >
                          {p.title}
                        </Link>
                        <span className="text-[11px] text-neutral-400 hidden md:inline">• {p.primary_topic}</span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-neutral-400 text-[11px] font-mono">
                        <Badge
                          dot
                          variant={
                            p.difficulty === "Easy"
                              ? "success"
                              : p.difficulty === "Medium"
                              ? "warning"
                              : "danger"
                          }
                        >
                          {p.difficulty}
                        </Badge>
                        <span className="hidden sm:inline text-neutral-500">{telem.lang}</span>
                        <span className="hidden sm:inline">{telem.runtime}</span>
                        <span className="text-amber-400 text-[11px] hidden lg:inline">
                          {"★".repeat(p.confidence_rating)}
                        </span>
                        <span className="text-neutral-500">{telem.timeAgo}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Bottom Balanced Grid: Next Deliberate Practice + Gotchas & Traps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Deliberate Practice Recommendation (Concept A) */}
              <div className="p-3.5 rounded-xl bg-surface-base border border-border-default flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-accent pb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Your Learning Intelligence</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Hints were frequently referenced on <strong>Two Pointers</strong>. Solve <strong>Container With Most Water</strong> next to reinforce boundary calculations.
                  </p>
                </div>
                <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500 font-mono">3/5 avg confidence</span>
                  <Link href="/recommendations" className="text-accent hover:underline flex items-center gap-1">
                    Full Plan <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Mistakes & Gotchas Callout (Concept C 10%) */}
              <div className="p-3.5 rounded-xl bg-surface-base border border-border-default space-y-2">
                <div className="flex items-center justify-between text-xs pb-1 border-b border-border-subtle">
                  <span className="font-semibold text-foreground flex items-center gap-1.5 text-rose-400">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    Active Gotchas & Traps
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">Retrospective</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="p-1.5 rounded-lg bg-rose-500/[0.04] border border-rose-500/20 text-neutral-300">
                    <span className="font-semibold text-foreground block text-[11px]">
                      BS Midpoint Overflow
                    </span>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      Use <code className="text-emerald-400 font-mono">mid = l + (r - l) / 2</code> to prevent 32-bit signed overflow.
                    </p>
                  </div>
                  <div className="p-1.5 rounded-lg bg-amber-500/[0.04] border border-amber-500/20 text-neutral-300">
                    <span className="font-semibold text-foreground block text-[11px]">
                      3Sum Duplicate Skipping
                    </span>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      Remember outer check <code className="text-amber-400 font-mono">if (i &gt; 0 &amp;&amp; nums[i] == nums[i-1]) continue;</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (38% - lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. Revision Inbox (Concept A) */}
            <div className="rounded-xl bg-surface-base border border-border-default overflow-hidden">
              <div className="p-3.5 px-4 border-b border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-semibold text-foreground">Revision Inbox</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    {overdueRevisions.length + dueTodayRevisions.length} due
                  </span>
                </div>
                <Link href="/revision">
                  <Button size="sm" variant="ghost" className="h-6 text-[11px] px-2 text-accent">
                    Full Queue →
                  </Button>
                </Link>
              </div>

              <div className="p-3 space-y-2">
                {overdueRevisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-2.5 rounded-lg bg-rose-500/[0.04] border border-rose-500/20 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-medium text-foreground block">{rev.problem_title}</span>
                      <span className="text-[10px] text-rose-400 font-mono flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> Overdue 2 days • Interval {rev.interval_stage}d
                      </span>
                    </div>
                    <Link href="/revision/practice">
                      <Button size="sm" variant="danger" className="h-6 text-[11px] px-2">
                        Revise
                      </Button>
                    </Link>
                  </div>
                ))}

                {dueTodayRevisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-2.5 rounded-lg bg-amber-500/[0.04] border border-amber-500/20 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-medium text-foreground block">{rev.problem_title}</span>
                      <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> Due today • Interval {rev.interval_stage}d
                      </span>
                    </div>
                    <Link href="/revision/practice">
                      <Button size="sm" variant="outline" className="h-6 text-[11px] px-2">
                        Review
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Active Recall Flashcard Challenge (Concept C 10%) */}
            <div className="p-3.5 rounded-xl bg-surface-base border border-border-default space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-border-subtle">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-foreground">Active Recall Challenge</span>
                </div>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                  Spaced Interval: 3d
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    3Sum (LeetCode #15)
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">Two Pointers</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Find all unique triplets <code className="text-accent font-mono text-[11px]">[a, b, c]</code> summing to 0 without duplicates in sorted search space.
                </p>
              </div>

              {/* Blur-reveal optimal approach */}
              <div className="p-2.5 rounded-lg bg-surface-raised border border-border-subtle space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                    Optimal Intuition & Gotcha
                  </span>
                  <button
                    onClick={() => setFlashcardRevealed(!flashcardRevealed)}
                    className="text-accent hover:underline flex items-center gap-1 text-[11px]"
                  >
                    {flashcardRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{flashcardRevealed ? "Hide" : "Reveal Answer"}</span>
                  </button>
                </div>

                <div className={flashcardRevealed ? "" : "filter blur-sm select-none"}>
                  <p className="text-[11px] text-neutral-200 font-mono leading-relaxed">
                    1. Sort O(N log N). Outer loop i: if nums[i] == nums[i-1], skip.<br />
                    2. Two pointers (l = i+1, r = n-1) checking sum == -nums[i].<br />
                    Complexity: O(N²) Time • O(1) Extra Space.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-0.5">
                <Button size="sm" variant="outline" className="flex-1 text-xs h-7">
                  Need Hints
                </Button>
                <Button size="sm" variant="success" className="flex-1 text-xs h-7">
                  Recalled Cleanly
                </Button>
              </div>
            </div>

            {/* 3. Topic Mastery & Weak Areas (Concept A) */}
            <div className="p-4 rounded-xl bg-surface-base border border-border-default space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Topic Mastery & Weak Areas</span>
                <span className="text-[11px] text-neutral-400">Continuous Assessment</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-foreground font-medium">Arrays & Hashing</span>
                    <span className="text-emerald-400 font-mono">92% (Strong)</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-raised rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[92%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-foreground font-medium">Two Pointers</span>
                    <span className="text-amber-400 font-mono">60% (Practising)</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-raised rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[60%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-foreground font-medium">Dynamic Programming</span>
                    <span className="text-rose-400 font-mono">35% (Weak Area)</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-raised rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full w-[35%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-foreground font-medium">Binary Search on Answers</span>
                    <span className="text-rose-400 font-mono">25% (Needs Study)</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-raised rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full w-[25%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Upcoming Contest Horizon & Platforms (Concept B 20%) */}
            <div className="p-3.5 rounded-xl bg-surface-base border border-border-default space-y-2.5">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-border-subtle">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Upcoming Contest Horizon & Coding Platforms Distribution
                </span>
                <Link href="/contests" className="text-[10px] text-accent hover:underline">
                  View Schedule →
                </Link>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-surface-raised border border-border-subtle flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-foreground block">Codeforces Round 985</span>
                    <span className="text-[10px] text-cyan-400 font-mono">Div. 2 • Rated</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 bg-surface-base px-1.5 py-0.5 rounded border border-border-subtle">
                    In 2d 4h
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-raised border border-border-subtle flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-foreground block">LeetCode Weekly Contest 420</span>
                    <span className="text-[10px] text-amber-400 font-mono">Rank &lt;500 Target</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 bg-surface-base px-1.5 py-0.5 rounded border border-border-subtle">
                    In 3d 12h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Problem Modal */}
      <AddProblemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProblemAdded={loadData}
      />
    </div>
  );
}
