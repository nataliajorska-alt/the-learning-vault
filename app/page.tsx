"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { FirstRunSeed } from "@/components/FirstRunSeed";
import { PytanieDnia } from "@/components/PytanieDnia";
import { StreakMilestone } from "@/components/StreakMilestone";
import { WeeklyLetter } from "@/components/WeeklyLetter";
import { DateStamp } from "@/components/ui/DateStamp";
import { Reveal } from "@/components/ui/Reveal";
import { ShelfStrip, type ShelfStripVault } from "@/components/ui/ShelfStrip";
import { WaxSeal, type WaxTone } from "@/components/ui/WaxSeal";
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
import { idSig, vaultSig } from "@/lib/sig";
import type { Timestamp } from "firebase/firestore";
import type { TopicStatus } from "@/lib/types";

/* ---------- helpers ----------------------------------------------------- */

const GOLD_RULE_SOFT = "rgba(184,146,77,0.22)";
const GOLD_RULE = "rgba(184,146,77,0.35)";

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

/* "sięga po Sztukę" — prosty biernik dla nazw sekcji */
function accusative(name: string): string {
  return name.endsWith("a") ? name.slice(0, -1) + "ę" : name;
}

const TOME_WORDS: Record<number, string> = {
  10: "Dziesięć", 11: "Jedenaście", 12: "Dwanaście", 13: "Trzynaście",
  14: "Czternaście", 15: "Piętnaście", 16: "Szesnaście",
};

function tomesPhrase(n: number): string {
  if (n === 1) return "Jeden tom";
  if (n >= 2 && n <= 4) return `${n} tomy`;
  return `${TOME_WORDS[n] ?? n} tomów`;
}

function statusWords(status: TopicStatus): { tag: string; card: string } {
  if (status === "fresh") return { tag: "nowa", card: "nowa karta" };
  if (status === "struggling") return { tag: "trudna", card: "trudna karta" };
  return { tag: "powtórka", card: "powtórka" };
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
  const nextDueVaultName = useMemo(() => {
    if (!nextDueTopic || !vaults) return "";
    return vaults.find((v) => v.id === nextDueTopic.vaultId)?.name ?? "";
  }, [nextDueTopic, vaults]);

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

  // Sekcje, do których najczęściej wracają błędy — do wpisu „Słabe ogniwa"
  const errorVaultNames = useMemo(() => {
    if (!errors || errors.length === 0) return [];
    const counts = new Map<string, number>();
    for (const e of errors) {
      counts.set(e.vaultName, (counts.get(e.vaultName) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([name]) => name);
  }, [errors]);

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

  // „Na stole" — najbliższe trzy wątki salonu (kolejka rotacji)
  const salonThreads = useMemo(() => {
    if (!topics || !salonPhrases || salonPhrases.length === 0) return [];
    const seen = new Set<string>();
    const ordered = [...salonPhrases].sort((a, b) => {
      const ta = topics.find((t) => t.id === a.topicId);
      const tb = topics.find((t) => t.id === b.topicId);
      return toMillis(ta?.lastShownInSalon) - toMillis(tb?.lastShownInSalon);
    });
    const titles: string[] = [];
    for (const p of ordered) {
      if (seen.has(p.topicId)) continue;
      seen.add(p.topicId);
      const t = topics.find((x) => x.id === p.topicId);
      if (t) titles.push(t.title);
      if (titles.length === 3) break;
    }
    return titles;
  }, [topics, salonPhrases]);

  // Najliczniejsza sekcja — do podpisu pod półką
  const topVaultName = useMemo(() => {
    if (!vaults || !topics || vaults.length === 0) return "";
    const counts = new Map<string, number>();
    for (const t of topics) {
      counts.set(t.vaultId, (counts.get(t.vaultId) ?? 0) + 1);
    }
    let best = vaults[0];
    let bestN = -1;
    for (const v of vaults) {
      const n = counts.get(v.id) ?? 0;
      if (n > bestN) {
        best = v;
        bestN = n;
      }
    }
    return best?.name ?? "";
  }, [vaults, topics]);

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

  /* ---------- Bilans (kompaktowy pasek) ---------- */

  const STATS: Array<{
    label: string;
    value: string;
    suffix: string | null;
    sub: string;
  }> = [
    {
      label: "Passa",
      value: String(streak || 0),
      suffix: null,
      sub: `${streak === 1 ? "dzień" : "dni"} z rzędu`,
    },
    {
      label: "Trafność",
      value: accuracy7d != null ? String(accuracy7d) : "—",
      suffix: accuracy7d != null ? "%" : null,
      sub: "z ostatnich 7 dni",
    },
    {
      label: "Opanowano",
      value: String(mastered),
      suffix: null,
      sub:
        totalTopics > 0
          ? `z ${totalTopics} kart · ${Math.round((mastered / totalTopics) * 100)}%`
          : "brak kart",
    },
    {
      label: "Errata",
      value: String(activeErrors),
      suffix: null,
      sub: activeErrors === 1 ? "karta do upilnowania" : "kart do upilnowania",
    },
  ];

  /* ---------- Greeting fragments ---------- */

  const now = new Date();
  const displayDate = `${now.toLocaleDateString("pl-PL", { weekday: "long" })} · ${now.toLocaleDateString("pl-PL", { day: "numeric", month: "long" })} · ${toRoman(now.getFullYear())}`;
  const chapterRoman = toRoman(Math.max(streak, 1));
  const hasDue = due.length > 0;

  const heroLead =
    due.length === 0
      ? "Dziś masz wolne. Trzynaście dziedzin czeka — możesz zajrzeć na przegląd albo zostawić księgę zamkniętą."
      : nextDueTopic
      ? `Wieczorny kwadrans w czytelni. Dziś otwiera go ${nextDueTopic.title} — ${
          due.length > 1
            ? "reszta czeka cierpliwie w kolejce"
            : "jedyna karta w dzisiejszej kolejce"
        }.`
      : `${due.length} ${due.length < 5 ? "tematy" : "tematów"} w kolejce. Piętnaście minut, trzy fazy — powtórki, nowe karty, quiz z oceną AI.`;

  /* ---------- List kuratora ---------- */

  const letterNote = hasDue
    ? `${due.length} ${due.length === 1 ? "temat czeka" : due.length < 5 ? "tematy czekają" : "tematów czeka"} w kolejce spaced repetition.`
    : salonTopic
    ? "Kolejka jest czysta. Najlepszy ruch: lekka rozmowa i obycie z tematem."
    : "Kolejka jest czysta. Możesz spokojnie wybrać tom do następnego wejścia.";

  const letterBody = [
    letterNote,
    nextDueTopic
      ? `Pierwszy w kolejce: ${nextDueTopic.title}. ${topicQueueReason(nextDueTopic)}`
      : "",
    activeErrors > 0
      ? `Errata ma ${activeErrors} ${activeErrors === 1 ? "aktywny wpis" : "aktywnych wpisów"}, więc po sesji warto zamknąć przynajmniej jeden.`
      : "Errata jest czysta, więc możesz trzymać rytm bez naprawiania zaległości.",
  ]
    .filter(Boolean)
    .join(" ");

  const today = new Date();
  const letterDateline = `No. ${toRoman(sessionCount + 1)} · ${today.getDate()} ${
    MONTHS_PL_SHORT[today.getMonth()]
  } ${toRoman(today.getFullYear())}`;

  const isSunday = today.getDay() === 0;

  /* ---------- Render ---------- */

  return (
    // Bust out of the standard max-w-content wrapper for a wider canvas
    <div className="today-v3 -mx-6 md:-mx-12 -mt-10 md:-mt-12">
      <div className="relative anim-on" style={{ overflow: "hidden" }}>
        {/* Top light spill — candle breathes (reduced-motion: static) */}
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
            zIndex: 1,
          }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          <Hero
            displayDate={displayDate}
            chapterRoman={chapterRoman}
            streak={streak}
            heroLead={heroLead}
          />
          <StreakMilestone streak={streak} />
          <Reveal>
            <PlanDniaV3
              hasDue={hasDue}
              dueCount={due.length}
              dueComposition={dueComposition}
              letterBody={letterBody}
              letterDateline={letterDateline}
              nextTopic={
                nextDueTopic
                  ? {
                      id: nextDueTopic.id,
                      title: nextDueTopic.title,
                      status: nextDueTopic.status,
                      vaultName: nextDueVaultName,
                    }
                  : null
              }
            />
          </Reveal>
          <Reveal>
            <BilansStrip stats={STATS} />
          </Reveal>
          {isSunday && (
            <Reveal>
              <WeeklyLetter
                stats={{
                  sessions: sessionCount,
                  minutes: Math.round(sessionTotalDuration / 60),
                  accuracy: weeklyAccuracy,
                  errata: activeErrors,
                  mastered,
                  streak,
                }}
              />
            </Reveal>
          )}
          {weakestTopic && (
            <Reveal>
              <PytanieDnia topic={weakestTopic} vaultName={weakestVaultName} />
            </Reveal>
          )}
          {vaults && vaults.length > 0 && (
            <Reveal>
              <ShelfSection
                vaults={vaults}
                topVaultName={topVaultName}
                sessionVaultName={nextDueVaultName}
              />
            </Reveal>
          )}
          <Reveal>
            <RitualsV3
              errorsCount={activeErrors}
              errorVaultNames={errorVaultNames}
              salonTopic={salonTopic}
              salonThreads={salonThreads}
              accuracy7d={accuracy7d}
              weeklyMinutes={Math.round(sessionTotalDuration / 60)}
              weeklySessions={sessionCount}
            />
          </Reveal>
          <Reveal>
            <ErrataSection errors={errors ?? []} />
          </Reveal>
          <Reveal>
            <WeeklyLedger
              sessions={sessions ?? []}
              topics={topics ?? []}
              vaults={vaults ?? []}
              weeklyMinutes={Math.round(sessionTotalDuration / 60)}
              weeklySessions={sessionCount}
              weeklyAccuracy={weeklyAccuracy}
            />
          </Reveal>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CTA — oxblood ze złotą podwójną ramką (Dziś v3)
   ============================================================ */

function OxbloodCta({
  href,
  label,
  detail,
}: {
  href: string;
  label: string;
  detail?: string;
}) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative inline-flex items-center"
      style={{
        background: hover
          ? "linear-gradient(180deg, #7a201a 0%, #531413 55%, #320a0a 100%)"
          : "linear-gradient(180deg, #6b1a14 0%, #4a1010 55%, #2c0808 100%)",
        color: "var(--c-paper-100)",
        padding: detail ? "15px 16px 15px 26px" : "15px 26px",
        textDecoration: "none",
        boxShadow: hover
          ? "0 13px 30px -8px rgba(0,0,0,0.78), inset 0 1px 0 rgba(255,190,150,0.22), inset 0 -1px 0 rgba(0,0,0,0.5)"
          : "0 8px 20px -6px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,180,140,0.18), inset 0 -1px 0 rgba(0,0,0,0.45), 0 2px 4px rgba(0,0,0,0.45)",
        transform: hover ? "translateY(-1px)" : "translateY(0)",
        transition:
          "transform .18s ease, box-shadow .18s ease, background .18s ease",
      }}
    >
      <span
        aria-hidden
        className="absolute pointer-events-none"
        style={{ inset: 4, border: "0.5px solid rgba(184,146,77,0.55)" }}
      />
      <span
        aria-hidden
        className="absolute pointer-events-none"
        style={{ inset: 6, border: "0.5px solid rgba(184,146,77,0.20)" }}
      />
      <span
        className="eyebrow"
        style={{
          letterSpacing: "0.2em",
          fontWeight: 600,
          fontSize: 11,
          color: "var(--c-paper-100)",
          textShadow: "0 -1px 0 rgba(0,0,0,0.6)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      {detail && (
        <>
          <span
            aria-hidden
            style={{
              width: 1,
              height: 17,
              background: "rgba(184,146,77,0.4)",
              margin: "0 14px",
            }}
          />
          <span
            className="signature"
            style={{
              color: "var(--c-gold-300)",
              fontSize: 11,
              letterSpacing: "0.08em",
              textShadow: "0 -1px 0 rgba(0,0,0,0.5)",
              whiteSpace: "nowrap",
            }}
          >
            {detail}
          </span>
        </>
      )}
      <span
        aria-hidden
        style={{
          color: "var(--c-gold-300)",
          fontSize: 15,
          lineHeight: 1,
          marginLeft: 16,
          paddingRight: 4,
          transform: hover ? "translateX(2px)" : "translateX(0)",
          transition: "transform .18s ease",
        }}
      >
        →
      </span>
    </Link>
  );
}

/* ============================================================
   Hero — powitanie; program sesji zszedł ze sceny (v3)
   ============================================================ */

interface HeroProps {
  displayDate: string;
  chapterRoman: string;
  streak: number;
  heroLead: string;
}

function Hero({ displayDate, chapterRoman, streak, heroLead }: HeroProps) {
  const [minHover, setMinHover] = useState(false);
  return (
    <div className="px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-8 md:pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT — greeting */}
        <div className="lg:col-span-7">
          <div
            className="eyebrow flex items-center"
            style={{ color: "var(--c-gold-400)", marginBottom: 22, gap: 16 }}
          >
            <span style={{ textTransform: "uppercase" }}>
              {displayDate} · MMXXVI
            </span>
            <span
              style={{
                flex: 1,
                height: 1,
                background: GOLD_RULE,
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
              marginBottom: 30,
            }}
          >
            {heroLead}
          </p>

          <div className="flex items-center flex-wrap" style={{ gap: 16 }}>
            <OxbloodCta href="/study" label="Otwórz sesję" detail="15 min" />
            <Link href="/vaults" className="btn-ghost" style={{ textDecoration: "none" }}>
              Pokaż agendę
            </Link>
            <Link
              href="/study/session/new?mode=mix&limit=3"
              onMouseEnter={() => setMinHover(true)}
              onMouseLeave={() => setMinHover(false)}
              className="signature"
              style={{
                color: minHover ? "var(--c-gold-300)" : "var(--c-paper-300)",
                opacity: minHover ? 1 : 0.75,
                borderBottom: "1px dotted rgba(184,146,77,0.5)",
                paddingBottom: 2,
                marginLeft: 6,
                textDecoration: "none",
                transition: "color .18s ease",
                whiteSpace: "nowrap",
              }}
            >
              Dzień minimum · 3 pytania
            </Link>
          </div>
        </div>

        {/* RIGHT — date stamp */}
        <div className="lg:col-span-5 flex flex-col lg:items-end">
          <div className="lg:self-end mt-2 lg:mt-0">
            <DateStamp />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Plan dnia v3 — list kuratora ze składem kolejki w marginaliach
   + stosik kart katalogowych „Pierwszy w kolejce"
   ============================================================ */

interface PlanDniaV3Props {
  hasDue: boolean;
  dueCount: number;
  dueComposition: { fresh: number; review: number; struggling: number };
  letterBody: string;
  letterDateline: string;
  nextTopic: {
    id: string;
    title: string;
    status: TopicStatus;
    vaultName: string;
  } | null;
}

function PlanDniaV3({
  hasDue,
  dueCount,
  dueComposition,
  letterBody,
  letterDateline,
  nextTopic,
}: PlanDniaV3Props) {
  const queueRows: Array<[string, number]> = [
    ["Nowe", dueComposition.fresh],
    ["Powtórki", dueComposition.review],
    ["Trudne", dueComposition.struggling],
  ];

  return (
    <section className="px-6 md:px-12 lg:px-16 pb-12 md:pb-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LIST KURATORA */}
        <div className="lg:col-span-8">
          <div
            className="tex-paper tex-noise-fine relative h-full"
            style={{
              padding: 12,
              boxSizing: "border-box",
              boxShadow:
                "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 24px 48px -16px rgba(0,0,0,0.78), 0 2px 6px rgba(0,0,0,0.35)",
            }}
          >
            <div
              className="relative flex flex-col"
              style={{
                border: "0.5px solid rgba(27,17,8,0.28)",
                padding: "22px 28px 22px",
                height: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                aria-hidden
                className="absolute pointer-events-none"
                style={{ inset: 4, border: "0.5px solid rgba(27,17,8,0.12)" }}
              />
              <div className="grid grid-cols-1 sm:grid-cols-12 flex-1" style={{ gap: 32 }}>
                {/* text column */}
                <div className="sm:col-span-8 flex flex-col">
                  <div
                    className="eyebrow"
                    style={{ color: "var(--c-ink)", opacity: 0.85, marginBottom: 12 }}
                  >
                    Plan dnia · list kuratora
                  </div>
                  <h2
                    className="h3"
                    style={{
                      fontSize: 30,
                      color: "#1B1108",
                      marginBottom: 10,
                      lineHeight: 1.02,
                    }}
                  >
                    {hasDue ? "Najpierw nauka." : "Dziś lekko."}
                  </h2>
                  <p
                    className="body-prose"
                    style={{
                      color: "rgba(27,17,8,0.8)",
                      fontSize: 13.5,
                      lineHeight: 1.55,
                      marginBottom: 18,
                      maxWidth: 440,
                    }}
                  >
                    {letterBody}
                  </p>
                  <div style={{ flex: 1 }} />
                  <div
                    className="flex items-baseline justify-between flex-wrap"
                    style={{ gap: 16 }}
                  >
                    <span
                      className="signature"
                      style={{ color: "rgba(27,17,8,0.45)", fontSize: 10 }}
                    >
                      {letterDateline}
                    </span>
                    <span
                      className="font-display italic"
                      style={{
                        fontSize: 21,
                        color: "var(--c-ink)",
                        opacity: 0.85,
                        transform: "rotate(-2deg)",
                      }}
                    >
                      — kurator zbiorów
                    </span>
                  </div>
                </div>
                {/* marginalia: licznik + skład kolejki */}
                <div
                  className="sm:col-span-4 flex flex-col items-center justify-center sm:border-l border-t sm:border-t-0 pt-6 sm:pt-0 sm:pl-7"
                  style={{ borderColor: "rgba(27,17,8,0.22)" }}
                >
                  <div style={{ textAlign: "center", marginBottom: 18 }}>
                    <div
                      className="font-display italic font-medium"
                      style={{
                        fontSize: 60,
                        lineHeight: 0.9,
                        color: hasDue ? "var(--c-ink)" : "var(--c-racing)",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {dueCount}
                    </div>
                    <div
                      className="eyebrow"
                      style={{
                        color: "rgba(27,17,8,0.55)",
                        marginTop: 8,
                        fontSize: 9,
                      }}
                    >
                      W kolejce
                    </div>
                  </div>
                  <div style={{ alignSelf: "stretch" }}>
                    {queueRows.map(([label, n], i) => (
                      <div
                        key={label}
                        className="flex items-baseline"
                        style={{
                          gap: 10,
                          padding: "7px 0",
                          borderTop:
                            i === 0
                              ? "0.5px solid rgba(27,17,8,0.22)"
                              : "0.5px solid rgba(27,17,8,0.12)",
                        }}
                      >
                        <span
                          className="body-prose"
                          style={{ fontSize: 12.5, color: "rgba(27,17,8,0.75)" }}
                        >
                          {label}
                        </span>
                        <span
                          aria-hidden
                          style={{
                            flex: 1,
                            borderBottom: "1px dotted rgba(27,17,8,0.3)",
                            transform: "translateY(-3px)",
                          }}
                        />
                        <span
                          className="signature"
                          style={{ fontSize: 11, color: "rgba(27,17,8,0.65)" }}
                        >
                          {String(n).padStart(2, "0")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PIERWSZY W KOLEJCE — stosik kart */}
        <div className="lg:col-span-4 flex flex-col">
          {nextTopic ? (
            <NextCardStack topic={nextTopic} total={dueCount} />
          ) : (
            <QueueClearCard />
          )}
        </div>
      </div>
    </section>
  );
}

/* Stosik kart katalogowych — wierzchnia karta to pierwszy w kolejce */
function NextCardStack({
  topic,
  total,
}: {
  topic: { id: string; title: string; status: TopicStatus; vaultName: string };
  total: number;
}) {
  const [hover, setHover] = useState(false);
  const words = statusWords(topic.status);
  const backCard = (rot: number, dx: number, dy: number): CSSProperties => ({
    position: "absolute",
    inset: 0,
    background: "#d8c69b",
    transform: `rotate(${rot}deg) translate(${dx}px, ${dy}px)`,
    boxShadow: "0 10px 22px -10px rgba(0,0,0,0.65)",
  });

  return (
    <div className="flex-1 flex flex-col" style={{ minHeight: 230 }}>
      <div
        className="eyebrow flex items-center"
        style={{ color: "var(--c-gold-400)", marginBottom: 16, gap: 12 }}
      >
        <span style={{ whiteSpace: "nowrap" }}>Pierwszy w kolejce</span>
        <span
          aria-hidden
          style={{ flex: 1, height: 0.5, background: "rgba(184,146,77,0.25)" }}
        />
        <span style={{ opacity: 0.6, whiteSpace: "nowrap" }}>1 / {total}</span>
      </div>

      <div className="relative" style={{ flex: 1, minHeight: 185 }}>
        {/* karty pod spodem — reszta kolejki */}
        <div aria-hidden style={backCard(2.2, 5, 7)} />
        <div aria-hidden style={backCard(-1.4, -4, 3)} />

        {/* wierzchnia karta */}
        <Link
          href={`/study/session/new?topic=${topic.id}&mode=topic`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="tex-paper tex-noise-fine flex flex-col"
          style={{
            // inline, bo .tex-paper nadpisuje Tailwindowe `absolute`
            // swoim position: relative
            position: "absolute",
            inset: 0,
            transform: hover
              ? "rotate(-0.4deg) translateY(-4px)"
              : "rotate(-0.4deg)",
            boxShadow: hover
              ? "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 26px 46px -16px rgba(0,0,0,0.8), 0 3px 6px rgba(0,0,0,0.4)"
              : "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 18px 36px -16px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.35)",
            transition: "transform .2s ease, box-shadow .2s ease",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              height: 24,
              borderBottom: "0.5px dashed rgba(27,17,8,0.28)",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <span
              className="signature absolute"
              style={{
                left: 18,
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(27,17,8,0.6)",
                fontSize: 10,
                letterSpacing: "0.1em",
                whiteSpace: "nowrap",
              }}
            >
              {vaultSig(topic.vaultName)} · {idSig(topic.id)}
            </span>
            <span
              className="signature absolute"
              style={{
                right: 18,
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(27,17,8,0.55)",
                fontSize: 10,
              }}
            >
              ✦ {words.tag}
            </span>
          </div>

          <div
            className="flex flex-col"
            style={{ padding: "20px 22px 18px", flex: 1, position: "relative" }}
          >
            <div
              className="font-display italic font-medium"
              style={{
                fontSize: 23,
                color: "#1B1108",
                lineHeight: 1.12,
                marginBottom: 7,
              }}
            >
              {topic.title}
            </div>
            <div className="signature" style={{ color: "rgba(27,17,8,0.55)", fontSize: 11 }}>
              {topic.vaultName} · {words.card}
            </div>
            <div style={{ flex: 1, minHeight: 18 }} />
            <div className="flex items-end justify-between">
              <span
                className="eyebrow"
                style={{
                  color: "var(--c-ink)",
                  fontSize: 9,
                  opacity: hover ? 1 : 0.8,
                  transition: "opacity .18s ease",
                  whiteSpace: "nowrap",
                }}
              >
                Zacznij od tej karty →
              </span>
              <span
                aria-hidden
                style={{
                  transform: "rotate(-4deg)",
                  border: "1.5px solid var(--c-ink)",
                  color: "var(--c-ink)",
                  padding: "3px 8px 2px",
                  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  fontSize: 8,
                  letterSpacing: "0.18em",
                  fontWeight: 600,
                  opacity: 0.85,
                }}
              >
                NA DZIŚ
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

/* Pusta kolejka — cicha gablota zamiast stosiku */
function QueueClearCard() {
  return (
    <div className="flex-1 flex flex-col" style={{ minHeight: 230 }}>
      <div
        className="eyebrow flex items-center"
        style={{ color: "var(--c-gold-400)", marginBottom: 16, gap: 12 }}
      >
        <span style={{ whiteSpace: "nowrap" }}>Pierwszy w kolejce</span>
        <span
          aria-hidden
          style={{ flex: 1, height: 0.5, background: "rgba(184,146,77,0.25)" }}
        />
      </div>
      <div
        className="flex-1 flex flex-col justify-center"
        style={{
          border: `1px solid ${GOLD_RULE_SOFT}`,
          background: "rgba(228,214,186,0.025)",
          padding: "24px 28px",
        }}
      >
        <div
          className="font-display italic font-medium"
          style={{ fontSize: 24, color: "var(--c-paper-100)", lineHeight: 1.15 }}
        >
          Kolejka jest czysta.
        </div>
        <div
          className="signature"
          style={{ color: "var(--c-paper-300)", opacity: 0.6, marginTop: 8 }}
        >
          Wróć jutro — albo zajrzyj wieczorem do salonu.
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Bilans — kompaktowy pasek: jedna linia, cztery wskaźniki
   ============================================================ */

function BilansStrip({
  stats,
}: {
  stats: Array<{ label: string; value: string; suffix: string | null; sub: string }>;
}) {
  return (
    <section className="px-6 md:px-12 lg:px-16 pb-12 md:pb-14">
      <div
        className="flex flex-wrap items-stretch"
        style={{
          borderTop: `1px solid ${GOLD_RULE}`,
          borderBottom: `1px solid ${GOLD_RULE_SOFT}`,
        }}
      >
        <div
          className="flex flex-col justify-center w-full sm:w-auto"
          style={{ padding: "16px 32px 16px 0", minWidth: 124, flexShrink: 0 }}
        >
          <div className="eyebrow" style={{ color: "var(--c-gold-400)", fontSize: 10 }}>
            Bilans
          </div>
          <div
            className="signature"
            style={{
              color: "var(--c-paper-300)",
              opacity: 0.55,
              marginTop: 3,
              fontSize: 11,
            }}
          >
            {new Date().toLocaleDateString("pl-PL", { day: "numeric", month: "long" })}
          </div>
        </div>
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center basis-1/2 sm:basis-0 sm:flex-1"
            style={{
              gap: 16,
              padding: "16px 24px",
              borderLeft: `1px solid ${GOLD_RULE_SOFT}`,
            }}
          >
            <span
              className="font-display italic font-medium"
              style={{
                fontSize: 38,
                lineHeight: 1,
                color: "var(--c-paper-100)",
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
              }}
            >
              {s.value}
              {s.suffix ? (
                <span style={{ fontSize: 22, color: "var(--c-gold-400)" }}>
                  {s.suffix}
                </span>
              ) : (
                ""
              )}
            </span>
            <span style={{ minWidth: 0 }}>
              <span
                className="eyebrow"
                style={{
                  display: "block",
                  color: "var(--c-gold-400)",
                  fontSize: 9,
                  marginBottom: 2,
                }}
              >
                {s.label}
              </span>
              <span
                className="signature"
                style={{
                  display: "block",
                  color: "var(--c-paper-300)",
                  opacity: 0.6,
                  fontSize: 11,
                  whiteSpace: "nowrap",
                }}
              >
                {s.sub}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   Z półek — sekcje jako grzbiety na półce
   ============================================================ */

function ShelfSection({
  vaults,
  topVaultName,
  sessionVaultName,
}: {
  vaults: ShelfStripVault[];
  topVaultName: string;
  sessionVaultName: string;
}) {
  const shelfCopy = [
    "Każda karta wraca na swoją półkę.",
    topVaultName ? ` Najliczniej — ${topVaultName}` : "",
    topVaultName && sessionVaultName
      ? `; dzisiejsza sesja sięga po ${accusative(sessionVaultName)}.`
      : topVaultName
      ? "."
      : "",
  ].join("");

  return (
    <section className="px-6 md:px-12 lg:px-16 pb-16 md:pb-20">
      <div
        className="eyebrow flex items-center"
        style={{ color: "var(--c-gold-400)", marginBottom: 26, gap: 16 }}
      >
        <span style={{ whiteSpace: "nowrap" }}>Z półek · sekcje w obiegu</span>
        <span
          aria-hidden
          style={{ flex: 1, height: 1, background: "rgba(184,146,77,0.2)" }}
        />
        <Link
          href="/vaults"
          className="eyebrow"
          style={{
            color: "var(--c-gold-400)",
            whiteSpace: "nowrap",
            textDecoration: "none",
          }}
        >
          Wszystkie sekcje →
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8">
          <ShelfStrip vaults={vaults} height={148} />
        </div>
        <div className="lg:col-span-4 lg:pb-8 lg:pl-4">
          <div
            className="font-display italic font-medium"
            style={{
              fontSize: 30,
              color: "var(--c-paper-100)",
              lineHeight: 1.1,
              marginBottom: 12,
            }}
          >
            {tomesPhrase(vaults.length)}, jedna czytelnia.
          </div>
          <p
            className="body-prose"
            style={{
              color: "rgba(228,214,186,0.68)",
              fontSize: 13.5,
              lineHeight: 1.6,
            }}
          >
            {shelfCopy}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Po sesji · wieczorne rytuały — salon z „na stole" + ornament
   ============================================================ */

interface RitualsV3Props {
  errorsCount: number;
  errorVaultNames: string[];
  salonTopic: {
    topic: { id: string; title: string };
    phrase: { short: string };
  } | null;
  salonThreads: string[];
  accuracy7d: number | null;
  weeklyMinutes: number;
  weeklySessions: number;
}

function RitualsV3({
  errorsCount,
  errorVaultNames,
  salonTopic,
  salonThreads,
  accuracy7d,
  weeklyMinutes,
  weeklySessions,
}: RitualsV3Props) {
  const errataBody =
    errorVaultNames.length > 0
      ? `Karty, na których powtórki widzą niepewność. Najczęściej wraca ${errorVaultNames
          .map((n) => n.toLowerCase())
          .join(" i ")}.`
      : "Karty, na których powtórki widzą niepewność. Dziś rejestr jest czysty.";

  const statsBody =
    accuracy7d != null
      ? `Trafność ${accuracy7d}% z ostatniego tygodnia. ${weeklySessions} ${
          weeklySessions === 1 ? "sesja" : weeklySessions < 5 ? "sesje" : "sesji"
        } · ${weeklyMinutes} min przy biurku.`
      : "Tydzień jeszcze bez wpisów w dzienniku — pierwsza sesja otworzy statystyki.";

  const sides = [
    {
      href: "/errors",
      eyebrow: `Errata · ${errorsCount} ${errorsCount === 1 ? "karta" : "kart"}`,
      title: "Słabe ogniwa",
      body: errataBody,
      cta: "Otwórz erratę",
      sealLabel: "E",
      sealTone: "oxblood" as WaxTone,
    },
    {
      href: "/stats",
      eyebrow: "Statystyki · 7 dni",
      title: "Dziennik postępów",
      body: statsBody,
      cta: "Otwórz statystyki",
      sealLabel: "D",
      sealTone: "umber" as WaxTone,
    },
  ];

  return (
    <section className="px-6 md:px-12 lg:px-16 pb-14 md:pb-16">
      <div
        className="eyebrow flex items-center"
        style={{ color: "var(--c-gold-400)", marginBottom: 20, gap: 16 }}
      >
        <span style={{ whiteSpace: "nowrap" }}>Po sesji · wieczorne rytuały</span>
        <span
          aria-hidden
          style={{ flex: 1, height: 1, background: "rgba(184,146,77,0.2)" }}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <SalonFeaturedV3 salonTopic={salonTopic} threads={salonThreads} />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-6">
          {sides.map((r) => (
            <RitualSideEntry key={r.href} r={r} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SalonFeaturedV3({
  salonTopic,
  threads,
}: {
  salonTopic: {
    topic: { id: string; title: string };
    phrase: { short: string };
  } | null;
  threads: string[];
}) {
  const [hover, setHover] = useState(false);
  const href = salonTopic ? `/salon/${salonTopic.topic.id}` : "/salon";
  const title = salonTopic?.topic.title ?? "Wybierz temat";
  const body =
    salonTopic?.phrase.short ??
    "Trzy zdania na temat. Krótko, rozbudowanie, pułapka. Praktyczne obycie, nie egzamin.";
  const romans = ["i.", "ii.", "iii."];

  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="tex-velvet relative flex flex-col h-full"
      style={{
        padding: "30px 34px",
        boxShadow: hover
          ? "0 26px 50px -18px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(184,146,77,0.45)"
          : "0 20px 44px -18px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(184,146,77,0.32)",
        transition: "box-shadow .2s ease",
        boxSizing: "border-box",
        overflow: "hidden",
        textDecoration: "none",
        minHeight: 340,
      }}
    >
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{ inset: 8, border: "0.5px solid rgba(184,146,77,0.4)" }}
      />
      {/* ornament w tle */}
      <div
        aria-hidden
        className="absolute pointer-events-none font-display"
        style={{
          right: -28,
          bottom: -64,
          fontSize: 250,
          lineHeight: 1,
          color: "rgba(184,146,77,0.07)",
          transform: "rotate(-10deg)",
          userSelect: "none",
        }}
      >
        ❦
      </div>
      <div
        className="relative flex items-start justify-between"
        style={{ gap: 16, marginBottom: 16 }}
      >
        <div className="eyebrow" style={{ color: "var(--c-gold-300)", paddingTop: 6 }}>
          Salon · temat dnia
        </div>
        <WaxSeal size={50} label="S" tone="burgundy" />
      </div>
      <div
        className="relative font-display italic font-medium"
        style={{
          fontSize: "clamp(28px, 3.4vw, 38px)",
          color: "var(--c-paper-100)",
          lineHeight: 1.04,
          marginBottom: 12,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </div>
      <p
        className="relative body-prose"
        style={{
          color: "rgba(228,214,186,0.75)",
          fontSize: 14.5,
          lineHeight: 1.6,
          maxWidth: 380,
          marginBottom: 20,
        }}
      >
        {body}
      </p>

      {/* na stole — najbliższe wątki rozmowy */}
      {threads.length > 0 && (
        <div className="relative" style={{ maxWidth: 340, marginBottom: 22 }}>
          <div
            className="eyebrow"
            style={{
              color: "var(--c-gold-400)",
              fontSize: 9,
              marginBottom: 8,
              opacity: 0.85,
            }}
          >
            Na stole
          </div>
          {threads.map((t, i) => (
            <div
              key={t}
              className="flex items-baseline"
              style={{
                gap: 12,
                padding: "7px 0",
                borderTop: i === 0 ? "none" : "0.5px solid rgba(184,146,77,0.16)",
              }}
            >
              <span
                className="font-display italic"
                style={{
                  color: "var(--c-gold-300)",
                  fontSize: 15,
                  width: 20,
                  flexShrink: 0,
                  lineHeight: 1,
                }}
              >
                {romans[i]}
              </span>
              <span
                className="font-display italic font-medium"
                style={{
                  color: "var(--c-paper-100)",
                  fontSize: 19,
                  lineHeight: 1.1,
                  opacity: 0.92,
                }}
              >
                {t}
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{ flex: 1 }} />
      <div className="relative flex items-center justify-between">
        <span
          className="eyebrow flex items-center"
          style={{
            color: hover ? "var(--c-gold-300)" : "var(--c-gold-400)",
            gap: 8,
            transition: "color .18s ease",
          }}
        >
          <span>Wejdź do salonu</span>
          <span
            aria-hidden
            style={{
              transform: hover ? "translateX(2px)" : "none",
              transition: "transform .18s ease",
            }}
          >
            →
          </span>
        </span>
        <span className="signature" style={{ color: "rgba(228,214,186,0.45)" }}>
          ok. 10 min
        </span>
      </div>
    </Link>
  );
}

function RitualSideEntry({
  r,
}: {
  r: {
    href: string;
    eyebrow: string;
    title: string;
    body: string;
    cta: string;
    sealLabel: string;
    sealTone: WaxTone;
  };
}) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={r.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex flex-col flex-1"
      style={{
        padding: "24px 28px",
        border: `1px solid ${hover ? GOLD_RULE : GOLD_RULE_SOFT}`,
        background: hover ? "rgba(228,214,186,0.045)" : "rgba(228,214,186,0.025)",
        transition: "background .18s ease, border-color .18s ease",
        textDecoration: "none",
        minHeight: 160,
      }}
    >
      <div className="flex items-start justify-between" style={{ gap: 16, marginBottom: 12 }}>
        <div className="eyebrow" style={{ color: "var(--c-gold-400)", paddingTop: 4 }}>
          {r.eyebrow}
        </div>
        <WaxSeal size={38} label={r.sealLabel} tone={r.sealTone} />
      </div>
      <div
        className="font-display italic font-medium"
        style={{
          fontSize: 26,
          color: "var(--c-paper-100)",
          lineHeight: 1.08,
          marginBottom: 10,
        }}
      >
        {r.title}
      </div>
      <p
        className="body-prose"
        style={{
          color: "rgba(228,214,186,0.68)",
          fontSize: 13.5,
          lineHeight: 1.55,
          marginBottom: 16,
        }}
      >
        {r.body}
      </p>
      <div style={{ flex: 1 }} />
      <div
        className="eyebrow flex items-center"
        style={{
          color: hover ? "var(--c-gold-300)" : "var(--c-gold-400)",
          gap: 8,
          fontSize: 10,
          transition: "color .18s ease",
        }}
      >
        <span>{r.cta}</span>
        <span
          aria-hidden
          style={{
            transform: hover ? "translateX(2px)" : "none",
            transition: "transform .18s ease",
          }}
        >
          →
        </span>
      </div>
    </Link>
  );
}

/* ============================================================
   Błędy do upilnowania — karteczki na pulpicie, bez ciężkiej ramy
   ============================================================ */

interface ErrataItem {
  id: string;
  vaultName: string;
  correctVersion: string;
  wrongVersion: string;
  context: string;
  timesWrong: number;
}

const ERRATA_ROTATES = [-1.1, 0.5, 1.3];

function ErrataSection({ errors }: { errors: ErrataItem[] }) {
  if (!errors || errors.length === 0) return null;
  const items = errors.slice(0, 3);

  return (
    <section className="px-6 md:px-12 lg:px-16 pb-14 md:pb-16">
      <div
        className="flex items-baseline justify-between flex-wrap"
        style={{ marginBottom: 26, gap: 24 }}
      >
        <div className="flex items-baseline" style={{ gap: 24, minWidth: 0, flex: 1 }}>
          <h2
            className="h2"
            style={{
              fontSize: "clamp(28px, 3.4vw, 36px)",
              color: "var(--c-paper-100)",
              whiteSpace: "nowrap",
            }}
          >
            Błędy do upilnowania
          </h2>
          <div
            aria-hidden
            className="hidden sm:block"
            style={{
              flex: 1,
              height: 1,
              background: GOLD_RULE_SOFT,
              transform: "translateY(-8px)",
            }}
          />
        </div>
        <Link
          href="/errors"
          className="eyebrow"
          style={{
            color: "var(--c-gold-400)",
            whiteSpace: "nowrap",
            flexShrink: 0,
            textDecoration: "none",
          }}
        >
          Errata · {errors.length} {errors.length === 1 ? "wpis" : "wpisów"} →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 items-stretch">
        {items.map((e, i) => (
          <ErratumCard
            key={e.id}
            sig={`${vaultSig(e.vaultName)} · ${idSig(e.id)}`}
            times={e.timesWrong}
            front={e.correctVersion}
            wrong={e.wrongVersion}
            context={e.context}
            stamp={e.timesWrong >= 3 ? "UCIĄŻLIWE" : "DO UPILNOWANIA"}
            rotate={ERRATA_ROTATES[i] ?? 0}
          />
        ))}
      </div>
    </section>
  );
}

function ErratumCard({
  sig,
  times,
  front,
  wrong,
  context,
  stamp,
  rotate,
}: {
  sig: string;
  times: number;
  front: string;
  wrong: string;
  context: string;
  stamp: string;
  rotate: number;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="tex-paper tex-noise-fine relative flex flex-col"
      style={{
        transform: `rotate(${rotate}deg)${hover ? " translateY(-3px)" : ""}`,
        boxShadow: hover
          ? "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 24px 44px -16px rgba(0,0,0,0.8), 0 3px 6px rgba(0,0,0,0.4)"
          : "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 18px 36px -16px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.35)",
        transition: "transform .2s ease, box-shadow .2s ease",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* perforated top */}
      <div
        style={{
          height: 24,
          borderBottom: "0.5px dashed rgba(27,17,8,0.28)",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <div
          className="signature absolute"
          style={{
            left: 18,
            top: "50%",
            transform: "translateY(-50%)",
            color: "rgba(27,17,8,0.6)",
            fontSize: 10,
            letterSpacing: "0.1em",
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
            fontSize: 10,
          }}
        >
          × {times}
        </div>
      </div>

      <div
        className="flex flex-col"
        style={{ padding: "22px 24px 40px", position: "relative", flex: 1 }}
      >
        <p
          className="font-display italic font-medium"
          style={{
            fontSize: 21,
            color: "#1B1108",
            lineHeight: 1.3,
            marginBottom: 14,
          }}
        >
          {front}
        </p>
        <div
          aria-hidden
          style={{ height: 0.5, background: "rgba(27,17,8,0.22)", marginBottom: 14 }}
        />
        <p
          className="body-prose"
          style={{ color: "rgba(27,17,8,0.78)", fontSize: 13, lineHeight: 1.55 }}
        >
          <span style={{ color: "rgba(27,17,8,0.6)", fontStyle: "italic" }}>nie: </span>
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
        <div style={{ flex: 1 }} />
        <div
          className="absolute"
          style={{
            right: 16,
            bottom: 14,
            transform: "rotate(-5deg)",
            border: "1.5px solid var(--c-ink)",
            color: "var(--c-ink)",
            padding: "4px 10px 3px",
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 9,
            letterSpacing: "0.18em",
            fontWeight: 600,
            opacity: 0.85,
          }}
        >
          {stamp}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Ostatnie sesje — dziennik bez ciężkiej ramy
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
    <section className="px-6 md:px-12 lg:px-16 pb-16 md:pb-24">
      <div
        className="flex items-baseline justify-between flex-wrap"
        style={{ marginBottom: 8, gap: 24 }}
      >
        <div className="flex items-baseline" style={{ gap: 24, minWidth: 0, flex: 1 }}>
          <h2
            className="h2"
            style={{
              fontSize: "clamp(28px, 3.4vw, 36px)",
              color: "var(--c-paper-100)",
              whiteSpace: "nowrap",
            }}
          >
            Ostatnie sesje
          </h2>
          <div
            aria-hidden
            className="hidden sm:block"
            style={{
              flex: 1,
              height: 1,
              background: GOLD_RULE_SOFT,
              transform: "translateY(-8px)",
            }}
          />
        </div>
        <span
          className="signature"
          style={{
            color: "var(--c-paper-300)",
            opacity: 0.7,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {weeklySessions === 0
            ? "Brak sesji"
            : `${weeklySessions} ${weeklySessions === 1 ? "sesja" : "sesji"} · ${Math.floor(weeklyMinutes / 60)} h ${String(weeklyMinutes % 60).padStart(2, "0")} min${weeklyAccuracy ? ` · śr. ${weeklyAccuracy}%` : ""}`}
        </span>
      </div>

      {rows.length === 0 ? (
        <div
          style={{
            borderTop: `1px solid ${GOLD_RULE}`,
            padding: "40px 0",
            textAlign: "center",
            marginTop: 16,
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
        <div>
          <div
            className="eyebrow grid grid-cols-12"
            style={{
              color: "var(--c-gold-400)",
              opacity: 0.75,
              padding: "18px 0 12px",
              borderBottom: `1px solid ${GOLD_RULE}`,
              fontSize: 10,
              gap: 8,
            }}
          >
            <span className="col-span-2 md:col-span-1">Data</span>
            <span className="col-span-6 md:col-span-7">Tom</span>
            <span className="col-span-2 md:col-span-1">Karty</span>
            <span className="col-span-1 md:col-span-2">Trafność</span>
            <span className="col-span-1 md:col-span-1 text-right">Czas</span>
          </div>

          {rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-12 body-prose items-baseline"
              style={{
                padding: "15px 0",
                borderBottom: "0.5px solid rgba(184,146,77,0.13)",
                color: "var(--c-paper-200)",
                fontSize: 15,
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
                className="col-span-6 md:col-span-7"
                style={{
                  opacity: 0.88,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row.tom}
              </span>
              <span className="col-span-2 md:col-span-1 signature" style={{ opacity: 0.8 }}>
                {row.cards}
              </span>
              <span
                className="col-span-1 md:col-span-2 signature"
                style={{
                  color:
                    parseInt(row.acc) >= 85
                      ? "var(--c-gold-300)"
                      : "var(--c-paper-200)",
                  opacity: 0.9,
                }}
              >
                {row.acc}
              </span>
              <span
                className="col-span-1 md:col-span-1 signature text-right"
                style={{ opacity: 0.8 }}
              >
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
          marginTop: 56,
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
          marginTop: 16,
        }}
      >
        Sub gratia studiorum · The Learning Vault · Anno MMXXVI
      </div>
    </section>
  );
}
