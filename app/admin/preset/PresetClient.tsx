"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ArrowLeft, Sparkles, BookOpen } from "lucide-react";
import { useUser } from "@/lib/auth-context";
import {
  commitSuggestion,
  ensureVault,
  useTopics,
  useVaults,
} from "@/lib/firestore-data";
import { awardP30Xp, pillarForVaultSlug } from "@/lib/projekt30-xp";
import { PRESETS } from "./presets";

export function PresetClient() {
  const user = useUser();
  const vaults = useVaults();
  const topics = useTopics();
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState<Record<string, string>>({});

  // Detekcja: dla każdego presetSlug → znajdź topicId zaimportowanego wcześniej.
  // Najpierw po polu presetSlug (nowe importy), potem fallback po identycznym
  // title (stare importy sprzed wprowadzenia presetSlug).
  const importedMap = useMemo(() => {
    const m: Record<string, string> = {};
    if (!topics) return m;
    for (const t of topics) {
      if (t.presetSlug) m[t.presetSlug] = t.id;
    }
    for (const p of PRESETS) {
      if (m[p.slug]) continue;
      const match = topics.find(
        (t) =>
          !t.presetSlug && t.title.trim() === p.payload.title.trim()
      );
      if (match) m[p.slug] = match.id;
    }
    return m;
  }, [topics]);

  async function addPreset(presetSlug: string) {
    const preset = PRESETS.find((p) => p.slug === presetSlug);
    if (!preset || !user || !vaults) return;
    let vaultId = vaults.find((v) => v.slug === preset.vaultSlug)?.id;
    if (!vaultId && !preset.vaultMeta) {
      setErr(
        `Brak sekcji o slug=${preset.vaultSlug} i preset nie ma vaultMeta — nie wiem, jak ją utworzyć.`
      );
      return;
    }
    setBusy(presetSlug);
    setErr(null);
    try {
      // Auto-create vault, jeśli nie istnieje a preset dostarczył metadane.
      // Pozwala dorzucać nowe sekcje (np. „Sport") bez re-seedowania.
      if (!vaultId && preset.vaultMeta) {
        vaultId = await ensureVault({
          userId: user.uid,
          slug: preset.vaultSlug,
          ...preset.vaultMeta,
        });
      }
      const result = await commitSuggestion({
        userId: user.uid,
        vaultId: vaultId!,
        payload: preset.payload,
        presetSlug: preset.slug,
      });
      setJustSaved((s) => ({ ...s, [presetSlug]: result.topicId }));
      // Best-effort XP to Projekt 30 (+10 za import nowego tematu).
      void awardP30Xp({
        xp: 10,
        source: "vault:preset-import",
        pillar: pillarForVaultSlug(preset.vaultSlug),
      });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Zapis nie powiódł się.");
    } finally {
      setBusy(null);
    }
  }

  const totalImported =
    Object.keys(importedMap).filter((k) =>
      PRESETS.some((p) => p.slug === k)
    ).length;

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
        {topics !== null && (
          <p className="text-xs text-muted mt-4">
            Zaimportowane: <span className="text-gold">{totalImported}</span> z{" "}
            {PRESETS.length}
          </p>
        )}
      </header>

      <section className="space-y-6">
        {/* Nowe presety dodawane są na końcu tablicy PRESETS w pliku — w UI
            wyświetlamy je od ostatnio dodanych (najświeższy import na górze). */}
        {[...PRESETS].reverse().map((p) => {
          const justSavedTopicId = justSaved[p.slug];
          const previouslyImportedTopicId = importedMap[p.slug];
          const importedTopicId = justSavedTopicId ?? previouslyImportedTopicId;
          const isImported = Boolean(importedTopicId);
          const isBusy = busy === p.slug;
          const vault = vaults?.find((v) => v.slug === p.vaultSlug);

          return (
            <article
              key={p.slug}
              className={`card max-w-3xl ${isImported ? "opacity-70" : ""}`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="eyebrow">
                      {vault?.name ?? p.vaultMeta?.name ?? p.vaultSlug.toUpperCase()}
                    </div>
                    {isImported && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-eyebrow text-forest bg-gold/15 border border-gold/30 rounded-full px-2 py-0.5">
                        <Check className="w-3 h-3" />
                        zaimportowane
                      </span>
                    )}
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
                {isImported ? (
                  <>
                    <Link
                      href={`/study/session/new?topic=${importedTopicId}`}
                      className="btn-ghost"
                    >
                      <BookOpen className="w-4 h-4" />
                      Zrób sesję 15 min
                    </Link>
                    <span className="text-xs text-muted">
                      Temat jest w Vault. Możesz odświeżać sesję w nieskończoność.
                    </span>
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
        theory, 8 pytań, salon. Pole presetSlug pozwala oznaczyć temat jako
        zaimportowany — nie da się go dodać drugi raz.
      </p>
    </div>
  );
}
