# AlgoAtlas — Personal DSA Learning OS

> **Your Personal Data Structures and Algorithms Journey, Reimagined.**  
> *Don't just count solved problems. Measure actual learning, understanding, problem-solving ability, and long-term pattern mastery.*

---

## 🌟 Product Vision

Competitive programming and technical interview preparation across multiple websites (LeetCode, Codeforces, AtCoder, CodeChef, HackerRank, GeeksforGeeks) often scatters your learning data across disjointed profiles, notes, spreadsheets, and tabs.

**AlgoAtlas** serves as a unified command center combining:
1. **Central Problem Vault & Learning Journal:** Record problem understanding, initial approaches, what failed, and separate Brute-Force vs Optimal approaches with syntax-highlighted code.
2. **Concept Vault:** Knowledge base covering Fundamentals, Data Structures, and Algorithmic Patterns linked by an interactive Directed Acyclic Graph (DAG) prerequisite flow.
3. **Curated & Custom Roadmaps:** Built-in sheets (NeetCode 150, Blind 75, Striver A2Z, CSES) with automatic cross-roadmap synchronization.
4. **Spaced Repetition Revision Centre:** SM-2 active recall scheduling (1d → 3d → 7d → 14d → 30d → 60d → 90d) with a dedicated distraction-free recall mode.
5. **Learning Intelligence Recommendation Engine:** Rule-based diagnostic planner explaining *why* each next step is recommended (Overdue Revisions → Missing Prerequisites → Weak Topics → Next Roadmap Milestone).
6. **Contest Tracker:** Log contest rank, rating changes, and post-contest retrospectives with interactive rating progression charts.
7. **Platform Integrations:** Real server-side public API adapters for Codeforces and AtCoder; safe manual/CSV workflows for other platforms without fragile scraping.
8. **Data Portability:** Complete JSON backup export and restore, plus CSV problem exports.

---

## 🛠 Technology Stack

- **Frontend:** Next.js 15+ (App Router), React 19, TypeScript (Strict Mode), Tailwind CSS, Lucide React icons, Radix UI primitives.
- **Analytics:** Recharts (Rating progression, Difficulty distribution, Topic breakdown, Confidence distribution).
- **Forms & Validation:** React Hook Form, Zod schemas.
- **Date & Scheduling:** date-fns, customized SM-2 Spaced Repetition engine.
- **Backend & Database:** Supabase PostgreSQL with 21 normalized tables, Database Triggers, and strict Row Level Security (RLS).
- **Dual Storage Engine:** Connected Supabase backend with seamless fallback to an in-memory/localStorage seedable repository for zero-config local testing and offline modes.
- **Testing:** Playwright for browser E2E testing, Vitest for unit tests.
- **Deployment:** Vercel + Supabase.

---

## 🧭 Application Sections (All 12 Modules)

| # | Section | Description |
|---|---|---|
| 1 | **Dashboard** | Executive overview with overall stats, platform breakdown, habit consistency heatmap, and "Your Learning Intelligence" diagnostic summary. |
| 2 | **My Problems** | Central problem catalog with search, multi-field filters (platform, topic, difficulty, status, confidence), and Table/Card views. |
| 3 | **Quick Add Problem** | Instant URL paste with domain auto-detection and problem ID extraction (LeetCode, Codeforces, AtCoder, CodeChef, HackerRank, GFG). |
| 4 | **Learning Journal** | Problem understanding, initial thoughts, what failed, multi-approach solutions (Brute Force, Improved, Optimal), code snippets, and self-assessment. |
| 5 | **Concept Vault** | Knowledge base with definitions, mental intuitions, complexity breakdowns, code templates, traps, and prerequisite DAG flows. |
| 6 | **DSA Roadmap** | Curated sheets (NeetCode 150, Blind 75, Striver A2Z, CSES) with automatic cross-roadmap completion synchronization. |
| 7 | **Revision Centre** | Spaced repetition queue (Overdue, Due Today, Upcoming, Mastered) and distraction-free active recall study mode. |
| 8 | **What Should I Learn Next?** | Prioritized recommendation engine generating daily learning plans with explicit, actionable reasons. |
| 9 | **Contest Tracker** | Competitive programming contest logger, rating change calculation, rating progression line chart, and retrospective reflections. |
| 10 | **Analytics & Reports** | 180-day contribution heatmap, difficulty donut charts, topic mastery bars, confidence rating distributions, and weekly summaries. |
| 11 | **Platform Integrations** | Live Codeforces & AtCoder public API adapters, rate-limited server endpoints, audit sync logs, and CSV import modal. |
| 12 | **Settings & Portability** | Profile targets (daily study minutes, problems/day), preferred language, full JSON backup download, JSON restore, and database reset. |

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- Node.js 18+ (tested on Node v24.14.0)
- npm or yarn

### 2. Installation
```bash
git clone <your-repo-url> algoatlas
cd algoatlas
npm install
```

### 3. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env.local
```
*(Note: AlgoAtlas includes a dual-mode storage engine. You can run and test the app immediately without any Supabase credentials in local demo mode, or provide your Supabase credentials for hosted cloud persistence).*

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄 Database Setup & Supabase Migrations

If deploying with Supabase PostgreSQL:
1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Execute the migration script in the SQL editor:
   ```bash
   # Migration script located at:
   supabase/migrations/20261109000000_init_algoatlas.sql
   ```
3. Execute the seed script to populate standard DSA topics, prerequisites, and roadmap sheets:
   ```bash
   # Seed script located at:
   supabase/seed.sql
   ```
4. Copy your project URL, Anon Key, and Service Role Key to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

---

## 🧪 Testing

### Unit Tests (Vitest)
Runs tests for recommendation engine, spaced repetition scheduler, URL platform detector, Codeforces adapter, and backup/restore:
```bash
npm test
```

### End-to-End Browser Tests (Playwright)
Executes end-to-end user workflows against a real browser:
```bash
npm run test:e2e
```

### Production Build Verification
```bash
npm run build
```

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. In Project Settings > Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (Optional for server actions)
4. Deploy! Next.js will build and deploy the production bundle automatically.

---

## 📄 License
MIT License. Built for passionate engineers mastering competitive programming and software engineering algorithms.
