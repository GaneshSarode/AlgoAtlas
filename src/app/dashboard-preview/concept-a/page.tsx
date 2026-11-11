"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Code2,
  Plus,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { getDbRepository } from "@/lib/db/repository";
import type { Problem, RevisionItem, OverallStats } from "@/types";

export default function ConceptAPage() {
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);

  useEffect(() => {
    async function load() {
      const repo = getDbRepository();
      repo.seedSampleWorkspaceData();
      const st = await repo.getOverallStats();
      const pr = await repo.getProblems();
      const rv = await repo.getRevisionItems();
      setStats(st);
      setProblems(pr);
      setRevisions(rv);
    }
    load();
  }, []);

  const overdueRevisions = revisions.filter((r) => r.is_overdue);
  const dueTodayRevisions = revisions.filter((r) => !r.is_overdue && r.scheduled_for <= new Date().toISOString().split("T")[0]);

  // Heatmap generation: 16 weeks x 7 days
  const weeks = Array.from({ length: 16 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const val = (w * 7 + d) % 5 === 0 ? 0 : ((w + d) % 4) + 1;
      return val;
    })
  );

  return (
    <div className="space-y-4 pb-12">
      {/* Concept Switcher Banner */}
      <div className="p-2.5 px-3 rounded-lg bg-surface-raised border border-border-default flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-accent font-semibold uppercase tracking-wider text-[11px]">
            Concept Preview A
          </span>
          <span className="text-neutral-400">•</span>
          <span className="text-foreground font-medium">The Linear / Cockpit (Asymmetric Execution Grid)</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard-preview/concept-b" className="text-neutral-400 hover:text-foreground">
            View Concept B →
          </Link>
          <span className="text-neutral-600">|</span>
          <Link href="/dashboard-preview/concept-c" className="text-neutral-400 hover:text-foreground">
            View Concept C →
          </Link>
        </div>
      </div>

      {/* Top Command Status Strip */}
      <div className="p-3.5 px-4 rounded-xl bg-surface-base border border-border-default shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-muted border border-accent-border flex items-center justify-center text-accent shrink-0">
            <Code2 className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">DSA Study Cockpit</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-raised border border-border-subtle text-neutral-400">
                NeetCode 150
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Active Focus: <strong className="text-foreground font-medium">Two Pointers & Monotonic Stack</strong>
            </p>
          </div>
        </div>

        {/* Middle Progress Target */}
        <div className="flex items-center gap-3 border-y md:border-y-0 md:border-x border-border-subtle py-2 md:py-0 md:px-5">
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

        {/* Right KPIs in compact pill format */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-raised border border-border-default text-xs font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-amber-400">{stats?.current_streak || 14}d</span>
            <span className="text-neutral-500 text-[11px]">streak</span>
          </div>
          <Link href="/problems">
            <Button size="sm" className="gap-1 text-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>Log Problem</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Asymmetric 2-Column Grid (62% Left, 38% Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN (62% - 7 Cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Target Banner */}
          <div className="p-4 rounded-xl bg-surface-base border border-border-default relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
                    Current Roadmap Target
                  </span>
                  <Badge variant="danger" dot>Hard</Badge>
                </div>
                <h3 className="text-base font-semibold text-foreground mt-1 flex items-center gap-2">
                  Trapping Rain Water
                  <a
                    href="https://leetcode.com/problems/trapping-rain-water/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-500 hover:text-foreground"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Key Observation: Water trapped above bar <code className="text-accent font-mono text-[11px]">i</code> is strictly bounded by <code className="text-accent font-mono text-[11px]">min(max_left, max_right) - height[i]</code>. Solvable in O(1) space using converging Two Pointers.
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

          {/* GitHub-style Coding Heatmap */}
          <div className="p-4 rounded-xl bg-surface-base border border-border-default">
            <div className="flex items-center justify-between mb-3 text-xs">
              <div>
                <span className="font-semibold text-foreground">Practice Consistency & Heatmap</span>
                <span className="text-neutral-400 text-[11px] ml-2">Last 16 weeks</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
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

          {/* Recent Problem Stream Table */}
          <div className="rounded-xl bg-surface-base border border-border-default overflow-hidden">
            <div className="p-3 px-4 border-b border-border-subtle flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Recent Problem History</span>
              <Link href="/problems" className="text-[11px] text-accent hover:underline flex items-center gap-1">
                View all ({problems.length}) <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-border-subtle text-xs">
              {problems.slice(0, 5).map((p) => (
                <div key={p.id} className="p-3 px-4 flex items-center justify-between hover:bg-surface-raised transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] font-mono text-neutral-400 bg-surface-raised px-1.5 py-0.5 rounded border border-border-subtle shrink-0">
                      {p.platform}
                    </span>
                    <Link
                      href={`/problems/${p.id}`}
                      className="font-medium text-foreground hover:text-accent truncate"
                    >
                      {p.title}
                    </Link>
                    <span className="text-[11px] text-neutral-400 hidden sm:inline">• {p.primary_topic}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
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
                    <span className="text-amber-400 text-[11px] hidden md:inline">
                      {"★".repeat(p.confidence_rating)}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500">{p.time_spent_minutes}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (38% - 5 Cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Revision Inbox Widget */}
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

          {/* Topic Performance & Weak Areas */}
          <div className="p-4 rounded-xl bg-surface-base border border-border-default space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Topic Mastery & Weak Areas</span>
              <span className="text-[11px] text-neutral-400">Continuous Evaluation</span>
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

          {/* Actionable Learning Intelligence */}
          <div className="p-4 rounded-xl bg-surface-base border border-border-default space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-accent">
              <Sparkles className="w-4 h-4" />
              <span>Next Deliberate Practice Recommendation</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              You frequently used editorial hints on <strong className="text-foreground">Two Pointers</strong>. Solve <strong>Container With Most Water</strong> next to reinforce two-sided pointer bounds before advancing to Sliding Window.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px]">
              <span className="text-neutral-500 font-mono">Confidence trigger: 3/5 avg</span>
              <Link href="/recommendations" className="text-accent hover:underline flex items-center gap-1">
                Full Plan <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
