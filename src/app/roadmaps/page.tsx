"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Map, ArrowRight, CheckCircle2, Star, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { RoadmapProgressBar } from "@/components/roadmaps/RoadmapProgressBar";
import { ROADMAP_METADATA } from "@/services/roadmapData";
import { getDbRepository } from "@/lib/db/repository";
import type { Roadmap, Problem } from "@/types";

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(ROADMAP_METADATA);
  const [activeSlug, setActiveSlug] = useState<string>("neetcode-150");
  const [vaultProblems, setVaultProblems] = useState<Problem[]>([]);
  const [progressData, setProgressData] = useState<Record<string, { completed: number; total: number }>>({});

  useEffect(() => {
    async function load() {
      const repo = getDbRepository();
      const problems = await repo.getProblems();
      setVaultProblems(problems);

      // Compute progress dynamically for each roadmap
      const progress: Record<string, { completed: number; total: number }> = {};
      for (const rm of ROADMAP_METADATA) {
        const progressMap = await repo.getRoadmapProgress(rm.id);
        let completed = 0;
        progressMap.forEach((isDone) => {
          if (isDone) completed++;
        });
        progress[rm.slug] = {
          completed,
          total: rm.total_problems,
        };
      }
      setProgressData(progress);
    }
    load();
  }, []);

  const handleSetActive = (slug: string) => {
    setActiveSlug(slug);
    setRoadmaps((prev) =>
      prev.map((r) => ({ ...r, is_active: r.slug === slug }))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Map className="w-6 h-6 text-brand-400" />
          DSA Learning Roadmaps & Sheets
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Structured pattern roadmaps. Solving a question in any roadmap or in your vault automatically synchronizes completion across all applicable roadmaps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roadmaps.map((rm) => {
          const stats = progressData[rm.slug] || { completed: 0, total: rm.total_problems };
          const isActive = rm.slug === activeSlug;

          return (
            <Card
              key={rm.id}
              className={`bg-[#12141e] border transition-all flex flex-col justify-between ${
                isActive
                  ? "border-brand-500/60 shadow-md shadow-brand-500/10"
                  : "border-[#1e2333] hover:border-[#2f3852]"
              }`}
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    {isActive ? (
                      <Badge variant="purple" className="flex items-center gap-1 w-fit">
                        <Sparkles className="w-3 h-3" /> Active Roadmap
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Curated Sheet</Badge>
                    )}
                    <Link
                      href={`/roadmaps/${rm.slug}`}
                      className="text-base font-semibold text-white hover:text-brand-400 block transition-colors pt-1"
                    >
                      {rm.title}
                    </Link>
                  </div>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                  {rm.description}
                </p>

                {/* Progress bar */}
                <RoadmapProgressBar
                  completed={stats.completed}
                  total={stats.total}
                />

                <div className="flex items-center justify-between pt-3 border-t border-[#1d2235] text-xs">
                  <button
                    onClick={() => handleSetActive(rm.slug)}
                    className={`text-[11px] font-medium transition-colors ${
                      isActive ? "text-brand-400" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {isActive ? "✓ Set as Active" : "Make Active"}
                  </button>

                  <Link
                    href={`/roadmaps/${rm.slug}`}
                    className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-semibold"
                  >
                    View Sheet <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
