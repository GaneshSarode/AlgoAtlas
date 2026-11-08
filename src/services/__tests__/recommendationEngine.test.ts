import { describe, it, expect } from "vitest";
import { generateRecommendations, RecommendationInput } from "../recommendationEngine";

describe("Recommendation Engine", () => {
  it("prioritizes overdue revisions as highest urgency", () => {
    const input: RecommendationInput = {
      overdueRevisions: [
        {
          problemId: "p-1",
          problemTitle: "Two Sum",
          scheduledFor: "2026-11-01",
          daysOverdue: 8,
          topic: "Arrays",
        },
      ],
      topicMastery: [
        {
          topicId: "t-arrays",
          topicName: "Arrays",
          learningStatus: "Strong",
          hintsUsedCount: 0,
          problemsSolvedCount: 5,
        },
      ],
      prerequisites: [],
      nextRoadmapItems: [],
      targetHoursPerDay: 2,
    };

    const plan = generateRecommendations(input);
    expect(plan.recommendations.length).toBeGreaterThan(0);
    expect(plan.recommendations[0].type).toBe("REVISION");
    expect(plan.recommendations[0].reason).toContain("overdue for revision");
    expect(plan.recommendations[0].title).toContain("Two Sum");
  });

  it("identifies missing prerequisite concepts", () => {
    const input: RecommendationInput = {
      overdueRevisions: [],
      topicMastery: [
        {
          topicId: "t-arrays",
          topicName: "Arrays",
          learningStatus: "Currently Learning",
          hintsUsedCount: 2,
          problemsSolvedCount: 1,
        },
        {
          topicId: "t-sliding-window",
          topicName: "Sliding Window",
          learningStatus: "Practising",
          hintsUsedCount: 3,
          problemsSolvedCount: 2,
        },
      ],
      prerequisites: [
        { topicId: "t-sliding-window", prerequisiteTopicId: "t-arrays" },
      ],
      nextRoadmapItems: [],
      targetHoursPerDay: 2,
    };

    const plan = generateRecommendations(input);
    const prereqRec = plan.recommendations.find((r) => r.type === "PREREQUISITE");
    expect(prereqRec).toBeDefined();
    expect(prereqRec?.reason).toContain("prerequisite");
  });

  it("flags weak concepts with high hint dependency", () => {
    const input: RecommendationInput = {
      overdueRevisions: [],
      topicMastery: [
        {
          topicId: "t-prefix-sum",
          topicName: "Prefix Sum",
          learningStatus: "Practising",
          hintsUsedCount: 4,
          problemsSolvedCount: 3,
        },
      ],
      prerequisites: [],
      nextRoadmapItems: [],
      targetHoursPerDay: 2,
    };

    const plan = generateRecommendations(input);
    const weakRec = plan.recommendations.find((r) => r.type === "WEAK_TOPIC");
    expect(weakRec).toBeDefined();
    expect(weakRec?.reason).toContain("hints");
  });

  it("suggests next roadmap problem if revisions and prerequisites are clear", () => {
    const input: RecommendationInput = {
      overdueRevisions: [],
      topicMastery: [],
      prerequisites: [],
      nextRoadmapItems: [
        {
          itemId: "ri-1",
          title: "Trapping Rain Water",
          difficulty: "Hard",
          platform: "LeetCode",
          sectionName: "Two Pointers",
        },
      ],
      targetHoursPerDay: 2,
    };

    const plan = generateRecommendations(input);
    const roadmapRec = plan.recommendations.find((r) => r.type === "ROADMAP_MILESTONE");
    expect(roadmapRec).toBeDefined();
    expect(roadmapRec?.title).toContain("Trapping Rain Water");
  });
});
