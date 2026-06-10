"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, X, RefreshCw, Check } from "lucide-react";
import { useUser } from "@/lib/auth-context";
import {
  commitSuggestion,
  useVaults,
  type SuggestionPayload,
} from "@/lib/firestore-data";

type QuestionType = "abc" | "fill" | "open" | "spot_error";

interface EditableQuestion {
  id: string;
  type: QuestionType;
  text: string;
  options: string[] | null;
  correctAnswer: string | number;
  explanation: string;
  skill: string;
}

interface EditableSuggestion {
  title: string;
  summary: string;
  theory: string;
  learningPoints: string[];
  questions: EditableQuestion[];
  salon: { short: string; expand: string; trap: string };
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function coerceQuestionType(raw: unknown): QuestionType | null {
  if (typeof raw !== "string") return null;
  const t = raw.toLowerCase().replace(/[-\s]/g, "_");
  if (t === "abc" || t === "multiple_choice" || t === "choice") return "abc";
  if (
    t === "fill" ||
    t === "fill_in" ||
    t === "fill_blank" ||
    t === "fill_in_the_blank"
  )
    return "fill";
  if (
    t === "open" ||
    t === "open_ended" ||
    t === "essay" ||
    t === "short_answer"
  )
    return "open";
  if (
    t === "spot_error" ||
    t === "find_error" ||
    t === "error" ||
    t === "spot"
  )
    return "spot_error";
  return null;
}

function normalizeSuggestion(raw: unknown): EditableSuggestion | null {
  console.info("[AdminClient] raw suggestion from API:", raw);
  if (!raw || typeof raw !== "object") {
    console.warn("normalizeSuggestion: raw not object", raw);
    return null;
  }
  const r = raw as Record<string, unknown>;
  if (typeof r.title !== "string" || typeof r.summary !== "string") {
    console.warn("normalizeSuggestion: missing title/summary", r);
    return null;
  }
  if (typeof r.theory !== "string") {
    console.warn("normalizeSuggestion: missing theory", r);
    return null;
  }
  const rawQuestions = Array.isArray(r.questions) ? r.questions : [];
  console.info(
    `[AdminClient] ${rawQuestions.length} raw questions from model`
  );

  const questions: EditableQuestion[] = rawQuestions
    .map((q: unknown, idx: number) => {
      if (!q || typeof q !== "object") {
        console.warn(`question ${idx}: not object`, q);
        return null;
      }
      const qr = q as Record<string, unknown>;
      const type = coerceQuestionType(qr.type);
      if (!type) {
        console.warn(`question ${idx}: unrecognised type`, qr.type, qr);
        return null;
      }
      const options =
        Array.isArray(qr.options) && qr.options.every((o) => typeof o === "string")
          ? (qr.options as string[])
          : null;

      let correctAnswer: string | number = "";
      if (
        typeof qr.correctAnswer === "string" ||
        typeof qr.correctAnswer === "number"
      ) {
        correctAnswer = qr.correctAnswer;
      } else if (typeof qr.correctAnswer === "boolean") {
        correctAnswer = String(qr.correctAnswer);
      }

      return {
        id: uid(),
        type,
        text: typeof qr.text === "string" ? qr.text : "",
        options,
        correctAnswer,
        explanation:
          typeof qr.explanation === "string" ? qr.explanation : "",
        skill: typeof qr.skill === "string" ? qr.skill : "",
      };
    })
    .filter((q): q is EditableQuestion => q !== null);

  console.info(
    `[AdminClient] ${questions.length} questions passed validation`
  );

  const salonRaw = (r.salon ?? {}) as Record<string, unknown>;
  const salon = {
    short: typeof salonRaw.short === "string" ? salonRaw.short : "",
    expand: typeof salonRaw.expand === "string" ? salonRaw.expand : "",
    trap: typeof salonRaw.trap === "string" ? salonRaw.trap : "",
  };

  return {
    title: r.title,
    summary: r.summary,
    theory: r.theory,
    learningPoints: Array.isArray(r.learningPoints)
      ? r.learningPoints
          .filter((x): x is string => typeof x === "string")
          .map((x) => x.trim())
          .filter(Boolean)
          .slice(0, 6)
      : [],
    questions,
    salon,
  };
}

function parseLearningPoints(raw: string): string[] {
  return raw
    .split(/\n|,/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 6);
}

export function AdminClient() {
  const user = useUser();
  const vaults = useVaults();

  const [notes, setNotes] = useState("");
  const [vaultId, setVaultId] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<EditableSuggestion | null>(null);
  const [saved, setSaved] = useState<{ topicId: string } | null>(null);

  async function generate() {
    if (!vaultId) {
      setErr("Wybierz sekcję.");
      return;
    }
    if (notes.trim().length < 20) {
      setErr("Notatki za krótkie — co najmniej kilka zdań.");
      return;
    }
    setBusy(true);
    setErr(null);
    setSaved(null);
    try {
      const vaultName = vaults?.find((v) => v.id === vaultId)?.name ?? "";
      const idToken = (await user?.getIdToken()) ?? "";
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ notes, vaultName }),
      });
      if (!res.ok) {
        if (res.status === 504) {
          throw new Error(
            "Opus 4.7 nie zmieścił się w 60s (Vercel Hobby). Spróbuj jeszcze raz albo skróć notatki o połowę."
          );
        }
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as { suggestion: unknown };
      const normalized = normalizeSuggestion(data.suggestion);
      if (!normalized) {
        throw new Error("Model zwrócił nieparsowalną strukturę.");
      }
      setSuggestion(normalized);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Generowanie nie powiodło się.");
    } finally {
      setBusy(false);
    }
  }

  function updateQuestion(id: string, patch: Partial<EditableQuestion>) {
    setSuggestion((s) =>
      s
        ? {
            ...s,
            questions: s.questions.map((q) =>
              q.id === id ? { ...q, ...patch } : q
            ),
          }
        : s
    );
  }

  function removeQuestion(id: string) {
    setSuggestion((s) =>
      s ? { ...s, questions: s.questions.filter((q) => q.id !== id) } : s
    );
  }

  async function accept() {
    if (!suggestion || !user || !vaultId) return;
    setBusy(true);
    setErr(null);
    try {
      const payload: SuggestionPayload = {
        title: suggestion.title,
        summary: suggestion.summary,
        theory: suggestion.theory,
        learningPoints: suggestion.learningPoints,
        questions: suggestion.questions.map((q) => ({
          type: q.type,
          text: q.text,
          options: q.options,
          correctAnswer:
            q.type === "abc" || q.type === "spot_error"
              ? Number(q.correctAnswer)
              : String(q.correctAnswer),
          explanation: q.explanation,
          skill: q.skill,
        })),
        salon: suggestion.salon.short.trim() ? suggestion.salon : null,
      };
      const result = await commitSuggestion({
        userId: user.uid,
        vaultId,
        payload,
      });
      setSaved(result);
      setSuggestion(null);
      setNotes("");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Zapis nie powiódł się.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <header className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="eyebrow">Dodaj wiedzę · AI proponuje, ty akceptujesz</div>
          <h1 className="hero-italic text-4xl mt-2">Nowa karta do Vault</h1>
          <p className="text-muted mt-3 max-w-xl">
            Wklej notatki z lekcji, książki, filmu. Claude wygeneruje teorię, 8 pytań
            różnych typów i frazy do Salonu. Edytujesz inline i akceptujesz.
          </p>
        </div>
        <Link href="/admin/preset" className="btn-ghost self-start">
          Gotowe tematy →
        </Link>
      </header>

      {saved && (
        <div className="card bg-gold/5 border-gold/20 flex items-center gap-3">
          <Check className="w-5 h-5 text-gold" />
          <div>
            <div className="hero-italic text-xl">Zapisane.</div>
            <Link
              href={`/study/session/new?topic=${saved.topicId}`}
              className="text-sm text-gold underline mt-1 inline-block"
            >
              Zrób od razu sesję 15 min →
            </Link>
          </div>
        </div>
      )}

      {!suggestion && (
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,680px)_minmax(260px,1fr)] gap-5 items-start">
          <div className="card space-y-5">
          <div>
            <label className="eyebrow">Sekcja</label>
            <select
              value={vaultId}
              onChange={(e) => setVaultId(e.target.value)}
              className="mt-2 w-full book-input"
            >
              <option value="">Wybierz...</option>
              {vaults?.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="eyebrow">Notatki</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={10}
              className="mt-2 w-full book-input leading-relaxed"
              style={{
                fontFamily:
                  '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
              placeholder="Wklej notatki z lekcji, fragmentu książki, filmu, podcastu..."
            />
            <div className="text-xs text-muted mt-2">
              {notes.length} znaków · im więcej kontekstu, tym lepsze pytania.
            </div>
          </div>

          <button
            onClick={generate}
            disabled={busy || !vaultId || notes.trim().length < 20}
            className="btn-primary disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {busy ? "Generuję..." : "Wygeneruj propozycje"}
          </button>

          {err && <p className="text-sm text-danger">{err}</p>}
          </div>
          <aside
            className="tex-paper tex-noise-fine"
            style={{
              padding: "24px 24px 22px",
              boxShadow:
                "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 18px 38px -18px rgba(0,0,0,0.66)",
            }}
          >
            <div className="eyebrow" style={{ color: "rgba(122,74,31,0.75)" }}>
              Po imporcie
            </div>
            <div
              className="font-display italic"
              style={{
                color: "#1B1108",
                fontSize: 31,
                lineHeight: 1.05,
                fontWeight: 600,
                marginTop: 10,
              }}
            >
              Od razu zamień notatki w rytm.
            </div>
            <p
              className="caption"
              style={{ color: "rgba(27,17,8,0.66)", marginTop: 12, lineHeight: 1.6 }}
            >
              Najlepsza karta ma teorię, pytania i jedną frazę do Salonu. Po zapisie
              aplikacja zaproponuje pierwszą krótką sesję.
            </p>
          </aside>
        </section>
      )}

      {suggestion && (
        <section className="space-y-6 max-w-2xl">
          <div className="card space-y-4">
            <div>
              <label className="eyebrow">Tytuł</label>
              <input
                value={suggestion.title}
                onChange={(e) =>
                  setSuggestion({ ...suggestion, title: e.target.value })
                }
                className="mt-2 w-full book-input"
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: "1.5rem",
                }}
              />
            </div>
            <div>
              <label className="eyebrow">Podsumowanie</label>
              <textarea
                value={suggestion.summary}
                onChange={(e) =>
                  setSuggestion({ ...suggestion, summary: e.target.value })
                }
                rows={3}
                className="mt-2 w-full book-input"
              />
            </div>
            <div>
              <label className="eyebrow">Teoria</label>
              <textarea
                value={suggestion.theory}
                onChange={(e) =>
                  setSuggestion({ ...suggestion, theory: e.target.value })
                }
                rows={6}
                className="mt-2 w-full book-input"
              />
            </div>
            <div>
              <label className="eyebrow">Mapa pojęć</label>
              <textarea
                value={suggestion.learningPoints.join("\n")}
                onChange={(e) =>
                  setSuggestion({
                    ...suggestion,
                    learningPoints: parseLearningPoints(e.target.value),
                  })
                }
                rows={4}
                className="mt-2 w-full book-input"
                placeholder="Jedno pojęcie lub podumiejętność w linii..."
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="eyebrow">Pytania · {suggestion.questions.length}</div>
            {suggestion.questions.map((q, i) => (
              <div key={q.id} className="card relative space-y-3">
                <button
                  onClick={() => removeQuestion(q.id)}
                  className="absolute top-3 right-3 text-muted hover:text-danger transition-colors"
                  aria-label="Usuń pytanie"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-3">
                  <span className="eyebrow text-gold/60">#{i + 1}</span>
                  <span className="text-[10px] uppercase tracking-eyebrow text-gold bg-gold/10 border border-gold/20 rounded-full px-2 py-0.5">
                    {q.type}
                  </span>
                </div>
                <textarea
                  value={q.text}
                  onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                  rows={2}
                  className="w-full book-input"
                />
                <input
                  value={q.skill}
                  onChange={(e) => updateQuestion(q.id, { skill: e.target.value })}
                  placeholder="Skill / pojęcie ćwiczone przez pytanie"
                  className="w-full book-input"
                />
                {q.options && (
                  <div className="space-y-1.5">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={Number(q.correctAnswer) === oi}
                          onChange={() =>
                            updateQuestion(q.id, { correctAnswer: oi })
                          }
                          className="accent-gold"
                        />
                        <input
                          value={opt}
                          onChange={(e) => {
                            const next = [...q.options!];
                            next[oi] = e.target.value;
                            updateQuestion(q.id, { options: next });
                          }}
                          className="flex-1 book-input"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {!q.options && (
                  <input
                    value={String(q.correctAnswer)}
                    onChange={(e) =>
                      updateQuestion(q.id, { correctAnswer: e.target.value })
                    }
                    placeholder="Poprawna odpowiedź"
                    className="w-full book-input"
                  />
                )}
                <input
                  value={q.explanation}
                  onChange={(e) =>
                    updateQuestion(q.id, { explanation: e.target.value })
                  }
                  placeholder="Wyjaśnienie..."
                  className="w-full book-input"
                />
              </div>
            ))}
          </div>

          <div className="card space-y-3">
            <div className="eyebrow">Salon · 3 zdania</div>
            <textarea
              value={suggestion.salon.short}
              onChange={(e) =>
                setSuggestion({
                  ...suggestion,
                  salon: { ...suggestion.salon, short: e.target.value },
                })
              }
              rows={2}
              placeholder="Krótko (30s)..."
              className="w-full book-input"
            />
            <textarea
              value={suggestion.salon.expand}
              onChange={(e) =>
                setSuggestion({
                  ...suggestion,
                  salon: { ...suggestion.salon, expand: e.target.value },
                })
              }
              rows={3}
              placeholder="Rozbudowanie (60s)..."
              className="w-full book-input"
            />
            <textarea
              value={suggestion.salon.trap}
              onChange={(e) =>
                setSuggestion({
                  ...suggestion,
                  salon: { ...suggestion.salon, trap: e.target.value },
                })
              }
              rows={2}
              placeholder="Pułapka..."
              className="w-full book-input"
            />
          </div>

          <div className="flex flex-wrap gap-3 sticky bottom-4">
            <button
              onClick={accept}
              disabled={busy || suggestion.questions.length === 0}
              className="btn-primary disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {busy ? "Zapisuję..." : "Dodaj do Vault"}
            </button>
            <button
              onClick={generate}
              disabled={busy}
              className="btn-ghost disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              Wygeneruj jeszcze raz
            </button>
            <button
              onClick={() => {
                setSuggestion(null);
                setErr(null);
              }}
              disabled={busy}
              className="btn-ghost disabled:opacity-50"
            >
              Odrzuć
            </button>
          </div>

          {err && <p className="text-sm text-danger">{err}</p>}
        </section>
      )}
    </div>
  );
}
