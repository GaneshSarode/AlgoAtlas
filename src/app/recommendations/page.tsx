"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Compass } from "lucide-react";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import { DailyLearningPlan } from "@/components/recommendations/DailyLearningPlan";
import {
  generateRecommendations,
  RecommendationPlan,
} from "@/services/recommendationEngine";
import { getDbRepository } from "@/lib/db/repository";
import { ROADMAP_SECTIONS_NEETCODE } from "@/services/roadmapData";

export default function RecommendationsPage() {
  const [targetHours, setTargetHours] = useState(2);
  const [plan, setPlan] = useState<RecommendationPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function computePlan() {
      setIsLoading(true);
      const repo = getDbRepository();
      const revisions = await repo.getRevisionItems();
      const mastery = await repo.getTopicMastery();
      const prereqs = await repo.getPrerequisites();
      const problems = await repo.getProblems();

      // Overdue revisions input
      const overdue = revisions
        .filter((r) => r.is_overdue)
        .map((r) => {
          const schedTime = new Date(r.scheduled_for).getTime();
          const nowTime = new Date().getTime();
          const diffDays = Math.max(1, Math.round((nowTime - schedTime) / (1000 * 3600 * 24)));
          return {
            problemId: r.problem_id,
            problemTitle: r.problem_title || "Problem",
            scheduledFor: r.scheduled_for,
            daysOverdue: diffDays,
            topic: "DSA Pattern",
          };
        });

      // Topic mastery input
      const masteryInput = mastery.map((m) => ({
        topicId: m.topic_id,
        topicName: m.topic_name || "Topic",
        learningStatus: m.learning_status,
        hintsUsedCount: m.hints_used_count,
        problemsSolvedCount: m.problems_solved_count,
      }));

      // Prerequisites input
      const prereqInput = prereqs.map((p) => ({
        topicId: p.topic_id,
        prerequisiteTopicId: p.prerequisite_topic_id,
      }));

      // Next roadmap problems from active sheet that are not yet solved
      const flatSheet = Object.values(ROADMAP_SECTIONS_NEETCODE).flat();
      const nextRoadmap = flatSheet
        .filter(
          (item) =>
            !problems.some(
              (p) =>
                p.title.toLowerCase() === item.title.toLowerCase() &&
                (p.status.includes("Solved") || p.status === "Mastered")
            )
        )
        .slice(0, 3)
        .map((item) => ({
          itemId: item.id,
          title: item.title,
          difficulty: item.difficulty,
          platform: item.platform,
          sectionName: item.section_name,
        }));

      const generated = generateRecommendations({
        overdueRevisions: overdue,
        topicMastery: masteryInput,
        prerequisites: prereqInput,
        nextRoadmapItems: nextRoadmap,
        targetHoursPerDay: targetHours,
      });

      setPlan(generated);
      setIsLoading(false);
    }
    computePlan();
  }, [targetHours]);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Compass className="w-6 h-6 text-neutral-400" />
          What Should I Learn Next? — Learning Intelligence
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Algorithmic recommendation engine prioritizing: Overdue Revisions → Missing Prerequisites → Weak Topics → Next Roadmap Step → Difficulty Ramp.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-neutral-500 animate-pulse">
          Analyzing your problem vault, revision schedule, and mastery gaps...
        </div>
      ) : plan ? (
        <div className="space-y-6">
          {/* Executive Diagnostic Banner */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-[#232323] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-neutral-400" /> Diagnostic Assessment
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {plan.headline}
            </h2>
            <p className="text-xs text-neutral-300">{plan.summary}</p>
          </div>

          {/* Daily Learning Plan Checklist */}
          <DailyLearningPlan
            recommendations={plan.recommendations}
            targetHours={targetHours}
            onTargetHoursChange={(hrs) => setTargetHours(hrs)}
          />

          {/* Detailed Recommendation Cards with Reasons */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Prioritized Deliberate Practice Sequence ({plan.recommendations.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.recommendations.map((rec) => (
                <RecommendationCard key={rec.id} item={rec} />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
