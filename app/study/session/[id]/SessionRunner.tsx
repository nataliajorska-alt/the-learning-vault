"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Timer, ArrowRight, Check, X } from "lucide-react";
import {
  finishSession,
  getQuestionsForTopic,
  getTopic,
  recordAttempt,
  startSession,
  useVaults,
} from "@/lib/firestore-data";
import { useUser } from "@/lib/auth-context";
import type { Question, Topic } from "@/lib/types";

type Phase = "theory" | "test" | "review";
type Mode = "mix" | "errors" | "vault" | "topic";

interface Attempt {
  questionId: string;
  correct: boolean;
  answer: string;
}

const PHASE_DURATION: Record<Phase, number> = {
  theory: 3 * 60,
  test: 10 * 60,
  review: 2 * 60,
};

function formatMs(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function SessionRunner({
  topicId,
  mode,
}: {
  topicId: string | null;
  mode: Mode;
  vaultSlug: string | null;
}) {
  const user = useUser();
  const vaults = useVaults();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  const [phase, setPhase] = useState<Phase>("theory");
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [timeLeft, setTimeLeft] = useState(PHASE_DURATION.theory);
  const [submitting, setSubmitting] = useState(false);
  const sessionStartRef = useRef<number>(Date.now());
  const questionStartRef = useRef<number>(Date.now());
  const finishedRef = useRef(false);

  // Load topic + questions + open session
  useEffect(() => {
    if (!user || !topicId) return;
    let cancelled = false;
    (async () => {
      try {
        const t = await getTopic(topicId);
        if (!t) {
          setLoadErr("Nie znalazłam tego tematu.");
          return;
        }
        if (t.userId !== user.uid) {
          setLoadErr("Ten temat nie należy do ciebie.");
          return;
        }
        const qs = await getQuestionsForTopic(topicId);
        if (cancelled) return;
        setTopic(t);
        setQuestions(qs);

        const sid = await startSession({
          userId: user.uid,
          mode,
          vaultId: t.vaultId,
          topicIds: [t.id],
        });
        if (!cancelled) {
          setSessionId(sid);
          sessionStartRef.current = Date.now();
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setLoadErr(e instanceof Error ? e.message : "Coś poszło nie tak.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, topicId, mode]);

  // phase timer
  useEffect(() => {
    setTimeLeft(PHASE_DURATION[phase]);
  }, [phase]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  useEffect(() => {
    if (phase === "test") questionStartRef.current = Date.now();
  }, [phase, idx]);

  const current = questions?.[idx] ?? null;
  const score = useMemo(
    () => attempts.filter((a) => a.correct).length,
    [attempts]
  );

  const vaultName = useMemo(() => {
    if (!topic || !vaults) return "";
    return vaults.find((v) => v.id === topic.vaultId)?.name ?? "";
  }, [topic, vaults]);

  function checkAnswer(answer: string | number): boolean {
    if (!current) return false;
    if (current.type === "abc" || current.type === "spot_error") {
      return Number(answer) === Number(current.correctAnswer);
    }
    const a = String(answer).trim().toLowerCase();
    const c = String(current.correctAnswer).trim().toLowerCase();
    return a === c;
  }

  async function gradeOpen(answer: string): Promise<{
    correct: boolean;
    feedback: string | null;
  }> {
    if (!current) return { correct: false, feedback: null };
    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          question: current.text,
          modelAnswer: String(current.correctAnswer),
          userAnswer: answer,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as {
        verdict?: "correct" | "partial" | "wrong";
        feedback?: string;
      };
      return {
        correct: data.verdict === "correct",
        feedback: data.feedback ?? null,
      };
    } catch (e) {
      console.error("grade failed, falling back to string match", e);
      return { correct: checkAnswer(answer), feedback: null };
    }
  }

  async function submit(answer: string | number) {
    if (!current || revealed || submitting) return;
    if (!user || !topic || !sessionId) return;
    setSubmitting(true);

    let correct: boolean;
    let aiFeedback: string | null = null;

    if (current.type === "open") {
      const result = await gradeOpen(String(answer));
      correct = result.correct;
      aiFeedback = result.feedback;
    } else {
      correct = checkAnswer(answer);
    }

    const timeTaken = Math.round(
      (Date.now() - questionStartRef.current) / 1000
    );

    setLastCorrect(correct);
    setLastFeedback(aiFeedback);
    setRevealed(true);
    setAttempts((prev) => [
      ...prev,
      { questionId: current.id, correct, answer: String(answer) },
    ]);

    try {
      await recordAttempt({
        userId: user.uid,
        sessionId,
        topic,
        question: current,
        answer: String(answer),
        correct,
        timeTaken,
        vaultName,
      });
    } catch (e) {
      console.error("recordAttempt failed", e);
    } finally {
      setSubmitting(false);
    }
  }

  async function next() {
    if (!questions) return;
    setRevealed(false);
    setLastCorrect(null);
    setLastFeedback(null);
    setInput("");
    if (idx + 1 >= questions.length) {
      setPhase("review");
      await maybeFinish();
    } else {
      setIdx((i) => i + 1);
    }
  }

  async function maybeFinish() {
    if (finishedRef.current || !sessionId) return;
    finishedRef.current = true;
    const duration = Math.round((Date.now() - sessionStartRef.current) / 1000);
    try {
      await finishSession(sessionId, {
        attempted: attempts.length,
        correct: attempts.filter((a) => a.correct).length,
        duration,
      });
    } catch (e) {
      console.error("finishSession failed", e);
    }
  }

  if (!topicId) {
    return (
      <div className="card max-w-xl">
        <p className="hero-italic text-2xl">
          Wybierz konkretny temat z listy sekcji.
        </p>
        <p className="text-sm text-muted mt-3">
          Sesja "mix" w pełnej wersji dobierze temat sama (kolejna iteracja).
          Na razie kliknij temat w widoku sekcji.
        </p>
        <Link href="/vaults" className="btn-primary mt-6">
          Sekcje
        </Link>
      </div>
    );
  }

  if (loadErr) {
    return (
      <div className="card max-w-xl">
        <p className="hero-italic text-2xl text-danger">{loadErr}</p>
        <Link href="/study" className="btn-ghost mt-6">
          Wróć
        </Link>
      </div>
    );
  }

  if (!topic || !questions) {
    return (
      <p className="hero-italic text-2xl text-muted">Ładuję sesję...</p>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="card max-w-xl">
        <p className="hero-italic text-2xl">Ten temat nie ma jeszcze pytań.</p>
        <p className="text-sm text-muted mt-3">
          Wklej notatki w sekcji Admin (faza 5), wtedy AI wygeneruje pytania.
        </p>
        <Link href="/vaults" className="btn-ghost mt-6">
          Sekcje
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="flex items-start justify-between gap-6">
        <div>
          <div className="eyebrow">{phaseLabel(phase)}</div>
          <h1 className="hero-italic text-4xl mt-1">{topic.title}</h1>
          {vaultName && <div className="text-xs text-muted mt-1">{vaultName}</div>}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted shrink-0">
          <Timer className="w-4 h-4" />
          <span className="tabular-nums">{formatMs(timeLeft)}</span>
        </div>
      </header>

      {phase === "theory" && (
        <section className="card max-w-2xl">
          <div className="eyebrow mb-4">Teoria</div>
          <p className="hero-italic text-2xl text-ink mb-6 leading-snug">
            {topic.summary}
          </p>
          <div className="prose-old-money text-sm">
            <p>{topic.theory}</p>
          </div>
          <button onClick={() => setPhase("test")} className="btn-primary mt-8">
            Gotowa, przejdź do testu <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      )}

      {phase === "test" && current && (
        <section className="card max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="eyebrow">
              Pytanie {idx + 1} / {questions.length}
            </div>
            <div className="text-xs text-muted">{score} trafione</div>
          </div>

          <p className="hero-italic text-2xl text-ink leading-snug">
            {current.text}
          </p>

          <div className="mt-6 space-y-2">
            {current.type === "abc" || current.type === "spot_error" ? (
              (current.options ?? []).map((opt, i) => {
                const isCorrect = i === Number(current.correctAnswer);
                const picked = attempts.find(
                  (a) => a.questionId === current.id
                );
                const isPicked = picked && Number(picked.answer) === i;
                return (
                  <button
                    key={i}
                    onClick={() => submit(i)}
                    disabled={revealed || submitting}
                    className={`w-full text-left px-4 py-3 rounded border text-sm transition-all duration-200 ${
                      revealed && isCorrect
                        ? "border-gold/40 bg-gold/5"
                        : revealed && isPicked
                        ? "border-danger/40 bg-danger/5"
                        : "border-line hover:border-gold/30"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit(input);
                }}
                className="space-y-3"
              >
                {current.type === "open" ? (
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={revealed || submitting}
                    rows={3}
                    className="w-full border border-line rounded px-4 py-3 text-sm bg-cream focus:outline-none focus:border-gold/40"
                    placeholder="Krótka odpowiedź..."
                  />
                ) : (
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={revealed || submitting}
                    className="w-full border border-line rounded px-4 py-3 text-sm bg-cream focus:outline-none focus:border-gold/40"
                    placeholder="Wpisz odpowiedź..."
                  />
                )}
                {!revealed && (
                  <button type="submit" disabled={submitting} className="btn-primary">
                    Sprawdź
                  </button>
                )}
              </form>
            )}
          </div>

          {revealed && (
            <div className="mt-6 border-t border-line pt-5">
              <div className="flex items-start gap-3">
                {lastCorrect ? (
                  <Check className="w-5 h-5 text-gold stroke-[2] mt-0.5" />
                ) : (
                  <X className="w-5 h-5 text-danger stroke-[2] mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="hero-italic text-xl">
                    {lastCorrect ? "Tak. To samo." : "Nie. Tu jest sedno:"}
                  </div>
                  {lastFeedback && (
                    <p className="text-sm text-ink mt-2 italic">
                      {lastFeedback}
                    </p>
                  )}
                  <p className="text-sm text-muted mt-2">
                    {current.explanation}
                  </p>
                  {!lastCorrect && (
                    <p className="text-sm text-ink mt-2">
                      Poprawna:{" "}
                      <span className="hero-italic">
                        {current.type === "abc" || current.type === "spot_error"
                          ? (current.options ?? [])[
                              Number(current.correctAnswer)
                            ]
                          : String(current.correctAnswer)}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <button onClick={next} className="btn-primary mt-6">
                {idx + 1 >= questions.length ? "Korekta" : "Następne"}{" "}
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
            {score} <span className="text-muted">/ {questions.length}</span>
          </div>
          <p className="text-muted text-sm mt-3">
            {attempts.length - score === 0
              ? "Bez błędów. Temat wraca później."
              : `${attempts.length - score} ${
                  attempts.length - score === 1
                    ? "błąd poszedł"
                    : "błędy poszły"
                } do Error Vault.`}
          </p>

          <div className="mt-8 space-y-3">
            {attempts.map((a, i) => {
              const q = questions.find((x) => x.id === a.questionId);
              if (!q) return null;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 border-t border-line pt-3"
                >
                  {a.correct ? (
                    <Check className="w-4 h-4 text-gold stroke-[2] mt-1" />
                  ) : (
                    <X className="w-4 h-4 text-danger stroke-[2] mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm text-ink">{q.text}</div>
                    {!a.correct && (
                      <div className="text-xs text-muted mt-1">
                        {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Link href="/" className="btn-primary mt-8">
            Zakończ
          </Link>
        </section>
      )}
    </div>
  );
}

function phaseLabel(p: Phase) {
  if (p === "theory") return "Etap 1 · Teoria";
  if (p === "test") return "Etap 2 · Test";
  return "Etap 3 · Korekta";
}
