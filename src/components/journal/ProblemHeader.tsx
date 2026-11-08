"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Clock,
  Bookmark,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { formatDate } from "@/lib/utils";
import type { Problem, ProblemStatus } from "@/types";

export interface ProblemHeaderProps {
  problem: Problem;
  onUpdate: (updates: Partial<Problem>) => void;
  saveStatus: "idle" | "saving" | "saved";
}

export function ProblemHeader({ problem, onUpdate, saveStatus }: ProblemHeaderProps) {
  return (
    <div className="bg-[#12141d] border border-[#1f2433] rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/problems"
            className="p-2 rounded-lg bg-[#181b26] border border-[#272e42] text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
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
              <span className="text-xs text-gray-400">
                {problem.primary_topic || "DSA"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1 flex items-center gap-2">
              {problem.title}
              <a
                href={problem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-300 transition-colors"
                title="View original problem"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </h1>
          </div>
        </div>

        {/* Save confirmation & Actions */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {saveStatus === "saving" && (
            <span className="text-xs text-amber-400 font-mono animate-pulse">
              Autosaving...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved
            </span>
          )}

          <button
            onClick={() => onUpdate({ is_bookmarked: !problem.is_bookmarked })}
            className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-medium ${
              problem.is_bookmarked
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-[#181b26] text-gray-400 border-[#272e42] hover:text-white"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${problem.is_bookmarked ? "fill-amber-400" : ""}`} />
            <span className="hidden sm:inline">Bookmark</span>
          </button>
        </div>
      </div>

      {/* Status, Confidence & Time Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#1f2433] text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Status:</span>
            <select
              value={problem.status}
              onChange={(e) => onUpdate({ status: e.target.value as ProblemStatus })}
              className="bg-[#181b26] border border-[#272e42] rounded-md px-2.5 py-1 text-white focus:outline-none focus:border-brand-500 text-xs"
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
            <span className="text-gray-400">Confidence:</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => onUpdate({ confidence_rating: star })}
                  className={`text-base ${
                    problem.confidence_rating >= star ? "text-amber-400" : "text-gray-600"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Time: {problem.time_spent_minutes || 0}m</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Added: {formatDate(problem.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
