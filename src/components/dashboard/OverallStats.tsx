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
      subtitle: `${stats.total_attempts} logged attempts`,
      icon: FolderCode,
      badge: "Vault",
    },
    {
      label: "Independently Solved",
      value: stats.independently_solved,
      subtitle: `${stats.total_problems > 0 ? Math.round((stats.independently_solved / stats.total_problems) * 100) : 0}% unassisted`,
      icon: CheckCircle2,
      accent: "text-emerald-400",
    },
    {
      label: "Solved With Hints",
      value: stats.solved_with_hint,
      subtitle: "Target for recall",
      icon: HelpCircle,
      accent: "text-amber-400",
    },
    {
      label: "Needs Revision",
      value: stats.needs_revision,
      subtitle: "Scheduled in queue",
      icon: Repeat,
      accent: stats.needs_revision > 0 ? "text-rose-400" : "text-zinc-400",
    },
    {
      label: "Mastered Patterns",
      value: stats.mastered,
      subtitle: "High recall retention",
      icon: Award,
      accent: "text-indigo-400",
    },
    {
      label: "Learning Streak",
      value: `${stats.current_streak}d`,
      subtitle: "Consecutive days active",
      icon: Flame,
      accent: "text-amber-400",
    },
    {
      label: "Total Practice Time",
      value: `${Math.round(stats.total_practice_time_minutes / 60)}h`,
      subtitle: `${stats.total_practice_time_minutes % 60}m recorded`,
      icon: Clock,
      accent: "text-zinc-300",
    },
    {
      label: "Not Attempted",
      value: stats.not_attempted,
      subtitle: "In study backlog",
      icon: Target,
      accent: "text-zinc-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-[#0c0e14] border border-white/[0.07] hover:border-white/[0.14] transition-all duration-150 flex flex-col justify-between group shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-400 font-medium tracking-tight">
                {card.label}
              </span>
              <Icon className={`w-3.5 h-3.5 ${card.accent || "text-zinc-400"} shrink-0 group-hover:scale-110 transition-transform`} />
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-white block">
                {card.value}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block truncate">
                {card.subtitle}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
