"use client";

import React from "react";
import Link from "next/link";
import { Repeat, Calendar, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { formatDate } from "@/lib/utils";
import type { RevisionItem } from "@/types";

export interface RevisionQueueCardProps {
  item: RevisionItem;
  isOverdue?: boolean;
}

export function RevisionQueueCard({ item, isOverdue = false }: RevisionQueueCardProps) {
  return (
    <Card
      className={`border transition-all flex flex-col justify-between ${
        isOverdue
          ? "bg-[#181216] border-rose-900/40 hover:border-rose-700/60"
          : "bg-[#12141e] border-[#1e2333] hover:border-[#2f3852]"
      }`}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1c2132] text-gray-400 border border-[#272e42]">
                {item.problem_platform || "DSA"}
              </span>
              <Badge
                variant={
                  item.problem_difficulty === "Easy"
                    ? "success"
                    : item.problem_difficulty === "Medium"
                    ? "warning"
                    : "danger"
                }
              >
                {item.problem_difficulty || "Medium"}
              </Badge>
              {isOverdue && (
                <Badge variant="danger" className="text-[10px] animate-pulse">
                  Overdue
                </Badge>
              )}
            </div>

            <Link
              href={`/problems/${item.problem_id}`}
              className="text-sm font-semibold text-white hover:text-brand-400 block transition-colors line-clamp-1 pt-0.5"
            >
              {item.problem_title}
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-[#1c2132]">
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Calendar className="w-3 h-3 text-gray-500" />
            Due: {formatDate(item.scheduled_for)}
          </span>
          <span className="text-gray-400 text-[11px]">
            Interval: <strong>{item.interval_stage}d</strong>
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-gray-500">
            Reviewed: {item.review_count} {item.review_count === 1 ? "time" : "times"}
          </span>

          <Link
            href={`/revision/practice?problemId=${item.problem_id}`}
            className="flex items-center gap-1 text-xs text-brand-400 hover:text-white bg-brand-600/20 hover:bg-brand-600 border border-brand-500/40 px-2.5 py-1 rounded-md font-semibold transition-all"
          >
            <Repeat className="w-3 h-3" />
            <span>Revise Now</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
