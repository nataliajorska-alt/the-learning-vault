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

  // Bump lastShownInSalon once on mount, after we have the topic
  useEffect(() => {
    if (topic && !markedRef.current) {
      markedRef.current = true;
      markTopicShownInSalon(topic.id).catch(() => {});
    }
  }, [topic]);

  const loading = topics === null || phrases === null || vaults === null;

  if (loading) {
    return <p className="hero-italic text-2xl text-muted">Ładuję...</p>;
  }

  if (!topic || !phrase) {
    return (
      <div className="space-y-6">
        <Link
          href="/salon"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest"
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
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Salon
      </Link>

      <header>
        <div className="eyebrow">{vault?.name ?? "Salon"}</div>
        <h1 className="hero-italic text-5xl mt-2">{topic.title}</h1>
      </header>

      <article className="card max-w-2xl">
        <div className="space-y-7 text-base">
          <div>
            <div className="eyebrow text-forest/60">Krótko · 30s</div>
            <p className="prose-old-money hero-italic text-xl mt-3 leading-snug">
              {phrase.short}
            </p>
          </div>
          <div className="border-t border-line pt-7">
            <div className="eyebrow text-forest/60">Rozbudowanie · 60s</div>
            <p className="prose-old-money mt-3">{phrase.expand}</p>
          </div>
          <div className="border-t border-line pt-7">
            <div className="eyebrow text-forest/60">Pułapka</div>
            <p className="prose-old-money mt-3 text-muted">{phrase.trap}</p>
          </div>
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
