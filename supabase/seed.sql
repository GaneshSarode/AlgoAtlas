-- ========================================================================
-- ALGOATLAS: Foundational Seed Data (Topics, Prerequisites, Standard Roadmaps)
-- ========================================================================

-- Insert Standard Topics
INSERT INTO topics (id, slug, name, category, description, icon_name, sort_order) VALUES
('10000000-0000-0000-0000-000000000001', 'arrays', 'Arrays', 'Data Structures', 'Contiguous memory collection of elements with O(1) random access.', 'LayoutGrid', 1),
('10000000-0000-0000-0000-000000000002', 'strings', 'Strings', 'Data Structures', 'Sequences of characters with common palindrome and anagram patterns.', 'FileText', 2),
('10000000-0000-0000-0000-000000000003', 'hashing', 'Hashing & HashMaps', 'Data Structures', 'Key-value mapping providing average O(1) lookups and frequency counting.', 'Hash', 3),
('10000000-0000-0000-0000-000000000004', 'two-pointers', 'Two Pointers', 'Algorithms & Patterns', 'Traversing arrays with two markers from opposite ends or at variable speeds.', 'ArrowLeftRight', 4),
('10000000-0000-0000-0000-000000000005', 'sliding-window', 'Sliding Window', 'Algorithms & Patterns', 'Subarray and substring problems maintaining a dynamic contiguous window.', 'Maximize2', 5),
('10000000-0000-0000-0000-000000000006', 'prefix-sum', 'Prefix Sum', 'Algorithms & Patterns', 'Precomputing cumulative sums to answer range query problems in O(1).', 'PlusCircle', 6),
('10000000-0000-0000-0000-000000000007', 'binary-search', 'Binary Search', 'Algorithms & Patterns', 'Divide-and-conquer search on sorted spaces or monotonic predicate functions.', 'Search', 7),
('10000000-0000-0000-0000-000000000008', 'binary-search-answers', 'Binary Search on Answers', 'Algorithms & Patterns', 'Applying binary search to optimization predicates (minimax / maximin).', 'Target', 8),
('10000000-0000-0000-0000-000000000009', 'linked-lists', 'Linked Lists', 'Data Structures', 'Nodes connected sequentially by pointers: reverse, cycle detection, reordering.', 'Link', 9),
('10000000-0000-0000-0000-000000000010', 'fast-slow-pointers', 'Fast & Slow Pointers', 'Algorithms & Patterns', 'Tortoise and hare technique for cycles and middle elements.', 'Zap', 10),
('10000000-0000-0000-0000-000000000011', 'stacks', 'Stacks & Monotonic Stack', 'Data Structures', 'LIFO structures and monotonic stacks for Next Greater Element problems.', 'Layers', 11),
('10000000-0000-0000-0000-000000000012', 'trees', 'Binary Trees', 'Data Structures', 'Hierarchical node structure: traversals (pre/in/post/level), LCA, path sums.', 'GitBranch', 12),
('10000000-0000-0000-0000-000000000013', 'binary-search-trees', 'Binary Search Trees (BST)', 'Data Structures', 'Ordered binary trees enabling O(log N) searches, insertions, and validation.', 'Binary', 13),
('10000000-0000-0000-0000-000000000014', 'heaps', 'Heaps & Priority Queues', 'Data Structures', 'Complete binary trees maintaining min/max elements for Top-K queries.', 'Database', 14),
('10000000-0000-0000-0000-000000000015', 'graphs', 'Graphs', 'Data Structures', 'Networks of vertices and edges: BFS, DFS, cycle detection, bipartite graphs.', 'Network', 15),
('10000000-0000-0000-0000-000000000016', 'dynamic-programming', 'Dynamic Programming', 'Algorithms & Patterns', 'Solving subproblems with memoization or tabulation: 0/1 knapsack, LCS, LIS.', 'Cpu', 16),
('10000000-0000-0000-0000-000000000017', 'bit-manipulation', 'Bit Manipulation', 'Algorithms & Patterns', 'Bitwise operations (XOR, AND, shifts) for constant-time bit tricks.', 'Binary', 17),
('10000000-0000-0000-0000-000000000018', 'dsu', 'Disjoint Set Union (DSU)', 'Data Structures', 'Union-find structure with path compression and union by rank.', 'Share2', 18)
ON CONFLICT (slug) DO NOTHING;

-- Insert Topic Prerequisites
INSERT INTO topic_prerequisites (topic_id, prerequisite_topic_id) VALUES
-- Prefix Sum requires Arrays
('10000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001'),
-- Sliding Window requires Arrays
('10000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001'),
-- Two Pointers requires Arrays
('10000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001'),
-- Binary Search on Answers requires Binary Search
('10000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000007'),
-- Fast & Slow Pointers requires Linked Lists
('10000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000009'),
-- BST requires Binary Trees
('10000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000012'),
-- Dynamic Programming benefits from Recursion / Arrays
('10000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- Insert Standard Curated Roadmaps
INSERT INTO roadmaps (id, title, slug, description, is_system, is_active, total_problems) VALUES
('20000000-0000-0000-0000-000000000001', 'NeetCode 150', 'neetcode-150', 'Essential 150 pattern-based LeetCode questions covering core DSA topics.', true, true, 150),
('20000000-0000-0000-0000-000000000002', 'Blind 75', 'blind-75', 'The classic collection of 75 high-frequency technical interview questions.', true, false, 75),
('20000000-0000-0000-0000-000000000003', 'Striver A2Z DSA Sheet', 'striver-a2z', 'Comprehensive step-by-step master roadmap from basic syntax to advanced algorithms.', true, false, 455),
('20000000-0000-0000-0000-000000000004', 'CSES Problem Set', 'cses-problem-set', 'Competitive programming standard benchmark collection of 300 classic problems.', true, false, 300)
ON CONFLICT DO NOTHING;
