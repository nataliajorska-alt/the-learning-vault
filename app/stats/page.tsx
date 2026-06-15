"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { sessionsByDay } from "@/components/ActivityHeatmap";
import {
  effectiveStreak,
  useAttempts,
  useSessions,
  useTopics,
  useUserDoc,
  useVaults,
} from "@/lib/firestore-data";
import { graceAvailable } from "@/lib/streak";
import { plPlural } from "@/lib/plural";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import type { Timestamp } from "firebase/firestore";

/* ---------- helpers ---------------------------------------------------- */

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

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem === 0 ? `${hours} h` : `${hours} h ${rem} min`;
}

const MONTHS_PL_SHORT = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
const MONTHS_PL_MINI = ["sty","lut","mar","kwi","maj","cze","lip","sie","wrz","paź","lis","gru"];
const MONTHS_PL_LONG = [
  "stycznia","lutego","marca","kwietnia","maja","czerwca",
  "lipca","sierpnia","września","października","listopada","grudnia",
];
const WEEKDAYS_PL = ["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"];

const HEAT_WEEKS = 13;
const HEAT_DAYS = ["P", "", "Ś", "", "P", "", "N"];

/* Monday HEAT_WEEKS-1 weeks back — left edge of the attendance register */
function heatmapStart(today: Date): Date {
  const start = new Date(today);
  const dow = (start.getDay() + 6) % 7; // 0 = poniedziałek
  start.setDate(start.getDate() - dow - 7 * (HEAT_WEEKS - 1));
  return start;
}

/* ---------- Page -------------------------------------------------------- */

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
  const lastGrace = userDoc?.lastGraceAt ? toDate(userDoc.lastGraceAt) : null;
  const graceReady = graceAvailable(lastGrace, new Date());

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
      return { count: 0, totalDuration: 0, avgDuration: 0, totalQuestions: 0 };
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

  // Najgęstszy tydzień rejestru — suma sesji per kolumna heatmapy
  const densestWeek = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = heatmapStart(today);
    let best: { monday: Date; n: number } | null = null;
    for (let w = 0; w < HEAT_WEEKS; w++) {
      const monday = new Date(start);
      monday.setDate(start.getDate() + w * 7);
      let n = 0;
      for (let d = 0; d < 7; d++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + d);
        n += heatmapData[isoDay(date)] ?? 0;
      }
      if (n > 0 && (!best || n > best.n)) best = { monday, n };
    }
    if (!best) return null;
    return `Najgęstszy tydzień: ${best.monday.getDate()} ${MONTHS_PL_LONG[best.monday.getMonth()]} — ${best.n} ${plPlural(best.n, "sesja", "sesje", "sesji")}.`;
  }, [heatmapData]);

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
      .map(([skill, b]) => ({ skill, total: b.total, wrong: b.wrong }))
      .filter((x) => x.wrong > 0)
      .sort(
        (a, b) =>
          b.wrong / b.total - a.wrong / a.total || b.wrong - a.wrong
      )
      .slice(0, 4);
  }, [attempts30]);

  // Nota kuratora — wielka cyfra + rada, zależnie od stanu zbioru
  const nota = useMemo(() => {
    if (dueNow > 0) {
      return {
        num: dueNow,
        label: plPlural(dueNow, "temat gotowy", "tematy gotowe", "tematów gotowych"),
        advice: "Najlepszy ruch: jedna sesja mix, zanim kolejka urośnie.",
      };
    }
    if (fragileMastery > 0) {
      return {
        num: fragileMastery,
        label: plPlural(fragileMastery, "kruchy temat", "kruche tematy", "kruchych tematów"),
        advice: "Dobry moment na spokojny Salon albo krótką kontrolę.",
      };
    }
    if (sessionsAgg.count === 0) {
      return {
        num: 0,
        label: "sesji w oknie",
        advice: "Zacznij od minimum day: trzy pytania wystarczą, żeby zbudować ślad.",
      };
    }
    return {
      num: sessionsAgg.count,
      label: plPlural(sessionsAgg.count, "sesja w 90 dni", "sesje w 90 dni", "sesji w 90 dni"),
      advice: "Rytm jest czysty. Utrzymaj krótką, regularną sesję zamiast dokładać ciężar.",
    };
  }, [dueNow, fragileMastery, sessionsAgg.count]);

  const passaNote =
    streak === 0
      ? longest > 0
        ? "Rozdział zamknięty. Czas otworzyć nowy."
        : "Gabinet czeka. Zacznij dziś."
      : longest > streak
      ? `rekord: ${longest} ${plPlural(longest, "dzień", "dni", "dni")}`
      : "to twój rekord";

  const miary = [
    {
      key: "passa",
      label: "Passa",
      value: String(streak),
      unit: plPlural(streak, "dzień", "dni", "dni"),
      note: passaNote,
    },
    {
      key: "trafnosc",
      label: "Trafność",
      value: String(overallAccuracy),
      unit: "%",
      note: `z ${totalAttempts} ${plPlural(totalAttempts, "próby", "prób", "prób")}`,
    },
    {
      key: "opanowane",
      label: "Opanowane",
      value: String(mastered),
      unit: `/ ${topics?.length ?? 0}`,
      note: "plakiet w tablicy honorowej",
    },
    {
      key: "sesje",
      label: "Sesje",
      value: String(sessionsAgg.count),
      unit: "",
      note:
        sessionsAgg.avgDuration > 0
          ? `90 dni · średnio ${Math.round(sessionsAgg.avgDuration / 60)} min`
          : "w oknie 90 dni",
    },
  ];

  const rejestrSummary = [
    { label: "Sesje", value: String(sessionsAgg.count) },
    { label: "Pytania", value: String(sessionsAgg.totalQuestions) },
    { label: "Czas nauki", value: formatDuration(sessionsAgg.totalDuration) },
    {
      label: "Średnia sesja",
      value:
        sessionsAgg.avgDuration > 0
          ? `${Math.round(sessionsAgg.avgDuration / 60)} min`
          : "—",
    },
  ];

  return (
    <div className="page-bleed -mt-10 md:-mt-12 relative overflow-hidden anim-on">
      {/* top light spill — jak w Dziś, oddycha (reduced-motion: statyczne) */}
      <div
        aria-hidden
        className="candle-glow absolute pointer-events-none"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: 600,
          background:
            "radial-gradient(ellipse 55% 70% at 50% 0%, rgba(255,210,160,0.10), transparent 70%)",
          zIndex: 0,
        }}
      />

      <div className="relative max-w-content mx-auto" style={{ zIndex: 1 }}>
        <Hero />

        {loading ? (
          <div style={{ padding: "0 24px 48px" }}>
            <PageSkeleton header={false} rows={3} />
          </div>
        ) : (
          <>
            {/* Pas 1 — nota kuratora + ryzyko zapomnienia */}
            <div style={{ padding: "8px 24px 0" }}>
              <div className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: 24 }}>
                <NotaKuratora nota={nota} />
                <RyzykoZapomnienia
                  rows={[
                    { label: "W kolejce dziś", value: String(dueNow), strong: dueNow > 0 },
                    { label: "Krucha mastery", value: String(fragileMastery) },
                    { label: "Sesje w 90 dni", value: String(sessionsAgg.count) },
                  ]}
                  weakSkills={weakSkills}
                  footnote={
                    dueNow > 0
                      ? "Kolejka rośnie z każdym dniem bez powtórek."
                      : "Kolejka czysta — nowe powtórki wrócą z kalendarzem."
                  }
                />
              </div>
            </div>

            {/* Pas 2 — miary */}
            <div style={{ marginTop: 56 }}>
              <RuleHeader left="Miary" right="passa · trafność · plakiety · sesje" />
              <MiaryBand miary={miary} graceReady={graceReady} />
            </div>

            {/* Pas 3 — rejestr obecności */}
            <div style={{ marginTop: 64 }}>
              <RejestrObecnosci
                data={heatmapData}
                summary={rejestrSummary}
                densest={densestWeek}
              />
            </div>

            {/* Pas 4 — linia atramentu */}
            <div style={{ marginTop: 64 }}>
              <LiniaAtramentu points={accuracyPoints} />
            </div>

            {/* Pas 5 — tablica honorowa + karty erraty */}
            <div style={{ marginTop: 64, padding: "0 24px" }}>
              <div className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: 24 }}>
                <TablicaHonorowa
                  topVaults={topVaults}
                  mastered={mastered}
                  total={topics?.length ?? 0}
                />
                <KartyErraty
                  items={hardestTopics.map((t, i) => ({
                    id: t.id,
                    n: String(i + 1).padStart(2, "0"),
                    title: t.title,
                    got: t.totalCorrect,
                    total: t.totalAttempts,
                  }))}
                />
              </div>
            </div>

            <div style={{ marginTop: 64 }}>
              <OrnamentDivider />
            </div>
            <Kolofon
              questions={sessionsAgg.totalQuestions}
              durationLabel={formatDuration(sessionsAgg.totalDuration)}
              avgMin={
                sessionsAgg.avgDuration > 0
                  ? Math.round(sessionsAgg.avgDuration / 60)
                  : 0
              }
            />
          </>
        )}

        <PageFooter />
      </div>
    </div>
  );
}

/* ============================================================
   Hero — zwięzły, z hederą jak na pozostałych stronach v2
   ============================================================ */

function Hero() {
  return (
    <div className="flex items-end justify-between flex-wrap gap-6" style={{ padding: "56px 24px 32px" }}>
      <div style={{ maxWidth: 720 }}>
        <div
          className="eyebrow flex items-center"
          style={{ color: "var(--c-gold-400)", marginBottom: 16, opacity: 0.92, gap: 12 }}
        >
          <span
            style={{
              display: "inline-block",
              width: 22,
              height: 1,
              background: "var(--c-gold-500)",
              opacity: 0.55,
            }}
          />
          Statystyki · Twój rytm
        </div>
        <h1
          className="font-display italic"
          style={{
            fontSize: "clamp(40px, 6vw, 64px)",
            lineHeight: 0.94,
            letterSpacing: "-0.02em",
            color: "var(--c-paper-100)",
            fontWeight: 600,
            marginBottom: 18,
          }}
        >
          Gabinet osiągnięć
        </h1>
        <p
          className="lead"
          style={{
            color: "var(--c-paper-300)",
            opacity: 0.78,
            maxWidth: 560,
            textWrap: "pretty",
          }}
        >
          Rejestr obecności, krzywa trafności i tablica honorowa.{" "}
          <em
            className="font-display italic"
            style={{ color: "var(--c-gold-300)", fontSize: 21 }}
          >
            Ex archivo, 90 dies.
          </em>
        </p>
      </div>
      {/* hedera — znak wodny, jak w Salonie */}
      <div
        aria-hidden
        className="relative flex flex-col items-center justify-center"
        style={{ marginRight: 32, paddingBottom: 8 }}
      >
        <div
          className="absolute"
          style={{
            inset: "-30px -70px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(184,146,77,0.10), transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <span
          className="font-display relative"
          style={{
            fontSize: 136,
            lineHeight: 1,
            color: "var(--c-gold-600)",
            opacity: 0.34,
            transform: "rotate(-90deg)",
            display: "block",
          }}
        >
          ☙
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   Rule headers
   ============================================================ */

function RuleHeader({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex items-center" style={{ gap: 16, padding: "0 24px" }}>
      <span
        className="eyebrow"
        style={{ color: "var(--c-gold-400)", letterSpacing: "0.28em", whiteSpace: "nowrap" }}
      >
        ✦ {left}
      </span>
      <div style={{ flex: 1, height: 0.5, background: "rgba(184,146,77,0.35)" }} />
      <span
        className="signature"
        style={{ color: "var(--c-paper-300)", opacity: 0.6, fontSize: 11, whiteSpace: "nowrap" }}
      >
        {right}
      </span>
    </div>
  );
}

function RuleHeaderInline({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex items-center" style={{ gap: 14 }}>
      <span
        className="eyebrow"
        style={{
          color: "var(--c-gold-400)",
          letterSpacing: "0.28em",
          whiteSpace: "nowrap",
          fontSize: 10,
        }}
      >
        ✦ {left}
      </span>
      <div style={{ flex: 1, height: 0.5, background: "rgba(184,146,77,0.35)" }} />
      <span
        className="signature"
        style={{ color: "var(--c-paper-300)", opacity: 0.6, fontSize: 11, whiteSpace: "nowrap" }}
      >
        {right}
      </span>
    </div>
  );
}

/* ============================================================
   Pas 1 — Nota kuratora (lak K) + Ryzyko zapomnienia (rejestr)
   ============================================================ */

function CuratorSeal({ size = 64, label = "K" }: { size?: number; label?: string }) {
  return (
    <div
      aria-hidden
      className="relative"
      style={{ width: size, height: size, transform: "rotate(-7deg)" }}
    >
      {/* aureola tłuszczu wokół laku na papierze */}
      <div
        className="absolute"
        style={{
          inset: -10,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(90,20,12,0.14), transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute"
        style={{
          inset: 0,
          clipPath:
            "polygon(50% 0%, 64% 4%, 78% 10%, 90% 22%, 96% 38%, 100% 52%, 95% 68%, 86% 82%, 72% 92%, 56% 98%, 40% 99%, 24% 92%, 12% 80%, 4% 64%, 1% 48%, 6% 32%, 14% 18%, 28% 8%, 42% 2%)",
          background:
            "radial-gradient(circle at 30% 26%, #c64523 0%, #a02d16 28%, #761e12 56%, #470d07 90%, #2a0604 100%)",
          boxShadow:
            "inset 5px 5px 9px rgba(255,205,165,0.22), inset -4px -6px 12px rgba(20,2,2,0.65), 2px 4px 8px rgba(0,0,0,0.55), 0 1px 1px rgba(0,0,0,0.4)",
        }}
      />
      {/* kropla laku, która uciekła spod sygnetu */}
      <div
        className="absolute"
        style={{
          bottom: -5,
          right: 0,
          width: size * 0.22,
          height: size * 0.17,
          borderRadius: "55% 60% 50% 45%",
          background: "radial-gradient(circle at 30% 28%, #a83419, #5a130a 80%)",
          boxShadow:
            "inset 1px 1px 2px rgba(255,190,150,0.3), 1px 2px 4px rgba(0,0,0,0.45)",
          transform: "rotate(18deg)",
        }}
      />
      {/* wytłoczony krąg sygnetu — podwójny ring */}
      <div
        className="absolute"
        style={{
          inset: "13%",
          borderRadius: "50%",
          border: "0.8px solid rgba(50,6,3,0.55)",
          boxShadow:
            "inset 0 1px 1px rgba(255,180,140,0.30), 0 1px 1px rgba(255,170,130,0.18), inset 0 -1px 2px rgba(20,0,0,0.4)",
        }}
      />
      <div
        className="absolute"
        style={{
          inset: "19%",
          borderRadius: "50%",
          border: "0.5px solid rgba(255,170,130,0.20)",
        }}
      />
      {/* monogram z kropkami sygnetu */}
      <div
        className="absolute flex items-center justify-center"
        style={{ inset: 0, gap: size * 0.07 }}
      >
        <span
          style={{
            width: 2.5,
            height: 2.5,
            borderRadius: "50%",
            background: "rgba(50,6,3,0.6)",
            boxShadow: "0 1px 0 rgba(255,180,140,0.3)",
            marginTop: 2,
          }}
        />
        <span
          className="font-display italic"
          style={{
            fontSize: size * 0.46,
            fontWeight: 600,
            color: "rgba(56,7,3,0.9)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            textShadow:
              "0 1px 0 rgba(255,180,140,0.40), 0 -1px 1px rgba(20,0,0,0.7), 0 0 2px rgba(0,0,0,0.35)",
            transform: "translateY(-1px)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            width: 2.5,
            height: 2.5,
            borderRadius: "50%",
            background: "rgba(50,6,3,0.6)",
            boxShadow: "0 1px 0 rgba(255,180,140,0.3)",
            marginTop: 2,
          }}
        />
      </div>
      {/* bliki — główny i kontrowy */}
      <div
        className="absolute"
        style={{
          top: "13%",
          left: "18%",
          width: "24%",
          height: "15%",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(255,210,180,0.40), transparent 70%)",
          filter: "blur(2px)",
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: "16%",
          right: "20%",
          width: "16%",
          height: "10%",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(255,160,120,0.18), transparent 70%)",
          filter: "blur(2px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

function NotaKuratora({
  nota,
}: {
  nota: { num: number; label: string; advice: string };
}) {
  const d = new Date();
  return (
    <div
      className="tex-paper tex-noise-fine relative lg:col-span-7"
      style={{
        boxShadow:
          "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 20px 44px -18px rgba(0,0,0,0.7), 0 3px 6px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{ inset: 12, border: "0.5px solid rgba(146,112,55,0.4)", zIndex: 2 }}
      />

      {/* lak — wisi na lewym górnym rogu karty */}
      <div className="absolute" style={{ top: -18, left: -18, zIndex: 5 }}>
        <CuratorSeal size={64} label="K" />
      </div>

      <div
        className="relative"
        style={{
          padding: "22px 32px 18px 36px",
          zIndex: 3,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="flex items-start justify-between"
          style={{ marginBottom: 14, paddingLeft: 40 }}
        >
          <span className="eyebrow" style={{ color: "rgba(139,46,31,0.82)", fontSize: 10 }}>
            Nota kuratora
          </span>
          <span
            className="stamp"
            style={{ fontSize: 9, transform: "rotate(2.5deg)", opacity: 0.7 }}
          >
            Ad repetendum
          </span>
        </div>

        {/* wielka cyfra atramentem + rada kuratora */}
        <div className="flex flex-col sm:flex-row sm:items-center" style={{ gap: 24, flex: 1 }}>
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <div
              className="font-display italic"
              style={{
                fontSize: "clamp(54px, 6vw, 72px)",
                lineHeight: 1,
                fontWeight: 600,
                color: "var(--c-ink2)",
                letterSpacing: "-0.04em",
                textShadow: "0 1px 0 rgba(255,250,235,0.5)",
              }}
            >
              {nota.num}
            </div>
            <div
              className="eyebrow"
              style={{
                color: "rgba(27,17,8,0.55)",
                fontSize: 9,
                marginTop: 8,
                letterSpacing: "0.24em",
              }}
            >
              {nota.label}
            </div>
          </div>
          <span
            aria-hidden
            className="hidden sm:block"
            style={{
              width: 0.5,
              alignSelf: "stretch",
              background: "rgba(27,17,8,0.22)",
              margin: "4px 0",
            }}
          />
          <div style={{ flex: 1 }}>
            <p
              className="font-display italic"
              style={{
                fontSize: "clamp(19px, 2.2vw, 24px)",
                lineHeight: 1.24,
                color: "#1B1108",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                textWrap: "pretty",
                margin: 0,
              }}
            >
              {nota.advice}
            </p>
            <div
              className="signature"
              style={{
                color: "rgba(139,46,31,0.7)",
                fontSize: 10.5,
                letterSpacing: "0.14em",
                marginTop: 8,
              }}
            >
              — Kurator zbioru
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between"
          style={{
            marginTop: 14,
            paddingTop: 10,
            borderTop: "0.5px dashed rgba(27,17,8,0.22)",
          }}
        >
          <span
            className="signature"
            style={{ color: "rgba(27,17,8,0.5)", fontSize: 10.5, letterSpacing: "0.12em" }}
          >
            {WEEKDAYS_PL[d.getDay()]} · {d.getDate()} · {MONTHS_PL_SHORT[d.getMonth()]} ·{" "}
            {toRoman(d.getFullYear())}
          </span>
          <Link
            href="/study/session/new?mode=mix"
            className="eyebrow flex items-center"
            style={{
              color: "rgba(139,46,31,0.75)",
              fontSize: 9.5,
              gap: 6,
              textDecoration: "none",
            }}
          >
            Sesja mix <span style={{ fontSize: 12 }}>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

const RYZYKO_NUMERALS = ["i", "ii", "iii"];

function RyzykoZapomnienia({
  rows,
  weakSkills,
  footnote,
}: {
  rows: Array<{ label: string; value: string; strong?: boolean }>;
  weakSkills: Array<{ skill: string; total: number; wrong: number }>;
  footnote: string;
}) {
  return (
    <div
      className="tex-paper tex-noise-fine relative lg:col-span-5"
      style={{
        boxShadow:
          "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 20px 44px -18px rgba(0,0,0,0.7), 0 3px 6px rgba(0,0,0,0.4)",
      }}
    >
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{ inset: 12, border: "0.5px solid rgba(146,112,55,0.4)", zIndex: 2 }}
      />
      <div
        className="relative"
        style={{
          padding: "22px 32px 18px",
          zIndex: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginBottom: 14 }}>
          <div className="flex items-center" style={{ gap: 10, marginBottom: 7 }}>
            <span
              aria-hidden
              style={{
                width: 7,
                height: 7,
                transform: "rotate(45deg)",
                display: "inline-block",
                flexShrink: 0,
                background: "radial-gradient(circle at 35% 30%, #c8512f, #7a1f14 85%)",
                border: "0.5px solid rgba(60,8,4,0.5)",
                boxShadow: "inset 0 1px 0 rgba(255,200,170,0.25)",
              }}
            />
            <span className="eyebrow" style={{ color: "rgba(139,46,31,0.8)", fontSize: 9.5 }}>
              Rejestr
            </span>
            <span style={{ flex: 1, borderBottom: "1px dotted rgba(27,17,8,0.3)" }} />
          </div>
          <div
            className="font-display italic"
            style={{
              fontSize: 22,
              color: "#1B1108",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              lineHeight: 1.05,
            }}
          >
            Ryzyko zapomnienia
          </div>
        </div>
        <div className="flex flex-col justify-center" style={{ gap: 12, flex: 1 }}>
          {rows.map((r, i) => (
            <div key={r.label} className="flex items-baseline" style={{ gap: 12 }}>
              <span
                className="font-display italic"
                style={{ fontSize: 14, color: "rgba(139,46,31,0.55)", width: 18, flexShrink: 0 }}
              >
                {RYZYKO_NUMERALS[i]}.
              </span>
              <span
                className="signature"
                style={{
                  color: "rgba(27,17,8,0.62)",
                  fontSize: 11.5,
                  letterSpacing: "0.08em",
                  whiteSpace: "nowrap",
                }}
              >
                {r.label}
              </span>
              <span
                style={{
                  flex: 1,
                  borderBottom: "1px dotted rgba(27,17,8,0.32)",
                  transform: "translateY(-3px)",
                }}
              />
              <span
                className="font-display italic"
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  lineHeight: 1,
                  color: r.strong ? "var(--c-ink2)" : "#1B1108",
                  letterSpacing: "-0.01em",
                }}
              >
                {r.value}
              </span>
            </div>
          ))}
        </div>
        {weakSkills.length > 0 && (
          <div
            style={{ marginTop: 14, paddingTop: 12, borderTop: "0.5px dashed rgba(27,17,8,0.25)" }}
          >
            <div
              className="eyebrow"
              style={{ color: "rgba(27,17,8,0.5)", fontSize: 9, marginBottom: 10 }}
            >
              Kruche pojęcia
            </div>
            <div className="flex flex-col" style={{ gap: 8 }}>
              {weakSkills.map((s) => (
                <div key={s.skill} className="flex items-baseline" style={{ gap: 10 }}>
                  <span
                    className="signature"
                    style={{
                      color: "rgba(27,17,8,0.58)",
                      fontSize: 11,
                      letterSpacing: "0.04em",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "70%",
                    }}
                  >
                    {s.skill}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      borderBottom: "1px dotted rgba(27,17,8,0.25)",
                      transform: "translateY(-3px)",
                    }}
                  />
                  <span
                    className="font-display italic"
                    style={{ color: "var(--c-ink2)", fontSize: 18, lineHeight: 1 }}
                  >
                    {s.wrong}/{s.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div
          style={{ marginTop: 14, paddingTop: 10, borderTop: "0.5px dashed rgba(27,17,8,0.25)" }}
        >
          <span
            className="caption"
            style={{ color: "rgba(27,17,8,0.55)", fontSize: 12, fontStyle: "italic" }}
          >
            {footnote}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Pas 2 — Miary: cztery tablice (Passa wśród nich, nie osobno)
   ============================================================ */

function CornerDots() {
  const dot: React.CSSProperties = {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: "50%",
    background: "rgba(184,146,77,0.55)",
  };
  return (
    <span aria-hidden>
      <span style={{ ...dot, top: 10, left: 10 }} />
      <span style={{ ...dot, top: 10, right: 10 }} />
      <span style={{ ...dot, bottom: 10, left: 10 }} />
      <span style={{ ...dot, bottom: 10, right: 10 }} />
    </span>
  );
}

interface Miara {
  key: string;
  label: string;
  value: string;
  unit: string;
  note: string;
}

function MiaraPlaque({ m }: { m: Miara }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative"
      style={{
        background: hover ? "rgba(27,17,8,0.55)" : "rgba(27,17,8,0.4)",
        border: "0.5px solid rgba(184,146,77,0.35)",
        boxShadow: "inset 0 1px 0 rgba(184,146,77,0.12), 0 12px 28px -14px rgba(0,0,0,0.7)",
        padding: "26px 28px 24px",
        transition: "background .2s",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <CornerDots />
      <span className="eyebrow" style={{ color: "var(--c-gold-400)", fontSize: 10 }}>
        {m.label}
      </span>
      <div className="flex items-baseline" style={{ gap: 8 }}>
        <span
          className="font-display italic"
          style={{
            fontSize: 58,
            fontWeight: 600,
            lineHeight: 0.9,
            color: "var(--c-paper-100)",
            letterSpacing: "-0.02em",
          }}
        >
          {m.value}
        </span>
        {m.unit !== "" && (
          <span
            className="font-display italic"
            style={{ fontSize: 24, color: "var(--c-gold-400)", fontWeight: 500 }}
          >
            {m.unit}
          </span>
        )}
      </div>
      <span
        className="caption"
        style={{
          color: "var(--c-paper-300)",
          opacity: 0.7,
          fontSize: 12.5,
          lineHeight: 1.45,
          textWrap: "pretty",
        }}
      >
        {m.note}
      </span>
    </div>
  );
}

function MiaryBand({ miary, graceReady }: { miary: Miara[]; graceReady: boolean }) {
  return (
    <div style={{ padding: "0 24px" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 20, marginTop: 28 }}>
        {miary.map((m) => (
          <MiaraPlaque key={m.key} m={m} />
        ))}
      </div>
      <div className="flex items-center justify-center" style={{ gap: 10, marginTop: 18 }}>
        <span aria-hidden style={{ color: "var(--c-gold-500)", fontSize: 11 }}>
          ✦
        </span>
        <span
          className="caption"
          style={{ color: "var(--c-paper-300)", opacity: 0.6, fontSize: 12.5, textAlign: "center" }}
        >
          {graceReady
            ? "Urlop dziekański dostępny — jeden dzień przerwy nie zrywa passy."
            : "Urlop dziekański zużyty — odnowi się w ciągu tygodnia."}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   Pas 3 — Rejestr obecności: romby atramentowe + kolumna księgowa
   ============================================================ */

const HEAT_STYLES: React.CSSProperties[] = [
  { background: "transparent", border: "0.6px solid rgba(27,17,8,0.22)", boxShadow: "none" },
  {
    background: "#cdb98e",
    border: "0.5px solid rgba(106,81,40,0.4)",
    boxShadow: "inset 0 1px 0 rgba(255,245,220,0.4)",
  },
  {
    background: "radial-gradient(circle at 35% 30%, #d9b878, #b8924d 90%)",
    border: "0.5px solid rgba(106,81,40,0.5)",
    boxShadow: "inset 0 1px 0 rgba(255,245,220,0.45)",
  },
  {
    background: "radial-gradient(circle at 35% 30%, #c8a25c, #927037 90%)",
    border: "0.5px solid rgba(80,60,25,0.55)",
    boxShadow: "inset 0 1px 0 rgba(255,245,220,0.4)",
  },
  {
    background: "radial-gradient(circle at 35% 30%, #b8924d, #6a5128 90%)",
    border: "0.5px solid rgba(60,45,18,0.6)",
    boxShadow: "inset 0 1px 0 rgba(255,235,180,0.35), 0 0 6px rgba(146,112,55,0.4)",
  },
];

function HeatDiamond({ lvl, size = 11 }: { lvl: number; size?: number }) {
  const s = HEAT_STYLES[lvl];
  return (
    <span
      style={{
        width: size,
        height: size,
        transform: "rotate(45deg)",
        background: s.background,
        border: s.border,
        boxShadow: s.boxShadow,
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

function LedgerHeatmap({ data }: { data: Record<string, number> }) {
  const box = 18;
  const gap = 4;
  const step = box + gap;
  const labelCol = 26; /* etykieta dnia 16 + przerwa 10 */

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = heatmapStart(today);

  /* miesiące — etykieta tam, gdzie poniedziałek wpada w nowy miesiąc */
  const months: Array<{ week: number; label: string }> = [];
  let prevMonth = -1;
  for (let w = 0; w < HEAT_WEEKS; w++) {
    const monday = new Date(start);
    monday.setDate(start.getDate() + w * 7);
    if (monday.getMonth() !== prevMonth) {
      months.push({ week: w, label: MONTHS_PL_MINI[monday.getMonth()] });
      prevMonth = monday.getMonth();
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* miesiące — kursywa serif, jak w kalendarium */}
      <div className="relative" style={{ height: 20, marginLeft: labelCol }}>
        {months.map((m) => (
          <span
            key={`${m.label}-${m.week}`}
            className="font-display italic"
            style={{
              position: "absolute",
              left: m.week * step,
              fontSize: 15,
              color: "rgba(27,17,8,0.55)",
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            {m.label}
          </span>
        ))}
      </div>
      {/* rejestr — liniowany papier księgowy, atramentowe romby na liniach */}
      <div className="relative">
        {months.slice(1).map((m) => (
          <span
            key={`rule-${m.week}`}
            aria-hidden
            style={{
              position: "absolute",
              left: labelCol + m.week * step - 3,
              top: -6,
              bottom: -2,
              borderLeft: "0.5px dashed rgba(27,17,8,0.16)",
              pointerEvents: "none",
            }}
          />
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap }}>
          {Array.from({ length: 7 }, (_, d) => (
            <div key={d} className="flex items-center" style={{ gap: 10 }}>
              <span
                className="font-display italic"
                style={{
                  width: 16,
                  height: box,
                  fontSize: 12.5,
                  color: "rgba(27,17,8,0.45)",
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                {HEAT_DAYS[d]}
              </span>
              <div className="relative flex items-center" style={{ gap }}>
                {/* linia rejestru pod całym wierszem */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 2,
                    right: 2,
                    top: "50%",
                    borderTop: "0.5px solid rgba(27,17,8,0.14)",
                    pointerEvents: "none",
                  }}
                />
                {Array.from({ length: HEAT_WEEKS }, (_, w) => {
                  const date = new Date(start);
                  date.setDate(start.getDate() + w * 7 + d);
                  const future = date.getTime() > today.getTime();
                  const lvl = future ? 0 : Math.min(data[isoDay(date)] ?? 0, 4);
                  return (
                    <span
                      key={w}
                      className="relative flex items-center justify-center"
                      style={{ width: box, height: box }}
                      title={future ? undefined : isoDay(date)}
                    >
                      {future ? null : lvl > 0 ? (
                        <HeatDiamond lvl={lvl} />
                      ) : (
                        <span
                          style={{
                            width: 2.5,
                            height: 2.5,
                            borderRadius: "50%",
                            background: "rgba(27,17,8,0.22)",
                          }}
                        />
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* legenda */}
      <div className="flex items-center" style={{ gap: 9, marginTop: 12, marginLeft: labelCol }}>
        <span className="signature" style={{ fontSize: 10, color: "rgba(27,17,8,0.5)" }}>
          mniej
        </span>
        <span className="flex items-center justify-center" style={{ width: 11, height: 11 }}>
          <span
            style={{ width: 2.5, height: 2.5, borderRadius: "50%", background: "rgba(27,17,8,0.22)" }}
          />
        </span>
        {[1, 2, 3, 4].map((i) => (
          <HeatDiamond key={i} lvl={i} size={9} />
        ))}
        <span className="signature" style={{ fontSize: 10, color: "rgba(27,17,8,0.5)" }}>
          więcej
        </span>
      </div>
    </div>
  );
}

function RejestrObecnosci({
  data,
  summary,
  densest,
}: {
  data: Record<string, number>;
  summary: Array<{ label: string; value: string }>;
  densest: string | null;
}) {
  return (
    <div style={{ padding: "0 24px" }}>
      <RuleHeader left="Rejestr obecności · 90 dni" right="Liber Praesentiae" />
      <div
        className="tex-paper tex-noise-fine relative"
        style={{
          marginTop: 24,
          boxShadow:
            "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 24px 50px -20px rgba(0,0,0,0.75), 0 4px 8px rgba(0,0,0,0.4)",
        }}
      >
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{ inset: 14, border: "0.5px solid rgba(146,112,55,0.4)", zIndex: 2 }}
        />
        <div className="relative grid grid-cols-1 lg:grid-cols-12" style={{ zIndex: 3 }}>
          {/* heatmapa */}
          <div
            className="lg:col-span-8 flex flex-col justify-center lg:[border-right:0.5px_dashed_rgba(27,17,8,0.22)]"
            style={{ padding: "36px 36px 32px 44px", overflowX: "auto" }}
          >
            <div
              className="eyebrow"
              style={{ color: "rgba(27,17,8,0.55)", fontSize: 10, marginBottom: 22 }}
            >
              Każdy romb to jeden dzień
            </div>
            <LedgerHeatmap data={data} />
          </div>
          {/* kolumna księgowa */}
          <div
            className="lg:col-span-4 flex flex-col justify-center"
            style={{ padding: "36px 44px 32px 36px", gap: 20 }}
          >
            {summary.map((r) => (
              <div key={r.label} className="flex items-baseline" style={{ gap: 10 }}>
                <span
                  className="signature"
                  style={{
                    color: "rgba(27,17,8,0.58)",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.label}
                </span>
                <span
                  style={{
                    flex: 1,
                    borderBottom: "1px dotted rgba(27,17,8,0.3)",
                    transform: "translateY(-3px)",
                  }}
                />
                <span
                  className="font-display italic"
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    color: "#1B1108",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.value}
                </span>
              </div>
            ))}
            {densest && (
              <div style={{ paddingTop: 14, borderTop: "0.5px dashed rgba(27,17,8,0.22)" }}>
                <span
                  className="caption"
                  style={{ color: "rgba(27,17,8,0.55)", fontSize: 12, fontStyle: "italic" }}
                >
                  {densest}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Pas 4 — Linia atramentu (krzywa trafności)
   ============================================================ */

function CurvaChart({
  points,
}: {
  points: Array<{ iso: string; pct: number | null; attempts: number }>;
}) {
  const W = 1130,
    H = 270;
  const padL = 56,
    padR = 30,
    padT = 18,
    padB = 36;
  const iw = W - padL - padR,
    ih = H - padT - padB;
  const x = (d: number) => padL + (d / 29) * iw;
  const y = (v: number) => padT + (1 - v / 100) * ih;

  const pts = points
    .map((p, i) => ({ d: i, v: p.pct }))
    .filter((p): p is { d: number; v: number } => p.v != null);

  /* segmenty: kolejne dni łączone linią; przerwy — nić przerywana */
  const segments: Array<Array<{ d: number; v: number }>> = [];
  const gaps: Array<[{ d: number; v: number }, { d: number; v: number }]> = [];
  let cur = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1],
      pt = pts[i];
    if (pt.d - prev.d === 1) {
      cur.push(pt);
    } else {
      segments.push(cur);
      gaps.push([prev, pt]);
      cur = [pt];
    }
  }
  segments.push(cur);

  const xlabels = [0, 7, 15, 22, 29].map((d) => {
    const iso = points[d].iso;
    return { d, label: `${Number(iso.slice(8, 10))}.${Number(iso.slice(5, 7))}` };
  });

  const last = pts[pts.length - 1];
  const ink = "rgba(139,46,31,0.9)";

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} aria-hidden>
      {/* siatka */}
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}>
          <line
            x1={padL}
            x2={W - padR}
            y1={y(v)}
            y2={y(v)}
            stroke="rgba(27,17,8,0.18)"
            strokeWidth={v % 50 === 0 ? 0.8 : 0.4}
            strokeDasharray={v % 50 === 0 ? "none" : "2 5"}
          />
          {v % 50 === 0 && (
            <text
              x={padL - 12}
              y={y(v) + 4}
              textAnchor="end"
              fontFamily="'JetBrains Mono', monospace"
              fontSize="11"
              fill="rgba(27,17,8,0.5)"
            >
              {v}%
            </text>
          )}
        </g>
      ))}
      {/* etykiety X */}
      {xlabels.map((l) => (
        <g key={l.d}>
          <line
            x1={x(l.d)}
            x2={x(l.d)}
            y1={y(0)}
            y2={y(0) + 5}
            stroke="rgba(27,17,8,0.35)"
            strokeWidth="0.6"
          />
          <text
            x={x(l.d)}
            y={H - 8}
            textAnchor="middle"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="11"
            fill="rgba(27,17,8,0.5)"
          >
            {l.label}
          </text>
        </g>
      ))}
      {/* wypełnienie pod segmentami */}
      {segments
        .filter((s) => s.length > 1)
        .map((s, i) => {
          const d =
            `M ${x(s[0].d)} ${y(0)} ` +
            s.map((p) => `L ${x(p.d)} ${y(p.v)}`).join(" ") +
            ` L ${x(s[s.length - 1].d)} ${y(0)} Z`;
          return <path key={i} d={d} fill="rgba(139,46,31,0.07)" />;
        })}
      {/* nić przez przerwy */}
      {gaps.map(([a, b], i) => (
        <line
          key={i}
          x1={x(a.d)}
          y1={y(a.v)}
          x2={x(b.d)}
          y2={y(b.v)}
          stroke="rgba(139,46,31,0.3)"
          strokeWidth="1"
          strokeDasharray="1.5 6"
          strokeLinecap="round"
        />
      ))}
      {/* linie segmentów */}
      {segments
        .filter((s) => s.length > 1)
        .map((s, i) => (
          <path
            key={i}
            d={`M ` + s.map((p) => `${x(p.d)} ${y(p.v)}`).join(" L ")}
            fill="none"
            stroke={ink}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
      {/* punkty */}
      {pts.map((p) => (
        <circle key={p.d} cx={x(p.d)} cy={y(p.v)} r="3.4" fill={ink} stroke="#E2D6BA" strokeWidth="1.2" />
      ))}
      {/* ostatni punkt — adnotacja */}
      <g>
        <circle
          cx={x(last.d)}
          cy={y(last.v)}
          r="6.5"
          fill="none"
          stroke="rgba(139,46,31,0.45)"
          strokeWidth="0.8"
        />
        <text
          x={x(last.d) + 14}
          y={y(last.v) + 4}
          fontFamily="'Cormorant Garamond', serif"
          fontStyle="italic"
          fontWeight="600"
          fontSize="20"
          fill="rgba(139,46,31,0.95)"
        >
          {last.v}%
        </text>
      </g>
    </svg>
  );
}

function LiniaAtramentu({
  points,
}: {
  points: Array<{ iso: string; pct: number | null; attempts: number }>;
}) {
  const hasData = points.some((p) => p.pct != null);
  return (
    <div style={{ padding: "0 24px" }}>
      <RuleHeader left="Linia atramentu · trafność 30 dni" right="Curva Diligentiae" />
      <div
        className="tex-paper tex-noise-fine relative"
        style={{
          marginTop: 24,
          boxShadow:
            "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 24px 50px -20px rgba(0,0,0,0.75), 0 4px 8px rgba(0,0,0,0.4)",
        }}
      >
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{ inset: 14, border: "0.5px solid rgba(146,112,55,0.4)", zIndex: 2 }}
        />
        <div className="relative" style={{ padding: "32px 40px 26px", zIndex: 3 }}>
          <div className="flex items-baseline justify-between flex-wrap gap-2" style={{ marginBottom: 18 }}>
            <span className="eyebrow" style={{ color: "rgba(27,17,8,0.55)", fontSize: 10 }}>
              Trafność dzienna · przerywana nić = dni bez sesji
            </span>
            <span
              className="signature"
              style={{ color: "rgba(139,46,31,0.65)", fontSize: 10.5, letterSpacing: "0.1em" }}
            >
              atrament: czerwień kuratora
            </span>
          </div>
          {hasData ? (
            <CurvaChart points={points} />
          ) : (
            <p
              className="font-display italic"
              style={{ fontSize: 24, color: "rgba(27,17,8,0.55)", padding: "32px 0", margin: 0 }}
            >
              Krzywa czeka na pierwsze próby w tym oknie.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Pas 5 — Tablica honorowa + Karty erraty
   ============================================================ */

function TablicaHonorowa({
  topVaults,
  mastered,
  total,
}: {
  topVaults: Array<{ vault?: { id: string; name: string }; count: number }>;
  mastered: number;
  total: number;
}) {
  return (
    <div className="lg:col-span-5 flex flex-col">
      <RuleHeaderInline left="Tablica honorowa" right={`${mastered} / ${total}`} />
      <div
        className="relative flex flex-col"
        style={{
          marginTop: 20,
          flex: 1,
          minHeight: 240,
          background: "rgba(27,17,8,0.4)",
          border: "0.5px solid rgba(184,146,77,0.3)",
          boxShadow: "inset 0 1px 0 rgba(184,146,77,0.1), 0 12px 28px -14px rgba(0,0,0,0.7)",
        }}
      >
        <CornerDots />
        {topVaults.length === 0 ? (
          <div
            className="relative flex flex-col items-center justify-center"
            style={{ flex: 1, gap: 16, textAlign: "center", padding: "32px 40px" }}
          >
            {/* pusta plakieta — czeka na grawer */}
            <div
              className="relative flex items-center justify-center"
              style={{
                width: 150,
                height: 64,
                border: "0.8px dashed rgba(184,146,77,0.45)",
                boxShadow: "inset 0 0 18px rgba(184,146,77,0.05)",
              }}
            >
              <div
                aria-hidden
                className="absolute"
                style={{ inset: 6, border: "0.5px dashed rgba(184,146,77,0.25)" }}
              />
              <span
                className="font-display italic"
                style={{ fontSize: 24, color: "var(--c-gold-600)", opacity: 0.75 }}
              >
                ?
              </span>
            </div>
            <div
              className="font-display italic"
              style={{
                fontSize: 23,
                color: "var(--c-paper-200)",
                opacity: 0.85,
                fontWeight: 500,
                textWrap: "balance",
              }}
            >
              Pierwsza plakieta czeka na grawera.
            </div>
            <span
              className="caption"
              style={{
                color: "var(--c-paper-300)",
                opacity: 0.55,
                fontSize: 12.5,
                maxWidth: 320,
                textWrap: "pretty",
              }}
            >
              Opanuj dowolny temat trzema bezbłędnymi powtórkami, a zawiśnie tutaj.
            </span>
          </div>
        ) : (
          <div className="relative flex flex-col justify-center" style={{ padding: "8px 0", flex: 1 }}>
            {topVaults.map((tv, i) => (
              <div
                key={tv.vault!.id}
                className="flex items-baseline"
                style={{
                  padding: "16px 28px",
                  gap: 16,
                  borderBottom:
                    i < topVaults.length - 1 ? "0.5px dashed rgba(184,146,77,0.2)" : "none",
                }}
              >
                <span
                  className="font-display italic"
                  style={{
                    fontSize: 15,
                    color: "rgba(217,184,120,0.55)",
                    width: 26,
                    flexShrink: 0,
                  }}
                >
                  {toRoman(i + 1).toLowerCase()}.
                </span>
                <span
                  className="font-display italic"
                  style={{
                    fontSize: 21,
                    color: "var(--c-gold-300)",
                    fontWeight: 500,
                    lineHeight: 1.1,
                  }}
                >
                  {tv.vault!.name}
                </span>
                <span
                  style={{
                    flex: 1,
                    borderBottom: "1px dotted rgba(226,214,186,0.18)",
                    transform: "translateY(4px)",
                  }}
                />
                <span
                  className="signature"
                  style={{ color: "rgba(232,223,204,0.55)", fontSize: 11, whiteSpace: "nowrap" }}
                >
                  {tv.count} {plPlural(tv.count, "opanowany", "opanowane", "opanowanych")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressPips({ got, total }: { got: number; total: number }) {
  return (
    <span className="flex items-center" style={{ gap: 5 }}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            transform: "rotate(45deg)",
            background:
              i < got
                ? "radial-gradient(circle at 35% 30%, #d9b878, #927037 85%)"
                : "transparent",
            border: i < got ? "0.5px solid rgba(106,81,40,0.6)" : "0.7px solid rgba(226,214,186,0.3)",
            boxShadow: i < got ? "inset 0 1px 0 rgba(255,245,220,0.35)" : "none",
          }}
        />
      ))}
    </span>
  );
}

function ErrataRow({
  item,
  last,
}: {
  item: { id: string; n: string; title: string; got: number; total: number };
  last: boolean;
}) {
  return (
    <div
      className="errata-stat-row relative flex items-center"
      style={{
        padding: "18px 28px",
        gap: 18,
        borderBottom: last ? "none" : "0.5px dashed rgba(184,146,77,0.2)",
        transition: "background .2s",
      }}
    >
      <span
        className="signature"
        style={{
          fontSize: 10.5,
          color: "var(--c-paper-300)",
          opacity: 0.45,
          letterSpacing: "0.1em",
          width: 44,
          flexShrink: 0,
        }}
      >
        № {item.n}
      </span>
      <span
        className="font-display italic"
        style={{
          fontSize: 21,
          color: "var(--c-paper-200)",
          opacity: 0.88,
          fontWeight: 500,
          lineHeight: 1.1,
          letterSpacing: "-0.005em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minWidth: 0,
          flexShrink: 1,
        }}
      >
        {item.title}
      </span>
      <span
        style={{
          flex: 1,
          minWidth: 20,
          borderBottom: "1px dotted rgba(226,214,186,0.18)",
          transform: "translateY(4px)",
        }}
      />
      {item.total <= 8 && <ProgressPips got={item.got} total={item.total} />}
      <span
        className="font-display italic"
        style={{
          color: "rgba(217,184,120,0.8)",
          fontSize: 19,
          fontWeight: 600,
          lineHeight: 1,
          whiteSpace: "nowrap",
          width: 52,
          textAlign: "right",
        }}
      >
        {item.got} / {item.total}
      </span>
    </div>
  );
}

function KartyErraty({
  items,
}: {
  items: Array<{ id: string; n: string; title: string; got: number; total: number }>;
}) {
  return (
    <div className="lg:col-span-7 flex flex-col">
      <RuleHeaderInline left="Karty erraty · najtrudniejsze" right="poprawne / próby" />
      <div
        className="relative flex flex-col"
        style={{
          marginTop: 20,
          flex: 1,
          background: "rgba(27,17,8,0.4)",
          border: "0.5px solid rgba(184,146,77,0.3)",
          boxShadow: "inset 0 1px 0 rgba(184,146,77,0.1), 0 12px 28px -14px rgba(0,0,0,0.7)",
        }}
      >
        <CornerDots />
        {items.length === 0 ? (
          <div
            className="relative flex items-center justify-center"
            style={{ flex: 1, padding: "32px 40px" }}
          >
            <span
              className="font-display italic"
              style={{ fontSize: 22, color: "var(--c-paper-200)", opacity: 0.75 }}
            >
              Nic ci się nie opiera. Na razie.
            </span>
          </div>
        ) : (
          <div className="relative flex flex-col justify-center" style={{ padding: "8px 0", flex: 1 }}>
            {items.map((e, i) => (
              <ErrataRow key={e.id} item={e} last={i === items.length - 1} />
            ))}
          </div>
        )}
        <div
          className="flex items-center justify-end"
          style={{ padding: "12px 28px", borderTop: "0.5px dashed rgba(184,146,77,0.2)" }}
        >
          <Link
            href="/errors"
            className="eyebrow flex items-center"
            style={{
              color: "var(--c-gold-400)",
              fontSize: 9.5,
              gap: 6,
              opacity: 0.85,
              textDecoration: "none",
            }}
          >
            Cała errata <span style={{ fontSize: 12 }}>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Ornament + stopka-kolofon
   ============================================================ */

function OrnamentDivider() {
  return (
    <div className="flex items-center justify-center" style={{ padding: "0 24px", gap: 14 }} aria-hidden>
      <div
        style={{
          flex: 1,
          height: 0.5,
          background: "linear-gradient(90deg, transparent, rgba(184,146,77,0.28), transparent)",
        }}
      />
      <svg width="42" height="14" viewBox="0 0 42 14" fill="none">
        <path d="M2 7h12M28 7h12" stroke="rgba(184,146,77,0.5)" strokeWidth="0.6" />
        <circle cx="16" cy="7" r="0.8" fill="rgba(184,146,77,0.6)" />
        <path
          d="M21 4 Q23 7 21 10 Q19 7 21 4 Z"
          fill="none"
          stroke="rgba(184,146,77,0.65)"
          strokeWidth="0.6"
        />
        <circle cx="26" cy="7" r="0.8" fill="rgba(184,146,77,0.6)" />
      </svg>
      <div
        style={{
          flex: 1,
          height: 0.5,
          background: "linear-gradient(90deg, transparent, rgba(184,146,77,0.28), transparent)",
        }}
      />
    </div>
  );
}

function Kolofon({
  questions,
  durationLabel,
  avgMin,
}: {
  questions: number;
  durationLabel: string;
  avgMin: number;
}) {
  return (
    <div className="flex flex-col items-center" style={{ padding: "40px 24px 16px", gap: 10 }}>
      <span
        aria-hidden
        className="font-display"
        style={{ fontSize: 20, color: "var(--c-gold-600)", opacity: 0.7, transform: "rotate(-90deg)" }}
      >
        ☙
      </span>
      <div
        className="eyebrow"
        style={{
          color: "var(--c-gold-400)",
          fontSize: 10.5,
          letterSpacing: "0.3em",
          textAlign: "center",
          opacity: 0.85,
        }}
      >
        {questions} {plPlural(questions, "pytanie", "pytania", "pytań")} · {durationLabel} nauki
        {avgMin > 0 && ` · średnia sesja ${avgMin} min`}
      </div>
      <div
        className="signature"
        style={{
          color: "var(--c-paper-300)",
          opacity: 0.45,
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        Ex archivo · 90 dies
      </div>
    </div>
  );
}

function PageFooter() {
  const d = new Date();
  return (
    <div
      className="flex items-center justify-between flex-wrap gap-4"
      style={{
        padding: "28px 24px 48px",
        borderTop: "1px solid rgba(184,146,77,0.18)",
        marginTop: 28,
      }}
    >
      <div className="signature" style={{ color: "var(--c-paper-300)", opacity: 0.55 }}>
        The Learning Vault · Anno MMXXVI · Statystyki
      </div>
      <div className="signature" style={{ color: "var(--c-paper-300)", opacity: 0.55 }}>
        ❦
      </div>
      <div className="signature" style={{ color: "var(--c-paper-300)", opacity: 0.55 }}>
        {WEEKDAYS_PL[d.getDay()]} · {d.getDate()} · {MONTHS_PL_SHORT[d.getMonth()]}
      </div>
    </div>
  );
}
