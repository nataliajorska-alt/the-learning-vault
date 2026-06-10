"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Timer, ArrowRight, Check, X, ArrowLeft } from "lucide-react";
import { bumpErrorOnAnswer, useErrors } from "@/lib/firestore-data";
import { normalizeAnswer } from "@/lib/answer-normalization";
import type { VaultError } from "@/lib/types";

const QUIZ_SIZE = 10;
const TIME_LIMIT = 10 * 60;

interface Result {
  errorId: string;
  correct: boolean;
  answer: string;
  rehabilitated: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function formatMs(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ErrorsQuizRunner() {
  const errors = useErrors();

  const [queue, setQueue] = useState<VaultError[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [lastRehabilitated, setLastRehabilitated] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [submitting, setSubmitting] = useState(false);
  const [phase, setPhase] = useState<"quiz" | "review">("quiz");

  // Pick initial queue once errors load
  useEffect(() => {
    if (errors && queue === null) {
      setQueue(shuffle(errors).slice(0, QUIZ_SIZE));
    }
  }, [errors, queue]);

  // Timer
  useEffect(() => {
    if (phase !== "quiz" || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [phase, timeLeft]);

  useEffect(() => {
    if (phase === "quiz" && timeLeft === 0 && queue) {
      setPhase("review");
    }
  }, [phase, timeLeft, queue]);

  const current = queue?.[idx];
  const score = useMemo(
    () => results.filter((r) => r.correct).length,
    [results]
  );
  const rehabCount = useMemo(
    () => results.filter((r) => r.rehabilitated).length,
    [results]
  );

  async function submit() {
    if (!current || revealed || submitting) return;
    const correct =
      normalizeAnswer(input) === normalizeAnswer(current.correctVersion);
    setSubmitting(true);
    setLastCorrect(correct);

    try {
      const { rehabilitated } = await bumpErrorOnAnswer({
        errorId: current.id,
        correct,
        givenAnswer: input,
      });
      setLastRehabilitated(rehabilitated);
      setResults((prev) => [
        ...prev,
        { errorId: current.id, correct, answer: input, rehabilitated },
      ]);
      setRevealed(true);
    } catch (e) {
      console.error("bumpErrorOnAnswer failed", e);
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    setRevealed(false);
    setLastCorrect(null);
    setLastRehabilitated(false);
    setInput("");
    if (!queue) return;
    if (idx + 1 >= queue.length) {
      setPhase("review");
    } else {
      setIdx((i) => i + 1);
    }
  }

  if (errors === null) {
    return <p className="hero-italic text-2xl text-muted animate-candle">Ładuję...</p>;
  }

  if (errors.length === 0) {
    return (
      <div className="card max-w-xl">
        <p className="hero-italic text-2xl">Nic tu nie zalega.</p>
        <p className="text-sm text-muted mt-3">
          Najpierw popełnij parę błędów w zwykłej sesji, potem wróć.
        </p>
        <Link href="/study" className="btn-ghost mt-6">
          Sesja nauki
        </Link>
      </div>
    );
  }

  if (!queue) {
    return <p className="hero-italic text-2xl text-muted animate-candle">Ładuję kolejkę...</p>;
  }

  return (
    <div className="-mx-6 md:-mx-12 -mt-10 md:-mt-12 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(184,146,77,0.07) 1px, transparent 1.5px)",
          backgroundSize: "32px 32px",
          opacity: 0.48,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 48% at 50% 8%, rgba(139,46,31,0.16), transparent 62%), radial-gradient(ellipse 80% 70% at 50% 56%, transparent 40%, rgba(0,0,0,0.50) 100%)",
        }}
      />

      <div className="relative" style={{ zIndex: 1, padding: "34px 24px 56px" }}>
        <Link
          href="/errors"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Error Vault
        </Link>

        <header
          className="flex items-end justify-between gap-6 flex-wrap"
          style={{ marginTop: 34, marginBottom: 30 }}
        >
          <div style={{ maxWidth: 720 }}>
            <div className="eyebrow" style={{ color: "var(--c-ink2)", marginBottom: 14 }}>
              Errata · rehabilitacja aktywnych wpisów
            </div>
            <h1
              className="font-display italic"
              style={{
                fontSize: "clamp(38px, 6vw, 62px)",
                color: "var(--c-paper-100)",
                lineHeight: 0.98,
                fontWeight: 600,
              }}
            >
              Quiz z błędów
            </h1>
          </div>
          {phase === "quiz" && (
            <div
              className="flex items-center gap-2 shrink-0"
              style={{
                color: timeLeft < 60 ? "var(--c-ink2)" : "var(--c-paper-300)",
                border: "1px solid rgba(184,146,77,0.28)",
                padding: "10px 13px",
                background: "rgba(27,17,8,0.36)",
              }}
            >
              <Timer className="w-4 h-4" />
              <span className="tabular-nums signature">{formatMs(timeLeft)}</span>
            </div>
          )}
        </header>

        {phase === "quiz" && current && (
          <section
            className="tex-paper tex-noise-fine relative"
            style={{
              maxWidth: 760,
              padding: "30px 32px",
              boxShadow:
                "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 28px 58px -24px rgba(0,0,0,0.76)",
            }}
          >
            <div
              className="flex items-center justify-between flex-wrap"
              style={{
                gap: 16,
                marginBottom: 22,
                borderBottom: "0.5px solid rgba(27,17,8,0.18)",
                paddingBottom: 12,
              }}
            >
              <div className="eyebrow" style={{ color: "rgba(122,74,31,0.76)" }}>
                Pytanie {idx + 1} / {queue.length}
              </div>
              <div className="signature" style={{ color: "rgba(27,17,8,0.52)" }}>
                {score} trafione
                {rehabCount > 0 ? ` · ${rehabCount} zrehabilitowane` : ""}
              </div>
            </div>

            <div className="eyebrow" style={{ color: "rgba(139,46,31,0.76)" }}>
              {current.vaultName}
            </div>
            <p
              className="font-display italic"
              style={{
                color: "#1B1108",
                fontSize: "clamp(24px, 4vw, 34px)",
                lineHeight: 1.12,
                fontWeight: 600,
                marginTop: 8,
              }}
            >
              {current.context}
            </p>
            <p
              className="caption"
              style={{ color: "rgba(27,17,8,0.62)", marginTop: 13 }}
            >
              Kiedyś wpisałaś:{" "}
              <span style={{ textDecoration: "line-through" }}>
                {current.wrongVersion}
              </span>
              . Jak powinno brzmieć?
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="mt-6 space-y-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={revealed || submitting}
                autoFocus
                className="w-full book-input"
                placeholder="Wpisz poprawną wersję..."
              />
              {!revealed && (
                <button
                  type="submit"
                  disabled={submitting || !input.trim()}
                  className="vault-paper-action disabled:opacity-60"
                >
                  Sprawdź
                </button>
              )}
            </form>

            {revealed && (
              <div
                style={{
                  marginTop: 24,
                  borderTop: "0.5px dashed rgba(27,17,8,0.24)",
                  paddingTop: 20,
                }}
              >
                <div className="flex items-start gap-3">
                  {lastCorrect ? (
                    <Check className="w-5 h-5 text-gold stroke-[2] mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-danger stroke-[2] mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div
                      className="font-display italic"
                      style={{ color: "#1B1108", fontSize: 22 }}
                    >
                      {lastCorrect
                        ? lastRehabilitated
                          ? "Tak. Trzeci raz z rzędu — karta wypisana z erraty."
                          : "Tak. Ślad się prostuje."
                        : "Nie. Poprawnie:"}
                    </div>
                    {lastRehabilitated && (
                      <div style={{ marginTop: 14, marginBottom: 2 }}>
                        <span className="rehab-stamp">
                          <span className="rehab-stamp-top">Errata · §</span>
                          <span className="rehab-stamp-main">Rehabilitowane</span>
                        </span>
                      </div>
                    )}
                    {!lastCorrect && (
                      <p
                        className="font-display italic"
                        style={{ color: "#1B1108", marginTop: 8, fontSize: 20 }}
                      >
                        {current.correctVersion}
                      </p>
                    )}
                    <p
                      className="caption"
                      style={{ color: "rgba(27,17,8,0.58)", marginTop: 8 }}
                    >
                      {current.context}
                    </p>
                  </div>
                </div>
                <button onClick={next} className="vault-paper-action mt-6">
                  {idx + 1 >= queue.length ? "Korekta" : "Następne"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>
        )}

        {phase === "review" && (
          <section
            className="tex-paper tex-noise-fine relative"
            style={{
              maxWidth: 760,
              padding: "30px 32px",
              boxShadow:
                "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 28px 58px -24px rgba(0,0,0,0.76)",
            }}
          >
            <div className="eyebrow" style={{ color: "rgba(122,74,31,0.76)" }}>
              Podsumowanie
            </div>
            <div
              className="font-display italic"
              style={{ color: "#1B1108", fontSize: 64, lineHeight: 1, marginTop: 8 }}
            >
              {score} <span style={{ color: "rgba(27,17,8,0.34)" }}>/ {queue.length}</span>
            </div>
            <p
              className="caption"
              style={{ color: "rgba(27,17,8,0.62)", marginTop: 10 }}
            >
              {timeLeft === 0
                ? "Czas minął — zapisałam to, co zdążyłaś przejść."
                : rehabCount > 0
                ? `${rehabCount} ${rehabCount === 1 ? "błąd wypadł" : "błędów wypadło"} z Vault.`
                : "Żaden nie wypadł jeszcze z Vault — trzy poprawne pod rząd i znika."}
            </p>

            <div className="mt-8 space-y-3">
              {results.map((r, i) => {
                const e = queue.find((q) => q.id === r.errorId);
                if (!e) return null;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3"
                    style={{
                      borderTop: "0.5px solid rgba(27,17,8,0.15)",
                      paddingTop: 12,
                    }}
                  >
                    {r.correct ? (
                      <Check className="w-4 h-4 text-gold stroke-[2] mt-1" />
                    ) : (
                      <X className="w-4 h-4 text-danger stroke-[2] mt-1" />
                    )}
                    <div className="flex-1">
                      <div
                        className="font-display italic"
                        style={{ color: "#1B1108", fontSize: 18 }}
                      >
                        {e.correctVersion}
                      </div>
                      {!r.correct && (
                        <div
                          className="caption"
                          style={{ color: "rgba(27,17,8,0.54)", marginTop: 3 }}
                        >
                          wpisałaś:{" "}
                          <span style={{ textDecoration: "line-through" }}>
                            {r.answer || "(nic)"}
                          </span>
                        </div>
                      )}
                      {r.rehabilitated && (
                        <div
                          className="text-[10px] uppercase tracking-eyebrow mt-1 inline-flex items-center gap-1"
                          style={{ color: "var(--c-racing, #1f3a26)" }}
                        >
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          Wypisane z erraty
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 mt-8 flex-wrap">
              <Link href="/errors" className="vault-paper-action">
                Wróć do Vault
              </Link>
              <Link href="/" className="vault-paper-action secondary">
                Dashboard
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
