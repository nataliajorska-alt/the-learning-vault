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
  { href: "/errors", label: "Błędy", icon: AlertTriangle },
  { href: "/salon", label: "Salon", icon: Wine },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-forest text-paper border-t border-line z-50 backdrop-blur">
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
              className={`flex flex-col items-center justify-center gap-1 py-3 text-[10px] tracking-wide ${
                active ? "text-gold" : "text-paper/70"
              }`}
            >
              <Icon className="w-5 h-5 stroke-[1.5]" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
