"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Plus,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { RatingProgressionChart } from "@/components/contests/RatingProgressionChart";
import { ContestModal } from "@/components/contests/ContestModal";
import { getDbRepository } from "@/lib/db/repository";
import { formatDate } from "@/lib/utils";
import type { ContestResult } from "@/types";

export default function ContestsPage() {
  const [contests, setContests] = useState<ContestResult[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadContests = async () => {
    setIsLoading(true);
    const repo = getDbRepository();
    const list = await repo.getContests();
    setContests(list);
    setIsLoading(false);
  };

  useEffect(() => {
    loadContests();
  }, []);

  const totalContests = contests.length;
  const ratings = contests.map((c) => c.rating_after).filter(Boolean) as number[];
  const peakRating = ratings.length > 0 ? Math.max(...ratings) : 0;
  const currentRating = ratings.length > 0 ? ratings[0] : 0; // most recent
  const totalSolvedInContest = contests.reduce((acc, c) => acc + c.problems_solved, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            Competitive Programming Contest Tracker
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Track contest rank, rating changes, and post-contest reflections across Codeforces, AtCoder, and LeetCode.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          size="sm"
          className="bg-brand-600 hover:bg-brand-500 shadow-sm shadow-brand-600/30 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Contest</span>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#12141e] border border-[#1e2333]">
          <span className="text-xs text-gray-400">Total Contests</span>
          <span className="text-2xl font-bold text-white mt-1 block font-mono">
            {totalContests}
          </span>
          <span className="text-[10px] text-gray-500">Official & Virtual</span>
        </div>

        <div className="p-4 rounded-xl bg-[#12141e] border border-[#1e2333]">
          <span className="text-xs text-amber-300">Peak Rating</span>
          <span className="text-2xl font-bold text-amber-400 mt-1 block font-mono">
            {peakRating || "—"}
          </span>
          <span className="text-[10px] text-gray-500">All-time maximum</span>
        </div>

        <div className="p-4 rounded-xl bg-[#12141e] border border-[#1e2333]">
          <span className="text-xs text-brand-300">Current Rating</span>
          <span className="text-2xl font-bold text-brand-400 mt-1 block font-mono">
            {currentRating || "—"}
          </span>
          <span className="text-[10px] text-gray-500">Most recent</span>
        </div>

        <div className="p-4 rounded-xl bg-[#12141e] border border-[#1e2333]">
          <span className="text-xs text-emerald-300">Contest Solves</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block font-mono">
            {totalSolvedInContest}
          </span>
          <span className="text-[10px] text-gray-500">Under contest pressure</span>
        </div>
      </div>

      {/* Rating Progression Chart */}
      <Card className="border-[#1f2433] bg-[#12141e]">
        <CardHeader className="py-4 px-5 border-b border-[#1f2433]">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-400" />
            Rating Progression Trajectory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <RatingProgressionChart contests={contests} />
        </CardContent>
      </Card>

      {/* Contest History Table */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white tracking-tight">
          Contest History & Retrospectives ({contests.length})
        </h2>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-gray-500 animate-pulse">
            Loading contest history...
          </div>
        ) : contests.length === 0 ? (
          <div className="text-center py-14 bg-[#12141d] rounded-xl border border-dashed border-[#23293a] space-y-2">
            <Trophy className="w-8 h-8 text-gray-500 mx-auto" />
            <p className="text-xs text-gray-400">No contests recorded yet.</p>
            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="bg-brand-600 hover:bg-brand-500 mt-2"
            >
              + Log Your First Contest
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {contests.map((c) => {
              const isExpanded = expandedId === c.id;

              return (
                <div
                  key={c.id}
                  className="rounded-xl border border-[#1f2433] bg-[#12141e] overflow-hidden transition-all"
                >
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : c.id)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-[#151926] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1c2132] text-gray-300 border border-[#2b334c]">
                        {c.platform}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{c.contest_name}</h4>
                        <span className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                          <span>{formatDate(c.contest_date)}</span>
                          <span>•</span>
                          <span>{c.participation_type}</span>
                          {c.rank && (
                            <>
                              <span>•</span>
                              <span>Rank: #{c.rank}</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-xs font-semibold text-gray-300 block">
                          {c.problems_solved} / {c.problems_attempted} Solved
                        </span>
                        {c.rating_change !== undefined && (
                          <span
                            className={`text-xs font-mono font-bold ${
                              c.rating_change >= 0 ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {c.rating_change >= 0 ? `+${c.rating_change}` : c.rating_change}
                            {c.rating_after ? ` → ${c.rating_after}` : ""}
                          </span>
                        )}
                      </div>

                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Reflection Notes */}
                  {isExpanded && (
                    <div className="p-4 bg-[#0d0f17] border-t border-[#1f2433] space-y-3 text-xs">
                      {c.reflection_good && (
                        <div>
                          <span className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider block mb-0.5">
                            What Went Well:
                          </span>
                          <p className="text-gray-300">{c.reflection_good}</p>
                        </div>
                      )}
                      {c.reflection_unsolved && (
                        <div>
                          <span className="font-bold text-rose-400 uppercase text-[10px] tracking-wider block mb-0.5">
                            Missed Problems / Obstacles:
                          </span>
                          <p className="text-gray-300">{c.reflection_unsolved}</p>
                        </div>
                      )}
                      {c.reflection_next_action && (
                        <div>
                          <span className="font-bold text-purple-400 uppercase text-[10px] tracking-wider block mb-0.5">
                            Action Plan Before Next Contest:
                          </span>
                          <p className="text-gray-300">{c.reflection_next_action}</p>
                        </div>
                      )}
                      {!c.reflection_good && !c.reflection_unsolved && (
                        <p className="text-gray-500 italic">No detailed reflection recorded for this contest.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ContestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onContestAdded={loadContests}
      />
    </div>
  );
}
