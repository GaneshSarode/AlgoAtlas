"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export interface DifficultyPieChartProps {
  easyCount: number;
  mediumCount: number;
  hardCount: number;
}

export function DifficultyPieChart({
  easyCount,
  mediumCount,
  hardCount,
}: DifficultyPieChartProps) {
  const data = [
    { name: "Easy", value: easyCount, color: "#10b981" },
    { name: "Medium", value: mediumCount, color: "#f59e0b" },
    { name: "Hard", value: hardCount, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  const total = easyCount + mediumCount + hardCount;

  if (total === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-xs text-neutral-500">
        No problems recorded yet.
      </div>
    );
  }

  return (
    <div className="h-56 w-full flex flex-col items-center justify-center relative">
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={50}
            outerRadius={75}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#141414" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0];
                const pct = Math.round(((item.value as number) / total) * 100);
                return (
                  <div className="bg-[#141414] border border-[#2a2a2a] px-3 py-1.5 rounded-lg shadow-xl text-xs">
                    <span className="font-semibold" style={{ color: item.payload.color }}>
                      {item.name}: {item.value} ({pct}%)
                    </span>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Total Count Label */}
      <div className="absolute top-[35%] flex flex-col items-center pointer-events-none">
        <span className="text-xl font-bold font-mono text-white leading-none">{total}</span>
        <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Solved</span>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Easy: {easyCount}
        </span>
        <span className="flex items-center gap-1.5 text-amber-400">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium: {mediumCount}
        </span>
        <span className="flex items-center gap-1.5 text-rose-400">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Hard: {hardCount}
        </span>
      </div>
    </div>
  );
}
