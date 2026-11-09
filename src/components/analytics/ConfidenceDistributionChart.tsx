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
  Cell,
} from "recharts";
import type { Problem } from "@/types";

export interface ConfidenceDistributionChartProps {
  problems: Problem[];
}

export function ConfidenceDistributionChart({ problems }: ConfidenceDistributionChartProps) {
  const counts = [0, 0, 0, 0, 0]; // 1, 2, 3, 4, 5
  problems.forEach((p) => {
    const star = Math.max(1, Math.min(5, p.confidence_rating || 3));
    counts[star - 1]++;
  });

  const colors = ["#ef4444", "#f97316", "#f59e0b", "#34d399", "#10b981"];

  const data = [
    { label: "1 Star", count: counts[0], color: colors[0] },
    { label: "2 Stars", count: counts[1], color: colors[1] },
    { label: "3 Stars", count: counts[2], color: colors[2] },
    { label: "4 Stars", count: counts[3], color: colors[3] },
    { label: "5 Stars", count: counts[4], color: colors[4] },
  ];

  return (
    <div className="h-56 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
          <XAxis dataKey="label" stroke="#737373" fontSize={11} tickLine={false} />
          <YAxis stroke="#737373" fontSize={11} tickLine={false} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-[#141414] border border-[#2a2a2a] px-3 py-1.5 rounded-lg shadow-xl text-xs">
                    <p className="font-semibold text-white">
                      {item.label}: <span className="font-mono font-bold text-amber-400">{item.count} questions</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
