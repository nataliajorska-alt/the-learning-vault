"use client";

import { useEffect, type ReactNode } from "react";
import { AuthGate } from "./AuthGate";
import { TopNav } from "./TopNav";
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
      <TopNav />
      <main className="min-h-screen md:pt-topnav pb-24 md:pb-16">
        <div className="max-w-content mx-auto px-6 md:px-12 pt-10 md:pt-12">
          {children}
        </div>
      </main>
      <BottomNav />
    </AuthGate>
  );
}
