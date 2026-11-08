# AlgoAtlas Database Schema Documentation

## 21 Relational Tables & Row Level Security

The AlgoAtlas PostgreSQL database is normalized to 3NF and enforces strict Row Level Security (RLS) on all user-owned entities. Service-role keys are strictly server-side.

### 1. `profiles`
User account profile and daily learning targets.
- `id`: UUID (Primary Key, references `auth.users.id` on delete cascade)
- `display_name`: TEXT
- `avatar_url`: TEXT nullable
- `preferred_language`: TEXT (default: `'C++'`)
- `daily_goal_minutes`: INT (default: `60`)
- `daily_goal_problems`: INT (default: `3`)
- `weekly_goal_problems`: INT (default: `15`)
- `active_roadmap_id`: UUID nullable
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ (auto-updated by trigger)
- **RLS Policy:** `FOR ALL USING (auth.uid() = id)`

### 2. `platform_accounts`
Stores handles and status across coding platforms.
- `id`: UUID
- `user_id`: UUID (FK `auth.users`)
- `platform`: TEXT (`'LeetCode'`, `'Codeforces'`, `'CodeChef'`, `'AtCoder'`, `'HackerRank'`, `'GeeksforGeeks'`, `'Other'`)
- `handle`: TEXT
- `profile_url`: TEXT nullable
- `is_connected`: BOOLEAN (default: `true`)
- `rating`: INT nullable
- `max_rating`: INT nullable
- `rank_title`: TEXT nullable
- `last_synced_at`: TIMESTAMPTZ nullable
- `sync_status`: TEXT (`'SUCCESS'`, `'FAILED'`, `'IN_PROGRESS'`, `'IDLE'`)
- `sync_error`: TEXT nullable
- `UNIQUE(user_id, platform)`
- **RLS Policy:** `FOR ALL USING (auth.uid() = user_id)`

### 3. `problems`
Central repository of all logged DSA problems.
- `id`: UUID
- `user_id`: UUID (FK `auth.users`)
- `title`: TEXT
- `slug`: TEXT
- `platform`: TEXT
- `external_id`: TEXT nullable
- `url`: TEXT
- `difficulty`: TEXT (`'Easy'`, `'Medium'`, `'Hard'`)
- `problem_rating`: INT nullable
- `status`: TEXT (`'Not Started'`, `'Attempted'`, `'Solved With Hint'`, `'Solved Independently'`, `'Needs Revision'`, `'Mastered'`)
- `confidence_rating`: INT (1 to 5)
- `is_bookmarked`: BOOLEAN (default: `false`)
- `viewed_editorial`: BOOLEAN (default: `false`)
- `used_external_help`: BOOLEAN (default: `false`)
- `time_spent_minutes`: INT (default: `0`)
- `programming_language`: TEXT (default: `'C++'`)
- `primary_topic`: TEXT nullable
- `subtopic`: TEXT nullable
- `tags`: TEXT[] nullable
- `first_solved_at`: TIMESTAMPTZ nullable
- `last_attempted_at`: TIMESTAMPTZ nullable
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ
- **Indices:** `idx_problems_user_id`, `idx_problems_platform`, `idx_problems_status`, `idx_problems_external_id`
- **RLS Policy:** `FOR ALL USING (auth.uid() = user_id)`

### 4. `problem_platform_refs`
Links equivalent problems across different platforms (e.g. LeetCode Two Sum <-> GFG Pair with given sum).
- `id`: UUID
- `canonical_problem_id`: UUID (FK `problems.id`)
- `linked_problem_id`: UUID (FK `problems.id`)
- `user_id`: UUID (FK `auth.users`)
- `notes`: TEXT nullable
- `UNIQUE(canonical_problem_id, linked_problem_id)`
- **RLS Policy:** `FOR ALL USING (auth.uid() = user_id)`

### 5. `problem_attempts`
Historical log of submissions and practice runs for each problem.
- `id`: UUID
- `problem_id`: UUID (FK `problems.id`)
- `user_id`: UUID (FK `auth.users`)
- `attempt_number`: INT
- `outcome`: TEXT (`'Pass'`, `'TLE'`, `'WA'`, `'MLE'`, `'Runtime Error'`, `'Other'`)
- `time_spent_minutes`: INT
- `language`: TEXT
- `code_submitted`: TEXT nullable
- `personal_notes`: TEXT nullable
- `created_at`: TIMESTAMPTZ
- **RLS Policy:** `FOR ALL USING (auth.uid() = user_id)`

### 6. `solution_approaches`
Separate solution records (Brute Force, Improved, Optimal, Alternative).
- `id`: UUID
- `problem_id`: UUID (FK `problems.id`)
- `user_id`: UUID (FK `auth.users`)
- `approach_type`: TEXT (`'Brute Force'`, `'Improved'`, `'Optimal'`, `'Alternative'`)
- `title`: TEXT
- `intuition`: TEXT nullable
- `algorithm_steps`: TEXT nullable
- `time_complexity`: TEXT
- `space_complexity`: TEXT
- `code`: TEXT
- `language`: TEXT
- `tradeoffs`: TEXT nullable
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ
- **RLS Policy:** `FOR ALL USING (auth.uid() = user_id)`

### 7. `learning_notes`
Structured post-solution reflection and personal learnings.
- `id`: UUID
- `problem_id`: UUID (UNIQUE, FK `problems.id`)
- `user_id`: UUID (FK `auth.users`)
- `understanding_summary`: TEXT nullable
- `initial_thought`: TEXT nullable
- `what_failed`: TEXT nullable
- `key_observation`: TEXT nullable
- `main_concept_learned`: TEXT nullable
- `algorithmic_pattern`: TEXT nullable
- `mistakes_to_avoid`: TEXT nullable
- `when_to_use`: TEXT nullable
- `related_questions_notes`: TEXT nullable
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ
- **RLS Policy:** `FOR ALL USING (auth.uid() = user_id)`

### 8. `code_snippets`
Multi-version code snippets with syntax highlighting.
- `id`: UUID
- `problem_id`: UUID (FK `problems.id`)
- `approach_id`: UUID nullable (FK `solution_approaches.id`)
- `user_id`: UUID (FK `auth.users`)
- `language`: TEXT
- `version_label`: TEXT (default: `'v1'`)
- `code`: TEXT
- `explanation`: TEXT nullable
- `created_at`: TIMESTAMPTZ
- **RLS Policy:** `FOR ALL USING (auth.uid() = user_id)`

### 9. `topics`
Standardized catalog of DSA categories and concepts.
- `id`: UUID
- `slug`: TEXT (UNIQUE)
- `name`: TEXT
- `category`: TEXT (`'Fundamentals'`, `'Data Structures'`, `'Algorithms & Patterns'`, `'Advanced'`)
- `description`: TEXT
- `icon_name`: TEXT nullable
- `sort_order`: INT
- **RLS Policy:** Public read (`FOR SELECT USING (true)`)

### 10. `problem_topics`
Many-to-many relationship linking problems with topics.
- `id`: UUID
- `problem_id`: UUID (FK `problems.id`)
- `topic_id`: UUID (FK `topics.id`)
- `is_primary`: BOOLEAN
- `UNIQUE(problem_id, topic_id)`
- **RLS Policy:** `FOR ALL USING (EXISTS (SELECT 1 FROM problems WHERE ...))`

### 11. `topic_prerequisites`
Directed Acyclic Graph (DAG) edges defining topic mastery dependencies.
- `id`: UUID
- `topic_id`: UUID (FK `topics.id`)
- `prerequisite_topic_id`: UUID (FK `topics.id`)
- `UNIQUE(topic_id, prerequisite_topic_id)`
- **RLS Policy:** Public read (`FOR SELECT USING (true)`)

### 12. `topic_mastery`
Individual user's mastery score and learning status for each concept.
- `id`: UUID
- `user_id`: UUID (FK `auth.users`)
- `topic_id`: UUID (FK `topics.id`)
- `mastery_score`: FLOAT (0.0 to 100.0)
- `problems_solved_count`: INT
- `independent_solves_count`: INT
- `hints_used_count`: INT
- `learning_status`: TEXT (`'Not Started'`, `'Currently Learning'`, `'Practising'`, `'Comfortable'`, `'Strong'`)
- `last_practiced_at`: TIMESTAMPTZ nullable
- `updated_at`: TIMESTAMPTZ
- `UNIQUE(user_id, topic_id)`
- **RLS Policy:** `FOR ALL USING (auth.uid() = user_id)`

### 13. `roadmaps`
Curated and custom user roadmaps (NeetCode 150, Blind 75, Striver A2Z, CSES, Custom).
- `id`: UUID
- `user_id`: UUID nullable (null for system built-in)
- `title`: TEXT
- `slug`: TEXT
- `description`: TEXT
- `is_system`: BOOLEAN
- `is_active`: BOOLEAN
- `total_problems`: INT
- `created_at`: TIMESTAMPTZ
- **RLS Policy:** System roadmaps viewable by all; custom roadmaps manageable by owner.

### 14. `roadmap_items`
Problems contained within a roadmap sheet.
- `id`: UUID
- `roadmap_id`: UUID (FK `roadmaps.id`)
- `topic_id`: UUID nullable (FK `topics.id`)
- `title`: TEXT
- `external_url`: TEXT
- `platform`: TEXT
- `external_id`: TEXT nullable
- `difficulty`: TEXT (`'Easy'`, `'Medium'`, `'Hard'`)
- `sort_order`: INT
- `section_name`: TEXT
- **RLS Policy:** Viewable if parent roadmap is viewable.

### 15. `roadmap_progress`
Tracks user check-offs per roadmap item with cross-roadmap sync.
- `id`: UUID
- `user_id`: UUID (FK `auth.users`)
- `roadmap_item_id`: UUID (FK `roadmap_items.id`)
- `problem_id`: UUID nullable (FK `problems.id`)
- `is_completed`: BOOLEAN
- `completed_at`: TIMESTAMPTZ nullable
- `UNIQUE(user_id, roadmap_item_id)`
- **RLS Policy:** `FOR ALL USING (auth.uid() = user_id)`

### 16. `revision_items`
Spaced repetition queue with SM-2 recall stage intervals.
- `id`: UUID
- `user_id`: UUID (FK `auth.users`)
- `problem_id`: UUID (FK `problems.id`)
- `interval_stage`: INT (1, 3, 7, 14, 30, 60, 90)
- `scheduled_for`: DATE
- `last_reviewed_at`: TIMESTAMPTZ nullable
- `recall_grade`: TEXT (`'Forgot'`, `'Needed Hints'`, `'Partial Recall'`, `'Solved Independently'`, `'Mastered'`)
- `review_count`: INT
- `is_overdue`: BOOLEAN
- `created_at`: TIMESTAMPTZ
- `UNIQUE(user_id, problem_id)`
- **RLS Policy:** `FOR ALL USING (auth.uid() = user_id)`

### 17. `daily_tasks`
Personalized daily checklist generated from recommendation engine.
- `id`: UUID
- `user_id`: UUID (FK `auth.users`)
- `task_date`: DATE
- `task_type`: TEXT (`'Revision'`, `'Concept'`, `'Problem'`, `'Contest'`)
- `title`: TEXT
- `target_ref_id`: UUID nullable
- `reason`: TEXT
- `is_completed`: BOOLEAN
- `completed_at`: TIMESTAMPTZ nullable
- **RLS Policy:** `FOR ALL USING (auth.uid() = user_id)`

### 18. `contests`
Public contest metadata.
- `id`: UUID
- `platform`: TEXT
- `contest_name`: TEXT
- `contest_code`: TEXT nullable
- `contest_url`: TEXT nullable
- `start_time`: TIMESTAMPTZ
- **RLS Policy:** Public read (`FOR SELECT USING (true)`)

### 19. `contest_results`
Individual contest participation, rank, rating delta, and retrospectives.
- `id`: UUID
- `user_id`: UUID (FK `auth.users`)
- `contest_id`: UUID nullable (FK `contests.id`)
- `platform`: TEXT
- `contest_name`: TEXT
- `contest_date`: DATE
- `participation_type`: TEXT (`'Live'`, `'Virtual'`, `'Practice'`)
- `rank`: INT nullable
- `problems_attempted`: INT
- `problems_solved`: INT
- `rating_before`: INT nullable
- `rating_after`: INT nullable
- `rating_change`: INT nullable
- `reflection_good`: TEXT nullable
- `reflection_unsolved`: TEXT nullable
- `reflection_missing_concepts`: TEXT nullable
- `reflection_next_action`: TEXT nullable
- `created_at`: TIMESTAMPTZ
- **RLS Policy:** `FOR ALL USING (auth.uid() = user_id)`

### 20. `sync_logs`
Audit log of external API synchronization attempts.
- `id`: UUID
- `user_id`: UUID (FK `auth.users`)
- `platform`: TEXT
- `status`: TEXT (`'SUCCESS'`, `'FAILED'`, `'IN_PROGRESS'`)
- `synced_items_count`: INT
- `details`: TEXT nullable
- `error_message`: TEXT nullable
- `created_at`: TIMESTAMPTZ
- **RLS Policy:** `FOR ALL USING (auth.uid() = user_id)`

### 21. `user_activity`
Daily aggregated consistency logs driving the contribution heatmap calendar.
- `id`: UUID
- `user_id`: UUID (FK `auth.users`)
- `activity_date`: DATE
- `problems_solved`: INT
- `submissions_count`: INT
- `time_spent_minutes`: INT
- `points`: INT
- `UNIQUE(user_id, activity_date)`
- **RLS Policy:** `FOR ALL USING (auth.uid() = user_id)`
