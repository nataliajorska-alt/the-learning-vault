"use client";

import { useEffect, type ReactNode } from "react";
import { AuthGate } from "./AuthGate";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { OfflineIndicator } from "./OfflineIndicator";

export function AppShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("SW register failed", err);
    });
  }, []);

  return (
    <AuthGate>
      <OfflineIndicator />
      <div className="md:flex">
        <Sidebar />
        <main className="flex-1 md:ml-sidebar min-h-screen pb-24 md:pb-12">
          <div className="max-w-content mx-auto px-6 md:px-12 pt-10 md:pt-14">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </AuthGate>
  );
}
