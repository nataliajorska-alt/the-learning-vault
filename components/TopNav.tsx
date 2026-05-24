"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { effectiveStreak, useUserDoc } from "@/lib/firestore-data";

const NAV = [
  { href: "/", label: "Dziś" },
  { href: "/vaults", label: "Sekcje" },
  { href: "/study", label: "Ucz mnie" },
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
  const displayName =
    user?.displayName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "";
  const initial = (displayName?.[0] ?? "·").toUpperCase();

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
            return (
              <Link
                key={item.href}
                href={item.href}
                className="eyebrow"
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
              >
                {item.label}
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
