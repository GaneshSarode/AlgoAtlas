"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderCode,
  Plus,
  BookOpen,
  BrainCircuit,
  Map as MapIcon,
  Repeat,
  Sparkles,
  Trophy,
  BarChart3,
  Globe2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getDbRepository } from "@/lib/db/repository";

export interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onOpenAddModal: () => void;
}

interface NavSection {
  title?: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeVariant?: "brand" | "danger" | "warning";
  }[];
}

export function Sidebar({ isMobileOpen = false, onMobileClose, onOpenAddModal }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const repo = getDbRepository();
      const revisions = await repo.getRevisionItems();
      const overdue = revisions.filter((r) => r.is_overdue).length;
      setOverdueCount(overdue);
    }
    loadStats();
  }, [pathname]);

  const navSections: NavSection[] = [
    {
      items: [
        { label: "Dashboard", href: "/", icon: LayoutDashboard },
        { label: "Central Vault", href: "/problems", icon: FolderCode },
        { label: "Learning Journal", href: "/problems/journal", icon: BookOpen },
      ],
    },
    {
      title: "KNOWLEDGE & MASTERY",
      items: [
        { label: "Concept Vault", href: "/concepts", icon: BrainCircuit },
        { label: "DSA Roadmaps", href: "/roadmaps", icon: MapIcon },
        {
          label: "Revision Centre",
          href: "/revision",
          icon: Repeat,
          badge: overdueCount > 0 ? `${overdueCount}` : undefined,
          badgeVariant: "danger",
        },
        {
          label: "Next to Learn",
          href: "/recommendations",
          icon: Sparkles,
          badgeVariant: "brand",
        },
      ],
    },
    {
      title: "ANALYTICS & SYNC",
      items: [
        { label: "Contest Tracker", href: "/contests", icon: Trophy },
        { label: "Analytics & Reports", href: "/analytics", icon: BarChart3 },
        { label: "Integrations & APIs", href: "/integrations", icon: Globe2 },
        { label: "Settings", href: "/settings", icon: Settings },
      ],
    },
  ];

  const content = (
    <div
      className={cn(
        "flex flex-col h-full bg-[#111111] border-r border-[#222222] transition-all duration-200 select-none",
        isCollapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-14 px-3.5 border-b border-[#222222]">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden group">
          <div className="w-7 h-7 rounded-md bg-neutral-900 border border-white/[0.12] flex items-center justify-center text-neutral-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] group-hover:border-white/[0.2] transition-colors shrink-0">
            <Terminal className="w-3.5 h-3.5 text-neutral-200" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col text-left">
              <span className="font-semibold text-xs tracking-tight text-white leading-none">
                AlgoAtlas
              </span>
              <span className="text-[10px] text-neutral-500 font-mono tracking-tight mt-0.5">
                v1.0 • prod
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1 rounded-md text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.04] transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Quick Problem Capture Button */}
      <div className="p-2.5 border-b border-[#222222]">
        <button
          onClick={onOpenAddModal}
          className={cn(
            "w-full flex items-center justify-center gap-1.5 rounded-lg bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-xs py-1.5 px-3 transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.7)] active:scale-[0.98]",
            isCollapsed && "p-1.5"
          )}
          title="Add New Problem"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
          {!isCollapsed && <span>Add Problem</span>}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-2.5 px-2 space-y-4">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-0.5">
            {!isCollapsed && section.title && (
              <div className="px-2.5 pt-2 pb-1 text-[10px] font-mono font-medium text-zinc-500 tracking-wider">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onMobileClose && onMobileClose()}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all relative group",
                    isActive
                      ? "bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]",
                    isCollapsed && "justify-center px-0"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  {/* Subtle active left bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-white/80 rounded-r" />
                  )}
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"
                    )}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                  {!isCollapsed && item.badge && (
                    <span
                      className={cn(
                        "ml-auto text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full border",
                        item.badgeVariant === "danger"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          : "bg-neutral-800 text-neutral-300 border-neutral-700"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Status Profile Info */}
      <div className="p-2.5 border-t border-[#222222] bg-[#0d0d0d]">
        <div className={cn("flex items-center gap-2.5 px-1 py-0.5", isCollapsed && "justify-center")}>
          <div className="w-6 h-6 rounded-md bg-neutral-800 border border-white/[0.08] flex items-center justify-center text-[10px] font-mono text-neutral-300 shrink-0">
            <Activity className="w-3 h-3 text-emerald-400" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden text-left leading-none">
              <span className="text-[11px] font-medium text-neutral-300 truncate">Workspace Active</span>
              <span className="text-[10px] font-mono text-neutral-500 mt-1">Dual-Mode Ready</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block h-screen sticky top-0 shrink-0 z-30">
        {content}
      </aside>

      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />
          <div className="relative z-50 h-full w-[240px] shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
