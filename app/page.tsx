"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  GraduationCap,
  LibraryBig,
  NotebookPen,
  Sparkles,
} from "lucide-react";
import { FirstRunSeed } from "@/components/FirstRunSeed";
import { PytanieDnia } from "@/components/PytanieDnia";
import { DateStamp } from "@/components/ui/DateStamp";
import { WaxSeal } from "@/components/ui/WaxSeal";
import {
  effectiveStreak,
  ensureUserDoc,
  useAttempts,
  useErrors,
  useSalonPhrases,
  useSessions,
  useTopics,
  useUserDoc,
  useVaults,
} from "@/lib/firestore-data";
import { topicQueueReason } from "@/lib/learning-copy";
import type { Timestamp } from "firebase/firestore";

/* ---------- helpers ----------------------------------------------------- */

function toMillis(v: unknown): number {
  if (!v) return 0;
  if (v instanceof Date) return v.getTime();
  if (typeof v === "object" && v && "toMillis" in v) {
    return (v as Timestamp).toMillis();
  }
  return 0;
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

function vaultSig(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 4)
    .toUpperCase();
}

function idSig(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return String(hash % 1000).padStart(3, "0");
}

const MONTHS_PL_SHORT = [
  "I", "II", "III", "IV", "V", "VI",
  "VII", "VIII", "IX", "X", "XI", "XII",
];

function ledgerDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")}.${MONTHS_PL_SHORT[d.getMonth()]}`;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function topicPriority(t: { status: string }): number {
  if (t.status === "struggling") return 0;
  if (t.status === "fresh") return 1;
  return 2;
}

/* ---------- Page -------------------------------------------------------- */

export default function DashboardPage() {
  useEffect(() => {
    ensureUserDoc().catch(() => {});
  }, []);

  const vaults = useVaults();
  const topics = useTopics();
  const errors = useErrors();
  const salonPhrases = useSalonPhrases();
  const userDoc = useUserDoc();
  const sessions = useSessions(7);
  const attempts7d = useAttempts(7);

  const streak = effectiveStreak(userDoc);

  const due = useMemo(() => {
    if (!topics) return [];
    const now = Date.now();
    return topics
      .filter(
        (t) =>
          t.status === "fresh" ||
          t.status === "struggling" ||
          toMillis(t.nextReview) <= now
      )
      .sort(
        (a, b) =>
          topicPriority(a) - topicPriority(b) ||
          toMillis(a.nextReview) - toMillis(b.nextReview)
      );
  }, [topics]);

  const dueComposition = useMemo(() => {
    const out = { fresh: 0, review: 0, struggling: 0 };
    if (!topics) return out;
    const now = Date.now();
    for (const t of topics) {
      if (t.status === "mastered") continue;
      if (t.status === "fresh") {
        out.fresh += 1;
      } else if (t.status === "struggling") {
        out.struggling += 1;
      } else if (toMillis(t.nextReview) <= now) {
        out.review += 1;
      }
    }
    return out;
  }, [topics]);
  const nextDueTopic = due[0] ?? null;

  // Najsłabszy temat na „pytanie dnia": najpierw te z najniższą trafnością
  // (po próbach), w razie remisu struggling i więcej prób; gdy brak prób —
  // pierwszy nieopanowany temat.
  const weakestTopic = useMemo(() => {
    if (!topics) return null;
    const live = topics.filter((t) => t.status !== "mastered");
    if (live.length === 0) return null;
    const tried = live.filter((t) => t.totalAttempts > 0);
    const pool = tried.length > 0 ? tried : live;
    return [...pool].sort((a, b) => {
      const accA = a.totalAttempts > 0 ? a.totalCorrect / a.totalAttempts : 1;
      const accB = b.totalAttempts > 0 ? b.totalCorrect / b.totalAttempts : 1;
      if (accA !== accB) return accA - accB;
      return b.totalAttempts - a.totalAttempts;
    })[0];
  }, [topics]);

  const weakestVaultName = useMemo(() => {
    if (!weakestTopic || !vaults) return "";
    return vaults.find((v) => v.id === weakestTopic.vaultId)?.name ?? "";
  }, [weakestTopic, vaults]);

  const mastered = topics?.filter((t) => t.status === "mastered").length ?? 0;
  const totalTopics = topics?.length ?? 0;

  const accuracy7d = useMemo(() => {
    if (!attempts7d || attempts7d.length === 0) return null;
    const ok = attempts7d.filter((a) => a.isCorrect).length;
    return Math.round((ok / attempts7d.length) * 100);
  }, [attempts7d]);

  const activeErrors = errors?.length ?? 0;

  const salonTopic = useMemo(() => {
    if (!topics || !salonPhrases || salonPhrases.length === 0) return null;
    const sorted = [...salonPhrases].sort((a, b) => {
      const ta = topics.find((t) => t.id === a.topicId);
      const tb = topics.find((t) => t.id === b.topicId);
      return toMillis(ta?.lastShownInSalon) - toMillis(tb?.lastShownInSalon);
    });
    const pick = sorted[0];
    const topic = topics.find((t) => t.id === pick?.topicId);
    return topic && pick ? { topic, phrase: pick } : null;
  }, [topics, salonPhrases]);

  const sessionCount = sessions?.length ?? 0;
  const sessionTotalDuration = sessions?.reduce((s, x) => s + (x.duration ?? 0), 0) ?? 0;
  const weeklyAccuracy = useMemo(() => {
    if (!sessions || sessions.length === 0) return null;
    const totalAttempted = sessions.reduce((s, x) => s + (x.questionsAttempted ?? 0), 0);
    const totalCorrect = sessions.reduce((s, x) => s + (x.questionsCorrect ?? 0), 0);
    if (totalAttempted === 0) return null;
    return ((totalCorrect / totalAttempted) * 100).toFixed(1).replace(".", ",");
  }, [sessions]);

  /* ---------- First-run fallback ---------- */
  if (vaults && vaults.length === 0) {
    return (
      <div className="space-y-10">
        <header>
          <div className="eyebrow text-gold">
            {new Date().toLocaleDateString("pl-PL", {
              weekday: "long", day: "numeric", month: "long",
            })}
          </div>
          <h1 className="display text-5xl md:text-6xl mt-2 text-paper">
            Witaj w Vault.
          </h1>
          <p className="text-muted mt-4 max-w-xl leading-relaxed">
            Zanim zacznę, muszę założyć dwanaście sekcji i parę startowych
            tematów. Jednokrotnie.
          </p>
        </header>
        <FirstRunSeed />
      </div>
    );
  }

  /* ---------- Stats for spis treści (index) ---------- */

  const STATS: Array<{
    label: string;
    value: string;
    sub: string;
  }> = [
    {
      label: "Passa",
      value: String(streak || 0),
      sub: `${streak === 1 ? "dzień" : "dni"} z rzędu`,
    },
    {
      label: "Trafność",
      value: accuracy7d != null ? `${accuracy7d}%` : "—",
      sub: "z ostatnich 7 dni",
    },
    {
      label: "Opanowano",
      value: String(mastered),
      sub:
        totalTopics > 0
          ? `z ${totalTopics} kart · ${Math.round((mastered / totalTopics) * 100)}%`
          : "brak kart",
    },
    {
      label: "Errata",
      value: String(activeErrors),
      sub: activeErrors === 1 ? "karta do upilnowania" : "kart do upilnowania",
    },
  ];

  /* ---------- Greeting fragments ---------- */

  const displayDate = new Date().toLocaleDateString("pl-PL", {
    weekday: "long", day: "numeric", month: "long",
  });
  const chapterRoman = toRoman(Math.max(streak, 1));

  const heroLead =
    due.length === 0
      ? "Dziś masz wolne. Trzynaście dziedzin czeka — możesz zajrzeć na przegląd albo zostawić księgę zamkniętą."
      : `${due.length === 1 ? "Jeden temat" : `${due.length} ${due.length < 5 ? "tematy" : "tematów"}`} w kolejce. Piętnaście minut, trzy fazy — powtórki, nowe karty, quiz z oceną AI.`;

  /* ---------- Render ---------- */

  return (
    // Bust out of the standard max-w-content wrapper for a wider canvas
    <div className="-mx-6 md:-mx-12 -mt-10 md:-mt-12">
      <div className="relative" style={{ overflow: "hidden" }}>
        {/* Top light spill */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: 0,
            left: 0,
            right: 0,
            height: 600,
            background:
              "radial-gradient(ellipse 55% 70% at 50% 0%, rgba(255,210,160,0.10), transparent 70%)",
            zIndex: 1,
          }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          <Hero
            displayDate={displayDate}
            chapterRoman={chapterRoman}
            streak={streak}
            heroLead={heroLead}
            dueCount={due.length}
            sessionNumber={sessionCount + 1}
          />
          <CuratorDesk
            dueCount={due.length}
            dueComposition={dueComposition}
            nextTopic={
              nextDueTopic
                ? {
                    title: nextDueTopic.title,
                    reason: topicQueueReason(nextDueTopic),
                  }
                : null
            }
            errorsCount={activeErrors}
            salonTopic={salonTopic}
            weeklyMinutes={Math.round(sessionTotalDuration / 60)}
            weeklySessions={sessionCount}
            weeklyAccuracy={weeklyAccuracy}
          />
          {weakestTopic && (
            <PytanieDnia topic={weakestTopic} vaultName={weakestVaultName} />
          )}
          <PlaqueRow stats={STATS} />
          <CuratorLetter
            dueCount={due.length}
            errorsCount={activeErrors}
            masteredCount={mastered}
            weeklyMinutes={Math.round(sessionTotalDuration / 60)}
            weeklySessions={sessionCount}
            weeklyAccuracy={weeklyAccuracy}
          />
          <InvitationRow
            errorsCount={activeErrors}
            errorsTopChips={
              errors
                ?.slice(0, 3)
                .map((e) => `${e.timesWrong}× ${e.correctVersion.split(" ").slice(0, 2).join(" ")}`)
                .join(" · ") ?? "—"
            }
            salonTopic={salonTopic}
            weeklyMinutes={Math.round(sessionTotalDuration / 60)}
            weeklySessions={sessionCount}
            weeklyAccuracy={weeklyAccuracy}
          />
          <ErrataShelf errors={errors ?? []} />
          <WeeklyLedger
            sessions={sessions ?? []}
            topics={topics ?? []}
            vaults={vaults ?? []}
            weeklyMinutes={Math.round(sessionTotalDuration / 60)}
            weeklySessions={sessionCount}
            weeklyAccuracy={weeklyAccuracy}
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Hero — greeting + agenda
   ============================================================ */

interface HeroProps {
  displayDate: string;
  chapterRoman: string;
  streak: number;
  heroLead: string;
  dueCount: number;
  sessionNumber: number;
}

function Hero({
  displayDate,
  chapterRoman,
  streak,
  heroLead,
  dueCount,
  sessionNumber,
}: HeroProps) {
  return (
    <div className="px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-8 md:pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT — greeting */}
        <div className="lg:col-span-7">
          <div
            className="eyebrow flex items-center"
            style={{ color: "var(--c-gold-400)", marginBottom: 20, gap: 16 }}
          >
            <span style={{ textTransform: "uppercase" }}>
              {displayDate} · MMXXVI
            </span>
            <span
              style={{
                flex: 1,
                height: 1,
                background: "rgba(184,146,77,0.35)",
              }}
            />
          </div>

          <h1
            className="display"
            style={{
              fontSize: "clamp(40px, 6vw, 60px)",
              color: "var(--c-paper-100)",
              marginBottom: 16,
              lineHeight: 1.0,
              letterSpacing: "-0.01em",
            }}
          >
            Witaj znów,{" "}
            <span style={{ color: "var(--c-gold-400)" }}>Natalio</span>
            <span style={{ color: "var(--c-paper-300)", opacity: 0.55 }}>.</span>
          </h1>

          {streak > 0 && (
            <div
              className="signature flex items-center"
              style={{
                color: "var(--c-paper-300)",
                opacity: 0.78,
                marginBottom: 24,
                gap: 10,
                fontSize: 14,
              }}
            >
              <span
                className="font-display italic"
                style={{
                  color: "var(--c-gold-400)",
                  fontSize: 18,
                  opacity: 0.95,
                }}
                aria-hidden
              >
                ❦
              </span>
              <span>
                Otwieramy rozdział{" "}
                <span
                  style={{
                    color: "var(--c-gold-300)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {chapterRoman}
                </span>{" "}
                — {streak === 1 ? "pierwszy" : `${streak === 2 ? "drugi" : streak === 3 ? "trzeci" : `${streak}.`}`}{" "}
                dzień Twojej passy.
              </span>
            </div>
          )}

          <p
            className="lead"
            style={{
              color: "rgba(228,214,186,0.74)",
              maxWidth: 540,
              marginBottom: 32,
            }}
          >
            {heroLead}
          </p>

          <div className="flex items-center flex-wrap" style={{ gap: 14 }}>
            <Link
              href="/study"
              className="btn-primary"
              style={{
                textDecoration: "none",
              }}
            >
              <GraduationCap className="h-4 w-4 stroke-[1.5]" />
              Otwórz sesję · 15 min
            </Link>
            <Link
              href="/vaults"
              className="btn-ghost"
              style={{
                textDecoration: "none",
              }}
            >
              <LibraryBig className="h-4 w-4 stroke-[1.5]" />
              Pokaż agendę
            </Link>
            <Link
              href="/study/session/new?mode=mix&limit=3"
              className="btn-ghost"
              style={{
                textDecoration: "none",
              }}
            >
              Minimum day · 3 pytania
            </Link>
          </div>
        </div>

        {/* RIGHT — date stamp + agenda */}
        <div className="lg:col-span-5 flex flex-col lg:items-end">
          <div className="lg:self-end mt-2 lg:mt-0">
            <DateStamp />
          </div>

          <div
            className="mt-8 w-full lg:max-w-[360px] lg:self-end"
          >
            <div
              className="eyebrow flex items-center"
              style={{
                color: "var(--c-gold-400)",
                marginBottom: 12,
                gap: 12,
                opacity: 0.85,
              }}
            >
              <span>
                Sesja {toRoman(sessionNumber)} · {dueCount > 0 ? "dziś" : "wstrzymana"}
              </span>
              <span
                style={{
                  flex: 1,
                  height: 0.5,
                  background: "rgba(184,146,77,0.25)",
                }}
              />
            </div>
            {[
              { ph: "I", t: "Teoria", dur: "3:00" },
              { ph: "II", t: "Test", dur: "10:00" },
              { ph: "III", t: "Korekta", dur: "2:00" },
            ].map((p) => (
              <div
                key={p.ph}
                className="flex items-baseline"
                style={{ padding: "6px 0", gap: 14 }}
              >
                <span
                  className="font-display italic"
                  style={{
                    color: "var(--c-gold-400)",
                    fontSize: 14,
                    width: 24,
                    flexShrink: 0,
                    opacity: 0.85,
                  }}
                >
                  {p.ph}
                </span>
                <span
                  style={{
                    flex: 1,
                    color: "var(--c-paper-200)",
                    fontSize: 14,
                    opacity: 0.85,
                  }}
                >
                  {p.t}
                </span>
                <span
                  className="signature"
                  style={{ color: "var(--c-paper-300)", opacity: 0.55 }}
                >
                  {p.dur}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CuratorDesk — recommended next move + daily state
   ============================================================ */

interface CuratorDeskProps {
  dueCount: number;
  dueComposition: {
    fresh: number;
    review: number;
    struggling: number;
  };
  nextTopic: { title: string; reason: string } | null;
  errorsCount: number;
  salonTopic: {
    topic: { id: string; title: string };
    phrase: { short: string };
  } | null;
  weeklyMinutes: number;
  weeklySessions: number;
  weeklyAccuracy: string | null;
}

function CuratorDesk({
  dueCount,
  dueComposition,
  nextTopic,
  errorsCount,
  salonTopic,
  weeklyMinutes,
  weeklySessions,
  weeklyAccuracy,
}: CuratorDeskProps) {
  const hasDue = dueCount > 0;
  const primary = hasDue
    ? {
        href: "/study",
        label: "Zacznij sesję",
        icon: GraduationCap,
        note: `${dueCount} ${dueCount === 1 ? "temat czeka" : dueCount < 5 ? "tematy czekają" : "tematów czeka"} w kolejce spaced repetition.`,
      }
    : salonTopic
    ? {
        href: `/salon/${salonTopic.topic.id}`,
        label: "Wejdź do salonu",
        icon: Sparkles,
        note: "Kolejka jest czysta. Najlepszy ruch: lekka rozmowa i obycie z tematem.",
      }
    : {
        href: "/vaults",
        label: "Przejrzyj regał",
        icon: LibraryBig,
        note: "Kolejka jest czysta. Możesz spokojnie wybrać tom do następnego wejścia.",
      };

  const PrimaryIcon = primary.icon;
  const totalFocus = Math.max(
    1,
    dueComposition.fresh + dueComposition.review + dueComposition.struggling
  );
  const strips = [
    {
      label: "Nowe",
      value: dueComposition.fresh,
      color: "var(--c-cognac)",
    },
    {
      label: "Powtórki",
      value: dueComposition.review,
      color: "var(--c-gold-500)",
    },
    {
      label: "Trudne",
      value: dueComposition.struggling,
      color: "var(--c-ink)",
    },
  ];
  const topicTitle = salonTopic?.topic.title ?? "Temat do swobodnej rozmowy";
  const minutesLabel =
    weeklyMinutes > 0
      ? `${Math.floor(weeklyMinutes / 60)}h ${weeklyMinutes % 60}min`
      : "0 min";

  return (
    <section className="px-6 md:px-12 lg:px-16 pb-12 md:pb-14">
      <div
        className="grid grid-cols-1 lg:grid-cols-12"
        style={{
          gap: 20,
        }}
      >
        <div className="lg:col-span-7">
          <div
            className="tex-paper tex-noise-fine relative h-full overflow-hidden"
            style={{
              minHeight: 286,
              boxShadow:
                "0 1px 0 rgba(255,250,235,0.65) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 24px 48px -18px rgba(0,0,0,0.72), 0 5px 10px rgba(0,0,0,0.35)",
            }}
          >
            <div
              aria-hidden
              className="absolute pointer-events-none"
              style={{
                inset: 14,
                border: "0.5px solid rgba(146,112,55,0.34)",
                zIndex: 2,
              }}
            />
            <div
              aria-hidden
              className="absolute pointer-events-none"
              style={{
                inset: "auto -10% -44% 20%",
                height: 170,
                background:
                  "radial-gradient(ellipse 60% 70%, rgba(139,46,31,0.16), transparent 68%)",
                zIndex: 2,
              }}
            />
            <div
              className="relative grid grid-cols-1 sm:grid-cols-[1fr_auto]"
              style={{ zIndex: 3, gap: 24, padding: "34px 34px 30px" }}
            >
              <div>
                <div
                  className="eyebrow flex items-center"
                  style={{
                    gap: 10,
                    color: "rgba(139,46,31,0.82)",
                    marginBottom: 12,
                  }}
                >
                  <NotebookPen className="h-3.5 w-3.5 stroke-[1.7]" />
                  Plan dnia · curator note
                </div>
                <h2
                  className="font-display italic"
                  style={{
                    fontSize: "clamp(32px, 4vw, 48px)",
                    color: "#1B1108",
                    lineHeight: 1.0,
                    fontWeight: 600,
                    letterSpacing: "-0.015em",
                    marginBottom: 14,
                  }}
                >
                  {hasDue ? "Najpierw nauka." : "Dziś lekko."}
                </h2>
                <p
                  className="body-prose"
                  style={{
                    color: "rgba(27,17,8,0.78)",
                    maxWidth: 540,
                    marginBottom: 22,
                  }}
                >
                  {primary.note}{" "}
                  {nextTopic
                    ? `Pierwszy w kolejce: ${nextTopic.title}. ${nextTopic.reason}`
                    : ""}
                  {" "}
                  {errorsCount > 0
                    ? `Errata ma ${errorsCount} ${errorsCount === 1 ? "aktywny wpis" : "aktywnych wpisów"}, więc po sesji warto zamknąć przynajmniej jeden.`
                    : "Errata jest czysta, więc możesz trzymać rytm bez naprawiania zaległości."}
                </p>
                <div className="flex items-center flex-wrap" style={{ gap: 10 }}>
                  <Link
                    href={primary.href}
                    className="vault-paper-action"
                    style={{ textDecoration: "none" }}
                  >
                    <PrimaryIcon className="h-4 w-4 stroke-[1.7]" />
                    {primary.label}
                    <ArrowRight className="h-3.5 w-3.5 stroke-[1.7]" />
                  </Link>
                  <Link
                    href={errorsCount > 0 ? "/errors" : "/salon"}
                    className="vault-paper-action secondary"
                    style={{ textDecoration: "none" }}
                  >
                    <BookOpenCheck className="h-4 w-4 stroke-[1.7]" />
                    {errorsCount > 0 ? "Zobacz erratę" : "Salon po sesji"}
                  </Link>
                </div>
              </div>

              <div
                className="hidden sm:flex flex-col items-center justify-center"
                style={{
                  width: 124,
                  minHeight: 170,
                  borderLeft: "0.5px dashed rgba(27,17,8,0.20)",
                  paddingLeft: 24,
                }}
              >
                <div
                  className="font-display italic"
                  style={{
                    fontSize: 74,
                    lineHeight: 0.85,
                    color: hasDue ? "var(--c-ink)" : "var(--c-racing)",
                    opacity: 0.86,
                    fontWeight: 600,
                  }}
                >
                  {String(dueCount).padStart(2, "0")}
                </div>
                <div
                  className="signature"
                  style={{
                    color: "rgba(27,17,8,0.55)",
                    marginTop: 12,
                    textAlign: "center",
                    textTransform: "uppercase",
                  }}
                >
                  {hasDue ? "w kolejce" : "zaległości"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1" style={{ gap: 20 }}>
          <div
            className="relative"
            style={{
              border: "1px solid rgba(184,146,77,0.24)",
              background:
                "linear-gradient(145deg, rgba(228,214,186,0.055), rgba(228,214,186,0.018))",
              padding: "24px 24px 22px",
              boxShadow:
                "inset 0 1px 0 rgba(184,146,77,0.10), 0 18px 36px -24px rgba(0,0,0,0.65)",
            }}
          >
            <div
              className="eyebrow"
              style={{ color: "var(--c-gold-400)", marginBottom: 18 }}
            >
              Skład kolejki
            </div>
            <div style={{ display: "grid", gap: 13 }}>
              {strips.map((s) => (
                <div key={s.label}>
                  <div
                    className="flex items-center justify-between signature"
                    style={{
                      color: "var(--c-paper-300)",
                      opacity: 0.72,
                      marginBottom: 6,
                    }}
                  >
                    <span>{s.label}</span>
                    <span>{String(s.value).padStart(2, "0")}</span>
                  </div>
                  <div
                    style={{
                      height: 4,
                      background: "rgba(184,146,77,0.12)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.round((s.value / totalFocus) * 100)}%`,
                        minWidth: s.value > 0 ? 18 : 0,
                        background: s.color,
                        boxShadow: `0 0 10px ${s.color}55`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative"
            style={{
              border: "1px solid rgba(184,146,77,0.24)",
              background:
                "linear-gradient(145deg, rgba(58,15,28,0.44), rgba(27,17,8,0.35))",
              padding: "24px 24px 22px",
              boxShadow:
                "inset 0 1px 0 rgba(255,200,180,0.08), 0 18px 36px -24px rgba(0,0,0,0.65)",
            }}
          >
            <div
              className="eyebrow"
              style={{ color: "var(--c-gold-400)", marginBottom: 10 }}
            >
              Po sesji
            </div>
            <h3
              className="font-display italic"
              style={{
                color: "var(--c-paper-100)",
                fontSize: 28,
                lineHeight: 1.05,
                fontWeight: 500,
                marginBottom: 10,
              }}
            >
              {topicTitle}
            </h3>
            <p
              className="caption"
              style={{
                color: "var(--c-paper-300)",
                opacity: 0.68,
                marginBottom: 16,
              }}
            >
              Tydzień: {weeklySessions} {weeklySessions === 1 ? "sesja" : "sesji"} · {minutesLabel}
              {weeklyAccuracy ? ` · śr. ${weeklyAccuracy}%` : ""}
            </p>
            <Link
              href={salonTopic ? `/salon/${salonTopic.topic.id}` : "/salon"}
              className="eyebrow inline-flex items-center"
              style={{
                gap: 8,
                color: "var(--c-gold-300)",
                textDecoration: "none",
              }}
            >
              Otwórz rozmowę
              <ArrowRight className="h-3.5 w-3.5 stroke-[1.7]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PlaqueRow — StatRowIndex (dot-leader spis treści)
   ============================================================ */

function PlaqueRow({
  stats,
}: {
  stats: Array<{ label: string; value: string; sub: string }>;
}) {
  return (
    <div className="px-6 md:px-12 lg:px-16 pb-12 md:pb-14">
      <div
        style={{
          padding: "28px 0 8px",
          borderTop: "1px solid rgba(184,146,77,0.35)",
        }}
      >
        <div
          className="eyebrow flex items-center"
          style={{
            color: "var(--c-gold-400)",
            marginBottom: 18,
            gap: 16,
          }}
        >
          <span>Bilans · stan na dziś</span>
          <span
            style={{ flex: 1, height: 1, background: "rgba(184,146,77,0.2)" }}
          />
          <span style={{ opacity: 0.6 }}>
            {new Date().toLocaleDateString("pl-PL", {
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>

        {stats.map((s, i) => (
          <div
            key={s.label}
            className="flex items-baseline"
            style={{
              padding: "14px 0",
              borderTop:
                i === 0 ? "none" : "0.5px solid rgba(184,146,77,0.15)",
              gap: 18,
            }}
          >
            <span
              className="signature"
              style={{
                color: "var(--c-gold-500)",
                width: 28,
                flexShrink: 0,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className="font-display italic font-medium"
              style={{
                fontSize: "clamp(20px, 2.2vw, 26px)",
                color: "var(--c-paper-100)",
                letterSpacing: "-0.01em",
                minWidth: 140,
              }}
            >
              {s.label}
            </span>
            <span
              style={{
                flex: 1,
                borderBottom: "1px dotted rgba(184,146,77,0.4)",
                transform: "translateY(-6px)",
              }}
            />
            <span
              className="signature hidden sm:inline"
              style={{
                color: "var(--c-paper-300)",
                opacity: 0.65,
                textAlign: "right",
              }}
            >
              {s.sub}
            </span>
            <span
              className="font-display italic font-medium"
              style={{
                fontSize: "clamp(24px, 2.6vw, 32px)",
                color: "var(--c-gold-400)",
                lineHeight: 1,
                minWidth: 80,
                textAlign: "right",
                letterSpacing: "-0.02em",
              }}
            >
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CuratorLetter({
  dueCount,
  errorsCount,
  masteredCount,
  weeklyMinutes,
  weeklySessions,
  weeklyAccuracy,
}: {
  dueCount: number;
  errorsCount: number;
  masteredCount: number;
  weeklyMinutes: number;
  weeklySessions: number;
  weeklyAccuracy: string | null;
}) {
  const opening =
    weeklySessions === 0
      ? "Ten tydzień jeszcze nie ma wpisu w rejestrze."
      : `W tym tygodniu zamknęłaś ${weeklySessions} ${weeklySessions === 1 ? "sesję" : "sesji"} i ${weeklyMinutes} minut pracy.`;
  const accuracy = weeklyAccuracy
    ? ` Średnia trafność: ${weeklyAccuracy}%.`
    : "";
  const next =
    dueCount > 0
      ? ` Na biurku leży ${dueCount} ${dueCount === 1 ? "temat" : dueCount < 5 ? "tematy" : "tematów"} do zdjęcia z kolejki.`
      : " Kolejka jest czysta; dziś wystarczy Salon albo minimum day.";
  const errata =
    errorsCount > 0
      ? ` Errata trzyma ${errorsCount} ${errorsCount === 1 ? "wpis" : "wpisów"}, więc warto rehabilitować jeden słaby punkt.`
      : " Errata nie domaga się dziś uwagi.";

  return (
    <section className="px-6 md:px-12 lg:px-16 pb-12 md:pb-14">
      <div
        className="tex-paper tex-noise-fine relative"
        style={{
          padding: "28px 32px 26px",
          boxShadow:
            "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 22px 46px -24px rgba(0,0,0,0.72)",
        }}
      >
        <div
          className="eyebrow"
          style={{ color: "rgba(122,74,31,0.76)", marginBottom: 12 }}
        >
          List kuratora · tydzień bieżący
        </div>
        <p
          className="font-display italic"
          style={{
            color: "#1B1108",
            fontSize: "clamp(25px, 3.2vw, 38px)",
            lineHeight: 1.12,
            fontWeight: 600,
            maxWidth: 920,
          }}
        >
          {opening}
          {accuracy}
          {next}
          {errata}
        </p>
        <div
          className="signature"
          style={{
            color: "rgba(27,17,8,0.48)",
            marginTop: 16,
            textTransform: "uppercase",
          }}
        >
          {masteredCount} opanowanych kart · bez fajerwerków, za to z ciągłością
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   InvitationRow — RitualsC: Salon featured (velvet) + 2 sides
   ============================================================ */

interface InvitationRowProps {
  errorsCount: number;
  errorsTopChips: string;
  salonTopic: {
    topic: { id: string; title: string };
    phrase: { short: string };
  } | null;
  weeklyMinutes: number;
  weeklySessions: number;
  weeklyAccuracy: string | null;
}

function InvitationRow({
  errorsCount,
  errorsTopChips,
  salonTopic,
  weeklyMinutes,
  weeklySessions,
  weeklyAccuracy,
}: InvitationRowProps) {
  const featured = {
    href: salonTopic ? `/salon/${salonTopic.topic.id}` : "/salon",
    eyebrow: salonTopic ? "Salon · temat dnia" : "Salon",
    title: salonTopic?.topic.title ?? "Wybierz temat",
    body:
      salonTopic?.phrase.short ??
      "Trzy zdania na temat. Krótko, rozbudowanie, pułapka. Praktyczne obycie, nie egzamin.",
    meta: "Ćwicz wypowiedź · ocena finezji AI",
    cta: "Wejdź do salonu",
    sealLabel: "S",
    sealTone: "burgundy" as const,
  };

  const sides = [
    {
      href: "/errors",
      eyebrow: `Errata · ${errorsCount} ${errorsCount === 1 ? "karta" : "kart"}`,
      title: "Słabe ogniwa",
      meta: errorsTopChips,
      cta: "Otwórz erratę",
      ord: "I",
    },
    {
      href: "/stats",
      eyebrow: `Tydzień · ${weeklySessions} ${weeklySessions === 1 ? "sesja" : "sesji"}`,
      title: "Dziennik postępów",
      meta:
        weeklySessions > 0
          ? `${Math.floor(weeklyMinutes / 60)}h ${weeklyMinutes % 60}min · śr. ${weeklyAccuracy ?? "—"}%`
          : "Brak sesji w tym tygodniu",
      cta: "Otwórz statystyki",
      ord: "III",
    },
  ];

  return (
    <div className="px-6 md:px-12 lg:px-16 pb-14 md:pb-16">
      <div
        className="flex items-baseline"
        style={{ marginBottom: 22, gap: 20 }}
      >
        <h2
          className="h2"
          style={{ fontSize: "clamp(28px, 3.4vw, 36px)", color: "var(--c-paper-100)" }}
        >
          Po sesji
        </h2>
        <div
          style={{
            flex: 1,
            height: 1,
            background: "rgba(184,146,77,0.3)",
            transform: "translateY(-8px)",
          }}
        />
        <span
          className="signature"
          style={{ color: "var(--c-paper-300)", opacity: 0.6 }}
        >
          III rytuały
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-stretch">
        {/* Salon featured */}
        <div className="lg:col-span-7">
          <Link
            href={featured.href}
            className="block h-full"
            style={{ minHeight: 340 }}
          >
            <div
              className="tex-velvet relative h-full flex flex-col"
              style={{
                boxShadow:
                  "0 24px 48px -20px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(184,146,77,0.32)",
              }}
            >
              <div
                className="relative flex-1 flex flex-col"
                style={{
                  margin: 14,
                  border: "0.5px solid rgba(184,146,77,0.45)",
                  padding: "28px 28px 24px",
                }}
              >
                <div
                  className="absolute pointer-events-none"
                  style={{
                    inset: 4,
                    border: "0.5px solid rgba(184,146,77,0.20)",
                  }}
                />
                <div
                  className="flex items-start justify-between"
                  style={{ marginBottom: 18 }}
                >
                  <span
                    className="eyebrow"
                    style={{ color: "var(--c-gold-300)" }}
                  >
                    {featured.eyebrow}
                  </span>
                  <WaxSeal
                    size={52}
                    label={featured.sealLabel}
                    tone={featured.sealTone}
                  />
                </div>
                <h3
                  className="h3"
                  style={{
                    fontSize: 34,
                    color: "var(--c-paper-100)",
                    marginBottom: 12,
                    lineHeight: 1.05,
                  }}
                >
                  {featured.title}
                </h3>
                <p
                  className="body-prose"
                  style={{
                    color: "rgba(228,214,186,0.78)",
                    marginBottom: 16,
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  {featured.body}
                </p>
                <div
                  className="signature"
                  style={{
                    color: "rgba(228,214,186,0.55)",
                    marginBottom: 16,
                  }}
                >
                  {featured.meta}
                </div>
                <div style={{ flex: 1 }} />
                <div
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent, rgba(184,146,77,0.4), transparent)",
                    marginBottom: 16,
                  }}
                />
                <div className="flex items-center justify-between">
                  <span
                    className="eyebrow"
                    style={{ color: "var(--c-gold-300)" }}
                  >
                    {featured.cta}
                  </span>
                  <span
                    style={{ color: "var(--c-gold-300)", fontSize: 16 }}
                  >
                    →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Two side entries */}
        <div className="lg:col-span-5 flex flex-col gap-4 md:gap-[18px]">
          {sides.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="block flex-1"
            >
              <div
                className="relative h-full"
                style={{
                  border: "1px solid rgba(184,146,77,0.28)",
                  padding: "28px 28px 24px",
                  background: "rgba(228,214,186,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 160,
                }}
              >
                <div
                  className="eyebrow flex items-center justify-between"
                  style={{ color: "var(--c-gold-400)", marginBottom: 10 }}
                >
                  <span>{r.eyebrow}</span>
                  <span
                    style={{ color: "var(--c-paper-300)", opacity: 0.5 }}
                  >
                    {r.ord}
                  </span>
                </div>
                <div
                  className="font-display italic"
                  style={{
                    fontSize: 24,
                    color: "var(--c-paper-100)",
                    fontWeight: 500,
                    lineHeight: 1.1,
                    marginBottom: 8,
                  }}
                >
                  {r.title}
                </div>
                <div
                  className="signature"
                  style={{
                    color: "var(--c-paper-300)",
                    opacity: 0.6,
                    marginBottom: 14,
                  }}
                >
                  {r.meta}
                </div>
                <div style={{ flex: 1 }} />
                <div
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent, rgba(184,146,77,0.35), transparent)",
                    marginBottom: 14,
                  }}
                />
                <div className="flex items-center justify-between">
                  <span
                    className="eyebrow"
                    style={{ color: "var(--c-gold-300)" }}
                  >
                    {r.cta}
                  </span>
                  <span
                    style={{ color: "var(--c-gold-400)", fontSize: 14 }}
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ErrataShelf — oxblood leather pad with 3 catalog cards
   ============================================================ */

interface ErrataItem {
  id: string;
  vaultName: string;
  correctVersion: string;
  wrongVersion: string;
  context: string;
  timesWrong: number;
}

function ErrataShelf({ errors }: { errors: ErrataItem[] }) {
  if (!errors || errors.length === 0) return null;
  const items = errors.slice(0, 3);
  const rotates = [-1.2, 0.4, 1.6];

  return (
    <div className="px-6 md:px-12 lg:px-16 pb-14 md:pb-16">
      <div className="flex items-baseline justify-between" style={{ marginBottom: 24 }}>
        <div>
          <div
            className="eyebrow"
            style={{ color: "var(--c-ink2)", marginBottom: 8 }}
          >
            Error Vault · {errors.length} {errors.length === 1 ? "wpis" : "wpisów"}
          </div>
          <h2
            className="h2"
            style={{ fontSize: "clamp(28px, 3.4vw, 36px)", color: "var(--c-paper-100)" }}
          >
            Ostatnie błędy do upilnowania
          </h2>
        </div>
        <Link
          href="/errors"
          className="eyebrow"
          style={{ color: "var(--c-gold-400)" }}
        >
          Wszystkie →
        </Link>
      </div>

      <div
        className="tex-leather relative"
        style={{
          padding: "32px 24px 40px",
          boxShadow:
            "inset 0 1px 0 rgba(255,180,140,0.12), inset 0 -3px 8px rgba(0,0,0,0.55), 0 24px 48px -16px rgba(0,0,0,0.75), 0 4px 8px rgba(0,0,0,0.4)",
          isolation: "isolate",
        }}
      >
        {/* gold-tooled double inner rule */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: 14,
            border: "0.5px solid rgba(184,146,77,0.55)",
            boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.5)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            inset: 22,
            border: "0.5px solid rgba(184,146,77,0.22)",
          }}
        />

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start" style={{ zIndex: 2 }}>
          {items.map((e, i) => (
            <div
              key={e.id}
              style={{ transform: `rotate(${(rotates[i] ?? 0) * 0.6}deg)` }}
            >
              <ErratumCard
                sig={`${vaultSig(e.vaultName)} · ${idSig(e.id)}`}
                times={e.timesWrong}
                front={e.correctVersion}
                wrong={e.wrongVersion}
                context={e.context}
                stamp={e.timesWrong >= 3 ? "UCIĄŻLIWE" : "DO UPILNOWANIA"}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ErratumCard({
  sig,
  times,
  front,
  wrong,
  context,
  stamp,
}: {
  sig: string;
  times: number;
  front: string;
  wrong: string;
  context: string;
  stamp: string;
}) {
  return (
    <div
      className="tex-paper tex-noise-fine relative"
      style={{
        boxShadow:
          "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 18px 36px -16px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.35)",
      }}
    >
      {/* perforated top */}
      <div
        style={{
          height: 22,
          borderBottom: "0.5px dashed rgba(27,17,8,0.28)",
          position: "relative",
        }}
      >
        <div
          className="signature absolute"
          style={{
            left: 18,
            top: "50%",
            transform: "translateY(-50%)",
            color: "rgba(27,17,8,0.6)",
          }}
        >
          {sig}
        </div>
        <div
          className="signature absolute"
          style={{
            right: 18,
            top: "50%",
            transform: "translateY(-50%)",
            color: "rgba(27,17,8,0.55)",
          }}
        >
          × {times}
        </div>
      </div>

      <div style={{ padding: "22px 24px 36px", position: "relative" }}>
        <p
          className="font-display italic"
          style={{
            fontSize: 20,
            color: "#1B1108",
            lineHeight: 1.32,
            marginBottom: 14,
            fontWeight: 500,
          }}
        >
          {front}
        </p>
        <div
          style={{
            height: 0.5,
            background: "rgba(27,17,8,0.22)",
            margin: "14px 0",
          }}
        />
        <p
          className="body-prose"
          style={{
            color: "rgba(27,17,8,0.78)",
            fontSize: 13,
            lineHeight: 1.55,
          }}
        >
          <span style={{ color: "rgba(27,17,8,0.6)", fontStyle: "italic" }}>
            nie:{" "}
          </span>
          <span
            style={{
              textDecoration: "line-through",
              textDecorationThickness: "1px",
              opacity: 0.62,
            }}
          >
            {wrong}
          </span>
          {context && (
            <>
              <br />
              · {context}
            </>
          )}
        </p>

        <div
          className="absolute"
          style={{
            right: 16,
            bottom: 16,
            transform: "rotate(-6deg)",
            border: "1.5px solid var(--c-ink2)",
            color: "var(--c-ink2)",
            padding: "4px 9px 3px",
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 9,
            letterSpacing: "0.18em",
            fontWeight: 600,
            opacity: 0.85,
          }}
        >
          {stamp}
        </div>

        <div
          className="absolute"
          style={{
            bottom: -3,
            left: "50%",
            transform: "translateX(-50%)",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "rgba(27,17,8,0.45)",
          }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   WeeklyLedger — last 7 sessions table
   ============================================================ */

interface WeeklyLedgerProps {
  sessions: Array<{
    id: string;
    startedAt: Timestamp | Date;
    topicIds: string[];
    vaultId: string | null;
    questionsAttempted: number;
    questionsCorrect: number;
    duration: number;
  }>;
  topics: Array<{ id: string; title: string; vaultId: string }>;
  vaults: Array<{ id: string; name: string }>;
  weeklyMinutes: number;
  weeklySessions: number;
  weeklyAccuracy: string | null;
}

function WeeklyLedger({
  sessions,
  topics,
  vaults,
  weeklyMinutes,
  weeklySessions,
  weeklyAccuracy,
}: WeeklyLedgerProps) {
  const rows = useMemo(() => {
    return [...sessions]
      .sort((a, b) => toMillis(b.startedAt) - toMillis(a.startedAt))
      .slice(0, 7)
      .map((s) => {
        const d = new Date(toMillis(s.startedAt) || Date.now());
        const firstTopic = s.topicIds[0]
          ? topics.find((t) => t.id === s.topicIds[0])
          : null;
        const vault = firstTopic
          ? vaults.find((v) => v.id === firstTopic.vaultId)
          : s.vaultId
          ? vaults.find((v) => v.id === s.vaultId)
          : null;
        const tom = `${vault?.name ?? "—"}${firstTopic ? " · " + firstTopic.title : ""}`;
        const acc =
          s.questionsAttempted > 0
            ? Math.round((s.questionsCorrect / s.questionsAttempted) * 100)
            : 0;
        return {
          date: ledgerDate(d),
          tom,
          cards: String(s.questionsAttempted ?? 0),
          acc: `${acc}%`,
          time: formatDuration(s.duration ?? 0),
        };
      });
  }, [sessions, topics, vaults]);

  return (
    <div className="px-6 md:px-12 lg:px-16 pb-16 md:pb-24">
      <div
        className="flex items-baseline justify-between flex-wrap"
        style={{ marginBottom: 24, gap: 16 }}
      >
        <div>
          <div
            className="eyebrow"
            style={{ color: "var(--c-gold-400)", marginBottom: 8 }}
          >
            Dziennik · tydzień
          </div>
          <h2
            className="h2"
            style={{ fontSize: "clamp(28px, 3.4vw, 36px)", color: "var(--c-paper-100)" }}
          >
            Ostatnie sesje
          </h2>
        </div>
        <div
          className="signature"
          style={{ color: "var(--c-paper-300)", opacity: 0.7 }}
        >
          {weeklySessions === 0
            ? "Brak sesji"
            : `${weeklySessions} ${weeklySessions === 1 ? "sesja" : "sesji"} · ${Math.floor(weeklyMinutes / 60)}h ${weeklyMinutes % 60}min${weeklyAccuracy ? ` · śr. ${weeklyAccuracy}%` : ""}`}
        </div>
      </div>

      {rows.length === 0 ? (
        <div
          style={{
            background: "rgba(228,214,186,0.03)",
            border: "1px solid rgba(184,146,77,0.18)",
            padding: "32px",
            textAlign: "center",
          }}
        >
          <p
            className="font-display italic text-2xl"
            style={{ color: "var(--c-paper-300)", opacity: 0.65 }}
          >
            Dziennik jest pusty.
          </p>
          <p
            className="body-prose"
            style={{
              color: "var(--c-paper-300)",
              opacity: 0.5,
              marginTop: 8,
              fontSize: 13,
            }}
          >
            Otwórz pierwszą sesję żeby zacząć notować.
          </p>
        </div>
      ) : (
        <div
          style={{
            background: "rgba(228,214,186,0.035)",
            border: "1px solid rgba(184,146,77,0.22)",
            padding: "16px 24px",
          }}
        >
          <div
            className="eyebrow grid grid-cols-12"
            style={{
              color: "var(--c-gold-400)",
              opacity: 0.7,
              paddingBottom: 12,
              borderBottom: "1px solid rgba(184,146,77,0.22)",
              gap: 8,
            }}
          >
            <span className="col-span-2 md:col-span-1">Data</span>
            <span className="col-span-6 md:col-span-6">Tom</span>
            <span className="col-span-2 md:col-span-2">Karty</span>
            <span className="col-span-1 md:col-span-2">Trafn.</span>
            <span className="col-span-1 md:col-span-1 text-right">Czas</span>
          </div>

          {rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-12 body-prose"
              style={{
                padding: "12px 0",
                borderBottom:
                  i < rows.length - 1
                    ? "0.5px solid rgba(184,146,77,0.12)"
                    : "none",
                color: "var(--c-paper-200)",
                fontSize: 14,
                gap: 8,
              }}
            >
              <span
                className="col-span-2 md:col-span-1 signature"
                style={{ color: "var(--c-gold-400)" }}
              >
                {row.date}
              </span>
              <span
                className="col-span-6 md:col-span-6"
                style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {row.tom}
              </span>
              <span className="col-span-2 md:col-span-2 signature">
                {row.cards}
              </span>
              <span
                className="col-span-1 md:col-span-2 signature"
                style={{
                  color:
                    parseInt(row.acc) >= 90
                      ? "var(--c-gold-300)"
                      : "var(--c-paper-200)",
                }}
              >
                {row.acc}
              </span>
              <span className="col-span-1 md:col-span-1 signature text-right">
                {row.time}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* footer ornament */}
      <div
        className="ornament-sep"
        style={{
          marginTop: 48,
          color: "var(--c-gold-500)",
          opacity: 0.6,
          fontSize: 14,
        }}
      >
        ❦
      </div>
      <div
        className="signature"
        style={{
          color: "var(--c-paper-300)",
          opacity: 0.45,
          textAlign: "center",
          marginTop: 14,
        }}
      >
        Sub gratia studiorum · The Learning Vault · Anno MMXXVI
      </div>
    </div>
  );
}
