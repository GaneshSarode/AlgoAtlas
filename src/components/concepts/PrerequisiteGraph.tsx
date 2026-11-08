"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/ui/badge";
import type { TopicMastery } from "@/types";

export interface PrerequisiteGraphProps {
  currentSlug: string;
  prerequisites: string[];
  unlockedConcepts: string[];
  masteryMap: Map<string, TopicMastery>;
}

export function PrerequisiteGraph({
  currentSlug,
  prerequisites,
  unlockedConcepts,
  masteryMap,
}: PrerequisiteGraphProps) {
  return (
    <div className="p-4 rounded-xl bg-[#131622] border border-[#202738] space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-white">Concept Prerequisite Flow</span>
        <span className="text-gray-400">Mastery Graph Lineage</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Prerequisites */}
        {prerequisites.map((prereq) => {
          const m = masteryMap.get(prereq);
          const isComfortable = m?.learning_status === "Comfortable" || m?.learning_status === "Strong";

          return (
            <React.Fragment key={prereq}>
              <Link
                href={`/concepts/${prereq}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  isComfortable
                    ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-950/60"
                    : "bg-[#181b26] border-[#293144] text-gray-300 hover:text-white"
                }`}
              >
                {isComfortable ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-gray-500" />
                )}
                <span className="capitalize">{prereq.replace(/-/g, " ")}</span>
                <span className="text-[10px] text-gray-400">(Prereq)</span>
              </Link>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            </React.Fragment>
          );
        })}

        {/* Current Concept */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600/20 border border-brand-500/60 text-brand-300 font-semibold text-xs shadow-sm">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          <span className="capitalize">{currentSlug.replace(/-/g, " ")}</span>
          <span className="text-[10px] text-brand-400">(Current)</span>
        </div>

        {/* Unlocked Concepts */}
        {unlockedConcepts.map((unlocked) => (
          <React.Fragment key={unlocked}>
            <ArrowRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <Link
              href={`/concepts/${unlocked}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181b26] border border-[#293144] text-gray-400 hover:text-gray-200 transition-colors text-xs"
            >
              <Circle className="w-3.5 h-3.5 text-purple-400" />
              <span className="capitalize">{unlocked.replace(/-/g, " ")}</span>
              <span className="text-[10px] text-gray-500">(Next)</span>
            </Link>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
