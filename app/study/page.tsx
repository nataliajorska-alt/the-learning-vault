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

function SessionClock({ size = 200 }: { size?: number }) {
  const segments = 15;
  const radius = size / 2 - 18;
  const cx = size / 2;
  const cy = size / 2;
  const stroke = 12;

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
        r={radius + stroke / 2 + 6}
        fill="none"
        stroke="rgba(184,146,77,0.20)"
        strokeWidth="0.5"
      />
      <circle
        cx={cx}
        cy={cy}
        r={radius + stroke / 2 + 10}
        fill="none"
        stroke="rgba(184,146,77,0.10)"
        strokeWidth="0.5"
      />
      {Array.from({ length: segments }).map((_, i) => {
        const startA = (i / segments) * Math.PI * 2 - Math.PI / 2;
        const endA = ((i + 1) / segments) * Math.PI * 2 - Math.PI / 2;
        const gap = 0.014;
        const sa = startA + gap;
        const ea = endA - gap;
        const x1 = cx + Math.cos(sa) * radius;
        const y1 = cy + Math.sin(sa) * radius;
        const x2 = cx + Math.cos(ea) * radius;
        const y2 = cy + Math.sin(ea) * radius;
        const largeArc = ea - sa > Math.PI ? 1 : 0;
        const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
        let color = "#7a4a1f";
        if (i >= 3 && i < 13) color = "#8B2E1F";
        if (i >= 13) color = "#c8a25c";
        const opacity = i < 3 ? 0.85 : i < 13 ? 0.78 : 0.95;
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="butt"
            opacity={opacity}
          />
        );
      })}
      <circle cx={cx} cy={cy - radius - 2} r="1.4" fill="var(--c-gold-300)" />
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontStyle="italic"
        fontWeight="600"
        fontSize="52"
        fill="var(--c-paper-100)"
        letterSpacing="-2"
      >
        15
      </text>
      <text
        x={cx}
        y={cy + 16}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="9.5"
        fill="var(--c-gold-400)"
        letterSpacing="3"
      >
        MINUT
      </text>
      <text
        x={cx}
        y={cy + 32}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="8"
        fill="rgba(212,195,158,0.5)"
        letterSpacing="2"
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
              marginBottom: 16,
            }}
          >
            Ucz mnie
          </h1>
          <p
            className="lead"
            style={{
              color: "var(--c-paper-300)",
              opacity: 0.82,
              maxWidth: 560,
            }}
          >
            Wybierz format.{" "}
            <em style={{ color: "var(--c-gold-300)" }}>
              Trzy minuty teorii, dziesięć testu, dwie korekty.
            </em>{" "}
            Bez presji, ale z timerem — krótko, gęsto, do końca.
            {totalDue > 0 && (
              <>
                {" "}Dziś{" "}
                <span
                  className="font-display italic"
                  style={{ color: "var(--c-gold-300)", fontSize: 22 }}
                >
                  {totalDue}
                </span>{" "}
                {totalDue === 1 ? "temat" : totalDue < 5 ? "tematy" : "tematów"} w kolejce.
              </>
            )}
          </p>
        </div>
        <div style={{ paddingTop: 8 }}>
          <SessionClock size={200} />
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
    body: "Trzy zdania na temat. Najmniejsza dawka, żeby coś zobaczyć.",
    tone: "teoria" as const,
  },
  {
    mark: "10",
    label: "Test",
    body: "Dziesięć pytań. Połowa otwartych, połowa ABCD. Gęsto, bez wstawek.",
    tone: "test" as const,
  },
  {
    mark: "02",
    label: "Korekta",
    body: "Dwie minuty na zobaczenie, gdzie ramię było za nisko. Bez wymówek.",
    tone: "korekta" as const,
  },
];

function SessionAnatomy() {
  return (
    <div style={{ padding: "0 24px 48px" }}>
      <div
        className="flex items-center flex-wrap"
        style={{ gap: 16, marginBottom: 18 }}
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
    <div style={{ padding: "0 24px 48px" }}>
      <Wrapper
        {...props}
        className="tex-paper tex-noise-fine block"
        style={{
          textDecoration: "none",
          opacity: disabled ? 0.55 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
          borderLeft: "3px solid rgba(184,146,77,0.82)",
          boxShadow:
            "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 18px 38px -18px rgba(0,0,0,0.66)",
        }}
      >
        <div
          className="flex items-center justify-between flex-wrap"
          style={{ gap: 18, padding: "22px 26px" }}
        >
          <div style={{ minWidth: 0, flex: "1 1 420px" }}>
            <div
              className="eyebrow"
              style={{ color: "rgba(122,74,31,0.72)", marginBottom: 7 }}
            >
              Minimum day
            </div>
            <div
              className="font-display italic"
              style={{
                color: "#1B1108",
                fontSize: "clamp(25px, 3vw, 34px)",
                lineHeight: 1.05,
                fontWeight: 600,
              }}
            >
              Trzy pytania. Wystarczy, żeby nie wypaść z rytmu.
            </div>
          </div>
          <div
            className="flex items-baseline"
            style={{ gap: 10, color: "rgba(27,17,8,0.62)" }}
          >
            <span
              className="font-display italic"
              style={{ fontSize: 36, color: "var(--c-cognac)", lineHeight: 1 }}
            >
              03
            </span>
            <span className="signature" style={{ textTransform: "uppercase" }}>
              {disabled ? "brak tematów" : "szybki ślad ->"}
            </span>
          </div>
        </div>
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
  const widths = { teoria: "20%", test: "67%", korekta: "13%" } as const;
  return (
    <div
      className="relative flex-1 anatomy-block"
      style={{
        borderRight: isLast ? "none" : "0.5px solid rgba(184,146,77,0.18)",
        padding: "18px 22px",
      }}
    >
      <div
        className="flex items-baseline"
        style={{ gap: 12, marginBottom: 8 }}
      >
        <span
          className="font-display italic"
          style={{
            fontSize: 36,
            color: c.text,
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {item.mark}
        </span>
        <span
          className="eyebrow"
          style={{ color: "var(--c-paper-300)", opacity: 0.75 }}
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
      </div>
      <div
        style={{
          height: 3,
          background: "rgba(184,146,77,0.10)",
          marginBottom: 10,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: widths[item.tone],
            background: c.bar,
            opacity: 0.85,
            boxShadow: `0 0 6px ${c.bar}55`,
          }}
        />
      </div>
      <p
        className="caption"
        style={{
          color: "var(--c-paper-300)",
          opacity: 0.65,
          fontSize: 12.5,
          lineHeight: 1.55,
        }}
      >
        {item.body}
      </p>
    </div>
  );
}

/* ============================================================
   ModeGlyph — ornamental SVG per mode
   ============================================================ */

type GlyphKind = "shuffle" | "errata" | "shelf" | "pin";

function ModeGlyph({
  kind,
  color,
  size = 68,
}: {
  kind: GlyphKind;
  color: string;
  size?: number;
}) {
  const stroke = {
    fill: "none" as const,
    stroke: color,
    strokeWidth: 0.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (kind) {
    case "shuffle":
      return (
        <svg width={size} height={size} viewBox="0 0 76 76" aria-hidden>
          <rect
            x="14"
            y="22"
            width="32"
            height="42"
            rx="1"
            {...stroke}
            transform="rotate(-10 30 43)"
          />
          <rect
            x="22"
            y="18"
            width="32"
            height="42"
            rx="1"
            {...stroke}
            transform="rotate(2 38 39)"
          />
          <rect
            x="30"
            y="14"
            width="32"
            height="42"
            rx="1"
            {...stroke}
            transform="rotate(14 46 35)"
          />
          <circle cx="44" cy="20" r="1" fill={color} />
          <circle cx="50" cy="32" r="1" fill={color} />
          <circle cx="56" cy="28" r="1" fill={color} />
        </svg>
      );
    case "errata":
      return (
        <svg width={size} height={size} viewBox="0 0 76 76" aria-hidden>
          <circle cx="38" cy="38" r="22" {...stroke} strokeWidth="1.2" />
          <circle
            cx="38"
            cy="38"
            r="18"
            {...stroke}
            strokeWidth="0.4"
            opacity="0.45"
          />
          <path
            d="M28 28 L48 48 M48 28 L28 48"
            {...stroke}
            strokeWidth="2.4"
          />
          <path
            d="M38 8 v8 M38 60 v8 M8 38 h8 M60 38 h8"
            {...stroke}
            opacity="0.55"
          />
          <path
            d="M16 16 l6 6 M60 16 l-6 6 M16 60 l6 -6 M60 60 l-6 -6"
            {...stroke}
            opacity="0.4"
          />
        </svg>
      );
    case "shelf":
      return (
        <svg width={size} height={size} viewBox="0 0 76 76" aria-hidden>
          <rect x="14" y="14" width="12" height="48" {...stroke} />
          <rect x="32" y="20" width="12" height="42" {...stroke} />
          <rect x="50" y="10" width="12" height="52" {...stroke} />
          <path d="M16 22 h8 M16 54 h8" {...stroke} strokeWidth="0.6" />
          <path d="M34 28 h8 M34 56 h8" {...stroke} strokeWidth="0.6" />
          <path d="M52 18 h8 M52 54 h8" {...stroke} strokeWidth="0.6" />
          <circle cx="20" cy="38" r="1" fill={color} />
          <circle cx="38" cy="42" r="1" fill={color} />
          <circle cx="56" cy="36" r="1" fill={color} />
          <path d="M8 64 h60" {...stroke} strokeWidth="0.6" opacity="0.6" />
        </svg>
      );
    case "pin":
      return (
        <svg width={size} height={size} viewBox="0 0 76 76" aria-hidden>
          <circle cx="38" cy="38" r="24" {...stroke} strokeWidth="1.2" />
          <circle
            cx="38"
            cy="38"
            r="17"
            {...stroke}
            strokeWidth="0.4"
            opacity="0.5"
          />
          <circle
            cx="38"
            cy="38"
            r="10"
            {...stroke}
            strokeWidth="0.4"
            opacity="0.5"
          />
          <circle cx="38" cy="38" r="3.4" fill={color} />
          <path
            d="M38 10 v6 M38 60 v6 M10 38 h6 M60 38 h6"
            {...stroke}
            strokeWidth="0.8"
          />
        </svg>
      );
  }
}

/* ============================================================
   ModeCard + ModesGrid
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
  accentSoft: string;
  duration: string;
  glyph: GlyphKind;
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
      countLabel: dueCount === 1 ? "temat w kolejce" : "tematów w kolejce",
      accent: "#B8924D",
      accentSoft: "rgba(184,146,77,0.45)",
      duration: "15 min · pełna sesja",
      glyph: "shuffle",
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
      countLabel:
        errorsCount === 1 ? "aktywny do oczyszczenia" : "aktywnych do oczyszczenia",
      accent: "#8B2E1F",
      accentSoft: "rgba(139,46,31,0.45)",
      duration: "8 min · krótka sesja",
      glyph: "errata",
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
      countLabel: sectionsCount === 1 ? "półka do wyboru" : "półek do wyboru",
      accent: "#7a4a1f",
      accentSoft: "rgba(122,74,31,0.55)",
      duration: "15 min · z jednej półki",
      glyph: "shelf",
      href: "/study/session/new?mode=vault",
    },
    {
      key: "topic",
      roman: "IV",
      title: "Konkretny temat",
      eyebrow: "Pinezka",
      body: "Otwórz sekcję, kliknij temat. Cała sesja kręci się wokół jednego punktu — gramatyki, reguły, autora. Bez błąkania.",
      count: topicsCount,
      countLabel: topicsCount === 1 ? "temat w katalogu" : "tematów w katalogu",
      accent: "#1f3a26",
      accentSoft: "rgba(31,58,38,0.55)",
      duration: "wariable · ile trzeba",
      glyph: "pin",
      href: "/vaults",
    },
  ];

  return (
    <div style={{ padding: "0 24px 56px" }}>
      <div
        className="flex items-center flex-wrap"
        style={{ gap: 16, marginBottom: 22 }}
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
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 24 }}>
        {modes.map((m) => (
          <ModeCard key={m.key} mode={m} />
        ))}
      </div>
    </div>
  );
}

function ModeCard({ mode }: { mode: Mode }) {
  const Wrapper: React.ElementType = mode.disabled ? "div" : Link;
  const wrapperProps = mode.disabled
    ? { "aria-disabled": true as const }
    : { href: mode.href };

  return (
    <Wrapper
      {...wrapperProps}
      className={`mode-card tex-paper tex-noise-fine relative ${
        mode.disabled ? "is-disabled" : ""
      }`}
      style={{
        boxShadow:
          "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 18px 38px -16px rgba(0,0,0,0.68), 0 4px 8px rgba(0,0,0,0.4)",
        transition: "transform .22s ease, box-shadow .22s ease",
        cursor: mode.disabled ? "not-allowed" : "pointer",
        minHeight: 340,
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        opacity: mode.disabled ? 0.55 : 1,
      }}
    >
      {/* gilt double-rule frame */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          inset: 12,
          border: "0.5px solid rgba(146,112,55,0.35)",
          zIndex: 2,
        }}
      />

      {/* top-edge accent */}
      <div
        aria-hidden
        className="absolute"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: mode.accent,
          opacity: 0.95,
          boxShadow: `0 0 10px ${mode.accentSoft}`,
          zIndex: 3,
        }}
      />

      <div
        className="relative"
        style={{
          zIndex: 3,
          padding: "30px 32px 26px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="flex items-start justify-between"
          style={{ marginBottom: 16, gap: 16 }}
        >
          <div>
            <div
              className="font-display italic"
              style={{
                fontSize: 26,
                color: mode.accent,
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: "-0.01em",
                marginBottom: 8,
                opacity: 0.9,
              }}
            >
              № {mode.roman}
            </div>
            <span
              className="eyebrow"
              style={{ color: "rgba(27,17,8,0.55)", fontSize: 10 }}
            >
              {mode.eyebrow}
            </span>
          </div>
          <div
            className="mode-card-glyph"
            style={{
              marginTop: -4,
              opacity: 0.72,
              transition: "opacity .2s",
            }}
          >
            <ModeGlyph kind={mode.glyph} color={mode.accent} size={64} />
          </div>
        </div>

        <h2
          className="font-display italic"
          style={{
            fontSize: 40,
            lineHeight: 1.0,
            color: "#1B1108",
            fontWeight: 600,
            letterSpacing: "-0.015em",
            marginBottom: 14,
          }}
        >
          {mode.title}
        </h2>

        <p
          className="body-prose"
          style={{
            color: "rgba(27,17,8,0.78)",
            fontSize: 14,
            lineHeight: 1.6,
            marginBottom: 20,
            flex: 1,
          }}
        >
          {mode.body}
        </p>

        <div
          className="flex items-baseline"
          style={{ gap: 10, marginBottom: 16 }}
        >
          <span
            className="font-display italic"
            style={{
              fontSize: 34,
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
              fontSize: 12.5,
              fontStyle: "italic",
            }}
          >
            {mode.countLabel}
          </span>
        </div>

        <div
          className="flex items-center justify-between"
          style={{
            borderTop: "0.5px dashed rgba(27,17,8,0.22)",
            paddingTop: 14,
          }}
        >
          <span
            className="signature"
            style={{
              color: "rgba(27,17,8,0.55)",
              fontSize: 10.5,
              letterSpacing: "0.08em",
            }}
          >
            {mode.duration}
          </span>
          <span
            className="eyebrow flex items-center mode-card-cta"
            style={{
              color: "rgba(27,17,8,0.62)",
              fontSize: 10,
              gap: 8,
              transition: "color .2s",
            }}
            data-accent={mode.accent}
          >
            {mode.disabled ? "Brak materiału" : "Rozpocznij"}{" "}
            <span style={{ fontSize: 13, lineHeight: 1 }}>→</span>
          </span>
        </div>
      </div>
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
        style={{ gap: 16, marginBottom: 22 }}
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
          {vaults.length} {vaults.length === 1 ? "półka" : "półek"} · {totalDue}{" "}
          {totalDue === 1 ? "temat dziś" : "tematów dziś"}
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
      className="section-chip relative flex items-center"
      style={{
        gap: 14,
        padding: "12px 16px 12px 12px",
        background: "rgba(27,17,8,0.30)",
        border: "0.5px solid rgba(184,146,77,0.22)",
        cursor: "pointer",
        transition: "background .18s, border-color .18s, transform .18s",
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
            fontSize: 18,
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
          color: count > 0 ? "var(--c-gold-300)" : "var(--c-paper-300)",
          opacity: count > 0 ? 0.85 : 0.5,
          fontSize: 11,
          letterSpacing: "0.05em",
          flexShrink: 0,
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
