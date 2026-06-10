"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Topic, Vault } from "@/lib/types";

/* ============================================================
   THEORY PHASE — book spread with reading header, dial, breadcrumb,
   recto/verso pages, toolbar, on-deck strip.
   ============================================================ */

const ETAPY = [
  { n: "I", label: "Teoria", minutes: 3, tone: "teoria" as const },
  { n: "II", label: "Test", minutes: 10, tone: "test" as const },
  { n: "III", label: "Korekta", minutes: 2, tone: "korekta" as const },
];

/* slug → sigil + roman index for header */
const VAULT_SIGIL: Record<string, { sigil: string; roman: string }> = {
  es:        { sigil: "ñ", roman: "§ I" },
  en:        { sigil: "EN", roman: "§ II" },
  wine:      { sigil: "☙", roman: "§ III" },
  art:       { sigil: "✦", roman: "§ IV" },
  music:     { sigil: "𝄞", roman: "§ V" },
  savoir:    { sigil: "✧", roman: "§ VI" },
  phil:      { sigil: "φ", roman: "§ VII" },
  hist:      { sigil: "H", roman: "§ VIII" },
  econ:      { sigil: "§", roman: "§ IX" },
  blackjack: { sigil: "♠", roman: "§ X" },
  avia:      { sigil: "✈", roman: "§ XI" },
  excel:     { sigil: "fx", roman: "§ XII" },
  sport:     { sigil: "☘", roman: "§ XIII" },
};

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

interface OnDeckItem {
  topicId: string;
  title: string;
  vaultName: string;
  vaultSlug: string;
}

interface TheoryPhaseProps {
  topic: Topic;
  vault: Vault | null;
  queueReason: string;
  compact?: boolean;
  elapsedSec: number;
  totalSec: number;
  onProceed: () => void;
  onDeck?: OnDeckItem[];
}

export function TheoryPhase({
  topic,
  vault,
  queueReason,
  compact = false,
  elapsedSec,
  totalSec,
  onProceed,
  onDeck = [],
}: TheoryPhaseProps) {
  const sigInfo = vault ? VAULT_SIGIL[vault.slug] : null;
  const sigil = sigInfo?.sigil ?? vault?.name?.[0]?.toUpperCase() ?? "·";
  const roman = sigInfo?.roman ?? "§";
  const signature = vault
    ? `${vaultSig(vault.name)} · ${idSig(topic.id)}`
    : idSig(topic.id);

  const sectionName = vault?.name ?? "Sekcja";

  /* Split topic.theory into paragraphs (by blank line, fall back to single) */
  const paragraphs = useMemo(
    () => splitTheory(topic.theory),
    [topic.theory]
  );

  /* Render-time time-left for the header readout */
  const remaining = Math.max(0, totalSec - elapsedSec);
  const remMin = Math.floor(remaining / 60);
  const remSec = remaining % 60;

  return (
    <div className="-mx-6 md:-mx-12 -mt-10 md:-mt-12 relative overflow-hidden">
      {/* warm reading-lamp pool */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 12%, rgba(200,140,70,0.13), transparent 60%)",
          zIndex: 0,
        }}
      />
      {/* dot pattern */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(184,146,77,0.06) 1px, transparent 1.5px)",
          backgroundSize: "32px 32px",
          opacity: 0.55,
          zIndex: 0,
        }}
      />
      {/* edge vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)",
          zIndex: 0,
        }}
      />

      <div className="relative" style={{ zIndex: 1 }}>
        <ReadingHeader
          sectionName={sectionName}
          roman={roman}
          signature={signature}
          title={topic.title}
          subtitle={topic.summary}
          elapsedSec={elapsedSec}
          totalSec={totalSec}
          remainingDisplay={`${remMin}:${String(remSec).padStart(2, "0")}`}
          compact={compact}
        />
        <BookSpread
          sigil={sigil}
          sectionName={sectionName}
          signature={signature}
          title={topic.title}
          summary={topic.summary}
          paragraphs={paragraphs}
          queueReason={queueReason}
          compact={compact}
          onProceed={onProceed}
        />
        <ReadingToolbar />
        {onDeck.length > 0 && <OnDeckStrip items={onDeck} />}
      </div>
    </div>
  );
}

function splitTheory(text: string | undefined | null): string[] {
  if (!text) return [];
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  return blocks.length > 0 ? blocks : [text.trim()].filter(Boolean);
}

/* ============================================================
   Reading header — eyebrow row, breadcrumb, title block + dial
   ============================================================ */

function ReadingHeader({
  sectionName,
  roman,
  signature,
  title,
  subtitle,
  elapsedSec,
  totalSec,
  remainingDisplay,
  compact,
}: {
  sectionName: string;
  roman: string;
  signature: string;
  title: string;
  subtitle: string;
  elapsedSec: number;
  totalSec: number;
  remainingDisplay: string;
  compact: boolean;
}) {
  const d = new Date();
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const monthsLong = [
    "stycznia","lutego","marca","kwietnia","maja","czerwca",
    "lipca","sierpnia","września","października","listopada","grudnia",
  ];
  const weekdays = [
    "Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota",
  ];
  const dateStr = `${weekdays[d.getDay()]} · ${d.getDate()} ${monthsLong[d.getMonth()]} · godzina ${time}`;

  return (
    <div style={{ padding: "32px 24px 24px" }}>
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
          ✦ Bieżąca sesja
        </span>
        <div
          style={{
            flex: 1,
            minWidth: 20,
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
          {compact ? "Minimum day · 3 pytania" : dateStr}
        </span>
      </div>

      <EtapyBreadcrumb currentIdx={0} />

      <div
        className="flex items-start justify-between flex-wrap"
        style={{ marginTop: 28, gap: 32 }}
      >
        <div style={{ flex: "1 1 540px", minWidth: 0, maxWidth: 880 }}>
          <div
            className="flex items-baseline flex-wrap"
            style={{ gap: 16, marginBottom: 12 }}
          >
            <span
              className="font-display italic"
              style={{
                fontSize: 32,
                color: "var(--c-gold-400)",
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: "-0.01em",
              }}
            >
              {roman}
            </span>
            <div
              className="flex items-baseline"
              style={{ gap: 10 }}
            >
              <span
                className="eyebrow"
                style={{
                  color: "var(--c-paper-200)",
                  opacity: 0.85,
                }}
              >
                {sectionName}
              </span>
              <span style={{ color: "rgba(212,195,158,0.35)" }}>·</span>
              <span
                className="signature"
                style={{
                  color: "var(--c-paper-300)",
                  opacity: 0.55,
                  fontSize: 11,
                }}
              >
                {signature}
              </span>
            </div>
          </div>

          <h1
            className="font-display italic"
            style={{
              fontSize: "clamp(40px, 6vw, 64px)",
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
              color: "var(--c-paper-100)",
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            {title}
          </h1>

          {subtitle && (
            <div
              className="font-display italic"
              style={{
                fontSize: 18,
                color: "var(--c-paper-300)",
                opacity: 0.78,
                fontWeight: 400,
                letterSpacing: "-0.005em",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div
          className="flex flex-col items-center"
          style={{ gap: 10, paddingTop: 4 }}
        >
          <SessionDial
            size={132}
            etapy={ETAPY}
            currentIdx={0}
            elapsedSec={elapsedSec}
            totalSec={totalSec}
          />
          <div className="flex items-baseline" style={{ gap: 8 }}>
            <span
              className="font-display italic"
              style={{
                fontSize: 28,
                color: "var(--c-paper-100)",
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: "-0.01em",
              }}
            >
              {remainingDisplay}
            </span>
            <span
              className="signature"
              style={{
                color: "var(--c-paper-300)",
                opacity: 0.5,
                fontSize: 10,
              }}
            >
              do testu
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Etapy breadcrumb — 3 stations
   ============================================================ */

function EtapyBreadcrumb({ currentIdx }: { currentIdx: number }) {
  const colorOf = (tone: "teoria" | "test" | "korekta") =>
    tone === "teoria" ? "#7a4a1f" : tone === "test" ? "#8B2E1F" : "#c8a25c";
  return (
    <div className="flex items-center flex-wrap" style={{ gap: 0 }}>
      {ETAPY.map((e, i) => {
        const active = i === currentIdx;
        const done = i < currentIdx;
        const color = colorOf(e.tone);
        return (
          <div
            key={e.n}
            className="flex items-baseline"
            style={{
              gap: 18,
              flexGrow: i < ETAPY.length - 1 ? 1 : 0,
              alignItems: "baseline",
            }}
          >
            <div
              className="flex items-baseline"
              style={{
                gap: 10,
                opacity: active ? 1 : done ? 0.7 : 0.35,
              }}
            >
              <span
                className="font-display italic"
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: active ? color : "var(--c-paper-300)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                }}
              >
                {e.n}
              </span>
              <span
                className="eyebrow"
                style={{
                  color: active
                    ? "var(--c-paper-100)"
                    : "var(--c-paper-300)",
                  fontSize: 10,
                }}
              >
                {e.label}
              </span>
              <span
                className="signature"
                style={{
                  color: "var(--c-paper-300)",
                  opacity: 0.5,
                  fontSize: 10,
                }}
              >
                {e.minutes}′
              </span>
            </div>
            {i < ETAPY.length - 1 && (
              <div
                className="relative"
                style={{
                  flex: 1,
                  height: 16,
                  margin: "0 14px",
                  minWidth: 30,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 7,
                    left: 0,
                    right: 0,
                    height: 0.5,
                    background: "rgba(184,146,77,0.30)",
                  }}
                />
                <div
                  className="absolute"
                  style={{
                    top: 5,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--c-gold-500)",
                    opacity: 0.6,
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   SessionDial — 3-arc gilded ring with progress overlay
   ============================================================ */

function SessionDial({
  size = 132,
  etapy,
  currentIdx,
  elapsedSec,
  totalSec,
}: {
  size?: number;
  etapy: typeof ETAPY;
  currentIdx: number;
  elapsedSec: number;
  totalSec: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 14;
  const stroke = 8;
  const totalMin = etapy.reduce((s, e) => s + e.minutes, 0);
  const colorOf = (tone: "teoria" | "test" | "korekta") =>
    tone === "teoria" ? "#7a4a1f" : tone === "test" ? "#8B2E1F" : "#c8a25c";

  /* etapy arcs */
  const arcs: React.ReactNode[] = [];
  let accum = 0;
  for (let i = 0; i < etapy.length; i++) {
    const e = etapy[i];
    const startMin = accum;
    const endMin = accum + e.minutes;
    accum = endMin;
    const gap = 0.05;
    const sa = (startMin / totalMin) * Math.PI * 2 - Math.PI / 2 + gap;
    const ea = (endMin / totalMin) * Math.PI * 2 - Math.PI / 2 - gap;
    const x1 = cx + Math.cos(sa) * radius;
    const y1 = cy + Math.sin(sa) * radius;
    const x2 = cx + Math.cos(ea) * radius;
    const y2 = cy + Math.sin(ea) * radius;
    const large = ea - sa > Math.PI ? 1 : 0;
    const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
    const isActive = i === currentIdx;
    const isDone = i < currentIdx;
    const color = colorOf(e.tone);
    arcs.push(
      <path
        key={e.n}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        opacity={isActive ? 0.95 : isDone ? 0.8 : 0.22}
        strokeLinecap="butt"
      />
    );
  }

  /* progress overlay */
  const overlay = (() => {
    const e = etapy[currentIdx];
    let start = 0;
    for (let i = 0; i < currentIdx; i++) start += etapy[i].minutes;
    const segMin = e.minutes;
    const pct = Math.min(1, Math.max(0, elapsedSec / Math.max(1, totalSec)));
    const localMin = start + segMin * pct;
    const sa = (start / totalMin) * Math.PI * 2 - Math.PI / 2 + 0.05;
    const ea = (localMin / totalMin) * Math.PI * 2 - Math.PI / 2;
    if (ea <= sa) return null;
    const x2 = cx + Math.cos(ea) * radius;
    const y2 = cy + Math.sin(ea) * radius;
    const x1 = cx + Math.cos(sa) * radius;
    const y1 = cy + Math.sin(sa) * radius;
    const large = ea - sa > Math.PI ? 1 : 0;
    const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
    return (
      <>
        <path
          d={d}
          fill="none"
          stroke="#f3d28a"
          strokeWidth={stroke + 2}
          opacity="0.35"
          strokeLinecap="round"
        />
        <circle cx={x2} cy={y2} r="3.2" fill="#f3d28a" />
        <circle
          cx={x2}
          cy={y2}
          r="5.5"
          fill="none"
          stroke="#f3d28a"
          opacity="0.35"
        />
      </>
    );
  })();

  const roman = etapy[currentIdx].n;

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
        r={radius + stroke / 2 + 5}
        fill="none"
        stroke="rgba(184,146,77,0.18)"
        strokeWidth="0.5"
      />
      <circle
        cx={cx}
        cy={cy}
        r={radius + stroke / 2 + 8}
        fill="none"
        stroke="rgba(184,146,77,0.10)"
        strokeWidth="0.5"
      />
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="rgba(184,146,77,0.10)"
        strokeWidth={stroke}
      />
      {arcs}
      {overlay}
      <circle
        cx={cx}
        cy={cy - radius - 5}
        r="1.4"
        fill="var(--c-gold-300)"
      />
      <text
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontStyle="italic"
        fontWeight="600"
        fontSize="30"
        fill="var(--c-paper-100)"
        letterSpacing="-1"
      >
        {roman}
      </text>
      <text
        x={cx}
        y={cy + 16}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="8"
        fill="var(--c-gold-400)"
        letterSpacing="2.5"
      >
        ETAP
      </text>
    </svg>
  );
}

/* ============================================================
   Book spread — wood frame + recto + verso
   ============================================================ */

function BookSpread({
  sigil,
  sectionName,
  signature,
  title,
  summary,
  paragraphs,
  queueReason,
  compact,
  onProceed,
}: {
  sigil: string;
  sectionName: string;
  signature: string;
  title: string;
  summary: string;
  paragraphs: string[];
  queueReason: string;
  compact: boolean;
  onProceed: () => void;
}) {
  /* split paragraphs across pages: ~40% on recto, rest on verso */
  const split = Math.max(1, Math.ceil(paragraphs.length * 0.4));
  const rectoBody = paragraphs.slice(0, split);
  const versoBody = paragraphs.slice(split);

  return (
    <div style={{ padding: "0 24px 28px" }}>
      <div
        className="relative"
        style={{
          background: "#2a190f",
          padding: 14,
          boxShadow:
            "0 36px 80px -32px rgba(0,0,0,0.85), 0 12px 24px rgba(0,0,0,0.45)",
          borderRadius: 2,
        }}
      >
        <div
          className="relative"
          style={{
            border: "0.5px solid rgba(184,146,77,0.35)",
            padding: 1,
          }}
        >
          <div className="flex flex-col md:flex-row relative">
            <RectoPage
              sigil={sigil}
              sectionName={sectionName}
              signature={signature}
              title={title}
              intro={summary}
              paragraphs={rectoBody}
              queueReason={queueReason}
              compact={compact}
            />
            <Gutter />
            <VersoPage
              signature={signature}
              paragraphs={versoBody}
              onProceed={onProceed}
            />
          </div>
        </div>

        {/* corner ornaments */}
        {[
          { top: 4, left: 4, transform: "" },
          { top: 4, right: 4, transform: "translate(10 0) scale(-1 1)" },
          { bottom: 4, left: 4, transform: "translate(0 10) scale(1 -1)" },
          {
            bottom: 4,
            right: 4,
            transform: "translate(10 10) scale(-1 -1)",
          },
        ].map((c, i) => {
          const { transform, ...pos } = c;
          return (
            <div
              key={i}
              className="absolute"
              style={{ ...pos, width: 10, height: 10 }}
              aria-hidden
            >
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path
                  d="M0 0 L4 0 M0 0 L0 4"
                  stroke="var(--c-gold-500)"
                  strokeWidth="0.6"
                  opacity="0.7"
                  transform={transform}
                />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Gutter() {
  return (
    <div
      className="relative hidden md:block"
      style={{ width: 0, flexShrink: 0 }}
      aria-hidden
    >
      <div
        className="absolute"
        style={{
          top: 0,
          bottom: 0,
          left: -36,
          width: 72,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(20,10,5,0.10) 35%, rgba(20,10,5,0.32) 50%, rgba(20,10,5,0.10) 65%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 4,
        }}
      />
      <div
        className="absolute"
        style={{
          top: 18,
          bottom: 18,
          left: -0.5,
          width: 1,
          background: "rgba(20,10,5,0.25)",
          zIndex: 5,
        }}
      />
    </div>
  );
}

function RunningHead({
  side,
  label,
  pageNum,
  signature,
}: {
  side: "recto" | "verso";
  label: string;
  pageNum: string;
  signature: string;
}) {
  const left =
    side === "recto" ? (
      <span
        className="eyebrow"
        style={{ color: "rgba(27,17,8,0.55)", fontSize: 9 }}
      >
        {signature}
      </span>
    ) : (
      <span
        className="font-display italic"
        style={{ fontSize: 16, color: "rgba(27,17,8,0.5)" }}
      >
        — {pageNum} —
      </span>
    );
  const right =
    side === "recto" ? (
      <span
        className="font-display italic"
        style={{ fontSize: 16, color: "rgba(27,17,8,0.5)" }}
      >
        — {pageNum} —
      </span>
    ) : (
      <span
        className="eyebrow"
        style={{ color: "rgba(27,17,8,0.55)", fontSize: 9 }}
      >
        {label}
      </span>
    );
  return (
    <div
      className="flex items-baseline justify-between"
      style={{
        borderBottom: "0.5px solid rgba(27,17,8,0.18)",
        paddingBottom: 8,
        marginBottom: 24,
      }}
    >
      {left}
      <span
        className="eyebrow"
        style={{ color: "rgba(27,17,8,0.45)", fontSize: 9 }}
      >
        {side === "recto" ? label : signature}
      </span>
      {right}
    </div>
  );
}

function Asterism() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ gap: 14, margin: "6px 0" }}
      aria-hidden
    >
      <span
        style={{
          width: 28,
          height: 0.5,
          background: "rgba(27,17,8,0.20)",
        }}
      />
      <span
        className="font-display italic"
        style={{
          fontSize: 16,
          color: "rgba(122,74,31,0.55)",
          letterSpacing: 4,
        }}
      >
        ⁂
      </span>
      <span
        style={{
          width: 28,
          height: 0.5,
          background: "rgba(27,17,8,0.20)",
        }}
      />
    </div>
  );
}

function RectoPage({
  sigil,
  sectionName,
  signature,
  title,
  intro,
  paragraphs,
  queueReason,
  compact,
}: {
  sigil: string;
  sectionName: string;
  signature: string;
  title: string;
  intro: string;
  paragraphs: string[];
  queueReason: string;
  compact: boolean;
}) {
  const firstChar = intro?.[0] ?? "—";
  const rest = intro?.slice(1) ?? "";

  return (
    <div
      className="tex-paper tex-noise-fine relative flex-1"
      style={{
        padding: "32px 36px 36px 40px",
        minHeight: 640,
        boxShadow: "inset -12px 0 24px -12px rgba(40,20,8,0.4)",
      }}
    >
      <div className="relative" style={{ zIndex: 2 }}>
        <RunningHead
          side="recto"
          label="Etap I · Teoria"
          pageNum="I"
          signature={signature}
        />

        <div
          className="flex items-baseline"
          style={{ gap: 14, marginBottom: 16 }}
        >
          <span
            className="font-display italic"
            style={{
              fontSize: 52,
              color: "var(--c-cognac)",
              fontWeight: 500,
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
            }}
          >
            {sigil}
          </span>
          <div style={{ flex: 1 }}>
            <div
              className="eyebrow"
              style={{ color: "rgba(122,74,31,0.7)", fontSize: 9 }}
            >
              {sectionName} · Teoria
            </div>
            <div
              className="font-display italic"
              style={{
                fontSize: 26,
                color: "#1B1108",
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: "-0.015em",
                marginTop: 4,
              }}
            >
              {title}
            </div>
          </div>
        </div>

        <div
          className="rule-gold"
          style={{ height: 0.5, marginBottom: 22, opacity: 0.7 }}
        />

        {intro && (
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontStyle: "italic",
              fontSize: 20,
              lineHeight: 1.45,
              color: "#1B1108",
              fontWeight: 400,
              letterSpacing: "-0.005em",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontStyle: "italic",
                fontWeight: 600,
                fontSize: "3.4em",
                lineHeight: 0.82,
                color: "var(--c-cognac)",
                float: "left",
                margin: "0.06em 0.08em 0 -2px",
              }}
            >
              {firstChar}
            </span>
            {rest}
          </p>
        )}

        <div
          style={{
            border: "0.5px solid rgba(122,74,31,0.22)",
            background:
              "linear-gradient(180deg, rgba(122,74,31,0.065), rgba(122,74,31,0.025))",
            padding: "12px 14px",
            marginBottom: 20,
          }}
        >
          <div
            className="eyebrow"
            style={{
              color: "rgba(122,74,31,0.74)",
              fontSize: 8.5,
              marginBottom: 5,
            }}
          >
            {compact ? "Dlaczego tylko minimum" : "Dlaczego ten temat teraz"}
          </div>
          <p
            className="caption"
            style={{
              color: "rgba(27,17,8,0.72)",
              lineHeight: 1.55,
              fontSize: 12.5,
            }}
          >
            {compact
              ? "Dzisiaj wystarczy mały ślad: trzy pytania, bez rozkręcania całej machiny. "
              : ""}
            {queueReason}
          </p>
        </div>

        {paragraphs.length > 0 && (
          <>
            <Asterism />
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="body-prose"
                style={{
                  color: "rgba(27,17,8,0.88)",
                  fontSize: 14.5,
                  lineHeight: 1.72,
                  marginTop: i === 0 ? 14 : 0,
                  marginBottom: 18,
                  textAlign: "justify",
                  hyphens: "auto",
                }}
              >
                {p}
              </p>
            ))}
          </>
        )}

        {/* marginal star */}
        <div
          className="absolute hidden md:block"
          style={{ top: 200, right: -22, opacity: 0.55 }}
          aria-hidden
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path
              d="M7 1 L8 6 L13 7 L8 8 L7 13 L6 8 L1 7 L6 6 Z"
              fill="none"
              stroke="var(--c-cognac)"
              strokeWidth="0.6"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function VersoPage({
  signature,
  paragraphs,
  onProceed,
}: {
  signature: string;
  paragraphs: string[];
  onProceed: () => void;
}) {
  return (
    <div
      className="tex-paper tex-noise-fine relative flex-1"
      style={{
        padding: "32px 40px 36px 36px",
        minHeight: 640,
        boxShadow: "inset 12px 0 24px -12px rgba(40,20,8,0.4)",
      }}
    >
      <div className="relative" style={{ zIndex: 2 }}>
        <RunningHead
          side="verso"
          label="Etap I · Teoria"
          pageNum="II"
          signature={signature}
        />

        {paragraphs.length === 0 ? (
          <p
            className="body-prose"
            style={{
              color: "rgba(27,17,8,0.6)",
              fontStyle: "italic",
              fontSize: 15,
              lineHeight: 1.65,
            }}
          >
            (dalszy ciąg teorii pojawi się, gdy temat dostanie więcej tekstu)
          </p>
        ) : (
          paragraphs.map((p, i) => (
            <p
              key={i}
              className="body-prose"
              style={{
                color: "rgba(27,17,8,0.88)",
                fontSize: 14.5,
                lineHeight: 1.72,
                marginBottom: 16,
                textAlign: "justify",
                hyphens: "auto",
              }}
            >
              {p}
            </p>
          ))
        )}

        <div
          className="flex items-center justify-end flex-wrap"
          style={{
            marginTop: 26,
            paddingTop: 18,
            borderTop: "0.5px dashed rgba(27,17,8,0.22)",
            gap: 22,
          }}
        >
          <SealCTA onClick={onProceed} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Seal CTA — engraved plate + dimensional wax seal "II"
   ============================================================ */

function SealCTA({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex items-center" style={{ gap: 18 }}>
      <span
        className="signature"
        style={{
          color: "rgba(27,17,8,0.55)",
          fontSize: 11,
          fontStyle: "italic",
        }}
      >
        Gotowa? Dziesięć pytań czeka.
      </span>

      <button
        onClick={onClick}
        className="seal-cta relative flex items-stretch"
        style={{
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          font: "inherit",
          transition: "transform .18s ease",
        }}
      >
        <span
          className="relative flex items-center seal-cta-plate"
          style={{
            padding: "12px 24px",
            background:
              "linear-gradient(180deg, #221610 0%, #1a0f08 100%)",
            boxShadow:
              "0 5px 14px -6px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,230,180,0.14), inset 0 -1px 0 rgba(0,0,0,0.5)",
            transition: "box-shadow .18s ease",
          }}
        >
          <span
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              inset: 4,
              border: "0.5px solid rgba(184,146,77,0.55)",
            }}
          />
          <span
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              inset: 6,
              border: "0.5px solid rgba(184,146,77,0.22)",
            }}
          />
          <span
            className="relative font-display italic"
            style={{
              fontSize: 18,
              lineHeight: 1,
              fontWeight: 500,
              color: "var(--c-paper-100)",
              letterSpacing: "-0.01em",
              padding: "0 6px",
            }}
          >
            Do testu
          </span>
        </span>

        <span
          className="relative flex items-center justify-center seal-cta-wax"
          style={{
            width: 56,
            height: 56,
            marginLeft: -14,
            alignSelf: "center",
            filter:
              "drop-shadow(0 4px 8px rgba(0,0,0,0.5)) drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
            transition: "filter .18s ease",
          }}
          aria-hidden
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 58 58"
            className="absolute"
            style={{ inset: 0 }}
          >
            <defs>
              <radialGradient id="waxBodyCTA" cx="38%" cy="32%" r="70%">
                <stop offset="0%" stopColor="#e25a44" />
                <stop offset="35%" stopColor="#b53324" />
                <stop offset="75%" stopColor="#6a1612" />
                <stop offset="100%" stopColor="#360808" />
              </radialGradient>
              <radialGradient id="waxImpressCTA" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                <stop offset="78%" stopColor="rgba(0,0,0,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
              </radialGradient>
            </defs>
            {(() => {
              const cx = 29;
              const cy = 29;
              const lobes = 18;
              const rOuter = 27;
              const rInner = 25.2;
              const pts: Array<[number, number]> = [];
              for (let i = 0; i < lobes * 2; i++) {
                const a = (i / (lobes * 2)) * Math.PI * 2 - Math.PI / 2;
                const j = (((i * 53) % 7) / 7) * 0.6;
                const r =
                  i % 2 === 0 ? rOuter + j * 0.2 : rInner - j * 0.3;
                pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
              }
              let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
              for (let i = 0; i < pts.length; i++) {
                const next = pts[(i + 1) % pts.length];
                const mid: [number, number] = [
                  (pts[i][0] + next[0]) / 2,
                  (pts[i][1] + next[1]) / 2,
                ];
                d += ` Q ${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)}, ${mid[0].toFixed(2)} ${mid[1].toFixed(2)}`;
              }
              d += " Z";
              return (
                <>
                  <path d={d} fill="url(#waxBodyCTA)" />
                  <path d={d} fill="url(#waxImpressCTA)" />
                  <circle
                    cx={cx}
                    cy={cy}
                    r="19"
                    fill="none"
                    stroke="rgba(0,0,0,0.38)"
                    strokeWidth="0.6"
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r="19.6"
                    fill="none"
                    stroke="rgba(255,180,150,0.18)"
                    strokeWidth="0.4"
                  />
                  {Array.from({ length: 22 }).map((_, i) => {
                    const a = (i / 22) * Math.PI * 2 - Math.PI / 2;
                    const r = 21.2;
                    const x = cx + Math.cos(a) * r;
                    const y = cy + Math.sin(a) * r;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="0.7"
                        fill="rgba(0,0,0,0.45)"
                      />
                    );
                  })}
                  <ellipse
                    cx="22"
                    cy="18"
                    rx="9"
                    ry="4"
                    fill="rgba(255,220,200,0.32)"
                    transform="rotate(-28 22 18)"
                  />
                  <ellipse
                    cx="19"
                    cy="16"
                    rx="4"
                    ry="1.5"
                    fill="rgba(255,235,215,0.45)"
                    transform="rotate(-28 19 16)"
                  />
                </>
              );
            })()}
          </svg>
          <span
            className="relative font-display italic"
            style={{
              fontSize: 17,
              fontWeight: 700,
              lineHeight: 1,
              color: "rgba(60,10,8,0.78)",
              textShadow:
                "0 1px 0 rgba(255,180,150,0.30), 0 -0.5px 0 rgba(0,0,0,0.4)",
              letterSpacing: "0.02em",
              marginTop: 1,
            }}
          >
            II
          </span>
        </span>
      </button>
    </div>
  );
}

/* ============================================================
   Reading toolbar — 4 tool chips
   ============================================================ */

function ReadingToolbar() {
  const tools = [
    { glyph: "A", label: "Rozmiar tekstu", hint: "14 · 15 · 17" },
    { glyph: "✎", label: "Zaznacz fragment", hint: "do Erraty" },
    { glyph: "⌖", label: "Skup widok", hint: "tryb cichy" },
    { glyph: "∿", label: "Czytaj na głos", hint: "3:00 audio" },
  ];
  return (
    <div style={{ padding: "0 24px 28px" }}>
      <div
        className="flex items-center flex-wrap gap-4"
        style={{
          background: "rgba(27,17,8,0.45)",
          border: "0.5px solid rgba(184,146,77,0.22)",
          padding: "14px 22px",
        }}
      >
        <div className="flex items-baseline" style={{ gap: 10 }}>
          <span
            className="eyebrow"
            style={{ color: "var(--c-gold-400)", fontSize: 10 }}
          >
            Narzędzia czytelnika
          </span>
          <span
            className="signature"
            style={{
              color: "var(--c-paper-300)",
              opacity: 0.5,
              fontSize: 10,
            }}
          >
            cztery uchwyty
          </span>
        </div>
        <div
          className="flex items-center flex-wrap"
          style={{ gap: 22, marginLeft: "auto" }}
        >
          {tools.map((t) => (
            <div
              key={t.label}
              className="flex items-center"
              style={{ gap: 10 }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "rgba(184,146,77,0.10)",
                  border: "0.5px solid rgba(184,146,77,0.30)",
                  color: "var(--c-gold-300)",
                  fontFamily: "Cormorant Garamond, serif",
                  fontStyle: "italic",
                  fontSize: 13,
                  fontWeight: 500,
                  lineHeight: 1,
                }}
                aria-hidden
              >
                {t.glyph}
              </div>
              <div>
                <div
                  className="eyebrow"
                  style={{
                    color: "var(--c-paper-100)",
                    fontSize: 9.5,
                  }}
                >
                  {t.label}
                </div>
                <div
                  className="signature"
                  style={{
                    color: "var(--c-paper-300)",
                    opacity: 0.55,
                    fontSize: 9.5,
                  }}
                >
                  {t.hint}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   On-deck strip — next two themes in queue
   ============================================================ */

function OnDeckStrip({ items }: { items: OnDeckItem[] }) {
  return (
    <div style={{ padding: "0 24px 56px" }}>
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
          ✦ W kolejce dnia
        </span>
        <div
          style={{
            flex: 1,
            minWidth: 20,
            height: 0.5,
            background: "rgba(184,146,77,0.22)",
          }}
        />
        <span
          className="signature"
          style={{
            color: "var(--c-paper-300)",
            opacity: 0.5,
            fontSize: 11,
          }}
        >
          Po teście · {items.length === 1 ? "kolejna pozycja" : "kolejne pozycje"}
        </span>
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ gap: 18 }}
      >
        {items.slice(0, 2).map((u, i) => {
          const sigil = VAULT_SIGIL[u.vaultSlug]?.sigil ?? "·";
          const roman = ["II", "III"][i] ?? `${i + 2}`;
          return (
            <Link
              key={u.topicId}
              href={`/study/session/new?topic=${u.topicId}`}
              className="flex items-center"
              style={{
                gap: 18,
                padding: "16px 20px",
                background: "rgba(27,17,8,0.40)",
                border: "0.5px solid rgba(184,146,77,0.18)",
                textDecoration: "none",
              }}
            >
              <span
                className="font-display italic"
                style={{
                  fontSize: 24,
                  color: "var(--c-gold-400)",
                  fontWeight: 500,
                  opacity: 0.6,
                  lineHeight: 1,
                }}
              >
                {roman}
              </span>
              <div
                className="flex items-center justify-center"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "rgba(184,146,77,0.08)",
                  border: "0.5px solid rgba(184,146,77,0.25)",
                  flexShrink: 0,
                }}
              >
                <span
                  className="font-display italic"
                  style={{
                    fontSize: 15,
                    color: "var(--c-gold-300)",
                    fontWeight: 500,
                    lineHeight: 1,
                  }}
                  aria-hidden
                >
                  {sigil}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  className="eyebrow"
                  style={{
                    color: "var(--c-paper-300)",
                    opacity: 0.6,
                    fontSize: 9,
                    marginBottom: 4,
                  }}
                >
                  {u.vaultName}
                </div>
                <div
                  className="font-display italic"
                  style={{
                    fontSize: 18,
                    color: "var(--c-paper-100)",
                    fontWeight: 500,
                    lineHeight: 1.15,
                    letterSpacing: "-0.005em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {u.title}
                </div>
              </div>
              <span
                className="signature"
                style={{
                  color: "var(--c-paper-300)",
                  opacity: 0.4,
                  fontSize: 11,
                }}
              >
                →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
