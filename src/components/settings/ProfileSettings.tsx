"use client";

import React, { useState } from "react";
import { User, Code, Target, Clock, Map, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";

export function ProfileSettings() {
  const [displayName, setDisplayName] = useState("Atlas Engineer");
  const [language, setLanguage] = useState("C++");
  const [dailyMinutes, setDailyMinutes] = useState(90);
  const [dailyProblems, setDailyProblems] = useState(3);
  const [weeklyProblems, setWeeklyProblems] = useState(15);
  const [activeRoadmap, setActiveRoadmap] = useState("NeetCode 150");
  const [goals, setGoals] = useState("Reach 1900+ on Codeforces and complete NeetCode 150 before summer tech interviews.");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <Card className="border-[#1f2433] bg-[#12141e]">
      <CardHeader className="py-4 px-5 border-b border-[#1f2433]">
        <CardTitle className="text-sm flex items-center gap-2">
          <User className="w-4 h-4 text-brand-400" />
          Profile & Practice Targets
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#171b28] border border-[#272f44] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Preferred Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#171b28] border border-[#272f44] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="C++">C++</option>
                <option value="Java">Java</option>
                <option value="Python">Python</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Go">Go</option>
                <option value="Rust">Rust</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Daily Target (mins)
              </label>
              <input
                type="number"
                min={15}
                max={480}
                value={dailyMinutes}
                onChange={(e) => setDailyMinutes(Number(e.target.value))}
                className="w-full bg-[#171b28] border border-[#272f44] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-emerald-400" /> Daily Problems
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={dailyProblems}
                onChange={(e) => setDailyProblems(Number(e.target.value))}
                className="w-full bg-[#171b28] border border-[#272f44] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
                <Map className="w-3.5 h-3.5 text-purple-400" /> Active Roadmap
              </label>
              <select
                value={activeRoadmap}
                onChange={(e) => setActiveRoadmap(e.target.value)}
                className="w-full bg-[#171b28] border border-[#272f44] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="NeetCode 150">NeetCode 150</option>
                <option value="Blind 75">Blind 75</option>
                <option value="Striver A2Z">Striver A2Z DSA</option>
                <option value="CSES Problem Set">CSES Problem Set</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Personal Learning Goals & CP Target
            </label>
            <textarea
              rows={2}
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              className="w-full bg-[#171b28] border border-[#272f44] rounded-lg p-2.5 text-xs text-white focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#1f2433]">
            {saved ? (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Preferences Saved!
              </span>
            ) : (
              <span />
            )}

            <Button type="submit" size="sm" className="bg-brand-600 hover:bg-brand-500">
              Save Profile Preferences
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
