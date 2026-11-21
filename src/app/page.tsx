"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, BookOpen, Calendar, CheckCircle2, ChevronRight, Clock, Code2,
  ExternalLink, Eye, EyeOff, Flame, Plus, RotateCcw, Sparkles, Target, Trophy,
} from "lucide-react";
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
    const [st, ps, pr, rv] = await Promise.all([
      repo.getOverallStats(), repo.getPlatformStats(), repo.getProblems(), repo.getRevisionItems(),
    ]);
    setStats(st);
    setPlatformStats(ps);
    setProblems(pr);
    setRevisions(rv);
    setIsLoading(false);
  };

  useEffect(() => { void loadData(); }, []);

  const overdueRevisions = revisions.filter((r) => r.is_overdue);
  const dueTodayRevisions = revisions.filter((r) => !r.is_overdue && r.scheduled_for <= new Date().toISOString().split("T")[0]);
  const reviewItems = [...overdueRevisions, ...dueTodayRevisions];
  const weeks = Array.from({ length: 16 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => ((w * 7 + d) % 5 === 0 ? 0 : ((w + d) % 4) + 1))
  );

  return (
    <div className="space-y-8 pb-12 font-sans">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-border bg-accent-muted px-3 py-1 text-xs font-medium text-accent">
            <Code2 className="h-3.5 w-3.5" /> Personal DSA Learning OS
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">AlgoAtlas</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-400">A clearer path from understanding a pattern to solving the next problem.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="h-10 gap-2 px-4"><Plus className="h-4 w-4" /> Log a problem</Button>
      </section>

      {isLoading ? (
        <div className="rounded-2xl border border-border-default bg-surface-base py-24 text-center text-sm text-neutral-400">Loading your learning space…</div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Learning overview">
            <div className="rounded-2xl border border-border-default bg-surface-base p-5 shadow-sm">
              <div className="flex items-center justify-between text-sm text-neutral-400"><span>Problems solved</span><CheckCircle2 className="h-4 w-4 text-emerald-400" /></div>
              <div className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{stats?.total_problems || 10}</div>
              <p className="mt-1 text-xs text-neutral-500">Across your learning workspace</p>
            </div>
            <div className="rounded-2xl border border-border-default bg-surface-base p-5 shadow-sm">
              <div className="flex items-center justify-between text-sm text-neutral-400"><span>Learning streak</span><Flame className="h-4 w-4 text-amber-400" /></div>
              <div className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{stats?.current_streak || 14}<span className="ml-1 text-base font-medium text-neutral-400">days</span></div>
              <p className="mt-1 text-xs text-neutral-500">Small daily sessions add up</p>
            </div>
            <div className="rounded-2xl border border-border-default bg-surface-base p-5 shadow-sm">
              <div className="flex items-center justify-between text-sm text-neutral-400"><span>Ready to review</span><RotateCcw className="h-4 w-4 text-accent" /></div>
              <div className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{reviewItems.length}</div>
              <p className="mt-1 text-xs text-neutral-500">Due now or scheduled for today</p>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-3xl border border-accent-border bg-[linear-gradient(120deg,#122b3a_0%,#14283a_52%,#172238_100%)] p-6 shadow-xl shadow-black/10 sm:p-8">
            <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-accent"><Target className="h-4 w-4" /> YOUR NEXT STEP <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-neutral-300">NeetCode 150 · Two Pointers</span></div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Trapping Rain Water</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Use the lower boundary to decide which pointer can move. Each step locks in water that can no longer be affected by the other side.</p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs"><span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-300">LeetCode #42</span><span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-300">Hard</span><span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-accent">O(n) time · O(1) space</span></div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/problems/prob-trapping-rain-water"><Button className="h-11 gap-2 px-5">Continue learning <ArrowRight className="h-4 w-4" /></Button></Link>
                <a href="https://leetcode.com/problems/trapping-rain-water/" target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-medium text-white transition hover:bg-white/10">Open problem <ExternalLink className="h-4 w-4" /></a>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <div className="rounded-2xl border border-border-default bg-surface-base p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div><div className="flex items-center gap-2 text-accent"><Sparkles className="h-4 w-4" /><h2 className="text-sm font-semibold">Your Learning Intelligence</h2></div><p className="mt-2 text-sm leading-6 text-neutral-300">Hints came up often on <strong className="text-foreground">Two Pointers</strong>. Try <strong className="text-foreground">Container With Most Water</strong> next to build confidence with boundary decisions.</p></div>
                  <span className="hidden rounded-xl bg-surface-raised px-3 py-2 text-center sm:block"><span className="block text-lg font-semibold text-foreground">3/5</span><span className="text-[11px] text-neutral-400">confidence</span></span>
                </div>
                <Link href="/recommendations" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-white">See your learning plan <ArrowRight className="h-4 w-4" /></Link>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border-default bg-surface-base">
                <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4 sm:px-6"><div><h2 className="text-base font-semibold text-foreground">Recent problems</h2><p className="mt-1 text-xs text-neutral-400">Pick up where you left off</p></div><Link href="/problems" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-white">View all <ChevronRight className="h-4 w-4" /></Link></div>
                <div className="divide-y divide-border-subtle">
                  {problems.slice(0, 5).map((problem) => <Link key={problem.id} href={`/problems/${problem.id}`} className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-surface-raised sm:px-6"><div className="flex min-w-0 items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-muted text-accent"><Code2 className="h-4 w-4" /></span><div className="min-w-0"><span className="block truncate text-sm font-medium text-foreground">{problem.title}</span><span className="mt-1 block truncate text-xs text-neutral-400">{problem.platform} · {problem.primary_topic || "General"}</span></div></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${problem.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400" : problem.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"}`}>{problem.difficulty}</span></Link>)}
                  {problems.length === 0 && <p className="px-6 py-10 text-center text-sm text-neutral-400">Log your first problem to start building your history.</p>}
                </div>
              </div>

              <div className="rounded-2xl border border-border-default bg-surface-base p-5 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-base font-semibold text-foreground">Daily Problem-Solving Consistency</h2><p className="mt-1 text-xs text-neutral-400">Your last 16 weeks of practice</p></div><div className="flex items-center gap-1.5 text-[11px] text-neutral-400"><span>Less</span>{["bg-surface-raised", "bg-emerald-950", "bg-emerald-800", "bg-emerald-600", "bg-emerald-400"].map((level) => <span key={level} className={`h-3 w-3 rounded-sm ${level}`} />)}<span>More</span></div></div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">{weeks.map((week, wIdx) => <div key={wIdx} className="flex shrink-0 flex-col gap-1.5">{week.map((level, dIdx) => <div key={dIdx} title={`Week ${wIdx + 1}, day ${dIdx + 1}: ${level} problems`} className={`h-3 w-3 rounded-[4px] ${level === 0 ? "bg-surface-raised" : level === 1 ? "bg-emerald-950" : level === 2 ? "bg-emerald-800" : level === 3 ? "bg-emerald-600" : "bg-emerald-400"}`} />)}</div>)}</div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border-subtle pt-4 text-sm"><span className="text-neutral-400">Total solved <strong className="ml-1 text-foreground">{stats?.total_problems || 10}</strong></span><span className="text-xs text-neutral-500">Consistency beats intensity</span></div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="overflow-hidden rounded-2xl border border-border-default bg-surface-base">
                <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4 sm:px-6"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400"><RotateCcw className="h-4 w-4" /></span><div><h2 className="text-base font-semibold text-foreground">Revision inbox</h2><p className="mt-1 text-xs text-neutral-400">{reviewItems.length} items ready</p></div></div><Link href="/revision" className="text-sm font-medium text-accent hover:text-white">Full queue</Link></div>
                <div className="space-y-2 p-4 sm:p-5">{reviewItems.slice(0, 4).map((revision) => <div key={revision.id} className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-surface-raised p-3.5"><div className="min-w-0"><span className="block truncate text-sm font-medium text-foreground">{revision.problem_title}</span><span className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400"><Clock className="h-3.5 w-3.5" />{revision.is_overdue ? "Overdue" : "Due today"} · {revision.interval_stage} day interval</span></div><Link href="/revision/practice" className="shrink-0 rounded-lg bg-accent-muted px-3 py-2 text-xs font-semibold text-accent transition hover:bg-accent hover:text-slate-950">Review</Link></div>)}{reviewItems.length === 0 && <p className="py-6 text-center text-sm text-neutral-400">You’re all caught up. Nice work.</p>}</div>
              </div>

              <div className="rounded-2xl border border-border-default bg-surface-base p-5 sm:p-6">
                <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-accent"><BookOpen className="h-4 w-4" /><h2 className="text-base font-semibold text-foreground">Active recall</h2></div><span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-xs text-purple-300">3 day review</span></div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">3Sum <span className="text-sm font-normal text-neutral-400">· Two Pointers</span></h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">How can you find unique triplets that add to zero without checking every combination?</p>
                <div className="mt-4 rounded-xl border border-border-subtle bg-surface-raised p-4"><div className="mb-3 flex items-center justify-between text-xs"><span className="font-medium text-neutral-400">Your approach</span><button onClick={() => setFlashcardRevealed(!flashcardRevealed)} className="inline-flex items-center gap-1.5 font-medium text-accent hover:text-white">{flashcardRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}{flashcardRevealed ? "Hide answer" : "Reveal answer"}</button></div><p className={`text-sm leading-6 text-neutral-200 ${flashcardRevealed ? "" : "select-none blur-sm"}`}>Sort first, then fix one value and scan with two pointers. Skip duplicates at each step. This keeps time at O(n²) and extra space at O(1).</p></div>
                <Link href="/revision/practice" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-white">Practice recall <ArrowRight className="h-4 w-4" /></Link>
              </div>

              <div className="rounded-2xl border border-border-default bg-surface-base p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between"><div><h2 className="text-base font-semibold text-foreground">Topic mastery</h2><p className="mt-1 text-xs text-neutral-400">Where to focus next</p></div><Link href="/analytics" className="text-xs font-medium text-accent">See analytics</Link></div>
                <div className="space-y-4">{[{ name: "Arrays & Hashing", value: 92, tone: "bg-emerald-400", label: "Strong" }, { name: "Two Pointers", value: 60, tone: "bg-amber-400", label: "Practising" }, { name: "Dynamic Programming", value: 35, tone: "bg-rose-400", label: "Needs practice" }, { name: "Binary Search", value: 25, tone: "bg-rose-400", label: "Needs practice" }].map((topic) => <div key={topic.name}><div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="text-neutral-200">{topic.name}</span><span className="shrink-0 text-xs text-neutral-400">{topic.value}% · {topic.label}</span></div><div className="h-2 overflow-hidden rounded-full bg-surface-raised"><div className={`h-full rounded-full ${topic.tone}`} style={{ width: `${topic.value}%` }} /></div></div>)}</div>
                <Link href="/roadmaps" className="mt-5 flex items-center justify-between rounded-xl border border-border-subtle bg-surface-raised px-4 py-3 text-sm transition hover:border-accent-border"><span className="flex items-center gap-2 text-neutral-200"><Calendar className="h-4 w-4 text-accent" />NeetCode 150 roadmap</span><ArrowRight className="h-4 w-4 text-neutral-400" /></Link>
                <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500"><Trophy className="h-3.5 w-3.5" /> Coding Platforms Distribution · {platformStats.length} connected</div>
              </div>
            </div>
          </section>
        </>
      )}

      <AddProblemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onProblemAdded={loadData} />
    </div>
  );
}
