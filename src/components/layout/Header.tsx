"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Plus,
  Flame,
  Sun,
  Moon,
  Command,
  ExternalLink,
  ChevronRight,
  Database,
} from "lucide-react";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { getDbRepository } from "@/lib/db/repository";
import { Dialog } from "@/ui/dialog";
import type { Problem } from "@/types";

export interface HeaderProps {
  onMobileOpen: () => void;
  onOpenAddModal: () => void;
}

export function Header({ onMobileOpen, onOpenAddModal }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
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

  const getBreadcrumbTitle = () => {
    if (pathname === "/") return "Dashboard";
    if (pathname.startsWith("/problems/journal")) return "Learning Journal";
    if (pathname.startsWith("/problems")) return "Central Vault";
    if (pathname.startsWith("/concepts")) return "Concept Vault";
    if (pathname.startsWith("/roadmaps")) return "DSA Roadmaps";
    if (pathname.startsWith("/revision")) return "Revision Centre";
    if (pathname.startsWith("/recommendations")) return "Learning Intelligence";
    if (pathname.startsWith("/contests")) return "Contest Tracker";
    if (pathname.startsWith("/analytics")) return "Analytics";
    if (pathname.startsWith("/integrations")) return "Platform Integrations";
    if (pathname.startsWith("/settings")) return "Settings";
    return "AlgoAtlas";
  };

  return (
    <>
      <header className="h-14 border-b border-white/[0.07] bg-[#090b10]/80 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileOpen}
            className="md:hidden p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Breadcrumb Navigation */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <span className="text-zinc-500 hover:text-zinc-300 cursor-pointer" onClick={() => router.push("/")}>
              AlgoAtlas
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-zinc-100 font-semibold">{getBreadcrumbTitle()}</span>
          </div>

          {/* Quick Search trigger button (Raycast / Linear style) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.2 rounded-md bg-zinc-900/90 border border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:border-white/[0.18] text-xs transition-all w-44 sm:w-64 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
          >
            <Search className="w-3 h-3 text-zinc-400 shrink-0" />
            <span className="truncate text-[11px]">Search questions, topics...</span>
            <span className="ml-auto flex items-center gap-0.5 text-[10px] text-zinc-400 bg-zinc-800 border border-white/[0.08] px-1.5 py-0.2 rounded font-mono leading-none">
              <Command className="w-2.5 h-2.5" />K
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Daily Streak Badge */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-900 border border-white/[0.08] text-zinc-300 text-xs font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-amber-300">{streakCount}d</span>
            <span className="hidden md:inline text-zinc-500 text-[11px]">streak</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] border border-transparent transition-all"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Add Problem CTA */}
          <Button
            onClick={onOpenAddModal}
            size="sm"
            className="hidden sm:inline-flex bg-white hover:bg-zinc-200 text-zinc-950 font-semibold shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Problem</span>
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
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search problems, topics, algorithms (e.g. Two Sum, Dynamic Programming)..."
              autoFocus
              className="w-full bg-zinc-900 border border-white/[0.12] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            />
          </div>

          <div className="max-h-72 overflow-y-auto space-y-1">
            {searchResults.length > 0 ? (
              searchResults.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setIsSearchOpen(false);
                    router.push(`/problems/${p.id}`);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-md bg-zinc-900/60 hover:bg-zinc-850 border border-white/[0.04] hover:border-white/[0.1] cursor-pointer transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white">{p.title}</span>
                    <span className="text-[11px] text-zinc-400">
                      {p.platform} • {p.primary_topic || "General"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      dot
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
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </div>
                </div>
              ))
            ) : searchQuery.trim() ? (
              <div className="text-center py-6 text-xs text-zinc-500">
                No matching problems found for "{searchQuery}".
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-zinc-500">
                Start typing to query your problem vault...
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}
