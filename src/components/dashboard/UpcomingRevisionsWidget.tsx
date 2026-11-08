"use client";

import React from "react";
import Link from "next/link";
import { Repeat, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { formatDate } from "@/lib/utils";
import type { RevisionItem } from "@/types";

export interface UpcomingRevisionsWidgetProps {
  revisions: RevisionItem[];
}

export function UpcomingRevisionsWidget({ revisions }: UpcomingRevisionsWidgetProps) {
  const pending = revisions
    .filter((r) => r.recall_grade !== "Mastered")
    .slice(0, 4);

  return (
    <Card className="border-[#1f2433] bg-[#12141e] flex flex-col justify-between">
      <CardHeader className="py-4 px-5 border-b border-[#1f2433] flex flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">
          <Repeat className="w-4 h-4 text-brand-400" />
          Pending Spaced Revisions ({revisions.filter((r) => r.is_overdue).length} overdue)
        </CardTitle>
        <Link
          href="/revision"
          className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
        >
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5">
        {pending.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500 space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
            <p>All revisions cleared! You are fully caught up.</p>
          </div>
        ) : (
          pending.map((rev) => (
            <div
              key={rev.id}
              className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                rev.is_overdue
                  ? "bg-[#181216] border-rose-900/40"
                  : "bg-[#161a26] border-[#222839]"
              }`}
            >
              <div className="space-y-0.5 max-w-[200px]">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-gray-400">
                    {rev.problem_platform}
                  </span>
                  {rev.is_overdue && (
                    <Badge variant="danger" className="text-[9px] px-1 py-0">
                      Overdue
                    </Badge>
                  )}
                </div>
                <Link
                  href={`/problems/${rev.problem_id}`}
                  className="font-semibold text-white hover:text-brand-400 block truncate"
                >
                  {rev.problem_title}
                </Link>
              </div>

              <Link
                href={`/revision/practice?problemId=${rev.problem_id}`}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-brand-600 hover:bg-brand-500 text-white font-semibold text-[11px] transition-colors shrink-0"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Revise</span>
              </Link>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
