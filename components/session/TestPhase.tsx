"use client";

import { useEffect, useMemo, useState } from "react";
import type { Question, Topic, Vault } from "@/lib/types";
import { SpeakButton, langForVaultSlug } from "@/components/ui/SpeakButton";

/* ============================================================
   TEST PHASE — open-book question spread, librarian's notes,
   wax seal verdict, progress tabs, pocket watch.
   ============================================================ */

type QState = "pending" | "correct" | "wrong";

const ROMAN = [
  "I","II","III","IV","V","VI","VII","VIII","IX","X",
  "XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX",
];

function toRoman(n: number): string {
  return ROMAN[n - 1] ?? String(n);
}

/* vault visuals reused from teoria */
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

function typeLabel(t: Question["type"]): string {
  switch (t) {
    case "abc":
      return "zamknięte · A B C";
    case "spot_error":
      return "wskaż błąd";
    case "fill":
      return "uzupełnij";
    case "open":
      return "otwarte · własnymi słowami";
    case "translate":
      return "przetłumacz";
  }
}

export interface AttemptLike {
  questionId: string;
  correct: boolean;
  answer: string;
}

interface TestPhaseProps {
  topic: Topic;
  vault: Vault | null;
  questions: Question[];
  attempts: AttemptLike[];
  currentIdx: number;
  /* live state for the current question */
  revealed: boolean;
  lastCorrect: boolean | null;
  lastFeedback: string | null;
  /* input bindings */
  input: string;
  setInput: (v: string) => void;
  submitting: boolean;
  /* timer */
  elapsedSec: number;
  totalSec: number;
  compact?: boolean;
  /* actions */
  onSubmit: (answer: string | number) => void | Promise<void>;
  onAdvance: () => void;
}

export function TestPhase({
  topic,
  vault,
  questions,
  attempts,
  currentIdx,
  revealed,
  lastCorrect,
  lastFeedback,
  input,
  setInput,
  submitting,
  elapsedSec,
  totalSec,
  compact = false,
  onSubmit,
  onAdvance,
}: TestPhaseProps) {
  const sigInfo = vault ? VAULT_SIGIL[vault.slug] : null;
  const roman = sigInfo?.roman ?? "§";
  const sectionName = vault?.name ?? "Sekcja";
  const signature = vault
    ? `${vaultSig(vault.name)} · ${idSig(topic.id)}`
    : idSig(topic.id);

  const states: QState[] = useMemo(
    () =>
      questions.map((q) => {
        const att = attempts.find((a) => a.questionId === q.id);
        if (!att) return "pending";
        return att.correct ? "correct" : "wrong";
      }),
    [questions, attempts]
  );

  const q = questions[currentIdx];

  // Skróty klawiszowe: 1–9 / a–i wybierają opcję ABC; po odsłonięciu Enter lub
  // Spacja przechodzą dalej. Nie ruszamy, gdy ktoś pisze w polu tekstowym ani
  // gdy fokus stoi na natywnym przycisku (żeby nie zdublować akcji kliknięcia).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!q) return;
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName;
      const typing =
        tag === "INPUT" || tag === "TEXTAREA" || el?.isContentEditable === true;

      if (revealed) {
        if (
          (e.key === "Enter" || e.key === " ") &&
          !typing &&
          tag !== "BUTTON" &&
          tag !== "A"
        ) {
          e.preventDefault();
          onAdvance();
        }
        return;
      }

      const isMc = q.type === "abc" || q.type === "spot_error";
      if (!isMc || submitting || typing) return;
      const opts = q.options ?? [];
      let pick = -1;
      if (/^[1-9]$/.test(e.key)) pick = Number(e.key) - 1;
      else {
        const lower = e.key.toLowerCase();
        if (/^[a-i]$/.test(lower)) pick = lower.charCodeAt(0) - 97;
      }
      if (pick >= 0 && pick < opts.length) {
        e.preventDefault();
        onSubmit(pick);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, submitting, q, onSubmit, onAdvance]);

  if (!q) return null;

  const currentState: QState = revealed
    ? lastCorrect
      ? "correct"
      : "wrong"
    : "pending";

  const isLast = currentIdx >= questions.length - 1;
  const speakLang = langForVaultSlug(vault?.slug);

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
          opacity: 0.5,
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 8%, rgba(200,140,70,0.13), transparent 60%)",
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
        <TestHeader
          roman={roman}
          sectionName={sectionName}
          signature={signature}
          title={topic.title}
          elapsedSec={elapsedSec}
          totalSec={totalSec}
          compact={compact}
        />
        <ProgressTabs
          states={states}
          totalQuestions={questions.length}
          currentIdx={currentIdx}
        />
        <BookSpread
          q={q}
          idx={currentIdx}
          total={questions.length}
          states={states}
          state={currentState}
          lastFeedback={lastFeedback}
          signature={signature}
          input={input}
          setInput={setInput}
          submitting={submitting}
          onSubmit={onSubmit}
          onAdvance={onAdvance}
          isLast={isLast}
          attemptAnswer={
            attempts.find((a) => a.questionId === q.id)?.answer ?? null
          }
          speakLang={speakLang}
        />
      </div>
    </div>
  );
}

/* ============================================================
   Test header — eyebrow row, section + title, PocketWatch
   ============================================================ */

function TestHeader({
  roman,
  sectionName,
  signature,
  title,
  elapsedSec,
  totalSec,
  compact,
}: {
  roman: string;
  sectionName: string;
  signature: string;
  title: string;
  elapsedSec: number;
  totalSec: number;
  compact: boolean;
}) {
  return (
    <div style={{ padding: "32px 24px 8px" }}>
      <div
        className="flex items-center flex-wrap"
        style={{ gap: 16, marginBottom: 18 }}
      >
        <span
          className="eyebrow"
          style={{
            color: "var(--c-ink-on-dark)",
            letterSpacing: "0.28em",
          }}
        >
          ✦ Etap II · Test
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
            color: "var(--c-paper-300)",
            opacity: 0.55,
            fontSize: 11,
          }}
        >
          {compact ? "Minimum day · trzy pytania" : "Dziesięć minut · bez powrotu"}
        </span>
      </div>

      <div
        className="flex items-start justify-between flex-wrap"
        style={{ gap: 32 }}
      >
        <div style={{ flex: "1 1 540px", minWidth: 0, maxWidth: 860 }}>
          <div
            className="flex items-baseline flex-wrap"
            style={{ gap: 14, marginBottom: 12 }}
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
              fontSize: "clamp(36px, 5.5vw, 56px)",
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
              color: "var(--c-paper-100)",
              fontWeight: 600,
            }}
          >
            {title}
          </h1>
        </div>

        <div style={{ paddingTop: 4 }}>
          <PocketWatch elapsedSec={elapsedSec} totalSec={totalSec} />
        </div>
      </div>
    </div>
  );
}

function PocketWatch({
  elapsedSec,
  totalSec,
}: {
  elapsedSec: number;
  totalSec: number;
}) {
  const remaining = Math.max(0, totalSec - elapsedSec);
  const mm = Math.floor(remaining / 60);
  const ss = String(remaining % 60).padStart(2, "0");
  const ratio = Math.min(1, Math.max(0, elapsedSec / Math.max(1, totalSec)));
  const totalMin = Math.floor(totalSec / 60);
  const pct = Math.round((1 - ratio) * 100);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        minWidth: 160,
      }}
    >
      <span
        className="eyebrow"
        style={{
          color: "var(--c-ink-on-dark)",
          fontSize: 10,
          marginBottom: 6,
          letterSpacing: "0.28em",
        }}
      >
        Do końca testu
      </span>
      <span
        className="font-display italic"
        style={{
          fontSize: 60,
          color: "var(--c-paper-100)",
          fontWeight: 500,
          lineHeight: 0.95,
          letterSpacing: "-0.025em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {mm}:{ss}
      </span>
      <div
        style={{
          width: 160,
          height: 3,
          marginTop: 10,
          position: "relative",
          background: "rgba(184,146,77,0.18)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            height: "100%",
            width: `${(1 - ratio) * 100}%`,
            background:
              "linear-gradient(90deg, rgba(139,46,31,0.55), var(--c-gold-400))",
            boxShadow: "0 0 6px rgba(216,179,107,0.4)",
          }}
        />
      </div>
      <span
        className="signature"
        style={{
          color: "var(--c-paper-300)",
          opacity: 0.55,
          fontSize: 10.5,
          marginTop: 6,
        }}
      >
        z {totalMin}:00 · {pct}% przed nami
      </span>
    </div>
  );
}

/* ============================================================
   Progress tabs — N roman numeral tabs above the book
   ============================================================ */

function ProgressTabs({
  states,
  totalQuestions,
  currentIdx,
}: {
  states: QState[];
  totalQuestions: number;
  currentIdx: number;
}) {
  const trafione = states.filter((s) => s === "correct").length;
  const chybione = states.filter((s) => s === "wrong").length;
  const przedNami = totalQuestions - trafione - chybione;

  return (
    <div style={{ padding: "16px 24px 0" }}>
      <div
        className="flex items-baseline justify-between flex-wrap"
        style={{ marginBottom: 12, gap: 12 }}
      >
        <span
          className="eyebrow"
          style={{
            color: "var(--c-gold-400)",
            letterSpacing: "0.24em",
            fontSize: 10,
          }}
        >
          Karta przebiegu
        </span>
        <span
          className="signature"
          style={{
            color: "var(--c-paper-300)",
            opacity: 0.6,
            fontSize: 11,
          }}
        >
          <span style={{ color: "var(--racing-tally, #1f3a26)", opacity: 0.95 }}>
            ● {trafione} trafione
          </span>
          <span
            style={{
              marginLeft: 14,
              color: "var(--c-ink-on-dark)",
              opacity: 0.95,
            }}
          >
            ✗ {chybione} chybione
          </span>
          <span style={{ marginLeft: 14, opacity: 0.55 }}>
            ○ {przedNami} przed nami
          </span>
        </span>
      </div>

      <div className="flex items-stretch" style={{ gap: 0 }}>
        {Array.from({ length: totalQuestions }).map((_, i) => {
          const isCurrent = i === currentIdx;
          const st = states[i] ?? "pending";
          let colorBar = "rgba(184,146,77,0.3)";
          let label = "·";
          let accent = "rgba(184,146,77,0.5)";
          if (st === "correct") {
            colorBar = "#1f3a26";
            label = "✓";
            accent = "rgba(31,58,38,0.95)";
          } else if (st === "wrong") {
            colorBar = "#5a1410";
            label = "✗";
            accent = "rgba(139,46,31,0.95)";
          }
          return (
            <div
              key={i}
              className="relative flex flex-col items-center justify-center"
              style={{
                flex: 1,
                padding: "10px 4px 12px",
                background: isCurrent
                  ? "rgba(184,146,77,0.10)"
                  : "rgba(27,17,8,0.30)",
                border: isCurrent
                  ? "0.5px solid var(--c-gold-400)"
                  : "0.5px solid rgba(184,146,77,0.18)",
                borderBottom: "none",
              }}
            >
              {isCurrent && (
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: -1,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 36,
                    height: 3,
                    background: "var(--c-gold-400)",
                    boxShadow: "0 0 8px rgba(216,179,107,0.5)",
                  }}
                />
              )}
              <span
                className="font-display italic"
                style={{
                  fontSize: 20,
                  color: isCurrent
                    ? "var(--c-gold-300)"
                    : "var(--c-paper-200)",
                  fontWeight: 500,
                  lineHeight: 1,
                  opacity: isCurrent ? 1 : 0.7,
                  letterSpacing: "-0.005em",
                }}
              >
                {toRoman(i + 1)}
              </span>
              <div
                className="flex items-center"
                style={{ gap: 4, marginTop: 6 }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: accent,
                    lineHeight: 1,
                    opacity: st === "pending" ? 0.6 : 0.95,
                  }}
                  aria-hidden
                >
                  {label}
                </span>
                <span
                  className="signature"
                  style={{
                    color: "var(--c-paper-300)",
                    opacity: 0.4,
                    fontSize: 9,
                  }}
                >
                  {i + 1}
                </span>
              </div>
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: colorBar,
                  opacity: st === "pending" ? 0.5 : 0.95,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   Book spread
   ============================================================ */

interface BookSpreadProps {
  q: Question;
  idx: number;
  total: number;
  states: QState[];
  state: QState;
  lastFeedback: string | null;
  signature: string;
  input: string;
  setInput: (v: string) => void;
  submitting: boolean;
  onSubmit: (answer: string | number) => void | Promise<void>;
  onAdvance: () => void;
  isLast: boolean;
  attemptAnswer: string | null;
  /** kod języka TTS dla sekcji językowej (es/en); null = bez wymowy */
  speakLang: string | null;
}

function BookSpread(props: BookSpreadProps) {
  return (
    <div style={{ padding: "16px 24px 28px" }}>
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
            <QuestionPage {...props} />
            <Gutter />
            <NotesPage {...props} />
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

/* ============================================================
   Left page — question + answer affordance
   ============================================================ */

function QuestionPage({
  q,
  idx,
  total,
  states,
  state,
  signature,
  input,
  setInput,
  submitting,
  onSubmit,
  attemptAnswer,
}: BookSpreadProps) {
  const trafione = states.slice(0, idx).filter((s) => s === "correct").length;
  const trafioneLabel = trafione === 1 ? "trafiona dotąd" : "trafione dotąd";

  return (
    <div
      className="tex-paper tex-noise-fine relative flex-1"
      style={{
        padding: "28px 36px 36px 40px",
        minHeight: 640,
        boxShadow: "inset -12px 0 24px -12px rgba(40,20,8,0.4)",
      }}
    >
      <div className="relative" style={{ zIndex: 2 }}>
        <div
          className="flex items-baseline justify-between"
          style={{
            borderBottom: "0.5px solid rgba(27,17,8,0.18)",
            paddingBottom: 8,
            marginBottom: 22,
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
            Etap II · Test
          </span>
          <span
            className="font-display italic"
            style={{ fontSize: 14, color: "rgba(27,17,8,0.5)" }}
          >
            — {2 * (idx + 1) - 1} —
          </span>
        </div>

        {/* QuestionMeta */}
        <div
          className="flex items-end justify-between flex-wrap"
          style={{ marginBottom: 20, gap: 12 }}
        >
          <div className="flex items-baseline" style={{ gap: 16 }}>
            <span
              className="font-display italic"
              style={{
                fontSize: 52,
                color: "var(--c-ink2)",
                fontWeight: 600,
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
              }}
            >
              {toRoman(idx + 1)}
            </span>
            <div>
              <div
                className="eyebrow"
                style={{
                  color: "rgba(27,17,8,0.55)",
                  fontSize: 9,
                }}
              >
                Pytanie · typ {typeLabel(q.type)}
              </div>
              {q.skill && (
                <div
                  className="signature"
                  style={{
                    color: "rgba(122,74,31,0.72)",
                    fontSize: 10,
                    marginTop: 4,
                    textTransform: "uppercase",
                  }}
                >
                  Skill · {q.skill}
                </div>
              )}
              <div
                className="signature"
                style={{
                  color: "rgba(27,17,8,0.55)",
                  fontSize: 11,
                  marginTop: 4,
                }}
              >
                {idx + 1} z {total}
              </div>
            </div>
          </div>
          <div className="flex items-baseline" style={{ gap: 6 }}>
            <span
              className="font-display italic"
              style={{
                fontSize: 20,
                color: "#1f3a26",
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              {trafione}
            </span>
            <span
              className="signature"
              style={{
                color: "rgba(27,17,8,0.45)",
                fontSize: 10,
                fontStyle: "italic",
              }}
            >
              {trafioneLabel}
            </span>
          </div>
        </div>

        <div
          className="rule-gold"
          style={{ height: 0.5, marginBottom: 20, opacity: 0.6 }}
        />

        <h2
          className="font-display italic"
          style={{
            fontSize: 26,
            color: "#1B1108",
            fontWeight: 500,
            lineHeight: 1.18,
            letterSpacing: "-0.005em",
            marginBottom: 18,
          }}
        >
          {q.text}
        </h2>

        {(q.type === "abc" || q.type === "spot_error") && (
          <McOptions
            q={q}
            state={state}
            disabled={state !== "pending" || submitting}
            attemptAnswer={attemptAnswer}
            onPick={(i) => onSubmit(i)}
          />
        )}
        {q.type === "fill" && (
          <FillInput
            value={input}
            onChange={setInput}
            state={state}
            disabled={state !== "pending" || submitting}
            onSubmit={() => onSubmit(input)}
          />
        )}
        {q.type === "translate" && (
          <FillInput
            value={input}
            onChange={setInput}
            state={state}
            disabled={state !== "pending" || submitting}
            onSubmit={() => onSubmit(input)}
            placeholder="Wpisz przekład..."
          />
        )}
        {q.type === "open" && (
          <OpenAnswer
            value={input}
            onChange={setInput}
            state={state}
            disabled={state !== "pending" || submitting}
            onSubmit={() => onSubmit(input)}
          />
        )}

        <div
          className="flex items-center"
          style={{ marginTop: 28, gap: 8 }}
          aria-hidden
        >
          <span
            className="font-display italic"
            style={{
              fontSize: 13,
              color: "rgba(27,17,8,0.45)",
            }}
          >
            ❦{" "}
            {q.type === "open"
              ? "pytanie otwarte"
              : q.type === "fill" || q.type === "translate"
              ? "uzupełnij"
              : "wybierz jeden"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Multiple choice / find-error — roundel cards
   ============================================================ */

function McOptions({
  q,
  state,
  disabled,
  attemptAnswer,
  onPick,
}: {
  q: Question;
  state: QState;
  disabled: boolean;
  attemptAnswer: string | null;
  onPick: (i: number) => void;
}) {
  const letters = ["A", "B", "C", "D"];
  const correctIdx = Number(q.correctAnswer);
  const pickedIdx =
    attemptAnswer != null ? Number(attemptAnswer) : null;

  return (
    <div
      className="flex flex-col"
      style={{ gap: 12, marginTop: 6 }}
    >
      {(q.options ?? []).map((opt, i) => {
        const isCorrect = i === correctIdx;
        const isPicked = pickedIdx === i;
        const answered = state !== "pending";

        let bg = "#efe5cb";
        let borderColor = "rgba(27,17,8,0.18)";
        let leftBar = "rgba(122,74,31,0.25)";
        let dimming = 1;
        let mark: React.ReactNode = null;

        if (answered) {
          if (isCorrect) {
            bg = "rgba(31,58,38,0.10)";
            borderColor = "rgba(31,58,38,0.55)";
            leftBar = "#1f3a26";
            mark = (
              <span
                style={{
                  color: "#1f3a26",
                  fontSize: 16,
                  lineHeight: 1,
                  fontWeight: 600,
                }}
              >
                ✓
              </span>
            );
          }
          if (isPicked && !isCorrect) {
            bg = "rgba(139,46,31,0.10)";
            borderColor = "rgba(139,46,31,0.55)";
            leftBar = "#5a1410";
            dimming = 1;
            mark = (
              <span
                style={{
                  color: "#5a1410",
                  fontSize: 16,
                  lineHeight: 1,
                  fontWeight: 600,
                }}
              >
                ✗
              </span>
            );
          } else if (!isCorrect && !isPicked) {
            dimming = 0.55;
          }
        }

        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => onPick(i)}
            className="relative flex items-stretch text-left"
            style={{
              background: bg,
              border: `0.5px solid ${borderColor}`,
              boxShadow:
                "inset 0 1px 0 rgba(255,250,235,0.55), 0 1px 2px rgba(0,0,0,0.08)",
              opacity: dimming,
              transition: "opacity .2s, transform .15s",
              cursor: disabled ? "default" : "pointer",
              font: "inherit",
            }}
          >
            <div
              style={{
                width: 4,
                background: leftBar,
                opacity: 0.85,
                flexShrink: 0,
              }}
            />
            <div
              className="flex items-center justify-center"
              style={{
                flexShrink: 0,
                width: 46,
                padding: "0 8px",
                borderRight: "0.5px dashed rgba(27,17,8,0.18)",
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "rgba(184,146,77,0.10)",
                  border: "0.5px solid rgba(146,112,55,0.45)",
                }}
              >
                <span
                  className="font-display italic"
                  style={{
                    fontSize: 15,
                    color: "var(--c-cognac)",
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  {letters[i] ?? String(i + 1)}
                </span>
              </div>
            </div>
            <div
              className="flex items-center"
              style={{
                flex: 1,
                padding: "12px 14px",
                minHeight: 52,
              }}
            >
              <span
                className="body-prose"
                style={{
                  color: "rgba(27,17,8,0.86)",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {opt}
              </span>
            </div>
            {mark && (
              <div
                className="flex items-center justify-center"
                style={{ width: 40, flexShrink: 0 }}
              >
                {mark}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   Fill input — engraved underline with quill
   ============================================================ */

function FillInput({
  value,
  onChange,
  state,
  disabled,
  onSubmit,
  placeholder = "Wpisz odpowiedź...",
}: {
  value: string;
  onChange: (v: string) => void;
  state: QState;
  disabled: boolean;
  onSubmit: () => void;
  placeholder?: string;
}) {
  return (
    <div style={{ marginTop: 4 }}>
      <div
        className="relative flex items-center"
        style={{ gap: 12, marginTop: 14 }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          style={{ flexShrink: 0 }}
          aria-hidden
        >
          <path
            d="M22 4 L26 8 L10 24 L4 24 L4 18 Z"
            fill="rgba(122,74,31,0.18)"
            stroke="rgba(122,74,31,0.75)"
            strokeWidth="0.7"
          />
          <path
            d="M9 19 L14 14 M11 21 L16 16 M13 23 L18 18"
            stroke="rgba(122,74,31,0.55)"
            strokeWidth="0.4"
          />
          <circle cx="22" cy="6" r="1" fill="rgba(90,20,16,0.8)" />
        </svg>

        <div className="relative" style={{ flex: 1 }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!disabled && value.trim()) onSubmit();
            }}
          >
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              placeholder={placeholder}
              autoFocus
              style={{
                width: "100%",
                background: "rgba(255,245,210,0.55)",
                border: "0.5px solid rgba(27,17,8,0.22)",
                padding: "12px 16px",
                boxShadow:
                  "inset 0 1px 0 rgba(255,250,235,0.6), inset 0 -1px 0 rgba(0,0,0,0.06)",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontStyle: "italic",
                fontSize: 22,
                color: state === "wrong" ? "#5a1410" : "#1B1108",
                fontWeight: 500,
                lineHeight: 1.3,
                letterSpacing: "-0.005em",
                outline: "none",
              }}
            />
          </form>
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -6,
              height: 0.5,
              background: "rgba(184,146,77,0.55)",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -10,
              height: 0.5,
              background: "rgba(184,146,77,0.20)",
            }}
          />
        </div>
      </div>
      <div
        className="flex items-center flex-wrap"
        style={{ gap: 10, marginTop: 18, paddingLeft: 40 }}
      >
        <span
          className="signature"
          style={{
            color: "rgba(27,17,8,0.42)",
            fontSize: 10,
            fontStyle: "italic",
          }}
        >
          ↵ Enter zatwierdza · {value.length} znaków
        </span>
        <div style={{ flex: 1, minWidth: 8 }} />
        <CheckButton
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
        />
      </div>
    </div>
  );
}

/* ============================================================
   Open answer — lined notebook
   ============================================================ */

function OpenAnswer({
  value,
  onChange,
  state,
  disabled,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  state: QState;
  disabled: boolean;
  onSubmit: () => void;
}) {
  const words = value.trim().split(/\s+/).filter(Boolean).length;
  return (
    <div style={{ marginTop: 6 }}>
      <div
        className="relative"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,245,210,0.55) 0%, rgba(255,245,210,0.55) 100%)",
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0 27px, rgba(184,146,77,0.32) 27px 27.5px)",
          border: "0.5px solid rgba(27,17,8,0.22)",
          padding: "12px 18px 18px 36px",
          minHeight: 132,
          boxShadow:
            "inset 0 1px 0 rgba(255,250,235,0.6), inset 0 -1px 0 rgba(0,0,0,0.06)",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 22,
            width: 0.5,
            background: "rgba(139,46,31,0.45)",
          }}
        />
        <div
          className="absolute"
          style={{ top: 6, left: 4, width: 12, height: 12 }}
          aria-hidden
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="7" r="3.2" fill="rgba(90,20,16,0.45)" />
            <circle cx="5" cy="6" r="1" fill="rgba(255,200,180,0.5)" />
          </svg>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoFocus
          rows={4}
          placeholder="Krótko, w punkt..."
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              if (!disabled && value.trim()) onSubmit();
            }
          }}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontStyle: "italic",
            fontWeight: 500,
            color: state === "wrong" ? "#5a1410" : "#1B1108",
            fontSize: 17,
            lineHeight: "27px",
            resize: "vertical",
            margin: 0,
          }}
        />
      </div>
      <div
        className="flex items-center justify-between flex-wrap"
        style={{ marginTop: 12, gap: 10 }}
      >
        <span
          className="signature"
          style={{
            color: "rgba(27,17,8,0.42)",
            fontSize: 10,
            fontStyle: "italic",
          }}
        >
          ⌘/Ctrl + Enter zatwierdza · ≈ {words} {words === 1 ? "słowo" : "słów"}
        </span>
        <CheckButton
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
        />
      </div>
    </div>
  );
}

/* ============================================================
   Check button — small brass plate "Sprawdź" submit
   ============================================================ */

function CheckButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className="relative inline-flex items-center"
      style={{
        gap: 10,
        padding: "9px 18px",
        background: disabled
          ? "linear-gradient(180deg, #3a2a1c 0%, #2a1a0c 100%)"
          : "linear-gradient(180deg, #221610 0%, #1a0f08 100%)",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        font: "inherit",
        opacity: disabled ? 0.55 : 1,
        boxShadow:
          "0 5px 14px -6px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,230,180,0.14), inset 0 -1px 0 rgba(0,0,0,0.5)",
        transition: "transform .15s ease, box-shadow .15s ease, opacity .15s",
      }}
    >
      <span
        aria-hidden
        className="absolute pointer-events-none"
        style={{ inset: 3, border: "0.5px solid rgba(184,146,77,0.55)" }}
      />
      <span
        aria-hidden
        className="absolute pointer-events-none"
        style={{ inset: 5, border: "0.5px solid rgba(184,146,77,0.22)" }}
      />
      <span
        className="font-display italic"
        style={{
          fontSize: 15,
          color: "var(--c-paper-100)",
          fontWeight: 500,
          letterSpacing: "-0.005em",
          padding: "0 4px",
        }}
      >
        Sprawdź
      </span>
      <span
        style={{
          color: "var(--c-gold-300)",
          fontSize: 13,
          lineHeight: 1,
          padding: "0 2px 0 0",
        }}
        aria-hidden
      >
        ↵
      </span>
    </button>
  );
}

/* ============================================================
   Right page — notes / correction
   ============================================================ */

function NotesPage({
  q,
  state,
  lastFeedback,
  signature,
  idx,
  onAdvance,
  isLast,
  speakLang,
}: BookSpreadProps) {
  return (
    <div
      className="tex-paper tex-noise-fine relative flex-1"
      style={{
        padding: "28px 40px 36px 36px",
        minHeight: 640,
        boxShadow: "inset 12px 0 24px -12px rgba(40,20,8,0.4)",
      }}
    >
      <BookmarkRibbon />

      <div className="relative" style={{ zIndex: 2 }}>
        <div
          className="flex items-baseline justify-between"
          style={{
            borderBottom: "0.5px solid rgba(27,17,8,0.18)",
            paddingBottom: 8,
            marginBottom: 24,
            paddingLeft: 56,
          }}
        >
          <span
            className="font-display italic"
            style={{ fontSize: 14, color: "rgba(27,17,8,0.5)" }}
          >
            — {2 * (idx + 1)} —
          </span>
          <span
            className="eyebrow"
            style={{ color: "rgba(27,17,8,0.45)", fontSize: 9 }}
          >
            {state === "pending" ? "Notatki bibliotekarza" : "Korekta"}
          </span>
          <span
            className="eyebrow"
            style={{ color: "rgba(27,17,8,0.55)", fontSize: 9 }}
          >
            {signature}
          </span>
        </div>

        {state === "pending" ? (
          <NotesEmpty />
        ) : (
          <NotesFilled
            q={q}
            state={state}
            lastFeedback={lastFeedback}
            onAdvance={onAdvance}
            isLast={isLast}
            speakLang={speakLang}
          />
        )}
      </div>
    </div>
  );
}

function BookmarkRibbon() {
  return (
    <div
      aria-hidden
      className="pointer-events-none"
      // position w inline style, bo `.tex-paper > * { position: relative }`
      // z globals.css nadpisuje klasę Tailwinda `absolute` (równa specyficzność,
      // reguła globalna jest później). Inline style ma pierwszeństwo.
      style={{ position: "absolute", top: -14, left: 60, width: 28, zIndex: 6 }}
    >
      <svg
        width="28"
        height="180"
        viewBox="0 0 28 180"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="testRibbonGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b6418" />
            <stop offset="50%" stopColor="#e0b86a" />
            <stop offset="100%" stopColor="#7a5414" />
          </linearGradient>
          <linearGradient id="testRibbonShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,0,0,0.40)" />
            <stop offset="20%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
          </linearGradient>
        </defs>
        <path
          d="M 4 0 L 24 0 L 24 160 L 14 144 L 4 160 Z"
          fill="url(#testRibbonGrad)"
        />
        <path
          d="M 4 0 L 24 0 L 24 160 L 14 144 L 4 160 Z"
          fill="url(#testRibbonShade)"
        />
        <path d="M 14 0 L 14 144" stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
        <path d="M 4 0 L 4 160" stroke="rgba(255,230,180,0.4)" strokeWidth="0.5" />
        <path d="M 24 0 L 24 160" stroke="rgba(0,0,0,0.45)" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

function NotesEmpty() {
  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{ minHeight: 420, padding: "24px 24px" }}
    >
      <div
        aria-hidden
        className="absolute"
        style={{
          inset: 8,
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(27,17,8,0.18) 0 4px, transparent 4px 10px),
            repeating-linear-gradient(180deg, rgba(27,17,8,0.18) 0 4px, transparent 4px 10px),
            repeating-linear-gradient(90deg, rgba(27,17,8,0.18) 0 4px, transparent 4px 10px),
            repeating-linear-gradient(270deg, rgba(27,17,8,0.18) 0 4px, transparent 4px 10px)
          `,
          backgroundPosition:
            "top left, top right, top left, bottom left",
          backgroundSize:
            "1px 100%, 1px 100%, 100% 1px, 100% 1px",
          backgroundRepeat: "no-repeat",
        }}
      />
      <svg
        width="76"
        height="76"
        viewBox="0 0 76 76"
        style={{ opacity: 0.32 }}
        aria-hidden
      >
        <circle
          cx="38"
          cy="38"
          r="26"
          fill="none"
          stroke="var(--c-cognac)"
          strokeWidth="0.8"
          strokeDasharray="2 3"
        />
        <circle
          cx="38"
          cy="38"
          r="18"
          fill="none"
          stroke="var(--c-cognac)"
          strokeWidth="0.5"
        />
        <path
          d="M 38 22 L 40 36 L 54 38 L 40 40 L 38 54 L 36 40 L 22 38 L 36 36 Z"
          fill="none"
          stroke="var(--c-cognac)"
          strokeWidth="0.7"
        />
      </svg>
      <p
        className="font-display italic"
        style={{
          fontSize: 18,
          color: "rgba(27,17,8,0.45)",
          fontWeight: 400,
          marginTop: 20,
          textAlign: "center",
          maxWidth: 320,
          lineHeight: 1.4,
        }}
      >
        Tutaj pojawi się notatka bibliotekarza, gdy zatwierdzisz odpowiedź.
      </p>
      <div
        className="flex items-center"
        style={{ gap: 10, marginTop: 16 }}
        aria-hidden
      >
        <span
          style={{
            width: 28,
            height: 0.5,
            background: "rgba(27,17,8,0.30)",
          }}
        />
        <span
          className="eyebrow"
          style={{
            color: "rgba(122,74,31,0.7)",
            fontSize: 9,
          }}
        >
          ↵ Enter zatwierdza
        </span>
        <span
          style={{
            width: 28,
            height: 0.5,
            background: "rgba(27,17,8,0.30)",
          }}
        />
      </div>
    </div>
  );
}

function NotesFilled({
  q,
  state,
  lastFeedback,
  onAdvance,
  isLast,
  speakLang,
}: {
  q: Question;
  state: QState;
  lastFeedback: string | null;
  onAdvance: () => void;
  isLast: boolean;
  speakLang: string | null;
}) {
  const isCorrect = state === "correct";
  const label = isCorrect ? "Tak. To samo." : "Nie. Tu jest sedno:";
  const isMc = q.type === "abc" || q.type === "spot_error";
  const correctAnswerStr = isMc
    ? (q.options ?? [])[Number(q.correctAnswer)] ?? String(q.correctAnswer)
    : String(q.correctAnswer);

  return (
    <div style={{ paddingLeft: 56 }}>
      <div
        className="flex items-center flex-wrap"
        style={{ gap: 20, marginBottom: 20 }}
      >
        <WaxSeal tone={isCorrect ? "correct" : "wrong"} size={80} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            className="eyebrow"
            style={{
              color: isCorrect ? "#1f3a26" : "var(--c-ink2)",
              fontSize: 9,
              marginBottom: 6,
              letterSpacing: "0.28em",
            }}
          >
            {isCorrect ? "✓  Trafiona" : "✗  Chybiona"}
          </div>
          <div className="flex items-center" style={{ gap: 10 }}>
            <div
              className="font-display italic"
              style={{
                fontSize: 24,
                color: "#1B1108",
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}
            >
              {label}
            </div>
            {speakLang && (
              <SpeakButton
                text={correctAnswerStr}
                lang={speakLang}
                className="inline-flex items-center justify-center w-7 h-7 rounded-full shrink-0 text-cognac hover:text-gold-600 transition-colors"
              />
            )}
          </div>
        </div>
      </div>

      <div
        className="rule-gold"
        style={{ height: 0.5, marginBottom: 16, opacity: 0.5 }}
      />

      {!isCorrect && (
        <div style={{ marginBottom: 14 }}>
          <span
            className="eyebrow"
            style={{
              color: "rgba(27,17,8,0.55)",
              fontSize: 9,
            }}
          >
            Poprawna
          </span>
          <div
            className="font-display italic"
            style={{
              fontSize: 20,
              color: "#1f3a26",
              fontWeight: 600,
              marginTop: 4,
              letterSpacing: "-0.005em",
            }}
          >
            {correctAnswerStr}
          </div>
        </div>
      )}

      {lastFeedback && (
        <div
          style={{
            border: "0.5px solid rgba(122,74,31,0.24)",
            background:
              "linear-gradient(180deg, rgba(122,74,31,0.06), rgba(122,74,31,0.025))",
            padding: "11px 13px",
            marginBottom: 14,
          }}
        >
          <div
            className="eyebrow"
            style={{ color: "rgba(122,74,31,0.72)", fontSize: 8.5, marginBottom: 5 }}
          >
            Mikro-korekta
          </div>
          <p
            className="body-prose"
            style={{
              color: "rgba(27,17,8,0.85)",
              fontSize: 14.5,
              lineHeight: 1.65,
              fontStyle: "italic",
            }}
          >
            {lastFeedback}
          </p>
        </div>
      )}

      <p
        className="body-prose"
        style={{
          color: "rgba(27,17,8,0.85)",
          fontSize: 14.5,
          lineHeight: 1.7,
          textAlign: "justify",
          hyphens: "auto",
          marginBottom: 16,
        }}
      >
        {q.explanation}
      </p>

      <div
        className="flex items-center justify-between flex-wrap"
        style={{
          marginTop: 22,
          paddingTop: 16,
          borderTop: "0.5px dashed rgba(27,17,8,0.22)",
          gap: 12,
        }}
      >
        <span
          className="signature"
          style={{
            color: "rgba(27,17,8,0.50)",
            fontSize: 11,
            fontStyle: "italic",
          }}
        >
          {isLast
            ? "To było ostatnie pytanie."
            : "Idziemy dalej — nie marnuj zegara."}
        </span>
        <AdvanceButton
          label={isLast ? "Do korekty" : "Następne"}
          onClick={onAdvance}
        />
      </div>
    </div>
  );
}

function AdvanceButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative flex items-center"
      style={{
        gap: 12,
        padding: "12px 22px",
        background:
          "linear-gradient(180deg, #221610 0%, #1a0f08 100%)",
        border: "none",
        cursor: "pointer",
        font: "inherit",
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
          fontSize: 17,
          color: "var(--c-paper-100)",
          fontWeight: 500,
          letterSpacing: "-0.005em",
          padding: "0 6px",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: "var(--c-gold-300)",
          fontSize: 14,
          lineHeight: 1,
          padding: "0 4px 0 0",
        }}
      >
        →
      </span>
    </button>
  );
}

/* ============================================================
   Wax seal — pressed wax verdict (correct = racing green, wrong = oxblood)
   ============================================================ */

function WaxSeal({
  tone,
  size = 80,
}: {
  tone: "correct" | "wrong";
  size?: number;
}) {
  const uid = useMemo(
    () => Math.random().toString(36).slice(2, 8),
    []
  );
  const fillId = `wax-${tone}-${uid}`;
  const impressId = `wax-imp-${uid}`;
  const glossId = `wax-gloss-${uid}`;

  const cx = size / 2;
  const cy = size / 2;
  const rot = tone === "correct" ? -6 : 4;

  const samples = 96;
  const rBase = size * 0.44;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < samples; i++) {
    const a = (i / samples) * Math.PI * 2 - Math.PI / 2;
    const noise =
      Math.sin(a * 5 + 1.7) * 0.5 +
      Math.sin(a * 9 + 4.1) * 0.25 +
      (((Math.sin(i * 12.9898) * 43758.5453) % 1) + 1) * 0.2;
    const r = rBase + noise * size * 0.012;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)}`;
  }
  d += " Z";

  const dx = cx + size * 0.22;
  const dy = cy + size * 0.36;
  const dripPath = `M ${dx - 5} ${dy - 4} Q ${dx - 3} ${dy + 3}, ${dx} ${dy + 6} Q ${dx + 6} ${dy + 7}, ${dx + 7} ${dy + 2} Q ${dx + 7} ${dy - 3}, ${dx + 2} ${dy - 5} Z`;

  const stops =
    tone === "correct"
      ? [
          { o: "0%", c: "#6a9d72" },
          { o: "32%", c: "#345f3a" },
          { o: "70%", c: "#1a3823" },
          { o: "100%", c: "#0a1c10" },
        ]
      : [
          { o: "0%", c: "#c25a45" },
          { o: "32%", c: "#7d2018" },
          { o: "70%", c: "#3e0d09" },
          { o: "100%", c: "#1b0606" },
        ];

  const glyph = tone === "correct" ? "✓" : "✕";
  const glyphInk =
    tone === "correct" ? "rgba(8,18,10,0.55)" : "rgba(28,5,3,0.55)";
  const glyphHi =
    tone === "correct"
      ? "rgba(180,210,180,0.45)"
      : "rgba(240,200,185,0.45)";

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        filter:
          "drop-shadow(0 4px 7px rgba(0,0,0,0.45)) drop-shadow(0 1px 2px rgba(0,0,0,0.35))",
      }}
      aria-hidden
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute"
        style={{ inset: 0, transform: `rotate(${rot}deg)` }}
      >
        <defs>
          <radialGradient id={fillId} cx="36%" cy="30%" r="76%">
            {stops.map((s) => (
              <stop key={s.o} offset={s.o} stopColor={s.c} />
            ))}
          </radialGradient>
          <radialGradient id={impressId} cx="50%" cy="50%" r="58%">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="58%" stopColor="rgba(0,0,0,0)" />
            <stop offset="85%" stopColor="rgba(0,0,0,0.22)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.50)" />
          </radialGradient>
          <radialGradient id={glossId} cx="32%" cy="22%" r="42%">
            <stop offset="0%" stopColor="rgba(255,240,225,0.35)" />
            <stop offset="55%" stopColor="rgba(255,225,210,0.08)" />
            <stop offset="100%" stopColor="rgba(255,225,210,0)" />
          </radialGradient>
        </defs>
        <path d={dripPath} fill={`url(#${fillId})`} opacity="0.95" />
        <path d={d} fill={`url(#${fillId})`} />
        <path d={d} fill={`url(#${impressId})`} />
        <ellipse
          cx={size * 0.34}
          cy={size * 0.28}
          rx={size * 0.2}
          ry={size * 0.08}
          fill={`url(#${glossId})`}
          transform={`rotate(-28 ${size * 0.34} ${size * 0.28})`}
        />
      </svg>

      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ pointerEvents: "none" }}
      >
        <span
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: 600,
            fontStyle: "normal",
            fontSize: size * 0.5,
            lineHeight: 1,
            color: glyphInk,
            textShadow: `0 -0.5px 0 ${glyphHi}, 0 1px 0 rgba(0,0,0,0.35)`,
            transform: `translateY(${size * 0.02}px)`,
          }}
        >
          {glyph}
        </span>
      </div>
    </div>
  );
}
