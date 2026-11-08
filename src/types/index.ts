export type PlatformType =
  | "LeetCode"
  | "Codeforces"
  | "CodeChef"
  | "AtCoder"
  | "HackerRank"
  | "GeeksforGeeks"
  | "Other";

export type DifficultyLevel = "Easy" | "Medium" | "Hard";

export type ProblemStatus =
  | "Not Started"
  | "Attempted"
  | "Solved With Hint"
  | "Solved Independently"
  | "Needs Revision"
  | "Mastered";

export type ApproachType =
  | "Brute Force"
  | "Improved"
  | "Optimal"
  | "Alternative";

export type RecallGrade =
  | "Forgot"
  | "Needed Hints"
  | "Partial Recall"
  | "Solved Independently"
  | "Mastered";

export type ConceptCategory =
  | "Fundamentals"
  | "Data Structures"
  | "Algorithms & Patterns"
  | "Advanced";

export type ConceptStatus =
  | "Not Started"
  | "Currently Learning"
  | "Practising"
  | "Comfortable"
  | "Strong";

export type AttemptOutcome =
  | "Pass"
  | "TLE"
  | "WA"
  | "MLE"
  | "Runtime Error"
  | "Other";

export interface Profile {
  id: string;
  display_name: string;
  avatar_url?: string;
  preferred_language: string;
  daily_goal_minutes: number;
  daily_goal_problems: number;
  weekly_goal_problems: number;
  active_roadmap_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PlatformAccount {
  id: string;
  user_id: string;
  platform: PlatformType;
  handle: string;
  profile_url?: string;
  is_connected: boolean;
  rating?: number;
  max_rating?: number;
  rank_title?: string;
  last_synced_at?: string;
  sync_status?: "SUCCESS" | "FAILED" | "IN_PROGRESS" | "IDLE";
  sync_error?: string;
}

export interface Problem {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  platform: PlatformType;
  external_id?: string;
  url: string;
  difficulty: DifficultyLevel;
  problem_rating?: number;
  status: ProblemStatus;
  confidence_rating: number; // 1 to 5
  is_bookmarked: boolean;
  viewed_editorial: boolean;
  used_external_help: boolean;
  time_spent_minutes: number;
  programming_language: string;
  primary_topic?: string;
  subtopic?: string;
  tags?: string[];
  first_solved_at?: string;
  last_attempted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProblemPlatformRef {
  id: string;
  canonical_problem_id: string;
  linked_problem_id: string;
  user_id: string;
  notes?: string;
}

export interface ProblemAttempt {
  id: string;
  problem_id: string;
  user_id: string;
  attempt_number: number;
  outcome: AttemptOutcome;
  time_spent_minutes: number;
  language: string;
  code_submitted?: string;
  personal_notes?: string;
  created_at: string;
}

export interface SolutionApproach {
  id: string;
  problem_id: string;
  user_id: string;
  approach_type: ApproachType;
  title: string;
  intuition: string;
  algorithm_steps: string;
  time_complexity: string;
  space_complexity: string;
  code: string;
  language: string;
  tradeoffs?: string;
  created_at: string;
  updated_at: string;
}

export interface LearningNote {
  id: string;
  problem_id: string;
  user_id: string;
  understanding_summary?: string;
  initial_thought?: string;
  what_failed?: string;
  key_observation?: string;
  main_concept_learned?: string;
  algorithmic_pattern?: string;
  mistakes_to_avoid?: string;
  when_to_use?: string;
  related_questions_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CodeSnippet {
  id: string;
  problem_id: string;
  approach_id?: string;
  user_id: string;
  language: string;
  version_label: string;
  code: string;
  explanation?: string;
  created_at: string;
}

export interface Topic {
  id: string;
  slug: string;
  name: string;
  category: ConceptCategory;
  description: string;
  icon_name?: string;
  sort_order: number;
}

export interface TopicPrerequisite {
  id: string;
  topic_id: string;
  prerequisite_topic_id: string;
}

export interface TopicMastery {
  id: string;
  user_id: string;
  topic_id: string;
  topic_name?: string;
  mastery_score: number; // 0 to 100
  problems_solved_count: number;
  independent_solves_count: number;
  hints_used_count: number;
  learning_status: ConceptStatus;
  last_practiced_at?: string;
  updated_at: string;
}

export interface Roadmap {
  id: string;
  user_id?: string;
  title: string;
  slug: string;
  description: string;
  is_system: boolean;
  is_active: boolean;
  total_problems: number;
  completed_problems?: number;
}

export interface RoadmapItem {
  id: string;
  roadmap_id: string;
  topic_id?: string;
  topic_name?: string;
  title: string;
  external_url: string;
  platform: PlatformType;
  external_id?: string;
  difficulty: DifficultyLevel;
  sort_order: number;
  section_name: string;
  is_completed?: boolean;
}

export interface RoadmapProgress {
  id: string;
  user_id: string;
  roadmap_item_id: string;
  problem_id?: string;
  is_completed: boolean;
  completed_at?: string;
}

export interface RevisionItem {
  id: string;
  user_id: string;
  problem_id: string;
  problem_title?: string;
  problem_slug?: string;
  problem_difficulty?: DifficultyLevel;
  problem_platform?: PlatformType;
  interval_stage: number; // e.g. 1, 3, 7, 14, 30
  scheduled_for: string; // ISO date YYYY-MM-DD
  last_reviewed_at?: string;
  recall_grade?: RecallGrade;
  review_count: number;
  is_overdue: boolean;
  created_at: string;
}

export interface DailyTask {
  id: string;
  user_id: string;
  task_date: string;
  task_type: "Revision" | "Concept" | "Problem" | "Contest";
  title: string;
  target_ref_id?: string;
  reason: string;
  is_completed: boolean;
  completed_at?: string;
}

export interface Contest {
  id: string;
  platform: PlatformType;
  contest_name: string;
  contest_code?: string;
  contest_url?: string;
  start_time: string;
}

export interface ContestResult {
  id: string;
  user_id: string;
  contest_id?: string;
  platform: PlatformType;
  contest_name: string;
  contest_date: string;
  participation_type: "Live" | "Virtual" | "Practice";
  rank?: number;
  problems_attempted: number;
  problems_solved: number;
  rating_before?: number;
  rating_after?: number;
  rating_change?: number;
  reflection_good?: string;
  reflection_unsolved?: string;
  reflection_missing_concepts?: string;
  reflection_next_action?: string;
  created_at: string;
}

export interface SyncLog {
  id: string;
  user_id: string;
  platform: PlatformType;
  status: "SUCCESS" | "FAILED" | "IN_PROGRESS";
  synced_items_count: number;
  details?: string;
  error_message?: string;
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_date: string; // YYYY-MM-DD
  problems_solved: number;
  submissions_count: number;
  time_spent_minutes: number;
  points: number;
}

export interface OverallStats {
  total_problems: number;
  total_attempts: number;
  independently_solved: number;
  solved_with_hint: number;
  needs_revision: number;
  mastered: number;
  not_attempted: number;
  current_streak: number;
  total_practice_time_minutes: number;
}

export interface PlatformStat {
  platform: PlatformType;
  solved_count: number;
  total_count: number;
  easy_count: number;
  medium_count: number;
  hard_count: number;
  rating?: number;
}

export interface LearningIntelligenceSummary {
  headline: string;
  strongest_topics: string[];
  weakest_topics: string[];
  frequently_needed_hints_topics: string[];
  overdue_revisions_count: number;
  recommended_next_concepts: string[];
  advice_bullets: string[];
}
