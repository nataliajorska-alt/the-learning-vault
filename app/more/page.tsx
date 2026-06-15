"use client";

import { useState } from "react";
import Link from "next/link";
import { LineChart, Sparkles, LogOut, ChevronRight, Download } from "lucide-react";
import { useAuth, useUser } from "@/lib/auth-context";
import {
  effectiveStreak,
  exportAllData,
  useUserDoc,
} from "@/lib/firestore-data";

function plDni(n: number): string {
  return n === 1 ? "dzień" : "dni";
}

const LINKS = [
  {
    href: "/stats",
    label: "Statystyki",
    desc: "Gabinet osiągnięć — passa, trafność, rejestr obecności",
    icon: LineChart,
  },
  {
    href: "/admin",
    label: "Admin",
    desc: "Wklej notatki i wygeneruj nowy temat",
    icon: Sparkles,
  },
];

export default function MorePage() {
  const { signOut } = useAuth();
  const user = useUser();
  const userDoc = useUserDoc();
  const streak = effectiveStreak(userDoc);
  const displayName =
    user?.displayName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "Czytelniczka";
  const initial = (displayName?.[0] ?? "·").toUpperCase();
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    if (!user || exporting) return;
    setExporting(true);
    try {
      const data = await exportAllData(user.uid);
      const stamp = new Date().toISOString().slice(0, 10);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `learning-vault-backup-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert("Nie udało się wyeksportować zbioru. Spróbuj ponownie.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-10 pb-6">
      <header>
        <div className="eyebrow">Twoje konto</div>
        <h1 className="hero-italic text-4xl mt-2">Karta czytelnika</h1>
      </header>

      <div
        className="brass-plaque flex items-center gap-5"
        style={{ padding: "1.25rem 1.5rem" }}
      >
        <div
          className="font-display italic font-medium flex items-center justify-center shrink-0"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, #d9b878, #6a4a1c 70%, #2a1808)",
            color: "#1B1108",
            fontSize: 22,
            boxShadow:
              "inset 0 1px 0 rgba(255,235,180,0.4), 0 2px 4px rgba(0,0,0,0.4)",
          }}
        >
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="hero-italic text-xl truncate" style={{ color: "#C9A961" }}>
            {displayName}
          </div>
          <div className="brass-hint truncate" style={{ marginTop: "0.2rem" }}>
            {user?.email}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="brass-label">Passa</div>
          <div className="brass-value" style={{ fontSize: "1.75rem", marginTop: "0.2rem" }}>
            {streak}
          </div>
          <div className="brass-hint">{plDni(streak)}</div>
        </div>
      </div>

      <div className="space-y-3">
        {LINKS.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className="card card-hover flex items-center gap-4"
            >
              <Icon className="w-5 h-5 text-gold shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="hero-italic text-lg">{l.label}</div>
                <div className="text-xs text-muted mt-0.5">{l.desc}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted shrink-0" />
            </Link>
          );
        })}
      </div>

      <button
        onClick={handleExport}
        disabled={exporting}
        className="btn-ghost w-full"
      >
        <Download className="w-4 h-4" />
        {exporting ? "Eksportuję…" : "Eksportuj zbiór (kopia JSON)"}
      </button>

      <button onClick={() => signOut()} className="btn-ghost w-full">
        <LogOut className="w-4 h-4" />
        Wyloguj się
      </button>
    </div>
  );
}
