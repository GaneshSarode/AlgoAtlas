"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderCode,
  PlusCircle,
  BookOpen,
  BrainCircuit,
  Map,
  Repeat,
  Sparkles,
  Trophy,
  BarChart3,
  Globe2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getDbRepository } from "@/lib/db/repository";

export interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onOpenAddModal: () => void;
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

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "My Problems", href: "/problems", icon: FolderCode },
    { label: "Learning Journal", href: "/problems/journal", icon: BookOpen },
    { label: "Concept Vault", href: "/concepts", icon: BrainCircuit },
    { label: "DSA Roadmap", href: "/roadmaps", icon: Map },
    {
      label: "Revision Centre",
      href: "/revision",
      icon: Repeat,
      badge: overdueCount > 0 ? `${overdueCount}` : undefined,
      badgeColor: "bg-rose-950 text-rose-300 border-rose-800/60",
    },
    {
      label: "What to Learn Next?",
      href: "/recommendations",
      icon: Sparkles,
      highlight: true,
    },
    { label: "Contest Tracker", href: "/contests", icon: Trophy },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Platform Integrations", href: "/integrations", icon: Globe2 },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const content = (
    <div
      className={cn(
        "flex flex-col h-full bg-[#0c0e16] border-r border-[#1a1f2e] transition-all duration-300 select-none",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#1a1f2e]">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-brand-500/20 shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white leading-tight">
                AlgoAtlas
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
                DSA Learning OS
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#161a26] transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Add Problem CTA */}
      <div className="p-3 border-b border-[#1a1f2e]">
        <button
          onClick={onOpenAddModal}
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs py-2 px-3 transition-colors shadow-sm shadow-brand-600/30",
            isCollapsed && "p-2"
          )}
          title="Add New Problem"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>+ Add Problem</span>}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onMobileClose && onMobileClose()}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative",
                isActive
                  ? "bg-[#1d2232] text-white shadow-sm border border-[#2d354d]"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#131622]",
                item.highlight && !isActive && "text-purple-400 hover:text-purple-300",
                isCollapsed && "justify-center px-0"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "text-brand-400" : item.highlight ? "text-purple-400" : "text-gray-400"
                )}
              />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {!isCollapsed && item.badge && (
                <span
                  className={cn(
                    "ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full border",
                    item.badgeColor || "bg-brand-950 text-brand-300 border-brand-800"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Status Profile Info */}
      <div className="p-3 border-t border-[#1a1f2e] bg-[#090b11]">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
            A
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden text-left">
              <span className="text-xs font-semibold text-gray-200 truncate">Atlas Engineer</span>
              <span className="text-[10px] text-emerald-400 font-medium">Daily Streak: 5 Days</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block h-screen sticky top-0 shrink-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <div className="relative z-50 h-full w-64 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
