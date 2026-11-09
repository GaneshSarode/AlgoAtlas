"use client";

import React, { useState } from "react";
import { History, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { formatDateTime } from "@/lib/utils";
import type { ProblemAttempt, AttemptOutcome } from "@/types";

export interface AttemptsHistoryProps {
  attempts: ProblemAttempt[];
  onAddAttempt: (attempt: Omit<ProblemAttempt, "id" | "created_at" | "user_id">) => void;
  problemId: string;
}

export function AttemptsHistory({
  attempts,
  onAddAttempt,
  problemId,
}: AttemptsHistoryProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [outcome, setOutcome] = useState<AttemptOutcome>("Pass");
  const [timeSpent, setTimeSpent] = useState(25);
  const [language, setLanguage] = useState("C++");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAttempt({
      problem_id: problemId,
      attempt_number: attempts.length + 1,
      outcome,
      time_spent_minutes: timeSpent,
      language,
      personal_notes: notes.trim() || undefined,
    });
    setNotes("");
    setIsAdding(false);
  };

  return (
    <Card className="border-[#232323] bg-[#141414]">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b border-[#232323]">
        <CardTitle className="text-sm flex items-center gap-2 text-white">
          <History className="w-4 h-4 text-neutral-400" />
          6. Attempts & Submission Log ({attempts.length})
        </CardTitle>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs h-7 px-2.5 border-[#262626] text-neutral-300 hover:text-white hover:bg-[#181818]"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          {isAdding ? "Cancel" : "Log Attempt"}
        </Button>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {isAdding && (
          <form
            onSubmit={handleSubmit}
            className="p-4 rounded-lg bg-[#181818] border border-[#262626] space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Outcome
                </label>
                <select
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value as AttemptOutcome)}
                  className="w-full bg-[#141414] border border-[#262626] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
                >
                  <option value="Pass">Pass (Accepted)</option>
                  <option value="TLE">Time Limit Exceeded (TLE)</option>
                  <option value="WA">Wrong Answer (WA)</option>
                  <option value="MLE">Memory Limit Exceeded (MLE)</option>
                  <option value="Runtime Error">Runtime Error</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Time Spent (min)
                </label>
                <input
                  type="number"
                  min={1}
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(Number(e.target.value))}
                  className="w-full bg-[#141414] border border-[#262626] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
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

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Attempt Reflection / Mistake Note
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. TLE on test case 43 because of nested loop. Fixed by prefix sum."
                className="w-full bg-[#141414] border border-[#262626] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(false)}
                className="border-[#262626] text-neutral-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-white hover:bg-neutral-200 text-neutral-900 font-medium">
                Save Attempt
              </Button>
            </div>
          </form>
        )}

        {attempts.length === 0 ? (
          <p className="text-xs text-neutral-500 text-center py-4">
            No previous attempts recorded yet.
          </p>
        ) : (
          <div className="space-y-2">
            {attempts.map((att) => (
              <div
                key={att.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#181818] border border-[#262626] text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-neutral-400">#{att.attempt_number}</span>
                  <Badge
                    variant={
                      att.outcome === "Pass"
                        ? "success"
                        : att.outcome === "TLE"
                        ? "warning"
                        : "danger"
                    }
                  >
                    {att.outcome}
                  </Badge>
                  <span className="text-neutral-300 font-mono">{att.language}</span>
                  {att.personal_notes && (
                    <span className="text-neutral-400 italic truncate max-w-sm">
                      "{att.personal_notes}"
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-neutral-500">
                  <span>{att.time_spent_minutes}m</span>
                  <span>{formatDateTime(att.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
