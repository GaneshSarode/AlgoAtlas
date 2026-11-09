"use client";

import React, { useState } from "react";
import { Download, AlertCircle, CheckCircle2, Database } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";
import { getDbRepository } from "@/lib/db/repository";
import { validateBackupJson, generateProblemsCsv } from "@/services/exportService";

export function BackupRestoreSettings() {
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownloadBackup = async () => {
    const repo = getDbRepository();
    const jsonStr = await repo.exportFullJson();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `algoatlas-full-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = async () => {
    const repo = getDbRepository();
    const problems = await repo.getProblems();
    const csvStr = generateProblemsCsv(problems);
    const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `algoatlas-problems-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setRestoreStatus(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const validation = validateBackupJson(content);

      if (!validation.isValid) {
        setErrorMessage(validation.error || "Failed to validate backup JSON");
        setIsProcessing(false);
        return;
      }

      try {
        const repo = getDbRepository();
        const res = await repo.importFullJson(content);
        setRestoreStatus(`Successfully restored ${res.importedCount} problems and all linked notes!`);
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to restore backup");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset your local database to clean default seed data?")) {
      const repo = getDbRepository();
      repo.reset();
      setRestoreStatus("Database reset to defaults successfully.");
    }
  };

  return (
    <Card className="border-[#232323] bg-[#141414]">
      <CardHeader className="py-4 px-5 border-b border-[#232323]">
        <CardTitle className="text-sm flex items-center gap-2">
          <Database className="w-4 h-4 text-neutral-400" />
          Data Portability, Backup & Restore
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Export Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-[#181818] border border-[#262626] flex flex-col justify-between space-y-3">
            <div>
              <h4 className="text-xs font-bold text-white">Full JSON Backup</h4>
              <p className="text-[11px] text-neutral-400 mt-1">
                Download all 21 relational domains: problems, notes, approaches, revisions, roadmaps, and CP contests.
              </p>
            </div>
            <Button
              onClick={handleDownloadBackup}
              size="sm"
              className="bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-xs w-full shadow-sm"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download JSON Backup
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-[#181818] border border-[#262626] flex flex-col justify-between space-y-3">
            <div>
              <h4 className="text-xs font-bold text-white">Export Problems CSV</h4>
              <p className="text-[11px] text-neutral-400 mt-1">
                Export all solved questions and metadata to open in Excel or Google Sheets.
              </p>
            </div>
            <Button
              onClick={handleDownloadCsv}
              size="sm"
              variant="outline"
              className="text-xs w-full"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download CSV
            </Button>
          </div>
        </div>

        {/* Restore from JSON */}
        <div className="p-4 rounded-xl bg-[#181818] border border-[#262626] space-y-3">
          <div>
            <h4 className="text-xs font-bold text-white">Restore from Backup File</h4>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Upload a previously downloaded `.json` backup file. Records will be validated and merged into your vault.
            </p>
          </div>

          <input
            type="file"
            accept=".json"
            onChange={handleRestoreFile}
            className="w-full text-xs text-neutral-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
          />

          {isProcessing && (
            <p className="text-xs text-neutral-400 font-mono animate-pulse">
              Validating and restoring backup...
            </p>
          )}

          {restoreStatus && (
            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{restoreStatus}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Reset Database */}
        <div className="pt-2 border-t border-[#232323] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-neutral-300 block">Database Clean Reset</span>
            <span className="text-[11px] text-neutral-500">Restore factory demonstration records.</span>
          </div>

          <Button
            size="sm"
            variant="danger"
            onClick={handleResetData}
            className="text-xs"
          >
            Reset Database
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
