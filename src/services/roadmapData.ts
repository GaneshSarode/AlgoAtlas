import type { Roadmap, RoadmapItem } from "@/types";

export const ROADMAP_METADATA: Roadmap[] = [
  {
    id: "rm-neetcode-150",
    title: "NeetCode 150",
    slug: "neetcode-150",
    description: "The premier pattern-based curriculum covering all high-frequency DSA patterns with minimal redundancy.",
    is_system: true,
    is_active: true,
    total_problems: 150,
  },
  {
    id: "rm-blind-75",
    title: "Blind 75",
    slug: "blind-75",
    description: "The classic curated interview problem set distilled by a Meta Tech Lead.",
    is_system: true,
    is_active: false,
    total_problems: 75,
  },
  {
    id: "rm-striver-a2z",
    title: "Striver A2Z DSA Sheet",
    slug: "striver-a2z",
    description: "Exhaustive step-by-step master roadmap covering foundational syntax through advanced DP and graphs.",
    is_system: true,
    is_active: false,
    total_problems: 455,
  },
  {
    id: "rm-striver-sde",
    title: "Striver SDE Sheet",
    slug: "striver-sde",
    description: "Targeted collection of top 191 interview problems for product-based tech companies.",
    is_system: true,
    is_active: false,
    total_problems: 191,
  },
  {
    id: "rm-grind-75",
    title: "Grind 75",
    slug: "grind-75",
    description: "Modern successor to Blind 75 with customizable weekly study pace by tech veteran Yangshun Tay.",
    is_system: true,
    is_active: false,
    total_problems: 75,
  },
  {
    id: "rm-cses",
    title: "CSES Problem Set",
    slug: "cses-problem-set",
    description: "Standard competitive programming benchmark repository maintained by University of Helsinki.",
    is_system: true,
    is_active: false,
    total_problems: 300,
  },
];

export const ROADMAP_SECTIONS_NEETCODE: Record<string, Omit<RoadmapItem, "roadmap_id">[]> = {
  "Arrays & Hashing": [
    { id: "nc-1", title: "Contains Duplicate", external_url: "https://leetcode.com/problems/contains-duplicate/", platform: "LeetCode", external_id: "217", difficulty: "Easy", sort_order: 1, section_name: "Arrays & Hashing" },
    { id: "nc-2", title: "Valid Anagram", external_url: "https://leetcode.com/problems/valid-anagram/", platform: "LeetCode", external_id: "242", difficulty: "Easy", sort_order: 2, section_name: "Arrays & Hashing" },
    { id: "nc-3", title: "Two Sum", external_url: "https://leetcode.com/problems/two-sum/", platform: "LeetCode", external_id: "1", difficulty: "Easy", sort_order: 3, section_name: "Arrays & Hashing" },
    { id: "nc-4", title: "Group Anagrams", external_url: "https://leetcode.com/problems/group-anagrams/", platform: "LeetCode", external_id: "49", difficulty: "Medium", sort_order: 4, section_name: "Arrays & Hashing" },
    { id: "nc-5", title: "Top K Frequent Elements", external_url: "https://leetcode.com/problems/top-k-frequent-elements/", platform: "LeetCode", external_id: "347", difficulty: "Medium", sort_order: 5, section_name: "Arrays & Hashing" },
  ],
  "Two Pointers": [
    { id: "nc-6", title: "Valid Palindrome", external_url: "https://leetcode.com/problems/valid-palindrome/", platform: "LeetCode", external_id: "125", difficulty: "Easy", sort_order: 6, section_name: "Two Pointers" },
    { id: "nc-7", title: "Two Sum II - Input Array Is Sorted", external_url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", platform: "LeetCode", external_id: "167", difficulty: "Medium", sort_order: 7, section_name: "Two Pointers" },
    { id: "nc-8", title: "3Sum", external_url: "https://leetcode.com/problems/3sum/", platform: "LeetCode", external_id: "15", difficulty: "Medium", sort_order: 8, section_name: "Two Pointers" },
    { id: "nc-9", title: "Container With Most Water", external_url: "https://leetcode.com/problems/container-with-most-water/", platform: "LeetCode", external_id: "11", difficulty: "Medium", sort_order: 9, section_name: "Two Pointers" },
    { id: "nc-10", title: "Trapping Rain Water", external_url: "https://leetcode.com/problems/trapping-rain-water/", platform: "LeetCode", external_id: "42", difficulty: "Hard", sort_order: 10, section_name: "Two Pointers" },
  ],
  "Sliding Window": [
    { id: "nc-11", title: "Best Time to Buy and Sell Stock", external_url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", platform: "LeetCode", external_id: "121", difficulty: "Easy", sort_order: 11, section_name: "Sliding Window" },
    { id: "nc-12", title: "Longest Substring Without Repeating Characters", external_url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", platform: "LeetCode", external_id: "3", difficulty: "Medium", sort_order: 12, section_name: "Sliding Window" },
    { id: "nc-13", title: "Longest Repeating Character Replacement", external_url: "https://leetcode.com/problems/longest-repeating-character-replacement/", platform: "LeetCode", external_id: "424", difficulty: "Medium", sort_order: 13, section_name: "Sliding Window" },
    { id: "nc-14", title: "Minimum Window Substring", external_url: "https://leetcode.com/problems/minimum-window-substring/", platform: "LeetCode", external_id: "76", difficulty: "Hard", sort_order: 14, section_name: "Sliding Window" },
  ],
  "Binary Search": [
    { id: "nc-15", title: "Binary Search", external_url: "https://leetcode.com/problems/binary-search/", platform: "LeetCode", external_id: "704", difficulty: "Easy", sort_order: 15, section_name: "Binary Search" },
    { id: "nc-16", title: "Search a 2D Matrix", external_url: "https://leetcode.com/problems/search-a-2d-matrix/", platform: "LeetCode", external_id: "74", difficulty: "Medium", sort_order: 16, section_name: "Binary Search" },
    { id: "nc-17", title: "Koko Eating Bananas", external_url: "https://leetcode.com/problems/koko-eating-bananas/", platform: "LeetCode", external_id: "875", difficulty: "Medium", sort_order: 17, section_name: "Binary Search" },
    { id: "nc-18", title: "Find Minimum in Rotated Sorted Array", external_url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", platform: "LeetCode", external_id: "153", difficulty: "Medium", sort_order: 18, section_name: "Binary Search" },
  ],
  "Dynamic Programming": [
    { id: "nc-19", title: "Climbing Stairs", external_url: "https://leetcode.com/problems/climbing-stairs/", platform: "LeetCode", external_id: "70", difficulty: "Easy", sort_order: 19, section_name: "Dynamic Programming" },
    { id: "nc-20", title: "Min Cost Climbing Stairs", external_url: "https://leetcode.com/problems/min-cost-climbing-stairs/", platform: "LeetCode", external_id: "746", difficulty: "Easy", sort_order: 20, section_name: "Dynamic Programming" },
    { id: "nc-21", title: "Coin Change", external_url: "https://leetcode.com/problems/coin-change/", platform: "LeetCode", external_id: "322", difficulty: "Medium", sort_order: 21, section_name: "Dynamic Programming" },
    { id: "nc-22", title: "Longest Increasing Subsequence", external_url: "https://leetcode.com/problems/longest-increasing-subsequence/", platform: "LeetCode", external_id: "300", difficulty: "Medium", sort_order: 22, section_name: "Dynamic Programming" },
  ]
};
