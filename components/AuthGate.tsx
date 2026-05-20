"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { SignInScreen } from "./SignInScreen";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory bg-grain">
        <div className="hero-italic text-3xl text-muted">Ładuję...</div>
      </div>
    );
  }

  if (!user) return <SignInScreen />;

  return <>{children}</>;
}
