"use client";

import React from "react";
import Link from "next/link";
import { Star, BookOpen, Clock, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import type { Problem } from "@/types";

export interface ProblemCardListProps {
  problems: Problem[];
  onToggleBookmark: (problemId: string, current: boolean) => void;
  onDeleteProblem: (problemId: string) => void;
}

export function ProblemCardList({
  problems,
  onToggleBookmark,
  onDeleteProblem,
}: ProblemCardListProps) {
  if (problems.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {problems.map((p) => (
        <Card
          key={p.id}
          className="hover:border-[#383838] transition-all bg-[#141414] border-[#232323] flex flex-col justify-between group shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]"
        >
          <CardContent className="p-3.5 sm:p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#181818] text-neutral-400 border border-[#262626]">
                    {p.platform}
                  </span>
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
                </div>
                <Link
                  href={`/problems/${p.id}`}
                  className="text-xs sm:text-sm font-semibold text-white hover:text-neutral-300 line-clamp-1 block transition-colors"
                >
                  {p.title}
                </Link>
              </div>

              <button
                onClick={() => onToggleBookmark(p.id, p.is_bookmarked)}
                className="p-1 transition-transform active:scale-125 focus:outline-none"
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    p.is_bookmarked
                      ? "text-amber-400 fill-amber-400"
                      : "text-neutral-600 hover:text-neutral-400"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-[#232323]">
              <span className="font-mono text-[11px] text-neutral-400">{p.primary_topic || "General"}</span>
              <div className="flex items-center gap-1 font-mono text-[11px] text-neutral-500">
                <Clock className="w-3 h-3" />
                <span>{p.time_spent_minutes || 0}m</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-0.5 text-xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={i < p.confidence_rating ? "text-amber-400" : "text-neutral-700"}
                  >
                    ★
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/problems/${p.id}`}
                  className="flex items-center gap-1 text-xs text-neutral-300 hover:text-white transition-colors font-medium px-2 py-0.5 rounded bg-[#181818] border border-[#262626]"
                >
                  <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Journal</span>
                </Link>
                <button
                  onClick={() => onDeleteProblem(p.id)}
                  className="text-neutral-600 hover:text-rose-400 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
