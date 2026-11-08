export interface DetailedConcept {
  id: string;
  slug: string;
  name: string;
  category: "Fundamentals" | "Data Structures" | "Algorithms & Patterns" | "Advanced";
  definition: string;
  intuition: string;
  howItWorks: string;
  whenToUse: string[];
  whenNotToUse: string[];
  timeComplexity: string;
  spaceComplexity: string;
  codeTemplate: string;
  language: string;
  commonMistakes: string[];
  prerequisites: string[]; // slugs
  unlockedConcepts: string[]; // slugs
}

export const DETAILED_CONCEPTS: Record<string, DetailedConcept> = {
  arrays: {
    id: "t-arrays",
    slug: "arrays",
    name: "Arrays",
    category: "Data Structures",
    definition: "A linear data structure storing elements in contiguous memory locations with O(1) index-based random access.",
    intuition: "Think of an array as numbered lockers in a row. Knowing the locker number gives instant access to its contents.",
    howItWorks: "Memory is allocated in a continuous chunk. Address of index i = base_address + i * size_of_element.",
    whenToUse: [
      "Frequent random read access by index.",
      "Iterating over collections in linear order.",
      "Fixed-size or dynamic list buffers.",
    ],
    whenNotToUse: [
      "Frequent insertions and deletions in the middle (O(N) shifts required).",
      "Unbounded memory when resizing overhead is prohibitive.",
    ],
    timeComplexity: "Access: O(1) | Search: O(N) | Insert/Delete at end: O(1) amortized | Insert/Delete middle: O(N)",
    spaceComplexity: "O(N) contiguous memory",
    codeTemplate: `// Standard dynamic array traversal & manipulation in C++
#include <vector>
#include <iostream>

void arrayTemplate(std::vector<int>& nums) {
    for (int i = 0; i < nums.size(); ++i) {
        // O(1) index access
        std::cout << nums[i] << " ";
    }
}`,
    language: "C++",
    commonMistakes: [
      "Index out-of-bounds off-by-one errors (0 to N-1).",
      "Expensive reallocations without reserve() when pushing many elements.",
    ],
    prerequisites: [],
    unlockedConcepts: ["two-pointers", "sliding-window", "prefix-sum", "binary-search"],
  },

  "two-pointers": {
    id: "t-two-pointers",
    slug: "two-pointers",
    name: "Two Pointers",
    category: "Algorithms & Patterns",
    definition: "An algorithmic pattern that uses two pointer references across an array or list to evaluate pairs or boundaries without nested loops.",
    intuition: "Instead of searching every combination with O(N^2) double loops, coordinate two pointers (e.g. left and right) based on monotonic properties to solve in O(N).",
    howItWorks: "Start pointers at opposite ends (converging) or at the start with different step sizes (fast/slow). Move the pointer that brings you closer to the target constraint.",
    whenToUse: [
      "Sorted array pair/triplet sum searches (Two Sum II, 3Sum).",
      "In-place array modifications (Remove Duplicates, Move Zeroes).",
      "Palindrome string verification.",
      "Container with Most Water boundary problems.",
    ],
    whenNotToUse: [
      "Unsorted arrays where sorting destroys original index requirements or is slower than hashmap.",
      "When random or non-monotonic movements are required.",
    ],
    timeComplexity: "Time: O(N) (or O(N log N) if sorting needed) | Space: O(1) auxiliary",
    spaceComplexity: "O(1) in-place pointers",
    codeTemplate: `// Converging two pointers on sorted array
bool twoSumSorted(const std::vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;
    
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return true;
        else if (sum < target) left++; // Need larger sum
        else right--; // Need smaller sum
    }
    return false;
}`,
    language: "C++",
    commonMistakes: [
      "Forgetting to check left < right boundary.",
      "Infinite loop if neither pointer increments/decrements in a branch.",
      "Duplication handling when skipping identical values in 3Sum.",
    ],
    prerequisites: ["arrays"],
    unlockedConcepts: ["sliding-window", "trapping-rain-water"],
  },

  "sliding-window": {
    id: "t-sliding-window",
    slug: "sliding-window",
    name: "Sliding Window",
    category: "Algorithms & Patterns",
    definition: "A technique that converts nested loops over contiguous subarrays/substrings into a single linear pass by expanding and contracting a dynamic window.",
    intuition: "Like looking through a window on a train: as you roll forward, old elements exit the left side while new elements enter the right side, preserving running state.",
    howItWorks: "Maintain pointers `left` and `right`. Expand `right` to include elements until window condition is violated (or met), then increment `left` to restore validity while updating optimal answer.",
    whenToUse: [
      "Longest or shortest contiguous subarray/substring meeting a target condition.",
      "Fixed-size window max/min sums or averages.",
      "Substring with at most K distinct characters.",
    ],
    whenNotToUse: [
      "Non-contiguous subsequence problems (use DP instead).",
      "Subarrays with negative numbers where window monotonicity is broken (use Prefix Sum + Hashmap).",
    ],
    timeComplexity: "Time: O(N) amortized (each element enters and exits window at most once)",
    spaceComplexity: "O(K) auxiliary for frequency map or character set",
    codeTemplate: `// Dynamic sliding window template in C++
int lengthOfLongestSubstringKDistinct(std::string s, int k) {
    std::unordered_map<char, int> freq;
    int left = 0, maxLen = 0;
    
    for (int right = 0; right < s.length(); ++right) {
        freq[s[right]]++;
        
        // Shrink window if invalid
        while (freq.size() > k) {
            freq[s[left]]--;
            if (freq[s[left]] == 0) freq.erase(s[left]);
            left++;
        }
        maxLen = std::max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
    language: "C++",
    commonMistakes: [
      "Attempting sliding window when array contains negative numbers without monotonicity.",
      "Incorrect window size formula: window length is `right - left + 1`, not `right - left`.",
    ],
    prerequisites: ["arrays", "two-pointers"],
    unlockedConcepts: ["advanced-sliding-window"],
  },

  "prefix-sum": {
    id: "t-prefix-sum",
    slug: "prefix-sum",
    name: "Prefix Sum",
    category: "Algorithms & Patterns",
    definition: "An algorithmic technique where cumulative sums are precomputed to query any contiguous range sum [i..j] in O(1) time.",
    intuition: "Instead of summing elements between indices i and j every time, calculate `prefix[j] - prefix[i-1]`. Distance between two mile markers is difference of their odometer readings.",
    howItWorks: "Construct `prefix[i] = prefix[i-1] + nums[i]`. Any range sum is `prefix[right] - prefix[left-1]`.",
    whenToUse: [
      "Multiple range sum queries.",
      "Subarray sum equals K problems (using Hashmap of prefix counts).",
      "2D matrix range query sum precomputations.",
    ],
    whenNotToUse: [
      "Arrays with frequent point updates (use Fenwick Tree or Segment Tree instead for O(log N) updates).",
    ],
    timeComplexity: "Precomputation: O(N) | Range Query: O(1)",
    spaceComplexity: "O(N) for prefix table (or O(1) if modified in-place)",
    codeTemplate: `// Subarray Sum Equals K using Prefix Sum + Hashmap
int subarraySum(std::vector<int>& nums, int k) {
    std::unordered_map<int, int> prefixCounts;
    prefixCounts[0] = 1; // Base case: prefix sum of 0 appears once
    
    int currentSum = 0, count = 0;
    for (int x : nums) {
        currentSum += x;
        if (prefixCounts.find(currentSum - k) != prefixCounts.end()) {
            count += prefixCounts[currentSum - k];
        }
        prefixCounts[currentSum]++;
    }
    return count;
}`,
    language: "C++",
    commonMistakes: [
      "Forgetting to seed `prefixCounts[0] = 1` for subarrays starting at index 0.",
      "Integer overflow when summing large values; use 64-bit `long long`.",
    ],
    prerequisites: ["arrays"],
    unlockedConcepts: ["fenwick-trees", "segment-trees"],
  },

  "binary-search": {
    id: "t-binary-search",
    slug: "binary-search",
    name: "Binary Search",
    category: "Algorithms & Patterns",
    definition: "A divide-and-conquer search algorithm that repeatedly halves the search space to find an element or predicate boundary in O(log N).",
    intuition: "Guessing a number between 1 and 100: each guess divides the remaining candidates exactly in half.",
    howItWorks: "Compare middle element with target. If target is smaller, discard right half; if larger, discard left half.",
    whenToUse: [
      "Searching in sorted arrays.",
      "Finding first or last occurrence of duplicates.",
      "Rotated sorted arrays.",
    ],
    whenNotToUse: [
      "Unsorted arrays where sorting takes O(N log N) just for a single search.",
      "Linked lists where accessing middle element takes O(N).",
    ],
    timeComplexity: "O(log N)",
    spaceComplexity: "O(1) iterative",
    codeTemplate: `// Classic overflow-safe Binary Search in C++
int binarySearch(const std::vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2; // Prevents (left + right) integer overflow
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
    language: "C++",
    commonMistakes: [
      "Integer overflow with `(left + right) / 2`; always use `left + (right - left) / 2`.",
      "Infinite loop caused by wrong `mid` calculation when `left = mid` without ceil.",
    ],
    prerequisites: ["arrays"],
    unlockedConcepts: ["binary-search-answers"],
  },

  "binary-search-answers": {
    id: "t-bs-answers",
    slug: "binary-search-answers",
    name: "Binary Search on Answers",
    category: "Algorithms & Patterns",
    definition: "An optimization technique where binary search is applied to the output answer range rather than an input array, using a monotonic predicate function `isValid(mid)`.",
    intuition: "If speed X works, any speed > X will also work. Find the minimum speed where it is valid.",
    howItWorks: "1. Define minimum and maximum possible answer (search range `[low, high]`). 2. Implement `bool check(mid)`. 3. Binary search for boundary.",
    whenToUse: [
      "Minimax or maximin problems: 'Minimize the maximum distance', 'Find minimum speed to finish in H hours' (Koko Eating Bananas, Capacity to Ship Packages).",
      "Monotonic feasibility predicate: if answer K works, all K+1 work.",
    ],
    whenNotToUse: [
      "When feasibility is non-monotonic (e.g. valid for 5, invalid for 6, valid for 7).",
    ],
    timeComplexity: "O(check_function_cost * log(answer_range))",
    spaceComplexity: "O(1)",
    codeTemplate: `// Binary Search on Answers (Minimizing the maximum)
bool canShip(const std::vector<int>& weights, int capacity, int days) {
    int requiredDays = 1, currentLoad = 0;
    for (int w : weights) {
        if (currentLoad + w > capacity) {
            requiredDays++;
            currentLoad = 0;
        }
        currentLoad += w;
    }
    return requiredDays <= days;
}

int shipWithinDays(std::vector<int>& weights, int days) {
    int low = *std::max_element(weights.begin(), weights.end());
    int high = std::accumulate(weights.begin(), weights.end(), 0);
    int ans = high;
    
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (canShip(weights, mid, days)) {
            ans = mid;
            high = mid - 1; // Try smaller capacity
        } else {
            low = mid + 1; // Need larger capacity
        }
    }
    return ans;
}`,
    language: "C++",
    commonMistakes: [
      "Setting `low` too small: `low` must be at least `max(element)` if an element cannot be split.",
      "Setting `high` too small: must cover worst-case upper bound.",
    ],
    prerequisites: ["binary-search"],
    unlockedConcepts: ["advanced-optimization"],
  },

  "dynamic-programming": {
    id: "t-dp",
    slug: "dynamic-programming",
    name: "Dynamic Programming",
    category: "Algorithms & Patterns",
    definition: "An algorithmic optimization paradigm that solves complex problems by breaking them down into overlapping subproblems and storing subproblem results (memoization/tabulation).",
    intuition: "Those who cannot remember the past are condemned to repeat it. If you have computed F(3), never recompute F(3).",
    howItWorks: "1. Identify state variables. 2. Define recurrence relation. 3. Identify base cases. 4. Choose memoization (top-down) or tabulation (bottom-up).",
    whenToUse: [
      "Problems with overlapping subproblems and optimal substructure.",
      "Counting distinct ways to reach a state (Climbing Stairs).",
      "Finding minimum/maximum cost/paths (Coin Change, Min Cost Climbing Stairs).",
      "0/1 Knapsack, Longest Common Subsequence (LCS), Longest Increasing Subsequence (LIS).",
    ],
    whenNotToUse: [
      "Problems with greedy choice property where greedy is provably optimal and faster.",
      "Problems without overlapping subproblems (e.g. Merge Sort).",
    ],
    timeComplexity: "O(Number of states * Transitions per state)",
    spaceComplexity: "O(Number of states) (often reducible to O(1) or O(N) by keeping only previous row)",
    codeTemplate: `// Coin Change: Minimum coins to make amount (Bottom-up Tabulation)
int coinChange(std::vector<int>& coins, int amount) {
    std::vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0; // Base case: 0 coins needed for amount 0
    
    for (int i = 1; i <= amount; ++i) {
        for (int coin : coins) {
            if (i - coin >= 0) {
                dp[i] = std::min(dp[i], 1 + dp[i - coin]);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
    language: "C++",
    commonMistakes: [
      "Incorrect base case initialization (e.g. setting infinity too high causing integer overflow on + 1).",
      "Confusing 0/1 knapsack (reverse loop in 1D array) with unbounded knapsack (forward loop).",
    ],
    prerequisites: ["arrays", "recursion"],
    unlockedConcepts: ["dp-on-trees", "bitmask-dp"],
  },
};
