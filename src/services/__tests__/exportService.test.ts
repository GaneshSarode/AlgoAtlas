import { describe, it, expect } from "vitest";
import { serializeBackupJson, validateBackupJson, generateProblemsCsv } from "../exportService";
import type { Problem } from "@/types";

describe("Export and Portability Service", () => {
  const sampleProblems: Problem[] = [
    {
      id: "p-1",
      user_id: "u-1",
      title: "Two Sum",
      slug: "two-sum",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/two-sum/",
      difficulty: "Easy",
      status: "Solved Independently",
      confidence_rating: 5,
      is_bookmarked: true,
      viewed_editorial: false,
      used_external_help: false,
      time_spent_minutes: 20,
      programming_language: "C++",
      primary_topic: "Arrays",
      created_at: "2026-11-01T00:00:00Z",
      updated_at: "2026-11-01T00:00:00Z",
    },
  ];

  it("serializes backup JSON with version and timestamp", () => {
    const jsonStr = serializeBackupJson({
      problems: sampleProblems,
      approaches: [],
      learningNotes: [],
      revisionItems: [],
      contestResults: [],
    });

    const parsed = JSON.parse(jsonStr);
    expect(parsed.version).toBe("1.0.0");
    expect(parsed.exported_at).toBeDefined();
    expect(parsed.problems.length).toBe(1);
    expect(parsed.problems[0].title).toBe("Two Sum");
  });

  it("validates valid backup JSON schema", () => {
    const validStr = JSON.stringify({
      version: "1.0.0",
      exported_at: "2026-11-09T00:00:00Z",
      problems: sampleProblems,
    });

    const result = validateBackupJson(validStr);
    expect(result.isValid).toBe(true);
    expect(result.problemCount).toBe(1);
  });

  it("rejects invalid backup JSON gracefully", () => {
    const invalidStr = "{ not valid json";
    const result = validateBackupJson(invalidStr);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("generates valid CSV export for problems", () => {
    const csv = generateProblemsCsv(sampleProblems);
    expect(csv).toContain("title,platform,difficulty,topic,status,confidence,time_spent,url");
    expect(csv).toContain('"Two Sum",LeetCode,Easy,"Arrays",Solved Independently,5,20');
  });
});
