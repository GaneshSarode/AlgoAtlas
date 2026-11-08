"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProblemHeader } from "@/components/journal/ProblemHeader";
import { UnderstandingSection } from "@/components/journal/UnderstandingSection";
import { ApproachesManager } from "@/components/journal/ApproachesManager";
import { WhatILearnedSection } from "@/components/journal/WhatILearnedSection";
import { SelfAssessmentSection } from "@/components/journal/SelfAssessmentSection";
import { AttemptsHistory } from "@/components/journal/AttemptsHistory";
import { getDbRepository } from "@/lib/db/repository";
import type {
  Problem,
  LearningNote,
  SolutionApproach,
  ProblemAttempt,
} from "@/types";

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params?.id as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [learningNote, setLearningNote] = useState<LearningNote | null>(null);
  const [approaches, setApproaches] = useState<SolutionApproach[]>([]);
  const [attempts, setAttempts] = useState<ProblemAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadProblemData() {
      if (!problemId) return;
      setIsLoading(true);
      const repo = getDbRepository();
      const p = await repo.getProblemById(problemId);
      if (!p) {
        setIsLoading(false);
        return;
      }
      setProblem(p);

      const note = await repo.getLearningNotesByProblemId(problemId);
      setLearningNote(
        note || {
          id: `note-${problemId}`,
          problem_id: problemId,
          user_id: "default-user",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      );

      const apprs = await repo.getApproachesByProblemId(problemId);
      setApproaches(apprs);

      const atts = await repo.getAttemptsByProblemId(problemId);
      setAttempts(atts);

      setIsLoading(false);
    }
    loadProblemData();
  }, [problemId]);

  // Autosave handler for problem metadata and notes
  const triggerAutosave = (updatedProblem?: Partial<Problem>, updatedNote?: Partial<LearningNote>) => {
    setSaveStatus("saving");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      const repo = getDbRepository();
      if (updatedProblem && problem) {
        await repo.updateProblem(problemId, updatedProblem);
      }
      if (updatedNote) {
        await repo.saveLearningNotes({
          problem_id: problemId,
          ...learningNote,
          ...updatedNote,
        });
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    }, 600);
  };

  const handleUpdateProblem = (updates: Partial<Problem>) => {
    if (!problem) return;
    const next = { ...problem, ...updates };
    setProblem(next);
    triggerAutosave(updates, undefined);
  };

  const handleUpdateNotes = (updates: Partial<LearningNote>) => {
    if (!learningNote) return;
    const next = { ...learningNote, ...updates };
    setLearningNote(next);
    triggerAutosave(undefined, updates);
  };

  const handleAddApproach = async (
    approachData: Omit<SolutionApproach, "id" | "created_at" | "updated_at" | "user_id">
  ) => {
    const repo = getDbRepository();
    const created = await repo.createApproach(approachData);
    setApproaches((prev) => [...prev, created]);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const handleUpdateApproach = async (id: string, updates: Partial<SolutionApproach>) => {
    const repo = getDbRepository();
    const updated = await repo.updateApproach(id, problemId, updates);
    setApproaches((prev) => prev.map((a) => (a.id === id ? updated : a)));
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const handleDeleteApproach = async (id: string) => {
    const repo = getDbRepository();
    await repo.deleteApproach(id, problemId);
    setApproaches((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddAttempt = async (
    attemptData: Omit<ProblemAttempt, "id" | "created_at" | "user_id">
  ) => {
    const repo = getDbRepository();
    const created = await repo.createAttempt(attemptData);
    setAttempts((prev) => [created, ...prev]);
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
        Loading problem journal...
      </div>
    );
  }

  if (!problem || !learningNote) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-base font-semibold text-white">Problem Not Found</h2>
        <p className="text-xs text-gray-400">
          This problem entry might have been deleted or does not exist.
        </p>
        <button
          onClick={() => router.push("/problems")}
          className="text-xs text-brand-400 hover:underline"
        >
          ← Return to Problems Vault
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Problem Header Bar */}
      <ProblemHeader
        problem={problem}
        onUpdate={handleUpdateProblem}
        saveStatus={saveStatus}
      />

      {/* Main Journal Sections */}
      <div className="space-y-6">
        {/* Section 1 & 2: Understanding and Initial Instinct */}
        <UnderstandingSection
          note={learningNote}
          onChange={handleUpdateNotes}
        />

        {/* Section 3: Approaches & Code Storage */}
        <ApproachesManager
          approaches={approaches}
          onAddApproach={handleAddApproach}
          onUpdateApproach={handleUpdateApproach}
          onDeleteApproach={handleDeleteApproach}
          problemId={problemId}
        />

        {/* Section 4: What I Learned */}
        <WhatILearnedSection
          note={learningNote}
          onChange={handleUpdateNotes}
        />

        {/* Section 5: Self-Assessment */}
        <SelfAssessmentSection
          problem={problem}
          onUpdateProblem={handleUpdateProblem}
        />

        {/* Section 6: Attempts History */}
        <AttemptsHistory
          attempts={attempts}
          onAddAttempt={handleAddAttempt}
          problemId={problemId}
        />
      </div>
    </div>
  );
}
