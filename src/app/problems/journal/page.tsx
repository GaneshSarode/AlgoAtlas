"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ExternalLink, Calendar, Star, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { getDbRepository } from "@/lib/db/repository";
import { formatDate } from "@/lib/utils";
import type { Problem, LearningNote } from "@/types";

export default function JournalDirectoryPage() {
  const [problemsWithNotes, setProblemsWithNotes] = useState<
    { problem: Problem; note: LearningNote | null }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const repo = getDbRepository();
      const problems = await repo.getProblems();
      const list = [];
      for (const p of problems) {
        const note = await repo.getLearningNotesByProblemId(p.id);
        list.push({ problem: p, note });
      }
      setProblemsWithNotes(list);
      setIsLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-purple-400" />
          DSA Learning Journal
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Review your personal insights, intuition, mistakes to avoid, and multi-approach solutions across every problem.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
          Loading journal entries...
        </div>
      ) : problemsWithNotes.length === 0 ? (
        <div className="text-center py-16 bg-[#12141d] border border-dashed border-[#23293a] rounded-xl p-6 space-y-3">
          <BookOpen className="w-10 h-10 text-gray-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No journal entries yet</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Log problems in your vault and record what you learned to build your personal knowledge base.
          </p>
          <Link
            href="/problems"
            className="inline-block mt-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs text-white font-medium"
          >
            Go to Problem Vault
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {problemsWithNotes.map(({ problem, note }) => (
            <Card
              key={problem.id}
              className="bg-[#12141e] border-[#1e2333] hover:border-[#303850] transition-all flex flex-col justify-between"
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1b2030] text-gray-300 border border-[#272e44]">
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
                      <span className="text-xs text-gray-400">
                        {problem.primary_topic || "General"}
                      </span>
                    </div>
                    <Link
                      href={`/problems/${problem.id}`}
                      className="text-base font-semibold text-white hover:text-brand-400 transition-colors line-clamp-1"
                    >
                      {problem.title}
                    </Link>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                    {"★".repeat(problem.confidence_rating)}
                  </div>
                </div>

                {/* Journal Highlights */}
                <div className="p-3 rounded-lg bg-[#0f111a] border border-[#1d2235] space-y-2 text-xs">
                  {note?.main_concept_learned && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider block">
                        Main Concept:
                      </span>
                      <p className="text-gray-300 line-clamp-1 font-medium">
                        {note.main_concept_learned}
                      </p>
                    </div>
                  )}

                  {note?.key_observation && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                        Key Observation:
                      </span>
                      <p className="text-gray-400 line-clamp-2 italic">
                        "{note.key_observation}"
                      </p>
                    </div>
                  )}

                  {!note?.main_concept_learned && !note?.key_observation && (
                    <p className="text-gray-500 italic text-[11px]">
                      No detailed notes written yet. Click below to document your approach.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1d2235] text-xs">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(problem.created_at)}
                  </span>

                  <Link
                    href={`/problems/${problem.id}`}
                    className="flex items-center gap-1 text-brand-400 hover:text-brand-300 font-medium"
                  >
                    Open Full Journal <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
