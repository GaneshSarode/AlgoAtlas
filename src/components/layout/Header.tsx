"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  Search,
  Plus,
  Flame,
  Sun,
  Moon,
  Command,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { getDbRepository } from "@/lib/db/repository";
import { Dialog } from "@/ui/dialog";
import { useRouter } from "next/navigation";
import type { Problem } from "@/types";

export interface HeaderProps {
  onMobileOpen: () => void;
  onOpenAddModal: () => void;
}

export function Header({ onMobileOpen, onOpenAddModal }: HeaderProps) {
  const router = useRouter();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Problem[]>([]);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      const repo = getDbRepository();
      const stats = await repo.getOverallStats();
      setStreakCount(stats.current_streak);
    }
    loadData();

    // Listen for Ctrl+K or Cmd+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const repo = getDbRepository();
    const problems = await repo.getProblems();
    const q = query.toLowerCase();
    const filtered = problems.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.platform.toLowerCase().includes(q) ||
        p.primary_topic?.toLowerCase().includes(q) ||
        p.difficulty.toLowerCase().includes(q)
    );
    setSearchResults(filtered);
  };

  return (
    <>
      <header className="h-16 border-b border-[#1a1f2e] bg-[#0c0e16]/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileOpen}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1f2e] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick Search trigger button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141724] border border-[#22283a] text-gray-400 hover:text-gray-200 hover:border-[#323b54] text-xs transition-all w-48 sm:w-72"
          >
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">Search problems, topics...</span>
            <span className="ml-auto flex items-center gap-0.5 text-[10px] text-gray-500 bg-[#1c2133] border border-[#2c334d] px-1.5 py-0.5 rounded font-mono">
              <Command className="w-3 h-3" />K
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Streak Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{streakCount} {streakCount === 1 ? "day" : "days"} streak</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#161a26] border border-transparent hover:border-[#22283a] transition-all"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Quick Add Problem CTA */}
          <Button
            onClick={onOpenAddModal}
            size="sm"
            className="bg-brand-600 hover:bg-brand-500 text-white font-medium shadow-sm shadow-brand-600/30"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Problem</span>
          </Button>
        </div>
      </header>

      {/* Global Command Palette / Search Dialog */}
      <Dialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Quick Search"
        description="Search problems, topics, and difficulty levels across your vault."
        maxWidth="xl"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Type to search (e.g. Two Sum, Dynamic Programming, Codeforces)..."
              autoFocus
              className="w-full bg-[#171b28] border border-[#282f45] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="max-h-72 overflow-y-auto space-y-1.5">
            {searchResults.length > 0 ? (
              searchResults.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setIsSearchOpen(false);
                    router.push(`/problems/${p.id}`);
                  }}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#141724] hover:bg-[#1d2235] border border-transparent hover:border-[#2f3852] cursor-pointer transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{p.title}</span>
                    <span className="text-xs text-gray-400">
                      {p.platform} • {p.primary_topic || "General"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        p.difficulty === "Easy"
                          ? "success"
                          : p.difficulty === "Medium"
                          ? "warning"
                          : "danger"
                      }
                    >
                      {p.difficulty}
                    </Badge>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                </div>
              ))
            ) : searchQuery.trim() ? (
              <div className="text-center py-8 text-xs text-gray-400">
                No matching problems found for "{searchQuery}".
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-gray-500">
                Start typing to instantly query your problem vault.
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}
