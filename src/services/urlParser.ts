import type { PlatformType } from "@/types";

export interface ParsedProblemUrl {
  platform: PlatformType;
  externalId?: string;
  slug: string;
  suggestedTitle: string;
  canonicalUrl: string;
}

function titleFromSlug(slug: string): string {
  return slug
    .split(/[-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function parseProblemUrl(rawUrl: string): ParsedProblemUrl {
  const urlTrimmed = rawUrl.trim();
  let cleanUrl = urlTrimmed;
  try {
    const urlObj = new URL(urlTrimmed);
    cleanUrl = urlObj.origin + urlObj.pathname;
  } catch {
    // If not a valid absolute URL, proceed with best effort
  }

  // 1. LeetCode
  // https://leetcode.com/problems/two-sum/
  const leetCodeMatch = cleanUrl.match(/leetcode\.[a-z.]+\/problems\/([a-zA-Z0-9_-]+)/i);
  if (leetCodeMatch) {
    const slug = leetCodeMatch[1].toLowerCase();
    return {
      platform: "LeetCode",
      slug,
      suggestedTitle: titleFromSlug(slug),
      canonicalUrl: `https://leetcode.com/problems/${slug}/`,
    };
  }

  // 2. Codeforces
  // https://codeforces.com/problemset/problem/158/A
  // https://codeforces.com/contest/1900/problem/B
  const cfProblemsetMatch = cleanUrl.match(/codeforces\.[a-z.]+\/problemset\/problem\/(\d+)\/([a-zA-Z0-9]+)/i);
  if (cfProblemsetMatch) {
    const contestId = cfProblemsetMatch[1];
    const index = cfProblemsetMatch[2].toUpperCase();
    const externalId = `${contestId}${index}`;
    return {
      platform: "Codeforces",
      externalId,
      slug: `codeforces-${externalId.toLowerCase()}`,
      suggestedTitle: `Codeforces ${externalId}`,
      canonicalUrl: `https://codeforces.com/problemset/problem/${contestId}/${index}`,
    };
  }

  const cfContestMatch = cleanUrl.match(/codeforces\.[a-z.]+\/contest\/(\d+)\/problem\/([a-zA-Z0-9]+)/i);
  if (cfContestMatch) {
    const contestId = cfContestMatch[1];
    const index = cfContestMatch[2].toUpperCase();
    const externalId = `${contestId}${index}`;
    return {
      platform: "Codeforces",
      externalId,
      slug: `codeforces-${externalId.toLowerCase()}`,
      suggestedTitle: `Codeforces ${externalId}`,
      canonicalUrl: `https://codeforces.com/contest/${contestId}/problem/${index}`,
    };
  }

  // 3. AtCoder
  // https://atcoder.jp/contests/abc300/tasks/abc300_a
  const atCoderMatch = cleanUrl.match(/atcoder\.jp\/contests\/([a-zA-Z0-9_-]+)\/tasks\/([a-zA-Z0-9_-]+)/i);
  if (atCoderMatch) {
    const taskId = atCoderMatch[2];
    return {
      platform: "AtCoder",
      externalId: taskId,
      slug: taskId.toLowerCase(),
      suggestedTitle: `AtCoder ${taskId.toUpperCase()}`,
      canonicalUrl: cleanUrl,
    };
  }

  // 4. CodeChef
  // https://www.codechef.com/problems/FLOW001
  const codechefMatch = cleanUrl.match(/codechef\.com\/(?:[a-zA-Z0-9_-]+\/)?problems\/([a-zA-Z0-9_-]+)/i);
  if (codechefMatch) {
    const code = codechefMatch[1].toUpperCase();
    return {
      platform: "CodeChef",
      externalId: code,
      slug: code.toLowerCase(),
      suggestedTitle: `CodeChef ${code}`,
      canonicalUrl: `https://www.codechef.com/problems/${code}`,
    };
  }

  // 5. GeeksforGeeks
  // https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1
  const gfgMatch = cleanUrl.match(/geeksforgeeks\.org\/problems\/([a-zA-Z0-9_-]+)/i);
  if (gfgMatch) {
    const slug = gfgMatch[1].toLowerCase();
    return {
      platform: "GeeksforGeeks",
      slug,
      suggestedTitle: titleFromSlug(slug.replace(/-\d+$/, "")),
      canonicalUrl: cleanUrl,
    };
  }

  // 6. HackerRank
  // https://www.hackerrank.com/challenges/simple-array-sum/problem
  const hrMatch = cleanUrl.match(/hackerrank\.com\/challenges\/([a-zA-Z0-9_-]+)/i);
  if (hrMatch) {
    const slug = hrMatch[1].toLowerCase();
    return {
      platform: "HackerRank",
      slug,
      suggestedTitle: titleFromSlug(slug),
      canonicalUrl: cleanUrl,
    };
  }

  // Fallback for custom or unknown URL
  let fallbackSlug = "problem";
  try {
    const u = new URL(cleanUrl);
    const parts = u.pathname.split("/").filter(Boolean);
    fallbackSlug = parts[parts.length - 1] || "problem";
  } catch {
    // ignore
  }

  return {
    platform: "Other",
    slug: fallbackSlug.toLowerCase(),
    suggestedTitle: titleFromSlug(fallbackSlug),
    canonicalUrl: cleanUrl,
  };
}
