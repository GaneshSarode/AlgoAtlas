"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AddProblemModal } from "@/components/problems/AddProblemModal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMobileOpen={() => setIsMobileOpen(true)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-7 lg:p-9 max-w-[1440px] w-full mx-auto animate-in fade-in duration-150">
          {children}
        </main>
      </div>

      {/* Global Quick Add Problem Modal */}
      <AddProblemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
