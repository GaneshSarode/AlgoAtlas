"use client";

import React, { useState, useEffect } from "react";
import { Plus, Upload, FolderCode, Sparkles } from "lucide-react";
import { Button } from "@/ui/button";
import { ProblemFilters, FilterState } from "@/components/problems/ProblemFilters";
import { ProblemTable } from "@/components/problems/ProblemTable";
import { ProblemCardList } from "@/components/problems/ProblemCardList";
import { AddProblemModal } from "@/components/problems/AddProblemModal";
import { CsvImportModal } from "@/components/problems/CsvImportModal";
import { getDbRepository } from "@/lib/db/repository";
import type { Problem } from "@/types";

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCsvOpen, setIsCsvOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    platform: "",
    difficulty: "",
    status: "",
    topic: "",
    sortBy: "recent",
    bookmarkedOnly: false,
    viewMode: "table",
  });

  const loadProblems = async () => {
    setIsLoading(true);
    const repo = getDbRepository();
    const all = await repo.getProblems();
    setProblems(all);
    setIsLoading(false);
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const handleToggleBookmark = async (id: string, current: boolean) => {
    const repo = getDbRepository();
    await repo.updateProblem(id, { is_bookmarked: !current });
    loadProblems();
  };

  const handleDeleteProblem = async (id: string) => {
    if (confirm("Are you sure you want to remove this problem and its learning journal?")) {
      const repo = getDbRepository();
      await repo.deleteProblem(id);
      loadProblems();
    }
  };

  const availableTopics = Array.from(
    new Set(problems.map((p) => p.primary_topic).filter(Boolean) as string[])
  ).sort();

  const filteredProblems = problems.filter((p) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchTopic = p.primary_topic?.toLowerCase().includes(q);
      const matchPlatform = p.platform.toLowerCase().includes(q);
      if (!matchTitle && !matchTopic && !matchPlatform) return false;
    }
    if (filters.platform && p.platform !== filters.platform) return false;
    if (filters.difficulty && p.difficulty !== filters.difficulty) return false;
    if (filters.status && p.status !== filters.status) return false;
    if (filters.topic && p.primary_topic !== filters.topic) return false;
    if (filters.bookmarkedOnly && !p.is_bookmarked) return false;
    return true;
  });

  filteredProblems.sort((a, b) => {
    if (filters.sortBy === "confidence-asc") {
      return a.confidence_rating - b.confidence_rating;
    }
    if (filters.sortBy === "confidence-desc") {
      return b.confidence_rating - a.confidence_rating;
    }
    if (filters.sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    if (filters.sortBy === "difficulty") {
      const diffWeight = { Easy: 1, Medium: 2, Hard: 3 };
      return diffWeight[a.difficulty] - diffWeight[b.difficulty];
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-xl bg-[#0c0e14] border border-white/[0.07] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5 font-sans">
            <FolderCode className="w-5 h-5 text-indigo-400" />
            Central Problem Vault
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Store, categorize, and master your DSA problems across all competitive programming platforms.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCsvOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="bg-white hover:bg-zinc-200 text-zinc-950 font-semibold shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Problem</span>
          </Button>
        </div>
      </div>

      {/* Filter Component */}
      <ProblemFilters
        filters={filters}
        onChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
        onReset={() =>
          setFilters({
            search: "",
            platform: "",
            difficulty: "",
            status: "",
            topic: "",
            sortBy: "recent",
            bookmarkedOnly: false,
            viewMode: filters.viewMode,
          })
        }
        availableTopics={availableTopics}
      />

      {/* Counter */}
      <div className="flex items-center justify-between text-xs text-zinc-400 font-mono px-1">
        <span>
          Showing <strong className="text-white font-semibold">{filteredProblems.length}</strong> of{" "}
          <strong className="text-white font-semibold">{problems.length}</strong> questions
        </span>
      </div>

      {/* Problems Content */}
      {filteredProblems.length > 0 ? (
        filters.viewMode === "table" ? (
          <ProblemTable
            problems={filteredProblems}
            onToggleBookmark={handleToggleBookmark}
            onDeleteProblem={handleDeleteProblem}
          />
        ) : (
          <ProblemCardList
            problems={filteredProblems}
            onToggleBookmark={handleToggleBookmark}
            onDeleteProblem={handleDeleteProblem}
          />
        )
      ) : (
        <div className="text-center py-16 bg-[#0c0e14] border border-dashed border-white/[0.08] rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/[0.08] text-zinc-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-sm font-semibold text-white">No problems found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {problems.length === 0
              ? "Your vault is currently empty. Click 'Add Problem' or 'Import CSV' to log your first question."
              : "No problems matched your current filter criteria. Try resetting your filters."}
          </p>
          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="bg-white hover:bg-zinc-200 text-zinc-950 font-semibold mt-1"
          >
            + Add First Problem
          </Button>
        </div>
      )}

      {/* Modals */}
      <AddProblemModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onProblemAdded={loadProblems}
      />
      <CsvImportModal
        isOpen={isCsvOpen}
        onClose={() => setIsCsvOpen(false)}
        onImportDone={loadProblems}
      />
    </div>
  );
}
