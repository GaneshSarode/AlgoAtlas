"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Star, BookOpen, Trash2 } from "lucide-react";
import { Badge } from "@/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Problem } from "@/types";

export interface ProblemTableProps {
  problems: Problem[];
  onToggleBookmark: (problemId: string, current: boolean) => void;
  onDeleteProblem: (problemId: string) => void;
}

export function ProblemTable({
  problems,
  onToggleBookmark,
  onDeleteProblem,
}: ProblemTableProps) {
  if (problems.length === 0) {
    return null;
  }

  const getStatusBadge = (status: Problem["status"]) => {
    switch (status) {
      case "Mastered":
        return <Badge variant="success">Mastered</Badge>;
      case "Solved Independently":
        return <Badge variant="success">Solved (Independent)</Badge>;
      case "Solved With Hint":
        return <Badge variant="warning">Solved (Hint)</Badge>;
      case "Needs Revision":
        return <Badge variant="danger">Needs Revision</Badge>;
      case "Attempted":
        return <Badge variant="purple">Attempted</Badge>;
      default:
        return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  const getDifficultyBadge = (diff: Problem["difficulty"]) => {
    switch (diff) {
      case "Easy":
        return <span className="text-emerald-400 font-medium text-xs">Easy</span>;
      case "Medium":
        return <span className="text-amber-400 font-medium text-xs">Medium</span>;
      case "Hard":
        return <span className="text-rose-400 font-medium text-xs">Hard</span>;
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-[#1f2433] bg-[#12141d]">
      <table className="w-full text-left text-xs text-gray-300">
        <thead className="bg-[#171a25] text-gray-400 uppercase tracking-wider text-[10px] border-b border-[#1f2433]">
          <tr>
            <th className="p-3.5 w-10 text-center">★</th>
            <th className="p-3.5">Problem</th>
            <th className="p-3.5">Platform</th>
            <th className="p-3.5">Difficulty</th>
            <th className="p-3.5">Topic</th>
            <th className="p-3.5">Status</th>
            <th className="p-3.5">Confidence</th>
            <th className="p-3.5">Time</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1f2433]">
          {problems.map((p) => (
            <tr key={p.id} className="hover:bg-[#161924] transition-colors group">
              {/* Bookmark Toggle */}
              <td className="p-3.5 text-center">
                <button
                  onClick={() => onToggleBookmark(p.id, p.is_bookmarked)}
                  className={`transition-colors ${
                    p.is_bookmarked ? "text-amber-400" : "text-gray-600 hover:text-gray-400"
                  }`}
                  title={p.is_bookmarked ? "Remove bookmark" : "Bookmark problem"}
                >
                  ★
                </button>
              </td>

              {/* Title & Link */}
              <td className="p-3.5 font-medium text-white max-w-xs">
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/problems/${p.id}`}
                    className="hover:text-brand-400 truncate max-w-[220px] transition-colors"
                  >
                    {p.title}
                  </Link>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-300 shrink-0"
                    title="Open on official platform"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </td>

              {/* Platform */}
              <td className="p-3.5">
                <span className="px-2 py-0.5 rounded bg-[#1c202e] border border-[#272e42] text-[11px] font-mono text-gray-300">
                  {p.platform}
                </span>
              </td>

              {/* Difficulty */}
              <td className="p-3.5">{getDifficultyBadge(p.difficulty)}</td>

              {/* Topic */}
              <td className="p-3.5">
                <span className="text-gray-300">{p.primary_topic || "General"}</span>
              </td>

              {/* Status */}
              <td className="p-3.5">{getStatusBadge(p.status)}</td>

              {/* Confidence Stars */}
              <td className="p-3.5">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {"★".repeat(p.confidence_rating)}
                  <span className="text-gray-600">
                    {"★".repeat(5 - p.confidence_rating)}
                  </span>
                </div>
              </td>

              {/* Time Spent */}
              <td className="p-3.5 text-gray-400 font-mono">
                {p.time_spent_minutes ? `${p.time_spent_minutes}m` : "—"}
              </td>

              {/* Actions */}
              <td className="p-3.5 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/problems/${p.id}`}
                    className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-[#1f2434] transition-colors"
                    title="Open Learning Journal"
                  >
                    <BookOpen className="w-4 h-4 text-purple-400" />
                  </Link>
                  <button
                    onClick={() => onDeleteProblem(p.id)}
                    className="p-1.5 rounded-md text-gray-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="Delete Problem"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
