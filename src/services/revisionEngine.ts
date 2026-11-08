import type { RecallGrade, RevisionItem } from "@/types";

export function calculateNextRevisionInterval(
  currentInterval: number,
  grade: RecallGrade
): number {
  switch (grade) {
    case "Forgot":
      return 1; // Immediate reset to tomorrow

    case "Needed Hints":
      return Math.max(1, currentInterval); // Repeat current stage

    case "Partial Recall":
      return Math.max(1, Math.round(currentInterval * 1.5));

    case "Solved Independently":
      if (currentInterval <= 1) return 3;
      if (currentInterval <= 3) return 7;
      if (currentInterval <= 7) return 14;
      if (currentInterval <= 14) return 30;
      return 60;

    case "Mastered":
      return 90;

    default:
      return 1;
  }
}

export function partitionRevisions(items: RevisionItem[]): {
  todayQueue: RevisionItem[];
  overdueQueue: RevisionItem[];
  upcomingQueue: RevisionItem[];
  masteredQueue: RevisionItem[];
} {
  const today = new Date().toISOString().split("T")[0];

  const todayQueue: RevisionItem[] = [];
  const overdueQueue: RevisionItem[] = [];
  const upcomingQueue: RevisionItem[] = [];
  const masteredQueue: RevisionItem[] = [];

  items.forEach((item) => {
    if (item.recall_grade === "Mastered") {
      masteredQueue.push(item);
    } else if (item.scheduled_for < today) {
      overdueQueue.push(item);
    } else if (item.scheduled_for === today) {
      todayQueue.push(item);
    } else {
      upcomingQueue.push(item);
    }
  });

  // Sort by urgency
  overdueQueue.sort((a, b) => a.scheduled_for.localeCompare(b.scheduled_for));
  upcomingQueue.sort((a, b) => a.scheduled_for.localeCompare(b.scheduled_for));

  return {
    todayQueue,
    overdueQueue,
    upcomingQueue,
    masteredQueue,
  };
}
