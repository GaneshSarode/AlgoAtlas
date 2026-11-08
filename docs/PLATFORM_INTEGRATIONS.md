# AlgoAtlas Platform Integrations & API Architecture

## Overview

AlgoAtlas provides a modular platform integration architecture. Rather than relying on fragile web scrapers that break on layout changes or violate terms of service, AlgoAtlas adheres to official public APIs and structured import/export interfaces.

```
                    +---------------------------+
                    |     IPlatformAdapter      |
                    +-------------+-------------+
                                  |
            +---------------------+---------------------+
            |                                           |
            v                                           v
+-----------------------+                   +-----------------------+
|   CodeforcesAdapter   |                   |    AtCoderAdapter     |
| - user.info           |                   | - user/submissions    |
| - user.rating         |                   | - Kenkoooo community  |
| - user.status         |                   |   AtCoder API         |
+-----------------------+                   +-----------------------+
```

## Supported Platforms

### 1. Codeforces (Full Live Sync)
- **API Reference:** `https://codeforces.com/api/`
- **Endpoints:**
  - `user.info?handles={handle}`: Fetches avatar, current rating, max rating, and rank title.
  - `user.rating?handle={handle}`: Fetches full contest rating delta history.
  - `user.status?handle={handle}&from=1&count=20`: Fetches recent submissions and verdict.
- **Rate Limit Policy:** 1 request every 2 seconds. Server-side caching prevents burst penalties.
- **Security:** Public read-only endpoints. Never asks for or stores Codeforces passwords.

### 2. AtCoder (Live Submission Sync)
- **API Reference:** AtCoder Problems API (`https://kenkoooo.com/atcoder/atcoder-api/v3/`)
- **Endpoints:**
  - `user/submissions?user={handle}&from_second=0`: Fetches recent contest and practice problem submissions.
- **Rate Limit Policy:** 1 request per second. Cached in local sync logs.

### 3. LeetCode (Manual Logging & CSV Import)
- **Policy:** Direct automated scraping of LeetCode is intentionally avoided to honor platform guidelines.
- **Workflow:**
  - Quick-capture problem URL parser: Paste `https://leetcode.com/problems/two-sum/` -> auto-extracts slug and title.
  - CSV Import: One-click batch import of LeetCode problem lists.
  - Direct profile reference: Connect your LeetCode handle for quick 1-click external navigation.

### 4. CodeChef (Manual Logging & CSV Import)
- **Policy:** Safe manual logging and CSV batch imports with URL auto-fill (`https://www.codechef.com/problems/{CODE}`).

### 5. HackerRank (Manual Logging & CSV Import)
- **Policy:** Practice challenges can be logged via quick-capture URL parser. (Enterprise HackerRank for Work APIs are designed for corporate recruiting, not individual practice).

### 6. GeeksforGeeks (Manual Logging & CSV Import)
- **Policy:** Practice questions can be logged via quick-capture URL parser or CSV batch import.
