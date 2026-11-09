"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import type { LearningIntelligenceSummary as ILearningSummary } from "@/types";

export interface LearningIntelligenceSummaryProps {
  summary: ILearningSummary;
}

export function LearningIntelligenceSummary({ summary }: LearningIntelligenceSummaryProps) {
  return (
    <Card className="border border-[#232323] bg-[#141414] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_4px_20px_-4px_rgba(0,0,0,0.6)]">
      <CardHeader className="py-3.5 px-4 sm:px-5 border-b border-[#232323] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-neutral-800 border border-[#2a2a2a] flex items-center justify-center text-neutral-400">
            <Sparkles className="w-3 h-3" />
          </div>
          <CardTitle className="text-xs uppercase font-mono tracking-wider text-neutral-300">
            Your Learning Intelligence
          </CardTitle>
        </div>
        <Link
          href="/recommendations"
          className="text-xs text-neutral-400 hover:text-white font-medium flex items-center gap-1 transition-colors"
        >
          <span>Recommended Next Plan</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Headline diagnosis */}
        <div className="p-3.5 rounded-lg bg-[#181818] border border-[#262626]">
          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans">
            {summary.headline}
          </p>
        </div>

        {/* 3 Status Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          {/* Strongest */}
          <div className="p-3 rounded-lg bg-[#181818] border border-[#262626] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-semibold text-emerald-400 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Strongest Areas</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {summary.strongest_topics.length > 0 ? (
                summary.strongest_topics.map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[11px]"
                  >
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-neutral-500 font-mono text-[11px]">Building records...</span>
              )}
            </div>
          </div>

          {/* Weakest */}
          <div className="p-3 rounded-lg bg-[#181818] border border-[#262626] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-semibold text-amber-400 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Needs Practice</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {summary.weakest_topics.length > 0 ? (
                summary.weakest_topics.map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[11px]"
                  >
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-neutral-500 font-mono text-[11px]">No critical gaps</span>
              )}
            </div>
          </div>

          {/* Hint dependency */}
          <div className="p-3 rounded-lg bg-[#181818] border border-[#262626] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-semibold text-neutral-400 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
              <span>Hint Dependency</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {summary.frequently_needed_hints_topics.length > 0 ? (
                summary.frequently_needed_hints_topics.map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-neutral-800 border border-[#2a2a2a] text-neutral-300 font-mono text-[11px]"
                  >
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-neutral-500 font-mono text-[11px]">Dominantly independent</span>
              )}
            </div>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="space-y-1.5 pt-1">
          {summary.advice_bullets.map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
              <span className="text-neutral-500 font-mono text-[10px] mt-0.5 shrink-0">
                0{idx + 1}
              </span>
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
