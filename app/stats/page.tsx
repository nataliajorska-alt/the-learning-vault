"use client";

import { useMemo } from "react";
import { StatCard } from "@/components/ui/StatCard";
import {
  ActivityHeatmap,
  sessionsByDay,
} from "@/components/ActivityHeatmap";
import { AccuracyChart } from "@/components/AccuracyChart";
import {
  effectiveStreak,
  useAttempts,
  useSessions,
  useTopics,
  useUserDoc,
  useVaults,
} from "@/lib/firestore-data";
import type { Timestamp } from "firebase/firestore";

function toDate(v: unknown): Date {
  if (v instanceof Date) return v;
  if (v && typeof v === "object" && "toDate" in v) {
    return (v as Timestamp).toDate();
  }
  return new Date(0);
}

function isoDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function toRoman(n: number): string {
  if (n <= 0) return "—";
  const map: Array<[number, string]> = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let r = "";
  let x = n;
  for (const [v, s] of map) {
    while (x >= v) {
      r += s;
      x -= v;
    }
  }
  return r;
}

function plDni(n: number): string {
  return n === 1 ? "dzień" : "dni";
}

function plPytan(n: number): string {
  if (n === 1) return "pytanie";
  const d = n % 10;
  const h = n % 100;
  if (d >= 2 && d <= 4 && !(h >= 12 && h <= 14)) return "pytania";
  return "pytań";
}

function plOpanowane(n: number): string {
  if (n === 1) return "opanowany";
  const d = n % 10;
  const h = n % 100;
  if (d >= 2 && d <= 4 && !(h >= 12 && h <= 14)) return "opanowane";
  return "opanowanych";
}

/* Cream ledger sheet with a double gold-ruled frame — shared chrome for the
   attendance register and the ink chart. */
function LedgerSheet({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="tex-paper relative rounded-[3px] p-6 sm:p-8"
      style={{
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.45), 0 12px 28px -14px rgba(0,0,0,0.5), 0 24px 48px -28px rgba(0,0,0,0.4)",
      }}
    >
      {/* inline position:absolute — .tex-paper > * forces relative on children
          and would override the Tailwind class (same trap as the session ribbon) */}
      <div
        className="pointer-events-none"
        style={{
          position: "absolute",
          inset: "0.6rem",
          border: "1px solid rgba(122,92,40,0.42)",
          borderRadius: "2px",
        }}
      />
      <div
        className="pointer-events-none"
        style={{
          position: "absolute",
          inset: "0.8rem",
          border: "1px solid rgba(122,92,40,0.22)",
          borderRadius: "2px",
        }}
      />
      {children}
    </div>
  );
}

export default function StatsPage() {
  const topics = useTopics();
  const vaults = useVaults();
  const userDoc = useUserDoc();
  const sessions90 = useSessions(90);
  const attempts30 = useAttempts(30);

  const loading =
    topics === null ||
    vaults === null ||
    sessions90 === null ||
    attempts30 === null;

  const streak = effectiveStreak(userDoc);
  const longest = userDoc?.longestStreak ?? 0;

  const totalAttempts = topics?.reduce((s, t) => s + t.totalAttempts, 0) ?? 0;
  const totalCorrect = topics?.reduce((s, t) => s + t.totalCorrect, 0) ?? 0;
  const overallAccuracy =
    totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const mastered = topics?.filter((t) => t.status === "mastered").length ?? 0;
  const now = Date.now();
  const dueNow =
    topics?.filter((t) => {
      const d = toDate(t.nextReview).getTime();
      return t.status === "fresh" || t.status === "struggling" || d <= now;
    }).length ?? 0;
  const fragileMastery =
    topics?.filter(
      (t) =>
        t.status === "mastered" &&
        ((t.correctStreak ?? 0) <= 4 || (t.interval ?? 0) < 45)
    ).length ?? 0;

  // Session aggregates
  const sessionsAgg = useMemo(() => {
    if (!sessions90)
      return {
        count: 0,
        totalDuration: 0,
        avgDuration: 0,
        totalQuestions: 0,
      };
    const finished = sessions90.filter((s) => s.endedAt);
    const totalDuration = finished.reduce((s, x) => s + (x.duration ?? 0), 0);
    const totalQuestions = finished.reduce(
      (s, x) => s + (x.questionsAttempted ?? 0),
      0
    );
    return {
      count: finished.length,
      totalDuration,
      avgDuration:
        finished.length > 0 ? Math.round(totalDuration / finished.length) : 0,
      totalQuestions,
    };
  }, [sessions90]);

  const heatmapData = useMemo(
    () => (sessions90 ? sessionsByDay(sessions90) : {}),
    [sessions90]
  );

  // Accuracy points — last 30 days
  const accuracyPoints = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const buckets = new Map<string, { correct: number; total: number }>();
    for (const a of attempts30 ?? []) {
      const d = toDate(a.createdAt);
      d.setHours(0, 0, 0, 0);
      const key = isoDay(d);
      const b = buckets.get(key) ?? { correct: 0, total: 0 };
      b.total += 1;
      if (a.isCorrect) b.correct += 1;
      buckets.set(key, b);
    }
    const points: { iso: string; pct: number | null; attempts: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = isoDay(d);
      const b = buckets.get(key);
      points.push({
        iso: key,
        pct: b && b.total > 0 ? Math.round((b.correct / b.total) * 100) : null,
        attempts: b?.total ?? 0,
      });
    }
    return points;
  }, [attempts30]);

  // Top sections by mastered count
  const topVaults = useMemo(() => {
    if (!topics || !vaults) return [];
    const counts = new Map<string, number>();
    for (const t of topics) {
      if (t.status === "mastered") {
        counts.set(t.vaultId, (counts.get(t.vaultId) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([vaultId, count]) => ({
        vault: vaults.find((v) => v.id === vaultId),
        count,
      }))
      .filter((x) => x.vault);
  }, [topics, vaults]);

  // Hardest topics — top 5 by absolute wrong count
  const hardestTopics = useMemo(() => {
    if (!topics) return [];
    return [...topics]
      .filter((t) => t.totalAttempts > 0)
      .map((t) => ({ ...t, wrongs: t.totalAttempts - t.totalCorrect }))
      .sort((a, b) => b.wrongs - a.wrongs)
      .slice(0, 5)
      .filter((t) => t.wrongs > 0);
  }, [topics]);

  const weakSkills = useMemo(() => {
    const buckets = new Map<string, { total: number; wrong: number }>();
    for (const a of attempts30 ?? []) {
      const skill = a.skill?.trim();
      if (!skill) continue;
      const cur = buckets.get(skill) ?? { total: 0, wrong: 0 };
      cur.total += 1;
      if (!a.isCorrect) cur.wrong += 1;
      buckets.set(skill, cur);
    }
    return [...buckets.entries()]
      .map(([skill, b]) => ({
        skill,
        total: b.total,
        wrong: b.wrong,
        pct: b.total > 0 ? Math.round((b.wrong / b.total) * 100) : 0,
      }))
      .filter((x) => x.wrong > 0)
      .sort((a, b) => b.pct - a.pct || b.wrong - a.wrong)
      .slice(0, 4);
  }, [attempts30]);

  const curatorNote = useMemo(() => {
    if (dueNow > 0) {
      return `${dueNow} ${dueNow === 1 ? "temat jest" : "tematów jest"} gotowych do powtórki. Najlepszy ruch: jedna sesja mix, zanim kolejka urośnie.`;
    }
    if (fragileMastery > 0) {
      return `${fragileMastery} ${fragileMastery === 1 ? "opanowany temat jest jeszcze kruchy" : "opanowane tematy są jeszcze kruche"}. Dobry moment na spokojny Salon albo krótką kontrolę.`;
    }
    if (sessionsAgg.count === 0) {
      return "Gabinet jest pusty w tym oknie. Zacznij od minimum day: trzy pytania wystarczą, żeby zbudować ślad.";
    }
    return "Rytm jest czysty. Kolejna dobra decyzja to utrzymać krótką, regularną sesję zamiast dokładać ciężar.";
  }, [dueNow, fragileMastery, sessionsAgg.count]);

  return (
    <div className="space-y-12">
      <header>
        <div className="eyebrow">Statystyki · Twój rytm</div>
        <h1 className="hero-italic text-4xl mt-2">Gabinet osiągnięć</h1>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5">
        <LedgerSheet>
          <div className="book-eyebrow">Nota kuratora</div>
          <p
            className="font-display italic mt-4"
            style={{
              color: "#1B1108",
              fontSize: "clamp(25px, 4vw, 36px)",
              lineHeight: 1.08,
              fontWeight: 600,
            }}
          >
            {curatorNote}
          </p>
        </LedgerSheet>
        <LedgerSheet>
          <div className="book-eyebrow">Ryzyko zapomnienia</div>
          <div className="mt-5 space-y-3">
            <LedgerMetric label="W kolejce dziś" value={dueNow} />
            <LedgerMetric label="Krucha mastery" value={fragileMastery} />
            <LedgerMetric label="Sesje w 90 dni" value={sessionsAgg.count} />
          </div>
          {weakSkills.length > 0 && (
            <div style={{ marginTop: 22, paddingTop: 16, borderTop: "0.5px dashed rgba(27,17,8,0.20)" }}>
              <div className="book-eyebrow">Kruche pojęcia</div>
              <div className="mt-3 space-y-2">
                {weakSkills.map((s) => (
                  <div key={s.skill} className="flex items-baseline gap-3">
                    <span
                      className="signature"
                      style={{ color: "rgba(27,17,8,0.58)", flex: 1 }}
                    >
                      {s.skill}
                    </span>
                    <span
                      className="font-display italic"
                      style={{ color: "#8B2E1F", fontSize: 21, lineHeight: 1 }}
                    >
                      {s.wrong}/{s.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </LedgerSheet>
      </section>

      {/* --- Ściana plakiet -------------------------------------------- */}
      <section className="space-y-4">
        {/* Grand plaque — the streak, engraved in roman numerals */}
        <div
          className="brass-plaque text-center"
          style={{ padding: "1.9rem 1.5rem 2rem" }}
        >
          <div className="brass-label">Passa · dni z rzędu</div>
          <div
            className="brass-value"
            style={{
              fontSize: "3.4rem",
              lineHeight: 1.05,
              marginTop: "0.45rem",
            }}
          >
            {toRoman(streak)}
          </div>
          <div className="brass-hint" style={{ marginTop: "0.65rem" }}>
            {streak === 0
              ? "Gabinet czeka. Zacznij dziś."
              : longest > streak
              ? `${streak} ${plDni(streak)} · rekord: ${longest} ${plDni(longest)}`
              : `${streak} ${plDni(streak)} · to twój rekord`}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Trafność"
            value={`${overallAccuracy}%`}
            hint={`z ${totalAttempts} prób`}
          />
          <StatCard
            label="Opanowane"
            value={`${mastered} / ${topics?.length ?? 0}`}
          />
          <StatCard
            label="Sesje (90 dni)"
            value={sessionsAgg.count}
            hint={
              sessionsAgg.avgDuration > 0
                ? `średnio ${Math.round(sessionsAgg.avgDuration / 60)} min`
                : undefined
            }
          />
        </div>
      </section>

      {/* --- Rejestr obecności (heatmapa na papierze) ------------------- */}
      <section>
        <div className="eyebrow mb-3">Rejestr obecności · 90 dni</div>
        {loading ? (
          <p className="hero-italic text-2xl text-muted animate-candle">
            Ładuję...
          </p>
        ) : (
          <LedgerSheet>
            <div className="book-eyebrow">Liber praesentiae</div>
            <div className="mt-4">
              <ActivityHeatmap data={heatmapData} />
            </div>
            <div
              className="flex items-center gap-3 mt-5 text-xs"
              style={{ color: "#6b4a26" }}
            >
              <span>mniej</span>
              <div className="flex gap-1">
                {[0, 0.35, 0.55, 0.75, 0.92].map((a, i) => (
                  <span
                    key={a}
                    className="inline-block w-2.5 h-2.5 rounded-[2px]"
                    style={{
                      background:
                        i === 0
                          ? "rgba(60,40,20,0.07)"
                          : `rgba(146,112,55,${a})`,
                      border:
                        i === 0
                          ? "0.5px solid rgba(60,40,20,0.15)"
                          : "0.5px solid rgba(107,74,38,0.35)",
                    }}
                  />
                ))}
              </div>
              <span>więcej</span>
            </div>
          </LedgerSheet>
        )}
      </section>

      {/* --- Linia atramentu (trafność) --------------------------------- */}
      <section>
        <div className="eyebrow mb-3">Linia atramentu · trafność 30 dni</div>
        {loading ? (
          <p className="hero-italic text-2xl text-muted animate-candle">
            Ładuję...
          </p>
        ) : (
          <LedgerSheet>
            <div className="book-eyebrow">Curva diligentiae</div>
            <div className="mt-4">
              <AccuracyChart points={accuracyPoints} />
            </div>
          </LedgerSheet>
        )}
      </section>

      {/* --- Tablica honorowa + karty erraty ----------------------------- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <div className="eyebrow mb-3">Tablica honorowa</div>
          <div className="brass-plaque" style={{ padding: "1.25rem 1.5rem" }}>
            {topVaults.length === 0 ? (
              <p className="brass-hint" style={{ marginTop: 0 }}>
                Nic jeszcze nie opanowane. Pierwsza plakieta czeka.
              </p>
            ) : (
              <ol>
                {topVaults.map((tv, i) => (
                  <li
                    key={tv.vault!.id}
                    className="flex items-baseline gap-4 py-3"
                    style={{
                      borderBottom:
                        i < topVaults.length - 1
                          ? "1px solid rgba(184,146,77,0.14)"
                          : "none",
                    }}
                  >
                    <span
                      className="signature"
                      style={{
                        color: "rgba(201,169,97,0.6)",
                        minWidth: "2rem",
                      }}
                    >
                      {toRoman(i + 1)}
                    </span>
                    <span
                      className="hero-italic text-xl flex-1"
                      style={{ color: "#C9A961" }}
                    >
                      {tv.vault!.name}
                    </span>
                    <span
                      className="signature"
                      style={{ color: "rgba(232,223,204,0.5)" }}
                    >
                      {tv.count} {plOpanowane(tv.count)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <div>
          <div className="eyebrow mb-3">Karty erraty · najtrudniejsze</div>
          {hardestTopics.length === 0 ? (
            <p className="text-sm text-muted hero-italic">
              Nic ci się nie opiera. Na razie.
            </p>
          ) : (
            <ul className="space-y-3">
              {hardestTopics.map((t) => (
                <li
                  key={t.id}
                  className="tex-paper relative rounded-[2px] px-4 py-3 flex items-baseline gap-3"
                  style={{
                    borderLeft: "3px solid rgba(139,46,31,0.55)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 14px -8px rgba(0,0,0,0.5)",
                  }}
                >
                  <div
                    className="hero-italic text-lg flex-1"
                    style={{ color: "#1f1208" }}
                  >
                    {t.title}
                  </div>
                  <div
                    className="signature whitespace-nowrap"
                    style={{ color: "#8B2E1F" }}
                    title={`${t.wrongs} błędnych z ${t.totalAttempts} prób`}
                  >
                    {t.wrongs} / {t.totalAttempts}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* --- Kolofon (suma summarum) ------------------------------------- */}
      <section className="pt-2 pb-4">
        <div className="ornament-sep hero-italic text-xl">❦</div>
        <p
          className="signature text-center uppercase mt-5"
          style={{ color: "rgba(201,169,97,0.75)", letterSpacing: "0.18em" }}
        >
          {sessionsAgg.totalQuestions} {plPytan(sessionsAgg.totalQuestions)} ·{" "}
          {formatDuration(sessionsAgg.totalDuration)} nauki
          {sessionsAgg.avgDuration > 0 &&
            ` · średnia sesja ${Math.round(sessionsAgg.avgDuration / 60)} min`}
        </p>
        <p
          className="signature text-center mt-2"
          style={{ color: "rgba(201,169,97,0.4)", letterSpacing: "0.22em" }}
        >
          EX ARCHIVO · 90 DIES
        </p>
      </section>
    </div>
  );
}

function LedgerMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="signature" style={{ color: "rgba(27,17,8,0.55)", flex: 1 }}>
        {label}
      </span>
      <span
        className="font-display italic"
        style={{ color: "#1B1108", fontSize: 28, lineHeight: 1 }}
      >
        {value}
      </span>
    </div>
  );
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem === 0 ? `${hours} h` : `${hours} h ${rem} min`;
}
