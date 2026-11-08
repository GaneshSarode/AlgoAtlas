"use client";

import React from "react";
import {
  FolderCode,
  CheckCircle2,
  HelpCircle,
  Repeat,
  Award,
  Flame,
  Clock,
  Target,
} from "lucide-react";
import type { OverallStats as IOverallStats } from "@/types";

export interface OverallStatsProps {
  stats: IOverallStats;
}

export function OverallStats({ stats }: OverallStatsProps) {
  const cards = [
    {
      label: "Total Questions",
      value: stats.total_problems,
      subtitle: `${stats.total_attempts} total attempts`,
      icon: FolderCode,
      color: "text-brand-400",
      bg: "bg-brand-950/40 border-brand-900/40",
    },
    {
      label: "Independently Solved",
      value: stats.independently_solved,
      subtitle: "Unassisted solutions",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-950/40 border-emerald-900/40",
    },
    {
      label: "Solved With Hints",
      value: stats.solved_with_hint,
      subtitle: "Target for reinforcement",
      icon: HelpCircle,
      color: "text-amber-400",
      bg: "bg-amber-950/40 border-amber-900/40",
    },
    {
      label: "Needs Revision",
      value: stats.needs_revision,
      subtitle: "Scheduled in queue",
      icon: Repeat,
      color: "text-rose-400",
      bg: "bg-rose-950/40 border-rose-900/40",
    },
    {
      label: "Mastered Patterns",
      value: stats.mastered,
      subtitle: "High recall retention",
      icon: Award,
      color: "text-purple-400",
      bg: "bg-purple-950/40 border-purple-900/40",
    },
    {
      label: "Learning Streak",
      value: `${stats.current_streak}d`,
      subtitle: "Consecutive practice",
      icon: Flame,
      color: "text-orange-400",
      bg: "bg-orange-950/40 border-orange-900/40",
    },
    {
      label: "Total Practice Time",
      value: `${Math.round(stats.total_practice_time_minutes / 60)}h`,
      subtitle: `${stats.total_practice_time_minutes % 60}m recorded`,
      icon: Clock,
      color: "text-indigo-400",
      bg: "bg-indigo-950/40 border-indigo-900/40",
    },
    {
      label: "Not Attempted",
      value: stats.not_attempted,
      subtitle: "In study queue",
      icon: Target,
      color: "text-gray-400",
      bg: "bg-[#161a26] border-[#222839]",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl border transition-all ${card.bg} flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-300 font-medium line-clamp-1">{card.label}</span>
              <Icon className={`w-4 h-4 ${card.color} shrink-0`} />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold font-mono text-white block">
                {card.value}
              </span>
              <span className="text-[10px] text-gray-400">{card.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
