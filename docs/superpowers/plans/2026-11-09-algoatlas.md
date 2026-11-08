# AlgoAtlas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade personal DSA Learning OS (AlgoAtlas) providing a central problem vault, multi-approach learning journal, concept vault with prerequisite DAG, curated roadmaps, spaced repetition revision engine, recommendation engine, contest tracker, platform adapters, and rich analytics.

**Architecture:** Next.js App Router full-stack web application with Tailwind CSS, Lucide icons, Recharts, and a modular Data Access Layer supporting Supabase PostgreSQL with RLS and a robust local persistence fallback. Modular services handle URL detection, recommendation heuristics, spaced repetition scheduling, and external platform public APIs (Codeforces & AtCoder).

**Tech Stack:** Next.js 15+, React 19, TypeScript, Tailwind CSS, Radix UI primitives, Lucide React, Recharts, Zod, React Hook Form, TanStack Table, date-fns, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-09-algoatlas-design.md`

## Global Constraints
- Strict TypeScript (`"strict": true` in `tsconfig.json`).
- Default Dark theme with charcoal `#0c0e14` background, subtle borders, high-contrast readable code blocks.
- No scraping of restricted sites; use public official APIs with caching (Codeforces, AtCoder) and manual/CSV workflows for others.
- No hardcoded dashboard or recommendation metrics; all views compute dynamically from real records.
- Supabase Row Level Security (RLS) on all user tables with zero exposure of service-role keys in client bundles.
- Dual-mode data repository (Supabase PostgreSQL when env vars are set + built-in robust local storage repository for instantaneous offline/dev/demo capability).

## Review Focus
1. **URL Platform Detection Edge Cases:** Input with query parameters, trailing slashes, or localized subdomains (`https://leetcode.com/problems/two-sum/?envType=study-plan-v2` or `https://codeforces.com/contest/1900/problem/B`) must correctly extract platform and external problem ID.
2. **Spaced Repetition Date Rollover:** Revising a problem multiple times or submitting "Forgot" resets interval stage to 1 and reschedules for tomorrow without corrupting review history.
3. **Cross-Roadmap Synchronization:** Marking a problem completed in one roadmap must automatically mark equivalent linked problems completed across all active roadmaps.
4. **Recommendation Engine Priority Ordering:** Overdue revisions must strictly take priority over roadmap milestones and new problem difficulty ramps.
5. **Data Portability Safety:** JSON backup export must serialize all 21 relational domains and importing a valid JSON backup must restore all entities without data loss.

---

### Task 1: Next.js Foundation, Project Scaffold & Theme Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/types/index.ts`
- Create: `src/lib/utils.ts`

**Interfaces:**
- Produces: `cn(...classes: ClassValue[]) -> string` in `src/lib/utils.ts`
- Produces: TypeScript domain interfaces for `Problem`, `SolutionApproach`, `LearningNote`, `Topic`, `Roadmap`, `RevisionItem`, `ContestResult` in `src/types/index.ts`

- [ ] **Step 1: Create package.json and configuration files**
  Configure dependencies: `next`, `react`, `react-dom`, `lucide-react`, `clsx`, `tailwind-merge`, `recharts`, `date-fns`, `zod`, `react-hook-form`, `@hookform/resolvers`, `@tanstack/react-table`, `@supabase/supabase-js`, `canvas-confetti`. Dev dependencies: `vitest`, `@testing-library/react`, `playwright`, `tailwindcss`, `postcss`, `typescript`.
- [ ] **Step 2: Install dependencies**
  Run `npm install` and verify zero resolution errors.
- [ ] **Step 3: Create Tailwind and CSS theme configuration**
  Define theme tokens (dark charcoal backgrounds, border tones, status colors: green, purple, amber, red).
- [ ] **Step 4: Create core TypeScript type definitions in `src/types/index.ts`**
  Cover platforms, difficulty enums, status enums, 21 entity interfaces.
- [ ] **Step 5: Verify build**
  Run `npm run build` and ensure base scaffold compiles cleanly.

---

### Task 2: Database Architecture, Migrations & Supabase RLS

**Files:**
- Create: `supabase/migrations/20261109000000_init_algoatlas.sql`
- Create: `supabase/seed.sql`
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/db/repository.ts`

**Interfaces:**
- Consumes: `src/types/index.ts`
- Produces: `getDbRepository(): IDataRepository` providing CRUD for problems, notes, approaches, revisions, roadmaps, and analytics.

- [ ] **Step 1: Write complete PostgreSQL migration script**
  Write `supabase/migrations/20261109000000_init_algoatlas.sql` defining 21 tables, foreign key constraints, indexes, triggers (`update_updated_at_column`), and Supabase RLS policies `FOR ALL USING (auth.uid() = user_id)`.
- [ ] **Step 2: Write seed script for DSA Topics, Prerequisites, and Standard Roadmaps**
  Write `supabase/seed.sql` containing standard topics (Arrays, Strings, Two Pointers, Sliding Window, DP, etc.), prerequisite relationships (Arrays -> Prefix Sum -> Sliding Window), and initial roadmap definitions (Striver A2Z, NeetCode 150, Blind 75).
- [ ] **Step 3: Implement Database Repository abstraction**
  Implement `src/lib/db/repository.ts` with transparent dual-mode support: seamlessly queries Supabase when configured, or provides an in-memory/localStorage seedable repository so the app works out-of-the-box in local development, testing, and offline modes.
- [ ] **Step 4: Write unit test for repository operations**
  Create `src/lib/db/__tests__/repository.test.ts` testing create, read, update, delete on problems and learning notes.
- [ ] **Step 5: Run Vitest test**
  Run `npx vitest run src/lib/db/__tests__/repository.test.ts` and verify PASS.

---

### Task 3: Application Shell, Navigation & Responsive Layout

**Files:**
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/AppShell.tsx`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/dialog.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `AppShell` wrapping all pages with collapsible sidebar (12 main sections), breadcrumb title, Quick-Add Problem modal launcher, theme toggle, and search shortcut (`Ctrl+K`).

- [ ] **Step 1: Create reusable UI primitives**
  Button, Card, Badge, Modal/Dialog with dark theme styling.
- [ ] **Step 2: Build Collapsible Sidebar component**
  Navigation links for all 12 sections with icons, active state highlighting, badge counters (e.g. overdue revisions count).
- [ ] **Step 3: Build Header component**
  Global quick-action "+ Add Problem" button, global search input, quick stats badge, and mobile navigation drawer toggle.
- [ ] **Step 4: Integrate AppShell into root layout**
  Verify layout responsiveness across desktop, tablet, and mobile breakpoints.
- [ ] **Step 5: Verify rendering with test**
  Add test `src/components/layout/__tests__/Sidebar.test.tsx` verifying all 12 navigation items render.

---

### Task 4: Problem Quick-Capture System & Platform URL Detection

**Files:**
- Create: `src/services/urlParser.ts`
- Create: `src/components/problems/AddProblemModal.tsx`
- Create: `src/components/problems/CsvImportModal.tsx`
- Create: `src/services/__tests__/urlParser.test.ts`

**Interfaces:**
- Produces: `parseProblemUrl(url: string): ParsedProblemUrl` returning `{ platform, externalId, slug, suggestedTitle, canonicalUrl }`
- Produces: `AddProblemModal` component with instant URL auto-fill and duplicate detection.

- [ ] **Step 1: Write unit tests for URL parsing**
  Test LeetCode (`https://leetcode.com/problems/trapping-rain-water/`), Codeforces (`https://codeforces.com/problemset/problem/158/A`), AtCoder (`https://atcoder.jp/contests/abc300/tasks/abc300_a`), CodeChef, HackerRank, GeeksforGeeks.
- [ ] **Step 2: Implement `src/services/urlParser.ts`**
  Domain regex matching, ID extraction, slug cleanup, and canonical URL normalization.
- [ ] **Step 3: Verify unit tests pass**
  Run `npx vitest run src/services/__tests__/urlParser.test.ts`.
- [ ] **Step 4: Implement AddProblemModal component**
  Fields: URL paste with instant auto-fill, Title, Platform selector, Difficulty (Easy/Medium/Hard), Primary Topic, Subtopic, Confidence (1-5), Status, Initial notes. Duplicate check against existing external ID.
- [ ] **Step 5: Implement CsvImportModal component**
  Parses CSV with header validation (`title,platform,url,difficulty,topic,status`), showing preview and import confirmation.

---

### Task 5: Central Problem Vault (My Problems)

**Files:**
- Create: `src/app/problems/page.tsx`
- Create: `src/components/problems/ProblemTable.tsx`
- Create: `src/components/problems/ProblemCardList.tsx`
- Create: `src/components/problems/ProblemFilters.tsx`

**Interfaces:**
- Consumes: `getDbRepository()`
- Produces: Searchable, filterable problem catalog with view toggle (table / cards), status pills, confidence rating stars, revision date tags, and direct link to Problem Details.

- [ ] **Step 1: Implement ProblemFilters component**
  Search query, platform filter, difficulty filter, topic filter, status filter, confidence filter, sorting dropdown (Recently attempted, Revision date, Difficulty, Title).
- [ ] **Step 2: Implement ProblemTable component with TanStack Table**
  Columns: Title & URL, Platform icon, Difficulty badge, Status pill, Confidence stars, Revision status, Last attempted, Actions (View Journal, Quick Edit, Delete).
- [ ] **Step 3: Implement ProblemCardList component**
  Responsive card grid alternative for tablet and mobile viewports.
- [ ] **Step 4: Wire up `src/app/problems/page.tsx`**
  Fetch problems from repository, connect filters, wire up Add Problem action, display empty state when no problems match.
- [ ] **Step 5: Unit test filtering & sorting logic**
  Create `src/components/problems/__tests__/filtering.test.ts` and verify.

---

### Task 6: Problem Detail Page & Learning Journal

**Files:**
- Create: `src/app/problems/[id]/page.tsx`
- Create: `src/components/journal/ProblemHeader.tsx`
- Create: `src/components/journal/UnderstandingSection.tsx`
- Create: `src/components/journal/ApproachesManager.tsx`
- Create: `src/components/journal/CodeEditorSnippet.tsx`
- Create: `src/components/journal/WhatILearnedSection.tsx`
- Create: `src/components/journal/SelfAssessmentSection.tsx`
- Create: `src/components/journal/AttemptsHistory.tsx`

**Interfaces:**
- Consumes: `getDbRepository()`
- Produces: Comprehensive multi-tab / sectional learning journal with auto-save indicators, copyable code snippets, complexity tags ($O(N)$, $O(1)$), structured reflection fields, and revision queue actions.

- [ ] **Step 1: Build ProblemHeader with metadata editor**
  Display platform icon, external problem link, difficulty badge, status selector, bookmark toggle, and confidence 1-5 selector.
- [ ] **Step 2: Build UnderstandingSection & Initial Approach**
  Fields: Problem summary, constraints, examples, initial thought, what failed, mistakes made.
- [ ] **Step 3: Build ApproachesManager (Brute Force, Improved, Optimal)**
  Add/edit approaches. For each approach: Intuition, Algorithm Steps, Time Complexity, Space Complexity, Code snippet with language selector and copy button.
- [ ] **Step 4: Build WhatILearnedSection & SelfAssessment**
  Main concept learned, algorithmic pattern, key observation, when to use, mistakes to avoid. Self-assessment questions with instant confidence score update.
- [ ] **Step 5: Implement auto-save indicator**
  Visual indicator ("Saved to journal", "Saving...") ensuring changes persist seamlessly to the repository.
- [ ] **Step 6: Build AttemptsHistory**
  Record new attempts with outcome (Pass, TLE, WA, MLE), time spent, and notes.

---

### Task 7: Concept Vault (Personal DSA Knowledge Base)

**Files:**
- Create: `src/app/concepts/page.tsx`
- Create: `src/app/concepts/[slug]/page.tsx`
- Create: `src/components/concepts/ConceptCard.tsx`
- Create: `src/components/concepts/PrerequisiteGraph.tsx`
- Create: `src/services/conceptData.ts`

**Interfaces:**
- Produces: Structured concept knowledge base with category grouping (Fundamentals, Data Structures, Algorithms & Patterns), prerequisite lineage, code templates, related problems list, and concept mastery status.

- [ ] **Step 1: Implement curated concept seed data in `src/services/conceptData.ts`**
  Full content for: Arrays, Strings, Two Pointers, Sliding Window, Prefix Sum, Binary Search, Fast & Slow Pointers, Linked Lists, Trees, BST, Graphs, BFS, DFS, Dynamic Programming, Bit Manipulation, Monotonic Stack, DSU.
- [ ] **Step 2: Build Concepts catalog page `src/app/concepts/page.tsx`**
  Category filters, search bar, mastery status pills (Not Started, Currently Learning, Practising, Comfortable, Strong).
- [ ] **Step 3: Build Concept detail page `src/app/concepts/[slug]/page.tsx`**
  Sections: Definition, Intuition, When to use / When NOT to use, Time & Space complexity breakdown, Code template with copy, Common traps, Related problems, Prerequisite breadcrumbs.
- [ ] **Step 4: Build interactive Prerequisite Graph component**
  Visual DAG representation showing concept mastery flow (e.g. Arrays -> Prefix Sum -> Sliding Window).
- [ ] **Step 5: Verify concept navigation and mastery updates**
  Allow user to update learning status and view linked problems from their vault.

---

### Task 8: Curated & Custom DSA Roadmaps

**Files:**
- Create: `src/app/roadmaps/page.tsx`
- Create: `src/app/roadmaps/[slug]/page.tsx`
- Create: `src/components/roadmaps/RoadmapProgressBar.tsx`
- Create: `src/components/roadmaps/RoadmapItemRow.tsx`
- Create: `src/services/roadmapData.ts`

**Interfaces:**
- Produces: Multi-sheet roadmap manager: Striver A2Z, Striver SDE, NeetCode 150, NeetCode 250, Blind 75, Grind 75, Love Babbar 450, LeetCode 75, CSES, Codeforces practice lists + Custom user roadmaps.
- Feature: Cross-roadmap synchronization (marking a problem solved updates all roadmaps containing that linked problem).

- [ ] **Step 1: Seed curated roadmap structures in `src/services/roadmapData.ts`**
  Section breakdown, difficulty tag, topic tag, external links for Blind 75, NeetCode 150, Striver A2Z, and CSES.
- [ ] **Step 2: Build Roadmaps overview page `src/app/roadmaps/page.tsx`**
  Cards showing total items, completed items, progress percentage, difficulty distribution bar, and "Set as Active Roadmap" action.
- [ ] **Step 3: Build Roadmap detail page `src/app/roadmaps/[slug]/page.tsx`**
  Accordion/grouped sections (e.g. Arrays, Two Pointers, Trees), individual item check-off, direct "Add to My Problems / Open Journal" action.
- [ ] **Step 4: Implement cross-roadmap synchronization service**
  When problem is marked Solved, update `roadmap_progress` for all roadmap items matching canonical slug/external ID.
- [ ] **Step 5: Custom roadmap creator**
  Allows creating a personalized roadmap from problems in user's vault.

---

### Task 9: Spaced Repetition Revision Centre

**Files:**
- Create: `src/app/revision/page.tsx`
- Create: `src/app/revision/practice/page.tsx`
- Create: `src/services/revisionEngine.ts`
- Create: `src/components/revision/RevisionQueueCard.tsx`
- Create: `src/components/revision/RevisionStudyMode.tsx`
- Create: `src/services/__tests__/revisionEngine.test.ts`

**Interfaces:**
- Produces: `calculateNextRevision(currentInterval: number, grade: RecallGrade): { nextInterval: number, nextDate: Date }`
- Produces: Distraction-free Revision Study Mode with recall prompts (Pattern? Intuition? Independent solve?), rating buttons, and interval progression.

- [ ] **Step 1: Write unit tests for Spaced Repetition scheduling**
  Test: 1d -> 3d -> 7d -> 14d -> 30d progression; Test: Forgot grade resets to 1 day; Test: Needed hints repeats current interval; Test: Mastered extends interval.
- [ ] **Step 2: Implement `src/services/revisionEngine.ts`**
  Calculate today's queue, overdue queue, upcoming schedule, and update logic.
- [ ] **Step 3: Run Vitest test**
  Run `npx vitest run src/services/__tests__/revisionEngine.test.ts` and verify PASS.
- [ ] **Step 4: Build Revision Centre page `src/app/revision/page.tsx`**
  Tabs: Today's Due, Overdue (highlighted in red/amber), Upcoming (calendar/list), Mastered. Quick "Start Revision Session" button.
- [ ] **Step 5: Build distraction-free Revision Study Mode `src/app/revision/practice/page.tsx`**
  Step 1: Show only problem title, difficulty, and platform; Step 2: Prompt "Can you recall the pattern & intuition?"; Step 3: Reveal saved notes & optimal approach; Step 4: Record recall grade and advance queue.

---

### Task 10: "What Should I Learn Next?" Recommendation Engine

**Files:**
- Create: `src/app/recommendations/page.tsx`
- Create: `src/services/recommendationEngine.ts`
- Create: `src/components/recommendations/RecommendationCard.tsx`
- Create: `src/components/recommendations/DailyLearningPlan.tsx`
- Create: `src/services/__tests__/recommendationEngine.test.ts`

**Interfaces:**
- Produces: `generateRecommendations(userState: UserState): RecommendationPlan`
- Features: Prioritized transparent rule-based engine: Overdue revisions -> Missing prerequisites -> Weak topics -> Next active roadmap step -> Difficulty progression.

- [ ] **Step 1: Write unit tests for recommendation engine**
  Test overdue items ranked highest; Test weak topic with high hint ratio flagged; Test missing prerequisite identified when child topic is practiced.
- [ ] **Step 2: Implement `src/services/recommendationEngine.ts`**
  Implement rule engine with transparent rationale generator (`reason` string explaining why each action is recommended).
- [ ] **Step 3: Verify tests pass**
  Run `npx vitest run src/services/__tests__/recommendationEngine.test.ts`.
- [ ] **Step 4: Build Recommendations page `src/app/recommendations/page.tsx`**
  Display top priority action banner, structured learning cards with reason pills, customizable study time slider (e.g. 1h, 2h, 4h per day), and topic priority selector.
- [ ] **Step 5: Build DailyLearningPlan component**
  Checkbox checklist for today's generated action items with direct links.

---

### Task 11: Contest Tracker & Competitive Programming Dashboard

**Files:**
- Create: `src/app/contests/page.tsx`
- Create: `src/components/contests/ContestModal.tsx`
- Create: `src/components/contests/RatingProgressionChart.tsx`
- Create: `src/components/contests/ContestReflectionModal.tsx`

**Interfaces:**
- Produces: Competitive programming contest logger, Codeforces rating progression chart, contest reflection journal (What went well, Missed concepts, Next actions).

- [ ] **Step 1: Implement Contest logger form & modal**
  Platform, Contest Name, Date, Participation (Live/Virtual/Practice), Rank, Problems Attempted/Solved, Rating Before/After, Rating Change (+/-).
- [ ] **Step 2: Implement RatingProgressionChart with Recharts**
  Interactive line chart of contest rating history over time with milestone color markers.
- [ ] **Step 3: Implement Contest Reflection journal**
  Structured post-contest retrospective fields: What went well, Unsolved problems, Missing concepts, Target topics before next contest.
- [ ] **Step 4: Build Contest Tracker page `src/app/contests/page.tsx`**
  Table of logged contests, summary cards (Total contests, Best rank, Peak rating, Win/Loss rate), and rating progression graph.

---

### Task 12: Platform Integrations & Public APIs

**Files:**
- Create: `src/app/integrations/page.tsx`
- Create: `src/services/platformAdapters/types.ts`
- Create: `src/services/platformAdapters/codeforcesAdapter.ts`
- Create: `src/services/platformAdapters/atcoderAdapter.ts`
- Create: `src/services/platformAdapters/genericAdapter.ts`
- Create: `src/app/api/integrations/codeforces/route.ts`
- Create: `src/app/api/integrations/atcoder/route.ts`
- Create: `src/components/integrations/PlatformCard.tsx`
- Create: `src/services/platformAdapters/__tests__/codeforcesAdapter.test.ts`

**Interfaces:**
- Produces: `PlatformAdapter` interface with `fetchProfile`, `fetchRatingHistory`, `fetchSubmissions`.
- Supported APIs: Official Codeforces API (`user.info`, `user.rating`, `user.status`), AtCoder Problems API.
- Manual logging / CSV for LeetCode, CodeChef, HackerRank, GeeksforGeeks.

- [ ] **Step 1: Define adapter interface and mock responses for tests**
  Create unit test `src/services/platformAdapters/__tests__/codeforcesAdapter.test.ts` testing profile parsing and submission mapping.
- [ ] **Step 2: Implement Codeforces adapter with server-side caching**
  Fetch user info, calculate rating history, extract problem tags and solve count. Never fake success; report exact API errors gracefully.
- [ ] **Step 3: Implement AtCoder adapter**
  Fetch submission data from Kenkoooo AtCoder API with rate limit handling.
- [ ] **Step 4: Implement Next.js API route handlers**
  `/api/integrations/codeforces` and `/api/integrations/atcoder` providing server-side fetching with error logging.
- [ ] **Step 5: Build Platform Integrations page `src/app/integrations/page.tsx`**
  Cards for all 6 platforms showing username, connection status, last sync timestamp, Sync button (for Codeforces/AtCoder), Manual Log / CSV import modal (for LeetCode/others), and detailed sync log viewer.

---

### Task 13: Analytics, Reports & Data Portability (Backup/Restore)

**Files:**
- Create: `src/app/analytics/page.tsx`
- Create: `src/components/analytics/HeatmapCalendar.tsx`
- Create: `src/components/analytics/DifficultyPieChart.tsx`
- Create: `src/components/analytics/TopicBarChart.tsx`
- Create: `src/components/analytics/ConfidenceDistributionChart.tsx`
- Create: `src/services/exportService.ts`
- Create: `src/services/__tests__/exportService.test.ts`

**Interfaces:**
- Produces: Interactive analytics dashboard, GitHub-style contribution calendar, weekly/monthly report generator, JSON backup export & restore, CSV export.

- [ ] **Step 1: Implement HeatmapCalendar component**
  GitHub-style 365-day contribution grid displaying daily solve activity with tooltip details.
- [ ] **Step 2: Implement Recharts visual charts**
  Difficulty breakdown (Easy/Medium/Hard donut chart), Topic distribution bar chart, Hints vs Independent solve ratio, Confidence rating distribution.
- [ ] **Step 3: Implement JSON Backup & Restore and CSV Export in `src/services/exportService.ts`**
  Comprehensive serialization of problems, notes, approaches, revisions, roadmaps, and contests.
- [ ] **Step 4: Unit test backup export and restore validation**
  Verify complete serialization and restoration without data loss.
- [ ] **Step 5: Build Analytics & Reports page `src/app/analytics/page.tsx`**
  Metrics overview, all charts, period selector (Last 30 days, 90 days, All time), and one-click JSON/CSV export buttons.

---

### Task 14: Comprehensive Executive Dashboard

**Files:**
- Create: `src/components/dashboard/OverallStats.tsx`
- Create: `src/components/dashboard/PlatformBreakdown.tsx`
- Create: `src/components/dashboard/LearningIntelligenceSummary.tsx`
- Create: `src/components/dashboard/UpcomingRevisionsWidget.tsx`
- Create: `src/components/dashboard/RecentActivityWidget.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Produces: Executive DSA Dashboard bringing together overall statistics, platform metrics, contribution heatmap, overdue revision alert, and "Your Learning Intelligence" diagnostic summary.

- [ ] **Step 1: Build OverallStats widget**
  Total unique questions, total attempts, independently solved, solved with hints, needing revision, mastered, current learning streak, total practice time.
- [ ] **Step 2: Build PlatformBreakdown cards**
  LeetCode, Codeforces, CodeChef, AtCoder, HackerRank, GeeksforGeeks counters and difficulty badges.
- [ ] **Step 3: Build LearningIntelligenceSummary widget**
  "You are making good progress in Arrays and Hashing. However, Binary Search on Answers and Dynamic Programming need more practice." Highlights strongest topics, weakest topics, hint dependency, and next actions.
- [ ] **Step 4: Build UpcomingRevisions & RecentActivity widgets**
  Quick revision cards for today's due problems with one-click review launch; chronological recent activity stream.
- [ ] **Step 5: Assemble `src/app/page.tsx`**
  Complete responsive dashboard layout computed dynamically from actual records.

---

### Task 15: Settings, Profile Management & Polish

**Files:**
- Create: `src/app/settings/page.tsx`
- Create: `src/components/settings/ProfileSettings.tsx`
- Create: `src/components/settings/BackupRestoreSettings.tsx`

**Interfaces:**
- Produces: Settings page with profile configuration (display name, preferred language, daily/weekly goals, active roadmap), theme switcher, and JSON backup/restore interface.

- [ ] **Step 1: Build ProfileSettings form**
  Name, target problems/day, practice target minutes/day, preferred programming language (C++, Java, Python, TypeScript, Go, Rust), target active roadmap.
- [ ] **Step 2: Build BackupRestoreSettings form**
  Full JSON backup download, JSON file restore upload with validation and progress alert, Reset demo data button.
- [ ] **Step 3: Wire up settings page in `src/app/settings/page.tsx`**
  Persist settings to repository and ensure instant updates across the app shell.

---

### Task 16: End-to-End Testing & Verification

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/algoatlas.spec.ts`

**Interfaces:**
- Produces: Full browser test suite verifying all 17 mandatory acceptance criteria.

- [ ] **Step 1: Configure Playwright**
  Setup `playwright.config.ts` for desktop and mobile viewport verification.
- [ ] **Step 2: Write end-to-end user journey tests**
  - Test 1: Add a problem from URL with platform auto-detection (LeetCode, Codeforces)
  - Test 2: Add and edit multi-approach solutions (Brute Force vs Optimal) in Learning Journal
  - Test 3: Record multiple attempts and self-assessment confidence score
  - Test 4: Concept Vault navigation and prerequisite breadcrumbs
  - Test 5: Roadmap tracking and cross-roadmap problem check-off
  - Test 6: Spaced repetition revision workflow (advance stage and overdue list)
  - Test 7: Recommendation engine reasoning display
  - Test 8: Contest logging and rating chart display
  - Test 9: Data export and backup restore
- [ ] **Step 3: Run all Vitest unit tests**
  Execute `npx vitest run` and confirm 100% pass.
- [ ] **Step 4: Run Playwright test suite**
  Execute `npx playwright test` and confirm all tests pass.

---

### Task 17: Documentation & Deployment Readiness

**Files:**
- Create: `README.md`
- Create: `docs/ARCHITECTURE.md`
- Create: `docs/DATABASE_SCHEMA.md`
- Create: `docs/PLATFORM_INTEGRATIONS.md`
- Create: `.env.example`

- [ ] **Step 1: Write `.env.example`**
  Document `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] **Step 2: Write comprehensive `README.md`**
  Product overview, screenshots/architecture diagram, feature walkthrough, local development setup, Supabase migration commands, and deployment guide for Vercel.
- [ ] **Step 3: Write technical docs**
  Document architecture, database schema, and platform integration adapters.
- [ ] **Step 4: Final build and lint verification**
  Run `npm run build` and ensure clean zero-warning build output.
