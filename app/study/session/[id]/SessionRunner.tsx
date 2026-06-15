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
  useSessions,
  useTopics,
  useVaults,
} from "@/lib/firestore-data";
import {
  awardP30Xp,
  pillarForVaultSlug,
  P30_PILLAR_LABELS,
} from "@/lib/projekt30-xp";
import { useUser } from "@/lib/auth-context";
import { answersMatch } from "@/lib/answer-normalization";
import {
  reviewDateLabel,
  topicQueueReason,
  topicStatusLabel,
} from "@/lib/learning-copy";
import { TheoryPhase } from "@/components/session/TheoryPhase";
import { TestPhase } from "@/components/session/TestPhase";
import { KorektaPhase } from "@/components/session/KorektaPhase";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import type { Question, Topic, Vault } from "@/lib/types";
import type { Verdict } from "@/lib/spaced-repetition";
import type { Timestamp } from "firebase/firestore";
import {
  clearSavedSession,
  isResumable,
  loadSavedSession,
  saveSession,
} from "@/lib/session-persistence";
import type {
  SessionAttempt as Attempt,
  SessionMode as Mode,
  SessionPhase as Phase,
} from "@/lib/session-persistence";

function toMillis(v: unknown): number {
  if (!v) return 0;
  if (v instanceof Date) return v.getTime();
  if (typeof v === "object" && v && "toMillis" in v) {
    return (v as Timestamp).toMillis();
  }
  return 0;
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

function correctAnswerText(question: Question): string {
  if (question.type === "abc" || question.type === "spot_error") {
    return (
      (question.options ?? [])[Number(question.correctAnswer)] ??
      String(question.correctAnswer)
    );
  }
  return String(question.correctAnswer);
}

/** Z puli tematów wybiera ten do sesji: najpierw zaległe (due/fresh/struggling)
 *  posortowane wg nextReview, w ostateczności pierwszy z brzegu. */
function pickTopic(pool: Topic[]): string | null {
  if (pool.length === 0) return null;
  const now = Date.now();
  const due = pool
    .filter(
      (t) =>
        t.status === "fresh" ||
        t.status === "struggling" ||
        toMillis(t.nextReview) <= now
    )
    .sort((a, b) => toMillis(a.nextReview) - toMillis(b.nextReview));
  return (due[0] ?? pool[0]).id;
}

export function SessionRunner({
  topicId,
  mode,
  vaultSlug,
  questionLimit,
}: {
  topicId: string | null;
  mode: Mode;
  vaultSlug: string | null;
  questionLimit: number | null;
}) {
  const user = useUser();
  const vaults = useVaults();
  const allTopics = useTopics();
  const allSessions = useSessions(3650);

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
  const [syncIssueCount, setSyncIssueCount] = useState(0);
  const [sessionEffects, setSessionEffects] = useState({
    errorsAdded: 0,
    errorsReinforced: 0,
    errorsRehabilitated: 0,
    rehabProgress: 0,
  });
  const sessionStartRef = useRef<number>(Date.now());
  const questionStartRef = useRef<number>(Date.now());
  const finishedRef = useRef(false);
  const appliedRef = useRef(false);
  const initialTopicRef = useRef<Topic | null>(null);
  const attemptsRef = useRef<Attempt[]>([]);
  const testStartRef = useRef<number | null>(null);
  const testEndRef = useRef<number | null>(null);
  const korektaStartRef = useRef<number | null>(null);

  /* Temat do sesji: jeśli podany w URL — bierzemy go wprost. W przeciwnym razie
     system dobiera sam — w trybie "vault" z wybranej sekcji, w pozostałych
     z całej puli. Null oznacza "jeszcze nie wiadomo" (dane się ładują) albo
     "brak materiału" (pusta pula) — rozróżnia to dalej logika renderu. */
  const resolvedTopicId = useMemo(() => {
    if (topicId) return topicId;
    if (!allTopics) return null;
    if (mode === "vault") {
      if (!vaults) return null;
      const v = vaultSlug ? vaults.find((x) => x.slug === vaultSlug) : null;
      if (!v) return null;
      return pickTopic(allTopics.filter((t) => t.vaultId === v.id));
    }
    return pickTopic(allTopics);
  }, [topicId, allTopics, vaults, mode, vaultSlug]);

  /* Niedokończona sesja z localStorage — wznawiamy ją zamiast otwierać nową,
     żeby odświeżenie/zamknięcie karty nie tworzyło duplikatu sesji ani nie
     kazało odpowiadać drugi raz na te same pytania (co psułoby SRS i błędy). */
  const restored = useMemo(() => {
    if (!user) return null;
    const saved = loadSavedSession(user.uid);
    return isResumable(saved, { topicId, mode, vaultSlug, questionLimit })
      ? saved
      : null;
  }, [user, topicId, mode, vaultSlug, questionLimit]);

  const targetTopicId = restored ? restored.topicId : resolvedTopicId;

  // Load topic + questions, then resume saved session or open a new one
  useEffect(() => {
    if (!user || !targetTopicId || appliedRef.current) return;
    let cancelled = false;
    (async () => {
      try {
        const t = await getTopic(targetTopicId);
        if (!t) {
          setLoadErr("Nie znalazłam tego tematu.");
          return;
        }
        if (t.userId !== user.uid) {
          setLoadErr("Ten temat nie należy do ciebie.");
          return;
        }
        const qs = await getQuestionsForTopic(targetTopicId);
        if (cancelled) return;
        const sessionQuestions =
          questionLimit && questionLimit > 0 ? qs.slice(0, questionLimit) : qs;
        setTopic(t);
        initialTopicRef.current = t;
        setQuestions(sessionQuestions);

        if (restored) {
          appliedRef.current = true;
          setSessionId(restored.sessionId);
          setPhase(restored.phase);
          setIdx(restored.idx);
          setAttempts(restored.attempts);
          attemptsRef.current = restored.attempts;
          sessionStartRef.current = restored.sessionStartMs;
          testStartRef.current = restored.testStartMs;
          testEndRef.current = restored.testEndMs;
          korektaStartRef.current = restored.korektaStartMs;
          // Faza korekty = test już zaliczony i (z reguły) sfinalizowany.
          // Nie wznawiamy finalizacji, by nie naliczyć XP drugi raz.
          if (restored.phase === "review") {
            finishedRef.current = true;
            clearSavedSession(user.uid);
          }
          return;
        }

        const sid = await startSession({
          userId: user.uid,
          mode,
          vaultId: t.vaultId,
          topicIds: [t.id],
        });
        if (!cancelled) {
          appliedRef.current = true;
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
  }, [user, targetTopicId, mode, restored, questionLimit]);

  // Persist in-progress session so a refresh resumes instead of restarting.
  useEffect(() => {
    if (!user || !sessionId || !topic || finishedRef.current) return;
    saveSession({
      v: 1,
      uid: user.uid,
      sessionId,
      topicId: topic.id,
      mode,
      vaultSlug: vaultSlug ?? null,
      phase,
      idx,
      attempts,
      sessionStartMs: sessionStartRef.current,
      testStartMs: testStartRef.current,
      testEndMs: testEndRef.current,
      korektaStartMs: korektaStartRef.current,
      questionLimit,
      savedAt: Date.now(),
    });
  }, [user, sessionId, topic, mode, vaultSlug, phase, idx, attempts, questionLimit]);

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

  /* Resolve current vault + on-deck queue (declared up here to keep hook
     order stable across all early returns below). */
  const currentVault: Vault | null =
    (topic && vaults?.find((v) => v.id === topic.vaultId)) ?? null;

  const onDeck = useMemo(() => {
    if (
      (phase !== "theory" && phase !== "review") ||
      !topic ||
      !allTopics ||
      !vaults
    )
      return [];
    const now = Date.now();
    const due = allTopics.filter(
      (t) =>
        t.id !== topic.id &&
        (t.status === "fresh" ||
          t.status === "struggling" ||
          toMillis(t.nextReview) <= now)
    );
    return due.slice(0, 2).map((t) => {
      const v = vaults.find((x) => x.id === t.vaultId);
      return {
        topicId: t.id,
        title: t.title,
        vaultName: v?.name ?? "—",
        vaultSlug: v?.slug ?? "",
      };
    });
  }, [phase, topic, allTopics, vaults]);

  function checkAnswer(answer: string | number): boolean {
    if (!current) return false;
    if (current.type === "abc" || current.type === "spot_error") {
      return Number(answer) === Number(current.correctAnswer);
    }
    return answersMatch(String(answer), String(current.correctAnswer));
  }

  async function gradeOpen(answer: string): Promise<{
    verdict: Verdict;
    feedback: string | null;
    aiUnavailable: boolean;
  }> {
    if (!current) return { verdict: "wrong", feedback: null, aiUnavailable: false };
    try {
      const idToken = (await user?.getIdToken()) ?? "";
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          question: current.text,
          modelAnswer: String(current.correctAnswer),
          userAnswer: answer,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as {
        verdict?: Verdict;
        feedback?: string;
      };
      const verdict: Verdict =
        data.verdict === "correct" || data.verdict === "partial"
          ? data.verdict
          : "wrong";
      return { verdict, feedback: data.feedback ?? null, aiUnavailable: false };
    } catch (e) {
      // Ocena AI padła (sieć / 429 / błąd modelu) — spadamy na dosłowne
      // porównanie tekstu i sygnalizujemy to userce, bo przy pytaniu otwartym
      // dosłowny match bywa zbyt surowy (false negative).
      console.error("grade failed, falling back to string match", e);
      return {
        verdict: checkAnswer(answer) ? "correct" : "wrong",
        feedback: null,
        aiUnavailable: true,
      };
    }
  }

  async function explainWrong(answer: string, question: Question): Promise<string> {
    const fallback = `Pułapka jest tutaj: ${question.explanation} Poprawna wersja: ${correctAnswerText(question)}.`;
    try {
      const idToken = (await user?.getIdToken()) ?? "";
      const res = await fetch("/api/wrong-note", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          question: question.text,
          questionType: question.type,
          modelAnswer: correctAnswerText(question),
          userAnswer: answer,
          explanation: question.explanation,
          skill: question.skill,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { feedback?: string };
      return data.feedback?.trim() || fallback;
    } catch (e) {
      console.error("wrong-note failed, using fallback", e);
      return fallback;
    }
  }

  async function submit(answer: string | number) {
    if (!current || revealed || submitting) return;
    if (!user || !topic || !sessionId) return;
    setSubmitting(true);

    let verdict: Verdict;
    let aiFeedback: string | null = null;

    if (current.type === "open") {
      const result = await gradeOpen(String(answer));
      verdict = result.verdict;
      aiFeedback = result.aiUnavailable
        ? "Ocena AI była chwilowo niedostępna — sprawdziłam tylko dosłowne brzmienie. Przy pytaniu otwartym potraktuj ten werdykt orientacyjnie."
        : result.feedback;
    } else {
      verdict = checkAnswer(answer) ? "correct" : "wrong";
    }

    if (verdict === "wrong") {
      aiFeedback = await explainWrong(String(answer), current);
    }

    // partial liczymy jako zaliczenie (zielony ptaszek + feedback co dodać),
    // ale w SRS/Error Vault jest traktowany łagodnie — patrz recordAttempt.
    const correct = verdict !== "wrong";

    const timeTaken = Math.round(
      (Date.now() - questionStartRef.current) / 1000
    );
    const nextAttempt: Attempt = {
      questionId: current.id,
      correct,
      answer: String(answer),
      verdict,
      timeTaken,
    };

    setLastCorrect(correct);
    setLastFeedback(aiFeedback);
    setRevealed(true);
    setAttempts((prev) => {
      const nextAttempts = [...prev, nextAttempt];
      attemptsRef.current = nextAttempts;
      return nextAttempts;
    });

    try {
      const result = await recordAttempt({
        userId: user.uid,
        sessionId,
        topic,
        question: current,
        answer: String(answer),
        verdict,
        timeTaken,
        vaultName,
      });
      setTopic(result.topic);
      setSessionEffects((prev) => {
        if (result.error.kind === "created") {
          return { ...prev, errorsAdded: prev.errorsAdded + 1 };
        }
        if (result.error.kind === "reinforced") {
          return { ...prev, errorsReinforced: prev.errorsReinforced + 1 };
        }
        if (result.error.kind === "rehabilitated") {
          return { ...prev, errorsRehabilitated: prev.errorsRehabilitated + 1 };
        }
        if (result.error.kind === "rehab_progress") {
          return { ...prev, rehabProgress: prev.rehabProgress + 1 };
        }
        return prev;
      });
    } catch (e) {
      console.error("recordAttempt failed", e);
      setSyncIssueCount((n) => n + 1);
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
      testEndRef.current = Date.now();
      korektaStartRef.current = Date.now();
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
    const finalAttempts = attemptsRef.current;
    const correctCount = finalAttempts.filter((a) => a.correct).length;
    try {
      await finishSession(sessionId, {
        attempted: finalAttempts.length,
        correct: correctCount,
        duration,
      });
    } catch (e) {
      console.error("finishSession failed", e);
    }
    // Best-effort XP do Projekt 30:
    // 25 baseXP za skończoną sesję + 1 XP za każdą poprawną odpowiedź (max 8).
    // Filar wg vault.slug topica. Topic single per session w obecnym MVP.
    if (topic && vaults) {
      const vault = vaults.find((v) => v.id === topic.vaultId);
      const correctBonus = Math.min(correctCount, 8);
      const baseXp = questionLimit && questionLimit <= 3 ? 10 : 25;
      void awardP30Xp({
        xp: baseXp + correctBonus,
        source: "vault:finish-session",
        pillar: pillarForVaultSlug(vault?.slug),
      });
    }
    if (user) clearSavedSession(user.uid);
  }

  // Tryb "konkretna sekcja" bez wybranej sekcji — pokaż wybór półki.
  if (mode === "vault" && !vaultSlug && !topicId) {
    return <SectionPicker vaults={vaults} topics={allTopics} />;
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

  // Dane gotowe, ale nie udało się dobrać tematu → brak materiału w puli.
  const dataReady = allTopics !== null && (mode !== "vault" || vaults !== null);
  if (!targetTopicId && dataReady) {
    return (
      <div className="card max-w-xl">
        <p className="hero-italic text-2xl">
          {mode === "vault"
            ? "Ta sekcja nie ma jeszcze żadnego tematu."
            : "Nie ma jeszcze żadnego tematu do nauki."}
        </p>
        <p className="text-sm text-muted mt-3">
          Wklej notatki w sekcji Admin, a AI wygeneruje strukturę i pytania.
        </p>
        <Link href="/vaults" className="btn-ghost mt-6">
          Sekcje
        </Link>
      </div>
    );
  }

  if (!topic || !questions) {
    return <PageSkeleton rows={3} />;
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

  const sessionReceipt = buildSessionReceipt({
    topic,
    initialTopic: initialTopicRef.current,
    attempts,
    sessionEffects,
    syncIssueCount,
    vaultSlug: currentVault?.slug ?? null,
    compact: Boolean(questionLimit && questionLimit <= 3),
  });
  const queueReason = topicQueueReason(topic);

  // Numer domkniętej sesji na lakową pieczęć: wszystkie zakończone sesje plus
  // ta bieżąca (liczona po id, nawet zanim endedAt dotrze ze snapshotu).
  const sessionNumber = allSessions
    ? allSessions.filter((s) => s.endedAt != null || s.id === sessionId).length
    : null;

  const liveMsg = revealed
    ? (lastCorrect ? "Poprawnie." : "Niepoprawnie.") +
      (lastFeedback ? ` ${lastFeedback}` : "")
    : phase === "theory"
    ? "Faza teorii."
    : phase === "test"
    ? `Pytanie ${idx + 1} z ${questions?.length ?? 0}.`
    : phase === "review"
    ? "Faza korekty — podsumowanie sesji."
    : "";

  return (
    <div className="space-y-10">
      {/* Ogłoszenia dla czytnika ekranu: faza / numer pytania / werdykt */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {liveMsg}
      </div>
      {phase !== "theory" && phase !== "test" && phase !== "review" && (
        <header className="flex items-start justify-between gap-6">
          <div>
            <div className="eyebrow">{phaseLabel(phase)}</div>
            <h1 className="hero-italic text-4xl mt-1">{topic.title}</h1>
            {vaultName && (
              <div className="text-xs text-muted mt-1">{vaultName}</div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted shrink-0">
            <Timer className="w-4 h-4" />
            <span className="tabular-nums">{formatMs(timeLeft)}</span>
          </div>
        </header>
      )}

      {phase === "theory" && (
        <TheoryPhase
          topic={topic}
          vault={currentVault}
          queueReason={queueReason}
          compact={Boolean(questionLimit && questionLimit <= 3)}
          elapsedSec={Math.max(0, PHASE_DURATION.theory - timeLeft)}
          totalSec={PHASE_DURATION.theory}
          onProceed={() => {
            testStartRef.current = Date.now();
            setPhase("test");
          }}
          onDeck={onDeck}
        />
      )}

      {phase === "test" && questions && (
        <TestPhase
          topic={topic}
          vault={currentVault}
          questions={questions}
          attempts={attempts}
          currentIdx={idx}
          revealed={revealed}
          lastCorrect={lastCorrect}
          lastFeedback={lastFeedback}
          input={input}
          setInput={setInput}
          submitting={submitting}
          elapsedSec={Math.max(0, PHASE_DURATION.test - timeLeft)}
          totalSec={PHASE_DURATION.test}
          compact={Boolean(questionLimit && questionLimit <= 3)}
          onSubmit={submit}
          onAdvance={next}
        />
      )}

      {phase === "review" && questions && (
        <KorektaPhase
          topic={topic}
          vault={currentVault}
          questions={questions}
          attempts={attempts}
          testElapsedSec={Math.max(
            0,
            Math.round(
              ((testEndRef.current ?? Date.now()) -
                (testStartRef.current ?? Date.now())) /
                1000
            )
          )}
          testBudgetSec={PHASE_DURATION.test}
          korektaElapsedSec={Math.max(
            0,
            Math.round(
              (Date.now() - (korektaStartRef.current ?? Date.now())) / 1000
            )
          )}
          korektaBudgetSec={PHASE_DURATION.review}
          onDeck={onDeck}
          receipt={sessionReceipt}
          closeHref="/"
          sessionNumber={sessionNumber}
        />
      )}
    </div>
  );
}

function buildSessionReceipt(opts: {
  topic: Topic;
  initialTopic: Topic | null;
  attempts: Attempt[];
  sessionEffects: {
    errorsAdded: number;
    errorsReinforced: number;
    errorsRehabilitated: number;
    rehabProgress: number;
  };
  syncIssueCount: number;
  vaultSlug: string | null;
  compact: boolean;
}) {
  const baseline = opts.initialTopic ?? opts.topic;
  const attemptsDelta = Math.max(
    opts.attempts.length,
    (opts.topic.totalAttempts ?? 0) - (baseline.totalAttempts ?? 0)
  );
  const correctDelta = Math.max(
    opts.attempts.filter((a) => a.correct).length,
    (opts.topic.totalCorrect ?? 0) - (baseline.totalCorrect ?? 0)
  );
  const correctBonus = Math.min(correctDelta, 8);
  const baseXp = opts.compact ? 10 : 25;
  return {
    attemptsDelta,
    correctDelta,
    xp: baseXp + correctBonus,
    nextReview: reviewDateLabel(opts.topic.nextReview),
    status: topicStatusLabel(opts.topic.status),
    correctStreak: opts.topic.correctStreak ?? 0,
    errorsAdded: opts.sessionEffects.errorsAdded,
    errorsReinforced: opts.sessionEffects.errorsReinforced,
    errorsRehabilitated: opts.sessionEffects.errorsRehabilitated,
    rehabProgress: opts.sessionEffects.rehabProgress,
    syncIssueCount: opts.syncIssueCount,
    pillar: P30_PILLAR_LABELS[pillarForVaultSlug(opts.vaultSlug ?? undefined)],
  };
}

function phaseLabel(p: Phase) {
  if (p === "theory") return "Etap 1 · Teoria";
  if (p === "test") return "Etap 2 · Test";
  return "Etap 3 · Korekta";
}

/* ============================================================
   SectionPicker — wybór półki dla trybu "Konkretna sekcja"
   ============================================================ */

function SectionPicker({
  vaults,
  topics,
}: {
  vaults: Vault[] | null;
  topics: Topic[] | null;
}) {
  if (!vaults || !topics) {
    return <PageSkeleton header={false} rows={3} />;
  }
  const now = Date.now();
  const ordered = [...vaults].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      <header>
        <div className="eyebrow">Konkretna sekcja</div>
        <h1 className="hero-italic text-4xl mt-1">Z której półki dziś?</h1>
        <p className="text-muted mt-3 max-w-xl">
          Wybierz dziedzinę — system ułoży sesję z jej tematów, najpierw te
          zaległe.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ordered.map((v) => {
          const inVault = topics.filter((t) => t.vaultId === v.id);
          const dueCount = inVault.filter(
            (t) =>
              t.status === "fresh" ||
              t.status === "struggling" ||
              toMillis(t.nextReview) <= now
          ).length;
          const empty = inVault.length === 0;
          const meta = empty
            ? "brak tematów"
            : `${inVault.length} ${
                inVault.length === 1
                  ? "temat"
                  : inVault.length < 5
                  ? "tematy"
                  : "tematów"
              }${dueCount > 0 ? ` · ${dueCount} dziś` : ""}`;

          if (empty) {
            return (
              <div key={v.id} className="card opacity-50">
                <div className="eyebrow">{v.level}</div>
                <div className="hero-italic text-2xl mt-1">{v.name}</div>
                <div className="text-sm text-muted mt-2">{meta}</div>
              </div>
            );
          }

          return (
            <Link
              key={v.id}
              href={`/study/session/new?mode=vault&vault=${v.slug}`}
              className="card card-hover"
            >
              <div className="eyebrow">{v.level}</div>
              <div className="hero-italic text-2xl mt-1">{v.name}</div>
              <div className="text-sm text-muted mt-2">{meta}</div>
            </Link>
          );
        })}
      </div>

      <Link href="/study" className="btn-ghost">
        Wróć do trybów
      </Link>
    </div>
  );
}
