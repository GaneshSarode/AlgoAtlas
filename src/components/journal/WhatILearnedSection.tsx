"use client";

import React from "react";
import { BookOpen, AlertOctagon, CheckCircle2, ArrowRightCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import type { LearningNote } from "@/types";

export interface WhatILearnedSectionProps {
  note: LearningNote;
  onChange: (updates: Partial<LearningNote>) => void;
}

export function WhatILearnedSection({ note, onChange }: WhatILearnedSectionProps) {
  return (
    <Card className="border-[#232323] bg-[#141414]">
      <CardHeader className="py-3 px-4 border-b border-[#232323]">
        <CardTitle className="text-sm flex items-center gap-2 text-white">
          <BookOpen className="w-4 h-4 text-neutral-400" />
          4. What I Learned & Knowledge Synthesis
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Main Concept Learned
            </label>
            <input
              type="text"
              value={note.main_concept_learned || ""}
              onChange={(e) => onChange({ main_concept_learned: e.target.value })}
              placeholder="e.g. Monotonic Stack for next greater element"
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Algorithmic Pattern
            </label>
            <input
              type="text"
              value={note.algorithmic_pattern || ""}
              onChange={(e) => onChange({ algorithmic_pattern: e.target.value })}
              placeholder="e.g. Shrinkable sliding window with hashmap frequency"
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1 flex items-center gap-1.5 text-rose-300">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              Mistake to Avoid Next Time
            </label>
            <textarea
              rows={2}
              value={note.mistakes_to_avoid || ""}
              onChange={(e) => onChange({ mistakes_to_avoid: e.target.value })}
              placeholder="e.g. Remember to handle integer overflow when calculating mid = l + (r-l)/2..."
              className="w-full bg-[#181818] border border-[#262626] rounded-lg p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 flex items-center gap-1.5 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              When Should I Use This Technique?
            </label>
            <textarea
              rows={2}
              value={note.when_to_use || ""}
              onChange={(e) => onChange({ when_to_use: e.target.value })}
              placeholder="e.g. When looking for contiguous subarrays satisfying a monotonic condition..."
              className="w-full bg-[#181818] border border-[#262626] rounded-lg p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 resize-none leading-relaxed"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center gap-1.5">
            <ArrowRightCircle className="w-3.5 h-3.5 text-neutral-400" />
            Related Questions or Next Concepts to Explore
          </label>
          <input
            type="text"
            value={note.related_questions_notes || ""}
            onChange={(e) => onChange({ related_questions_notes: e.target.value })}
            placeholder="e.g. Solve Daily Temperatures, Largest Rectangle in Histogram next"
            className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
          />
        </div>
      </CardContent>
    </Card>
  );
}
