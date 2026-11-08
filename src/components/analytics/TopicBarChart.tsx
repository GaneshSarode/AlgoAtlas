"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { TopicMastery } from "@/types";

export interface TopicBarChartProps {
  masteryList: TopicMastery[];
}

export function TopicBarChart({ masteryList }: TopicBarChartProps) {
  const data = masteryList
    .filter((m) => m.problems_solved_count > 0 || m.mastery_score > 0)
    .slice(0, 8)
    .map((m) => ({
      name: (m.topic_name || "Topic").length > 12 ? (m.topic_name || "").substring(0, 10) + ".." : m.topic_name,
      solved: m.problems_solved_count,
      mastery: Math.round(m.mastery_score),
    }));

  if (data.length === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-xs text-gray-500">
        No topic distribution data yet.
      </div>
    );
  }

  return (
    <div className="h-56 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2538" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#6b7280"
            fontSize={10}
            tickLine={false}
            angle={-20}
            textAnchor="end"
          />
          <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-[#12141e] border border-[#2b334d] px-3 py-1.5 rounded-lg shadow-xl text-xs space-y-0.5">
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-gray-400">
                      Problems Solved: <span className="font-mono text-brand-400 font-bold">{item.solved}</span>
                    </p>
                    <p className="text-gray-400">
                      Mastery Score: <span className="font-mono text-emerald-400 font-bold">{item.mastery}%</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="solved" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
