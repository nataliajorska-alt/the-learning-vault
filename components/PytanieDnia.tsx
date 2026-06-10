"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { getQuestionsForTopic } from "@/lib/firestore-data";
import { answersMatch } from "@/lib/answer-normalization";
import type { Question, Topic } from "@/lib/types";

interface Answered {
  correct: boolean;
  given: string;
}

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
    <section className="px-6 md:px-12 lg:px-16 pb-12 md:pb-14">
      <div
        className="flex items-baseline"
        style={{ marginBottom: 18, gap: 20 }}
      >
        <h2
          className="h2"
          style={{
            fontSize: "clamp(24px, 3vw, 32px)",
            color: "var(--c-paper-100)",
          }}
        >
          Pytanie dnia
        </h2>
        <div
          style={{
            flex: 1,
            height: 1,
            background: "rgba(184,146,77,0.3)",
            transform: "translateY(-6px)",
          }}
        />
        <span
          className="signature"
          style={{ color: "var(--c-paper-300)", opacity: 0.6 }}
        >
          10 sekund
        </span>
      </div>

      <div className="notice-card relative" style={{ maxWidth: 720 }}>
        <div className="relative" style={{ zIndex: 2 }}>
          <div
            className="book-eyebrow"
            style={{ color: "rgba(139,46,31,0.78)" }}
          >
            {vaultName} · {topic.title}
          </div>

          <p
            className="font-display italic"
            style={{
              color: "#1B1108",
              fontSize: "clamp(20px, 3vw, 26px)",
              lineHeight: 1.18,
              fontWeight: 600,
              marginTop: 8,
            }}
          >
            {question.text}
          </p>

          {/* Options */}
          {hasOptions && (
            <div className="space-y-2" style={{ marginTop: 18 }}>
              {question.options!.map((opt, i) => {
                const isCorrect = i === correctIdx;
                const isPicked = answered && Number(answered.given) === i;
                const cls = answered
                  ? isCorrect
                    ? "book-option book-option-correct"
                    : isPicked
                    ? "book-option book-option-wrong"
                    : "book-option"
                  : "book-option";
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => pickOption(i)}
                    disabled={Boolean(answered)}
                    className={`${cls} flex items-center gap-2`}
                  >
                    {answered && isCorrect && (
                      <Check className="w-4 h-4 shrink-0" style={{ color: "#2D5A3F" }} />
                    )}
                    {answered && isPicked && !isCorrect && (
                      <X className="w-4 h-4 shrink-0" style={{ color: "#8B2E1F" }} />
                    )}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Text answer */}
          {!hasOptions && !answered && (
            <form onSubmit={submitText} className="space-y-3" style={{ marginTop: 18 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
                className="w-full book-input"
                placeholder="Wpisz odpowiedź..."
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="vault-paper-action disabled:opacity-60"
              >
                Sprawdź
              </button>
            </form>
          )}

          {!hasOptions && answered && (
            <div
              className="flex items-start gap-2"
              style={{ marginTop: 18 }}
            >
              {answered.correct ? (
                <Check className="w-5 h-5 stroke-[2] mt-0.5" style={{ color: "#2D5A3F" }} />
              ) : (
                <X className="w-5 h-5 stroke-[2] mt-0.5" style={{ color: "#8B2E1F" }} />
              )}
              <div>
                <div
                  className="font-display italic"
                  style={{ color: "#1B1108", fontSize: 20 }}
                >
                  {answered.correct ? "Dobrze." : "Poprawnie:"}
                </div>
                {!answered.correct && (
                  <p
                    className="font-display italic"
                    style={{ color: "#1B1108", fontSize: 18, marginTop: 4 }}
                  >
                    {String(question.correctAnswer)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Reveal — explanation + foot-in-the-door */}
          {answered && (
            <div
              style={{
                marginTop: 20,
                paddingTop: 16,
                borderTop: "0.5px dashed rgba(27,17,8,0.24)",
              }}
            >
              {question.explanation && (
                <p
                  className="caption"
                  style={{
                    color: "rgba(27,17,8,0.62)",
                    lineHeight: 1.55,
                    marginBottom: 16,
                  }}
                >
                  {question.explanation}
                </p>
              )}
              <div className="flex items-center justify-between flex-wrap" style={{ gap: 12 }}>
                <span
                  className="font-display italic"
                  style={{ color: "rgba(27,17,8,0.7)", fontSize: 17, maxWidth: 300 }}
                >
                  {answered.correct
                    ? "Skoro już jesteś — dokończ temat."
                    : "Skoro już tu jesteś — odśwież to na spokojnie."}
                </span>
                <Link
                  href={`/study/session/new?topic=${topic.id}&mode=topic`}
                  className="vault-paper-action"
                >
                  Sesja 15 min <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
