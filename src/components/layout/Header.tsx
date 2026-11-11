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
  ChevronRight,
  ExternalLink,
  LayoutDashboard,
  FolderCode,
  BookOpen,
  BrainCircuit,
  Map as MapIcon,
  Repeat,
  Sparkles,
  Trophy,
  BarChart3,
  Globe2,
  Settings,
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
    // Check saved theme from localStorage
    try {
      const savedTheme = localStorage.getItem("algoatlas-theme") as "dark" | "light" | null;
      if (savedTheme) {
        setTheme(savedTheme);
      } else if (document.documentElement.classList.contains("light")) {
        setTheme("light");
      }
    } catch (e) {
      // ignore
    }

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
  }, [pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("algoatlas-theme", nextTheme);
    } catch (e) {
      // ignore
    }
    if (nextTheme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
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

  const navigationShortcuts = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Central Vault", href: "/problems", icon: FolderCode },
    { label: "Learning Journal", href: "/problems/journal", icon: BookOpen },
    { label: "Concept Vault", href: "/concepts", icon: BrainCircuit },
    { label: "DSA Roadmaps", href: "/roadmaps", icon: MapIcon },
    { label: "Revision Centre", href: "/revision", icon: Repeat },
    { label: "Next to Learn", href: "/recommendations", icon: Sparkles },
    { label: "Contest Tracker", href: "/contests", icon: Trophy },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Integrations", href: "/integrations", icon: Globe2 },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const getBreadcrumbTitle = () => {
    if (pathname === "/") return "Dashboard";
    if (pathname.startsWith("/problems/journal")) return "Learning Journal";
    if (pathname.startsWith("/problems")) return "Central Vault";
    if (pathname.startsWith("/concepts")) return "Concept Vault";
    if (pathname.startsWith("/roadmaps")) return "DSA Roadmaps";
    if (pathname.startsWith("/revision")) return "Revision Centre";
    if (pathname.startsWith("/recommendations")) return "Next to Learn";
    if (pathname.startsWith("/contests")) return "Contest Tracker";
    if (pathname.startsWith("/analytics")) return "Analytics";
    if (pathname.startsWith("/integrations")) return "Integrations";
    if (pathname.startsWith("/settings")) return "Settings";
    return "AlgoAtlas";
  };

  return (
    <>
      <header className="h-14 border-b border-border-default bg-surface-base/90 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileOpen}
            className="md:hidden p-1.5 rounded-md text-neutral-400 hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Breadcrumb Navigation */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
            <span
              className="text-neutral-400 hover:text-foreground cursor-pointer transition-colors"
              onClick={() => router.push("/")}
            >
              AlgoAtlas
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-foreground font-semibold">{getBreadcrumbTitle()}</span>
          </div>

          {/* Command Palette Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-raised border border-border-default text-neutral-400 hover:text-foreground hover:border-border-strong text-xs transition-all w-44 sm:w-64 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate text-xs">Search or jump to...</span>
            <span className="ml-auto flex items-center gap-0.5 text-[10px] text-neutral-400 bg-surface-overlay border border-border-subtle px-1.5 py-0.5 rounded font-mono leading-none">
              <Command className="w-2.5 h-2.5" />K
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Daily Streak Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-raised border border-border-default text-foreground text-xs font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-amber-400">{streakCount}d</span>
            <span className="hidden md:inline text-neutral-400 text-[11px]">streak</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-foreground hover:bg-surface-hover border border-border-subtle transition-all"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Add Problem CTA */}
          <Button
            onClick={onOpenAddModal}
            size="sm"
            className="hidden sm:inline-flex gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Problem</span>
          </Button>
        </div>
      </header>

      {/* Global Command Palette / Raycast Search Dialog */}
      <Dialog
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery("");
        }}
        title="Command Palette"
        description="Search problems in your vault or jump directly to any workspace section."
        maxWidth="xl"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search problems, topics, algorithms or jump to section..."
              autoFocus
              className="w-full bg-surface-raised border border-border-default rounded-lg pl-9 pr-3 py-2 text-xs text-foreground placeholder-neutral-500 focus:outline-none focus:border-accent"
            />
          </div>

          {/* Search Results if query exists */}
          {searchQuery.trim() ? (
            <div className="max-h-72 overflow-y-auto space-y-1">
              <span className="text-[10px] font-mono font-medium text-neutral-400 tracking-wider block px-1 pb-1">
                PROBLEM VAULT MATCHES
              </span>
              {searchResults.length > 0 ? (
                searchResults.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                      router.push(`/problems/${p.id}`);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-surface-raised hover:bg-surface-hover border border-border-subtle cursor-pointer transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-foreground">{p.title}</span>
                      <span className="text-[11px] text-neutral-400">
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
                      <ExternalLink className="w-3 h-3 text-neutral-400" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-neutral-400">
                  No problems found matching "{searchQuery}".
                </div>
              )}
            </div>
          ) : (
            /* Quick Navigation & Quick Actions when no search query */
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono font-medium text-neutral-400 tracking-wider block px-1 pb-1.5">
                  QUICK NAVIGATION
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {navigationShortcuts.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.href}
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push(item.href);
                        }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-surface-raised hover:bg-surface-hover border border-border-subtle text-xs text-neutral-300 hover:text-foreground text-left transition-colors"
                      >
                        <Icon className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-border-subtle">
                <span className="text-[10px] font-mono font-medium text-neutral-400 tracking-wider block px-1 pb-1.5">
                  QUICK ACTIONS
                </span>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      onOpenAddModal();
                    }}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-raised hover:bg-surface-hover border border-border-subtle text-xs text-foreground text-left transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+ Log New Problem to Vault</span>
                  </button>
                  <button
                    onClick={() => {
                      toggleTheme();
                    }}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-raised hover:bg-surface-hover border border-border-subtle text-xs text-foreground text-left transition-colors"
                  >
                    {theme === "dark" ? (
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-blue-400" />
                    )}
                    <span>Switch Theme ({theme === "dark" ? "Light" : "Dark"} Mode)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}
