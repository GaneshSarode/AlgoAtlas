"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import type { Topic, TopicMastery } from "@/types";

export interface ConceptCardProps {
  topic: Topic;
  mastery?: TopicMastery;
}

export function ConceptCard({ topic, mastery }: ConceptCardProps) {
  const getStatusBadge = (status?: TopicMastery["learning_status"]) => {
    switch (status) {
      case "Strong":
        return <Badge variant="success">Strong Mastery</Badge>;
      case "Comfortable":
        return <Badge variant="success">Comfortable</Badge>;
      case "Practising":
        return <Badge variant="warning">Practising</Badge>;
      case "Currently Learning":
        return <Badge variant="default">Learning</Badge>;
      default:
        return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  return (
    <Card className="bg-[#141414] border-[#232323] hover:border-[#383838] transition-all flex flex-col justify-between">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
              {topic.category}
            </span>
            <Link
              href={`/concepts/${topic.slug}`}
              className="text-base font-semibold text-white hover:text-neutral-300 block transition-colors"
            >
              {topic.name}
            </Link>
          </div>
          {getStatusBadge(mastery?.learning_status)}
        </div>

        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
          {topic.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-[#232323] text-xs">
          <span className="text-neutral-400 font-medium">
            {mastery?.problems_solved_count || 0} solved{" "}
            {mastery?.hints_used_count ? `(${mastery.hints_used_count} with hints)` : ""}
          </span>

          <Link
            href={`/concepts/${topic.slug}`}
            className="flex items-center gap-1 text-xs text-neutral-200 hover:text-white font-medium"
          >
            Explore <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
