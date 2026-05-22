"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowLeft, Sparkles } from "lucide-react";
import { useUser } from "@/lib/auth-context";
import { commitSuggestion, useVaults } from "@/lib/firestore-data";
import { PRESETS } from "./presets";

export function PresetClient() {
  const user = useUser();
  const vaults = useVaults();
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState<Record<string, string>>({});

  async function addPreset(presetSlug: string) {
    const preset = PRESETS.find((p) => p.slug === presetSlug);
    if (!preset || !user || !vaults) return;
    const vault = vaults.find((v) => v.slug === preset.vaultSlug);
    if (!vault) {
      setErr(`Brak sekcji o slug=${preset.vaultSlug} w bazie.`);
      return;
    }
    setBusy(presetSlug);
    setErr(null);
    try {
      const result = await commitSuggestion({
        userId: user.uid,
        vaultId: vault.id,
        payload: preset.payload,
      });
      setSaved((s) => ({ ...s, [presetSlug]: result.topicId }));
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Zapis nie powiódł się.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-10">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Admin
      </Link>

      <header>
        <div className="eyebrow">Ręcznie skomponowane</div>
        <h1 className="hero-italic text-5xl mt-2">Gotowe tematy</h1>
        <p className="text-muted mt-3 max-w-xl">
          Pełne tematy napisane bez Claude API — działają zawsze, niezależnie od
          kredytów Anthropic czy timeoutu Vercel. Klikasz raz, temat ląduje w
          odpowiedniej sekcji z pełnym kompletem pytań i fraz Salonu.
        </p>
      </header>

      <section className="space-y-6">
        {PRESETS.map((p) => {
          const savedTopicId = saved[p.slug];
          const isBusy = busy === p.slug;
          const vault = vaults?.find((v) => v.slug === p.vaultSlug);

          return (
            <article key={p.slug} className="card max-w-3xl">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="eyebrow">
                    {vault?.name ?? p.vaultSlug.toUpperCase()}
                  </div>
                  <h2 className="hero-italic text-3xl mt-1 text-ink">
                    {p.payload.title}
                  </h2>
                  <p className="text-sm text-muted mt-3 max-w-2xl">
                    {p.payload.summary}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6 text-xs">
                <div className="border border-line rounded p-3">
                  <div className="eyebrow">Teoria</div>
                  <div className="text-muted mt-1">
                    {p.payload.theory.length} znaków
                  </div>
                </div>
                <div className="border border-line rounded p-3">
                  <div className="eyebrow">Pytania</div>
                  <div className="text-muted mt-1">
                    {p.payload.questions.length} sztuk
                  </div>
                </div>
                <div className="border border-line rounded p-3">
                  <div className="eyebrow">Salon</div>
                  <div className="text-muted mt-1">
                    {p.payload.salon ? "3 zdania" : "brak"}
                  </div>
                </div>
              </div>

              <details className="mt-5">
                <summary className="cursor-pointer text-sm text-gold hover:text-gold-2">
                  Podgląd pytań
                </summary>
                <ol className="mt-3 space-y-2 text-sm text-muted list-decimal pl-5">
                  {p.payload.questions.map((q, i) => (
                    <li key={i}>
                      <span className="text-[10px] uppercase tracking-eyebrow text-gold/70 mr-2">
                        {q.type}
                      </span>
                      {q.text}
                    </li>
                  ))}
                </ol>
              </details>

              <div className="mt-6 flex gap-3 items-center flex-wrap">
                {savedTopicId ? (
                  <>
                    <div className="inline-flex items-center gap-2 text-forest text-sm">
                      <Check className="w-4 h-4" />
                      Dodane do Vault
                    </div>
                    <Link
                      href={`/study/session/new?topic=${savedTopicId}`}
                      className="btn-primary"
                    >
                      Zrób sesję 15 min
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => addPreset(p.slug)}
                    disabled={isBusy || !user || !vaults}
                    className="btn-primary disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isBusy ? "Dodaję..." : `Dodaj do ${vault?.name ?? p.vaultSlug}`}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {err && <p className="text-sm text-danger">{err}</p>}

      <p className="text-xs text-muted max-w-xl">
        Jeśli chcesz dorzucić kolejny temat, edytuj plik{" "}
        <code className="text-gold/80">app/admin/preset/presets.ts</code> i
        dodaj kolejny obiekt do tablicy PRESETS. Kolejność: title, summary,
        theory, 8 pytań, salon.
      </p>
    </div>
  );
}
