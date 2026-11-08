"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Map as MapIcon,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { RoadmapProgressBar } from "@/components/roadmaps/RoadmapProgressBar";
import { RoadmapItemRow } from "@/components/roadmaps/RoadmapItemRow";
import { ROADMAP_METADATA, ROADMAP_SECTIONS_NEETCODE } from "@/services/roadmapData";
import { getDbRepository } from "@/lib/db/repository";
import { slugify } from "@/lib/utils";
import type { Roadmap, RoadmapItem, Problem } from "@/types";

export default function RoadmapDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const metadata = ROADMAP_METADATA.find((r) => r.slug === slug) || {
    id: `rm-${slug}`,
    title: slug.replace(/-/g, " ").toUpperCase(),
    slug,
    description: "Curated problem roadmap.",
    is_system: true,
    is_active: false,
    total_problems: 150,
  };

  const [sections, setSections] = useState<Record<string, RoadmapItem[]>>({});
  const [completedMap, setCompletedMap] = useState<Map<string, boolean>>(new Map());
  const [vaultProblems, setVaultProblems] = useState<Problem[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadRoadmapData = async () => {
    setIsLoading(true);
    const repo = getDbRepository();
    const problems = await repo.getProblems();
    setVaultProblems(problems);

    // Map section data
    const rawSections = ROADMAP_SECTIONS_NEETCODE;
    const mapped: Record<string, RoadmapItem[]> = {};

    Object.entries(rawSections).forEach(([secName, items]) => {
      mapped[secName] = items.map((item) => ({
        ...item,
        roadmap_id: metadata.id,
      }));
    });
    setSections(mapped);

    // Cross-roadmap check: if problem title or external_id exists in vault and is solved, it's completed
    const cMap = new Map<string, boolean>();
    Object.values(mapped).flat().forEach((item) => {
      const match = problems.find(
        (p) =>
          (p.title.toLowerCase() === item.title.toLowerCase() ||
            (p.external_id && p.external_id === item.external_id)) &&
          (p.status.includes("Solved") || p.status === "Mastered")
      );
      cMap.set(item.id, Boolean(match));
    });
    setCompletedMap(cMap);
    setIsLoading(false);
  };

  useEffect(() => {
    loadRoadmapData();
  }, [slug]);

  const handleToggleItem = async (item: RoadmapItem, completed: boolean) => {
    const nextMap = new Map(completedMap);
    nextMap.set(item.id, completed);
    setCompletedMap(nextMap);

    const repo = getDbRepository();
    await repo.toggleRoadmapItem(item.id, completed);

    // If marked completed and not in vault, auto-create in vault or update status
    const existing = vaultProblems.find(
      (p) =>
        p.title.toLowerCase() === item.title.toLowerCase() ||
        (p.external_id && p.external_id === item.external_id)
    );

    if (existing) {
      await repo.updateProblem(existing.id, {
        status: completed ? "Solved Independently" : "Attempted",
      });
    } else if (completed) {
      await repo.createProblem({
        title: item.title,
        slug: slugify(item.title),
        platform: item.platform,
        external_id: item.external_id,
        url: item.external_url,
        difficulty: item.difficulty,
        status: "Solved Independently",
        confidence_rating: 4,
        is_bookmarked: false,
        viewed_editorial: false,
        used_external_help: false,
        time_spent_minutes: 30,
        programming_language: "C++",
        primary_topic: item.section_name,
      });
    }
  };

  const handleQuickAddToVault = async (item: RoadmapItem) => {
    const repo = getDbRepository();
    const created = await repo.createProblem({
      title: item.title,
      slug: slugify(item.title),
      platform: item.platform,
      external_id: item.external_id,
      url: item.external_url,
      difficulty: item.difficulty,
      status: "Not Started",
      confidence_rating: 3,
      is_bookmarked: false,
      viewed_editorial: false,
      used_external_help: false,
      time_spent_minutes: 0,
      programming_language: "C++",
      primary_topic: item.section_name,
    });
    router.push(`/problems/${created.id}`);
  };

  const toggleSection = (sec: string) => {
    setCollapsedSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const allItems = Object.values(sections).flat();
  const completedCount = Array.from(completedMap.values()).filter(Boolean).length;
  const easyCount = allItems.filter(
    (i) => i.difficulty === "Easy" && completedMap.get(i.id)
  ).length;
  const mediumCount = allItems.filter(
    (i) => i.difficulty === "Medium" && completedMap.get(i.id)
  ).length;
  const hardCount = allItems.filter(
    (i) => i.difficulty === "Hard" && completedMap.get(i.id)
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Back */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/roadmaps"
            className="p-2 rounded-lg bg-[#181b26] border border-[#272e42] text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <MapIcon className="w-6 h-6 text-brand-400" />
              {metadata.title}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">{metadata.description}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar Card */}
      <div className="p-5 rounded-xl bg-[#12141e] border border-[#1f2433]">
        <RoadmapProgressBar
          completed={completedCount}
          total={allItems.length || metadata.total_problems}
          easyCount={easyCount}
          mediumCount={mediumCount}
          hardCount={hardCount}
        />
      </div>

      {/* Sections & Items */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
          Loading roadmap sheet...
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(sections).map(([secName, items]) => {
            const isCollapsed = collapsedSections[secName];
            const secCompleted = items.filter((i) => completedMap.get(i.id)).length;

            return (
              <div
                key={secName}
                className="rounded-xl border border-[#1f2433] bg-[#12141d] overflow-hidden"
              >
                <div
                  onClick={() => toggleSection(secName)}
                  className="flex items-center justify-between p-4 bg-[#161a26] cursor-pointer hover:bg-[#1a1f2e] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-semibold text-white">{secName}</h3>
                    <span className="text-xs text-gray-400 font-mono">
                      ({secCompleted} / {items.length})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {secCompleted === items.length && items.length > 0 && (
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                        ✓ Section Completed
                      </span>
                    )}
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {!isCollapsed && (
                  <div className="p-4 space-y-2">
                    {items.map((item) => {
                      const vaultProb = vaultProblems.find(
                        (p) =>
                          p.title.toLowerCase() === item.title.toLowerCase() ||
                          (p.external_id && p.external_id === item.external_id)
                      );

                      return (
                        <RoadmapItemRow
                          key={item.id}
                          item={item}
                          isCompleted={Boolean(completedMap.get(item.id))}
                          vaultProblem={vaultProb}
                          onToggle={(val) => handleToggleItem(item, val)}
                          onQuickAddToVault={handleQuickAddToVault}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
