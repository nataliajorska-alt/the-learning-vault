"use client";

import Link from "next/link";
import { useState } from "react";
import type { Question, Topic, Vault } from "@/lib/types";
import { WaxSeal } from "@/components/ui/WaxSeal";

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

/* ============================================================
   KOREKTA PHASE — session review (etap III).
   ============================================================ */

const ROMAN = ["I","II","III","IV","V","VI","VII","VIII","IX","X"];

const VAULT_SIGIL: Record<string, { sigil: string; roman: string }> = {
  es: { sigil: "ñ", roman: "§ I" },
  en: { sigil: "EN", roman: "§ II" },
  wine: { sigil: "☙", roman: "§ III" },
  art: { sigil: "✦", roman: "§ IV" },
  music: { sigil: "𝄞", roman: "§ V" },
  savoir: { sigil: "✧", roman: "§ VI" },
  phil: { sigil: "φ", roman: "§ VII" },
  hist: { sigil: "H", roman: "§ VIII" },
  econ: { sigil: "§", roman: "§ IX" },
  blackjack: { sigil: "♠", roman: "§ X" },
  avia: { sigil: "✈", roman: "§ XI" },
  excel: { sigil: "fx", roman: "§ XII" },
  sport: { sigil: "☘", roman: "§ XIII" },
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

function fmtTime(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export interface KorektaAttempt {
  questionId: string;
  correct: boolean;
  answer: string;
}

export interface OnDeckItem {
  topicId: string;
  title: string;
  vaultName: string;
  vaultSlug: string;
}

interface KorektaPhaseProps {
  topic: Topic;
  vault: Vault | null;
  questions: Question[];
  attempts: KorektaAttempt[];
  testElapsedSec: number;
  testBudgetSec: number;
  korektaElapsedSec: number;
  korektaBudgetSec: number;
  onDeck?: OnDeckItem[];
  receipt?: SessionReceipt;
  closeHref?: string;
  /** Kolejny numer domkniętej sesji — na lakową pieczęć „ZALICZONO". */
  sessionNumber?: number | null;
}

export interface SessionReceipt {
  attemptsDelta: number;
  correctDelta: number;
  xp: number;
  nextReview: string;
  status: string;
  correctStreak: number;
  errorsAdded: number;
  errorsReinforced: number;
  errorsRehabilitated: number;
  rehabProgress: number;
  syncIssueCount: number;
  pillar: string;
}

export function KorektaPhase({
  topic,
  vault,
  questions,
  attempts,
  testElapsedSec,
  testBudgetSec,
  korektaElapsedSec,
  korektaBudgetSec,
  onDeck = [],
  receipt,
  closeHref = "/",
  sessionNumber = null,
}: KorektaPhaseProps) {
  const sigInfo = vault ? VAULT_SIGIL[vault.slug] : null;
  const sigil = sigInfo?.sigil ?? vault?.name?.[0]?.toUpperCase() ?? "·";
  const sectionName = vault?.name ?? "Sekcja";
  const signature = vault
    ? `${vaultSig(vault.name)} · ${idSig(topic.id)}`
    : idSig(topic.id);

  /* Build per-question state list from attempts */
  const states = questions.map((q) => {
    const a = attempts.find((x) => x.questionId === q.id);
    if (!a) return { ok: false, attempted: false, q };
    return { ok: a.correct, attempted: true, q };
  });

  const correctCount = attempts.filter((a) => a.correct).length;
  const totalQ = questions.length;
  const wrongCount = Math.max(0, attempts.length - correctCount);
  const accuracy =
    attempts.length > 0
      ? Math.round((correctCount / attempts.length) * 100)
      : 0;

  const totalElapsed = testElapsedSec + korektaElapsedSec;
  const totalBudget = testBudgetSec + korektaBudgetSec + 3 * 60; // + teoria
  const dateStr = (() => {
    const d = new Date();
    const months = [
      "stycznia","lutego","marca","kwietnia","maja","czerwca",
      "lipca","sierpnia","września","października","listopada","grudnia",
    ];
    const weekdays = [
      "Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota",
    ];
    const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    return `${weekdays[d.getDay()]} · ${d.getDate()} ${months[d.getMonth()]} · godzina ${time}`;
  })();

  return (
    <div className="-mx-6 md:-mx-12 -mt-10 md:-mt-12 relative overflow-hidden">
      {/* atmosphere */}
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
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 12%, rgba(200,140,70,0.13), transparent 60%)",
          zIndex: 0,
        }}
      />
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
        <PageHeader
          sectionName={sectionName}
          signature={signature}
          title={topic.title}
          totalElapsed={totalElapsed}
          totalBudget={totalBudget}
          dateStr={dateStr}
        />

        <BookSpread
          sigil={sigil}
          sectionName={sectionName}
          signature={signature}
          states={states}
          correctCount={correctCount}
          totalQ={totalQ}
          wrongCount={wrongCount}
          accuracy={accuracy}
          testElapsedSec={testElapsedSec}
          testBudgetSec={testBudgetSec}
          korektaElapsedSec={korektaElapsedSec}
          korektaBudgetSec={korektaBudgetSec}
          receipt={receipt}
          closeHref={closeHref}
          sessionNumber={sessionNumber}
        />

        {onDeck.length > 0 && <OnDeckStrip items={onDeck} />}
      </div>
    </div>
  );
}

/* ============================================================
   Page header
   ============================================================ */

function PageHeader({
  sectionName,
  signature,
  title,
  totalElapsed,
  totalBudget,
  dateStr,
}: {
  sectionName: string;
  signature: string;
  title: string;
  totalElapsed: number;
  totalBudget: number;
  dateStr: string;
}) {
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
          ✦ Sesja zamknięta
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
          {dateStr}
        </span>
      </div>

      <div
        className="flex items-end justify-between flex-wrap"
        style={{ gap: 32 }}
      >
        <div style={{ flex: "1 1 540px", minWidth: 0, maxWidth: 880 }}>
          <div
            className="flex items-baseline flex-wrap"
            style={{ gap: 14, marginBottom: 14 }}
          >
            <span
              className="eyebrow"
              style={{
                color: "var(--c-gold-400)",
                fontSize: 10,
              }}
            >
              Etap III
            </span>
            <span style={{ color: "rgba(212,195,158,0.35)" }}>·</span>
            <span
              className="eyebrow"
              style={{
                color: "var(--c-paper-200)",
                opacity: 0.85,
              }}
            >
              Korekta
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
          <h1
            className="font-display italic"
            style={{
              fontSize: "clamp(40px, 6vw, 56px)",
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
              color: "var(--c-paper-100)",
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            {title}
          </h1>
          <div
            className="font-display italic"
            style={{
              fontSize: 18,
              color: "var(--c-paper-300)",
              opacity: 0.78,
              fontWeight: 400,
            }}
          >
            {sectionName}
          </div>
        </div>

        <div
          className="flex items-center"
          style={{ gap: 16, paddingBottom: 4 }}
        >
          <div style={{ textAlign: "right" }}>
            <div
              className="eyebrow"
              style={{
                color: "var(--c-gold-400)",
                fontSize: 9,
                marginBottom: 4,
              }}
            >
              Czas łączny
            </div>
            <div
              className="font-display italic"
              style={{
                fontSize: 30,
                color: "var(--c-paper-100)",
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: "-0.01em",
              }}
            >
              {fmtTime(totalElapsed)}
              <span
                className="signature"
                style={{
                  color: "var(--c-paper-300)",
                  opacity: 0.5,
                  fontSize: 12,
                  marginLeft: 8,
                }}
              >
                / {fmtTime(totalBudget)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Book spread
   ============================================================ */

interface SpreadProps {
  sigil: string;
  sectionName: string;
  signature: string;
  states: Array<{ ok: boolean; attempted: boolean; q: Question }>;
  correctCount: number;
  totalQ: number;
  wrongCount: number;
  accuracy: number;
  testElapsedSec: number;
  testBudgetSec: number;
  korektaElapsedSec: number;
  korektaBudgetSec: number;
  receipt?: SessionReceipt;
  closeHref: string;
  sessionNumber?: number | null;
}

function BookSpread(props: SpreadProps) {
  return (
    <div style={{ padding: "8px 24px 28px" }}>
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
            <PodsumowaniePage {...props} />
            <Gutter />
            <ErrataPage {...props} />
            <BookmarkRibbon />
          </div>
        </div>

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

function BookmarkRibbon() {
  return (
    <div
      aria-hidden
      className="absolute pointer-events-none hidden md:block"
      style={{
        top: 0,
        left: "50%",
        marginLeft: 18,
        width: 14,
        height: 96,
        zIndex: 6,
      }}
    >
      <svg
        width="14"
        height="96"
        viewBox="0 0 14 96"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="korRibbon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6a5018" />
            <stop offset="50%" stopColor="#c8a25c" />
            <stop offset="100%" stopColor="#5a4214" />
          </linearGradient>
          <linearGradient id="korRibbonShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,0,0,0.45)" />
            <stop offset="15%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
          </linearGradient>
        </defs>
        <path
          d="M 0 0 L 14 0 L 14 86 L 7 78 L 0 86 Z"
          fill="url(#korRibbon)"
        />
        <path
          d="M 0 0 L 14 0 L 14 86 L 7 78 L 0 86 Z"
          fill="url(#korRibbonShade)"
        />
        <path
          d="M 0 0 L 0 86"
          stroke="rgba(255,230,180,0.45)"
          strokeWidth="0.5"
        />
        <path
          d="M 14 0 L 14 86"
          stroke="rgba(0,0,0,0.5)"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}

/* ============================================================
   Left page — Podsumowanie
   ============================================================ */

function PodsumowaniePage({
  sigil,
  signature,
  states,
  correctCount,
  totalQ,
  wrongCount,
  accuracy,
  testElapsedSec,
  testBudgetSec,
  korektaElapsedSec,
  korektaBudgetSec,
  receipt,
  closeHref,
  sessionNumber,
}: SpreadProps) {
  const correctWord =
    correctCount === 1
      ? "jeden"
      : correctCount === 2
      ? "dwa"
      : correctCount === 3
      ? "trzy"
      : correctCount === 4
      ? "cztery"
      : correctCount === 5
      ? "pięć"
      : correctCount === 6
      ? "sześć"
      : correctCount === 7
      ? "siedem"
      : correctCount === 8
      ? "osiem"
      : String(correctCount);
  const totalWord =
    totalQ === 1
      ? "jednego"
      : totalQ === 2
      ? "dwóch"
      : totalQ === 3
      ? "trzech"
      : totalQ === 4
      ? "czterech"
      : totalQ === 5
      ? "pięciu"
      : totalQ === 6
      ? "sześciu"
      : totalQ === 7
      ? "siedmiu"
      : totalQ === 8
      ? "ośmiu"
      : String(totalQ);
  const summary = `Korekta · ${correctWord} z ${totalWord}`;

  const errorWord =
    wrongCount === 0
      ? "Bez błędów."
      : wrongCount === 1
      ? "Jeden błąd poszedł"
      : wrongCount < 5
      ? `${wrongCount} błędy poszły`
      : `${wrongCount} błędów poszło`;
  const tail =
    wrongCount === 0
      ? "Temat wraca później, na lżejszych warunkach."
      : "do Error Vault. Wrócą same — krócej, częściej, do skutku.";

  return (
    <div
      className="tex-paper tex-noise-fine relative flex-1"
      style={{
        padding: "32px 36px 32px 40px",
        minHeight: 720,
        boxShadow: "inset -12px 0 24px -12px rgba(40,20,8,0.4)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="relative flex-1 flex flex-col"
        style={{ zIndex: 2 }}
      >
        <div
          className="flex items-baseline justify-between"
          style={{
            borderBottom: "0.5px solid rgba(27,17,8,0.18)",
            paddingBottom: 8,
            marginBottom: 24,
          }}
        >
          <span
            className="eyebrow"
            style={{ color: "rgba(27,17,8,0.55)", fontSize: 9 }}
          >
            {signature}
          </span>
          <span
            className="eyebrow"
            style={{ color: "rgba(27,17,8,0.45)", fontSize: 9 }}
          >
            Etap III · Korekta
          </span>
          <span
            className="font-display italic"
            style={{ fontSize: 14, color: "rgba(27,17,8,0.5)" }}
          >
            — I —
          </span>
        </div>

        <div
          className="flex items-baseline"
          style={{ gap: 14, marginBottom: 18 }}
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
              style={{ color: "rgba(122,74,31,0.75)", fontSize: 9 }}
            >
              Podsumowanie sesji
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
              {summary}
            </div>
          </div>
        </div>

        <div
          className="rule-gold"
          style={{ height: 0.5, marginBottom: 22, opacity: 0.7 }}
        />

        {/* Tally row */}
        <div style={{ marginBottom: 8 }}>
          <div
            className="flex items-baseline flex-wrap"
            style={{ gap: 10, marginBottom: 10 }}
          >
            <span
              className="eyebrow"
              style={{
                color: "rgba(27,17,8,0.62)",
                fontSize: 9,
              }}
            >
              Tally
            </span>
            <div
              style={{
                flex: 1,
                minWidth: 30,
                height: 0.5,
                background: "rgba(27,17,8,0.20)",
              }}
            />
            <span
              className="signature"
              style={{
                color: "rgba(27,17,8,0.45)",
                fontSize: 10,
              }}
            >
              {totalQ === 1 ? "1 pytanie" : `${totalQ} pytań · po kolei`}
            </span>
          </div>
          <TallyRow states={states} />
        </div>

        {/* Score block */}
        <div style={{ marginTop: 8, marginBottom: 16 }}>
          <div
            className="flex items-baseline flex-wrap"
            style={{ gap: 16 }}
          >
            <span
              className="font-display italic"
              style={{
                fontSize: 120,
                color: "#1B1108",
                fontWeight: 500,
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
              }}
            >
              {correctCount}
            </span>
            <span
              className="font-display italic"
              style={{
                fontSize: 72,
                color: "rgba(27,17,8,0.32)",
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              / {totalQ}
            </span>
            <div
              style={{
                flex: 1,
                minWidth: 110,
                paddingLeft: 14,
                paddingBottom: 12,
              }}
            >
              <div
                className="eyebrow"
                style={{
                  color: "rgba(27,17,8,0.55)",
                  fontSize: 9,
                  marginBottom: 6,
                }}
              >
                Trafność
              </div>
              <div
                className="font-display italic"
                style={{
                  fontSize: 28,
                  color: "var(--c-cognac)",
                  fontWeight: 500,
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                }}
              >
                {accuracy}
                <span
                  style={{
                    fontSize: 16,
                    opacity: 0.6,
                    marginLeft: 2,
                  }}
                >
                  %
                </span>
              </div>
            </div>
          </div>
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontStyle: "italic",
              fontSize: 17,
              color: "rgba(27,17,8,0.78)",
              fontWeight: 400,
              lineHeight: 1.45,
              marginTop: 4,
              maxWidth: 460,
            }}
          >
            {errorWord} {tail}
          </p>
        </div>

        {receipt && <ReceiptBox receipt={receipt} />}

        <div
          className="rule-gold"
          style={{
            height: 0.5,
            marginTop: 4,
            marginBottom: 16,
            opacity: 0.45,
          }}
        />

        {/* Ledger */}
        <div style={{ marginBottom: 8 }}>
          <div
            className="flex items-baseline"
            style={{ gap: 10, marginBottom: 6 }}
          >
            <span
              className="eyebrow"
              style={{
                color: "rgba(27,17,8,0.62)",
                fontSize: 9,
              }}
            >
              Zegar
            </span>
            <div
              style={{
                flex: 1,
                height: 0.5,
                background: "rgba(27,17,8,0.16)",
              }}
            />
          </div>
          <LedgerRow
            label="Test"
            value={fmtTime(testElapsedSec)}
            sub={`/ ${fmtTime(testBudgetSec)}`}
          />
          <LedgerRow
            label="Korekta"
            value={fmtTime(korektaElapsedSec)}
            sub={`/ ${fmtTime(korektaBudgetSec)}`}
          />
          <LedgerRow label="Sygnatura" value={signature} />
          <LedgerRow
            label="Do Erraty"
            value={String(wrongCount)}
            sub={wrongCount === 1 ? "wpis" : "wpisy"}
          />
        </div>

        <div style={{ flex: 1, minHeight: 16 }} />

        {/* Lakowa pieczęć — rytuał domknięcia sesji */}
        <ClosingSeal sessionNumber={sessionNumber ?? null} />

        {/* CTA */}
        <div
          className="flex items-center justify-between flex-wrap"
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: "0.5px dashed rgba(27,17,8,0.24)",
            gap: 12,
          }}
        >
          <span
            className="signature"
            style={{
              color: "rgba(27,17,8,0.55)",
              fontSize: 11,
              fontStyle: "italic",
              maxWidth: 220,
              lineHeight: 1.5,
            }}
          >
            Wystarczy na dziś. Wracaj jutro.
          </span>
          <CloseBookCTA href={closeHref} />
        </div>

        <div
          className="flex items-center justify-center"
          style={{ marginTop: 14 }}
        >
          <span
            className="font-display italic"
            style={{ fontSize: 13, color: "rgba(27,17,8,0.4)" }}
          >
            — Finis —
          </span>
        </div>
      </div>
    </div>
  );
}

function ClosingSeal({ sessionNumber }: { sessionNumber: number | null }) {
  const now = new Date();
  const months = [
    "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
    "lipca", "sierpnia", "września", "października", "listopada", "grudnia",
  ];
  const dayLabel = `${now.getDate()} ${months[now.getMonth()]}`;
  const sessionLabel =
    sessionNumber && sessionNumber > 0
      ? `Sesja ${toRoman(sessionNumber)} · ${dayLabel}`
      : dayLabel;

  return (
    <div
      className="flex items-center justify-center"
      style={{ gap: 18, marginTop: 8, marginBottom: 4 }}
    >
      <div className="seal-press shrink-0">
        <WaxSeal size={66} label="LV" tone="oxblood" rotate={-6} />
      </div>
      <div className="seal-engrave">
        <div
          className="font-display"
          style={{
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: "var(--c-ink2)",
            lineHeight: 1,
          }}
        >
          ZALICZONO
        </div>
        <div
          className="signature"
          style={{
            color: "rgba(27,17,8,0.55)",
            fontSize: 11,
            letterSpacing: "0.12em",
            marginTop: 6,
            textTransform: "uppercase",
          }}
        >
          {sessionLabel}
        </div>
      </div>
    </div>
  );
}

function ReceiptBox({ receipt }: { receipt: SessionReceipt }) {
  const errataDelta =
    receipt.errorsAdded + receipt.errorsReinforced + receipt.errorsRehabilitated;
  const rows = [
    {
      label: "Postęp",
      value: `+${receipt.correctDelta}/${receipt.attemptsDelta}`,
      sub: "trafień w tym temacie",
    },
    {
      label: "Następny wpis",
      value: receipt.nextReview,
      sub: `status: ${receipt.status}`,
    },
    {
      label: "Seria",
      value: String(receipt.correctStreak),
      sub: "poprawnych kroków",
    },
    {
      label: "XP",
      value: `+${receipt.xp}`,
      sub: `→ ${receipt.pillar}`,
    },
  ];

  return (
    <div
      style={{
        border: "0.5px solid rgba(122,74,31,0.24)",
        background:
          "linear-gradient(180deg, rgba(122,74,31,0.06), rgba(122,74,31,0.025))",
        padding: "12px 14px 10px",
        marginBottom: 18,
      }}
    >
      <div
        className="eyebrow"
        style={{ color: "rgba(122,74,31,0.72)", fontSize: 8.5, marginBottom: 8 }}
      >
        Rachunek sesji
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-baseline"
            style={{ gap: 10 }}
          >
            <span
              className="signature"
              style={{ color: "rgba(27,17,8,0.52)", minWidth: 82, fontSize: 10 }}
            >
              {r.label}
            </span>
            <span
              className="font-display italic"
              style={{ color: "#1B1108", fontSize: 17, lineHeight: 1 }}
            >
              {r.value}
            </span>
            <span
              className="caption"
              style={{ color: "rgba(27,17,8,0.52)", fontSize: 11 }}
            >
              {r.sub}
            </span>
          </div>
        ))}
      </div>
      {receipt.errorsRehabilitated > 0 && (
        <div
          className="flex items-center justify-center"
          style={{ marginTop: 16, marginBottom: 4 }}
        >
          <span className="rehab-stamp">
            <span className="rehab-stamp-top">Errata · §</span>
            <span className="rehab-stamp-main">Rehabilitowane</span>
            {receipt.errorsRehabilitated > 1 && (
              <span className="rehab-stamp-top" style={{ marginTop: 1 }}>
                × {receipt.errorsRehabilitated}
              </span>
            )}
          </span>
        </div>
      )}
      {(errataDelta > 0 || receipt.syncIssueCount > 0) && (
        <p
          className="caption"
          style={{
            color: receipt.syncIssueCount > 0 ? "var(--c-ink2)" : "rgba(27,17,8,0.62)",
            lineHeight: 1.5,
            marginTop: 9,
          }}
        >
          {errataDelta > 0 &&
            `${receipt.errorsAdded} nowych wpisów, ${receipt.errorsReinforced} wzmocnionych, ${receipt.errorsRehabilitated} zrehabilitowanych.`}
          {receipt.syncIssueCount > 0 &&
            ` ${receipt.syncIssueCount} zapisów wymaga odświeżenia po odzyskaniu sieci.`}
        </p>
      )}
    </div>
  );
}

function TallyRow({
  states,
}: {
  states: Array<{ ok: boolean; attempted: boolean }>;
}) {
  return (
    <div
      className="flex items-stretch flex-wrap"
      style={{ gap: 6, marginBottom: 16 }}
    >
      {states.map((e, i) => {
        const okColor = "rgba(31,58,38,0.10)";
        const okBorder = "rgba(31,58,38,0.45)";
        const noColor = "rgba(139,46,31,0.10)";
        const noBorder = "rgba(139,46,31,0.45)";
        const skipColor = "rgba(184,146,77,0.05)";
        const skipBorder = "rgba(184,146,77,0.28)";
        const bg = !e.attempted
          ? skipColor
          : e.ok
          ? okColor
          : noColor;
        const border = !e.attempted
          ? skipBorder
          : e.ok
          ? okBorder
          : noBorder;
        return (
          <div
            key={i}
            className="relative flex items-center justify-center"
            style={{
              flex: "1 1 36px",
              minWidth: 36,
              height: 56,
              background: bg,
              border: `0.5px solid ${border}`,
            }}
            aria-label={
              !e.attempted
                ? "bez próby"
                : e.ok
                ? "trafiona"
                : "chybiona"
            }
          >
            <span
              className="signature absolute"
              style={{
                top: 4,
                left: 5,
                fontSize: 9,
                color: !e.attempted
                  ? "rgba(184,146,77,0.6)"
                  : e.ok
                  ? "rgba(31,58,38,0.55)"
                  : "rgba(139,46,31,0.55)",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className="font-display italic"
              style={{
                fontSize: 24,
                fontWeight: 700,
                lineHeight: 1,
                color: !e.attempted
                  ? "rgba(184,146,77,0.7)"
                  : e.ok
                  ? "#1f3a26"
                  : "var(--c-ink2)",
              }}
              aria-hidden
            >
              {!e.attempted ? "·" : e.ok ? "✓" : "✗"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function LedgerRow({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div
      className="flex items-baseline"
      style={{ gap: 8, padding: "6px 0" }}
    >
      <span
        className="eyebrow"
        style={{
          color: "rgba(27,17,8,0.62)",
          fontSize: 9.5,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 1,
          marginBottom: 4,
          backgroundImage:
            "radial-gradient(circle, rgba(27,17,8,0.35) 0.6px, transparent 1px)",
          backgroundSize: "5px 1px",
          backgroundPosition: "bottom",
          backgroundRepeat: "repeat-x",
        }}
      />
      <span
        className="font-display italic"
        style={{
          fontSize: 18,
          color: "#1B1108",
          fontWeight: 500,
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
      {sub && (
        <span
          className="signature"
          style={{
            color: "rgba(27,17,8,0.45)",
            fontSize: 10,
            whiteSpace: "nowrap",
          }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}

function CloseBookCTA({ href }: { href: string }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative inline-flex items-center"
      style={{
        gap: 14,
        padding: "13px 24px",
        background:
          "linear-gradient(180deg, #221610 0%, #1a0f08 100%)",
        cursor: "pointer",
        textDecoration: "none",
        boxShadow: hover
          ? "0 10px 26px -10px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,230,180,0.18), inset 0 -1px 0 rgba(0,0,0,0.5)"
          : "0 5px 14px -6px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,230,180,0.14), inset 0 -1px 0 rgba(0,0,0,0.5)",
        transform: hover ? "translateY(-1px)" : "translateY(0)",
        transition: "transform .18s ease, box-shadow .18s ease",
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
        style={{ inset: 6, border: "0.5px solid rgba(184,146,77,0.22)" }}
      />
      <span
        className="font-display italic"
        style={{
          fontSize: 18,
          color: "var(--c-paper-100)",
          fontWeight: 500,
          letterSpacing: "-0.005em",
          padding: "0 6px",
        }}
      >
        Zamknij księgę
      </span>
      <span
        style={{
          color: "var(--c-gold-300)",
          fontSize: 16,
          lineHeight: 1,
          padding: "0 4px 0 0",
        }}
        aria-hidden
      >
        ❦
      </span>
    </Link>
  );
}

/* ============================================================
   Right page — Errata list
   ============================================================ */

function ErrataPage({ states, signature, wrongCount }: SpreadProps) {
  return (
    <div
      className="tex-paper tex-noise-fine relative flex-1"
      style={{
        padding: "32px 40px 32px 36px",
        minHeight: 720,
        boxShadow: "inset 12px 0 24px -12px rgba(40,20,8,0.4)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="relative flex-1 flex flex-col"
        style={{ zIndex: 2 }}
      >
        <div
          className="flex items-baseline justify-between"
          style={{
            borderBottom: "0.5px solid rgba(27,17,8,0.18)",
            paddingBottom: 8,
            marginBottom: 22,
          }}
        >
          <span
            className="font-display italic"
            style={{ fontSize: 14, color: "rgba(27,17,8,0.5)" }}
          >
            — II —
          </span>
          <span
            className="eyebrow"
            style={{ color: "rgba(27,17,8,0.45)", fontSize: 9 }}
          >
            Errata · {states.length} {states.length === 1 ? "pozycja" : "pozycji"}
          </span>
          <span
            className="eyebrow"
            style={{ color: "rgba(27,17,8,0.55)", fontSize: 9 }}
          >
            {signature}
          </span>
        </div>

        <div
          className="flex items-baseline flex-wrap"
          style={{ gap: 12, marginBottom: 10 }}
        >
          <span
            className="eyebrow"
            style={{
              color: "var(--c-ink2)",
              fontSize: 11,
              letterSpacing: "0.28em",
            }}
          >
            Errata
          </span>
          <div
            style={{
              flex: 1,
              minWidth: 20,
              height: 0.5,
              background: "rgba(139,46,31,0.30)",
            }}
          />
          <span
            className="signature"
            style={{
              color: "rgba(27,17,8,0.45)",
              fontSize: 10,
              fontStyle: "italic",
            }}
          >
            {wrongCount === 0
              ? "czysto"
              : wrongCount === 1
              ? "jedna do powtórki"
              : wrongCount < 5
              ? `${wrongCount} do powtórki`
              : `${wrongCount} do powtórek`}
          </span>
        </div>

        <div style={{ flex: 1 }}>
          {states.map((e, i) => (
            <ErrataRow
              key={i}
              entry={e}
              idx={i}
              last={i === states.length - 1}
            />
          ))}
        </div>

        <div
          className="flex items-center justify-between flex-wrap"
          style={{
            marginTop: 18,
            paddingTop: 12,
            borderTop: "0.5px solid rgba(27,17,8,0.14)",
            gap: 12,
          }}
        >
          <span
            className="font-display italic"
            style={{ fontSize: 13, color: "rgba(27,17,8,0.45)" }}
          >
            — Indeks —
          </span>
          <span
            className="signature"
            style={{ color: "rgba(27,17,8,0.4)", fontSize: 10 }}
          >
            ❦
          </span>
          <Link
            href="/errors"
            className="signature"
            style={{
              color: "rgba(27,17,8,0.55)",
              fontSize: 11,
              textDecoration: "none",
            }}
          >
            do Error Vault →
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrataRow({
  entry,
  idx,
  last,
}: {
  entry: { ok: boolean; attempted: boolean; q: Question };
  idx: number;
  last: boolean;
}) {
  const okCol = "#1f3a26";
  const noCol = "var(--c-ink2)";
  const skipCol = "rgba(184,146,77,0.6)";
  const color = !entry.attempted
    ? skipCol
    : entry.ok
    ? okCol
    : noCol;
  const glyph = !entry.attempted ? "·" : entry.ok ? "✓" : "✗";
  return (
    <div
      style={{
        padding: "14px 0",
        borderBottom: last ? "none" : "0.5px dashed rgba(27,17,8,0.22)",
      }}
    >
      <div className="flex items-start" style={{ gap: 14 }}>
        <div
          className="flex flex-col items-center"
          style={{ width: 30, gap: 2, paddingTop: 2 }}
        >
          <span
            className="font-display italic"
            style={{
              fontSize: 20,
              fontWeight: 700,
              lineHeight: 1,
              color,
            }}
            aria-hidden
          >
            {glyph}
          </span>
          <span
            className="signature"
            style={{
              color: "rgba(27,17,8,0.40)",
              fontSize: 9,
            }}
          >
            {String(idx + 1).padStart(2, "0")}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: 14,
              fontWeight: 400,
              lineHeight: 1.55,
              color: "rgba(27,17,8,0.92)",
              margin: 0,
            }}
          >
            {entry.q.text}
          </p>
          {!entry.ok && entry.attempted && entry.q.explanation && (
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontStyle: "italic",
                fontSize: 13.5,
                lineHeight: 1.5,
                color: "rgba(27,17,8,0.62)",
                marginTop: 8,
                maxWidth: 520,
              }}
            >
              {entry.q.explanation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   On-deck strip — next due topics
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
          ✦ Następnie
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
          Kolejne pozycje · 15 minut
        </span>
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ gap: 18 }}
      >
        {items.slice(0, 2).map((u, i) => {
          const sigil = VAULT_SIGIL[u.vaultSlug]?.sigil ?? "·";
          const roman = ROMAN[i + 1] ?? `${i + 2}`;
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
