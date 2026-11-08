"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Repeat,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Sparkles,
  Play,
} from "lucide-react";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { RevisionQueueCard } from "@/components/revision/RevisionQueueCard";
import { partitionRevisions } from "@/services/revisionEngine";
import { getDbRepository } from "@/lib/db/repository";
import type { RevisionItem } from "@/types";

export default function RevisionCentrePage() {
  const [activeTab, setActiveTab] = useState<"today" | "overdue" | "upcoming" | "mastered">("today");
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const repo = getDbRepository();
      const items = await repo.getRevisionItems();
      setRevisions(items);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const { todayQueue, overdueQueue, upcomingQueue, masteredQueue } = partitionRevisions(revisions);

  // If there are overdue items and today is empty, default tab to overdue
  useEffect(() => {
    if (overdueQueue.length > 0 && todayQueue.length === 0) {
      setActiveTab("overdue");
    }
  }, [overdueQueue.length, todayQueue.length]);

  return (
    <div className="space-y-6">
      {/* Title & Start Practice Session */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Repeat className="w-6 h-6 text-brand-400" />
            Spaced Repetition Revision Centre
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Scientifically spaced intervals (1d → 3d → 7d → 14d → 30d) designed to eliminate pattern decay and build long-term muscle memory.
          </p>
        </div>

        {(todayQueue.length > 0 || overdueQueue.length > 0) && (
          <Link
            href={`/revision/practice?problemId=${(overdueQueue[0] || todayQueue[0])?.problem_id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors shadow-sm shadow-brand-600/30"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Revision Session ({overdueQueue.length + todayQueue.length} Due)</span>
          </Link>
        )}
      </div>

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setActiveTab("overdue")}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === "overdue"
              ? "bg-[#1f1318] border-rose-600 shadow-md shadow-rose-950/40"
              : "bg-[#141217] border-rose-900/40 hover:border-rose-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-300 font-medium">Overdue</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl font-bold text-rose-400 mt-2 block font-mono">
            {overdueQueue.length}
          </span>
          <span className="text-[10px] text-rose-400/80">Immediate attention needed</span>
        </div>

        <div
          onClick={() => setActiveTab("today")}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === "today"
              ? "bg-[#1a1c2b] border-brand-500 shadow-md shadow-brand-950/40"
              : "bg-[#12141e] border-[#1e2333] hover:border-[#2f3852]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-300 font-medium">Due Today</span>
            <Repeat className="w-4 h-4 text-brand-400" />
          </div>
          <span className="text-2xl font-bold text-white mt-2 block font-mono">
            {todayQueue.length}
          </span>
          <span className="text-[10px] text-gray-400">Scheduled for today</span>
        </div>

        <div
          onClick={() => setActiveTab("upcoming")}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === "upcoming"
              ? "bg-[#1a1c2b] border-indigo-500 shadow-md"
              : "bg-[#12141e] border-[#1e2333] hover:border-[#2f3852]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-indigo-300 font-medium">Upcoming</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl font-bold text-gray-200 mt-2 block font-mono">
            {upcomingQueue.length}
          </span>
          <span className="text-[10px] text-gray-400">Scheduled later</span>
        </div>

        <div
          onClick={() => setActiveTab("mastered")}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === "mastered"
              ? "bg-[#111c18] border-emerald-500 shadow-md"
              : "bg-[#12141e] border-[#1e2333] hover:border-[#2f3852]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-300 font-medium">Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold text-emerald-400 mt-2 block font-mono">
            {masteredQueue.length}
          </span>
          <span className="text-[10px] text-gray-400">Long-term memory</span>
        </div>
      </div>

      {/* Active Tab View */}
      <div className="space-y-4">
        {activeTab === "overdue" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Overdue Revisions ({overdueQueue.length})
              </h2>
            </div>
            {overdueQueue.length === 0 ? (
              <div className="text-center py-12 bg-[#12141d] rounded-xl border border-[#1f2433] text-xs text-emerald-400 flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <span>Zero overdue revisions! You are completely up to date.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {overdueQueue.map((item) => (
                  <RevisionQueueCard key={item.id} item={item} isOverdue={true} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "today" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Repeat className="w-4 h-4 text-brand-400" /> Today's Revision Queue ({todayQueue.length})
              </h2>
            </div>
            {todayQueue.length === 0 ? (
              <div className="text-center py-12 bg-[#12141d] rounded-xl border border-[#1f2433] text-xs text-gray-400 flex flex-col items-center gap-2">
                <Sparkles className="w-8 h-8 text-brand-400" />
                <span>No problems scheduled specifically for today. Check upcoming or overdue tabs.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {todayQueue.map((item) => (
                  <RevisionQueueCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "upcoming" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-indigo-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-400" /> Upcoming Revisions ({upcomingQueue.length})
              </h2>
            </div>
            {upcomingQueue.length === 0 ? (
              <div className="text-center py-12 bg-[#12141d] rounded-xl border border-[#1f2433] text-xs text-gray-400">
                No upcoming revisions scheduled.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {upcomingQueue.map((item) => (
                  <RevisionQueueCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "mastered" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Mastered Concepts ({masteredQueue.length})
              </h2>
            </div>
            {masteredQueue.length === 0 ? (
              <div className="text-center py-12 bg-[#12141d] rounded-xl border border-[#1f2433] text-xs text-gray-400">
                No questions marked Mastered yet. Consistent independent recalls will graduate questions here.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {masteredQueue.map((item) => (
                  <RevisionQueueCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
