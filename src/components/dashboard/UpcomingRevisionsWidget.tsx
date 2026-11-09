"use client";

import React from "react";
import Link from "next/link";
import { Repeat, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import type { RevisionItem } from "@/types";

export interface UpcomingRevisionsWidgetProps {
  revisions: RevisionItem[];
}

export function UpcomingRevisionsWidget({ revisions }: UpcomingRevisionsWidgetProps) {
  const pending = revisions
    .filter((r) => r.recall_grade !== "Mastered")
    .slice(0, 4);

  return (
    <Card className="border border-white/[0.07] bg-[#0c0e14] flex flex-col justify-between">
      <CardHeader className="py-3.5 px-4 sm:px-5 border-b border-white/[0.06] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Repeat className="w-3.5 h-3.5 text-zinc-400" />
          <CardTitle className="text-xs uppercase font-mono tracking-wider text-zinc-300">
            Pending Revisions ({revisions.filter((r) => r.is_overdue).length} overdue)
          </CardTitle>
        </div>
        <Link
          href="/revision"
          className="text-xs text-zinc-400 hover:text-white font-medium flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-4 space-y-2">
        {pending.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500 space-y-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
            <p className="text-zinc-300 font-medium">All revisions completed</p>
            <p className="text-[11px] text-zinc-500">Your spaced repetition queue is clear.</p>
          </div>
        ) : (
          pending.map((rev) => (
            <div
              key={rev.id}
              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                rev.is_overdue
                  ? "bg-rose-500/[0.04] border-rose-500/20"
                  : "bg-zinc-900/50 border-white/[0.06] hover:border-white/[0.12]"
              }`}
            >
              <div className="space-y-0.5 max-w-[200px]">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-zinc-400">
                    {rev.problem_platform}
                  </span>
                  {rev.is_overdue && (
                    <Badge variant="danger" dot className="text-[9px] px-1.5 py-0">
                      Overdue
                    </Badge>
                  )}
                </div>
                <Link
                  href={`/problems/${rev.problem_id}`}
                  className="font-medium text-white hover:text-indigo-400 block truncate transition-colors"
                >
                  {rev.problem_title}
                </Link>
              </div>

              <Link
                href={`/revision/practice?problemId=${rev.problem_id}`}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-[11px] transition-colors shrink-0 shadow-sm"
              >
                <Play className="w-2.5 h-2.5 fill-zinc-950" />
                <span>Revise</span>
              </Link>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
