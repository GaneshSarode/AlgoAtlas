import type {
  Problem,
  SolutionApproach,
  LearningNote,
  ProblemAttempt,
  CodeSnippet,
  Topic,
  TopicPrerequisite,
  TopicMastery,
  Roadmap,
  RoadmapItem,
  RoadmapProgress,
  RevisionItem,
  DailyTask,
  Contest,
  ContestResult,
  PlatformAccount,
  SyncLog,
  UserActivity,
  OverallStats,
  PlatformStat,
  LearningIntelligenceSummary,
  PlatformType,
  RecallGrade,
} from "@/types";

const INITIAL_TOPICS: Topic[] = [
  { id: "t-arrays", slug: "arrays", name: "Arrays", category: "Data Structures", description: "Contiguous memory with O(1) index access.", icon_name: "LayoutGrid", sort_order: 1 },
  { id: "t-strings", slug: "strings", name: "Strings", category: "Data Structures", description: "Sequences of characters with common palindrome and anagram patterns.", icon_name: "FileText", sort_order: 2 },
  { id: "t-hashing", slug: "hashing", name: "Hashing & HashMaps", category: "Data Structures", description: "Key-value mapping providing average O(1) lookups.", icon_name: "Hash", sort_order: 3 },
  { id: "t-two-pointers", slug: "two-pointers", name: "Two Pointers", category: "Algorithms & Patterns", description: "Traversing sequences with pointers moving inwards or at variable speed.", icon_name: "ArrowLeftRight", sort_order: 4 },
  { id: "t-sliding-window", slug: "sliding-window", name: "Sliding Window", category: "Algorithms & Patterns", description: "Dynamic contiguous subarray/substring window maintenance.", icon_name: "Maximize2", sort_order: 5 },
  { id: "t-prefix-sum", slug: "prefix-sum", name: "Prefix Sum", category: "Algorithms & Patterns", description: "Precomputing cumulative sums for O(1) range queries.", icon_name: "PlusCircle", sort_order: 6 },
  { id: "t-binary-search", slug: "binary-search", name: "Binary Search", category: "Algorithms & Patterns", description: "Search on sorted spaces or monotonic predicate functions.", icon_name: "Search", sort_order: 7 },
  { id: "t-bs-answers", slug: "binary-search-answers", name: "Binary Search on Answers", category: "Algorithms & Patterns", description: "Binary search on optimization boundaries (minimax / maximin).", icon_name: "Target", sort_order: 8 },
  { id: "t-linked-lists", slug: "linked-lists", name: "Linked Lists", category: "Data Structures", description: "Sequential node pointers: reverse, cycle detection, reordering.", icon_name: "Link", sort_order: 9 },
  { id: "t-fast-slow", slug: "fast-slow-pointers", name: "Fast & Slow Pointers", category: "Algorithms & Patterns", description: "Tortoise and hare technique for cycles and middle elements.", icon_name: "Zap", sort_order: 10 },
  { id: "t-stacks", slug: "stacks", name: "Stacks & Monotonic Stack", category: "Data Structures", description: "LIFO structure and monotonic stack for Next Greater Element.", icon_name: "Layers", sort_order: 11 },
  { id: "t-trees", slug: "trees", name: "Binary Trees", category: "Data Structures", description: "Hierarchical trees: traversals, LCA, path sums, views.", icon_name: "GitBranch", sort_order: 12 },
  { id: "t-bst", slug: "binary-search-trees", name: "Binary Search Trees", category: "Data Structures", description: "Ordered binary trees enabling O(log N) search and validation.", icon_name: "Binary", sort_order: 13 },
  { id: "t-heaps", slug: "heaps", name: "Heaps & Priority Queues", category: "Data Structures", description: "Complete binary trees maintaining min/max for Top-K queries.", icon_name: "Database", sort_order: 14 },
  { id: "t-graphs", slug: "graphs", name: "Graphs", category: "Data Structures", description: "Vertices and edges: BFS, DFS, cycle detection, topological sort.", icon_name: "Network", sort_order: 15 },
  { id: "t-dp", slug: "dynamic-programming", name: "Dynamic Programming", category: "Algorithms & Patterns", description: "Subproblem memoization & tabulation: knapsack, LCS, LIS.", icon_name: "Cpu", sort_order: 16 },
  { id: "t-bit-manipulation", slug: "bit-manipulation", name: "Bit Manipulation", category: "Algorithms & Patterns", description: "Bitwise XOR, AND, masks, and binary tricks.", icon_name: "Binary", sort_order: 17 },
  { id: "t-dsu", slug: "dsu", name: "Disjoint Set Union (DSU)", category: "Data Structures", description: "Union-find structure with path compression and rank.", icon_name: "Share2", sort_order: 18 }
];

const INITIAL_PREREQUISITES: TopicPrerequisite[] = [
  { id: "p-1", topic_id: "t-prefix-sum", prerequisite_topic_id: "t-arrays" },
  { id: "p-2", topic_id: "t-sliding-window", prerequisite_topic_id: "t-arrays" },
  { id: "p-3", topic_id: "t-two-pointers", prerequisite_topic_id: "t-arrays" },
  { id: "p-4", topic_id: "t-bs-answers", prerequisite_topic_id: "t-binary-search" },
  { id: "p-5", topic_id: "t-fast-slow", prerequisite_topic_id: "t-linked-lists" },
  { id: "p-6", topic_id: "t-bst", prerequisite_topic_id: "t-trees" },
  { id: "p-7", topic_id: "t-dp", prerequisite_topic_id: "t-arrays" },
];

const INITIAL_ROADMAPS: Roadmap[] = [
  { id: "rm-neetcode-150", title: "NeetCode 150", slug: "neetcode-150", description: "Essential 150 pattern-based questions covering all major DSA concepts.", is_system: true, is_active: true, total_problems: 150 },
  { id: "rm-blind-75", title: "Blind 75", slug: "blind-75", description: "High-frequency classic interview problem collection.", is_system: true, is_active: false, total_problems: 75 },
  { id: "rm-striver-a2z", title: "Striver A2Z DSA Sheet", slug: "striver-a2z", description: "Comprehensive master roadmap from basics to advanced competitive topics.", is_system: true, is_active: false, total_problems: 455 },
  { id: "rm-cses", title: "CSES Problem Set", slug: "cses-problem-set", description: "Benchmark competitive programming problem set.", is_system: true, is_active: false, total_problems: 300 }
];

const INITIAL_ROADMAP_ITEMS: RoadmapItem[] = [
  { id: "ri-1", roadmap_id: "rm-neetcode-150", title: "Contains Duplicate", external_url: "https://leetcode.com/problems/contains-duplicate/", platform: "LeetCode", external_id: "217", difficulty: "Easy", sort_order: 1, section_name: "Arrays & Hashing" },
  { id: "ri-2", roadmap_id: "rm-neetcode-150", title: "Valid Anagram", external_url: "https://leetcode.com/problems/valid-anagram/", platform: "LeetCode", external_id: "242", difficulty: "Easy", sort_order: 2, section_name: "Arrays & Hashing" },
  { id: "ri-3", roadmap_id: "rm-neetcode-150", title: "Two Sum", external_url: "https://leetcode.com/problems/two-sum/", platform: "LeetCode", external_id: "1", difficulty: "Easy", sort_order: 3, section_name: "Arrays & Hashing" },
  { id: "ri-4", roadmap_id: "rm-neetcode-150", title: "Group Anagrams", external_url: "https://leetcode.com/problems/group-anagrams/", platform: "LeetCode", external_id: "49", difficulty: "Medium", sort_order: 4, section_name: "Arrays & Hashing" },
  { id: "ri-5", roadmap_id: "rm-neetcode-150", title: "Top K Frequent Elements", external_url: "https://leetcode.com/problems/top-k-frequent-elements/", platform: "LeetCode", external_id: "347", difficulty: "Medium", sort_order: 5, section_name: "Arrays & Hashing" },
  { id: "ri-6", roadmap_id: "rm-neetcode-150", title: "Two Sum II - Input Array Is Sorted", external_url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", platform: "LeetCode", external_id: "167", difficulty: "Medium", sort_order: 6, section_name: "Two Pointers" },
  { id: "ri-7", roadmap_id: "rm-neetcode-150", title: "3Sum", external_url: "https://leetcode.com/problems/3sum/", platform: "LeetCode", external_id: "15", difficulty: "Medium", sort_order: 7, section_name: "Two Pointers" },
  { id: "ri-8", roadmap_id: "rm-neetcode-150", title: "Container With Most Water", external_url: "https://leetcode.com/problems/container-with-most-water/", platform: "LeetCode", external_id: "11", difficulty: "Medium", sort_order: 8, section_name: "Two Pointers" },
  { id: "ri-9", roadmap_id: "rm-neetcode-150", title: "Trapping Rain Water", external_url: "https://leetcode.com/problems/trapping-rain-water/", platform: "LeetCode", external_id: "42", difficulty: "Hard", sort_order: 9, section_name: "Two Pointers" },
  { id: "ri-10", roadmap_id: "rm-neetcode-150", title: "Best Time to Buy and Sell Stock", external_url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", platform: "LeetCode", external_id: "121", difficulty: "Easy", sort_order: 10, section_name: "Sliding Window" },
  { id: "ri-11", roadmap_id: "rm-neetcode-150", title: "Longest Substring Without Repeating Characters", external_url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", platform: "LeetCode", external_id: "3", difficulty: "Medium", sort_order: 11, section_name: "Sliding Window" },
  { id: "ri-12", roadmap_id: "rm-neetcode-150", title: "Binary Search", external_url: "https://leetcode.com/problems/binary-search/", platform: "LeetCode", external_id: "704", difficulty: "Easy", sort_order: 12, section_name: "Binary Search" },
  { id: "ri-13", roadmap_id: "rm-neetcode-150", title: "Koko Eating Bananas", external_url: "https://leetcode.com/problems/koko-eating-bananas/", platform: "LeetCode", external_id: "875", difficulty: "Medium", sort_order: 13, section_name: "Binary Search" },
  { id: "ri-14", roadmap_id: "rm-neetcode-150", title: "Climbing Stairs", external_url: "https://leetcode.com/problems/climbing-stairs/", platform: "LeetCode", external_id: "70", difficulty: "Easy", sort_order: 14, section_name: "Dynamic Programming" },
  { id: "ri-15", roadmap_id: "rm-neetcode-150", title: "Coin Change", external_url: "https://leetcode.com/problems/coin-change/", platform: "LeetCode", external_id: "322", difficulty: "Medium", sort_order: 15, section_name: "Dynamic Programming" }
];

export class InMemoryRepository {
  private problems: Map<string, Problem> = new Map();
  private approaches: Map<string, SolutionApproach[]> = new Map();
  private learningNotes: Map<string, LearningNote> = new Map();
  private attempts: Map<string, ProblemAttempt[]> = new Map();
  private codeSnippets: Map<string, CodeSnippet[]> = new Map();
  private topics: Map<string, Topic> = new Map();
  private prerequisites: TopicPrerequisite[] = [...INITIAL_PREREQUISITES];
  private topicMastery: Map<string, TopicMastery> = new Map();
  private roadmaps: Map<string, Roadmap> = new Map();
  private roadmapItems: Map<string, RoadmapItem> = new Map();
  private roadmapProgress: Map<string, RoadmapProgress> = new Map();
  private revisionItems: Map<string, RevisionItem> = new Map();
  private dailyTasks: Map<string, DailyTask> = new Map();
  private contestResults: Map<string, ContestResult> = new Map();
  private platformAccounts: Map<string, PlatformAccount> = new Map();
  private syncLogs: SyncLog[] = [];
  private userActivities: Map<string, UserActivity> = new Map();

  constructor() {
    this.seedDefaults();
  }

  public reset() {
    this.problems.clear();
    this.approaches.clear();
    this.learningNotes.clear();
    this.attempts.clear();
    this.codeSnippets.clear();
    this.topics.clear();
    this.prerequisites = [...INITIAL_PREREQUISITES];
    this.topicMastery.clear();
    this.roadmaps.clear();
    this.roadmapItems.clear();
    this.roadmapProgress.clear();
    this.revisionItems.clear();
    this.dailyTasks.clear();
    this.contestResults.clear();
    this.platformAccounts.clear();
    this.syncLogs = [];
    this.userActivities.clear();
    this.seedDefaults();
  }

  private seedDefaults() {
    INITIAL_TOPICS.forEach((t) => this.topics.set(t.id, t));
    INITIAL_ROADMAPS.forEach((r) => this.roadmaps.set(r.id, r));
    INITIAL_ROADMAP_ITEMS.forEach((ri) => this.roadmapItems.set(ri.id, ri));

    // Seed default platform accounts
    const defaultPlatforms: PlatformType[] = ["Codeforces", "AtCoder", "LeetCode", "CodeChef", "HackerRank", "GeeksforGeeks"];
    defaultPlatforms.forEach((p, idx) => {
      this.platformAccounts.set(p, {
        id: `pa-${idx}`,
        user_id: "default-user",
        platform: p,
        handle: p === "Codeforces" ? "tourist" : p === "LeetCode" ? "coder_atlas" : "",
        profile_url: p === "Codeforces" ? "https://codeforces.com/profile/tourist" : "",
        is_connected: p === "Codeforces" || p === "LeetCode",
        rating: p === "Codeforces" ? 3850 : undefined,
        max_rating: p === "Codeforces" ? 4009 : undefined,
        rank_title: p === "Codeforces" ? "Legendary Grandmaster" : undefined,
        last_synced_at: new Date().toISOString(),
        sync_status: "IDLE",
      });
    });
  }

  // PROBLEMS
  async getProblems(): Promise<Problem[]> {
    return Array.from(this.problems.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async getProblemById(id: string): Promise<Problem | null> {
    return this.problems.get(id) || null;
  }

  async getProblemBySlug(slug: string): Promise<Problem | null> {
    for (const p of this.problems.values()) {
      if (p.slug === slug) return p;
    }
    return null;
  }

  async createProblem(
    data: Omit<Problem, "id" | "created_at" | "updated_at" | "user_id"> & { user_id?: string }
  ): Promise<Problem> {
    const id = `prob-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const problem: Problem = {
      ...data,
      id,
      user_id: data.user_id || "default-user",
      created_at: now,
      updated_at: now,
    };
    this.problems.set(id, problem);

    // Auto-create initial revision item if solved or needs revision
    if (problem.status !== "Not Started") {
      await this.scheduleRevision(problem.id, 1);
    }

    // Auto-update activity
    await this.recordActivityToday(problem.status.includes("Solved") ? 1 : 0, 1, problem.time_spent_minutes);

    return problem;
  }

  async updateProblem(id: string, updates: Partial<Problem>): Promise<Problem> {
    const existing = this.problems.get(id);
    if (!existing) throw new Error(`Problem ${id} not found`);
    const updated: Problem = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.problems.set(id, updated);
    return updated;
  }

  async deleteProblem(id: string): Promise<boolean> {
    this.approaches.delete(id);
    this.learningNotes.delete(id);
    this.attempts.delete(id);
    this.revisionItems.delete(id);
    return this.problems.delete(id);
  }

  // APPROACHES
  async getApproachesByProblemId(problemId: string): Promise<SolutionApproach[]> {
    return this.approaches.get(problemId) || [];
  }

  async createApproach(
    data: Omit<SolutionApproach, "id" | "created_at" | "updated_at" | "user_id"> & { user_id?: string }
  ): Promise<SolutionApproach> {
    const id = `appr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const approach: SolutionApproach = {
      ...data,
      id,
      user_id: data.user_id || "default-user",
      created_at: now,
      updated_at: now,
    };
    const list = this.approaches.get(data.problem_id) || [];
    list.push(approach);
    this.approaches.set(data.problem_id, list);
    return approach;
  }

  async updateApproach(id: string, problemId: string, updates: Partial<SolutionApproach>): Promise<SolutionApproach> {
    const list = this.approaches.get(problemId) || [];
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) throw new Error(`Approach ${id} not found`);
    const updated = { ...list[index], ...updates, updated_at: new Date().toISOString() };
    list[index] = updated;
    this.approaches.set(problemId, list);
    return updated;
  }

  async deleteApproach(id: string, problemId: string): Promise<boolean> {
    const list = this.approaches.get(problemId) || [];
    const filtered = list.filter((a) => a.id !== id);
    this.approaches.set(problemId, filtered);
    return true;
  }

  // LEARNING NOTES
  async getLearningNotesByProblemId(problemId: string): Promise<LearningNote | null> {
    return this.learningNotes.get(problemId) || null;
  }

  async saveLearningNotes(
    data: Omit<LearningNote, "id" | "created_at" | "updated_at" | "user_id"> & { user_id?: string }
  ): Promise<LearningNote> {
    const existing = this.learningNotes.get(data.problem_id);
    const now = new Date().toISOString();
    const note: LearningNote = {
      ...existing,
      ...data,
      id: existing?.id || `note-${Date.now()}`,
      user_id: data.user_id || existing?.user_id || "default-user",
      created_at: existing?.created_at || now,
      updated_at: now,
    };
    this.learningNotes.set(data.problem_id, note);
    return note;
  }

  // PROBLEM ATTEMPTS
  async getAttemptsByProblemId(problemId: string): Promise<ProblemAttempt[]> {
    return (this.attempts.get(problemId) || []).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async createAttempt(
    data: Omit<ProblemAttempt, "id" | "created_at" | "user_id"> & { user_id?: string }
  ): Promise<ProblemAttempt> {
    const id = `att-${Date.now()}`;
    const attempt: ProblemAttempt = {
      ...data,
      id,
      user_id: data.user_id || "default-user",
      created_at: new Date().toISOString(),
    };
    const list = this.attempts.get(data.problem_id) || [];
    list.push(attempt);
    this.attempts.set(data.problem_id, list);
    return attempt;
  }

  // TOPICS & PREREQUISITES
  async getTopics(): Promise<Topic[]> {
    return Array.from(this.topics.values()).sort((a, b) => a.sort_order - b.sort_order);
  }

  async getTopicBySlug(slug: string): Promise<Topic | null> {
    for (const t of this.topics.values()) {
      if (t.slug === slug) return t;
    }
    return null;
  }

  async getPrerequisites(): Promise<TopicPrerequisite[]> {
    return this.prerequisites;
  }

  async getTopicMastery(): Promise<TopicMastery[]> {
    const topics = await this.getTopics();
    const problems = await this.getProblems();

    return topics.map((t) => {
      const topicProblems = problems.filter((p) => p.primary_topic?.toLowerCase() === t.name.toLowerCase());
      const solved = topicProblems.filter((p) => p.status.includes("Solved") || p.status === "Mastered");
      const independent = topicProblems.filter((p) => p.status === "Solved Independently" || p.status === "Mastered");
      const hints = topicProblems.filter((p) => p.status === "Solved With Hint" || p.used_external_help);

      let status: TopicMastery["learning_status"] = "Not Started";
      let score = 0;

      if (topicProblems.length > 0) {
        if (solved.length === 0) {
          status = "Currently Learning";
          score = 15;
        } else if (solved.length < 3) {
          status = "Practising";
          score = 40;
        } else if (independent.length >= 4) {
          status = "Strong";
          score = 90;
        } else {
          status = "Comfortable";
          score = 70;
        }
      }

      return {
        id: `tm-${t.id}`,
        user_id: "default-user",
        topic_id: t.id,
        topic_name: t.name,
        mastery_score: score,
        problems_solved_count: solved.length,
        independent_solves_count: independent.length,
        hints_used_count: hints.length,
        learning_status: status,
        updated_at: new Date().toISOString(),
      };
    });
  }

  // ROADMAPS
  async getRoadmaps(): Promise<Roadmap[]> {
    return Array.from(this.roadmaps.values());
  }

  async getRoadmapBySlug(slug: string): Promise<Roadmap | null> {
    for (const r of this.roadmaps.values()) {
      if (r.slug === slug) return r;
    }
    return null;
  }

  async getRoadmapItems(roadmapId: string): Promise<RoadmapItem[]> {
    return Array.from(this.roadmapItems.values())
      .filter((ri) => ri.roadmap_id === roadmapId)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  async getRoadmapProgress(roadmapId: string): Promise<Map<string, boolean>> {
    const items = await this.getRoadmapItems(roadmapId);
    const progressMap = new Map<string, boolean>();
    const problems = await this.getProblems();

    items.forEach((item) => {
      // Check if problem with matching title or external_id is solved
      const isSolved = problems.some(
        (p) =>
          (p.title.toLowerCase() === item.title.toLowerCase() ||
            (p.external_id && p.external_id === item.external_id)) &&
          (p.status.includes("Solved") || p.status === "Mastered")
      );
      progressMap.set(item.id, isSolved);
    });

    return progressMap;
  }

  async toggleRoadmapItem(roadmapItemId: string, isCompleted: boolean): Promise<void> {
    this.roadmapProgress.set(roadmapItemId, {
      id: `rp-${roadmapItemId}`,
      user_id: "default-user",
      roadmap_item_id: roadmapItemId,
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : undefined,
    });
  }

  // REVISION CENTRE (SPACED REPETITION)
  async getRevisionItems(): Promise<RevisionItem[]> {
    const today = new Date().toISOString().split("T")[0];
    const items = Array.from(this.revisionItems.values());

    return items.map((item) => {
      const prob = this.problems.get(item.problem_id);
      return {
        ...item,
        problem_title: prob?.title || "Problem",
        problem_slug: prob?.slug || "problem",
        problem_difficulty: prob?.difficulty || "Medium",
        problem_platform: prob?.platform || "LeetCode",
        is_overdue: item.scheduled_for < today && item.recall_grade !== "Mastered",
      };
    });
  }

  async scheduleRevision(problemId: string, intervalDays: number = 1): Promise<RevisionItem> {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + intervalDays);
    const scheduled_for = scheduledDate.toISOString().split("T")[0];

    const existing = this.revisionItems.get(problemId);
    const item: RevisionItem = {
      id: existing?.id || `rev-${Date.now()}`,
      user_id: "default-user",
      problem_id: problemId,
      interval_stage: intervalDays,
      scheduled_for,
      review_count: (existing?.review_count || 0) + 1,
      is_overdue: false,
      created_at: existing?.created_at || new Date().toISOString(),
    };
    this.revisionItems.set(problemId, item);
    return item;
  }

  async recordRevisionOutcome(problemId: string, grade: RecallGrade): Promise<RevisionItem> {
    const existing = this.revisionItems.get(problemId);
    let nextDays = 1;

    if (grade === "Forgot") {
      nextDays = 1; // Reset to tomorrow
    } else if (grade === "Needed Hints") {
      nextDays = existing?.interval_stage || 1; // Repeat current
    } else if (grade === "Partial Recall") {
      nextDays = Math.max(1, Math.round((existing?.interval_stage || 1) * 1.5));
    } else if (grade === "Solved Independently") {
      const current = existing?.interval_stage || 1;
      if (current === 1) nextDays = 3;
      else if (current === 3) nextDays = 7;
      else if (current === 7) nextDays = 14;
      else if (current === 14) nextDays = 30;
      else nextDays = 60;
    } else if (grade === "Mastered") {
      nextDays = 90;
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + nextDays);

    const updated: RevisionItem = {
      id: existing?.id || `rev-${Date.now()}`,
      user_id: "default-user",
      problem_id: problemId,
      interval_stage: nextDays,
      scheduled_for: nextDate.toISOString().split("T")[0],
      last_reviewed_at: new Date().toISOString(),
      recall_grade: grade,
      review_count: (existing?.review_count || 0) + 1,
      is_overdue: false,
      created_at: existing?.created_at || new Date().toISOString(),
    };
    this.revisionItems.set(problemId, updated);

    // If mastered, also update the problem status
    if (grade === "Mastered") {
      const prob = this.problems.get(problemId);
      if (prob) {
        await this.updateProblem(problemId, { status: "Mastered", confidence_rating: 5 });
      }
    }

    return updated;
  }

  // CONTESTS
  async getContests(): Promise<ContestResult[]> {
    return Array.from(this.contestResults.values()).sort(
      (a, b) => new Date(b.contest_date).getTime() - new Date(a.contest_date).getTime()
    );
  }

  async createContestResult(
    data: Omit<ContestResult, "id" | "created_at" | "user_id"> & { user_id?: string }
  ): Promise<ContestResult> {
    const id = `cntst-${Date.now()}`;
    const result: ContestResult = {
      ...data,
      id,
      user_id: data.user_id || "default-user",
      created_at: new Date().toISOString(),
    };
    this.contestResults.set(id, result);
    return result;
  }

  // PLATFORM ACCOUNTS & SYNC
  async getPlatformAccounts(): Promise<PlatformAccount[]> {
    return Array.from(this.platformAccounts.values());
  }

  async updatePlatformAccount(platform: PlatformType, updates: Partial<PlatformAccount>): Promise<PlatformAccount> {
    const existing = this.platformAccounts.get(platform) || {
      id: `pa-${platform}`,
      user_id: "default-user",
      platform,
      handle: "",
      is_connected: false,
      sync_status: "IDLE",
    };
    const updated = { ...existing, ...updates };
    this.platformAccounts.set(platform, updated);
    return updated;
  }

  async getSyncLogs(): Promise<SyncLog[]> {
    return [...this.syncLogs].reverse();
  }

  async logSync(log: Omit<SyncLog, "id" | "created_at" | "user_id">): Promise<void> {
    this.syncLogs.push({
      ...log,
      id: `sync-${Date.now()}`,
      user_id: "default-user",
      created_at: new Date().toISOString(),
    });
  }

  // USER ACTIVITY & STREAKS
  async getUserActivity(): Promise<UserActivity[]> {
    return Array.from(this.userActivities.values()).sort(
      (a, b) => a.activity_date.localeCompare(b.activity_date)
    );
  }

  async recordActivityToday(solved: number, submissions: number, timeSpentMinutes: number): Promise<void> {
    const today = new Date().toISOString().split("T")[0];
    const existing = this.userActivities.get(today) || {
      id: `act-${today}`,
      user_id: "default-user",
      activity_date: today,
      problems_solved: 0,
      submissions_count: 0,
      time_spent_minutes: 0,
      points: 0,
    };
    const updated: UserActivity = {
      ...existing,
      problems_solved: existing.problems_solved + solved,
      submissions_count: existing.submissions_count + submissions,
      time_spent_minutes: existing.time_spent_minutes + timeSpentMinutes,
      points: existing.points + solved * 10 + 5,
    };
    this.userActivities.set(today, updated);
  }

  // OVERALL STATS
  async getOverallStats(): Promise<OverallStats> {
    const problems = await this.getProblems();
    let independent = 0;
    let hint = 0;
    let revision = 0;
    let mastered = 0;
    let notAttempted = 0;
    let totalTime = 0;
    let totalAttempts = 0;

    for (const p of problems) {
      if (p.status === "Solved Independently") independent++;
      else if (p.status === "Solved With Hint") hint++;
      else if (p.status === "Needs Revision") revision++;
      else if (p.status === "Mastered") mastered++;
      else if (p.status === "Not Started") notAttempted++;

      totalTime += p.time_spent_minutes || 0;
      const atts = this.attempts.get(p.id) || [];
      totalAttempts += Math.max(1, atts.length);
    }

    // Streak calculation from activity
    const activities = await this.getUserActivity();
    let streak = 0;
    if (activities.length > 0) {
      streak = activities.filter((a) => a.problems_solved > 0).length;
    }

    return {
      total_problems: problems.length,
      total_attempts: totalAttempts,
      independently_solved: independent,
      solved_with_hint: hint,
      needs_revision: revision,
      mastered,
      not_attempted: notAttempted,
      current_streak: streak,
      total_practice_time_minutes: totalTime,
    };
  }

  async getPlatformStats(): Promise<PlatformStat[]> {
    const problems = await this.getProblems();
    const platforms: PlatformType[] = ["LeetCode", "Codeforces", "CodeChef", "AtCoder", "HackerRank", "GeeksforGeeks"];

    return platforms.map((plat) => {
      const platProblems = problems.filter((p) => p.platform === plat);
      const solved = platProblems.filter((p) => p.status.includes("Solved") || p.status === "Mastered");
      const easy = platProblems.filter((p) => p.difficulty === "Easy" && (p.status.includes("Solved") || p.status === "Mastered"));
      const medium = platProblems.filter((p) => p.difficulty === "Medium" && (p.status.includes("Solved") || p.status === "Mastered"));
      const hard = platProblems.filter((p) => p.difficulty === "Hard" && (p.status.includes("Solved") || p.status === "Mastered"));
      const account = this.platformAccounts.get(plat);

      return {
        platform: plat,
        solved_count: solved.length,
        total_count: platProblems.length,
        easy_count: easy.length,
        medium_count: medium.length,
        hard_count: hard.length,
        rating: account?.rating,
      };
    });
  }

  async getLearningIntelligenceSummary(): Promise<LearningIntelligenceSummary> {
    const mastery = await this.getTopicMastery();
    const revisions = await this.getRevisionItems();
    const overdue = revisions.filter((r) => r.is_overdue);

    const strongest = mastery.filter((m) => m.learning_status === "Strong").map((m) => m.topic_name || "");
    const weakest = mastery.filter((m) => m.learning_status === "Practising" || m.learning_status === "Currently Learning").map((m) => m.topic_name || "");
    const highHints = mastery.filter((m) => m.hints_used_count > 0).map((m) => m.topic_name || "");

    const advice: string[] = [];
    if (overdue.length > 0) {
      advice.push(`You have ${overdue.length} overdue revision questions. Clear your spaced repetition queue before starting new topics.`);
    }
    if (highHints.length > 0) {
      advice.push(`You frequently required hints on ${highHints.slice(0, 2).join(" & ")}. Practice 2-3 foundational problems independently.`);
    }
    if (strongest.length > 0) {
      advice.push(`Strong confidence detected in ${strongest.slice(0, 2).join(", ")}. Advance to hard problems or contest variations.`);
    }
    if (advice.length === 0) {
      advice.push("Maintain your daily streak and tackle the next roadmap milestone in NeetCode 150.");
    }

    const headline = weakest.length > 0
      ? `Focus recommended on ${weakest.slice(0, 2).join(" & ")}. Keep strengthening core problem patterns.`
      : "Excellent balance across your active DSA topics. Ready for progressive challenges.";

    return {
      headline,
      strongest_topics: strongest.slice(0, 3),
      weakest_topics: weakest.slice(0, 3),
      frequently_needed_hints_topics: highHints.slice(0, 3),
      overdue_revisions_count: overdue.length,
      recommended_next_concepts: weakest.slice(0, 3),
      advice_bullets: advice,
    };
  }

  // EXPORT / IMPORT
  async exportFullJson(): Promise<string> {
    return JSON.stringify({
      version: "1.0.0",
      exported_at: new Date().toISOString(),
      problems: Array.from(this.problems.values()),
      approaches: Array.from(this.approaches.values()).flat(),
      learningNotes: Array.from(this.learningNotes.values()),
      attempts: Array.from(this.attempts.values()).flat(),
      revisionItems: Array.from(this.revisionItems.values()),
      contestResults: Array.from(this.contestResults.values()),
      platformAccounts: Array.from(this.platformAccounts.values()),
      userActivities: Array.from(this.userActivities.values()),
    }, null, 2);
  }

  async importFullJson(jsonStr: string): Promise<{ success: boolean; importedCount: number }> {
    const data = JSON.parse(jsonStr);
    let count = 0;
    if (Array.isArray(data.problems)) {
      data.problems.forEach((p: Problem) => {
        this.problems.set(p.id, p);
        count++;
      });
    }
    if (Array.isArray(data.approaches)) {
      data.approaches.forEach((a: SolutionApproach) => {
        const list = this.approaches.get(a.problem_id) || [];
        list.push(a);
        this.approaches.set(a.problem_id, list);
      });
    }
    if (Array.isArray(data.learningNotes)) {
      data.learningNotes.forEach((n: LearningNote) => {
        this.learningNotes.set(n.problem_id, n);
      });
    }
    if (Array.isArray(data.revisionItems)) {
      data.revisionItems.forEach((r: RevisionItem) => {
        this.revisionItems.set(r.problem_id, r);
      });
    }
    return { success: true, importedCount: count };
  }
  seedSampleWorkspaceData(): void {
    const now = new Date();
    const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
    const daysFromNowDate = (d: number) => new Date(now.getTime() + d * 86400000).toISOString().split("T")[0];

    const sampleProblems: Problem[] = [
      {
        id: "prob-two-sum",
        user_id: "default-user",
        slug: "two-sum",
        title: "Two Sum",
        platform: "LeetCode",
        external_id: "1",
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
        subtopic: "Hash Map",
        tags: ["Array", "Hash Table"],
        created_at: daysAgo(12),
        updated_at: daysAgo(1),
        last_attempted_at: daysAgo(1),
      },
      {
        id: "prob-valid-anagram",
        user_id: "default-user",
        slug: "valid-anagram",
        title: "Valid Anagram",
        platform: "LeetCode",
        external_id: "242",
        url: "https://leetcode.com/problems/valid-anagram/",
        difficulty: "Easy",
        status: "Solved Independently",
        confidence_rating: 5,
        is_bookmarked: false,
        viewed_editorial: false,
        used_external_help: false,
        time_spent_minutes: 15,
        programming_language: "C++",
        primary_topic: "Strings",
        subtopic: "Frequency Counter",
        tags: ["String", "Hash Table"],
        created_at: daysAgo(10),
        updated_at: daysAgo(2),
        last_attempted_at: daysAgo(2),
      },
      {
        id: "prob-group-anagrams",
        user_id: "default-user",
        slug: "group-anagrams",
        title: "Group Anagrams",
        platform: "LeetCode",
        external_id: "49",
        url: "https://leetcode.com/problems/group-anagrams/",
        difficulty: "Medium",
        status: "Solved With Hint",
        confidence_rating: 4,
        is_bookmarked: true,
        viewed_editorial: true,
        used_external_help: false,
        time_spent_minutes: 35,
        programming_language: "C++",
        primary_topic: "Arrays",
        subtopic: "Hash Map",
        tags: ["Array", "Hash Table", "String"],
        created_at: daysAgo(8),
        updated_at: daysAgo(3),
        last_attempted_at: daysAgo(3),
      },
      {
        id: "prob-two-sum-ii",
        user_id: "default-user",
        slug: "two-sum-ii-input-array-is-sorted",
        title: "Two Sum II - Input Array Is Sorted",
        platform: "LeetCode",
        external_id: "167",
        url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
        difficulty: "Medium",
        status: "Solved Independently",
        confidence_rating: 4,
        is_bookmarked: false,
        viewed_editorial: false,
        used_external_help: false,
        time_spent_minutes: 25,
        programming_language: "C++",
        primary_topic: "Two Pointers",
        tags: ["Array", "Two Pointers", "Binary Search"],
        created_at: daysAgo(7),
        updated_at: daysAgo(2),
        last_attempted_at: daysAgo(2),
      },
      {
        id: "prob-3sum",
        user_id: "default-user",
        slug: "3sum",
        title: "3Sum",
        platform: "LeetCode",
        external_id: "15",
        url: "https://leetcode.com/problems/3sum/",
        difficulty: "Medium",
        status: "Needs Revision",
        confidence_rating: 3,
        is_bookmarked: true,
        viewed_editorial: true,
        used_external_help: true,
        time_spent_minutes: 45,
        programming_language: "C++",
        primary_topic: "Two Pointers",
        tags: ["Array", "Two Pointers", "Sorting"],
        created_at: daysAgo(6),
        updated_at: daysAgo(1),
        last_attempted_at: daysAgo(1),
      },
      {
        id: "prob-trapping-rain-water",
        user_id: "default-user",
        slug: "trapping-rain-water",
        title: "Trapping Rain Water",
        platform: "LeetCode",
        external_id: "42",
        url: "https://leetcode.com/problems/trapping-rain-water/",
        difficulty: "Hard",
        status: "Needs Revision",
        confidence_rating: 3,
        is_bookmarked: true,
        viewed_editorial: true,
        used_external_help: true,
        time_spent_minutes: 55,
        programming_language: "C++",
        primary_topic: "Two Pointers",
        subtopic: "Monotonic Stack",
        tags: ["Array", "Two Pointers", "Stack"],
        created_at: daysAgo(5),
        updated_at: daysAgo(4),
        last_attempted_at: daysAgo(4),
      },
      {
        id: "prob-best-time-stock",
        user_id: "default-user",
        slug: "best-time-to-buy-and-sell-stock",
        title: "Best Time to Buy and Sell Stock",
        platform: "LeetCode",
        external_id: "121",
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        difficulty: "Easy",
        status: "Mastered",
        confidence_rating: 5,
        is_bookmarked: false,
        viewed_editorial: false,
        used_external_help: false,
        time_spent_minutes: 20,
        programming_language: "C++",
        primary_topic: "Sliding Window",
        tags: ["Array", "Dynamic Programming"],
        created_at: daysAgo(14),
        updated_at: daysAgo(5),
        last_attempted_at: daysAgo(5),
      },
      {
        id: "prob-binary-search",
        user_id: "default-user",
        slug: "binary-search",
        title: "Binary Search",
        platform: "LeetCode",
        external_id: "704",
        url: "https://leetcode.com/problems/binary-search/",
        difficulty: "Easy",
        status: "Mastered",
        confidence_rating: 5,
        is_bookmarked: false,
        viewed_editorial: false,
        used_external_help: false,
        time_spent_minutes: 15,
        programming_language: "C++",
        primary_topic: "Binary Search",
        tags: ["Array", "Binary Search"],
        created_at: daysAgo(14),
        updated_at: daysAgo(6),
        last_attempted_at: daysAgo(6),
      },
      {
        id: "prob-watermelon",
        user_id: "default-user",
        slug: "watermelon",
        title: "Watermelon",
        platform: "Codeforces",
        external_id: "4A",
        url: "https://codeforces.com/problemset/problem/4/A",
        difficulty: "Easy",
        status: "Solved Independently",
        confidence_rating: 5,
        is_bookmarked: false,
        viewed_editorial: false,
        used_external_help: false,
        time_spent_minutes: 10,
        programming_language: "C++",
        primary_topic: "Arrays",
        subtopic: "Math",
        tags: ["brute force", "math"],
        created_at: daysAgo(9),
        updated_at: daysAgo(9),
        last_attempted_at: daysAgo(9),
      },
      {
        id: "prob-way-too-long-words",
        user_id: "default-user",
        slug: "way-too-long-words",
        title: "Way Too Long Words",
        platform: "Codeforces",
        external_id: "71A",
        url: "https://codeforces.com/problemset/problem/71/A",
        difficulty: "Easy",
        status: "Solved Independently",
        confidence_rating: 5,
        is_bookmarked: false,
        viewed_editorial: false,
        used_external_help: false,
        time_spent_minutes: 12,
        programming_language: "C++",
        primary_topic: "Strings",
        tags: ["strings"],
        created_at: daysAgo(9),
        updated_at: daysAgo(9),
        last_attempted_at: daysAgo(9),
      },
    ];

    sampleProblems.forEach((p) => this.problems.set(p.id, p));

    // Seed Approaches
    this.approaches.set("prob-two-sum", [
      {
        id: "appr-ts-1",
        user_id: "default-user",
        problem_id: "prob-two-sum",
        approach_type: "Brute Force",
        title: "Check all pairs with nested loops",
        intuition: "Iterate over every pair (i, j) where i < j and check if nums[i] + nums[j] == target.",
        algorithm_steps: "1. Outer loop i from 0 to n-1\n2. Inner loop j from i+1 to n-1\n3. If nums[i] + nums[j] == target, return {i, j}",
        time_complexity: "O(N^2)",
        space_complexity: "O(1)",
        code: "vector<int> twoSum(vector<int>& nums, int target) {\n    int n = nums.size();\n    for (int i = 0; i < n; ++i) {\n        for (int j = i + 1; j < n; ++j) {\n            if (nums[i] + nums[j] == target) return {i, j};\n        }\n    }\n    return {};\n}",
        language: "C++",
        created_at: daysAgo(12),
        updated_at: daysAgo(12),
      },
      {
        id: "appr-ts-2",
        user_id: "default-user",
        problem_id: "prob-two-sum",
        approach_type: "Optimal",
        title: "One-pass Hash Map Complement Lookup",
        intuition: "As we iterate through the array, look up if the required complement (target - num) is already stored in our hash map. If yes, we found our pair in O(1) time.",
        algorithm_steps: "1. Create hash map mapping value -> index\n2. For each element num at index i:\n   a. Calculate complement = target - num\n   b. If complement in map, return {map[complement], i}\n   c. Store map[num] = i\n3. Return empty if no pair found",
        time_complexity: "O(N)",
        space_complexity: "O(N)",
        code: "vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> seen;\n    for (int i = 0; i < (int)nums.size(); ++i) {\n        int comp = target - nums[i];\n        if (seen.count(comp)) {\n            return {seen[comp], i};\n        }\n        seen[nums[i]] = i;\n    }\n    return {};\n}",
        language: "C++",
        created_at: daysAgo(12),
        updated_at: daysAgo(12),
      },
    ]);

    this.approaches.set("prob-trapping-rain-water", [
      {
        id: "appr-trw-1",
        user_id: "default-user",
        problem_id: "prob-trapping-rain-water",
        approach_type: "Optimal",
        title: "Two Pointers with LeftMax and RightMax",
        intuition: "Water trapped at any column is determined by min(max_left, max_right) - height[i]. With two pointers moving inward, the smaller maximum always governs the water volume.",
        algorithm_steps: "1. Init left = 0, right = n - 1\n2. Track left_max = 0, right_max = 0\n3. While left < right:\n   - If height[left] < height[right]: update left_max and add left_max - height[left], left++\n   - Else: update right_max and add right_max - height[right], right--",
        time_complexity: "O(N)",
        space_complexity: "O(1)",
        code: "int trap(vector<int>& height) {\n    int l = 0, r = height.size() - 1;\n    int lmax = 0, rmax = 0, ans = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            if (height[l] >= lmax) lmax = height[l];\n            else ans += lmax - height[l];\n            l++;\n        } else {\n            if (height[r] >= rmax) rmax = height[r];\n            else ans += rmax - height[r];\n            r--;\n        }\n    }\n    return ans;\n}",
        language: "C++",
        created_at: daysAgo(5),
        updated_at: daysAgo(5),
      },
    ]);

    // Seed Notes
    this.learningNotes.set("prob-two-sum", {
      id: "note-two-sum",
      user_id: "default-user",
      problem_id: "prob-two-sum",
      understanding_summary: "Find two distinct indices in an array whose elements sum up to a given target. Exactly one solution exists.",
      initial_thought: "Check all pairs with nested loops O(N^2), but lookup can be optimized with an auxiliary hash map.",
      main_concept_learned: "One-pass hash table complement lookup reduces time complexity from quadratic to linear.",
      algorithmic_pattern: "Hash Table / Complement Matching",
      key_observation: "complement = target - nums[i]. Check map before inserting nums[i] to prevent using the same element twice.",
      mistakes_to_avoid: "Don't insert into map before checking, or you might match an element with itself if target == 2 * num.",
      when_to_use: "Pair sum or pair difference queries in unsorted arrays.",
      related_questions_notes: "Two Sum II (sorted array uses two pointers), 3Sum (sort + two pointers), 4Sum.",
      created_at: daysAgo(12),
      updated_at: daysAgo(1),
    });

    this.learningNotes.set("prob-trapping-rain-water", {
      id: "note-trw",
      user_id: "default-user",
      problem_id: "prob-trapping-rain-water",
      understanding_summary: "Given elevation map bars, calculate how much water it can trap after raining.",
      initial_thought: "Precompute prefix maximum and suffix maximum arrays in O(N) space.",
      main_concept_learned: "Two pointer inward convergence eliminates O(N) auxiliary space down to O(1).",
      algorithmic_pattern: "Two Pointers / Monotonic Bounding",
      key_observation: "The height of water trapped at index i is strictly bounded by the shorter of the two boundary heights.",
      mistakes_to_avoid: "Be careful with 0-height bars and edges.",
      when_to_use: "Container with most water, histogram problems, skyline queries.",
      created_at: daysAgo(5),
      updated_at: daysAgo(4),
    });

    // Seed Revision Queue
    this.revisionItems.set("prob-trapping-rain-water", {
      id: "rev-1",
      user_id: "default-user",
      problem_id: "prob-trapping-rain-water",
      interval_stage: 3,
      scheduled_for: daysFromNowDate(-2),
      last_reviewed_at: daysAgo(5),
      recall_grade: "Needed Hints",
      review_count: 1,
      is_overdue: true,
      created_at: daysAgo(5),
    });

    this.revisionItems.set("prob-3sum", {
      id: "rev-2",
      user_id: "default-user",
      problem_id: "prob-3sum",
      interval_stage: 1,
      scheduled_for: daysFromNowDate(0),
      last_reviewed_at: daysAgo(1),
      recall_grade: "Partial Recall",
      review_count: 1,
      is_overdue: false,
      created_at: daysAgo(6),
    });

    this.revisionItems.set("prob-two-sum-ii", {
      id: "rev-3",
      user_id: "default-user",
      problem_id: "prob-two-sum-ii",
      interval_stage: 7,
      scheduled_for: daysFromNowDate(4),
      last_reviewed_at: daysAgo(3),
      recall_grade: "Solved Independently",
      review_count: 2,
      is_overdue: false,
      created_at: daysAgo(7),
    });

    this.revisionItems.set("prob-binary-search", {
      id: "rev-4",
      user_id: "default-user",
      problem_id: "prob-binary-search",
      interval_stage: 30,
      scheduled_for: daysFromNowDate(20),
      last_reviewed_at: daysAgo(10),
      recall_grade: "Mastered",
      review_count: 4,
      is_overdue: false,
      created_at: daysAgo(14),
    });

    // Seed Contest Results
    this.contestResults.set("cr-1", {
      id: "cr-1",
      user_id: "default-user",
      contest_id: "cf-980",
      platform: "Codeforces",
      contest_name: "Codeforces Round 980 (Div. 2)",
      contest_date: daysAgo(14),
      participation_type: "Live",
      rank: 412,
      problems_attempted: 5,
      problems_solved: 4,
      rating_before: 1640,
      rating_after: 1715,
      rating_change: 75,
      reflection_good: "Strong solve on Problem C with binary search on prefix sums.",
      reflection_unsolved: "Need faster implementation on tree problems.",
      created_at: daysAgo(14),
    });

    this.contestResults.set("cr-2", {
      id: "cr-2",
      user_id: "default-user",
      contest_id: "cf-978",
      platform: "Codeforces",
      contest_name: "Codeforces Round 978 (Div. 2)",
      contest_date: daysAgo(28),
      participation_type: "Live",
      rank: 780,
      problems_attempted: 4,
      problems_solved: 3,
      rating_before: 1580,
      rating_after: 1640,
      rating_change: 60,
      reflection_good: "Clean A & B speed.",
      reflection_unsolved: "Took 40 minutes debugging corner case on problem C.",
      created_at: daysAgo(28),
    });

    // Seed User Activities for past 14 days
    for (let i = 0; i < 14; i++) {
      const dt = daysFromNowDate(-i);
      const solves = i % 4 === 0 ? 0 : (i % 3) + 1;
      this.userActivities.set(dt, {
        id: `act-${dt}`,
        user_id: "default-user",
        activity_date: dt,
        problems_solved: solves,
        submissions_count: solves + 1,
        time_spent_minutes: solves * 25,
        points: solves * 10,
      });
    }
  }

}

// Global Singleton Repository
let repositoryInstance: InMemoryRepository | null = null;

export function getDbRepository(): InMemoryRepository {
  if (!repositoryInstance) {
    repositoryInstance = new InMemoryRepository();
    if (typeof window !== "undefined") {
      const isSeeded = localStorage.getItem("algoatlas-sample-seeded-v1");
      if (!isSeeded) {
        repositoryInstance.seedSampleWorkspaceData();
        localStorage.setItem("algoatlas-sample-seeded-v1", "true");
      }
    }
  }
  return repositoryInstance;
}
