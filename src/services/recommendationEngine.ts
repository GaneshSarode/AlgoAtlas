import type { ConceptStatus, DifficultyLevel, PlatformType } from "@/types";

export type RecommendationType =
  | "REVISION"
  | "PREREQUISITE"
  | "WEAK_TOPIC"
  | "ROADMAP_MILESTONE"
  | "DIFFICULTY_RAMP"
  | "CONTEST_PRACTICE";

export interface RecommendationItem {
  id: string;
  type: RecommendationType;
  title: string;
  subtitle: string;
  reason: string;
  priority: number; // 1 = highest
  actionUrl: string;
  actionText: string;
  estimatedMinutes: number;
}

export interface RecommendationPlan {
  headline: string;
  summary: string;
  recommendations: RecommendationItem[];
  dailyPracticeMinutes: number;
}

export interface RecommendationInput {
  overdueRevisions: Array<{
    problemId: string;
    problemTitle: string;
    scheduledFor: string;
    daysOverdue: number;
    topic?: string;
  }>;
  topicMastery: Array<{
    topicId: string;
    topicName: string;
    learningStatus: ConceptStatus;
    hintsUsedCount: number;
    problemsSolvedCount: number;
  }>;
  prerequisites: Array<{
    topicId: string;
    prerequisiteTopicId: string;
  }>;
  nextRoadmapItems: Array<{
    itemId: string;
    title: string;
    difficulty: DifficultyLevel;
    platform: PlatformType;
    sectionName: string;
  }>;
  targetHoursPerDay: number;
}

export function generateRecommendations(input: RecommendationInput): RecommendationPlan {
  const recommendations: RecommendationItem[] = [];
  let priorityCounter = 1;

  // 1. Overdue Revisions (Priority 1)
  input.overdueRevisions.forEach((rev) => {
    recommendations.push({
      id: `rec-rev-${rev.problemId}`,
      type: "REVISION",
      title: `Revise: ${rev.problemTitle}`,
      subtitle: `${rev.topic || "DSA"} Spaced Repetition`,
      reason: `Recommended because this question is overdue for revision by ${rev.daysOverdue} days to prevent pattern forgetting.`,
      priority: priorityCounter++,
      actionUrl: `/revision/practice?problemId=${rev.problemId}`,
      actionText: "Start Recall Review",
      estimatedMinutes: 20,
    });
  });

  // 2. Missing Prerequisite Concepts (Priority 2)
  const masteryMap = new Map(input.topicMastery.map((m) => [m.topicId, m]));
  input.prerequisites.forEach((prereq) => {
    const parentMastery = masteryMap.get(prereq.prerequisiteTopicId);
    const childMastery = masteryMap.get(prereq.topicId);

    // If child is being practiced but parent is not comfortable
    if (
      childMastery &&
      (childMastery.learningStatus === "Practising" || childMastery.learningStatus === "Currently Learning") &&
      (!parentMastery || parentMastery.learningStatus === "Not Started" || parentMastery.learningStatus === "Currently Learning")
    ) {
      recommendations.push({
        id: `rec-prereq-${prereq.prerequisiteTopicId}`,
        type: "PREREQUISITE",
        title: `Learn Prerequisite: ${parentMastery?.topicName || "Foundation"}`,
        subtitle: `Prerequisite for ${childMastery.topicName}`,
        reason: `Recommended because you are practicing ${childMastery.topicName}, but the foundational prerequisite concept (${parentMastery?.topicName || "Foundation"}) is not yet comfortable.`,
        priority: priorityCounter++,
        actionUrl: `/concepts/${(parentMastery?.topicName || "arrays").toLowerCase().replace(/[\s&]+/g, "-")}`,
        actionText: "Study Concept & Templates",
        estimatedMinutes: 30,
      });
    }
  });

  // 3. Weak Topics & High Hint Dependency (Priority 3)
  input.topicMastery.forEach((tm) => {
    const isWeak =
      tm.learningStatus === "Practising" &&
      tm.hintsUsedCount > 0 &&
      tm.hintsUsedCount / Math.max(1, tm.problemsSolvedCount) >= 0.4;

    if (isWeak) {
      recommendations.push({
        id: `rec-weak-${tm.topicId}`,
        type: "WEAK_TOPIC",
        title: `Reinforce Weak Concept: ${tm.topicName}`,
        subtitle: `High hint dependency (${tm.hintsUsedCount} hints used)`,
        reason: `Recommended because you repeatedly needed hints on ${tm.topicName} problems. Practice 2 foundational questions independently.`,
        priority: priorityCounter++,
        actionUrl: `/problems?topic=${encodeURIComponent(tm.topicName)}`,
        actionText: "Practice Topic Problems",
        estimatedMinutes: 45,
      });
    }
  });

  // 4. Next Roadmap Milestone (Priority 4)
  input.nextRoadmapItems.slice(0, 3).forEach((item) => {
    recommendations.push({
      id: `rec-rm-${item.itemId}`,
      type: "ROADMAP_MILESTONE",
      title: `Solve: ${item.title}`,
      subtitle: `${item.sectionName} • ${item.difficulty} on ${item.platform}`,
      reason: `Recommended as the next logical milestone in your active learning roadmap.`,
      priority: priorityCounter++,
      actionUrl: `/roadmaps`,
      actionText: "Open Roadmap Sheet",
      estimatedMinutes: 40,
    });
  });

  // Default fallback recommendation if nothing triggered
  if (recommendations.length === 0) {
    recommendations.push({
      id: "rec-general-advance",
      type: "DIFFICULTY_RAMP",
      title: "Solve Next Progressive Problem in Active Roadmap",
      subtitle: "NeetCode 150 Milestone",
      reason: "Recommended to maintain your daily streak and advance your active roadmap progress.",
      priority: 1,
      actionUrl: "/roadmaps",
      actionText: "Explore Sheet",
      estimatedMinutes: 30,
    });
  }

  const dailyMinutes = (input.targetHoursPerDay || 2) * 60;
  const headline =
    input.overdueRevisions.length > 0
      ? `Clear ${input.overdueRevisions.length} overdue revisions before learning new concepts.`
      : "You are on track! Follow your structured daily learning milestones below.";

  const summary = `Personalized daily learning plan calibrated for ${input.targetHoursPerDay || 2} hours of daily deliberate practice.`;

  return {
    headline,
    summary,
    recommendations,
    dailyPracticeMinutes: dailyMinutes,
  };
}
