"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Library,
  GraduationCap,
  AlertTriangle,
  Wine,
  LineChart,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { effectiveStreak, useUserDoc } from "@/lib/firestore-data";

const nav = [
  { href: "/", label: "Dziś", icon: LayoutGrid },
  { href: "/vaults", label: "Sekcje", icon: Library },
  { href: "/study", label: "Ucz mnie", icon: GraduationCap },
  { href: "/errors", label: "Error Vault", icon: AlertTriangle },
  { href: "/salon", label: "Salon", icon: Wine },
  { href: "/stats", label: "Statystyki", icon: LineChart },
  { href: "/admin", label: "Admin", icon: Sparkles },
];

export function TopNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const userDoc = useUserDoc();
  const streak = effectiveStreak(userDoc);
  const displayName =
    user?.displayName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "";

  return (
    <header className="hidden md:block fixed top-0 inset-x-0 z-40 bg-forest/95 backdrop-blur border-b border-line">
      <div className="max-w-content mx-auto px-12 h-topnav flex items-center gap-8">
        <Link href="/" className="flex items-baseline gap-3 shrink-0 group">
          <span className="eyebrow text-gold-2 group-hover:text-gold transition-colors">
            The Learning
          </span>
          <span className="hero-italic text-2xl text-paper leading-none">
            Vault
          </span>
        </Link>

        <nav className="flex items-center gap-1 flex-1 overflow-x-auto">
          {nav.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-all duration-200 whitespace-nowrap ${
                  active
                    ? "text-gold"
                    : "text-paper/65 hover:text-paper hover:bg-forest-2/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5 stroke-[1.5]" />
                <span className="tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden lg:flex flex-col items-end leading-tight">
            <div className="text-[9px] uppercase tracking-eyebrow text-gold-2/80">
              Streak
            </div>
            <div className="hero-italic text-base text-paper">
              {streak} {streak === 1 ? "dzień" : "dni"}
            </div>
          </div>
          <div className="text-xs text-paper/50 hidden lg:block">{displayName}</div>
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
