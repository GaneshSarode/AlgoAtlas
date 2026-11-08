"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Brain,
  Code,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { getDbRepository } from "@/lib/db/repository";
import type { Problem, LearningNote, SolutionApproach, RecallGrade } from "@/types";

export default function RevisionPracticePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const problemId = searchParams.get("problemId");

  const [problem, setProblem] = useState<Problem | null>(null);
  const [learningNote, setLearningNote] = useState<LearningNote | null>(null);
  const [optimalApproach, setOptimalApproach] = useState<SolutionApproach | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!problemId) return;
      const repo = getDbRepository();
      const p = await repo.getProblemById(problemId);
      if (!p) return;
      setProblem(p);

      const note = await repo.getLearningNotesByProblemId(problemId);
      setLearningNote(note);

      const approaches = await repo.getApproachesByProblemId(problemId);
      const opt =
        approaches.find((a) => a.approach_type === "Optimal") ||
        approaches[0] ||
        null;
      setOptimalApproach(opt);
    }
    loadData();
  }, [problemId]);

  const handleGradeRecall = async (grade: RecallGrade) => {
    if (!problemId) return;
    setIsSubmitting(true);
    try {
      const repo = getDbRepository();
      await repo.recordRevisionOutcome(problemId, grade);

      // Find next due problem
      const revisions = await repo.getRevisionItems();
      const nextDue = revisions.find(
        (r) => r.is_overdue || r.scheduled_for <= new Date().toISOString().split("T")[0]
      );

      if (nextDue && nextDue.problem_id !== problemId) {
        router.push(`/revision/practice?problemId=${nextDue.problem_id}`);
        setRevealed(false);
      } else {
        setSessionComplete(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!problemId || !problem) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-base font-semibold text-white">No Revision Selected</h2>
        <p className="text-xs text-gray-400">Select a problem from your revision queue to begin.</p>
        <Link href="/revision" className="text-xs text-brand-400 hover:underline">
          ← Back to Revision Centre
        </Link>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Revision Session Complete!</h2>
        <p className="text-xs text-gray-400">
          You've reviewed your pending queue. All recall outcomes have been saved and intervals updated.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/revision"
            className="px-4 py-2 rounded-lg bg-[#181b26] border border-[#272f44] text-xs font-semibold text-gray-200 hover:text-white"
          >
            Revision Queue
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Bar with Exit */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1f2433]">
        <Link
          href="/revision"
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Revision Mode
        </Link>
        <span className="text-xs font-mono text-purple-400 font-semibold tracking-wider uppercase">
          Focus Revision Mode
        </span>
      </div>

      {/* Problem Challenge Card */}
      <div className="p-6 rounded-2xl bg-[#12141e] border border-[#1f2433] space-y-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1c2132] text-gray-300 border border-[#2b334c]">
            {problem.platform}
          </span>
          <Badge
            variant={
              problem.difficulty === "Easy"
                ? "success"
                : problem.difficulty === "Medium"
                ? "warning"
                : "danger"
            }
          >
            {problem.difficulty}
          </Badge>
          <span className="text-xs text-gray-400 font-medium">
            {problem.primary_topic || "General"}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {problem.title}
        </h1>

        <a
          href={problem.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-brand-400 hover:underline"
        >
          View original problem on {problem.platform} <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Active Recall Prompts */}
      <Card className="border-[#1f2433]">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="w-4 h-4 text-brand-400" />
            Active Recall Self-Test
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2.5 text-xs text-gray-300">
          <p className="text-gray-400 pb-1">
            Before revealing your notes, mentally answer these four questions:
          </p>
          <div className="flex items-start gap-2">
            <span className="text-brand-400 font-bold">1.</span>
            <span>Can you identify the underlying algorithmic pattern or data structure?</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-brand-400 font-bold">2.</span>
            <span>Can you explain the main intuition and why brute force is suboptimal?</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-brand-400 font-bold">3.</span>
            <span>Can you outline the step-by-step algorithm and edge cases from memory?</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-brand-400 font-bold">4.</span>
            <span>What are the optimal Time & Space complexities?</span>
          </div>
        </CardContent>
      </Card>

      {/* Reveal Notes Action */}
      {!revealed ? (
        <div className="text-center pt-2">
          <Button
            size="lg"
            onClick={() => setRevealed(true)}
            className="bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-md shadow-brand-600/30 gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>Reveal Saved Notes & Optimal Solution</span>
          </Button>
        </div>
      ) : (
        /* Revealed Content & Self-Scoring */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Saved Notes Card */}
          <Card className="border-purple-900/40 bg-[#12141e]">
            <CardHeader className="py-3 px-4 bg-purple-950/20 border-b border-purple-900/30">
              <CardTitle className="text-sm text-purple-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Your Stored Learning Notes & Intuition
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs">
              {learningNote?.key_observation && (
                <div>
                  <span className="font-bold text-amber-400 text-[11px] uppercase tracking-wider block mb-0.5">
                    Key Observation:
                  </span>
                  <p className="text-gray-200 italic bg-[#0d0f17] p-2.5 rounded border border-[#202538]">
                    "{learningNote.key_observation}"
                  </p>
                </div>
              )}

              {optimalApproach && (
                <div className="space-y-2 pt-2 border-t border-[#1f2433]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider">
                      Optimal Approach: {optimalApproach.title}
                    </span>
                    <span className="font-mono text-emerald-400 text-xs">
                      Time: {optimalApproach.time_complexity} | Space: {optimalApproach.space_complexity}
                    </span>
                  </div>
                  <p className="text-gray-300">{optimalApproach.intuition}</p>

                  {optimalApproach.code && (
                    <div className="pt-2">
                      <span className="text-gray-400 text-[11px] font-semibold block mb-1">
                        Code Snippet ({optimalApproach.language}):
                      </span>
                      <pre className="p-3 bg-[#0a0c13] text-gray-200 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed border border-[#202538]">
                        <code>{optimalApproach.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {learningNote?.mistakes_to_avoid && (
                <div className="pt-2 border-t border-[#1f2433]">
                  <span className="font-bold text-rose-400 text-[11px] uppercase tracking-wider block mb-0.5">
                    Mistake to Avoid:
                  </span>
                  <p className="text-gray-300">{learningNote.mistakes_to_avoid}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Grade Recall Performance Buttons */}
          <div className="p-5 rounded-2xl bg-[#12141e] border border-[#23293a] space-y-3">
            <h3 className="text-sm font-bold text-white text-center">
              How did your active recall compare to your notes?
            </h3>
            <p className="text-[11px] text-gray-400 text-center">
              Select an honest rating. The spaced repetition algorithm will calculate the next optimal review interval.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
              <Button
                variant="danger"
                size="sm"
                disabled={isSubmitting}
                onClick={() => handleGradeRecall("Forgot")}
                className="flex-col h-auto py-2.5 text-center text-xs"
              >
                <span className="font-bold">Forgot (1d)</span>
                <span className="text-[10px] opacity-80">Reset to tomorrow</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => handleGradeRecall("Needed Hints")}
                className="flex-col h-auto py-2.5 text-center text-xs border-amber-800/60 text-amber-300 hover:bg-amber-950/40"
              >
                <span className="font-bold">Needed Hints</span>
                <span className="text-[10px] opacity-80">Repeat stage</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => handleGradeRecall("Partial Recall")}
                className="flex-col h-auto py-2.5 text-center text-xs border-indigo-800/60 text-indigo-300 hover:bg-indigo-950/40"
              >
                <span className="font-bold">Partial Recall</span>
                <span className="text-[10px] opacity-80">1.5x interval</span>
              </Button>

              <Button
                variant="success"
                size="sm"
                disabled={isSubmitting}
                onClick={() => handleGradeRecall("Solved Independently")}
                className="flex-col h-auto py-2.5 text-center text-xs"
              >
                <span className="font-bold">Independent</span>
                <span className="text-[10px] opacity-80">Advance stage</span>
              </Button>

              <Button
                size="sm"
                disabled={isSubmitting}
                onClick={() => handleGradeRecall("Mastered")}
                className="flex-col h-auto py-2.5 text-center text-xs bg-purple-700 hover:bg-purple-600 text-white col-span-2 sm:col-span-1"
              >
                <span className="font-bold">Mastered (90d)</span>
                <span className="text-[10px] opacity-80">Pattern mastered</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
