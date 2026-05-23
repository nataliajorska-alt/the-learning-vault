"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Wine } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { CatalogCard } from "@/components/ui/CatalogCard";
import { FirstRunSeed } from "@/components/FirstRunSeed";

function dashSigFromVault(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 4)
    .toUpperCase();
}

function dashSigFromId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return String(hash % 1000).padStart(3, "0");
}
import {
  ensureUserDoc,
  useErrors,
  useSalonPhrases,
  useTopics,
  useVaults,
} from "@/lib/firestore-data";
import type { Timestamp } from "firebase/firestore";

function toMillis(v: unknown): number {
  if (!v) return 0;
  if (v instanceof Date) return v.getTime();
  if (typeof v === "object" && v && "toMillis" in v) {
    return (v as Timestamp).toMillis();
  }
  return 0;
}

export default function DashboardPage() {
  useEffect(() => {
    ensureUserDoc().catch(() => {});
  }, []);

  const vaults = useVaults();
  const topics = useTopics();
  const errors = useErrors();
  const salonPhrases = useSalonPhrases();

  const today = new Date().toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const todayStamp = new Date()
    .toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/\./g, "")
    .toUpperCase();

  const due = useMemo(() => {
    if (!topics) return [];
    const now = Date.now();
    return topics.filter(
      (t) =>
        t.status === "fresh" ||
        t.status === "struggling" ||
        toMillis(t.nextReview) <= now
    );
  }, [topics]);

  const mastered = topics?.filter((t) => t.status === "mastered").length ?? 0;
  const totalAttempts = topics?.reduce((s, t) => s + t.totalAttempts, 0) ?? 0;
  const totalCorrect = topics?.reduce((s, t) => s + t.totalCorrect, 0) ?? 0;
  const accuracy =
    totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const salonTopic = useMemo(() => {
    if (!topics || !salonPhrases || salonPhrases.length === 0) return null;
    const sorted = [...salonPhrases].sort((a, b) => {
      const ta = topics.find((t) => t.id === a.topicId);
      const tb = topics.find((t) => t.id === b.topicId);
      return toMillis(ta?.lastShownInSalon) - toMillis(tb?.lastShownInSalon);
    });
    const pick = sorted[0];
    const topic = topics.find((t) => t.id === pick?.topicId);
    return topic && pick ? { topic, phrase: pick } : null;
  }, [topics, salonPhrases]);

  if (vaults && vaults.length === 0) {
    return (
      <div className="space-y-10">
        <header>
          <div className="eyebrow">{today}</div>
          <h1 className="hero-italic text-5xl md:text-6xl mt-2">
            Witaj w Vault.
          </h1>
          <p className="text-muted mt-4 max-w-xl leading-relaxed">
            Zanim zacznę, muszę założyć dwanaście sekcji i parę startowych
            tematów. Jednokrotnie.
          </p>
        </header>
        <FirstRunSeed />
      </div>
    );
  }

  const loaded = vaults !== null && topics !== null && errors !== null;

  return (
    <div className="space-y-12">
      <header className="relative flex items-start justify-between gap-6">
        <div>
          <div className="eyebrow">{today}</div>
          <h1 className="hero-italic text-5xl md:text-6xl mt-2">
            Dzień dobry, Natalia.
          </h1>
          <p className="text-muted mt-4 max-w-xl leading-relaxed">
            {!loaded
              ? "Ładuję twoją kolejkę..."
              : due.length === 0
              ? "Dziś masz wolne. Wszystko opanowane, nic nie zalega."
              : `Dziś czeka ${due.length} ${due.length === 1 ? "temat" : due.length < 5 ? "tematy" : "tematów"}. Zacznij, kiedy będziesz miała kwadrans.`}
          </p>
        </div>
        <div className="date-stamp shrink-0 mt-2 hidden sm:flex" aria-hidden>
          <span className="date-stamp-top">Zarejestrowano</span>
          <span className="date-stamp-main">{todayStamp}</span>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Do zrobienia dziś" value={due.length} hint="powtórki + świeże" />
        <StatCard label="Trafność" value={`${accuracy}%`} hint="ze wszystkich prób" />
        <StatCard label="Opanowane" value={mastered} hint={`z ${topics?.length ?? 0} tematów`} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link href="/study" className="notice-link block">
          <article className="notice-card min-h-[210px] flex flex-col justify-between">
            <span className="notice-seal" aria-hidden>
              LV
            </span>
            <div className="relative">
              <span className="notice-eyebrow">XV minut</span>
              <h3 className="notice-title">Zacznij sesję</h3>
              <p className="notice-body">
                Trzy minuty teorii, dziesięć minut testu, dwie minuty korekty.
              </p>
            </div>
            <span className="notice-action relative">
              Otwórz księgę <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </article>
        </Link>

        <Link
          href={salonTopic ? `/salon/${salonTopic.topic.id}` : "/salon"}
          className="notice-link block"
        >
          <article className="notice-card min-h-[210px] flex flex-col justify-between">
            <span className="notice-seal" aria-hidden>
              S
            </span>
            <div className="relative">
              <span className="notice-eyebrow">
                <Wine className="w-3 h-3" /> Salon — temat dnia
              </span>
              <h3 className="notice-title">
                {salonTopic?.topic.title ?? "Salon"}
              </h3>
              <p className="notice-body line-clamp-3">
                {salonTopic?.phrase.short ??
                  "Trzy zdania na temat. Praktyczne obycie, nie egzamin."}
              </p>
            </div>
            <span className="notice-action relative">
              Wejdź <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </article>
        </Link>
      </section>

      {errors && errors.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="eyebrow">Error Vault</div>
              <h2 className="hero-italic text-2xl mt-1">
                Ostatnie błędy do upilnowania
              </h2>
            </div>
            <Link
              href="/errors"
              className="text-sm text-gold hover:text-gold-2 transition-colors"
            >
              Wszystkie
            </Link>
          </div>
          <div className="desk-surface grid grid-cols-1 md:grid-cols-3 gap-4">
            {errors.slice(0, 3).map((e, i) => {
              const tough = e.timesWrong >= 3;
              return (
                <CatalogCard
                  key={e.id}
                  href="/errors"
                  signature={`${dashSigFromVault(e.vaultName)} · ${dashSigFromId(e.id)}`}
                  rightMeta={`× ${e.timesWrong}`}
                  title={e.correctVersion}
                  subtitle={
                    <>
                      nie:{" "}
                      <span className="line-through opacity-70">
                        {e.wrongVersion}
                      </span>{" "}
                      · {e.context}
                    </>
                  }
                  stamp={
                    tough
                      ? { label: "uciążliwe", color: "orange" }
                      : { label: "do upilnowania", color: "red" }
                  }
                  delayMs={i * 50}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
