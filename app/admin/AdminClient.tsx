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
}

interface EditableSuggestion {
  title: string;
  summary: string;
  theory: string;
  questions: EditableQuestion[];
  salon: { short: string; expand: string; trap: string };
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function normalizeSuggestion(raw: unknown): EditableSuggestion | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.title !== "string" || typeof r.summary !== "string")
    return null;
  if (typeof r.theory !== "string") return null;
  const rawQuestions = Array.isArray(r.questions) ? r.questions : [];
  const questions: EditableQuestion[] = rawQuestions
    .map((q: unknown) => {
      if (!q || typeof q !== "object") return null;
      const qr = q as Record<string, unknown>;
      const type = qr.type as QuestionType;
      if (!["abc", "fill", "open", "spot_error"].includes(type)) return null;
      const options =
        Array.isArray(qr.options) && qr.options.every((o) => typeof o === "string")
          ? (qr.options as string[])
          : null;
      return {
        id: uid(),
        type,
        text: typeof qr.text === "string" ? qr.text : "",
        options,
        correctAnswer:
          typeof qr.correctAnswer === "string" || typeof qr.correctAnswer === "number"
            ? qr.correctAnswer
            : "",
        explanation: typeof qr.explanation === "string" ? qr.explanation : "",
      };
    })
    .filter((q): q is EditableQuestion => q !== null);

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
    questions,
    salon,
  };
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
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ notes, vaultName }),
      });
      if (!res.ok) {
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
        questions: suggestion.questions.map((q) => ({
          type: q.type,
          text: q.text,
          options: q.options,
          correctAnswer:
            q.type === "abc" || q.type === "spot_error"
              ? Number(q.correctAnswer)
              : String(q.correctAnswer),
          explanation: q.explanation,
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
      <header>
        <div className="eyebrow">Tryb mix · AI proponuje, ty akceptujesz</div>
        <h1 className="hero-italic text-5xl mt-2">Admin</h1>
        <p className="text-muted mt-3 max-w-xl">
          Wklej notatki z lekcji, książki, filmu. Claude wygeneruje teorię, 8 pytań
          różnych typów i frazy do Salonu. Edytujesz inline i akceptujesz.
        </p>
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
        <section className="card max-w-2xl space-y-5">
          <div>
            <label className="eyebrow">Sekcja</label>
            <select
              value={vaultId}
              onChange={(e) => setVaultId(e.target.value)}
              className="mt-2 w-full border border-line rounded px-4 py-2.5 text-sm bg-cream focus:outline-none focus:border-gold/40"
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
              className="mt-2 w-full border border-line rounded px-4 py-3 text-sm bg-cream focus:outline-none focus:border-gold/40 font-mono leading-relaxed"
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
                className="mt-2 w-full border border-line rounded px-4 py-2.5 hero-italic text-2xl bg-cream focus:outline-none focus:border-gold/40"
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
                className="mt-2 w-full border border-line rounded px-4 py-2.5 text-sm bg-cream focus:outline-none focus:border-gold/40"
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
                className="mt-2 w-full border border-line rounded px-4 py-2.5 text-sm bg-cream focus:outline-none focus:border-gold/40"
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
                  className="w-full border border-line rounded px-3 py-2 text-sm bg-cream focus:outline-none focus:border-gold/40"
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
                          className="flex-1 border border-line rounded px-3 py-1.5 text-xs bg-cream focus:outline-none focus:border-gold/40"
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
                    className="w-full border border-line rounded px-3 py-2 text-xs bg-cream focus:outline-none focus:border-gold/40"
                  />
                )}
                <input
                  value={q.explanation}
                  onChange={(e) =>
                    updateQuestion(q.id, { explanation: e.target.value })
                  }
                  placeholder="Wyjaśnienie..."
                  className="w-full border border-line rounded px-3 py-2 text-xs text-muted bg-cream focus:outline-none focus:border-gold/40"
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
              className="w-full border border-line rounded px-3 py-2 text-sm bg-cream focus:outline-none focus:border-gold/40"
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
              className="w-full border border-line rounded px-3 py-2 text-sm bg-cream focus:outline-none focus:border-gold/40"
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
              className="w-full border border-line rounded px-3 py-2 text-sm bg-cream focus:outline-none focus:border-gold/40"
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
