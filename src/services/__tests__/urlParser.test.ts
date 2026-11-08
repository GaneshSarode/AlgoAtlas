import { describe, it, expect } from "vitest";
import { parseProblemUrl } from "../urlParser";

describe("Problem URL Parser", () => {
  it("detects LeetCode problem URLs", () => {
    const parsed = parseProblemUrl("https://leetcode.com/problems/two-sum/");
    expect(parsed.platform).toBe("LeetCode");
    expect(parsed.slug).toBe("two-sum");
    expect(parsed.suggestedTitle).toBe("Two Sum");
  });

  it("handles LeetCode URLs with query parameters", () => {
    const parsed = parseProblemUrl(
      "https://leetcode.com/problems/trapping-rain-water/?envType=study-plan-v2"
    );
    expect(parsed.platform).toBe("LeetCode");
    expect(parsed.slug).toBe("trapping-rain-water");
    expect(parsed.suggestedTitle).toBe("Trapping Rain Water");
  });

  it("detects Codeforces problem URLs", () => {
    const parsed = parseProblemUrl("https://codeforces.com/problemset/problem/158/A");
    expect(parsed.platform).toBe("Codeforces");
    expect(parsed.externalId).toBe("158A");
    expect(parsed.suggestedTitle).toBe("Codeforces 158A");
  });

  it("detects Codeforces contest problem URLs", () => {
    const parsed = parseProblemUrl("https://codeforces.com/contest/1900/problem/B");
    expect(parsed.platform).toBe("Codeforces");
    expect(parsed.externalId).toBe("1900B");
  });

  it("detects AtCoder problem URLs", () => {
    const parsed = parseProblemUrl("https://atcoder.jp/contests/abc300/tasks/abc300_a");
    expect(parsed.platform).toBe("AtCoder");
    expect(parsed.externalId).toBe("abc300_a");
  });

  it("detects CodeChef problem URLs", () => {
    const parsed = parseProblemUrl("https://www.codechef.com/problems/FLOW001");
    expect(parsed.platform).toBe("CodeChef");
    expect(parsed.externalId).toBe("FLOW001");
    expect(parsed.slug).toBe("flow001");
  });

  it("detects GeeksforGeeks problem URLs", () => {
    const parsed = parseProblemUrl(
      "https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1"
    );
    expect(parsed.platform).toBe("GeeksforGeeks");
    expect(parsed.slug).toContain("kadanes-algorithm");
  });

  it("detects HackerRank problem URLs", () => {
    const parsed = parseProblemUrl("https://www.hackerrank.com/challenges/simple-array-sum/problem");
    expect(parsed.platform).toBe("HackerRank");
    expect(parsed.slug).toBe("simple-array-sum");
  });

  it("returns fallback for unknown platform URLs", () => {
    const parsed = parseProblemUrl("https://mycodingjudge.com/tasks/problem-42");
    expect(parsed.platform).toBe("Other");
  });
});
