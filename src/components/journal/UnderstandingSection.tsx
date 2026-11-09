"use client";

import React from "react";
import { HelpCircle, AlertTriangle, Lightbulb } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import type { LearningNote } from "@/types";

export interface UnderstandingSectionProps {
  note: LearningNote;
  onChange: (updates: Partial<LearningNote>) => void;
}

export function UnderstandingSection({ note, onChange }: UnderstandingSectionProps) {
  return (
    <div className="space-y-4">
      {/* Problem Understanding Card */}
      <Card className="border-[#232323] bg-[#141414]">
        <CardHeader className="py-3 px-4 border-b border-[#232323]">
          <CardTitle className="text-sm flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-neutral-400" />
            1. Problem Understanding & Constraints
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              What is the problem actually asking?
            </label>
            <textarea
              rows={3}
              value={note.understanding_summary || ""}
              onChange={(e) => onChange({ understanding_summary: e.target.value })}
              placeholder="Summarize the core objective in your own words (e.g. Find contiguous subarray with maximum sum under O(N) time)..."
              className="w-full bg-[#181818] border border-[#262626] rounded-lg p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Key Observations & Constraints
            </label>
            <textarea
              rows={2}
              value={note.key_observation || ""}
              onChange={(e) => onChange({ key_observation: e.target.value })}
              placeholder="Crucial constraints (e.g. N <= 10^5 rules out O(N^2); array contains negatives so sliding window requires prefix sum)..."
              className="w-full bg-[#181818] border border-[#262626] rounded-lg p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 leading-relaxed"
            />
          </div>
        </CardContent>
      </Card>

      {/* Initial Approach & Failures */}
      <Card className="border-[#232323] bg-[#141414]">
        <CardHeader className="py-3 px-4 border-b border-[#232323]">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            2. Initial Instinct & What Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              What was your first thought / attempted idea?
            </label>
            <textarea
              rows={2}
              value={note.initial_thought || ""}
              onChange={(e) => onChange({ initial_thought: e.target.value })}
              placeholder="e.g. Tried greedy selection from left to right, or sorting the elements..."
              className="w-full bg-[#181818] border border-[#262626] rounded-lg p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Why did it fail or where did it fall short?
            </label>
            <textarea
              rows={2}
              value={note.what_failed || ""}
              onChange={(e) => onChange({ what_failed: e.target.value })}
              placeholder="e.g. Failed on negative weights counterexample; got Time Limit Exceeded (TLE) on 10^5 test cases..."
              className="w-full bg-[#181818] border border-[#262626] rounded-lg p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
