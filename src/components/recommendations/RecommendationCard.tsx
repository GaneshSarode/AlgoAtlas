"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Repeat,
  AlertTriangle,
  Map,
  ArrowRight,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import type { RecommendationItem } from "@/services/recommendationEngine";

export interface RecommendationCardProps {
  item: RecommendationItem;
}

export function RecommendationCard({ item }: RecommendationCardProps) {
  const getBadge = () => {
    switch (item.type) {
      case "REVISION":
        return (
          <Badge variant="danger" className="text-[10px] flex items-center gap-1">
            <Repeat className="w-3 h-3" /> Priority 1: Overdue Revision
          </Badge>
        );
      case "PREREQUISITE":
        return (
          <Badge variant="warning" className="text-[10px] flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Priority 2: Missing Prerequisite
          </Badge>
        );
      case "WEAK_TOPIC":
        return (
          <Badge variant="purple" className="text-[10px] flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Priority 3: Weak Topic
          </Badge>
        );
      case "ROADMAP_MILESTONE":
        return (
          <Badge variant="default" className="text-[10px] flex items-center gap-1">
            <Map className="w-3 h-3" /> Priority 4: Roadmap Milestone
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-[10px]">
            Recommended Practice
          </Badge>
        );
    }
  };

  return (
    <Card className="bg-[#12141e] border-[#1e2333] hover:border-[#323b54] transition-all">
      <CardContent className="p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {getBadge()}
          <span className="flex items-center gap-1 text-[11px] text-gray-500 font-mono">
            <Clock className="w-3 h-3" /> ~{item.estimatedMinutes} mins
          </span>
        </div>

        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            {item.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{item.subtitle}</p>
        </div>

        {/* Explicit Actionable Reason */}
        <div className="p-3 rounded-lg bg-[#0e1017] border border-[#1b1f2e] text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
            Why this is recommended for you:
          </span>
          <p className="text-gray-300 italic font-medium leading-relaxed">
            "{item.reason}"
          </p>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#1c2132]">
          <Link
            href={item.actionUrl}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors shadow-sm shadow-brand-600/30"
          >
            <span>{item.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
