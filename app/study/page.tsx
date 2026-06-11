"use client";

import { useMemo } from "react";
import type { ElementType } from "react";
import Link from "next/link";
import {
  useErrors,
  useTopics,
  useVaults,
} from "@/lib/firestore-data";
import type { Timestamp } from "firebase/firestore";

/* ---------- helpers --------------------------------------------------- */

function toMillis(v: unknown): number {
  if (!v) return 0;
  if (v instanceof Date) return v.getTime();
  if (typeof v === "object" && v && "toMillis" in v) {
    return (v as Timestamp).toMillis();
  }
  return 0;
}

const MONTHS_PL_SHORT = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
const WEEKDAYS_PL = ["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"];

function topicPriority(t: { status: string }): number {
  if (t.status === "struggling") return 0;
  if (t.status === "fresh") return 1;
  return 2;
}

/* Polish plural: 1 → one, 2–4 (poza 12–14) → few, reszta → many */
function plPlural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const d10 = n % 10;
  const d100 = n % 100;
  if (d10 >= 2 && d10 <= 4 && (d100 < 12 || d100 > 14)) return few;
  return many;
}

/* Vault slug → monogram motif + accent for the rail */
const VAULT_VISUALS: Record<string, { motif: string; accent: string }> = {
  es:        { motif: "ñ",  accent: "#7a3a1f" },
  en:        { motif: "EN", accent: "#1c3552" },
  wine:      { motif: "☙",  accent: "#3a0c12" },
  art:       { motif: "✦",  accent: "#3a1c38" },
  music:     { motif: "𝄞", accent: "#241c3a" },
  savoir:    { motif: "✧",  accent: "#6a5128" },
  phil:      { motif: "φ",  accent: "#2c3038" },
  hist:      { motif: "H",  accent: "#1d3a25" },
  econ:      { motif: "§",  accent: "#1f3a52" },
  blackjack: { motif: "♠",  accent: "#1f3a26" },
  avia:      { motif: "✈",  accent: "#2a3438" },
  excel:     { motif: "fx", accent: "#2c3a22" },
  sport:     { motif: "☘",  accent: "#3a2a18" },
};

/* ---------- Page ------------------------------------------------------ */

export default function StudyPage() {
  const vaults = useVaults();
  const topics = useTopics();
  const errors = useErrors();

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

  const totalTopics = topics?.length ?? 0;
  const activeErrors = errors?.length ?? 0;
  const totalVaults = vaults?.length ?? 0;
  const totalDueAll = due.length;

  const mixTopicId = due[0]?.id ?? null;
  const totalSectionTopics = totalTopics;

  return (
    <div className="-mx-6 md:-mx-12 -mt-10 md:-mt-12 relative overflow-hidden">
      {/* dot pattern */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(184,146,77,0.07) 1px, transparent 1.5px)",
          backgroundSize: "32px 32px",
          opacity: 0.5,
          zIndex: 0,
        }}
      />
      {/* warm pool */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 14%, rgba(180,120,60,0.10), transparent 60%)",
          zIndex: 0,
        }}
      />
      {/* vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 55%, transparent 40%, rgba(0,0,0,0.50) 100%)",
          zIndex: 0,
        }}
      />

      <div className="relative" style={{ zIndex: 1 }}>
        <Hero totalDue={totalDueAll} />
        <SessionAnatomy />
        <MinimumDayStrip
          disabled={totalTopics === 0}
          href={
            mixTopicId
              ? `/study/session/new?mode=mix&topic=${mixTopicId}&limit=3`
              : "/study/session/new?mode=mix&limit=3"
          }
        />
        <ModesGrid
          dueCount={totalDueAll}
          errorsCount={activeErrors}
          sectionsCount={totalVaults}
          topicsCount={totalSectionTopics}
          mixTopicId={mixTopicId}
        />
        {vaults && vaults.length > 0 && (
          <SectionsRail
            vaults={vaults}
            dueByVault={dueByVault(topics, due)}
          />
        )}
        <PageFooter />
      </div>
    </div>
  );
}

function dueByVault(
  topics: ReadonlyArray<{ id: string; vaultId: string }> | null,
  due: ReadonlyArray<{ vaultId: string }>
): Record<string, number> {
  const map: Record<string, number> = {};
  if (!topics) return map;
  for (const t of due) {
    map[t.vaultId] = (map[t.vaultId] ?? 0) + 1;
  }
  return map;
}

/* ============================================================
   SessionClock — 15-segment ring (3 teoria + 10 test + 2 korekta)
   ============================================================ */

function SessionClock({ size = 224 }: { size?: number }) {
  const segments = 15;
  const radius = size / 2 - 20;
  const cx = size / 2;
  const cy = size / 2;
  const stroke = 9;

  const phaseAt = (i: number) => (i < 3 ? "teoria" : i < 13 ? "test" : "korekta");
  const colors = { teoria: "#8a5a28", test: "#74281b", korekta: "#c8a25c" } as const;
  const alphas = { teoria: 0.9, test: 0.62, korekta: 0.95 } as const;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block" }}
      aria-hidden
    >
      <circle
        cx={cx}
        cy={cy}
        r={radius + stroke / 2 + 7}
        fill="none"
        stroke="rgba(184,146,77,0.22)"
        strokeWidth="0.5"
      />
      <circle
        cx={cx}
        cy={cy}
        r={radius - stroke / 2 - 7}
        fill="none"
        stroke="rgba(184,146,77,0.14)"
        strokeWidth="0.5"
      />
      {Array.from({ length: segments }).map((_, i) => {
        const startA = (i / segments) * Math.PI * 2 - Math.PI / 2;
        const endA = ((i + 1) / segments) * Math.PI * 2 - Math.PI / 2;
        const gap = 0.022;
        const sa = startA + gap;
        const ea = endA - gap;
        const x1 = cx + Math.cos(sa) * radius;
        const y1 = cy + Math.sin(sa) * radius;
        const x2 = cx + Math.cos(ea) * radius;
        const y2 = cy + Math.sin(ea) * radius;
        const d = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
        const ph = phaseAt(i);
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={colors[ph]}
            strokeWidth={stroke}
            strokeLinecap="butt"
            opacity={alphas[ph]}
          />
        );
      })}
      {/* złote znaczniki na granicach faz: 0', 3', 13' */}
      {[0, 3, 13].map((m) => {
        const a = (m / segments) * Math.PI * 2 - Math.PI / 2;
        const r = radius + stroke / 2 + 7;
        return (
          <circle
            key={m}
            cx={cx + Math.cos(a) * r}
            cy={cy + Math.sin(a) * r}
            r="1.6"
            fill="var(--c-gold-300)"
          />
        );
      })}
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontStyle="italic"
        fontWeight="600"
        fontSize="58"
        fill="var(--c-paper-100)"
        letterSpacing="-2"
      >
        15
      </text>
      <text
        x={cx}
        y={cy + 20}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="9.5"
        fill="var(--c-gold-400)"
        letterSpacing="3.5"
      >
        MINUT
      </text>
      <text
        x={cx}
        y={cy + 38}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="8.5"
        fill="rgba(212,195,158,0.55)"
        letterSpacing="2.5"
      >
        3 · 10 · 2
      </text>
    </svg>
  );
}

/* ============================================================
   Hero
   ============================================================ */

function Hero({ totalDue }: { totalDue: number }) {
  return (
    <div className="relative" style={{ padding: "56px 24px 28px" }}>
      <div className="flex items-start justify-between flex-wrap" style={{ gap: 32 }}>
        <div style={{ flex: 1, maxWidth: 720, minWidth: 280 }}>
          <div
            className="eyebrow flex items-center"
            style={{
              color: "var(--c-ink2)",
              marginBottom: 18,
              opacity: 0.92,
              gap: 12,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 22,
                height: 1,
                background: "var(--c-ink2)",
                opacity: 0.55,
              }}
            />
            Sesja krótka · cztery tryby · jedna decyzja
          </div>
          <h1
            className="font-display italic"
            style={{
              fontSize: "clamp(36px, 6vw, 60px)",
              lineHeight: 0.96,
              letterSpacing: "-0.02em",
              color: "var(--c-paper-100)",
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            Ucz mnie
          </h1>
          {/* licznik kolejki — osobny wers, nie w zdaniu */}
          <div className="flex items-baseline" style={{ gap: 14, marginTop: 8 }}>
            <span
              className="font-display italic"
              style={{
                fontSize: 34,
                color: "var(--c-gold-300)",
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {totalDue}
            </span>
            <span
              className="eyebrow"
              style={{ color: "var(--c-paper-300)", opacity: 0.7, fontSize: 10 }}
            >
              {plPlural(totalDue, "temat czeka", "tematy czekają", "tematów czeka")} dziś w kolejce
            </span>
          </div>
        </div>
        <div style={{ paddingTop: 4 }}>
          <SessionClock size={224} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SessionAnatomy strip
   ============================================================ */

const SESSION_ANATOMY = [
  {
    mark: "03",
    label: "Teoria",
    min: 3,
    body: "Trzy zdania na temat. Najmniejsza dawka, żeby coś zobaczyć.",
    tone: "teoria" as const,
  },
  {
    mark: "10",
    label: "Test",
    min: 10,
    body: "Dziesięć pytań. Połowa otwartych, połowa ABCD. Gęsto, bez wstawek.",
    tone: "test" as const,
  },
  {
    mark: "02",
    label: "Korekta",
    min: 2,
    body: "Dwie minuty na zobaczenie, gdzie ramię było za nisko. Bez wymówek.",
    tone: "korekta" as const,
  },
];

function SessionAnatomy() {
  return (
    <div style={{ padding: "0 24px 48px" }}>
      <div
        className="flex items-center flex-wrap"
        style={{ gap: 16, marginBottom: 20 }}
      >
        <span
          className="eyebrow"
          style={{
            color: "var(--c-gold-400)",
            letterSpacing: "0.28em",
          }}
        >
          ✦ Anatomia sesji
        </span>
        <div
          style={{
            flex: 1,
            minWidth: 30,
            height: 0.5,
            background: "rgba(184,146,77,0.25)",
          }}
        />
        <span
          className="signature"
          style={{
            color: "var(--c-paper-300)",
            opacity: 0.55,
            fontSize: 11,
          }}
        >
          Stała struktura · od pierwszej do piętnastej minuty
        </span>
      </div>
      <div
        className="flex flex-col md:flex-row"
        style={{
          border: "0.5px solid rgba(184,146,77,0.22)",
          background: "rgba(27,17,8,0.35)",
        }}
      >
        {SESSION_ANATOMY.map((it, i) => (
          <AnatomyBlock
            key={it.label}
            item={it}
            isLast={i === SESSION_ANATOMY.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function MinimumDayStrip({
  href,
  disabled,
}: {
  href: string;
  disabled: boolean;
}) {
  const Wrapper: ElementType = disabled ? "div" : Link;
  const props = disabled ? { "aria-disabled": true as const } : { href };
  return (
    <div style={{ padding: "0 24px 56px" }}>
      <Wrapper
        {...props}
        className={`minimum-slip relative flex items-center flex-wrap ${
          disabled ? "is-disabled" : ""
        }`}
        style={{
          gap: 28,
          padding: "18px 28px 18px 24px",
          textDecoration: "none",
          opacity: disabled ? 0.55 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        <span className="stamp" style={{ flexShrink: 0, opacity: 0.95 }}>
          Minimum Day
        </span>
        <div
          className="font-display italic"
          style={{
            flex: 1,
            minWidth: 220,
            fontSize: 27,
            lineHeight: 1.1,
            color: "var(--c-paper-100)",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            textWrap: "balance",
          }}
        >
          Trzy pytania. Wystarczy, żeby nie wypaść z rytmu.
        </div>
        <div className="flex items-baseline" style={{ gap: 8, flexShrink: 0 }}>
          <span
            className="font-display italic"
            style={{
              fontSize: 26,
              color: "var(--c-gold-300)",
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            03
          </span>
          <span
            className="signature"
            style={{ fontSize: 10, color: "rgba(212,195,158,0.55)" }}
          >
            pytania
          </span>
        </div>
        <span
          className="eyebrow flex items-center minimum-slip-cta"
          style={{ flexShrink: 0, gap: 10, fontSize: 10, padding: "11px 18px" }}
        >
          {disabled ? (
            "Brak tematów"
          ) : (
            <>
              Szybki ślad{" "}
              <span style={{ fontSize: 13, lineHeight: 1 }}>→</span>
            </>
          )}
        </span>
      </Wrapper>
    </div>
  );
}

function AnatomyBlock({
  item,
  isLast,
}: {
  item: (typeof SESSION_ANATOMY)[number];
  isLast: boolean;
}) {
  const palette = {
    teoria: { bar: "#7a4a1f", text: "var(--c-cognac)" },
    test: { bar: "#8B2E1F", text: "var(--c-ink2)" },
    korekta: { bar: "#c8a25c", text: "var(--c-gold-400)" },
  } as const;
  const c = palette[item.tone];
  const pct = Math.round((item.min / 15) * 1000) / 10;
  return (
    <div
      className="relative flex-1 anatomy-block"
      style={{
        borderRight: isLast ? "none" : "0.5px solid rgba(184,146,77,0.18)",
        padding: "20px 28px 22px",
      }}
    >
      <div
        className="flex items-baseline"
        style={{ gap: 12, marginBottom: 12 }}
      >
        <span
          className="font-display italic"
          style={{
            fontSize: 38,
            color: c.text,
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            minWidth: 52,
          }}
        >
          {item.mark}
        </span>
        <span
          className="eyebrow"
          style={{ color: "var(--c-paper-200)", opacity: 0.8 }}
        >
          {item.label}
        </span>
        <span
          className="signature"
          style={{
            color: "rgba(212,195,158,0.4)",
            fontSize: 10,
          }}
        >
          min
        </span>
        <span
          className="signature"
          style={{
            marginLeft: "auto",
            color: "rgba(212,195,158,0.35)",
            fontSize: 10,
          }}
        >
          {pct}%
        </span>
      </div>
      {/* wspólny tor — wypełnienie proporcjonalne do udziału w 15' */}
      <div
        style={{
          height: 2,
          background: "rgba(184,146,77,0.12)",
          marginBottom: 12,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${pct}%`,
            background: c.bar,
            opacity: 0.9,
          }}
        />
      </div>
      <p
        className="caption"
        style={{
          color: "var(--c-paper-300)",
          opacity: 0.62,
          fontSize: 12.5,
          lineHeight: 1.55,
          textWrap: "pretty",
        }}
      >
        {item.body}
      </p>
    </div>
  );
}

/* ============================================================
   ModesGrid — rejestr trybów (karta księgi) + ModeRow
   ============================================================ */

interface Mode {
  key: string;
  roman: string;
  title: string;
  eyebrow: string;
  body: string;
  count: number | string;
  countLabel: string;
  accent: string;
  duration: string;
  href: string;
  disabled?: boolean;
}

function ModesGrid({
  dueCount,
  errorsCount,
  sectionsCount,
  topicsCount,
  mixTopicId,
}: {
  dueCount: number;
  errorsCount: number;
  sectionsCount: number;
  topicsCount: number;
  mixTopicId: string | null;
}) {
  const modes: Mode[] = [
    {
      key: "mix",
      roman: "I",
      title: "Mix dnia",
      eyebrow: "Algorytm",
      body: "System wybiera dziś. Spaced repetition na priorytecie, świeże tematy w tle. Bez decyzji rano — najprostsze wejście.",
      count: dueCount,
      countLabel: plPlural(dueCount, "temat w kolejce", "tematy w kolejce", "tematów w kolejce"),
      accent: "#B8924D",
      duration: "15 min · pełna sesja",
      href: mixTopicId
        ? `/study/session/new?mode=mix&topic=${mixTopicId}`
        : "/study/session/new?mode=mix",
      disabled: dueCount === 0,
    },
    {
      key: "errors",
      roman: "II",
      title: "Tylko błędy",
      eyebrow: "Error Vault",
      body: "Wracają tylko te, na których się potknęłaś. Krótsza sesja, większy ciężar — tu zostaje to, co umyka.",
      count: errorsCount,
      countLabel: plPlural(
        errorsCount,
        "aktywny do oczyszczenia",
        "aktywne do oczyszczenia",
        "aktywnych do oczyszczenia"
      ),
      accent: "#8B2E1F",
      duration: "8 min · krótka sesja",
      href: "/errors/quiz",
      disabled: errorsCount === 0,
    },
    {
      key: "section",
      roman: "III",
      title: "Konkretna sekcja",
      eyebrow: "Półka",
      body: "Wybierasz dziedzinę: Hiszpański, Filozofia, Wino. System tasuje w jej granicach. Dobry tryb po dłuższej przerwie w temacie.",
      count: sectionsCount,
      countLabel: plPlural(sectionsCount, "półka do wyboru", "półki do wyboru", "półek do wyboru"),
      accent: "#7a4a1f",
      duration: "15 min · z jednej półki",
      href: "/study/session/new?mode=vault",
    },
    {
      key: "topic",
      roman: "IV",
      title: "Konkretny temat",
      eyebrow: "Pinezka",
      body: "Otwórz sekcję, kliknij temat. Cała sesja kręci się wokół jednego punktu — gramatyki, reguły, autora. Bez błąkania.",
      count: topicsCount,
      countLabel: plPlural(topicsCount, "temat w katalogu", "tematy w katalogu", "tematów w katalogu"),
      accent: "#1f3a26",
      duration: "zmienna · ile trzeba",
      href: "/vaults",
    },
  ];

  return (
    <div style={{ padding: "0 24px 56px" }}>
      <div
        className="flex items-center flex-wrap"
        style={{ gap: 16, marginBottom: 20 }}
      >
        <span
          className="eyebrow"
          style={{
            color: "var(--c-gold-400)",
            letterSpacing: "0.28em",
          }}
        >
          ✦ Cztery tryby
        </span>
        <div
          style={{
            flex: 1,
            minWidth: 30,
            height: 0.5,
            background: "rgba(184,146,77,0.25)",
          }}
        />
        <span
          className="signature"
          style={{
            color: "var(--c-paper-300)",
            opacity: 0.55,
            fontSize: 11,
          }}
        >
          Wybierz jeden · zawsze możesz zmienić
        </span>
      </div>
      {/* rejestr — kremowa karta księgi z czterema wpisami */}
      <div
        className="tex-paper tex-noise-fine relative"
        style={{
          boxShadow:
            "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 22px 48px -18px rgba(0,0,0,0.72), 0 5px 10px rgba(0,0,0,0.42)",
        }}
      >
        <div
          aria-hidden
          className="absolute"
          style={{
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            zIndex: 3,
            background:
              "linear-gradient(90deg, var(--c-gold-600), var(--c-gold-400), var(--c-gold-600))",
          }}
        />
        <div className="relative" style={{ zIndex: 3 }}>
          {modes.map((m, i) => (
            <ModeRow key={m.key} mode={m} isLast={i === modes.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* Wpis rejestru — zwarty wiersz księgi z grzbietem akcentowym.
   Na <lg opis spada do własnej linii, czas chowa się na wąskich ekranach. */
function ModeRow({ mode, isLast }: { mode: Mode; isLast: boolean }) {
  const Wrapper: React.ElementType = mode.disabled ? "div" : Link;
  const wrapperProps = mode.disabled
    ? { "aria-disabled": true as const }
    : { href: mode.href };

  return (
    <Wrapper
      {...wrapperProps}
      className={`mode-row flex flex-wrap lg:flex-nowrap items-center ${
        mode.disabled ? "is-disabled" : ""
      }`}
      style={
        {
          "--row-accent": mode.accent,
          gap: 24,
          padding: "20px 28px 20px 24px",
          borderBottom: isLast ? "none" : "0.5px dashed rgba(27,17,8,0.25)",
          cursor: mode.disabled ? "not-allowed" : "pointer",
          textDecoration: "none",
          opacity: mode.disabled ? 0.55 : 1,
          transition: "background .18s",
        } as React.CSSProperties
      }
    >
      {/* № + eyebrow */}
      <div style={{ width: 86, flexShrink: 0 }}>
        <div
          className="font-display italic"
          style={{
            fontSize: 26,
            color: mode.accent,
            fontWeight: 500,
            lineHeight: 1,
            marginBottom: 5,
          }}
        >
          № {mode.roman}
        </div>
        <div
          className="eyebrow"
          style={{
            color: "rgba(27,17,8,0.5)",
            fontSize: 8.5,
            letterSpacing: "0.18em",
          }}
        >
          {mode.eyebrow}
        </div>
      </div>

      {/* tytuł */}
      <div
        className="font-display italic flex-1 min-w-[170px] lg:flex-none lg:w-[250px]"
        style={{
          fontSize: 30,
          lineHeight: 1.02,
          color: "#1B1108",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          textWrap: "balance",
        }}
      >
        {mode.title}
      </div>

      {/* opis */}
      <p
        className="caption order-last basis-full lg:order-none lg:basis-auto lg:flex-1 lg:max-w-[420px]"
        style={{
          color: "rgba(27,17,8,0.72)",
          fontSize: 12.5,
          lineHeight: 1.55,
          textWrap: "pretty",
          margin: 0,
        }}
      >
        {mode.body}
      </p>

      {/* licznik */}
      <div
        className="flex items-baseline lg:w-[168px]"
        style={{ gap: 8, flexShrink: 0 }}
      >
        <span
          className="font-display italic"
          style={{
            fontSize: 28,
            color: "#1B1108",
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {mode.count}
        </span>
        <span
          className="caption"
          style={{
            color: "rgba(27,17,8,0.55)",
            fontSize: 11.5,
            fontStyle: "italic",
          }}
        >
          {mode.countLabel}
        </span>
      </div>

      {/* czas */}
      <span
        className="signature hidden md:block lg:w-[140px]"
        style={{
          flexShrink: 0,
          color: "rgba(27,17,8,0.5)",
          fontSize: 10.5,
          letterSpacing: "0.06em",
        }}
      >
        {mode.duration}
      </span>

      {/* CTA */}
      <span
        className="eyebrow flex items-center justify-end mode-row-cta lg:w-[118px]"
        style={{
          flexShrink: 0,
          gap: 8,
          fontSize: 10,
          color: "rgba(27,17,8,0.62)",
          marginLeft: "auto",
        }}
      >
        {mode.disabled ? "Brak materiału" : "Rozpocznij"}{" "}
        <span
          className="mode-row-arrow"
          style={{ fontSize: 13, lineHeight: 1 }}
        >
          →
        </span>
      </span>
    </Wrapper>
  );
}

/* ============================================================
   SectionsRail — chips of every vault
   ============================================================ */

function SectionsRail({
  vaults,
  dueByVault,
}: {
  vaults: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
  dueByVault: Record<string, number>;
}) {
  const totalDue = Object.values(dueByVault).reduce((s, n) => s + n, 0);
  return (
    <div style={{ padding: "0 24px 56px" }}>
      <div
        className="flex items-baseline flex-wrap"
        style={{ gap: 16, marginBottom: 20 }}
      >
        <span
          className="eyebrow"
          style={{
            color: "var(--c-gold-400)",
            letterSpacing: "0.28em",
          }}
        >
          № III · Sekcje
        </span>
        <div
          style={{
            flex: 1,
            minWidth: 30,
            height: 0.5,
            background: "rgba(184,146,77,0.18)",
          }}
        />
        <span
          className="signature"
          style={{
            color: "var(--c-paper-300)",
            opacity: 0.55,
            fontSize: 11,
          }}
        >
          {vaults.length} {plPlural(vaults.length, "półka", "półki", "półek")} · {totalDue}{" "}
          {plPlural(totalDue, "temat dziś", "tematy dziś", "tematów dziś")}
        </span>
      </div>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        style={{ gap: 12 }}
      >
        {vaults.map((v) => {
          const visuals = VAULT_VISUALS[v.slug] ?? {
            motif: v.name[0]?.toUpperCase() ?? "·",
            accent: "#3a2418",
          };
          return (
            <SectionChip
              key={v.id}
              slug={v.slug}
              label={v.name}
              count={dueByVault[v.id] ?? 0}
              motif={visuals.motif}
              accent={visuals.accent}
            />
          );
        })}
      </div>
    </div>
  );
}

function SectionChip({
  slug,
  label,
  count,
  motif,
  accent,
}: {
  slug: string;
  label: string;
  count: number;
  motif: string;
  accent: string;
}) {
  return (
    <Link
      href={`/vaults/${slug}`}
      className={`section-chip relative flex items-center ${
        count === 0 ? "is-empty" : ""
      }`}
      style={{
        gap: 14,
        padding: "14px 16px 14px 14px",
        background: "rgba(27,17,8,0.30)",
        border: "0.5px solid rgba(184,146,77,0.22)",
        cursor: "pointer",
        transition: "background .18s, border-color .18s, transform .18s, opacity .18s",
        textDecoration: "none",
        // CSS variable consumed by hover rule for accent border
        ["--chip-accent" as string]: accent,
      } as React.CSSProperties}
    >
      <div
        aria-hidden
        style={{
          width: 6,
          alignSelf: "stretch",
          flexShrink: 0,
          background: `linear-gradient(180deg, ${accent} 0%, rgba(0,0,0,0.4) 100%)`,
          boxShadow:
            "inset 1px 0 0 rgba(255,220,180,0.20), inset -1px 0 0 rgba(0,0,0,0.45)",
        }}
      />
      <div
        className="flex items-center justify-center"
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: "rgba(184,146,77,0.10)",
          border: "0.5px solid rgba(184,146,77,0.28)",
          flexShrink: 0,
        }}
      >
        <span
          className="font-display italic"
          style={{
            fontSize: 13,
            color: "var(--c-gold-300)",
            fontWeight: 500,
            lineHeight: 1,
          }}
        >
          {motif}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          className="font-display italic"
          style={{
            fontSize: 19,
            color: "var(--c-paper-100)",
            fontWeight: 500,
            letterSpacing: "-0.005em",
            lineHeight: 1.1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </div>
      </div>
      <span
        className="signature section-chip-count"
        style={{
          color: "var(--c-paper-300)",
          opacity: count > 0 ? 0.55 : 0.35,
          fontSize: 11,
          letterSpacing: "0.05em",
          flexShrink: 0,
          transition: "color .18s, opacity .18s",
        }}
      >
        {String(count).padStart(2, "0")}
      </span>
    </Link>
  );
}

/* ============================================================
   Footer
   ============================================================ */

function PageFooter() {
  const d = new Date();
  return (
    <div
      className="flex items-center justify-between flex-wrap gap-4"
      style={{
        padding: "32px 24px 56px",
        borderTop: "1px solid rgba(184,146,77,0.18)",
        marginTop: 24,
      }}
    >
      <div
        className="signature"
        style={{ color: "var(--c-paper-300)", opacity: 0.55 }}
      >
        The Learning Vault · Anno MMXXVI · Ucz mnie
      </div>
      <div
        className="signature"
        style={{ color: "var(--c-paper-300)", opacity: 0.55 }}
      >
        ❦
      </div>
      <div
        className="signature"
        style={{ color: "var(--c-paper-300)", opacity: 0.55 }}
      >
        {WEEKDAYS_PL[d.getDay()]} · {d.getDate()} · {MONTHS_PL_SHORT[d.getMonth()]}
      </div>
    </div>
  );
}
