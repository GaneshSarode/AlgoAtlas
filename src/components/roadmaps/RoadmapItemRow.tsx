"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Check, Plus, BookOpen } from "lucide-react";
import { Badge } from "@/ui/badge";
import type { RoadmapItem, Problem } from "@/types";

export interface RoadmapItemRowProps {
  item: RoadmapItem;
  isCompleted: boolean;
  vaultProblem?: Problem;
  onToggle: (completed: boolean) => void;
  onQuickAddToVault: (item: RoadmapItem) => void;
}

export function RoadmapItemRow({
  item,
  isCompleted,
  vaultProblem,
  onToggle,
  onQuickAddToVault,
}: RoadmapItemRowProps) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border transition-all text-xs ${
        isCompleted
          ? "bg-[#121212] border-emerald-900/30 text-neutral-400"
          : "bg-[#141414] border-[#232323] text-neutral-200 hover:border-[#383838]"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Toggle Checkbox */}
        <button
          onClick={() => onToggle(!isCompleted)}
          className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${
            isCompleted
              ? "bg-emerald-600 border-emerald-500 text-white"
              : "border-[#333333] bg-[#1e1e1e] hover:border-white/40"
          }`}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span
              className={`font-semibold ${
                isCompleted ? "line-through text-neutral-500" : "text-white"
              }`}
            >
              {item.title}
            </span>
            <a
              href={item.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-neutral-300 transition-colors"
              title="Open problem link"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <span className="text-[11px] text-neutral-500">{item.platform}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge
          variant={
            item.difficulty === "Easy"
              ? "success"
              : item.difficulty === "Medium"
              ? "warning"
              : "danger"
          }
        >
          {item.difficulty}
        </Badge>

        {/* Vault Status */}
        {vaultProblem ? (
          <Link
            href={`/problems/${vaultProblem.id}`}
            className="flex items-center gap-1 text-[11px] text-neutral-300 hover:text-white font-medium bg-neutral-800 border border-[#2a2a2a] px-2 py-1 rounded"
          >
            <BookOpen className="w-3 h-3" />
            <span>Journal</span>
          </Link>
        ) : (
          <button
            onClick={() => onQuickAddToVault(item)}
            className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white bg-[#181818] border border-[#262626] px-2 py-1 rounded hover:bg-neutral-800 transition-colors"
            title="Add to My Problems"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Vault</span>
          </button>
        )}
      </div>
    </div>
  );
}
