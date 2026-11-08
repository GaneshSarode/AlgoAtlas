"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Star, BookOpen, Clock, Trash2 } from "lucide-react";
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {problems.map((p) => (
        <Card
          key={p.id}
          className="hover:border-[#2f3852] transition-all bg-[#12141e] flex flex-col justify-between"
        >
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#1b1f2e] text-gray-400 border border-[#272e42]">
                    {p.platform}
                  </span>
                  <Badge
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
                  className="text-sm font-semibold text-white hover:text-brand-400 line-clamp-1 block transition-colors"
                >
                  {p.title}
                </Link>
              </div>

              <button
                onClick={() => onToggleBookmark(p.id, p.is_bookmarked)}
                className={`p-1 transition-colors ${
                  p.is_bookmarked ? "text-amber-400" : "text-gray-600 hover:text-gray-400"
                }`}
              >
                ★
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-[#1c2132]">
              <span>{p.primary_topic || "General"}</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{p.time_spent_minutes || 0}m</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                {"★".repeat(p.confidence_rating)}
                <span className="text-gray-600">{"★".repeat(5 - p.confidence_rating)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/problems/${p.id}`}
                  className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Journal
                </Link>
                <button
                  onClick={() => onDeleteProblem(p.id)}
                  className="text-gray-600 hover:text-rose-400 transition-colors p-1"
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
