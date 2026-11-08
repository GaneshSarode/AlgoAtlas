"use client";

import React from "react";
import Link from "next/link";
import { Globe2, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import type { PlatformStat } from "@/types";

export interface PlatformBreakdownProps {
  platformStats: PlatformStat[];
}

export function PlatformBreakdown({ platformStats }: PlatformBreakdownProps) {
  return (
    <Card className="border-[#1f2433] bg-[#12141e]">
      <CardHeader className="py-4 px-5 border-b border-[#1f2433] flex flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-brand-400" />
          Coding Platforms Distribution
        </CardTitle>
        <Link
          href="/integrations"
          className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
        >
          Manage <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {platformStats.map((stat) => (
            <div
              key={stat.platform}
              className="p-3 rounded-lg bg-[#161a26] border border-[#23293a] flex flex-col justify-between space-y-2 hover:border-[#333c54] transition-colors"
            >
              <div>
                <span className="text-xs font-bold text-white block line-clamp-1">
                  {stat.platform}
                </span>
                {stat.rating ? (
                  <span className="text-[10px] font-mono text-purple-400 font-bold">
                    Rating: {stat.rating}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-500">Handle connected</span>
                )}
              </div>

              <div>
                <span className="text-lg font-bold font-mono text-white block">
                  {stat.solved_count}
                </span>
                <div className="flex items-center gap-1 text-[9px] text-gray-400">
                  <span className="text-emerald-400">{stat.easy_count}E</span>
                  <span>•</span>
                  <span className="text-amber-400">{stat.medium_count}M</span>
                  <span>•</span>
                  <span className="text-rose-400">{stat.hard_count}H</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
