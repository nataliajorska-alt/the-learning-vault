"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  GraduationCap,
  LayoutGrid,
  Library,
  LineChart,
  LogOut,
  Search,
  Sparkles,
  Wine,
} from "lucide-react";
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

const NAV = [
  { href: "/", label: "Dziś", icon: LayoutGrid, nudgeKey: "due" },
  { href: "/vaults", label: "Sekcje", icon: Library },
  { href: "/study", label: "Ucz mnie", icon: GraduationCap, nudgeKey: "due" },
  { href: "/errors", label: "Errata", icon: AlertTriangle },
  { href: "/salon", label: "Salon", icon: Wine },
  { href: "/stats", label: "Statystyki", icon: LineChart },
  { href: "/admin", label: "Admin", icon: Sparkles },
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
      className="hidden md:block fixed top-0 inset-x-0 z-40 vault-topbar"
      style={{
        background:
          "linear-gradient(180deg, rgba(21,16,10,0.96), rgba(18,10,4,0.92))",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(184,146,77,0.22)",
        boxShadow:
          "inset 0 -1px 0 rgba(0,0,0,0.45), 0 18px 36px -28px rgba(0,0,0,0.85)",
      }}
    >
      <div className="max-w-content mx-auto px-12 h-topnav flex items-center justify-between gap-7">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0 group"
          style={{ textDecoration: "none" }}
        >
          <span
            aria-hidden
            className="flex items-center justify-center"
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, #d9b878, #7a5c28 65%, #2a1808)",
              boxShadow:
                "inset 0 1px 0 rgba(255,235,180,0.45), 0 2px 4px rgba(0,0,0,0.45)",
              color: "#1B1108",
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            LV
          </span>
          <span className="flex items-baseline gap-2">
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
          </span>
        </Link>

        {/* Center nav */}
        <nav
          className="flex items-center"
          style={{
            gap: 4,
            padding: 4,
            border: "1px solid rgba(184,146,77,0.14)",
            background: "rgba(27,17,8,0.28)",
            boxShadow: "inset 0 1px 0 rgba(255,220,160,0.05)",
          }}
        >
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const showDue =
              item.nudgeKey === "due" && dueToday > 0 && !active;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="eyebrow relative flex items-center"
                style={{
                  gap: 8,
                  color: active
                    ? "var(--c-gold-300)"
                    : "var(--c-paper-200)",
                  opacity: active ? 1 : 0.7,
                  padding: "9px 12px 8px",
                  background: active
                    ? "linear-gradient(180deg, rgba(184,146,77,0.13), rgba(184,146,77,0.05))"
                    : "transparent",
                  border: active
                    ? "0.5px solid rgba(184,146,77,0.34)"
                    : "0.5px solid transparent",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition:
                    "color 180ms ease, opacity 180ms ease, border-color 180ms ease, background 180ms ease",
                }}
                title={
                  showDue
                    ? `Dziś czeka ${dueToday} ${dueToday === 1 ? "temat" : dueToday < 5 ? "tematy" : "tematów"}`
                    : undefined
                }
              >
                <Icon className="h-3.5 w-3.5 stroke-[1.6]" />
                {item.label}
                {showDue && (
                  <span
                    className="signature"
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -6,
                      minWidth: 17,
                      height: 17,
                      borderRadius: 999,
                      background:
                        "radial-gradient(circle at 35% 30%, #f3d28a, #b08540 70%)",
                      color: "#2a1808",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,235,180,0.6), 0 1px 4px rgba(0,0,0,0.55)",
                      fontSize: 9,
                      lineHeight: "17px",
                      textAlign: "center",
                      letterSpacing: 0,
                      fontWeight: 700,
                      padding: "0 4px",
                    }}
                  >
                    {dueToday}
                  </span>
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
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-command-palette"))
            }
            className="text-paper/40 hover:text-paper/90 transition-colors"
            aria-label="Szukaj"
            title="Szukaj (⌘K)"
          >
            <Search className="w-4 h-4 stroke-[1.5]" />
          </button>
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
