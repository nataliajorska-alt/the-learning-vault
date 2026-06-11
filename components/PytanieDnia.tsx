"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getQuestionsForTopic } from "@/lib/firestore-data";
import { answersMatch } from "@/lib/answer-normalization";
import { idSig, vaultSig } from "@/lib/sig";
import type { Question, Topic } from "@/lib/types";

interface Answered {
  correct: boolean;
  given: string;
}

const GOLD_SOFT = "rgba(184,146,77,0.22)";
const LETTERS = ["a.", "b.", "c.", "d.", "e."];

function isoToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/** Stabilny indeks dnia — to samo pytanie przez cały dzień. */
function dayIndex(): number {
  const d = new Date();
  return Math.floor(
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 86400000
  );
}

/* Wiersz odpowiedzi w ciemnej gablocie — litera, treść, znak po prawej */
function QuizAnswerV3({
  letter,
  text,
  state,
  disabled,
  onSelect,
}: {
  letter: string;
  text: string;
  state: "idle" | "correct" | "wrong";
  disabled: boolean;
  onSelect: () => void;
}) {
  const [hover, setHover] = useState(false);
  const showHover = hover && !disabled;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        if (!disabled) onSelect();
      }}
      role="button"
      aria-disabled={disabled}
      className="flex items-baseline relative"
      style={{
        gap: 18,
        padding: "14px 16px 13px",
        cursor: disabled ? "default" : "pointer",
        background:
          state === "correct"
            ? "rgba(184,146,77,0.08)"
            : state === "wrong"
            ? "rgba(139,46,31,0.10)"
            : showHover
            ? "rgba(228,214,186,0.035)"
            : "transparent",
        borderTop: "0.5px solid rgba(184,146,77,0.15)",
        transition: "background .15s ease",
      }}
    >
      {state === "correct" && (
        <span
          aria-hidden
          className="absolute pointer-events-none"
          style={{ inset: 3, border: "0.5px solid rgba(184,146,77,0.5)" }}
        />
      )}
      {state === "wrong" && (
        <span
          aria-hidden
          className="absolute pointer-events-none"
          style={{ inset: 3, border: "0.5px solid rgba(139,46,31,0.55)" }}
        />
      )}
      <span
        className="font-display italic font-medium"
        style={{
          fontSize: 19,
          color:
            state === "correct"
              ? "var(--c-gold-300)"
              : state === "wrong"
              ? "#c14430"
              : "rgba(228,214,186,0.4)",
          width: 20,
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        {letter}
      </span>
      <span
        className="body-prose"
        style={{
          flex: 1,
          color: "rgba(228,214,186,0.85)",
          fontSize: 14.5,
          lineHeight: 1.5,
        }}
      >
        {text}
      </span>
      <span
        aria-hidden
        style={{
          color: state === "wrong" ? "#c14430" : "var(--c-gold-300)",
          fontSize: 14,
          opacity:
            state === "correct" || state === "wrong" ? 0.95 : showHover ? 0.55 : 0,
          transition: "opacity .15s ease",
          flexShrink: 0,
        }}
      >
        {state === "correct" ? "✓" : state === "wrong" ? "✗" : "→"}
      </span>
    </div>
  );
}

export function PytanieDnia({
  topic,
  vaultName,
}: {
  topic: Topic;
  vaultName: string;
}) {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [answered, setAnswered] = useState<Answered | null>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    let cancelled = false;
    getQuestionsForTopic(topic.id)
      .then((qs) => {
        if (!cancelled) setQuestions(qs);
      })
      .catch(() => {
        if (!cancelled) setQuestions([]);
      });
    return () => {
      cancelled = true;
    };
  }, [topic.id]);

  // Pytanie dnia: najpierw te z opcjami (odpowiedź jednym tapnięciem), potem
  // krótkie tekstowe. „open" pomijamy — nie ocenimy ich lokalnie.
  const question = useMemo(() => {
    if (!questions || questions.length === 0) return null;
    const withOptions = questions.filter(
      (q) => q.options && q.options.length > 0
    );
    const shortText = questions.filter(
      (q) => q.type === "fill" || q.type === "translate"
    );
    const pool = withOptions.length > 0 ? withOptions : shortText;
    if (pool.length === 0) return null;
    return pool[dayIndex() % pool.length]!;
  }, [questions]);

  // Odpowiedziane dziś? Zapamiętaj, żeby po odświeżeniu został wynik + CTA.
  useEffect(() => {
    if (!question) return;
    try {
      const saved = localStorage.getItem(
        `pytanie-dnia:${isoToday()}:${question.id}`
      );
      if (saved) setAnswered(JSON.parse(saved) as Answered);
    } catch {
      /* ignore */
    }
  }, [question]);

  if (!question) return null;

  const hasOptions = Boolean(question.options && question.options.length > 0);
  const correctIdx = hasOptions ? Number(question.correctAnswer) : -1;

  function commit(given: string, correct: boolean) {
    if (!question) return;
    const a: Answered = { correct, given };
    setAnswered(a);
    try {
      localStorage.setItem(
        `pytanie-dnia:${isoToday()}:${question.id}`,
        JSON.stringify(a)
      );
    } catch {
      /* ignore */
    }
  }

  function pickOption(i: number) {
    if (answered) return;
    commit(String(i), i === correctIdx);
  }

  function submitText(e: React.FormEvent) {
    e.preventDefault();
    if (answered || !input.trim() || !question) return;
    commit(input, answersMatch(input, String(question.correctAnswer)));
  }

  return (
    <section className="px-6 md:px-12 lg:px-16 pb-14 md:pb-16">
      <div className="flex items-baseline" style={{ marginBottom: 22, gap: 24 }}>
        <h2
          className="h2"
          style={{
            fontSize: "clamp(28px, 3.4vw, 36px)",
            color: "var(--c-paper-100)",
            whiteSpace: "nowrap",
          }}
        >
          Pytanie dnia
        </h2>
        <div
          aria-hidden
          style={{
            flex: 1,
            height: 1,
            background: GOLD_SOFT,
            transform: "translateY(-8px)",
          }}
        />
        <span
          className="signature hidden sm:inline"
          style={{ color: "var(--c-paper-300)", opacity: 0.6, whiteSpace: "nowrap" }}
        >
          otwiera passę dnia
        </span>
      </div>

      {/* ciemna, hairline'owa gablota */}
      <div
        style={{
          border: `1px solid ${GOLD_SOFT}`,
          background: "rgba(228,214,186,0.025)",
        }}
      >
        {/* pasek nagłówka */}
        <div
          className="flex items-center"
          style={{
            padding: "10px 24px",
            borderBottom: `0.5px solid ${GOLD_SOFT}`,
            gap: 12,
          }}
        >
          <span
            className="signature"
            style={{
              color: "var(--c-gold-400)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {vaultName} · {topic.title}
          </span>
          <span style={{ flex: 1 }} />
          <span
            className="signature"
            style={{ color: "rgba(228,214,186,0.5)", fontSize: 10, whiteSpace: "nowrap" }}
          >
            ✦ 10 s
          </span>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-12"
          style={{ padding: "22px 24px", rowGap: 24 }}
        >
          {/* pytanie */}
          <div className="lg:col-span-5 flex flex-col lg:pr-8">
            <p
              className="font-display italic font-medium"
              style={{
                fontSize: "clamp(22px, 2.6vw, 27px)",
                color: "var(--c-paper-100)",
                lineHeight: 1.22,
                marginBottom: 16,
              }}
            >
              {question.text}
            </p>
            <div style={{ flex: 1 }} />
            <div
              className="signature hidden lg:block"
              style={{ color: "rgba(228,214,186,0.45)" }}
            >
              Sygn. {vaultSig(vaultName)} · {idSig(topic.id)} · jedno pytanie, raz dziennie
            </div>
          </div>

          {/* odpowiedzi */}
          <div
            className="lg:col-span-7 lg:border-l lg:pl-8"
            style={{ borderColor: GOLD_SOFT }}
          >
            {hasOptions && (
              <>
                <div style={{ borderBottom: "0.5px solid rgba(184,146,77,0.15)" }}>
                  {question.options!.map((opt, i) => {
                    const isCorrect = i === correctIdx;
                    const isPicked = answered && Number(answered.given) === i;
                    const state: "idle" | "correct" | "wrong" = answered
                      ? isCorrect
                        ? "correct"
                        : isPicked
                        ? "wrong"
                        : "idle"
                      : "idle";
                    return (
                      <QuizAnswerV3
                        key={i}
                        letter={LETTERS[i] ?? `${i + 1}.`}
                        text={opt}
                        state={state}
                        disabled={Boolean(answered)}
                        onSelect={() => pickOption(i)}
                      />
                    );
                  })}
                </div>
                <div
                  className="signature"
                  style={{
                    marginTop: 12,
                    textAlign: "right",
                    color: answered
                      ? answered.correct
                        ? "var(--c-gold-300)"
                        : "rgba(228,214,186,0.6)"
                      : "rgba(228,214,186,0.5)",
                    opacity: answered ? 1 : 0.6,
                  }}
                >
                  {answered
                    ? answered.correct
                      ? "Odpowiedź zapisana ✓"
                      : "Zapisane — wraca na powtórkę"
                    : "Wybierz odpowiedź"}
                </div>
              </>
            )}

            {/* odpowiedź tekstowa */}
            {!hasOptions && !answered && (
              <form onSubmit={submitText} className="space-y-4" style={{ paddingTop: 4 }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  autoComplete="off"
                  className="w-full signature"
                  placeholder="Wpisz odpowiedź..."
                  style={{
                    background: "rgba(228,214,186,0.03)",
                    border: `0.5px solid ${GOLD_SOFT}`,
                    color: "var(--c-paper-100)",
                    padding: "13px 16px",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="eyebrow disabled:opacity-50"
                  style={{
                    color: "var(--c-gold-300)",
                    border: "1px solid rgba(184,146,77,0.4)",
                    background: "transparent",
                    padding: "12px 22px",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    cursor: "pointer",
                  }}
                >
                  Sprawdź
                </button>
              </form>
            )}

            {!hasOptions && answered && (
              <div style={{ paddingTop: 4 }}>
                <div
                  className="font-display italic font-medium"
                  style={{
                    fontSize: 22,
                    color: answered.correct ? "var(--c-gold-300)" : "#c14430",
                    lineHeight: 1.2,
                  }}
                >
                  {answered.correct ? "Dobrze. ✓" : "Poprawnie:"}
                </div>
                {!answered.correct && (
                  <p
                    className="font-display italic"
                    style={{
                      color: "var(--c-paper-100)",
                      fontSize: 19,
                      marginTop: 6,
                      lineHeight: 1.3,
                    }}
                  >
                    {String(question.correctAnswer)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* objaśnienie + zaproszenie do sesji */}
        {answered && (
          <div
            style={{
              borderTop: `0.5px solid ${GOLD_SOFT}`,
              padding: "16px 24px 18px",
            }}
          >
            {question.explanation && (
              <p
                className="caption"
                style={{
                  color: "rgba(228,214,186,0.6)",
                  lineHeight: 1.55,
                  marginBottom: 14,
                  maxWidth: 640,
                }}
              >
                {question.explanation}
              </p>
            )}
            <div
              className="flex items-center justify-between flex-wrap"
              style={{ gap: 12 }}
            >
              <span
                className="font-display italic"
                style={{
                  color: "rgba(228,214,186,0.75)",
                  fontSize: 17,
                  maxWidth: 340,
                }}
              >
                {answered.correct
                  ? "Skoro już jesteś — dokończ temat."
                  : "Skoro już tu jesteś — odśwież to na spokojnie."}
              </span>
              <Link
                href={`/study/session/new?topic=${topic.id}&mode=topic`}
                className="eyebrow inline-flex items-center"
                style={{
                  gap: 8,
                  color: "var(--c-gold-300)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Sesja 15 min <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
