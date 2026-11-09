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
        return <Badge variant="success" dot>Mastered</Badge>;
      case "Solved Independently":
        return <Badge variant="success" dot>Independent</Badge>;
      case "Solved With Hint":
        return <Badge variant="warning" dot>Hint Used</Badge>;
      case "Needs Revision":
        return <Badge variant="danger" dot>Needs Revision</Badge>;
      case "Attempted":
        return <Badge variant="purple" dot>Attempted</Badge>;
      default:
        return <Badge variant="secondary" dot>Not Started</Badge>;
    }
  };

  const getDifficultyBadge = (diff: Problem["difficulty"]) => {
    switch (diff) {
      case "Easy":
        return (
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            Easy
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1.5 text-amber-400 font-mono text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            Medium
          </span>
        );
      case "Hard":
        return (
          <span className="inline-flex items-center gap-1.5 text-rose-400 font-mono text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
            Hard
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-white/[0.07] bg-[#0c0e14] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
      <table className="w-full text-left text-xs text-zinc-300">
        <thead className="bg-zinc-900/60 text-zinc-400 font-mono uppercase tracking-wider text-[10px] border-b border-white/[0.06]">
          <tr>
            <th className="p-3 w-8 text-center">★</th>
            <th className="p-3">Problem</th>
            <th className="p-3">Platform</th>
            <th className="p-3">Difficulty</th>
            <th className="p-3">Topic</th>
            <th className="p-3">Status</th>
            <th className="p-3">Confidence</th>
            <th className="p-3">Time</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {problems.map((p) => (
            <tr key={p.id} className="hover:bg-white/[0.03] transition-colors group">
              {/* Bookmark Toggle */}
              <td className="p-3 text-center">
                <button
                  onClick={() => onToggleBookmark(p.id, p.is_bookmarked)}
                  className="transition-transform active:scale-125 focus:outline-none"
                  title={p.is_bookmarked ? "Remove bookmark" : "Bookmark problem"}
                >
                  <Star
                    className={`w-3.5 h-3.5 transition-colors ${
                      p.is_bookmarked
                        ? "text-amber-400 fill-amber-400"
                        : "text-zinc-600 hover:text-zinc-400"
                    }`}
                  />
                </button>
              </td>

              {/* Title & Link */}
              <td className="p-3 font-medium text-white max-w-xs">
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/problems/${p.id}`}
                    className="hover:text-indigo-400 truncate max-w-[240px] transition-colors font-medium text-zinc-100"
                  >
                    {p.title}
                  </Link>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-zinc-300 shrink-0 transition-colors"
                    title="Open on official platform"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </td>

              {/* Platform */}
              <td className="p-3">
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.08] text-[11px] font-mono text-zinc-300">
                  {p.platform}
                </span>
              </td>

              {/* Difficulty */}
              <td className="p-3">{getDifficultyBadge(p.difficulty)}</td>

              {/* Topic */}
              <td className="p-3">
                <span className="text-zinc-400 font-mono text-[11px]">{p.primary_topic || "General"}</span>
              </td>

              {/* Status */}
              <td className="p-3">{getStatusBadge(p.status)}</td>

              {/* Confidence Stars */}
              <td className="p-3">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${
                        i < p.confidence_rating ? "text-amber-400" : "text-zinc-700"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </td>

              {/* Time Spent */}
              <td className="p-3 text-zinc-400 font-mono text-[11px]">
                {p.time_spent_minutes ? `${p.time_spent_minutes}m` : "—"}
              </td>

              {/* Actions */}
              <td className="p-3 text-right">
                <div className="flex items-center justify-end gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/problems/${p.id}`}
                    className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                    title="Open Learning Journal"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => onDeleteProblem(p.id)}
                    className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Problem"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
