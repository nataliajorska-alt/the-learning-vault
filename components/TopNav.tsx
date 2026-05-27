"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  effectiveStreak,
  useTopics,
  useUserDoc,
} from "@/lib/firestore-data";
import type { Timestamp } from "firebase/firestore";

function toMillis(v: unknown): number {
  if (!v) return 0;
  if (v instanceof Date) return v.getTime();
  if (typeof v === "object" && v && "toMillis" in v) {
    return (v as Timestamp).toMillis();
  }
  return 0;
}

const NAV: Array<{ href: string; label: string; nudgeKey?: "due" }> = [
  { href: "/", label: "Dziś", nudgeKey: "due" },
  { href: "/vaults", label: "Sekcje" },
  { href: "/study", label: "Ucz mnie", nudgeKey: "due" },
  { href: "/errors", label: "Errata" },
  { href: "/salon", label: "Salon" },
  { href: "/stats", label: "Statystyki" },
  { href: "/admin", label: "Admin" },
];

export function TopNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const userDoc = useUserDoc();
  const streak = effectiveStreak(userDoc);
  const topics = useTopics();
  const displayName =
    user?.displayName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "";
  const initial = (displayName?.[0] ?? "·").toUpperCase();

  const dueToday = useMemo(() => {
    if (!topics) return 0;
    const now = Date.now();
    return topics.filter(
      (t) =>
        t.status === "fresh" ||
        t.status === "struggling" ||
        toMillis(t.nextReview) <= now
    ).length;
  }, [topics]);

  return (
    <header
      className="hidden md:block fixed top-0 inset-x-0 z-40"
      style={{
        background: "rgba(18,10,4,0.94)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(184,146,77,0.22)",
      }}
    >
      <div className="max-w-content mx-auto px-12 h-topnav flex items-center justify-between gap-8">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex items-baseline gap-2 shrink-0 group"
        >
          <span
            className="eyebrow"
            style={{ color: "var(--c-paper-300)", opacity: 0.8 }}
          >
            The Learning
          </span>
          <span
            className="font-display italic font-medium"
            style={{
              fontSize: 22,
              color: "var(--c-gold-400)",
              lineHeight: 1,
            }}
          >
            Vault
          </span>
        </Link>

        {/* Center nav */}
        <nav className="flex items-center" style={{ gap: 36 }}>
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const showDue =
              item.nudgeKey === "due" && dueToday > 0 && !active;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="eyebrow relative"
                style={{
                  color: active
                    ? "var(--c-gold-300)"
                    : "var(--c-paper-200)",
                  opacity: active ? 1 : 0.7,
                  borderBottom: active
                    ? "1px solid var(--c-gold-500)"
                    : "1px solid transparent",
                  paddingBottom: 6,
                  cursor: "pointer",
                  transition:
                    "color 180ms ease, opacity 180ms ease, border-color 180ms ease",
                }}
                title={
                  showDue
                    ? `Dziś czeka ${dueToday} ${dueToday === 1 ? "temat" : dueToday < 5 ? "tematy" : "tematów"}`
                    : undefined
                }
              >
                {item.label}
                {showDue && (
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: -2,
                      right: -8,
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle at 35% 30%, #f3d28a, #b08540 70%)",
                      boxShadow: "0 0 4px rgba(216,179,107,0.55)",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: streak + avatar + logout */}
        <div className="flex items-center" style={{ gap: 20 }}>
          <div style={{ textAlign: "right" }}>
            <div
              className="eyebrow"
              style={{
                color: "var(--c-gold-400)",
                fontSize: 9,
                marginBottom: 2,
              }}
            >
              Passa
            </div>
            <div
              className="font-display italic font-medium"
              style={{ fontSize: 18, color: "var(--c-paper-100)" }}
            >
              {streak}{" "}
              <span style={{ color: "var(--c-gold-400)", fontSize: 13 }}>
                {streak === 1 ? "dzień" : "dni"}
              </span>
            </div>
          </div>
          <div
            style={{
              width: 1,
              height: 28,
              background: "rgba(184,146,77,0.25)",
            }}
          />
          <div
            className="font-display italic font-medium flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, #d9b878, #6a4a1c 70%, #2a1808)",
              color: "#1B1108",
              fontSize: 18,
              boxShadow:
                "inset 0 1px 0 rgba(255,235,180,0.4), 0 2px 4px rgba(0,0,0,0.4)",
            }}
            title={displayName}
          >
            {initial}
          </div>
          <button
            onClick={() => signOut()}
            className="text-paper/40 hover:text-paper/90 transition-colors"
            aria-label="Wyloguj"
          >
            <LogOut className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </header>
  );
}
