"use client";

import React, { useState } from "react";
import { Dialog } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { getDbRepository } from "@/lib/db/repository";
import type { PlatformType } from "@/types";

export interface ContestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContestAdded?: () => void;
}

export function ContestModal({ isOpen, onClose, onContestAdded }: ContestModalProps) {
  const [platform, setPlatform] = useState<PlatformType>("Codeforces");
  const [contestName, setContestName] = useState("");
  const [contestDate, setContestDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [participationType, setParticipationType] = useState<
    "Live" | "Virtual" | "Practice"
  >("Live");
  const [rank, setRank] = useState<number | "">("");
  const [attempted, setAttempted] = useState(5);
  const [solved, setSolved] = useState(3);
  const [ratingBefore, setRatingBefore] = useState<number | "">(1600);
  const [ratingAfter, setRatingAfter] = useState<number | "">(1645);
  const [reflectionGood, setReflectionGood] = useState("");
  const [reflectionUnsolved, setReflectionUnsolved] = useState("");
  const [reflectionNextAction, setReflectionNextAction] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contestName.trim()) return;

    setIsSubmitting(true);
    try {
      const repo = getDbRepository();
      const rBefore = ratingBefore !== "" ? Number(ratingBefore) : undefined;
      const rAfter = ratingAfter !== "" ? Number(ratingAfter) : undefined;
      const rChange =
        rBefore !== undefined && rAfter !== undefined ? rAfter - rBefore : undefined;

      await repo.createContestResult({
        platform,
        contest_name: contestName.trim(),
        contest_date: contestDate,
        participation_type: participationType,
        rank: rank !== "" ? Number(rank) : undefined,
        problems_attempted: Number(attempted),
        problems_solved: Number(solved),
        rating_before: rBefore,
        rating_after: rAfter,
        rating_change: rChange,
        reflection_good: reflectionGood.trim() || undefined,
        reflection_unsolved: reflectionUnsolved.trim() || undefined,
        reflection_next_action: reflectionNextAction.trim() || undefined,
      });

      // Reset
      setContestName("");
      onClose();
      if (onContestAdded) onContestAdded();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Log Contest Participation"
      description="Record your rank, rating change, and post-contest reflections."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as PlatformType)}
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
            >
              <option value="Codeforces">Codeforces</option>
              <option value="AtCoder">AtCoder</option>
              <option value="LeetCode">LeetCode</option>
              <option value="CodeChef">CodeChef</option>
              <option value="HackerRank">HackerRank</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Contest Date
            </label>
            <input
              type="date"
              required
              value={contestDate}
              onChange={(e) => setContestDate(e.target.value)}
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1">
            Contest Name
          </label>
          <input
            type="text"
            required
            value={contestName}
            onChange={(e) => setContestName(e.target.value)}
            placeholder="e.g. Codeforces Round 912 (Div. 2) or LeetCode Biweekly 120"
            className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Participation
            </label>
            <select
              value={participationType}
              onChange={(e) =>
                setParticipationType(e.target.value as "Live" | "Virtual" | "Practice")
              }
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
            >
              <option value="Live">Live</option>
              <option value="Virtual">Virtual</option>
              <option value="Practice">Practice</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Rank
            </label>
            <input
              type="number"
              value={rank}
              onChange={(e) => setRank(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="e.g. 1420"
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Solved / Attempted
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={0}
                value={solved}
                onChange={(e) => setSolved(Number(e.target.value))}
                className="w-full bg-[#181818] border border-[#262626] rounded px-2 py-2 text-xs text-white text-center"
              />
              <span className="text-neutral-500">/</span>
              <input
                type="number"
                min={0}
                value={attempted}
                onChange={(e) => setAttempted(Number(e.target.value))}
                className="w-full bg-[#181818] border border-[#262626] rounded px-2 py-2 text-xs text-white text-center"
              />
            </div>
          </div>
        </div>

        {/* Rating Inputs */}
        <div className="grid grid-cols-3 gap-3 pt-1 border-t border-[#232323]">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Rating Before
            </label>
            <input
              type="number"
              value={ratingBefore}
              onChange={(e) =>
                setRatingBefore(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="e.g. 1580"
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Rating After
            </label>
            <input
              type="number"
              value={ratingAfter}
              onChange={(e) =>
                setRatingAfter(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="e.g. 1625"
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Rating Change
            </label>
            <div className="h-9 px-3 flex items-center bg-[#141414] border border-[#262626] rounded-lg font-mono text-xs font-bold">
              {ratingBefore !== "" && ratingAfter !== "" ? (
                Number(ratingAfter) - Number(ratingBefore) >= 0 ? (
                  <span className="text-emerald-400">
                    +{Number(ratingAfter) - Number(ratingBefore)}
                  </span>
                ) : (
                  <span className="text-rose-400">
                    {Number(ratingAfter) - Number(ratingBefore)}
                  </span>
                )
              ) : (
                <span className="text-neutral-500">—</span>
              )}
            </div>
          </div>
        </div>

        {/* Reflection Fields */}
        <div className="space-y-2 pt-1 border-t border-[#232323]">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              What went well during this contest?
            </label>
            <input
              type="text"
              value={reflectionGood}
              onChange={(e) => setReflectionGood(e.target.value)}
              placeholder="e.g. Solved A and B within 20 mins without penalty"
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Which problem was missed & why?
            </label>
            <input
              type="text"
              value={reflectionUnsolved}
              onChange={(e) => setReflectionUnsolved(e.target.value)}
              placeholder="e.g. Got stuck on Problem C due to missing modular arithmetic property"
              className="w-full bg-[#181818] border border-[#262626] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#232323]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !contestName.trim()}
            className="bg-white hover:bg-neutral-200 text-neutral-950 font-semibold"
          >
            {isSubmitting ? "Saving..." : "Save Contest Log"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
