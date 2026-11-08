"use client";

import React, { useState, useEffect } from "react";
import { Globe2, History, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";
import { PlatformCard } from "@/components/integrations/PlatformCard";
import { CsvImportModal } from "@/components/problems/CsvImportModal";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { getDbRepository } from "@/lib/db/repository";
import { formatDateTime } from "@/lib/utils";
import type { PlatformAccount, SyncLog, PlatformType } from "@/types";

export default function IntegrationsPage() {
  const [accounts, setAccounts] = useState<PlatformAccount[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const repo = getDbRepository();
    const accs = await repo.getPlatformAccounts();
    const logs = await repo.getSyncLogs();
    setAccounts(accs);
    setSyncLogs(logs);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateHandle = async (platform: PlatformType, handle: string) => {
    const repo = getDbRepository();
    await repo.updatePlatformAccount(platform, {
      handle,
      profile_url:
        platform === "Codeforces"
          ? `https://codeforces.com/profile/${handle}`
          : platform === "LeetCode"
          ? `https://leetcode.com/${handle}/`
          : platform === "AtCoder"
          ? `https://atcoder.jp/users/${handle}`
          : undefined,
      is_connected: Boolean(handle.trim()),
    });
    loadData();
  };

  const handleLiveSync = async (platform: PlatformType, handle: string) => {
    if (platform === "Codeforces") {
      const res = await fetch("/api/integrations/codeforces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Codeforces sync failed");
      await loadData();
    } else if (platform === "AtCoder") {
      const res = await fetch("/api/integrations/atcoder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AtCoder sync failed");
      await loadData();
    }
  };

  const platformSpecs: Record<
    PlatformType,
    { supportsSync: boolean; notes: string }
  > = {
    Codeforces: {
      supportsSync: true,
      notes: "Official public API integration (user.info, user.rating, user.status). Caches results to honor rate limits.",
    },
    AtCoder: {
      supportsSync: true,
      notes: "AtCoder Problems (Kenkoooo) community API for submissions and contest activity.",
    },
    LeetCode: {
      supportsSync: false,
      notes: "Direct scraping is strictly avoided per platform terms. Use CSV import or quick-capture URL entry.",
    },
    CodeChef: {
      supportsSync: false,
      notes: "Manual logging and CSV batch import supported. Connect your handle for quick profile reference.",
    },
    HackerRank: {
      supportsSync: false,
      notes: "Standard manual logging & CSV supported (enterprise HackerRank for Work APIs are not applicable to personal practice).",
    },
    GeeksforGeeks: {
      supportsSync: false,
      notes: "Manual problem logging, URL auto-extraction, and CSV imports supported.",
    },
    Other: {
      supportsSync: false,
      notes: "Manual entry for custom coding platforms and university online judges.",
    },
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Globe2 className="w-6 h-6 text-brand-400" />
          Platform Integrations & Public APIs
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Connect your coding handles. Official public APIs are utilized for Codeforces and AtCoder; safe CSV and manual logging workflows are provided for other platforms.
        </p>
      </div>

      {/* Grid of Platform Cards */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
          Loading platform credentials...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => {
            const spec = platformSpecs[acc.platform] || {
              supportsSync: false,
              notes: "Manual logging supported.",
            };

            return (
              <PlatformCard
                key={acc.platform}
                account={acc}
                supportsSync={spec.supportsSync}
                notes={spec.notes}
                onUpdateHandle={(h) => handleUpdateHandle(acc.platform, h)}
                onSync={(h) => handleLiveSync(acc.platform, h)}
                onOpenCsvImport={() => setIsCsvModalOpen(true)}
              />
            );
          })}
        </div>
      )}

      {/* Sync Logs Table */}
      <Card className="border-[#1f2433] bg-[#12141e]">
        <CardHeader className="py-4 px-5 border-b border-[#1f2433]">
          <CardTitle className="text-sm flex items-center gap-2">
            <History className="w-4 h-4 text-brand-400" />
            Audit Sync Logs & API History ({syncLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {syncLogs.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">
              No synchronization events logged yet. Click "Sync Live" on Codeforces or AtCoder to log events.
            </p>
          ) : (
            <div className="divide-y divide-[#1f2433] text-xs">
              {syncLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Badge
                      variant={
                        log.status === "SUCCESS"
                          ? "success"
                          : log.status === "FAILED"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {log.status}
                    </Badge>
                    <span className="font-semibold text-white">{log.platform}</span>
                    <span className="text-gray-400">
                      {log.details || log.error_message || "Synchronization completed"}
                    </span>
                  </div>

                  <span className="text-gray-500 text-[11px] font-mono">
                    {formatDateTime(log.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onImportDone={loadData}
      />
    </div>
  );
}
