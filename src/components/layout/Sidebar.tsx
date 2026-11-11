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

interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: "brand" | "danger" | "warning";
}

interface NavSection {
  title: string;
  items: NavItem[];
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
      title: "WORKSPACE",
      items: [
        { label: "Dashboard", href: "/", icon: LayoutDashboard },
        { label: "Central Vault", href: "/problems", icon: FolderCode },
        {
          label: "Add Problem",
          onClick: onOpenAddModal,
          icon: Plus,
        },
      ],
    },
    {
      title: "LEARNING",
      items: [
        { label: "Learning Journal", href: "/problems/journal", icon: BookOpen },
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
        },
      ],
    },
    {
      title: "PERFORMANCE",
      items: [
        { label: "Contest Tracker", href: "/contests", icon: Trophy },
        { label: "Analytics", href: "/analytics", icon: BarChart3 },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { label: "Integrations", href: "/integrations", icon: Globe2 },
        { label: "Settings", href: "/settings", icon: Settings },
      ],
    },
  ];

  const content = (
    <div
      className={cn(
        "flex flex-col h-full bg-surface-base border-r border-border-default transition-all duration-200 select-none",
        isCollapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-14 px-3.5 border-b border-border-subtle">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden group">
          <div className="w-7 h-7 rounded-md bg-accent-muted border border-accent-border flex items-center justify-center text-accent shrink-0 shadow-sm transition-colors group-hover:bg-accent/20">
            <Terminal className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col text-left">
              <span className="font-semibold text-xs tracking-tight text-foreground leading-none">
                AlgoAtlas
              </span>
              <span className="text-[10px] text-neutral-400 font-mono tracking-tight mt-0.5">
                v1.0 • prod
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1 rounded-md text-neutral-400 hover:text-foreground hover:bg-surface-hover transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-2.5 px-2 space-y-3.5">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-0.5">
            {!isCollapsed && (
              <div className="px-2.5 pt-1.5 pb-1 text-[10px] font-mono font-medium text-neutral-400 tracking-wider">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : item.href
                  ? pathname === item.href || pathname.startsWith(item.href + "/")
                  : false;

              const elementContent = (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-accent rounded-r" />
                  )}
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive
                        ? "text-accent"
                        : "text-neutral-400 group-hover:text-foreground"
                    )}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                  {!isCollapsed && item.badge && (
                    <span
                      className={cn(
                        "ml-auto text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full border",
                        item.badgeVariant === "danger"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          : "bg-surface-overlay text-foreground border-border-default"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              );

              const itemClass = cn(
                "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all relative group w-full text-left",
                isActive
                  ? "bg-accent-muted text-foreground font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                  : "text-neutral-400 hover:text-foreground hover:bg-surface-hover",
                isCollapsed && "justify-center px-0"
              );

              if (item.onClick) {
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (onMobileClose) onMobileClose();
                      item.onClick!();
                    }}
                    className={itemClass}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {elementContent}
                  </button>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={() => onMobileClose && onMobileClose()}
                  className={itemClass}
                  title={isCollapsed ? item.label : undefined}
                >
                  {elementContent}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Status / Profile Info */}
      <div className="p-3 border-t border-border-subtle bg-surface-base">
        <div className={cn("flex items-center gap-2.5", isCollapsed && "justify-center")}>
          <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col text-left leading-none min-w-0">
              <span className="text-[11px] font-medium text-foreground truncate">Workspace Active</span>
              <span className="text-[10px] font-mono text-neutral-400 mt-1">Dual-Mode Ready</span>
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
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
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
