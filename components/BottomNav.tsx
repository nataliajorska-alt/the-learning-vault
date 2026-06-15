"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Library,
  GraduationCap,
  AlertTriangle,
  Wine,
  User,
} from "lucide-react";
import { useTopics } from "@/lib/firestore-data";
import type { Timestamp } from "firebase/firestore";

const nav = [
  { href: "/", label: "Dziś", icon: LayoutGrid, nudgeKey: "due" },
  { href: "/vaults", label: "Sekcje", icon: Library },
  { href: "/study", label: "Ucz", icon: GraduationCap, nudgeKey: "due" },
  { href: "/errors", label: "Errata", icon: AlertTriangle },
  { href: "/salon", label: "Salon", icon: Wine },
  { href: "/more", label: "Więcej", icon: User },
];

function toMillis(v: unknown): number {
  if (!v) return 0;
  if (v instanceof Date) return v.getTime();
  if (typeof v === "object" && v && "toMillis" in v) {
    return (v as Timestamp).toMillis();
  }
  return 0;
}

export function BottomNav() {
  const pathname = usePathname();
  const topics = useTopics();

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
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50"
      style={{
        background: "rgba(18,10,4,0.94)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(184,146,77,0.28)",
        boxShadow:
          "inset 0 1px 0 rgba(184,146,77,0.12), 0 -10px 24px -12px rgba(0,0,0,0.7)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="grid grid-cols-6">
        {nav.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href)) ||
            (item.href === "/more" &&
              (pathname.startsWith("/stats") || pathname.startsWith("/admin")));
          const showDue = item.nudgeKey === "due" && dueToday > 0 && !active;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="relative flex flex-col items-center justify-center gap-1 py-3"
              style={{
                color: active ? "var(--c-gold-300)" : "rgba(228,214,186,0.72)",
                transition: "color 180ms ease",
              }}
            >
              {/* gilt hairline marking the active leaf */}
              <span
                aria-hidden
                className="absolute top-0"
                style={{
                  height: 1.5,
                  width: 34,
                  background: active
                    ? "linear-gradient(90deg, transparent, var(--c-gold-400), transparent)"
                    : "transparent",
                  boxShadow: active
                    ? "0 0 6px rgba(216,179,107,0.5)"
                    : "none",
                  transition: "background 180ms ease",
                }}
              />
              <span className="relative">
                <Icon className="w-5 h-5 stroke-[1.5]" />
                {showDue && (
                  <span
                    className="signature absolute"
                    style={{
                      top: -9,
                      right: -12,
                      minWidth: 16,
                      height: 16,
                      borderRadius: 999,
                      background:
                        "radial-gradient(circle at 35% 30%, #f3d28a, #b08540 70%)",
                      color: "#2a1808",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,235,180,0.6), 0 1px 4px rgba(0,0,0,0.55)",
                      fontSize: 8.5,
                      lineHeight: "16px",
                      textAlign: "center",
                      letterSpacing: 0,
                      fontWeight: 700,
                      padding: "0 4px",
                    }}
                  >
                    {dueToday}
                  </span>
                )}
              </span>
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: active ? 600 : 500,
                  fontFamily: "var(--font-manrope), system-ui, sans-serif",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
