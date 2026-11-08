"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  Layers,
  Sparkles,
  PieChart as PieIcon,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { HeatmapCalendar } from "@/components/analytics/HeatmapCalendar";
import { DifficultyPieChart } from "@/components/analytics/DifficultyPieChart";
import { TopicBarChart } from "@/components/analytics/TopicBarChart";
import { ConfidenceDistributionChart } from "@/components/analytics/ConfidenceDistributionChart";
import { serializeBackupJson, generateProblemsCsv } from "@/services/exportService";
import { getDbRepository } from "@/lib/db/repository";
import type { Problem, TopicMastery, UserActivity, OverallStats } from "@/types";

export default function AnalyticsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [masteryList, setMasteryList] = useState<TopicMastery[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const repo = getDbRepository();
      const p = await repo.getProblems();
      const m = await repo.getTopicMastery();
      const a = await repo.getUserActivity();
      const s = await repo.getOverallStats();

      setProblems(p);
      setMasteryList(m);
      setActivities(a);
      setStats(s);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleExportJson = async () => {
    const repo = getDbRepository();
    const jsonStr = await repo.exportFullJson();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `algoatlas-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const csvStr = generateProblemsCsv(problems);
    const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `algoatlas-problems-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const easyCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardCount = problems.filter((p) => p.difficulty === "Hard").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Portability Export Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-brand-400" />
            Analytics & Reports
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real metrics calculated from your database records. Measure true problem-solving mastery and habit consistency.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="text-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            size="sm"
            onClick={handleExportJson}
            className="bg-brand-600 hover:bg-brand-500 text-xs flex items-center gap-1.5 shadow-sm shadow-brand-600/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Full JSON Backup</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#12141e] border border-[#1e2333]">
          <span className="text-xs text-gray-400">Total Problems</span>
          <span className="text-2xl font-bold text-white mt-1 block font-mono">
            {stats?.total_problems || 0}
          </span>
          <span className="text-[10px] text-gray-500">In central vault</span>
        </div>

        <div className="p-4 rounded-xl bg-[#12141e] border border-[#1e2333]">
          <span className="text-xs text-emerald-300">Independent Solves</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block font-mono">
            {stats?.independently_solved || 0}
          </span>
          <span className="text-[10px] text-gray-500">No hints or editorial</span>
        </div>

        <div className="p-4 rounded-xl bg-[#12141e] border border-[#1e2333]">
          <span className="text-xs text-amber-300">Solved With Hints</span>
          <span className="text-2xl font-bold text-amber-400 mt-1 block font-mono">
            {stats?.solved_with_hint || 0}
          </span>
          <span className="text-[10px] text-gray-500">Target for recall</span>
        </div>

        <div className="p-4 rounded-xl bg-[#12141e] border border-[#1e2333]">
          <span className="text-xs text-brand-300">Practice Time</span>
          <span className="text-2xl font-bold text-brand-400 mt-1 block font-mono">
            {Math.round((stats?.total_practice_time_minutes || 0) / 60)}h
          </span>
          <span className="text-[10px] text-gray-500">Deliberate problem solving</span>
        </div>
      </div>

      {/* Heatmap Contribution Calendar */}
      <Card className="border-[#1f2433] bg-[#12141e]">
        <CardContent className="p-5">
          <HeatmapCalendar activities={activities} />
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Difficulty Distribution */}
        <Card className="border-[#1f2433] bg-[#12141e]">
          <CardHeader className="py-4 px-5 border-b border-[#1f2433]">
            <CardTitle className="text-sm flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              Difficulty Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <DifficultyPieChart
              easyCount={easyCount}
              mediumCount={mediumCount}
              hardCount={hardCount}
            />
          </CardContent>
        </Card>

        {/* Topic Breakdown Bar Chart */}
        <Card className="border-[#1f2433] bg-[#12141e]">
          <CardHeader className="py-4 px-5 border-b border-[#1f2433]">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              Topic Problem Solves
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <TopicBarChart masteryList={masteryList} />
          </CardContent>
        </Card>

        {/* Confidence Rating Bar Chart */}
        <Card className="border-[#1f2433] bg-[#12141e]">
          <CardHeader className="py-4 px-5 border-b border-[#1f2433]">
            <CardTitle className="text-sm flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              Confidence Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ConfidenceDistributionChart problems={problems} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
