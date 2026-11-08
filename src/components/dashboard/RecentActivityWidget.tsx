"use client";

import React from "react";
import Link from "next/link";
import { History, ArrowRight, BookOpen, Clock } from "lucide-react";
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
    <Card className="border-[#1f2433] bg-[#12141e] flex flex-col justify-between">
      <CardHeader className="py-4 px-5 border-b border-[#1f2433] flex flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">
          <History className="w-4 h-4 text-brand-400" />
          Recent Activity & Problem Log
        </CardTitle>
        <Link
          href="/problems"
          className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
        >
          View Vault <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5">
        {recent.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500">
            No activity recorded yet. Add your first problem to start your log.
          </div>
        ) : (
          recent.map((prob) => (
            <div
              key={prob.id}
              className="p-3 rounded-lg bg-[#161a26] border border-[#222839] text-xs flex items-center justify-between hover:border-[#323a50] transition-colors"
            >
              <div className="space-y-0.5 max-w-[200px]">
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant={
                      prob.difficulty === "Easy"
                        ? "success"
                        : prob.difficulty === "Medium"
                        ? "warning"
                        : "danger"
                    }
                    className="text-[9px] px-1 py-0"
                  >
                    {prob.difficulty}
                  </Badge>
                  <span className="text-[10px] text-gray-500">
                    {prob.primary_topic || "General"}
                  </span>
                </div>
                <Link
                  href={`/problems/${prob.id}`}
                  className="font-semibold text-white hover:text-brand-400 block truncate"
                >
                  {prob.title}
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-gray-500 font-mono">
                  {formatDate(prob.created_at)}
                </span>
                <Link
                  href={`/problems/${prob.id}`}
                  className="p-1 rounded text-purple-400 hover:text-white hover:bg-purple-950/40"
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
