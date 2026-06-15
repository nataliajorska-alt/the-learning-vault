"use client";

import { useState } from "react";
import Link from "next/link";
import { X, RefreshCw, Check } from "lucide-react";
import { useUser } from "@/lib/auth-context";
import {
  commitSuggestion,
  useVaults,
  type SuggestionPayload,
} from "@/lib/firestore-data";
import type { Vault } from "@/lib/types";

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

const debugLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== "production") console.info(...args);
};

function normalizeSuggestion(raw: unknown): EditableSuggestion | null {
  debugLog("[AdminClient] raw suggestion from API:", raw);
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
  debugLog(
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

  debugLog(
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
            "Opus 4.8 nie zmieścił się w 60s (Vercel Hobby). Spróbuj jeszcze raz albo skróć notatki o połowę."
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
    <div className="page-bleed -mt-10 md:-mt-12 relative overflow-hidden anim-on">
      {/* top light spill — jak w Dziś, oddycha (reduced-motion: statyczne) */}
      <div
        aria-hidden
        className="candle-glow absolute pointer-events-none"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: 600,
          background:
            "radial-gradient(ellipse 55% 70% at 50% 0%, rgba(255,210,160,0.10), transparent 70%)",
          zIndex: 0,
        }}
      />

      <div className="relative max-w-content mx-auto" style={{ zIndex: 1 }}>
        <Hero />

        {saved && (
          <div style={{ padding: "0 24px", marginBottom: 32 }}>
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
          </div>
        )}

        {!suggestion && (
          <div style={{ marginTop: 8 }}>
            <RuleHeader left="Rękopis" right="sekcja · notatki · propozycje" />
            <div style={{ padding: "28px 24px 0" }}>
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch" style={{ gap: 24 }}>
                <KartaPrzyjecia
                  vaults={vaults}
                  vaultId={vaultId}
                  setVaultId={setVaultId}
                  notes={notes}
                  setNotes={setNotes}
                  busy={busy}
                  err={err}
                  onGenerate={generate}
                />
                <div className="lg:col-span-4 flex flex-col" style={{ gap: 24 }}>
                  <CoPowstanie />
                  <PoImporcie />
                </div>
              </div>
            </div>
          </div>
        )}

        {suggestion && (
          <section className="space-y-6 max-w-2xl" style={{ padding: "0 24px" }}>
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

        <div style={{ marginTop: 64 }}>
          <OrnamentDivider />
        </div>
        <PageFooter />
      </div>
    </div>
  );
}

/* ============================================================
   Hero — w rytmie pozostałych stron v2
   ============================================================ */

function GotoweTematy() {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href="/admin/preset"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative flex items-center"
      style={{
        gap: 12,
        padding: "16px 24px",
        cursor: "pointer",
        border: "1px solid rgba(184,146,77,0.5)",
        background: hover ? "rgba(184,146,77,0.12)" : "rgba(184,146,77,0.06)",
        boxShadow:
          "inset 0 1px 0 rgba(217,184,120,0.18), 0 12px 28px -14px rgba(0,0,0,0.7)",
        transition: "background .2s",
        textDecoration: "none",
      }}
    >
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{ inset: 4, border: "0.5px solid rgba(184,146,77,0.3)" }}
      />
      <span
        className="eyebrow"
        style={{ color: "var(--c-gold-300)", fontSize: 10.5, letterSpacing: "0.24em" }}
      >
        Gotowe tematy
      </span>
      <span
        style={{
          color: "var(--c-gold-400)",
          fontSize: 14,
          lineHeight: 1,
          transform: hover ? "translateX(3px)" : "none",
          transition: "transform .2s",
        }}
      >
        →
      </span>
    </Link>
  );
}

function Hero() {
  return (
    <div className="flex items-end justify-between flex-wrap gap-6" style={{ padding: "56px 24px 32px" }}>
      <div style={{ maxWidth: 720 }}>
        <div
          className="eyebrow flex items-center"
          style={{ color: "var(--c-gold-400)", marginBottom: 16, opacity: 0.92, gap: 12 }}
        >
          <span
            style={{
              display: "inline-block",
              width: 22,
              height: 1,
              background: "var(--c-gold-500)",
              opacity: 0.55,
            }}
          />
          Dodaj wiedzę · AI proponuje, Ty akceptujesz
        </div>
        <h1
          className="font-display italic"
          style={{
            fontSize: "clamp(40px, 6vw, 64px)",
            lineHeight: 0.94,
            letterSpacing: "-0.02em",
            color: "var(--c-paper-100)",
            fontWeight: 600,
            marginBottom: 18,
          }}
        >
          Nowa karta do Vault
        </h1>
        <p
          className="lead"
          style={{ color: "var(--c-paper-300)", opacity: 0.78, maxWidth: 560, textWrap: "pretty" }}
        >
          Wklej notatki z lekcji, książki, filmu. Claude wygeneruje teorię, pytania i
          frazę do Salonu.{" "}
          <em
            className="font-display italic"
            style={{ color: "var(--c-gold-300)", fontSize: 21 }}
          >
            Ex chartis, scientia.
          </em>
        </p>
      </div>
      <div className="flex flex-col items-end" style={{ gap: 14, paddingBottom: 8 }}>
        <GotoweTematy />
      </div>
    </div>
  );
}

/* ============================================================
   Rule header
   ============================================================ */

function RuleHeader({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex items-center" style={{ gap: 16, padding: "0 24px" }}>
      <span
        className="eyebrow"
        style={{ color: "var(--c-gold-400)", letterSpacing: "0.28em", whiteSpace: "nowrap" }}
      >
        ✦ {left}
      </span>
      <div style={{ flex: 1, height: 0.5, background: "rgba(184,146,77,0.35)" }} />
      <span
        className="signature"
        style={{ color: "var(--c-paper-300)", opacity: 0.6, fontSize: 11, whiteSpace: "nowrap" }}
      >
        {right}
      </span>
    </div>
  );
}

/* ============================================================
   Formularz — papierowa karta przyjęcia rękopisu
   ============================================================ */

function FieldLabel({
  numeral,
  label,
  hint,
}: {
  numeral: string;
  label: string;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline" style={{ gap: 10, marginBottom: 10 }}>
      <span
        className="font-display italic"
        style={{ fontSize: 14, color: "rgba(139,46,31,0.55)", width: 18, flexShrink: 0 }}
      >
        {numeral}.
      </span>
      <span
        className="eyebrow"
        style={{ color: "rgba(27,17,8,0.7)", fontSize: 10, letterSpacing: "0.24em" }}
      >
        {label}
      </span>
      <span
        style={{ flex: 1, borderBottom: "1px dotted rgba(27,17,8,0.25)", transform: "translateY(-3px)" }}
      />
      {hint && (
        <span
          className="signature"
          style={{ color: "rgba(27,17,8,0.45)", fontSize: 10.5, letterSpacing: "0.06em" }}
        >
          {hint}
        </span>
      )}
    </div>
  );
}

function SekcjaSelect({
  vaults,
  value,
  onChange,
}: {
  vaults: Vault[] | null;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative" style={{ marginLeft: 28 }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-display italic"
        style={{
          width: "100%",
          appearance: "none",
          WebkitAppearance: "none",
          background: "transparent",
          border: "none",
          outline: "none",
          borderBottom: "1px solid rgba(27,17,8,0.45)",
          padding: "6px 36px 8px 2px",
          cursor: "pointer",
          fontSize: 23,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: value === "" ? "rgba(27,17,8,0.42)" : "#1B1108",
        }}
      >
        <option
          value=""
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: 15,
            fontStyle: "normal",
            background: "#E2D6BA",
            color: "#1B1108",
          }}
        >
          Wybierz sekcję…
        </option>
        {vaults?.map((v) => (
          <option
            key={v.id}
            value={v.id}
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: 15,
              fontStyle: "normal",
              background: "#E2D6BA",
              color: "#1B1108",
            }}
          >
            {v.name}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          right: 8,
          top: "50%",
          width: 8,
          height: 8,
          transform: "translateY(-62%) rotate(45deg)",
          borderRight: "1.2px solid rgba(139,46,31,0.7)",
          borderBottom: "1.2px solid rgba(139,46,31,0.7)",
        }}
      />
    </div>
  );
}

function NotatkiArea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const line = 30;
  return (
    <div className="relative" style={{ marginLeft: 28 }}>
      {/* czerwony margines rękopisu */}
      <span
        aria-hidden
        className="absolute pointer-events-none"
        style={{ top: -4, bottom: 0, left: 34, width: 1, background: "rgba(139,46,31,0.35)" }}
      />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Wklej notatki z lekcji, fragmentu książki, filmu, podcastu…"
        spellCheck="false"
        className="font-display"
        style={{
          width: "100%",
          height: 270,
          resize: "vertical",
          background: `repeating-linear-gradient(180deg, transparent 0px, transparent ${line - 1}px, rgba(27,17,8,0.14) ${line - 1}px, rgba(27,17,8,0.14) ${line}px)`,
          border: "none",
          outline: "none",
          display: "block",
          padding: "0 8px 0 48px",
          fontSize: 19,
          fontStyle: "italic",
          fontWeight: 500,
          lineHeight: `${line}px`,
          letterSpacing: "0.005em",
          color: "#241507",
          caretColor: "var(--c-ink2)",
        }}
      />
    </div>
  );
}

function WygenerujButton({
  disabled,
  busy,
  onClick,
}: {
  disabled: boolean;
  busy: boolean;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  const on = hover && !disabled;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative flex items-center"
      style={{
        gap: 12,
        padding: "17px 30px",
        cursor: disabled ? "default" : "pointer",
        border: "0.5px solid rgba(40,6,3,0.7)",
        background: on
          ? "linear-gradient(165deg, #7c2218 0%, #5a140d 55%, #3c0a06 100%)"
          : "linear-gradient(165deg, #6a1a12 0%, #4a0f0a 55%, #320805 100%)",
        boxShadow: on
          ? "inset 0 1px 0 rgba(255,190,150,0.30), inset 0 -2px 6px rgba(15,1,1,0.6), 0 14px 30px -12px rgba(40,5,2,0.85)"
          : "inset 0 1px 0 rgba(255,190,150,0.22), inset 0 -2px 6px rgba(15,1,1,0.6), 0 10px 24px -12px rgba(0,0,0,0.8)",
        opacity: disabled && !busy ? 0.55 : 1,
        transform: on ? "translateY(-1px)" : "none",
        transition: "background .2s, transform .2s, box-shadow .2s",
      }}
    >
      <span
        aria-hidden
        className="absolute pointer-events-none"
        style={{ inset: 4, border: "0.5px solid rgba(255,190,150,0.22)" }}
      />
      <span style={{ color: "var(--c-gold-300)", fontSize: 13, lineHeight: 1 }}>✦</span>
      <span className="eyebrow" style={{ color: "#ECDFC4", fontSize: 11, letterSpacing: "0.26em" }}>
        {busy ? "Generuję…" : "Wygeneruj propozycje"}
      </span>
    </button>
  );
}

function KartaPrzyjecia({
  vaults,
  vaultId,
  setVaultId,
  notes,
  setNotes,
  busy,
  err,
  onGenerate,
}: {
  vaults: Vault[] | null;
  vaultId: string;
  setVaultId: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  busy: boolean;
  err: string | null;
  onGenerate: () => void;
}) {
  return (
    <div
      className="tex-paper tex-noise-fine relative lg:col-span-8"
      style={{
        boxShadow:
          "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 24px 50px -18px rgba(0,0,0,0.75), 0 3px 6px rgba(0,0,0,0.4)",
      }}
    >
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{ inset: 12, border: "0.5px solid rgba(146,112,55,0.4)", zIndex: 2 }}
      />
      <div className="relative" style={{ padding: "28px 40px 30px", zIndex: 3 }}>
        <div className="flex items-start justify-between" style={{ marginBottom: 26 }}>
          <div className="flex items-center" style={{ gap: 10 }}>
            <span
              aria-hidden
              style={{
                width: 7,
                height: 7,
                transform: "rotate(45deg)",
                display: "inline-block",
                flexShrink: 0,
                background: "radial-gradient(circle at 35% 30%, #c8512f, #7a1f14 85%)",
                border: "0.5px solid rgba(60,8,4,0.5)",
                boxShadow: "inset 0 1px 0 rgba(255,200,170,0.25)",
              }}
            />
            <span className="eyebrow" style={{ color: "rgba(139,46,31,0.82)", fontSize: 10 }}>
              Karta przyjęcia rękopisu
            </span>
          </div>
          <span
            className="stamp"
            style={{ fontSize: 9, transform: "rotate(2.5deg)", opacity: 0.7 }}
          >
            Folium novum
          </span>
        </div>

        <div style={{ marginBottom: 30 }}>
          <FieldLabel numeral="i" label="Sekcja" hint="półka w bibliotece" />
          <SekcjaSelect vaults={vaults} value={vaultId} onChange={setVaultId} />
        </div>

        <div>
          <FieldLabel numeral="ii" label="Notatki" hint="lekcja · książka · film · podcast" />
          <NotatkiArea value={notes} onChange={setNotes} />
        </div>

        <div
          className="flex items-end justify-between flex-wrap"
          style={{
            marginTop: 22,
            paddingTop: 16,
            borderTop: "0.5px dashed rgba(27,17,8,0.25)",
            gap: 24,
          }}
        >
          <div>
            <div
              className="signature"
              style={{
                color: "rgba(139,46,31,0.7)",
                fontSize: 11,
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              {notes.length.toLocaleString("pl-PL")} znaków
            </div>
            <div
              className="caption"
              style={{ color: "rgba(27,17,8,0.55)", fontSize: 12.5, fontStyle: "italic" }}
            >
              Im więcej kontekstu, tym lepsze pytania.
            </div>
          </div>
          <WygenerujButton
            disabled={busy || !vaultId || notes.trim().length < 20}
            busy={busy}
            onClick={onGenerate}
          />
        </div>

        {err && (
          <p
            className="caption"
            style={{
              color: "var(--c-ink2)",
              fontStyle: "italic",
              fontSize: 13,
              marginTop: 14,
              marginBottom: 0,
            }}
          >
            {err}
          </p>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Prawa kolumna — rejestr + nota po imporcie
   ============================================================ */

function CornerDots() {
  const dot: React.CSSProperties = {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: "50%",
    background: "rgba(184,146,77,0.55)",
  };
  return (
    <span aria-hidden>
      <span style={{ ...dot, top: 10, left: 10 }} />
      <span style={{ ...dot, top: 10, right: 10 }} />
      <span style={{ ...dot, bottom: 10, left: 10 }} />
      <span style={{ ...dot, bottom: 10, right: 10 }} />
    </span>
  );
}

const POWSTANIE = [
  { label: "Teoria", value: "zwięzły wykład" },
  { label: "Pytania", value: "8 · różne typy" },
  { label: "Fraza", value: "jedna · do Salonu" },
];

const POWSTANIE_NUMERALS = ["i", "ii", "iii"];

function CoPowstanie() {
  return (
    <div
      className="relative"
      style={{
        background: "rgba(27,17,8,0.4)",
        border: "0.5px solid rgba(184,146,77,0.35)",
        boxShadow: "inset 0 1px 0 rgba(184,146,77,0.12), 0 12px 28px -14px rgba(0,0,0,0.7)",
        padding: "26px 28px 24px",
      }}
    >
      <CornerDots />
      <span
        className="eyebrow"
        style={{ color: "var(--c-gold-400)", fontSize: 10, display: "block", marginBottom: 6 }}
      >
        Z jednej karty
      </span>
      <div
        className="font-display italic"
        style={{
          fontSize: 24,
          color: "var(--c-paper-100)",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          lineHeight: 1.05,
          marginBottom: 20,
        }}
      >
        Co wygeneruje Claude
      </div>
      <div className="flex flex-col" style={{ gap: 14 }}>
        {POWSTANIE.map((r, i) => (
          <div key={r.label} className="flex items-baseline" style={{ gap: 10 }}>
            <span
              className="font-display italic"
              style={{ fontSize: 14, color: "rgba(184,146,77,0.6)", width: 18, flexShrink: 0 }}
            >
              {POWSTANIE_NUMERALS[i]}.
            </span>
            <span
              className="signature"
              style={{
                color: "var(--c-paper-300)",
                fontSize: 11.5,
                letterSpacing: "0.08em",
                whiteSpace: "nowrap",
              }}
            >
              {r.label}
            </span>
            <span
              style={{
                flex: 1,
                borderBottom: "1px dotted rgba(184,146,77,0.3)",
                transform: "translateY(-3px)",
              }}
            />
            <span
              className="font-display italic"
              style={{
                fontSize: 17,
                fontWeight: 500,
                color: "var(--c-gold-300)",
                letterSpacing: "-0.01em",
              }}
            >
              {r.value}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, paddingTop: 12, borderTop: "0.5px dashed rgba(184,146,77,0.25)" }}>
        <span
          className="caption"
          style={{
            color: "var(--c-paper-300)",
            opacity: 0.65,
            fontSize: 12.5,
            lineHeight: 1.5,
            textWrap: "pretty",
          }}
        >
          Każdą pozycję edytujesz inline i akceptujesz osobno — nic nie trafia do Vault bez
          Twojej zgody.
        </span>
      </div>
    </div>
  );
}

function PoImporcie() {
  return (
    <div
      className="tex-paper-aged tex-noise-fine relative"
      style={{
        boxShadow:
          "0 1px 0 rgba(255,250,235,0.5) inset, 0 -1px 0 rgba(80,50,20,0.2) inset, 0 20px 44px -18px rgba(0,0,0,0.7), 0 3px 6px rgba(0,0,0,0.4)",
        transform: "rotate(0.4deg)",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{ inset: 10, border: "0.5px solid rgba(146,112,55,0.45)", zIndex: 2 }}
      />
      <div
        className="relative"
        style={{ padding: "24px 30px 22px", zIndex: 3, flex: 1, display: "flex", flexDirection: "column" }}
      >
        <span className="eyebrow" style={{ color: "rgba(139,46,31,0.8)", fontSize: 9.5, display: "block" }}>
          Po imporcie
        </span>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "14px 0",
          }}
        >
          <div
            className="font-display italic"
            style={{
              fontSize: 28,
              color: "#1B1108",
              fontWeight: 600,
              letterSpacing: "-0.015em",
              lineHeight: 1.1,
              marginBottom: 12,
              textWrap: "pretty",
            }}
          >
            Od razu zamień notatki w rytm.
          </div>
          <p
            className="caption"
            style={{
              color: "rgba(27,17,8,0.68)",
              fontSize: 13,
              lineHeight: 1.55,
              margin: 0,
              textWrap: "pretty",
            }}
          >
            Najlepsza karta ma teorię, pytania i jedną frazę do Salonu. Po zapisie aplikacja
            zaproponuje pierwszą krótką sesję.
          </p>
        </div>
        <div
          className="flex items-center justify-between"
          style={{ paddingTop: 10, borderTop: "0.5px dashed rgba(27,17,8,0.25)" }}
        >
          <span
            className="signature"
            style={{ color: "rgba(27,17,8,0.5)", fontSize: 10.5, letterSpacing: "0.12em" }}
          >
            — Kurator zbioru
          </span>
          <span aria-hidden style={{ color: "rgba(139,46,31,0.6)", fontSize: 13 }}>
            ❦
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Stopka
   ============================================================ */

function OrnamentDivider() {
  return (
    <div className="ornament-sep" style={{ padding: "0 24px" }} aria-hidden>
      <span style={{ fontSize: 13 }}>❦</span>
    </div>
  );
}

const MONTHS_PL_SHORT = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
const WEEKDAYS_PL = ["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"];

function PageFooter() {
  const d = new Date();
  return (
    <div
      className="flex items-center justify-between flex-wrap gap-4"
      style={{
        padding: "28px 24px 48px",
        borderTop: "1px solid rgba(184,146,77,0.18)",
        marginTop: 28,
      }}
    >
      <div className="signature" style={{ color: "var(--c-paper-300)", opacity: 0.55 }}>
        The Learning Vault · Anno MMXXVI · Admin
      </div>
      <div className="signature" style={{ color: "var(--c-paper-300)", opacity: 0.55 }}>
        ❦
      </div>
      <div className="signature" style={{ color: "var(--c-paper-300)", opacity: 0.55 }}>
        {WEEKDAYS_PL[d.getDay()]} · {d.getDate()} · {MONTHS_PL_SHORT[d.getMonth()]}
      </div>
    </div>
  );
}
