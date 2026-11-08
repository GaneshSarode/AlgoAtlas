"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Brain, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import type { LearningIntelligenceSummary as ILearningSummary } from "@/types";

export interface LearningIntelligenceSummaryProps {
  summary: ILearningSummary;
}

export function LearningIntelligenceSummary({ summary }: LearningIntelligenceSummaryProps) {
  return (
    <Card className="border-brand-500/30 bg-gradient-to-br from-[#12141f] via-[#141724] to-[#181524]">
      <CardHeader className="py-4 px-5 border-b border-[#23293d] flex flex-row items-center justify-between">
        <CardTitle className="text-base text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          Your Learning Intelligence
        </CardTitle>
        <Link
          href="/recommendations"
          className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
        >
          View Full Plan <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Headline diagnosis */}
        <p className="text-sm font-semibold text-gray-200 leading-snug">
          "{summary.headline}"
        </p>

        {/* Tags Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          {/* Strongest topics */}
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Strongest Topics
            </span>
            <p className="text-gray-200 font-medium">
              {summary.strongest_topics.length > 0
                ? summary.strongest_topics.join(", ")
                : "Building mastery records"}
            </p>
          </div>

          {/* Weakest topics */}
          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/40 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Needs Practice
            </span>
            <p className="text-gray-200 font-medium">
              {summary.weakest_topics.length > 0
                ? summary.weakest_topics.join(", ")
                : "No critical weaknesses"}
            </p>
          </div>

          {/* Hint dependency */}
          <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-900/40 space-y-1">
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Hint Dependency
            </span>
            <p className="text-gray-200 font-medium">
              {summary.frequently_needed_hints_topics.length > 0
                ? summary.frequently_needed_hints_topics.join(", ")
                : "Independent solves dominant"}
            </p>
          </div>
        </div>

        {/* Advice Bullets */}
        <div className="space-y-1.5 pt-1">
          {summary.advice_bullets.map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
              <span className="text-purple-400 font-bold shrink-0">→</span>
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
