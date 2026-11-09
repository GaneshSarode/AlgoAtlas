"use client";

import React, { useState } from "react";
import {
  Code,
  Copy,
  Check,
  Trash2,
  Layers,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import type { SolutionApproach, ApproachType } from "@/types";

export interface ApproachesManagerProps {
  approaches: SolutionApproach[];
  onAddApproach: (approach: Omit<SolutionApproach, "id" | "created_at" | "updated_at" | "user_id">) => void;
  onUpdateApproach: (id: string, updates: Partial<SolutionApproach>) => void;
  onDeleteApproach: (id: string) => void;
  problemId: string;
}

export function ApproachesManager({
  approaches,
  onAddApproach,
  onUpdateApproach,
  onDeleteApproach,
  problemId,
}: ApproachesManagerProps) {
  const [activeTab, setActiveTab] = useState<string>(
    approaches[0]?.id || "new"
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateDefault = (type: ApproachType) => {
    const isOptimal = type === "Optimal";
    const isBrute = type === "Brute Force";

    onAddApproach({
      problem_id: problemId,
      approach_type: type,
      title: isOptimal ? "Optimal Linear Solution" : isBrute ? "Brute Force Enumeration" : "Improved Solution",
      intuition: isOptimal
        ? "Key insight that reduces time complexity (e.g. hashmap lookup or two pointers)."
        : "Direct simulation of all possible combinations.",
      algorithm_steps: "1. Initialize variables\n2. Iterate through input\n3. Return result",
      time_complexity: isOptimal ? "O(N)" : isBrute ? "O(N^2)" : "O(N log N)",
      space_complexity: isOptimal ? "O(1)" : "O(N)",
      code: `// ${type} implementation\n`,
      language: "C++",
      tradeoffs: isOptimal ? "Fastest execution, requires careful edge case checks." : "Simple to write, times out on large N.",
    });
  };

  return (
    <Card className="border-[#232323] bg-[#141414]">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b border-[#232323]">
        <CardTitle className="text-sm flex items-center gap-2">
          <Layers className="w-4 h-4 text-neutral-400" />
          3. Multi-Approach Solutions & Code Vault
        </CardTitle>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCreateDefault("Brute Force")}
            className="text-[11px] h-7 px-2 border-[#2a2a2a] text-neutral-300 hover:bg-neutral-850"
          >
            + Brute Force
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCreateDefault("Improved")}
            className="text-[11px] h-7 px-2 border-[#2a2a2a] text-neutral-300 hover:bg-neutral-850"
          >
            + Improved
          </Button>
          <Button
            size="sm"
            onClick={() => handleCreateDefault("Optimal")}
            className="text-[11px] h-7 px-2.5 bg-white hover:bg-neutral-200 text-neutral-950 font-semibold shadow-sm"
          >
            <Sparkles className="w-3 h-3 mr-1" />+ Optimal
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {approaches.length === 0 ? (
          <div className="text-center py-10 bg-[#181818] rounded-lg border border-dashed border-[#262626] space-y-2">
            <Code className="w-8 h-8 text-neutral-500 mx-auto" />
            <p className="text-xs text-neutral-400">
              No solution approaches added yet. Record your Brute Force and Optimal approaches to compare time & space complexities.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCreateDefault("Brute Force")}
                className="border-[#2a2a2a] text-neutral-300"
              >
                Add Brute Force
              </Button>
              <Button
                size="sm"
                className="bg-white hover:bg-neutral-200 text-neutral-950 font-semibold"
                onClick={() => handleCreateDefault("Optimal")}
              >
                Add Optimal
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Approach Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#232323]">
              {approaches.map((appr, idx) => {
                const isActive = (activeTab === appr.id) || (idx === 0 && !approaches.some(a => a.id === activeTab));
                return (
                  <button
                    key={appr.id}
                    onClick={() => setActiveTab(appr.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                      isActive
                        ? "bg-[#242424] text-white border border-[#383838]"
                        : "text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]"
                    }`}
                  >
                    <Badge
                      variant={
                        appr.approach_type === "Optimal"
                          ? "success"
                          : appr.approach_type === "Brute Force"
                          ? "danger"
                          : "default"
                      }
                      className="text-[10px] px-1.5 py-0"
                    >
                      {appr.approach_type}
                    </Badge>
                    <span className="truncate max-w-[120px]">{appr.title || `Approach ${idx + 1}`}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Approach Form */}
            {approaches.map((appr) => {
              const isActive = (activeTab === appr.id) || (approaches[0]?.id === appr.id && !approaches.some(a => a.id === activeTab));
              if (!isActive) return null;

              return (
                <div key={appr.id} className="space-y-4 animate-in fade-in duration-100">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1 w-full sm:w-auto">
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Approach Title
                      </label>
                      <input
                        type="text"
                        value={appr.title}
                        onChange={(e) => onUpdateApproach(appr.id, { title: e.target.value })}
                        className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/30 font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <select
                        value={appr.approach_type}
                        onChange={(e) =>
                          onUpdateApproach(appr.id, { approach_type: e.target.value as ApproachType })
                        }
                        className="bg-[#181818] border border-[#262626] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
                      >
                        <option value="Brute Force">Brute Force</option>
                        <option value="Improved">Improved</option>
                        <option value="Optimal">Optimal</option>
                        <option value="Alternative">Alternative</option>
                      </select>

                      <button
                        onClick={() => onDeleteApproach(appr.id)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        title="Delete this approach"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Intuition & Algorithm Steps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Main Intuition & Key Observation
                      </label>
                      <textarea
                        rows={3}
                        value={appr.intuition}
                        onChange={(e) => onUpdateApproach(appr.id, { intuition: e.target.value })}
                        placeholder="What is the mental model? Why does this approach work?"
                        className="w-full bg-[#181818] border border-[#262626] rounded-lg p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 resize-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Step-by-Step Algorithm
                      </label>
                      <textarea
                        rows={3}
                        value={appr.algorithm_steps}
                        onChange={(e) => onUpdateApproach(appr.id, { algorithm_steps: e.target.value })}
                        placeholder="1. Sort array...\n2. Initialize pointers...\n3. Process elements..."
                        className="w-full bg-[#181818] border border-[#262626] rounded-lg p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Complexities */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Time Complexity
                      </label>
                      <input
                        type="text"
                        value={appr.time_complexity}
                        onChange={(e) => onUpdateApproach(appr.id, { time_complexity: e.target.value })}
                        placeholder="e.g. O(N) or O(N log N)"
                        className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-mono focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Space Complexity
                      </label>
                      <input
                        type="text"
                        value={appr.space_complexity}
                        onChange={(e) => onUpdateApproach(appr.id, { space_complexity: e.target.value })}
                        placeholder="e.g. O(1) or O(N)"
                        className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-1.5 text-xs text-neutral-200 font-mono focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>

                  {/* Code Editor & Copy Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-xs font-semibold text-neutral-300">
                          Solution Code
                        </span>
                        <select
                          value={appr.language}
                          onChange={(e) => onUpdateApproach(appr.id, { language: e.target.value })}
                          className="bg-[#181818] border border-[#262626] rounded px-2 py-0.5 text-[11px] text-neutral-300 focus:outline-none"
                        >
                          <option value="C++">C++</option>
                          <option value="Java">Java</option>
                          <option value="Python">Python</option>
                          <option value="TypeScript">TypeScript</option>
                          <option value="Go">Go</option>
                          <option value="Rust">Rust</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleCopyCode(appr.code, appr.id)}
                        className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white bg-[#181818] border border-[#262626] px-2.5 py-1 rounded transition-colors"
                      >
                        {copiedId === appr.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    <textarea
                      rows={10}
                      value={appr.code}
                      onChange={(e) => onUpdateApproach(appr.id, { code: e.target.value })}
                      placeholder="// Paste or write your complete solution code here..."
                      className="w-full bg-[#0a0a0a] border border-[#232323] rounded-lg p-3 text-xs font-mono text-neutral-200 focus:outline-none focus:border-white/30 leading-relaxed resize-y"
                      spellCheck={false}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
