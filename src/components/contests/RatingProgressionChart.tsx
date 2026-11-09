"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { ContestResult } from "@/types";

export interface RatingProgressionChartProps {
  contests: ContestResult[];
}

export function RatingProgressionChart({ contests }: RatingProgressionChartProps) {
  // Sort chronologically for chart
  const sorted = [...contests].sort(
    (a, b) => new Date(a.contest_date).getTime() - new Date(b.contest_date).getTime()
  );

  const data = sorted
    .filter((c) => c.rating_after !== undefined)
    .map((c) => ({
      name: c.contest_name.length > 18 ? c.contest_name.substring(0, 16) + "..." : c.contest_name,
      rating: c.rating_after,
      date: c.contest_date,
      platform: c.platform,
      change: c.rating_change,
    }));

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-neutral-400 border border-dashed border-[#2a2a2a] rounded-xl bg-[#141414]">
        No rating history recorded yet. Log your contest participation to view your rating trajectory.
      </div>
    );
  }

  const minRating = Math.max(0, Math.min(...data.map((d) => d.rating || 1500)) - 100);
  const maxRating = Math.max(...data.map((d) => d.rating || 1500)) + 100;

  return (
    <div className="h-64 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
          <XAxis
            dataKey="date"
            stroke="#737373"
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            domain={[minRating, maxRating]}
            stroke="#737373"
            fontSize={11}
            tickLine={false}
            width={45}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-[#141414] border border-[#2a2a2a] p-3 rounded-lg shadow-xl text-xs space-y-1">
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-neutral-400">
                      Platform: <span className="text-neutral-200">{item.platform}</span>
                    </p>
                    <p className="text-neutral-400">
                      Rating: <span className="font-mono text-white font-bold">{item.rating}</span>{" "}
                      {item.change !== undefined && (
                        <span className={item.change >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                          ({item.change >= 0 ? `+${item.change}` : item.change})
                        </span>
                      )}
                    </p>
                    <p className="text-neutral-500 text-[10px]">{item.date}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="rating"
            stroke="#d4d4d4"
            strokeWidth={2}
            dot={{ r: 3.5, fill: "#d4d4d4", strokeWidth: 1, stroke: "#141414" }}
            activeDot={{ r: 5, fill: "#10b981" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
