"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, Plus, Check, Trash2 } from "lucide-react";
import { useUser } from "@/lib/auth-context";
import {
  addQuestionToTopic,
  deleteQuestion,
  deleteTopic,
  getQuestionsForTopic,
  getTopic,
  updateQuestion,
  updateTopic,
  upsertSalonPhrase,
  useSalonPhrases,
} from "@/lib/firestore-data";
import type { Question, QuestionType, Topic } from "@/lib/types";

const TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: "abc", label: "Zamknięte (A/B/C)" },
  { value: "spot_error", label: "Wskaż błąd" },
  { value: "fill", label: "Uzupełnij" },
  { value: "open", label: "Otwarte" },
  { value: "translate", label: "Przetłumacz" },
];

const isMc = (t: QuestionType) => t === "abc" || t === "spot_error";

interface EditQ {
  key: string;
  docId: string | null;
  type: QuestionType;
  text: string;
  options: string[] | null;
  correctAnswer: string | number;
  explanation: string;
}

function localKey() {
  return Math.random().toString(36).slice(2, 9);
}

function toEditQ(q: Question): EditQ {
  return {
    key: q.id,
    docId: q.id,
    type: q.type,
    text: q.text,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  };
}

export function TopicEditor({
  slug,
  topicId,
}: {
  slug: string;
  topicId: string;
}) {
  const user = useUser();
  const router = useRouter();
  const allPhrases = useSalonPhrases();

  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [theory, setTheory] = useState("");
  const [questions, setQuestions] = useState<EditQ[]>([]);
  const [originalIds, setOriginalIds] = useState<string[]>([]);
  const [salon, setSalon] = useState({ short: "", expand: "", trap: "" });

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const salonInitRef = useRef(false);

  // Load topic + questions
  useEffect(() => {
    if (!user) return;
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
        setTitle(t.title);
        setSummary(t.summary);
        setTheory(t.theory);
        setQuestions(qs.map(toEditQ));
        setOriginalIds(qs.map((q) => q.id));
      } catch (e: unknown) {
        if (!cancelled) {
          setLoadErr(e instanceof Error ? e.message : "Coś poszło nie tak.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, topicId]);

  // Seed salon fields once, then leave under user control.
  useEffect(() => {
    if (allPhrases && !salonInitRef.current) {
      salonInitRef.current = true;
      const p = allPhrases.find((x) => x.topicId === topicId);
      if (p) setSalon({ short: p.short, expand: p.expand, trap: p.trap });
    }
  }, [allPhrases, topicId]);

  function patchQ(key: string, patch: Partial<EditQ>) {
    setQuestions((qs) =>
      qs.map((q) => (q.key === key ? { ...q, ...patch } : q))
    );
    setSaved(false);
  }

  function changeType(key: string, type: QuestionType) {
    setQuestions((qs) =>
      qs.map((q) => {
        if (q.key !== key) return q;
        if (isMc(type)) {
          const options = q.options ?? ["", "", ""];
          const correctAnswer = isMc(q.type) ? q.correctAnswer : 0;
          return { ...q, type, options, correctAnswer };
        }
        return { ...q, type, options: null, correctAnswer: "" };
      })
    );
    setSaved(false);
  }

  function removeQ(key: string) {
    setQuestions((qs) => qs.filter((q) => q.key !== key));
    setSaved(false);
  }

  function addQ() {
    setQuestions((qs) => [
      ...qs,
      {
        key: localKey(),
        docId: null,
        type: "abc",
        text: "",
        options: ["", "", ""],
        correctAnswer: 0,
        explanation: "",
      },
    ]);
    setSaved(false);
  }

  async function save() {
    if (!user || !topic) return;
    setBusy(true);
    setErr(null);
    try {
      await updateTopic(topicId, { title, summary, theory });

      const currentIds = questions
        .map((q) => q.docId)
        .filter((id): id is string => id !== null);
      const deleted = originalIds.filter((id) => !currentIds.includes(id));
      for (const id of deleted) {
        await deleteQuestion(id);
      }

      for (const q of questions) {
        const data = {
          type: q.type,
          text: q.text,
          options: isMc(q.type) ? q.options ?? [] : null,
          correctAnswer: isMc(q.type)
            ? Number(q.correctAnswer)
            : String(q.correctAnswer),
          explanation: q.explanation,
        };
        if (q.docId) {
          await updateQuestion(q.docId, data);
        } else {
          await addQuestionToTopic({ userId: user.uid, topicId, question: data });
        }
      }

      await upsertSalonPhrase({ userId: user.uid, topicId, ...salon });

      // Reload to reconcile new doc ids so kolejny zapis nie zdubluje pytań.
      const qs = await getQuestionsForTopic(topicId);
      setQuestions(qs.map(toEditQ));
      setOriginalIds(qs.map((q) => q.id));
      setSaved(true);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Zapis nie powiódł się.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!user) return;
    setBusy(true);
    setErr(null);
    try {
      await deleteTopic({ userId: user.uid, topicId });
      router.push(`/vaults/${slug}`);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Usunięcie nie powiodło się.");
      setBusy(false);
    }
  }

  if (loadErr) {
    return (
      <div className="space-y-6">
        <Link
          href={`/vaults/${slug}`}
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold"
        >
          <ArrowLeft className="w-4 h-4" /> Sekcja
        </Link>
        <p className="hero-italic text-2xl text-danger">{loadErr}</p>
      </div>
    );
  }

  if (!topic) {
    return <p className="hero-italic text-2xl text-muted animate-candle">Ładuję temat...</p>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <Link
        href={`/vaults/${slug}`}
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Sekcja
      </Link>

      <header className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-5 items-end">
        <div>
          <div className="eyebrow">Edycja tematu · karta źródłowa</div>
          <h1 className="hero-italic text-4xl mt-1">{title || "Bez tytułu"}</h1>
          <p className="text-muted mt-3 max-w-2xl">
            Tu poprawiasz materiał, który później pracuje w sesjach, Erracie i
            Salonie. Najlepsze zmiany są małe: jedno ostrzejsze pytanie, jedno
            lepsze wyjaśnienie, jedna fraza do rozmowy.
          </p>
        </div>
        <div
          className="tex-paper tex-noise-fine"
          style={{
            padding: "18px 20px",
            boxShadow:
              "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 14px 32px -18px rgba(0,0,0,0.62)",
          }}
        >
          <div className="eyebrow" style={{ color: "rgba(122,74,31,0.72)" }}>
            Zawartość
          </div>
          <div
            className="font-display italic"
            style={{ color: "#1B1108", fontSize: 30, lineHeight: 1, marginTop: 8 }}
          >
            {questions.length}
          </div>
          <div className="signature" style={{ color: "rgba(27,17,8,0.54)", marginTop: 4 }}>
            {questions.length === 1 ? "pytanie" : "pytań"} · Salon{" "}
            {salon.short.trim() ? "gotowy" : "pusty"}
          </div>
        </div>
      </header>

      <section className="card space-y-4 max-w-3xl">
        <div>
          <label className="eyebrow">Tytuł</label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSaved(false);
            }}
            className="mt-2 w-full book-input hero-italic text-2xl"
          />
        </div>
        <div>
          <label className="eyebrow">Podsumowanie</label>
          <textarea
            value={summary}
            onChange={(e) => {
              setSummary(e.target.value);
              setSaved(false);
            }}
            rows={3}
            className="mt-2 w-full book-input"
          />
        </div>
        <div>
          <label className="eyebrow">Teoria</label>
          <textarea
            value={theory}
            onChange={(e) => {
              setTheory(e.target.value);
              setSaved(false);
            }}
            rows={6}
            className="mt-2 w-full book-input"
          />
        </div>
      </section>

      <div className="space-y-3">
        <div className="eyebrow">Pytania · {questions.length}</div>
        {questions.map((q, i) => (
          <div key={q.key} className="card relative space-y-3">
            <button
              onClick={() => removeQ(q.key)}
              className="absolute top-3 right-3 text-muted hover:text-danger transition-colors"
              aria-label="Usuń pytanie"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <span className="eyebrow text-gold/60">#{i + 1}</span>
              <select
                value={q.type}
                onChange={(e) =>
                  changeType(q.key, e.target.value as QuestionType)
                }
                className="text-xs border border-line rounded px-2 py-1 bg-cream focus:outline-none focus:border-gold/40"
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={q.text}
              onChange={(e) => patchQ(q.key, { text: e.target.value })}
              rows={2}
              placeholder="Treść pytania"
              className="w-full border border-line rounded px-3 py-2 text-sm bg-cream focus:outline-none focus:border-gold/40"
            />
            {isMc(q.type) && q.options && (
              <div className="space-y-1.5">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={Number(q.correctAnswer) === oi}
                      onChange={() => patchQ(q.key, { correctAnswer: oi })}
                      className="accent-gold"
                    />
                    <input
                      value={opt}
                      onChange={(e) => {
                        const next = [...q.options!];
                        next[oi] = e.target.value;
                        patchQ(q.key, { options: next });
                      }}
                      placeholder={`Opcja ${oi + 1}`}
                      className="flex-1 border border-line rounded px-3 py-1.5 text-xs bg-cream focus:outline-none focus:border-gold/40"
                    />
                  </div>
                ))}
              </div>
            )}
            {!isMc(q.type) && (
              <input
                value={String(q.correctAnswer)}
                onChange={(e) =>
                  patchQ(q.key, { correctAnswer: e.target.value })
                }
                placeholder="Poprawna odpowiedź"
                className="w-full border border-line rounded px-3 py-2 text-xs bg-cream focus:outline-none focus:border-gold/40"
              />
            )}
            <input
              value={q.explanation}
              onChange={(e) => patchQ(q.key, { explanation: e.target.value })}
              placeholder="Wyjaśnienie..."
              className="w-full border border-line rounded px-3 py-2 text-xs text-muted bg-cream focus:outline-none focus:border-gold/40"
            />
          </div>
        ))}
        <button onClick={addQ} className="btn-ghost">
          <Plus className="w-4 h-4" /> Dodaj pytanie
        </button>
      </div>

      <section className="card space-y-3">
        <div className="eyebrow">Salon · 3 zdania (puste = usuń frazę)</div>
        <textarea
          value={salon.short}
          onChange={(e) => {
            setSalon({ ...salon, short: e.target.value });
            setSaved(false);
          }}
          rows={2}
          placeholder="Krótko (30s)..."
          className="w-full border border-line rounded px-3 py-2 text-sm bg-cream focus:outline-none focus:border-gold/40"
        />
        <textarea
          value={salon.expand}
          onChange={(e) => {
            setSalon({ ...salon, expand: e.target.value });
            setSaved(false);
          }}
          rows={3}
          placeholder="Rozbudowanie (60s)..."
          className="w-full border border-line rounded px-3 py-2 text-sm bg-cream focus:outline-none focus:border-gold/40"
        />
        <textarea
          value={salon.trap}
          onChange={(e) => {
            setSalon({ ...salon, trap: e.target.value });
            setSaved(false);
          }}
          rows={2}
          placeholder="Pułapka..."
          className="w-full border border-line rounded px-3 py-2 text-sm bg-cream focus:outline-none focus:border-gold/40"
        />
      </section>

      <div className="flex flex-wrap items-center gap-3 sticky bottom-4">
        <button
          onClick={save}
          disabled={busy || !title.trim()}
          className="btn-primary disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          {busy ? "Zapisuję..." : "Zapisz zmiany"}
        </button>
        <Link
          href={`/study/session/new?topic=${topicId}`}
          className="btn-ghost"
        >
          Ucz się
        </Link>
        {saved && <span className="text-sm text-gold">Zapisane.</span>}
        {err && <span className="text-sm text-danger">{err}</span>}
      </div>

      <section className="border-t border-line pt-6">
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-danger transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Usuń ten temat
          </button>
        ) : (
          <div className="card border-danger/30 space-y-3">
            <p className="text-sm">
              Usunąć temat „{title}"? Zniknie wraz z pytaniami, frazą Salonu i
              powiązanymi wpisami w Error Vault. Tej operacji nie cofniesz.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onDelete}
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 bg-danger text-ivory px-5 py-2.5 rounded text-sm font-medium tracking-wide transition-opacity duration-200 hover:opacity-90 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {busy ? "Usuwam..." : "Tak, usuń"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={busy}
                className="btn-ghost"
              >
                Anuluj
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
