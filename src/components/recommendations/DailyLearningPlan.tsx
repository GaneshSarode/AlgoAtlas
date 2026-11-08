"use client";

import React, { useState } from "react";
import { CheckSquare, Square, Clock, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import type { RecommendationItem } from "@/services/recommendationEngine";

export interface DailyLearningPlanProps {
  recommendations: RecommendationItem[];
  targetHours: number;
  onTargetHoursChange: (hours: number) => void;
}

export function DailyLearningPlan({
  recommendations,
  targetHours,
  onTargetHoursChange,
}: DailyLearningPlanProps) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const toggleTask = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const completedCount = completedIds.size;
  const totalCount = recommendations.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Card className="border-[#1f2433] bg-[#12141e]">
      <CardHeader className="py-4 px-5 border-b border-[#1f2433] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            Today's Daily Learning Plan
          </CardTitle>
          <span className="text-xs text-gray-400">
            {completedCount} of {totalCount} daily goals checked off ({progressPercent}%)
          </span>
        </div>

        {/* Target Study Hours Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-500" /> Daily Target:
          </span>
          <div className="flex items-center bg-[#181b26] border border-[#272f44] rounded-lg p-0.5 text-xs">
            {[1, 2, 3, 4].map((hrs) => (
              <button
                key={hrs}
                onClick={() => onTargetHoursChange(hrs)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  targetHours === hrs
                    ? "bg-brand-600 text-white font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {hrs}h
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-3">
        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#1b2030] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-600 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Tasks Checklist */}
        <div className="space-y-2 pt-2">
          {recommendations.map((item, idx) => {
            const isDone = completedIds.has(item.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleTask(item.id)}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer text-xs ${
                  isDone
                    ? "bg-[#111722]/60 border-emerald-900/30 text-gray-500"
                    : "bg-[#161a26] border-[#22283a] text-gray-200 hover:border-[#2f3852]"
                }`}
              >
                <button
                  type="button"
                  className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                    isDone
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "border-[#313b54] bg-[#1a1f2e]"
                  }`}
                >
                  {isDone && <CheckSquare className="w-3.5 h-3.5" />}
                </button>

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-semibold ${
                        isDone ? "line-through text-gray-500" : "text-white"
                      }`}
                    >
                      {idx + 1}. {item.title}
                    </span>
                    <span className="text-[11px] font-mono text-gray-500">
                      ~{item.estimatedMinutes}m
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
