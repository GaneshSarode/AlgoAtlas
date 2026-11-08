-- ========================================================================
-- ALGOATLAS: 21-Table Normalised Database Schema with Supabase RLS
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'C++',
    daily_goal_minutes INT NOT NULL DEFAULT 60,
    daily_goal_problems INT NOT NULL DEFAULT 3,
    weekly_goal_problems INT NOT NULL DEFAULT 15,
    active_roadmap_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own profile" ON profiles
    FOR ALL USING (auth.uid() = id);
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 2. PLATFORM_ACCOUNTS
CREATE TABLE IF NOT EXISTS platform_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    handle TEXT NOT NULL,
    profile_url TEXT,
    is_connected BOOLEAN NOT NULL DEFAULT true,
    rating INT,
    max_rating INT,
    rank_title TEXT,
    last_synced_at TIMESTAMPTZ,
    sync_status TEXT NOT NULL DEFAULT 'IDLE',
    sync_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_platform UNIQUE(user_id, platform)
);
ALTER TABLE platform_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own platform accounts" ON platform_accounts
    FOR ALL USING (auth.uid() = user_id);

-- 3. PROBLEMS
CREATE TABLE IF NOT EXISTS problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    platform TEXT NOT NULL,
    external_id TEXT,
    url TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    problem_rating INT,
    status TEXT NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'Attempted', 'Solved With Hint', 'Solved Independently', 'Needs Revision', 'Mastered')),
    confidence_rating INT NOT NULL DEFAULT 3 CHECK (confidence_rating BETWEEN 1 AND 5),
    is_bookmarked BOOLEAN NOT NULL DEFAULT false,
    viewed_editorial BOOLEAN NOT NULL DEFAULT false,
    used_external_help BOOLEAN NOT NULL DEFAULT false,
    time_spent_minutes INT NOT NULL DEFAULT 0,
    programming_language TEXT NOT NULL DEFAULT 'C++',
    primary_topic TEXT,
    subtopic TEXT,
    tags TEXT[],
    first_solved_at TIMESTAMPTZ,
    last_attempted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_problems_user_id ON problems(user_id);
CREATE INDEX IF NOT EXISTS idx_problems_platform ON problems(platform);
CREATE INDEX IF NOT EXISTS idx_problems_status ON problems(status);
CREATE INDEX IF NOT EXISTS idx_problems_external_id ON problems(user_id, platform, external_id);
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own problems" ON problems
    FOR ALL USING (auth.uid() = user_id);
CREATE TRIGGER update_problems_modtime BEFORE UPDATE ON problems
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 4. PROBLEM_PLATFORM_REFS
CREATE TABLE IF NOT EXISTS problem_platform_refs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canonical_problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    linked_problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_linked_problems UNIQUE(canonical_problem_id, linked_problem_id)
);
ALTER TABLE problem_platform_refs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own linked problems" ON problem_platform_refs
    FOR ALL USING (auth.uid() = user_id);

-- 5. PROBLEM_ATTEMPTS
CREATE TABLE IF NOT EXISTS problem_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    attempt_number INT NOT NULL,
    outcome TEXT NOT NULL CHECK (outcome IN ('Pass', 'TLE', 'WA', 'MLE', 'Runtime Error', 'Other')),
    time_spent_minutes INT NOT NULL DEFAULT 0,
    language TEXT NOT NULL,
    code_submitted TEXT,
    personal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_attempts_problem ON problem_attempts(problem_id);
ALTER TABLE problem_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own problem attempts" ON problem_attempts
    FOR ALL USING (auth.uid() = user_id);

-- 6. SOLUTION_APPROACHES
CREATE TABLE IF NOT EXISTS solution_approaches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    approach_type TEXT NOT NULL CHECK (approach_type IN ('Brute Force', 'Improved', 'Optimal', 'Alternative')),
    title TEXT NOT NULL,
    intuition TEXT,
    algorithm_steps TEXT,
    time_complexity TEXT NOT NULL DEFAULT 'O(N)',
    space_complexity TEXT NOT NULL DEFAULT 'O(1)',
    code TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'C++',
    tradeoffs TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_approaches_problem ON solution_approaches(problem_id);
ALTER TABLE solution_approaches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own solution approaches" ON solution_approaches
    FOR ALL USING (auth.uid() = user_id);
CREATE TRIGGER update_approaches_modtime BEFORE UPDATE ON solution_approaches
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 7. LEARNING_NOTES
CREATE TABLE IF NOT EXISTS learning_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID NOT NULL UNIQUE REFERENCES problems(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    understanding_summary TEXT,
    initial_thought TEXT,
    what_failed TEXT,
    key_observation TEXT,
    main_concept_learned TEXT,
    algorithmic_pattern TEXT,
    mistakes_to_avoid TEXT,
    when_to_use TEXT,
    related_questions_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE learning_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own learning notes" ON learning_notes
    FOR ALL USING (auth.uid() = user_id);
CREATE TRIGGER update_learning_notes_modtime BEFORE UPDATE ON learning_notes
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 8. CODE_SNIPPETS
CREATE TABLE IF NOT EXISTS code_snippets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    approach_id UUID REFERENCES solution_approaches(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    version_label TEXT NOT NULL DEFAULT 'v1',
    code TEXT NOT NULL,
    explanation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE code_snippets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own code snippets" ON code_snippets
    FOR ALL USING (auth.uid() = user_id);

-- 9. TOPICS
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Fundamentals', 'Data Structures', 'Algorithms & Patterns', 'Advanced')),
    description TEXT NOT NULL,
    icon_name TEXT,
    sort_order INT NOT NULL DEFAULT 0
);
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view topics" ON topics FOR SELECT USING (true);

-- 10. PROBLEM_TOPICS
CREATE TABLE IF NOT EXISTS problem_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT uq_problem_topic UNIQUE(problem_id, topic_id)
);
ALTER TABLE problem_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own problem topics" ON problem_topics
    FOR ALL USING (EXISTS (SELECT 1 FROM problems p WHERE p.id = problem_topics.problem_id AND p.user_id = auth.uid()));

-- 11. TOPIC_PREREQUISITES
CREATE TABLE IF NOT EXISTS topic_prerequisites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    prerequisite_topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    CONSTRAINT uq_topic_prereq UNIQUE(topic_id, prerequisite_topic_id)
);
ALTER TABLE topic_prerequisites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view topic prerequisites" ON topic_prerequisites FOR SELECT USING (true);

-- 12. TOPIC_MASTERY
CREATE TABLE IF NOT EXISTS topic_mastery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    mastery_score FLOAT NOT NULL DEFAULT 0.0 CHECK (mastery_score BETWEEN 0.0 AND 100.0),
    problems_solved_count INT NOT NULL DEFAULT 0,
    independent_solves_count INT NOT NULL DEFAULT 0,
    hints_used_count INT NOT NULL DEFAULT 0,
    learning_status TEXT NOT NULL DEFAULT 'Not Started' CHECK (learning_status IN ('Not Started', 'Currently Learning', 'Practising', 'Comfortable', 'Strong')),
    last_practiced_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_topic_mastery UNIQUE(user_id, topic_id)
);
ALTER TABLE topic_mastery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own topic mastery" ON topic_mastery
    FOR ALL USING (auth.uid() = user_id);

-- 13. ROADMAPS
CREATE TABLE IF NOT EXISTS roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT NOT NULL,
    is_system BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    total_problems INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View system or own roadmaps" ON roadmaps
    FOR SELECT USING (is_system = true OR auth.uid() = user_id);
CREATE POLICY "Manage own roadmaps" ON roadmaps
    FOR ALL USING (auth.uid() = user_id AND is_system = false);

-- 14. ROADMAP_ITEMS
CREATE TABLE IF NOT EXISTS roadmap_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    external_url TEXT NOT NULL,
    platform TEXT NOT NULL,
    external_id TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    sort_order INT NOT NULL DEFAULT 0,
    section_name TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_roadmap ON roadmap_items(roadmap_id);
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View roadmap items" ON roadmap_items
    FOR SELECT USING (EXISTS (SELECT 1 FROM roadmaps r WHERE r.id = roadmap_items.roadmap_id AND (r.is_system = true OR r.user_id = auth.uid())));

-- 15. ROADMAP_PROGRESS
CREATE TABLE IF NOT EXISTS roadmap_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    roadmap_item_id UUID NOT NULL REFERENCES roadmap_items(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES problems(id) ON DELETE SET NULL,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    CONSTRAINT uq_user_roadmap_item UNIQUE(user_id, roadmap_item_id)
);
ALTER TABLE roadmap_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own roadmap progress" ON roadmap_progress
    FOR ALL USING (auth.uid() = user_id);

-- 16. REVISION_ITEMS
CREATE TABLE IF NOT EXISTS revision_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    interval_stage INT NOT NULL DEFAULT 1,
    scheduled_for DATE NOT NULL,
    last_reviewed_at TIMESTAMPTZ,
    recall_grade TEXT CHECK (recall_grade IN ('Forgot', 'Needed Hints', 'Partial Recall', 'Solved Independently', 'Mastered')),
    review_count INT NOT NULL DEFAULT 0,
    is_overdue BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_problem_revision UNIQUE(user_id, problem_id)
);
CREATE INDEX IF NOT EXISTS idx_revision_user_schedule ON revision_items(user_id, scheduled_for);
ALTER TABLE revision_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own revision items" ON revision_items
    FOR ALL USING (auth.uid() = user_id);

-- 17. DAILY_TASKS
CREATE TABLE IF NOT EXISTS daily_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_date DATE NOT NULL,
    task_type TEXT NOT NULL CHECK (task_type IN ('Revision', 'Concept', 'Problem', 'Contest')),
    title TEXT NOT NULL,
    target_ref_id UUID,
    reason TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ
);
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own daily tasks" ON daily_tasks
    FOR ALL USING (auth.uid() = user_id);

-- 18. CONTESTS
CREATE TABLE IF NOT EXISTS contests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL,
    contest_name TEXT NOT NULL,
    contest_code TEXT,
    contest_url TEXT,
    start_time TIMESTAMPTZ NOT NULL
);
ALTER TABLE contests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view contests" ON contests FOR SELECT USING (true);

-- 19. CONTEST_RESULTS
CREATE TABLE IF NOT EXISTS contest_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contest_id UUID REFERENCES contests(id) ON DELETE SET NULL,
    platform TEXT NOT NULL,
    contest_name TEXT NOT NULL,
    contest_date DATE NOT NULL,
    participation_type TEXT NOT NULL CHECK (participation_type IN ('Live', 'Virtual', 'Practice')),
    rank INT,
    problems_attempted INT NOT NULL DEFAULT 0,
    problems_solved INT NOT NULL DEFAULT 0,
    rating_before INT,
    rating_after INT,
    rating_change INT,
    reflection_good TEXT,
    reflection_unsolved TEXT,
    reflection_missing_concepts TEXT,
    reflection_next_action TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_contest_results_user ON contest_results(user_id);
ALTER TABLE contest_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own contest results" ON contest_results
    FOR ALL USING (auth.uid() = user_id);

-- 20. SYNC_LOGS
CREATE TABLE IF NOT EXISTS sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'IN_PROGRESS')),
    synced_items_count INT NOT NULL DEFAULT 0,
    details TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sync_logs_user ON sync_logs(user_id);
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own sync logs" ON sync_logs
    FOR ALL USING (auth.uid() = user_id);

-- 21. USER_ACTIVITY
CREATE TABLE IF NOT EXISTS user_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    problems_solved INT NOT NULL DEFAULT 0,
    submissions_count INT NOT NULL DEFAULT 0,
    time_spent_minutes INT NOT NULL DEFAULT 0,
    points INT NOT NULL DEFAULT 0,
    CONSTRAINT uq_user_activity_date UNIQUE(user_id, activity_date)
);
CREATE INDEX IF NOT EXISTS idx_user_activity ON user_activity(user_id, activity_date);
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own user activity" ON user_activity
    FOR ALL USING (auth.uid() = user_id);
