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
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] eyebrow"
        style={{
          padding: "10px 16px",
          background: "var(--c-gold-400)",
          color: "#1B1108",
          textDecoration: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
        }}
      >
        Przejdź do treści
      </a>
      <OfflineIndicator />
      <TopNav />
      <main
        id="main"
        tabIndex={-1}
        className="min-h-screen md:pt-topnav pb-24 md:pb-16 focus:outline-none"
      >
        <div className="max-w-content mx-auto px-6 md:px-12 pt-10 md:pt-12">
          {children}
        </div>
      </main>
      <BottomNav />
    </AuthGate>
  );
}
