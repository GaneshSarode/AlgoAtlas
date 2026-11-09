"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Bookmark,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Problem, ProblemStatus } from "@/types";

export interface ProblemHeaderProps {
  problem: Problem;
  onUpdate: (updates: Partial<Problem>) => void;
  saveStatus: "idle" | "saving" | "saved";
}

export function ProblemHeader({ problem, onUpdate, saveStatus }: ProblemHeaderProps) {
  return (
    <div className="bg-[#0c0e14] border border-white/[0.08] rounded-xl p-4 sm:p-5 space-y-3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/problems"
            className="p-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-white/[0.08]">
                {problem.platform}
              </span>
              <Badge
                dot
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
              <span className="text-[11px] font-mono text-zinc-400">
                {problem.primary_topic || "DSA"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1 flex items-center gap-2 font-sans tracking-tight">
              {problem.title}
              <a
                href={problem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
                title="View original problem"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </h1>
          </div>
        </div>

        {/* Save confirmation & Actions */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {saveStatus === "saving" && (
            <span className="text-xs text-amber-400 font-mono">
              Saving...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved to journal
            </span>
          )}

          <button
            onClick={() => onUpdate({ is_bookmarked: !problem.is_bookmarked })}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-medium ${
              problem.is_bookmarked
                ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                : "bg-zinc-900 text-zinc-400 border-white/[0.08] hover:text-white hover:border-white/[0.18]"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${problem.is_bookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
            <span className="hidden sm:inline">Bookmark</span>
          </button>
        </div>
      </div>

      {/* Status, Confidence & Time Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06] text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 font-mono text-[11px]">Status:</span>
            <select
              value={problem.status}
              onChange={(e) => onUpdate({ status: e.target.value as ProblemStatus })}
              className="bg-zinc-900 border border-white/[0.08] rounded-md px-2.5 py-1 text-white focus:outline-none focus:border-indigo-500 text-xs font-medium"
            >
              <option value="Solved Independently">Solved Independently</option>
              <option value="Solved With Hint">Solved With Hint</option>
              <option value="Needs Revision">Needs Revision</option>
              <option value="Attempted">Attempted</option>
              <option value="Not Started">Not Started</option>
              <option value="Mastered">Mastered</option>
            </select>
          </div>

          {/* Confidence Stars */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 font-mono text-[11px]">Confidence:</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => onUpdate({ confidence_rating: star })}
                  className={`text-sm transition-transform active:scale-125 focus:outline-none ${
                    problem.confidence_rating >= star ? "text-amber-400" : "text-zinc-700"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-zinc-400 font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>{problem.time_spent_minutes || 0}m spent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <span>{formatDate(problem.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
