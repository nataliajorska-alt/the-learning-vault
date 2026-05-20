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

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const userDoc = useUserDoc();
  const streak = effectiveStreak(userDoc);
  const displayName =
    user?.displayName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "";

  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 w-sidebar bg-forest text-paper flex-col">
      <div className="px-7 pt-10 pb-12">
        <div className="eyebrow text-gold-2">The Learning</div>
        <div className="hero-italic text-3xl text-paper mt-1">Vault</div>
      </div>

      <nav className="flex-1 px-3">
        {nav.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-4 py-2.5 rounded text-sm transition-colors duration-200 ${
                active
                  ? "bg-forest-2 text-paper"
                  : "text-paper/75 hover:text-paper hover:bg-forest-2/60"
              }`}
            >
              <Icon className="w-4 h-4 stroke-[1.5]" />
              <span className="tracking-wide">{item.label}</span>
              {active && (
                <span className="ml-auto w-1 h-4 bg-gold rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-7 py-8 border-t border-cream/10">
        <div className="eyebrow text-gold-2">Streak</div>
        <div className="hero-italic text-2xl mt-1">
          {streak} {streak === 1 ? "dzień" : "dni"}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-paper/60">{displayName}</div>
          <button
            onClick={() => signOut()}
            className="text-paper/40 hover:text-paper/80 transition-colors"
            aria-label="Wyloguj"
          >
            <LogOut className="w-3.5 h-3.5 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </aside>
  );
}
