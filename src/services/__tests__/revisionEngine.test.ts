import { describe, it, expect } from "vitest";
import { calculateNextRevisionInterval } from "../revisionEngine";

describe("Spaced Repetition Engine", () => {
  it("advances standard interval when solved independently", () => {
    expect(calculateNextRevisionInterval(1, "Solved Independently")).toBe(3);
    expect(calculateNextRevisionInterval(3, "Solved Independently")).toBe(7);
    expect(calculateNextRevisionInterval(7, "Solved Independently")).toBe(14);
    expect(calculateNextRevisionInterval(14, "Solved Independently")).toBe(30);
    expect(calculateNextRevisionInterval(30, "Solved Independently")).toBe(60);
  });

  it("resets interval to 1 day when user forgot completely", () => {
    expect(calculateNextRevisionInterval(14, "Forgot")).toBe(1);
    expect(calculateNextRevisionInterval(30, "Forgot")).toBe(1);
    expect(calculateNextRevisionInterval(3, "Forgot")).toBe(1);
  });

  it("repeats current interval when hints were needed", () => {
    expect(calculateNextRevisionInterval(7, "Needed Hints")).toBe(7);
    expect(calculateNextRevisionInterval(14, "Needed Hints")).toBe(14);
  });

  it("advances partially with multiplier when recalled partially", () => {
    const nextFrom3 = calculateNextRevisionInterval(3, "Partial Recall");
    expect(nextFrom3).toBeGreaterThan(3);
    expect(nextFrom3).toBeLessThanOrEqual(5);
  });

  it("extends interval long-term when mastered", () => {
    expect(calculateNextRevisionInterval(14, "Mastered")).toBeGreaterThanOrEqual(60);
  });
});
