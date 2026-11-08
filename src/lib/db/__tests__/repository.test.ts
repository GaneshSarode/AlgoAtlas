import { describe, it, expect, beforeEach } from "vitest";
import { getDbRepository } from "../repository";
import type { Problem, SolutionApproach, LearningNote } from "@/types";

describe("Database Repository", () => {
  beforeEach(() => {
    const repo = getDbRepository();
    repo.reset();
  });

  it("creates and retrieves a problem", async () => {
    const repo = getDbRepository();
    const newProblem = await repo.createProblem({
      title: "Two Sum",
      slug: "two-sum",
      platform: "LeetCode",
      external_id: "1",
      url: "https://leetcode.com/problems/two-sum/",
      difficulty: "Easy",
      status: "Solved Independently",
      confidence_rating: 5,
      is_bookmarked: true,
      viewed_editorial: false,
      used_external_help: false,
      time_spent_minutes: 25,
      programming_language: "C++",
      primary_topic: "Arrays",
    });

    expect(newProblem.id).toBeDefined();
    expect(newProblem.title).toBe("Two Sum");
    expect(newProblem.slug).toBe("two-sum");

    const fetched = await repo.getProblemById(newProblem.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.title).toBe("Two Sum");
  });

  it("stores and retrieves solution approaches for a problem", async () => {
    const repo = getDbRepository();
    const problem = await repo.createProblem({
      title: "Trapping Rain Water",
      slug: "trapping-rain-water",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/trapping-rain-water/",
      difficulty: "Hard",
      status: "Solved With Hint",
      confidence_rating: 4,
      is_bookmarked: false,
      viewed_editorial: true,
      used_external_help: false,
      time_spent_minutes: 45,
      programming_language: "C++",
      primary_topic: "Two Pointers",
    });

    const bruteForce = await repo.createApproach({
      problem_id: problem.id,
      approach_type: "Brute Force",
      title: "Check max left and right for each element",
      intuition: "Iterate across the array and scan left and right for tallest bars.",
      algorithm_steps: "For each element i, find max(height[0..i]) and max(height[i..n-1]).",
      time_complexity: "O(N^2)",
      space_complexity: "O(1)",
      code: "int trap(vector<int>& height) { /* Brute */ }",
      language: "C++",
    });

    const optimal = await repo.createApproach({
      problem_id: problem.id,
      approach_type: "Optimal",
      title: "Two Pointers with LeftMax and RightMax",
      intuition: "Maintain two pointers l and r and trap water based on the shorter boundary.",
      algorithm_steps: "1. Init l=0, r=n-1\n2. Track leftMax, rightMax\n3. Move pointer with smaller height.",
      time_complexity: "O(N)",
      space_complexity: "O(1)",
      code: "int trap(vector<int>& height) { /* Two Pointers */ }",
      language: "C++",
    });

    const approaches = await repo.getApproachesByProblemId(problem.id);
    expect(approaches.length).toBe(2);
    expect(approaches.some((a) => a.approach_type === "Brute Force")).toBe(true);
    expect(approaches.some((a) => a.approach_type === "Optimal")).toBe(true);
  });

  it("stores and updates learning notes", async () => {
    const repo = getDbRepository();
    const problem = await repo.createProblem({
      title: "Subarray Sum Equals K",
      slug: "subarray-sum-equals-k",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/subarray-sum-equals-k/",
      difficulty: "Medium",
      status: "Solved Independently",
      confidence_rating: 4,
      is_bookmarked: true,
      viewed_editorial: false,
      used_external_help: false,
      time_spent_minutes: 30,
      programming_language: "C++",
      primary_topic: "Prefix Sum",
    });

    const note = await repo.saveLearningNotes({
      problem_id: problem.id,
      key_observation: "prefix[j] - prefix[i] = k => prefix[i] = prefix[j] - k",
      main_concept_learned: "Prefix sum combined with hashmap frequency lookup",
      mistakes_to_avoid: "Don't forget to initialize map with {0: 1}",
      when_to_use: "Continuous subarray sum problems with positive and negative values",
    });

    const fetchedNote = await repo.getLearningNotesByProblemId(problem.id);
    expect(fetchedNote?.key_observation).toContain("prefix[j] - prefix[i] = k");
    expect(fetchedNote?.mistakes_to_avoid).toContain("{0: 1}");
  });

  it("dynamically calculates overall statistics from database records", async () => {
    const repo = getDbRepository();
    await repo.createProblem({
      title: "P1",
      slug: "p1",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/p1",
      difficulty: "Easy",
      status: "Solved Independently",
      confidence_rating: 5,
      is_bookmarked: false,
      viewed_editorial: false,
      used_external_help: false,
      time_spent_minutes: 20,
      programming_language: "C++",
    });

    await repo.createProblem({
      title: "P2",
      slug: "p2",
      platform: "Codeforces",
      url: "https://codeforces.com/contest/1/problem/A",
      difficulty: "Medium",
      status: "Needs Revision",
      confidence_rating: 2,
      is_bookmarked: false,
      viewed_editorial: true,
      used_external_help: true,
      time_spent_minutes: 40,
      programming_language: "C++",
    });

    const stats = await repo.getOverallStats();
    expect(stats.total_problems).toBe(2);
    expect(stats.independently_solved).toBe(1);
    expect(stats.needs_revision).toBe(1);
    expect(stats.total_practice_time_minutes).toBe(60);
  });
});
