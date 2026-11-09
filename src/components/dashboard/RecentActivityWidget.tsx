"use client";

import React from "react";
import Link from "next/link";
import { History, ArrowRight, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Problem } from "@/types";

export interface RecentActivityWidgetProps {
  problems: Problem[];
}

export function RecentActivityWidget({ problems }: RecentActivityWidgetProps) {
  const recent = problems.slice(0, 4);

  return (
    <Card className="border border-[#232323] bg-[#141414] flex flex-col justify-between">
      <CardHeader className="py-3.5 px-4 sm:px-5 border-b border-[#232323] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-neutral-400" />
          <CardTitle className="text-xs uppercase font-mono tracking-wider text-neutral-300">
            Recent Activity Log
          </CardTitle>
        </div>
        <Link
          href="/problems"
          className="text-xs text-neutral-400 hover:text-white font-medium flex items-center gap-1 transition-colors"
        >
          <span>Vault</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-4 space-y-2">
        {recent.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500">
            No activity recorded yet. Add your first problem to start your log.
          </div>
        ) : (
          recent.map((prob) => (
            <div
              key={prob.id}
              className="p-2.5 rounded-lg bg-[#181818] border border-[#262626] text-xs flex items-center justify-between hover:border-[#383838] transition-all"
            >
              <div className="space-y-0.5 max-w-[200px]">
                <div className="flex items-center gap-1.5">
                  <Badge
                    dot
                    variant={
                      prob.difficulty === "Easy"
                        ? "success"
                        : prob.difficulty === "Medium"
                        ? "warning"
                        : "danger"
                    }
                    className="text-[9px] px-1.5 py-0"
                  >
                    {prob.difficulty}
                  </Badge>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {prob.primary_topic || "General"}
                  </span>
                </div>
                <Link
                  href={`/problems/${prob.id}`}
                  className="font-medium text-white hover:text-neutral-300 block truncate transition-colors"
                >
                  {prob.title}
                </Link>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[10px] text-neutral-500 font-mono">
                  {formatDate(prob.created_at)}
                </span>
                <Link
                  href={`/problems/${prob.id}`}
                  className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                  title="Open Learning Journal"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
