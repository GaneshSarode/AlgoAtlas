"use client";

import React from "react";

export interface RoadmapProgressBarProps {
  completed: number;
  total: number;
  easyCount?: number;
  mediumCount?: number;
  hardCount?: number;
}

export function RoadmapProgressBar({
  completed,
  total,
  easyCount = 0,
  mediumCount = 0,
  hardCount = 0,
}: RoadmapProgressBarProps) {
  const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-300 font-medium">
          Completion: <strong className="text-white">{completed}</strong> / {total} problems
        </span>
        <span className="font-mono font-bold text-brand-400">{percent}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 rounded-full bg-[#1b2030] overflow-hidden border border-[#252c42]">
        <div
          className="h-full bg-gradient-to-r from-brand-600 via-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Difficulty Breakdown */}
      <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-0.5">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Easy: <strong className="text-gray-200">{easyCount}</strong>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          Medium: <strong className="text-gray-200">{mediumCount}</strong>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          Hard: <strong className="text-gray-200">{hardCount}</strong>
        </span>
      </div>
    </div>
  );
}
