"use client";

import React from "react";
import type { UserActivity } from "@/types";

export interface HeatmapCalendarProps {
  activities: UserActivity[];
}

export function HeatmapCalendar({ activities }: HeatmapCalendarProps) {
  const activityMap = new Map<string, number>();
  activities.forEach((a) => activityMap.set(a.activity_date, a.problems_solved));

  // Generate last 180 days (approx 26 weeks) for clean responsive layout
  const days: { dateStr: string; count: number; dayOfWeek: number }[] = [];
  const now = new Date();
  for (let i = 180; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    days.push({
      dateStr,
      count: activityMap.get(dateStr) || 0,
      dayOfWeek: d.getDay(),
    });
  }

  const getColor = (count: number) => {
    if (count === 0) return "bg-[#161a25] border-[#222839]";
    if (count === 1) return "bg-emerald-950 border-emerald-800/80";
    if (count === 2) return "bg-emerald-800 border-emerald-600";
    if (count >= 3) return "bg-emerald-500 border-emerald-300";
    return "bg-[#161a25]";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="font-semibold text-white">Daily Problem-Solving Consistency (Last 6 Months)</span>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-[#161a25] border border-[#222839]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-950 border border-emerald-800" />
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-800 border border-emerald-600" />
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 border border-emerald-300" />
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex gap-1 min-w-[500px]">
          {days.map((d, idx) => (
            <div
              key={d.dateStr}
              title={`${d.dateStr}: ${d.count} ${d.count === 1 ? "problem" : "problems"} solved`}
              className={`w-3.5 h-3.5 rounded-sm border transition-transform hover:scale-125 cursor-pointer shrink-0 ${getColor(
                d.count
              )}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
