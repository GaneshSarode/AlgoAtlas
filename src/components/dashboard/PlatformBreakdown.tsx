"use client";

import React from "react";
import Link from "next/link";
import { Globe2, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import type { PlatformStat } from "@/types";

export interface PlatformBreakdownProps {
  platformStats: PlatformStat[];
}

export function PlatformBreakdown({ platformStats }: PlatformBreakdownProps) {
  return (
    <Card className="border border-white/[0.07] bg-[#0c0e14]">
      <CardHeader className="py-3.5 px-4 sm:px-5 border-b border-white/[0.06] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe2 className="w-3.5 h-3.5 text-zinc-400" />
          <CardTitle className="text-xs uppercase font-mono tracking-wider text-zinc-300">
            Coding Platforms Distribution
          </CardTitle>
        </div>
        <Link
          href="/integrations"
          className="text-xs text-zinc-400 hover:text-white font-medium flex items-center gap-1 transition-colors"
        >
          <span>Manage APIs</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {platformStats.map((stat) => (
            <div
              key={stat.platform}
              className="p-3 rounded-lg bg-zinc-900/50 border border-white/[0.06] hover:border-white/[0.14] transition-all flex flex-col justify-between space-y-2 group"
            >
              <div>
                <span className="text-xs font-semibold text-zinc-200 block truncate group-hover:text-white transition-colors">
                  {stat.platform}
                </span>
                {stat.rating ? (
                  <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                    Rating {stat.rating}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-500">Connected</span>
                )}
              </div>

              <div>
                <span className="text-xl font-bold font-mono text-white block">
                  {stat.solved_count}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 mt-1">
                  <span className="text-emerald-400 font-medium">{stat.easy_count}E</span>
                  <span className="text-zinc-600">/</span>
                  <span className="text-amber-400 font-medium">{stat.medium_count}M</span>
                  <span className="text-zinc-600">/</span>
                  <span className="text-rose-400 font-medium">{stat.hard_count}H</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
