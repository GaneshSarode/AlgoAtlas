"use client";

import React from "react";
import { CheckSquare, Star, Award, ShieldAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import type { Problem } from "@/types";

export interface SelfAssessmentSectionProps {
  problem: Problem;
  onUpdateProblem: (updates: Partial<Problem>) => void;
}

export function SelfAssessmentSection({
  problem,
  onUpdateProblem,
}: SelfAssessmentSectionProps) {
  const questions = [
    {
      id: "independent",
      label: "Could I solve this completely independently without peeking?",
      checked: problem.status === "Solved Independently" || problem.status === "Mastered",
      onChange: (val: boolean) => {
        onUpdateProblem({
          status: val ? "Solved Independently" : "Solved With Hint",
          used_external_help: !val,
        });
      },
    },
    {
      id: "editorial",
      label: "Did I need to view the official editorial or external video?",
      checked: problem.viewed_editorial,
      onChange: (val: boolean) => {
        onUpdateProblem({ viewed_editorial: val });
      },
    },
    {
      id: "similar",
      label: "Could I implement this again tomorrow from memory without looking at notes?",
      checked: problem.confidence_rating >= 4,
      onChange: (val: boolean) => {
        onUpdateProblem({ confidence_rating: val ? Math.max(4, problem.confidence_rating) : 3 });
      },
    },
  ];

  return (
    <Card className="border-[#1f2433]">
      <CardHeader className="py-3 px-4 border-b border-[#1f2433]">
        <CardTitle className="text-sm flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-400" />
          5. Self-Assessment & Mastery Evaluation
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <div className="space-y-2.5">
          {questions.map((q) => (
            <label
              key={q.id}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-[#161a26] border border-[#23293a] text-xs text-gray-200 cursor-pointer hover:border-[#333b54] transition-colors"
            >
              <input
                type="checkbox"
                checked={q.checked}
                onChange={(e) => q.onChange(e.target.checked)}
                className="rounded bg-[#1b2030] border-[#2c344d] text-brand-500 focus:ring-0 w-4 h-4"
              />
              <span>{q.label}</span>
            </label>
          ))}
        </div>

        {/* Overall Confidence Slider / Buttons */}
        <div className="p-3.5 rounded-lg bg-[#141724] border border-[#242b3d] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              Mastery Confidence Rating
            </span>
            <span className="font-mono text-amber-400 font-bold">
              Level {problem.confidence_rating} / 5
            </span>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onUpdateProblem({ confidence_rating: lvl })}
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all border ${
                  problem.confidence_rating === lvl
                    ? "bg-brand-600 text-white border-brand-500 shadow-sm"
                    : "bg-[#191d2a] text-gray-400 border-[#282f42] hover:text-white"
                }`}
              >
                {lvl} {lvl === 1 ? "(Low)" : lvl === 5 ? "(Mastered)" : ""}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-gray-400 pt-1">
            {problem.confidence_rating <= 2
              ? "Recommended for immediate spaced repetition revision within 24-48 hours."
              : problem.confidence_rating >= 4
              ? "Solid understanding. Will be scheduled for long-term spaced recall reinforcement."
              : "Moderate understanding. Revise in 3-7 days to cement the pattern."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
