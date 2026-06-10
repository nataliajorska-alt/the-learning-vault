"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { SignInScreen } from "./SignInScreen";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="tex-mahogany min-h-screen flex items-center justify-center">
        <div className="text-center animate-candle">
          <div
            className="font-display italic"
            style={{
              fontSize: 30,
              color: "var(--c-gold-400)",
              lineHeight: 1,
            }}
            aria-hidden
          >
            ❦
          </div>
          <div
            className="font-display italic"
            style={{
              fontSize: 24,
              color: "rgba(228,214,186,0.7)",
              marginTop: 14,
            }}
          >
            Otwieram archiwum…
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <SignInScreen />;

  return <>{children}</>;
}
