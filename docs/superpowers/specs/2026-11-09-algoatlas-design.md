# AlgoAtlas — Personal DSA Learning OS: Design & Specification Document

**Product Name:** AlgoAtlas  
**Tagline:** Your Personal DSA Learning OS  
**Status:** Approved & Ready for Implementation  
**Date:** 2026-11-09  

---

## 1. Intent & Why

Competitive programming and DSA preparation across multiple platforms (LeetCode, Codeforces, CodeChef, AtCoder, HackerRank, GeeksforGeeks) leads to fragmented learning records:
- Solved counts hide superficial memorization vs true understanding.
- Multi-approach solutions (Brute Force, Improved, Optimal) are lost in platform scratchpads.
- Revision is ad-hoc, resulting in forgetting patterns within weeks.
- Weak topics and repeated mistakes are rarely mapped back to prerequisite gaps.

**AlgoAtlas** serves as a unified Operating System for DSA mastery:
1. **Central Problem Vault & Learning Journal:** Captures problem understanding, initial thoughts, failed attempts, and multi-approach solutions with code & complexity analysis.
2. **Concept Vault:** Knowledge base of DSA fundamentals, data structures, and algorithmic patterns with an explicit prerequisite DAG.
3. **Structured Roadmaps:** Built-in curated sheets (Striver A2Z, Striver SDE, NeetCode 150/250, Blind 75, Grind 75, Love Babbar 450, LeetCode 75, CSES, Codeforces lists) with cross-roadmap progress deduplication.
4. **Spaced Repetition Revision Centre:** Recall self-assessment scheduling (1d, 3d, 7d, 14d, 30d with SM-2 recall adjustment).
5. **Rule-Based Recommendation Engine:** "What Should I Learn Next?" that diagnoses gaps (overdue revisions -> missing prerequisites -> weak concepts -> roadmap next -> difficulty ramp).
6. **Platform Integrations:** Live public API adapters for Codeforces and AtCoder; manual/CSV sync for LeetCode, CodeChef, HackerRank, and GFG without prohibited scraping.
7. **Contest Tracker & CP Analytics:** Track contest rating progression, contest reflections, and consistency heatmaps.

---

## 2. Goals, Non-Goals, & Anti-Goals

### Goals
- Fully normalized PostgreSQL database schema with 21 tables and strict Supabase Row Level Security (RLS).
- High-performance Next.js App Router application with Tailwind CSS, Radix UI / shadcn/ui primitives, Lucide icons, and Recharts.
- Quick-add capture system with platform auto-detection from URLs (e.g. `leetcode.com/problems/...`, `codeforces.com/contest/.../problem/...`).
- Dual storage mode: Connected Supabase PostgreSQL backend with full RLS, and an in-memory/localStorage/demo repository adapter when Supabase env keys are pending configuration, guaranteeing zero crashes and 100% interactive testing out of the box.
- End-to-end type safety with TypeScript strict mode, Zod schemas, and React Hook Form.
- Comprehensive test coverage with Vitest unit tests and Playwright E2E tests.

### Non-Goals
- Real-time multiplayer collaborative coding rooms.
- Prohibited automated scraping of platforms that disallow scrapers or require authenticated browser cookies.
- Automated code submission execution against private test suites.

### Anti-Goals
- Never fake platform synchronization or display simulated success messages when an API call fails.
- Never hardcode dashboard metrics or intelligence advice.
- Never expose Supabase service role keys to the browser client.
- Avoid cluttered UI with excessive animations, neon gradients, or sluggish dependencies.

---

## 3. Architecture & Data Flow

```
+---------------------------------------------------------------------------------------+
|                                  AlgoAtlas Frontend                                   |
|  - App Router: Next.js 15+ / React 19 / TypeScript / Tailwind CSS / Lucide / Recharts  |
|  - Layout: Collapsible Sidebar + Command Header (Quick Add, Search) + Dark Mode Theme |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
|                               Next.js Server Layer                                    |
|  - Server Actions & Route Handlers (`/api/integrations/...`, `/api/export`, etc.)      |
|  - Zod Validation Layer & Domain Services:                                            |
|      * Recommendation Engine (`services/recommendationEngine.ts`)                    |
|      * Spaced Repetition Engine (`services/revisionEngine.ts`)                        |
|      * Platform Adapters (`services/platformAdapters/*`)                              |
+-------------------------------------------+-------------------------------------------+
                                            |
                      +---------------------+---------------------+
                      |                                           |
                      v                                           v
+-----------------------------------------+   +-----------------------------------------+
|        Supabase PostgreSQL Backend       |   |       External Public APIs (Server)     |
| - 21 Relational Tables                  |   | - Codeforces Public API:                |
| - Row Level Security (RLS) on user_id   |   |   user.info, user.status, user.rating   |
| - Database Triggers (updated_at)        |   | - AtCoder Problems Community API        |
| - Full Foreign Keys & Unique Indices    |   | - Rate limited & cached responses       |
+-----------------------------------------+   +-----------------------------------------+
```

---

## 4. Relational Database Schema (21 Tables)

1. `profiles`: `id (uuid, FK auth.users)`, `display_name`, `avatar_url`, `preferred_language`, `daily_goal_minutes`, `daily_goal_problems`, `weekly_goal_problems`, `active_roadmap_id`, `created_at`, `updated_at`.
2. `platform_accounts`: `id (uuid)`, `user_id (uuid)`, `platform (enum)`, `handle (text)`, `profile_url`, `is_connected`, `rating`, `max_rating`, `rank_title`, `last_synced_at`, `sync_status`, `sync_error`.
3. `problems`: `id (uuid)`, `user_id (uuid)`, `title (text)`, `slug (text)`, `platform (enum)`, `external_id (text)`, `url (text)`, `difficulty ('Easy'|'Medium'|'Hard')`, `problem_rating (int)`, `status ('Not Started'|'Attempted'|'Solved With Hint'|'Solved Independently'|'Needs Revision'|'Mastered')`, `confidence_rating (int 1-5)`, `is_bookmarked (bool)`, `viewed_editorial (bool)`, `used_external_help (bool)`, `time_spent_minutes (int)`, `programming_language (text)`, `first_solved_at`, `last_attempted_at`, `created_at`, `updated_at`.
4. `problem_platform_refs`: `id (uuid)`, `canonical_problem_id (uuid)`, `linked_problem_id (uuid)`, `user_id (uuid)`, `notes (text)`. Allows linking equivalent problems across platforms (e.g. LC Two Sum <-> GFG Pair with given sum).
5. `problem_attempts`: `id (uuid)`, `problem_id (uuid)`, `user_id (uuid)`, `attempt_number (int)`, `outcome ('Pass'|'TLE'|'WA'|'MLE'|'Runtime Error')`, `time_spent_minutes`, `language`, `code_submitted`, `personal_notes`, `created_at`.
6. `solution_approaches`: `id (uuid)`, `problem_id (uuid)`, `user_id (uuid)`, `approach_type ('Brute Force'|'Improved'|'Optimal'|'Alternative')`, `title (text)`, `intuition (text)`, `algorithm_steps (text)`, `time_complexity (text)`, `space_complexity (text)`, `code (text)`, `language (text)`, `tradeoffs (text)`, `created_at`, `updated_at`.
7. `learning_notes`: `id (uuid)`, `problem_id (uuid)`, `user_id (uuid)`, `understanding_summary (text)`, `initial_thought (text)`, `what_failed (text)`, `key_observation (text)`, `main_concept_learned (text)`, `algorithmic_pattern (text)`, `mistakes_to_avoid (text)`, `when_to_use (text)`, `related_questions_notes (text)`, `created_at`, `updated_at`.
8. `code_snippets`: `id (uuid)`, `problem_id (uuid)`, `approach_id (uuid null)`, `user_id (uuid)`, `language (text)`, `version_label (text)`, `code (text)`, `explanation (text)`, `created_at`.
9. `topics`: `id (uuid)`, `slug (text unique)`, `name (text)`, `category ('Fundamentals'|'Data Structures'|'Algorithms & Patterns'|'Advanced')`, `description (text)`, `icon_name (text)`, `sort_order (int)`.
10. `problem_topics`: `id (uuid)`, `problem_id (uuid)`, `topic_id (uuid)`, `is_primary (bool)`.
11. `topic_prerequisites`: `id (uuid)`, `topic_id (uuid)`, `prerequisite_topic_id (uuid)`. (e.g. Arrays -> Prefix Sum -> Sliding Window).
12. `topic_mastery`: `id (uuid)`, `user_id (uuid)`, `topic_id (uuid)`, `mastery_score (float 0-100)`, `problems_solved_count (int)`, `independent_solves_count (int)`, `hints_used_count (int)`, `learning_status ('Not Started'|'Currently Learning'|'Practising'|'Comfortable'|'Strong')`, `last_practiced_at`, `updated_at`.
13. `roadmaps`: `id (uuid)`, `user_id (uuid null for system built-in)`, `title (text)`, `slug (text)`, `description (text)`, `is_system (bool)`, `is_active (bool)`, `total_problems (int)`.
14. `roadmap_items`: `id (uuid)`, `roadmap_id (uuid)`, `topic_id (uuid)`, `title (text)`, `external_url (text)`, `platform (text)`, `external_id (text)`, `difficulty (text)`, `sort_order (int)`, `section_name (text)`.
15. `roadmap_progress`: `id (uuid)`, `user_id (uuid)`, `roadmap_item_id (uuid)`, `problem_id (uuid null)`, `is_completed (bool)`, `completed_at (timestamp)`.
16. `revision_items`: `id (uuid)`, `user_id (uuid)`, `problem_id (uuid)`, `interval_stage (int: 1, 3, 7, 14, 30)`, `scheduled_for (date)`, `last_reviewed_at (timestamp)`, `recall_grade ('Forgot'|'Needed Hints'|'Partial Recall'|'Solved Independently'|'Mastered')`, `review_count (int)`, `is_overdue (bool)`, `created_at`.
17. `daily_tasks`: `id (uuid)`, `user_id (uuid)`, `task_date (date)`, `task_type ('Revision'|'Concept'|'Problem'|'Contest')`, `title (text)`, `target_ref_id (uuid)`, `reason (text)`, `is_completed (bool)`, `completed_at (timestamp)`.
18. `contests`: `id (uuid)`, `platform (text)`, `contest_name (text)`, `contest_code (text)`, `contest_url (text)`, `start_time (timestamp)`.
19. `contest_results`: `id (uuid)`, `user_id (uuid)`, `contest_id (uuid null)`, `platform (text)`, `contest_name (text)`, `contest_date (date)`, `participation_type ('Live'|'Virtual'|'Practice')`, `rank (int)`, `problems_attempted (int)`, `problems_solved (int)`, `rating_before (int)`, `rating_after (int)`, `rating_change (int)`, `reflection_good (text)`, `reflection_unsolved (text)`, `reflection_missing_concepts (text)`, `reflection_next_action (text)`, `created_at`.
20. `sync_logs`: `id (uuid)`, `user_id (uuid)`, `platform (text)`, `status ('SUCCESS'|'FAILED'|'IN_PROGRESS')`, `synced_items_count (int)`, `details (text)`, `error_message (text)`, `created_at`.
21. `user_activity`: `id (uuid)`, `user_id (uuid)`, `activity_date (date)`, `problems_solved (int)`, `submissions_count (int)`, `time_spent_minutes (int)`, `points (int)`.

---

## 5. Learning Intelligence & Recommendation Engine Algorithm

The recommendation engine (`services/recommendationEngine.ts`) implements a prioritized decision pipeline:

1. **Overdue Revisions (Priority 1):**
   - Query `revision_items` where `scheduled_for <= CURRENT_DATE` and `recall_grade != 'Mastered'`.
   - Reason: `"Recommended because this question is overdue for revision by X days to prevent pattern forgetting."`
2. **Missing Prerequisites (Priority 2):**
   - If user is currently practicing an advanced topic (e.g., `Sliding Window` or `Binary Search on Answers`), inspect `topic_prerequisites`.
   - If prerequisite topic (e.g. `Arrays` or `Binary Search`) has mastery < `Comfortable`, recommend foundational learning.
   - Reason: `"Recommended because you are practicing [Topic] but prerequisite concept [Prereq] is not yet comfortable."`
3. **Weak Topics & High Hint Dependency (Priority 3):**
   - Identify topics where `hints_used_count / problems_solved_count > 0.5` or average confidence <= 2.5.
   - Reason: `"Recommended because you repeatedly needed hints or reported low confidence on [Topic] problems."`
4. **Next Roadmap Frontier (Priority 4):**
   - In user's active roadmap, locate the first incomplete section and recommend the next 2 progressive problems.
   - Reason: `"Recommended as the next logical milestone in your active roadmap: [Roadmap Name]."`
5. **Gradual Difficulty Ramp (Priority 5):**
   - For comfortable topics (confidence >= 4 on Medium), recommend a curated Hard problem to advance edge-case mastery.
   - Reason: `"Recommended to stretch your mastery in [Topic] from Medium to Hard."`

---

## 6. Spaced Repetition Scheduling Algorithm

- **Stages:** 1 Day -> 3 Days -> 7 Days -> 14 Days -> 30 Days.
- **Recall Grades:**
  1. *Forgot Completely (1):* Reset interval stage to 1 (re-test tomorrow).
  2. *Needed Hints (2):* Repeat current interval stage.
  3. *Partial Recall (3):* Advance to next stage with 0.8x multiplier.
  4. *Solved Independently (4):* Advance to next standard stage (e.g. 3d -> 7d).
  5. *Mastered (5):* Advance by 2 stages or mark mastered (60d long-term check).

---

## 7. Platform Integration Adapters

- **Abstract Base Adapter (`PlatformAdapter`):**
  - `validateUsername(handle: string): Promise<boolean>`
  - `fetchProfile(handle: string): Promise<PlatformProfile>`
  - `fetchSubmissions(handle: string, since?: Date): Promise<PlatformSubmission[]>`
  - `fetchRatingHistory(handle: string): Promise<RatingHistoryPoint[]>`
  - `getCapabilities(): PlatformCapabilities`

- **Codeforces Adapter:**
  - Uses `https://codeforces.com/api/user.info?handles={handle}`
  - Uses `https://codeforces.com/api/user.rating?handle={handle}`
  - Uses `https://codeforces.com/api/user.status?handle={handle}&from=1&count=50`
  - Fully caches responses with 15-minute TTL to honor rate limits.

- **AtCoder Adapter:**
  - Uses AtCoder Problems community API: `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user={handle}&from_second={timestamp}`
  - Caches and respects rate limits.

- **LeetCode / CodeChef / HackerRank / GeeksforGeeks:**
  - Clear manual submission logging, CSV batch import/export, profile handle verification link, zero fragile scraping.

---

## 8. Visual & UX Specifications

- **Theme:** Default dark theme (`#0c0e14` charcoal background, `#161922` card surface, `#232736` subtle borders). Clean light theme support.
- **Color Coding:**
  - Green (`#10b981` / `#22c55e`): Mastered, Solved Independently, Completed.
  - Purple/Indigo (`#8b5cf6` / `#6366f1`): Recommendations, Learning Journal, Concept Vault.
  - Amber/Orange (`#f59e0b`): Solved with Hint, Needs Revision.
  - Red (`#ef4444`): Overdue revisions, Weak topics, Failed attempts.
- **Typography:** Inter / system monospace for code snippets.
- **Layout:** Collapsible sidebar, sticky breadcrumbs/header with Quick-Add button (`+ Problem`), global search shortcut (`Ctrl+K`), quick status toggles.
- **Problem Detail Journal:** Tabs for Problem Analysis, Approaches (Brute/Improved/Optimal), Code Editor/Viewer, Self Assessment & What I Learned with live autosave indicator.
