"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Timer, ArrowRight, Check, X, ArrowLeft } from "lucide-react";
import { bumpErrorOnAnswer, useErrors } from "@/lib/firestore-data";
import type { VaultError } from "@/lib/types";

const QUIZ_SIZE = 10;
const TIME_LIMIT = 10 * 60;

interface Result {
  errorId: string;
  correct: boolean;
  answer: string;
  rehabilitated: boolean;
}

function normalize(s: string): string {
  return s.trim().toLowerCase();
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
    const correct = normalize(input) === normalize(current.correctVersion);
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
    return <p className="hero-italic text-2xl text-muted">Ładuję...</p>;
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
    return <p className="hero-italic text-2xl text-muted">Ładuję kolejkę...</p>;
  }

  return (
    <div className="space-y-10">
      <Link
        href="/errors"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Error Vault
      </Link>

      <header className="flex items-start justify-between gap-6">
        <div>
          <div className="eyebrow">Twoje błędy</div>
          <h1 className="hero-italic text-4xl mt-1">Quiz z błędów</h1>
        </div>
        {phase === "quiz" && (
          <div className="flex items-center gap-2 text-sm text-muted shrink-0">
            <Timer className="w-4 h-4" />
            <span className="tabular-nums">{formatMs(timeLeft)}</span>
          </div>
        )}
      </header>

      {phase === "quiz" && current && (
        <section className="card max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="eyebrow">
              Pytanie {idx + 1} / {queue.length}
            </div>
            <div className="text-xs text-muted">
              {score} trafione · {rehabCount > 0 ? `${rehabCount} zrehabilitowane` : ""}
            </div>
          </div>

          <div className="eyebrow text-forest/60">{current.vaultName}</div>
          <p className="hero-italic text-2xl text-ink leading-snug mt-2">
            {current.context}
          </p>
          <p className="text-sm text-muted mt-3">
            Kiedyś wpisałaś:{" "}
            <span className="line-through">{current.wrongVersion}</span>. Jak być
            powinno?
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
              className="w-full border border-line rounded px-4 py-3 text-sm bg-cream focus:outline-none focus:border-forest/40"
              placeholder="Wpisz poprawną wersję..."
            />
            {!revealed && (
              <button
                type="submit"
                disabled={submitting || !input.trim()}
                className="btn-primary disabled:opacity-60"
              >
                Sprawdź
              </button>
            )}
          </form>

          {revealed && (
            <div className="mt-6 border-t border-line pt-5">
              <div className="flex items-start gap-3">
                {lastCorrect ? (
                  <Check className="w-5 h-5 text-forest stroke-[2] mt-0.5" />
                ) : (
                  <X className="w-5 h-5 text-danger stroke-[2] mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="hero-italic text-xl">
                    {lastCorrect
                      ? lastRehabilitated
                        ? "Tak. I to trzeci raz z rzędu — wypada z Vault."
                        : "Tak. To samo."
                      : "Nie. Poprawnie:"}
                  </div>
                  {!lastCorrect && (
                    <p className="text-sm text-ink mt-2 hero-italic">
                      {current.correctVersion}
                    </p>
                  )}
                  <p className="text-sm text-muted mt-2">{current.context}</p>
                </div>
              </div>
              <button onClick={next} className="btn-primary mt-6">
                {idx + 1 >= queue.length ? "Korekta" : "Następne"}{" "}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      )}

      {phase === "review" && (
        <section className="card max-w-2xl">
          <div className="eyebrow">Podsumowanie</div>
          <div className="hero-italic text-5xl mt-2">
            {score} <span className="text-muted">/ {queue.length}</span>
          </div>
          <p className="text-muted text-sm mt-3">
            {rehabCount > 0
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
                  className="flex items-start gap-3 border-t border-line pt-3"
                >
                  {r.correct ? (
                    <Check className="w-4 h-4 text-forest stroke-[2] mt-1" />
                  ) : (
                    <X className="w-4 h-4 text-danger stroke-[2] mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm text-ink hero-italic">
                      {e.correctVersion}
                    </div>
                    {!r.correct && (
                      <div className="text-xs text-muted mt-1">
                        wpisałaś:{" "}
                        <span className="line-through">{r.answer || "(nic)"}</span>
                      </div>
                    )}
                    {r.rehabilitated && (
                      <div className="text-[10px] uppercase tracking-eyebrow text-gold mt-1">
                        Zrehabilitowane
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mt-8">
            <Link href="/errors" className="btn-primary">
              Wróć do Vault
            </Link>
            <Link href="/" className="btn-ghost">
              Dashboard
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
