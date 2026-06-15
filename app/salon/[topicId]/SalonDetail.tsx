"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  markTopicShownInSalon,
  useSalonPhrases,
  useTopics,
  useVaults,
} from "@/lib/firestore-data";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import {
  awardP30Xp,
  pillarForVaultSlug,
  P30_PILLAR_LABELS,
} from "@/lib/projekt30-xp";
import { useUser } from "@/lib/auth-context";
import { XpToast, type XpAward } from "@/components/ui/XpToast";

export function SalonDetail({ topicId }: { topicId: string }) {
  const user = useUser();
  const topics = useTopics();
  const phrases = useSalonPhrases();
  const vaults = useVaults();
  const markedRef = useRef(false);

  const [attempt, setAttempt] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [fbBusy, setFbBusy] = useState(false);
  const [fbErr, setFbErr] = useState<string | null>(null);
  const [xpAward, setXpAward] = useState<XpAward | null>(null);
  const xpIdRef = useRef(0);

  function flashXp(xp: number, slug: string | undefined) {
    xpIdRef.current += 1;
    setXpAward({
      xp,
      pillar: P30_PILLAR_LABELS[pillarForVaultSlug(slug)],
      id: xpIdRef.current,
    });
  }

  const topic = useMemo(
    () => topics?.find((t) => t.id === topicId) ?? null,
    [topics, topicId]
  );
  const phrase = useMemo(
    () => phrases?.find((p) => p.topicId === topicId) ?? null,
    [phrases, topicId]
  );
  const vault = useMemo(
    () => (topic && vaults ? vaults.find((v) => v.id === topic.vaultId) : null),
    [topic, vaults]
  );

  // Bump lastShownInSalon once on mount, after we have the topic.
  // Plus best-effort XP do P30 (+5 za odsłonięcie salonowego tematu).
  // Pillar wyznaczony z vault.slug, jeśli vault jest już załadowany.
  useEffect(() => {
    if (topic && !markedRef.current) {
      markedRef.current = true;
      markTopicShownInSalon(topic.id).catch(() => {});
      void awardP30Xp({
        xp: 5,
        source: "vault:salon-view",
        pillar: pillarForVaultSlug(vault?.slug),
      });
      flashXp(5, vault?.slug);
    }
  }, [topic, vault]);

  async function evaluate() {
    if (!topic || !phrase) return;
    if (attempt.trim().length < 10) {
      setFbErr("Powiedz coś więcej — przynajmniej zdanie.");
      return;
    }
    setFbBusy(true);
    setFbErr(null);
    setFeedback(null);
    try {
      const idToken = (await user?.getIdToken()) ?? "";
      const res = await fetch("/api/salon-feedback", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          topic: topic.title,
          reference: {
            short: phrase.short,
            expand: phrase.expand,
            trap: phrase.trap,
          },
          attempt,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as { feedback?: string };
      setFeedback(data.feedback ?? null);
      void awardP30Xp({
        xp: 5,
        source: "vault:salon-finesse",
        pillar: pillarForVaultSlug(vault?.slug),
      });
      flashXp(5, vault?.slug);
    } catch (e) {
      setFbErr(e instanceof Error ? e.message : "Nie udało się ocenić.");
    } finally {
      setFbBusy(false);
    }
  }

  const loading = topics === null || phrases === null || vaults === null;

  if (loading) {
    return <PageSkeleton rows={2} />;
  }

  if (!topic || !phrase) {
    return (
      <div className="space-y-6">
        <Link
          href="/salon"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold"
        >
          <ArrowLeft className="w-4 h-4" /> Salon
        </Link>
        <p className="hero-italic text-3xl text-muted">
          Nie ma frazy do tego tematu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Link
        href="/salon"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Salon
      </Link>

      <header>
        <div className="eyebrow">{vault?.name ?? "Salon"}</div>
        <h1 className="hero-italic text-4xl mt-2">{topic.title}</h1>
      </header>

      {topic.imageUrl && (
        <figure className="max-w-2xl">
          <img
            src={topic.imageUrl}
            alt={topic.imageCaption ?? topic.title}
            className="w-full h-auto border border-line"
          />
          {topic.imageCaption && (
            <figcaption className="text-xs text-muted mt-2 italic">
              {topic.imageCaption}
            </figcaption>
          )}
        </figure>
      )}

      <article className="salon-menu max-w-2xl">
        <div className="relative">
          <div className="salon-menu-eyebrow">Krótko · 30 sekund</div>
          <p className="salon-menu-short">{phrase.short}</p>

          <div className="salon-menu-divider" aria-hidden>
            <span className="salon-menu-ornament">❦</span>
          </div>

          <div className="salon-menu-eyebrow">Rozbudowanie · 60 sekund</div>
          <p className="salon-menu-body">{phrase.expand}</p>

          <div className="salon-menu-divider" aria-hidden>
            <span className="salon-menu-ornament">❦</span>
          </div>

          <div className="salon-menu-eyebrow">Pułapka</div>
          <p className="salon-menu-trap">{phrase.trap}</p>
        </div>
      </article>

      <section className="salon-practice max-w-2xl">
        <div className="eyebrow text-gold/70">Twoja wersja · ocena finezji</div>
        <p className="text-sm text-muted mt-2">
          Powiedz to swoimi słowami — tak, jakbyś rzuciła to przy stole. Ocenię
          finezję i podpowiem, co dopracować.
        </p>
        <textarea
          value={attempt}
          onChange={(e) => setAttempt(e.target.value)}
          disabled={fbBusy}
          rows={4}
          className="w-full border border-line rounded px-4 py-3 text-sm bg-cream focus:outline-none focus:border-gold/40 mt-4"
          placeholder="Twoje dwa–trzy zdania na temat..."
        />
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={evaluate}
            disabled={fbBusy || attempt.trim().length < 10}
            className="btn-primary disabled:opacity-60"
          >
            {fbBusy ? "Oceniam..." : "Oceń finezję"}
          </button>
          {fbErr && <span className="text-sm text-danger">{fbErr}</span>}
        </div>

        {feedback && (
          <div className="mt-5 border-t border-line pt-5">
            <div className="eyebrow text-gold/70">Ocena finezji</div>
            <p className="salon-menu-body mt-2">{feedback}</p>
          </div>
        )}
      </section>

      <div className="flex gap-3">
        <Link href="/salon" className="btn-ghost">
          Inny temat
        </Link>
        <Link
          href={`/study/session/new?topic=${topic.id}`}
          className="btn-primary"
        >
          Przerób na quizie
        </Link>
      </div>

      <XpToast award={xpAward} onDone={() => setXpAward(null)} />
    </div>
  );
}
