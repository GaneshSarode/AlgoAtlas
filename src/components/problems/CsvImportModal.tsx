"use client";

import React, { useState } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Dialog } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { getDbRepository } from "@/lib/db/repository";
import { slugify } from "@/lib/utils";
import type { PlatformType, DifficultyLevel, ProblemStatus } from "@/types";

export interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportDone?: () => void;
}

export function CsvImportModal({
  isOpen,
  onClose,
  onImportDone,
}: CsvImportModalProps) {
  const [csvContent, setCsvContent] = useState("");
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const sampleCsv = `title,platform,url,difficulty,topic,status
Two Sum,LeetCode,https://leetcode.com/problems/two-sum/,Easy,Arrays,Solved Independently
Watermelon,Codeforces,https://codeforces.com/problemset/problem/4/A,Easy,Math,Solved Independently
Subarray Sum Equals K,LeetCode,https://leetcode.com/problems/subarray-sum-equals-k/,Medium,Prefix Sum,Needs Revision`;

  const parseCsv = (text: string) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) {
      setErrors(["CSV must contain at least a header and one data row."]);
      setPreviewRows([]);
      return;
    }

    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const titleIdx = header.indexOf("title");
    const platformIdx = header.indexOf("platform");
    const urlIdx = header.indexOf("url");
    const diffIdx = header.indexOf("difficulty");
    const topicIdx = header.indexOf("topic");
    const statusIdx = header.indexOf("status");

    if (titleIdx === -1 || urlIdx === -1) {
      setErrors(["Header must include at least 'title' and 'url' columns."]);
      setPreviewRows([]);
      return;
    }

    const rows: any[] = [];
    const parseErrors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split(",").map((c) => c.trim());

      const title = cols[titleIdx];
      const url = cols[urlIdx];
      if (!title || !url) {
        parseErrors.push(`Row ${i + 1}: Missing title or URL.`);
        continue;
      }

      const platform = (platformIdx !== -1 && cols[platformIdx] ? cols[platformIdx] : "LeetCode") as PlatformType;
      const difficulty = (diffIdx !== -1 && ["Easy", "Medium", "Hard"].includes(cols[diffIdx])
        ? cols[diffIdx]
        : "Medium") as DifficultyLevel;
      const topic = topicIdx !== -1 ? cols[topicIdx] : "General";
      const status = (statusIdx !== -1 && cols[statusIdx] ? cols[statusIdx] : "Not Started") as ProblemStatus;

      rows.push({
        title,
        platform,
        url,
        difficulty,
        topic,
        status,
      });
    }

    setErrors(parseErrors);
    setPreviewRows(rows);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      parseCsv(text);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (previewRows.length === 0) return;
    setIsImporting(true);
    try {
      const repo = getDbRepository();
      let imported = 0;
      for (const row of previewRows) {
        await repo.createProblem({
          title: row.title,
          slug: slugify(row.title),
          platform: row.platform,
          url: row.url,
          difficulty: row.difficulty,
          status: row.status,
          primary_topic: row.topic,
          confidence_rating: 3,
          is_bookmarked: false,
          viewed_editorial: false,
          used_external_help: false,
          time_spent_minutes: 20,
          programming_language: "C++",
        });
        imported++;
      }
      setSuccessCount(imported);
      if (onImportDone) onImportDone();
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Import Problems via CSV"
      description="Upload a CSV file or paste formatted CSV data to batch import problems into your vault."
      maxWidth="xl"
    >
      <div className="space-y-4">
        {successCount !== null ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-semibold text-white">
              Successfully imported {successCount} problems!
            </h4>
            <Button
              onClick={() => {
                setSuccessCount(null);
                setPreviewRows([]);
                setCsvContent("");
                onClose();
              }}
              size="sm"
              className="bg-white hover:bg-neutral-200 text-neutral-950 font-semibold"
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-neutral-400" />
                Select CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Or Paste Raw CSV Text
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setCsvContent(sampleCsv);
                    parseCsv(sampleCsv);
                  }}
                  className="text-[11px] text-neutral-400 hover:text-white underline"
                >
                  Load Sample CSV
                </button>
              </div>
              <textarea
                rows={5}
                value={csvContent}
                onChange={(e) => {
                  setCsvContent(e.target.value);
                  parseCsv(e.target.value);
                }}
                placeholder="title,platform,url,difficulty,topic,status"
                className="w-full bg-[#181818] border border-[#262626] rounded-lg p-3 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
              />
            </div>

            {errors.length > 0 && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs space-y-1">
                {errors.map((err, i) => (
                  <p key={i} className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {err}
                  </p>
                ))}
              </div>
            )}

            {previewRows.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Parsed Preview ({previewRows.length} problems ready to import)
                </span>
                <div className="max-h-40 overflow-y-auto rounded-lg border border-[#232323] bg-[#141414]">
                  <table className="w-full text-left text-xs text-neutral-300">
                    <thead className="bg-[#181818] text-neutral-400 sticky top-0">
                      <tr>
                        <th className="p-2">Title</th>
                        <th className="p-2">Platform</th>
                        <th className="p-2">Diff</th>
                        <th className="p-2">Topic</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#232323]">
                      {previewRows.map((r, idx) => (
                        <tr key={idx} className="hover:bg-[#1a1a1a]">
                          <td className="p-2 font-medium text-white">{r.title}</td>
                          <td className="p-2">{r.platform}</td>
                          <td className="p-2">{r.difficulty}</td>
                          <td className="p-2">{r.topic}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#232323]">
              <Button type="button" variant="outline" onClick={onClose} size="sm">
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleImport}
                size="sm"
                disabled={previewRows.length === 0 || isImporting}
                className="bg-white hover:bg-neutral-200 text-neutral-950 font-semibold shadow-sm"
              >
                {isImporting ? "Importing..." : `Import ${previewRows.length} Problems`}
              </Button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}
