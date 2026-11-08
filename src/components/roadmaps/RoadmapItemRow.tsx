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
          ? "bg-[#111822]/80 border-emerald-900/30 text-gray-400"
          : "bg-[#141724] border-[#22283a] text-gray-200 hover:border-[#2f3852]"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Toggle Checkbox */}
        <button
          onClick={() => onToggle(!isCompleted)}
          className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${
            isCompleted
              ? "bg-emerald-600 border-emerald-500 text-white"
              : "border-[#313b54] bg-[#1a1f2e] hover:border-brand-500"
          }`}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span
              className={`font-semibold ${
                isCompleted ? "line-through text-gray-500" : "text-white"
              }`}
            >
              {item.title}
            </span>
            <a
              href={item.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-300 transition-colors"
              title="Open problem link"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <span className="text-[11px] text-gray-500">{item.platform}</span>
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
            className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 font-medium bg-purple-950/30 border border-purple-800/40 px-2 py-1 rounded"
          >
            <BookOpen className="w-3 h-3" />
            <span>Journal</span>
          </Link>
        ) : (
          <button
            onClick={() => onQuickAddToVault(item)}
            className="flex items-center gap-1 text-[11px] text-brand-400 hover:text-white bg-[#191d2c] border border-[#272f44] px-2 py-1 rounded hover:bg-brand-600 transition-colors"
            title="Add to My Problems"
          >
            <Plus className="w-3 h-3" />
            <span>Vault</span>
          </button>
        )}
      </div>
    </div>
  );
}
