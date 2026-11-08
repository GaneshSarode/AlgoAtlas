"use client";

import React, { useState } from "react";
import {
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Upload,
  Globe2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { formatDateTime } from "@/lib/utils";
import type { PlatformAccount } from "@/types";

export interface PlatformCardProps {
  account: PlatformAccount;
  onSync: (handle: string) => Promise<void>;
  onUpdateHandle: (handle: string) => Promise<void>;
  onOpenCsvImport?: () => void;
  supportsSync: boolean;
  notes: string;
}

export function PlatformCard({
  account,
  onSync,
  onUpdateHandle,
  onOpenCsvImport,
  supportsSync,
  notes,
}: PlatformCardProps) {
  const [handle, setHandle] = useState(account.handle || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSaveHandle = async () => {
    await onUpdateHandle(handle);
    setIsEditing(false);
  };

  const handleTriggerSync = async () => {
    if (!handle.trim()) return;
    setIsSyncing(true);
    setErrorMessage(null);
    try {
      await onSync(handle.trim());
    } catch (err: any) {
      setErrorMessage(err.message || "Sync failed");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="bg-[#12141e] border-[#1e2333] hover:border-[#2e3752] transition-all flex flex-col justify-between">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">{account.platform}</span>
              {account.is_connected ? (
                <Badge variant="success" className="text-[10px]">Connected</Badge>
              ) : (
                <Badge variant="secondary" className="text-[10px]">Manual Entry</Badge>
              )}
            </div>
            {account.rank_title && (
              <span className="text-[11px] text-amber-400 font-medium">
                {account.rank_title}
              </span>
            )}
          </div>

          {account.rating && (
            <div className="text-right">
              <span className="text-sm font-bold font-mono text-brand-400 block">
                {account.rating}
              </span>
              <span className="text-[10px] text-gray-500">Rating</span>
            </div>
          )}
        </div>

        {/* Handle Input & Save */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300 block">
            Username / Handle
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={handle}
              onChange={(e) => {
                setHandle(e.target.value);
                setIsEditing(true);
              }}
              placeholder={`Enter ${account.platform} handle...`}
              className="flex-1 bg-[#171b28] border border-[#272f44] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
            />
            {isEditing && (
              <Button size="sm" onClick={handleSaveHandle} className="h-8 text-xs px-2.5">
                Save
              </Button>
            )}
          </div>
        </div>

        {/* Sync Info or Manual Guidance */}
        <div className="p-3 rounded-lg bg-[#0e1017] border border-[#1b1f2e] text-xs space-y-1.5">
          <p className="text-[11px] text-gray-400">{notes}</p>
          {account.last_synced_at && (
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 pt-1 border-t border-[#1b1f2e]">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Last sync: {formatDateTime(account.last_synced_at)}</span>
            </div>
          )}
        </div>

        {/* Error message alert */}
        {errorMessage && (
          <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="truncate">{errorMessage}</span>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1d2235]">
          {account.profile_url ? (
            <a
              href={account.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <span>View Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            {onOpenCsvImport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenCsvImport}
                className="text-xs h-7 px-2.5"
              >
                <Upload className="w-3 h-3 mr-1" />
                CSV
              </Button>
            )}

            {supportsSync && (
              <Button
                size="sm"
                disabled={isSyncing || !handle.trim()}
                onClick={handleTriggerSync}
                className="bg-brand-600 hover:bg-brand-500 text-xs h-7 px-2.5"
              >
                <RefreshCw
                  className={`w-3 h-3 mr-1 ${isSyncing ? "animate-spin" : ""}`}
                />
                {isSyncing ? "Syncing..." : "Sync Live"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
