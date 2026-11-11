"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Edit3,
  CheckSquare,
  Sparkles,
  Flame,
  FileCode,
  AlertOctagon,
  Copy,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";

export default function ConceptCPage() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-4 pb-12 font-sans">
      {/* Concept Switcher Banner */}
      <div className="p-2.5 px-3 rounded-lg bg-surface-raised border border-border-default flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-purple-400 font-semibold uppercase tracking-wider text-[11px]">
            Concept Preview C
          </span>
          <span className="text-neutral-400">•</span>
          <span className="text-foreground font-medium">The Algorithm Researcher (Notion & NeetCode Notebook)</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard-preview/concept-a" className="text-neutral-400 hover:text-foreground">
            ← View Concept A
          </Link>
          <span className="text-neutral-600">|</span>
          <Link href="/dashboard-preview/concept-b" className="text-neutral-400 hover:text-foreground">
            View Concept B →
          </Link>
        </div>
      </div>

      {/* Notion-style Document Header & Goal Callout */}
      <div className="p-5 rounded-xl bg-surface-base border border-border-default space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>AlgoAtlas</span>
            <span>/</span>
            <span>Personal Workspace</span>
            <span>/</span>
            <span className="text-foreground font-medium">DSA Learning OS</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>14 day study streak</span>
          </div>
        </div>

        {/* Focus Banner Callout */}
        <div className="p-3.5 rounded-lg bg-surface-raised border border-border-subtle flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span className="text-base">🎯</span>
            <div>
              <span className="text-xs font-semibold text-foreground block">
                Current Study Objective (Week 3 Milestone)
              </span>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                Mastering <strong className="text-foreground">Dynamic Programming (1D Tabulation & Memoization)</strong> and <strong className="text-foreground">Monotonic Stacks</strong> for next-greater-element variations.
              </p>
            </div>
          </div>
          <button className="text-neutral-500 hover:text-foreground p-1" title="Edit Objective">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Minimal Metrics Row */}
        <div className="pt-2 border-t border-border-subtle flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
          <span>Logged: <strong className="text-foreground">24 problems</strong></span>
          <span>•</span>
          <span>Independently Solved: <strong className="text-emerald-400">18 (75%)</strong></span>
          <span>•</span>
          <span>Revisions Scheduled: <strong className="text-amber-400">2 pending</strong></span>
          <span>•</span>
          <span>Mastery Score: <strong className="text-foreground">4.2 / 5.0</strong></span>
        </div>
      </div>

      {/* Two-Column Notion-style Layout (50% / 50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT COLUMN: Study Sequence & Recall Cards */}
        <div className="space-y-4">
          {/* Today's Deliberate Practice Sequence */}
          <div className="p-4 rounded-xl bg-surface-base border border-border-default space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-border-subtle">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                Today's Deliberate Practice Sequence
              </span>
              <span className="text-[11px] font-mono text-neutral-400">Target: ~80 min</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-surface-raised border border-border-subtle flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
                  <span className="line-through text-neutral-400">1. Two Sum II - Input Array Is Sorted</span>
                </label>
                <Badge variant="outline">20m • Done</Badge>
              </div>

              <div className="p-2.5 rounded-lg bg-accent-muted border border-accent-border flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer text-foreground font-medium">
                  <input type="checkbox" className="rounded accent-accent" />
                  <span>2. Trapping Rain Water (Two Pointers Inward Scan)</span>
                </label>
                <Badge variant="danger" dot>45m • Overdue</Badge>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-raised border border-border-subtle flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer text-neutral-300">
                  <input type="checkbox" className="rounded" />
                  <span>3. Longest Substring Without Repeating Characters</span>
                </label>
                <Badge variant="warning">30m • Sliding Window</Badge>
              </div>
            </div>
          </div>

          {/* Flashcard Active Recall Test */}
          <div className="p-4 rounded-xl bg-surface-base border border-border-default space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-border-subtle">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Flashcard Recall Challenge
              </span>
              <span className="text-[10px] font-mono text-amber-400">Spaced Interval: 3d</span>
            </div>

            <div>
              <span className="text-xs font-semibold text-foreground block">
                Problem: 3Sum (LeetCode #15)
              </span>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Given integer array nums, return all triplets [nums[i], nums[j], nums[k]] such that i != j != k and nums[i] + nums[j] + nums[k] == 0 without duplicates.
              </p>
            </div>

            {/* Blur-reveal intuition box */}
            <div className="p-3 rounded-lg bg-surface-raised border border-border-subtle space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                  Optimal Intuition & Gotchas
                </span>
                <button
                  onClick={() => setRevealed(!revealed)}
                  className="text-accent hover:underline flex items-center gap-1 text-[11px]"
                >
                  {revealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{revealed ? "Hide Solution" : "Reveal Answer"}</span>
                </button>
              </div>

              <div className={revealed ? "" : "filter blur-sm select-none"}>
                <p className="text-xs text-neutral-200 leading-relaxed font-mono">
                  1. Sort array O(N log N)<br />
                  2. Outer loop i from 0 to n-1. If nums[i] == nums[i-1], continue.<br />
                  3. Use Two Pointers (left = i+1, right = n-1) to find sum == -nums[i].<br />
                  Time: O(N^2) • Space: O(1)
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                Needed Hints
              </Button>
              <Button size="sm" variant="success" className="flex-1 text-xs">
                Remembered Independently
              </Button>
            </div>
          </div>

          {/* Topic Taxonomy Overview */}
          <div className="p-4 rounded-xl bg-surface-base border border-border-default space-y-2.5">
            <span className="text-xs font-semibold text-foreground block">
              DSA Concept Coverage
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-surface-raised border border-border-subtle">
                <span className="text-[10px] text-neutral-400 block font-mono">Data Structures</span>
                <span className="font-semibold text-foreground">Arrays, HashMaps, Trees</span>
                <span className="text-[10px] text-emerald-400 block mt-1">12 Mastered</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-raised border border-border-subtle">
                <span className="text-[10px] text-neutral-400 block font-mono">Patterns</span>
                <span className="font-semibold text-foreground">Two Pointers, BS, DP</span>
                <span className="text-[10px] text-amber-400 block mt-1">6 In Progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Featured Notes & Mistake Traps */}
        <div className="space-y-4">
          {/* Featured Study Notebook Entry (Live Code & Markdown preview) */}
          <div className="p-4 rounded-xl bg-surface-base border border-border-default space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-border-subtle">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-accent" />
                Featured Algorithm Note
              </span>
              <span className="text-[10px] font-mono text-neutral-500">Updated yesterday</span>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground">
                Two Pointers vs Sliding Window: Decision Matrix
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                When should you use two pointers converging inward vs a sliding window expanding and shrinking?
              </p>
            </div>

            {/* Note Snippet */}
            <div className="p-3 rounded-lg bg-[#0d1117] border border-border-default text-xs font-mono space-y-2 overflow-x-auto">
              <div className="text-neutral-400 text-[11px]">
                // Key Rule: Converging pointers require sorted monotonic order
              </div>
              <pre className="text-neutral-200 text-[11px] leading-relaxed">
{`int l = 0, r = n - 1;
while (l < r) {
    int sum = nums[l] + nums[r];
    if (sum == target) return {l, r};
    else if (sum < target) l++; // sum too small
    else r--;                   // sum too big
}`}
              </pre>
            </div>

            <div className="p-3 rounded-lg bg-surface-raised border border-border-subtle text-xs space-y-1">
              <span className="font-semibold text-foreground text-[11px] block">
                Rule of Thumb:
              </span>
              <p className="text-neutral-400 text-xs leading-relaxed">
                • Use <strong>Two Pointers</strong> when finding pairs/triplets in sorted space or boundary heights.<br />
                • Use <strong>Sliding Window</strong> when evaluating contiguous subsegments satisfying a frequency condition.
              </p>
            </div>
          </div>

          {/* Recent Mistakes & Traps Log */}
          <div className="p-4 rounded-xl bg-surface-base border border-border-default space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-border-subtle">
              <span className="font-semibold text-foreground flex items-center gap-1.5 text-rose-400">
                <AlertOctagon className="w-4 h-4" />
                Mistakes & Gotchas Log
              </span>
              <span className="text-[10px] font-mono text-neutral-500">Active Retrospective</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-rose-500/[0.04] border border-rose-500/20 text-neutral-300">
                <span className="font-semibold text-foreground block text-[11px]">
                  Binary Search Midpoint Overflow
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Never write <code className="text-rose-400 font-mono">mid = (l + r) / 2</code> in languages like C++ or Java. Always use <code className="text-emerald-400 font-mono">mid = l + (r - l) / 2</code> to prevent 32-bit integer overflow.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-500/[0.04] border border-amber-500/20 text-neutral-300">
                <span className="font-semibold text-foreground block text-[11px]">
                  3Sum Triplet Duplicates
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Remember to skip duplicate elements in the outer loop <code className="text-amber-400 font-mono">if (i &gt; 0 &amp;&amp; nums[i] == nums[i-1]) continue;</code> and inside pointer updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
