# AlgoAtlas Architecture Documentation

## Overview

AlgoAtlas is architected as a personal Data Structures & Algorithms (DSA) Learning Operating System. It reconciles problem tracking across platforms (LeetCode, Codeforces, AtCoder, CodeChef, HackerRank, GeeksforGeeks) with deep learning diagnostics, spaced repetition recall scheduling, prerequisite knowledge graphs, and competitive programming analytics.

```
+---------------------------------------------------------------------------------------+
|                                    Client Tier                                        |
|  - Next.js 15 App Router (React 19, TypeScript strict mode)                           |
|  - Tailwind CSS + Radix UI Primitives + Lucide Icons + Recharts Analytics             |
|  - Layout: Collapsible Sidebar, Quick Capture Modal (+ Problem), Command Palette      |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
|                                Next.js Server Tier                                    |
|  - Server Actions & Route Handlers (`/api/integrations/codeforces`, `/api/atcoder`)   |
|  - Domain Business Services:                                                          |
|      * URL Parser & Platform Detector (`src/services/urlParser.ts`)                   |
|      * Spaced Repetition Scheduling Engine (`src/services/revisionEngine.ts`)         |
|      * Learning Recommendation Engine (`src/services/recommendationEngine.ts`)       |
|      * Platform Adapters (`src/services/platformAdapters/*`)                          |
|      * Data Portability & Serialization (`src/services/exportService.ts`)              |
+-------------------------------------------+-------------------------------------------+
                                            |
                      +---------------------+---------------------+
                      |                                           |
                      v                                           v
+-----------------------------------------+   +-----------------------------------------+
|     Supabase PostgreSQL / Data Layer     |   |      External Public APIs (Server)      |
|  - 21 Normalized Relational Tables      |   |  - Codeforces Official Public API:      |
|  - Row Level Security (RLS) on user_id  |   |    user.info, user.rating, user.status  |
|  - In-Memory / Local Repository Fallback|   |  - AtCoder Problems Community API       |
|    (Zero-config local development mode) |   |  - Rate-limited and cached              |
+-----------------------------------------+   +-----------------------------------------+
```

## Modular Layering

### 1. Presentation Layer (`src/components/`, `src/app/`)
- **AppShell:** Persistent layout wrapper housing the collapsible sidebar (all 12 sections), top command bar, dark/light theme switch, global quick search (`Ctrl+K`), and quick-capture modal.
- **Problem Vault:** Dual view (TanStack Table & responsive Card grid) with multi-criteria filtering (platform, difficulty, status, confidence, topic, tags) and sorting.
- **Learning Journal:** Multi-approach solution manager (Brute Force, Improved, Optimal), step-by-step algorithms, complexities, code snippet editor with language selector and copy button, structured reflections, and debounced autosave.
- **Concept Vault:** Knowledge base with category groupings, definition, mental intuition, code templates, when-to-use checklists, and interactive DAG prerequisite flow.
- **Revision Centre:** Spaced repetition queue breakdown (Overdue, Today Due, Upcoming, Mastered) and distraction-free recall mode with self-scoring.
- **What Should I Learn Next:** Transparent rule-based learning planner prioritizing overdue items, missing prerequisites, weak topics, and roadmap milestones with explicit reason badges.
- **Contest Tracker:** CP rating progression line chart, contest logger, and retrospective reflection fields.
- **Analytics & Portability:** Habit consistency contribution calendar, difficulty donut chart, topic bar chart, confidence distribution, and JSON/CSV backup/restore.

### 2. Domain & Intelligence Services (`src/services/`)
- `urlParser.ts`: Platform URL regex matching and external problem ID extractor.
- `revisionEngine.ts`: Calculates recall intervals (1d, 3d, 7d, 14d, 30d, 60d, 90d) and partitions revision queues.
- `recommendationEngine.ts`: Evaluates mastery, prerequisite gaps, hint frequencies, and active roadmap frontiers.
- `platformAdapters/`: Extensible adapter pattern implementing `IPlatformAdapter` for Codeforces and AtCoder with graceful error reporting and zero fragile scraping.
- `exportService.ts`: Full JSON backup export/restore and CSV problem table export.

### 3. Data Tier (`src/lib/db/`, `supabase/`)
- `src/lib/db/repository.ts`: Single repository contract providing transparent data operations. Dynamically connects to Supabase PostgreSQL when credentials exist, or provides an in-memory, seedable local repository for zero-config offline development and automated testing.
