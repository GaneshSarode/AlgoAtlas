"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Link as LinkIcon,
  AlertCircle,
  Clock,
  Code,
  Star,
  BookOpen,
} from "lucide-react";
import { Dialog } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { parseProblemUrl } from "@/services/urlParser";
import { getDbRepository } from "@/lib/db/repository";
import { slugify } from "@/lib/utils";
import type { PlatformType, DifficultyLevel, ProblemStatus } from "@/types";

export interface AddProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProblemAdded?: () => void;
}

export function AddProblemModal({
  isOpen,
  onClose,
  onProblemAdded,
}: AddProblemModalProps) {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<PlatformType>("LeetCode");
  const [externalId, setExternalId] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Medium");
  const [status, setStatus] = useState<ProblemStatus>("Solved Independently");
  const [confidence, setConfidence] = useState(4);
  const [primaryTopic, setPrimaryTopic] = useState("Arrays");
  const [subtopic, setSubtopic] = useState("");
  const [timeSpent, setTimeSpent] = useState(30);
  const [language, setLanguage] = useState("C++");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [viewedEditorial, setViewedEditorial] = useState(false);
  const [usedExternalHelp, setUsedExternalHelp] = useState(false);
  const [initialNote, setInitialNote] = useState("");

  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUrlChange = async (newUrl: string) => {
    setUrl(newUrl);
    setDuplicateWarning(null);

    if (newUrl.trim().length > 10) {
      const parsed = parseProblemUrl(newUrl);
      setPlatform(parsed.platform);
      if (parsed.suggestedTitle && !title) {
        setTitle(parsed.suggestedTitle);
      }
      if (parsed.externalId) {
        setExternalId(parsed.externalId);
      }

      // Check duplicate
      const repo = getDbRepository();
      const existing = await repo.getProblems();
      const duplicate = existing.find(
        (p) =>
          p.url.toLowerCase() === newUrl.trim().toLowerCase() ||
          (parsed.externalId && p.external_id === parsed.externalId && p.platform === parsed.platform)
      );
      if (duplicate) {
        setDuplicateWarning(`Warning: "${duplicate.title}" already exists in your vault.`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    setIsSubmitting(true);
    try {
      const repo = getDbRepository();
      const slug = slugify(title);

      const created = await repo.createProblem({
        title: title.trim(),
        slug,
        platform,
        external_id: externalId || undefined,
        url: url.trim(),
        difficulty,
        status,
        confidence_rating: confidence,
        is_bookmarked: isBookmarked,
        viewed_editorial: viewedEditorial,
        used_external_help: usedExternalHelp,
        time_spent_minutes: Number(timeSpent) || 0,
        programming_language: language,
        primary_topic: primaryTopic,
        subtopic: subtopic || undefined,
      });

      // If initial note supplied, save to learning notes
      if (initialNote.trim()) {
        await repo.saveLearningNotes({
          problem_id: created.id,
          understanding_summary: initialNote.trim(),
        });
      }

      // Reset form
      setUrl("");
      setTitle("");
      setExternalId("");
      setInitialNote("");
      setDuplicateWarning(null);

      onClose();
      if (onProblemAdded) onProblemAdded();
      router.push(`/problems/${created.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Capture Problem"
      description="Paste any problem URL to auto-detect platform and pre-fill metadata, or log manually."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* URL Input */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-neutral-400" />
            Problem URL
          </label>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="e.g. https://leetcode.com/problems/two-sum/ or https://codeforces.com/contest/158/problem/A"
            className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
          />
          {duplicateWarning && (
            <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {duplicateWarning}
            </p>
          )}
        </div>

        {/* Title & Platform */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Problem Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Trapping Rain Water"
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as PlatformType)}
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-white/30"
            >
              <option value="LeetCode">LeetCode</option>
              <option value="Codeforces">Codeforces</option>
              <option value="CodeChef">CodeChef</option>
              <option value="AtCoder">AtCoder</option>
              <option value="HackerRank">HackerRank</option>
              <option value="GeeksforGeeks">GeeksforGeeks</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Difficulty, Status & Topic */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Current Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProblemStatus)}
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
            >
              <option value="Solved Independently">Solved Independently</option>
              <option value="Solved With Hint">Solved With Hint</option>
              <option value="Needs Revision">Needs Revision</option>
              <option value="Attempted">Attempted</option>
              <option value="Not Started">Not Started</option>
              <option value="Mastered">Mastered</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Primary Topic
            </label>
            <select
              value={primaryTopic}
              onChange={(e) => setPrimaryTopic(e.target.value)}
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
            >
              <option value="Arrays">Arrays</option>
              <option value="Strings">Strings</option>
              <option value="Two Pointers">Two Pointers</option>
              <option value="Sliding Window">Sliding Window</option>
              <option value="Prefix Sum">Prefix Sum</option>
              <option value="Binary Search">Binary Search</option>
              <option value="Binary Search on Answers">Binary Search on Answers</option>
              <option value="Linked Lists">Linked Lists</option>
              <option value="Fast & Slow Pointers">Fast & Slow Pointers</option>
              <option value="Stacks & Monotonic Stack">Stacks & Monotonic Stack</option>
              <option value="Binary Trees">Binary Trees</option>
              <option value="Binary Search Trees">Binary Search Trees</option>
              <option value="Heaps & Priority Queues">Heaps & Priority Queues</option>
              <option value="Graphs">Graphs</option>
              <option value="Dynamic Programming">Dynamic Programming</option>
              <option value="Bit Manipulation">Bit Manipulation</option>
            </select>
          </div>
        </div>

        {/* Confidence, Time Spent & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              Confidence (1-5)
            </label>
            <div className="flex items-center gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setConfidence(star)}
                  className={`p-1 text-sm rounded ${
                    confidence >= star ? "text-amber-400" : "text-neutral-600"
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="text-xs text-neutral-400 ml-1 font-mono">({confidence}/5)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              Time Spent (min)
            </label>
            <input
              type="number"
              min={0}
              max={600}
              value={timeSpent}
              onChange={(e) => setTimeSpent(Number(e.target.value))}
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1">
              <Code className="w-3.5 h-3.5 text-neutral-400" />
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
            >
              <option value="C++">C++</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="TypeScript">TypeScript</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Go">Go</option>
              <option value="Rust">Rust</option>
            </select>
          </div>
        </div>

        {/* Learning flags */}
        <div className="flex flex-wrap gap-4 pt-1 border-t border-[#232323]">
          <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={viewedEditorial}
              onChange={(e) => setViewedEditorial(e.target.checked)}
              className="rounded bg-[#181818] border-[#262626] text-white focus:ring-0"
            />
            Viewed Editorial
          </label>

          <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={usedExternalHelp}
              onChange={(e) => setUsedExternalHelp(e.target.checked)}
              className="rounded bg-[#181818] border-[#262626] text-white focus:ring-0"
            />
            Used External Help
          </label>

          <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isBookmarked}
              onChange={(e) => setIsBookmarked(e.target.checked)}
              className="rounded bg-[#181818] border-[#262626] text-white focus:ring-0"
            />
            Bookmark for Revision
          </label>
        </div>

        {/* Initial Understanding Note */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
            Quick Learning Note / First Thought
          </label>
          <textarea
            rows={2}
            value={initialNote}
            onChange={(e) => setInitialNote(e.target.value)}
            placeholder="What was the main idea or trick? (You can detail full Brute/Optimal approaches in the journal)."
            className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#232323]">
          <Button type="button" variant="outline" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !title.trim()}
            className="bg-white hover:bg-neutral-200 text-neutral-950 font-semibold shadow-sm"
          >
            {isSubmitting ? "Saving..." : "Save to Vault & Journal"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
