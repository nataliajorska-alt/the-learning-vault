"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Sparkles,
  LogOut,
  ChevronRight,
  Download,
  Search,
} from "lucide-react";
import { useAuth, useUser } from "@/lib/auth-context";
import {
  effectiveStreak,
  exportAllData,
  getSessionCount,
  useSessions,
  useUserDoc,
} from "@/lib/firestore-data";
import { streakNarrative } from "@/lib/streak";

function plDni(n: number): string {
  return n === 1 ? "dzień" : "dni";
}

const MONTHS_PL = [
  "STY", "LUT", "MAR", "KWI", "MAJ", "CZE",
  "LIP", "SIE", "WRZ", "PAŹ", "LIS", "GRU",
];

/* Kolejne stemple lekko skręcone, jak przybijane ręcznie. */
const STAMP_ROTATES = [-3, 2, -1.5, 3, -2];

const ROMAN_CHAPTERS = ["I", "II", "III", "IV", "V"];

function toDateMs(v: Date | { toDate(): Date } | null): number {
  if (!v) return 0;
  return v instanceof Date ? v.getTime() : v.toDate().getTime();
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
  const [exporting, setExporting] = useState(false);

  /* Karta czytelnika: stemple ostatnich wizyt + licznik wypożyczeń + rozdział passy */
  const sessions30 = useSessions(30);
  const [totalSessions, setTotalSessions] = useState<number | null>(null);
  useEffect(() => {
    if (!user) return;
    getSessionCount(user.uid)
      .then(setTotalSessions)
      .catch(() => {});
  }, [user]);

  const stampDays = useMemo(() => {
    if (!sessions30) return null;
    const seen = new Set<string>();
    const days: Date[] = [];
    const sorted = [...sessions30].sort(
      (a, b) => toDateMs(b.startedAt) - toDateMs(a.startedAt)
    );
    for (const s of sorted) {
      const d = new Date(toDateMs(s.startedAt));
      if (!d.getTime()) continue;
      d.setHours(0, 0, 0, 0);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      days.push(d);
      if (days.length === 5) break;
    }
    return days.reverse();
  }, [sessions30]);

  const narrative = streakNarrative(streak);

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
        className="tex-paper tex-noise-fine relative"
        style={{
          padding: "22px 24px 20px",
          boxShadow:
            "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 18px 36px -14px rgba(0,0,0,0.7)",
        }}
      >
        <div
          className="flex items-baseline justify-between flex-wrap"
          style={{ gap: 12 }}
        >
          <span
            className="eyebrow"
            style={{ color: "rgba(122,74,31,0.75)", fontSize: 9 }}
          >
            Rejestr czytelni
          </span>
          <div className="text-right min-w-0">
            <div
              className="font-display italic truncate"
              style={{ fontSize: 22, color: "#1B1108" }}
            >
              {displayName}
            </div>
            <div
              className="signature truncate"
              style={{ fontSize: 10, color: "rgba(27,17,8,0.55)" }}
            >
              {user?.email}
            </div>
          </div>
        </div>

        <div
          className="rule-gold"
          style={{ height: 0.5, margin: "14px 0 16px", opacity: 0.7 }}
        />

        {stampDays && stampDays.length > 0 ? (
          <div
            className="flex flex-wrap items-center"
            style={{ gap: 10 }}
            role="img"
            aria-label={`Stemple ostatnich wizyt: ${stampDays
              .map((d) =>
                d.toLocaleDateString("pl-PL", { day: "numeric", month: "long" })
              )
              .join(", ")}`}
          >
            {stampDays.map((d, i) => {
              const color = i % 2 === 0 ? "#8B2E1F" : "#1f3a26";
              return (
                <span
                  key={d.getTime()}
                  aria-hidden
                  style={{
                    transform: `rotate(${STAMP_ROTATES[i % STAMP_ROTATES.length]}deg)`,
                    border: `1.5px solid ${color}`,
                    color,
                    fontFamily:
                      '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    padding: "4px 8px 3px",
                    opacity: 0.85,
                    whiteSpace: "nowrap",
                  }}
                >
                  {String(d.getDate()).padStart(2, "0")} {MONTHS_PL[d.getMonth()]}
                </span>
              );
            })}
          </div>
        ) : (
          <p
            className="signature"
            style={{
              fontSize: 11,
              fontStyle: "italic",
              color: "rgba(27,17,8,0.55)",
            }}
          >
            {stampDays
              ? "Pierwsze stemple pojawią się po sesjach w czytelni."
              : "…"}
          </p>
        )}

        <div
          className="flex items-baseline justify-between flex-wrap"
          style={{
            borderTop: "0.5px dashed rgba(27,17,8,0.24)",
            marginTop: 16,
            paddingTop: 12,
            gap: 10,
          }}
        >
          <span
            className="signature"
            style={{ fontSize: 11, color: "rgba(27,17,8,0.62)" }}
          >
            Wypożyczeń: {totalSessions ?? "—"}
          </span>
          <span
            className="signature"
            style={{ fontSize: 11, color: "rgba(27,17,8,0.62)" }}
          >
            Passa: {streak} {plDni(streak)}
          </span>
          <span
            className="signature"
            style={{ fontSize: 11, color: "rgba(27,17,8,0.62)" }}
          >
            {narrative.next != null && narrative.toNext != null
              ? `Rozdział ${
                  ROMAN_CHAPTERS[narrative.chapter] ?? narrative.chapter + 1
                } za ${narrative.toNext} ${plDni(narrative.toNext)}`
              : "Wszystkie rozdziały zdobyte"}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("open-command-palette"))
          }
          className="card card-hover flex items-center gap-4 w-full text-left"
        >
          <Search className="w-5 h-5 text-gold shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="hero-italic text-lg">Szukaj w zbiorze</div>
            <div className="text-xs text-muted mt-0.5">
              Tematy i sekcje · ⌘K
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted shrink-0" />
        </button>
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
