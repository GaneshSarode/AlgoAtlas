"use client";

import React from "react";
import { Search, LayoutList, LayoutGrid, X, Star } from "lucide-react";
import type { PlatformType, DifficultyLevel, ProblemStatus } from "@/types";

export interface FilterState {
  search: string;
  platform: string;
  difficulty: string;
  status: string;
  topic: string;
  sortBy: string;
  bookmarkedOnly: boolean;
  viewMode: "table" | "cards";
}

export interface ProblemFiltersProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  availableTopics: string[];
}

export function ProblemFilters({
  filters,
  onChange,
  onReset,
  availableTopics,
}: ProblemFiltersProps) {
  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.platform) ||
    Boolean(filters.difficulty) ||
    Boolean(filters.status) ||
    Boolean(filters.topic) ||
    filters.bookmarkedOnly;

  return (
    <div className="bg-[#0c0e14] border border-white/[0.07] rounded-xl p-3 sm:p-4 space-y-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Filter problems by title, topic, platform..."
            className="w-full bg-zinc-900 border border-white/[0.08] rounded-lg pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/80 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Bookmark Toggle */}
          <button
            onClick={() => onChange({ bookmarkedOnly: !filters.bookmarkedOnly })}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
              filters.bookmarkedOnly
                ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                : "bg-zinc-900/60 text-zinc-400 border-white/[0.08] hover:text-white hover:border-white/[0.16]"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filters.bookmarkedOnly ? "fill-amber-400 text-amber-400" : "text-zinc-500"}`} />
            <span>Bookmarked</span>
          </button>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-zinc-900 border border-white/[0.08] rounded-lg p-0.5">
            <button
              onClick={() => onChange({ viewMode: "table" })}
              className={`p-1.5 rounded text-xs transition-all ${
                filters.viewMode === "table"
                  ? "bg-white/[0.12] text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Table View"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChange({ viewMode: "cards" })}
              className={`p-1.5 rounded text-xs transition-all ${
                filters.viewMode === "cards"
                  ? "bg-white/[0.12] text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-white/[0.06]">
        {/* Platform */}
        <select
          value={filters.platform}
          onChange={(e) => onChange({ platform: e.target.value })}
          className="bg-zinc-900 border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="">All Platforms</option>
          <option value="LeetCode">LeetCode</option>
          <option value="Codeforces">Codeforces</option>
          <option value="CodeChef">CodeChef</option>
          <option value="AtCoder">AtCoder</option>
          <option value="HackerRank">HackerRank</option>
          <option value="GeeksforGeeks">GeeksforGeeks</option>
          <option value="Other">Other</option>
        </select>

        {/* Difficulty */}
        <select
          value={filters.difficulty}
          onChange={(e) => onChange({ difficulty: e.target.value })}
          className="bg-zinc-900 border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })}
          className="bg-zinc-900 border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="">All Statuses</option>
          <option value="Solved Independently">Solved Independently</option>
          <option value="Solved With Hint">Solved With Hint</option>
          <option value="Needs Revision">Needs Revision</option>
          <option value="Attempted">Attempted</option>
          <option value="Not Started">Not Started</option>
          <option value="Mastered">Mastered</option>
        </select>

        {/* Topic */}
        <select
          value={filters.topic}
          onChange={(e) => onChange({ topic: e.target.value })}
          className="bg-zinc-900 border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="">All Topics</option>
          {availableTopics.map((top) => (
            <option key={top} value={top}>
              {top}
            </option>
          ))}
        </select>

        {/* Sort By */}
        <select
          value={filters.sortBy}
          onChange={(e) => onChange({ sortBy: e.target.value })}
          className="bg-zinc-900 border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="recent">Recently Added</option>
          <option value="confidence-asc">Lowest Confidence</option>
          <option value="confidence-desc">Highest Confidence</option>
          <option value="difficulty">Difficulty</option>
          <option value="title">Problem Title</option>
        </select>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
          <span>Active filter applied</span>
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <X className="w-3 h-3" /> Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
