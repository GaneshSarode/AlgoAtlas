"use client";

import React from "react";
import type { UserActivity } from "@/types";

export interface HeatmapCalendarProps {
  activities: UserActivity[];
}

export function HeatmapCalendar({ activities }: HeatmapCalendarProps) {
  const activityMap = new Map<string, number>();
  activities.forEach((a) => activityMap.set(a.activity_date, a.problems_solved));

  // Generate last 26 weeks (182 days) aligned into 7-day columns
  const weeks: { dateStr: string; count: number; dayOfWeek: number }[][] = [];
  const now = new Date();
  
  // End on the current day's end of week or today
  const totalDays = 26 * 7;
  let currentWeek: { dateStr: string; count: number; dayOfWeek: number }[] = [];

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const item = {
      dateStr,
      count: activityMap.get(dateStr) || 0,
      dayOfWeek: d.getDay(),
    };
    currentWeek.push(item);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const getColor = (count: number) => {
    if (count === 0) return "bg-zinc-900 border-white/[0.04]";
    if (count === 1) return "bg-emerald-950/80 border-emerald-800/40 text-emerald-300";
    if (count === 2) return "bg-emerald-700/80 border-emerald-500/50 text-emerald-200";
    if (count >= 3) return "bg-emerald-500 border-emerald-400 text-emerald-100 shadow-[0_0_6px_rgba(52,211,153,0.4)]";
    return "bg-zinc-900 border-white/[0.04]";
  };

  const totalSolvedInPeriod = activities.reduce((sum, a) => sum + (a.problems_solved || 0), 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs">
        <div>
          <span className="font-semibold text-white tracking-tight font-sans">
            Daily Problem-Solving Consistency
          </span>
          <span className="text-[11px] text-zinc-500 font-mono ml-2">
            ({totalSolvedInPeriod} solves in last 6 months)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-zinc-900 border border-white/[0.05]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-950/80 border border-emerald-800/40" />
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-700/80 border border-emerald-500/50" />
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 border border-emerald-400" />
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex gap-1 min-w-[560px]">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {week.map((d) => (
                <div
                  key={d.dateStr}
                  title={`${d.dateStr}: ${d.count} ${d.count === 1 ? "problem" : "problems"} solved`}
                  className={`w-3 h-3 rounded-[3px] border transition-all duration-100 hover:scale-125 cursor-pointer ${getColor(
                    d.count
                  )}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
