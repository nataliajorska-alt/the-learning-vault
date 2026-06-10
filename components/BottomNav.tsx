"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Library,
  GraduationCap,
  AlertTriangle,
  Wine,
} from "lucide-react";

const nav = [
  { href: "/", label: "Dziś", icon: LayoutGrid },
  { href: "/vaults", label: "Sekcje", icon: Library },
  { href: "/study", label: "Ucz", icon: GraduationCap },
  { href: "/errors", label: "Errata", icon: AlertTriangle },
  { href: "/salon", label: "Salon", icon: Wine },
];

export function BottomNav() {
  const pathname = usePathname();

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
      <div className="grid grid-cols-5">
        {nav.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-1 py-3"
              style={{
                color: active ? "var(--c-gold-300)" : "rgba(228,214,186,0.55)",
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
              <Icon className="w-5 h-5 stroke-[1.5]" />
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
