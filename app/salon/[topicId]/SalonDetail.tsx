"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  markTopicShownInSalon,
  useSalonPhrases,
  useTopics,
  useVaults,
} from "@/lib/firestore-data";
import { awardP30Xp, pillarForVaultSlug } from "@/lib/projekt30-xp";

export function SalonDetail({ topicId }: { topicId: string }) {
  const topics = useTopics();
  const phrases = useSalonPhrases();
  const vaults = useVaults();
  const markedRef = useRef(false);

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
    }
  }, [topic, vault]);

  const loading = topics === null || phrases === null || vaults === null;

  if (loading) {
    return <p className="hero-italic text-2xl text-muted">Ładuję...</p>;
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
        <h1 className="hero-italic text-5xl mt-2">{topic.title}</h1>
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
    </div>
  );
}
