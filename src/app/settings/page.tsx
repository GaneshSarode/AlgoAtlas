"use client";

import React from "react";
import { Settings, Shield, Database, Server } from "lucide-react";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { BackupRestoreSettings } from "@/components/settings/BackupRestoreSettings";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-brand-400" />
          Settings & Profile Management
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Customize your study goals, programming language preferences, database backups, and data portability.
        </p>
      </div>

      {/* Database Connection Status Card */}
      <Card className="border-[#1f2433] bg-[#12141e]">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#181d2c] border border-[#263047] flex items-center justify-center text-brand-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Database Engine</span>
                {isSupabaseConfigured ? (
                  <Badge variant="success">Supabase PostgreSQL Connected</Badge>
                ) : (
                  <Badge variant="purple">Local Offline Repository Active</Badge>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {isSupabaseConfigured
                  ? "Connected to hosted Supabase PostgreSQL instance with Row Level Security (RLS) active."
                  : "Running in zero-config local repository mode. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to link a cloud Supabase project."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      <ProfileSettings />

      {/* Backup and Restore */}
      <BackupRestoreSettings />
    </div>
  );
}
