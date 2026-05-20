"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Wine, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { FirstRunSeed } from "@/components/FirstRunSeed";
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
      <header>
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
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Do zrobienia dziś" value={due.length} hint="powtórki + świeże" />
        <StatCard label="Trafność" value={`${accuracy}%`} hint="ze wszystkich prób" />
        <StatCard label="Opanowane" value={mastered} hint={`z ${topics?.length ?? 0} tematów`} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/study"
          className="card card-hover group flex flex-col justify-between min-h-[200px]"
        >
          <div>
            <div className="eyebrow">15 minut</div>
            <div className="hero-italic text-3xl mt-2">Zacznij sesję</div>
            <p className="text-muted text-sm mt-3 max-w-sm">
              Trzy minuty teorii, dziesięć minut testu, dwie minuty korekty.
            </p>
          </div>
          <div className="flex items-center gap-2 text-forest text-sm mt-6 group-hover:gap-3 transition-all">
            Otwórz <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href={salonTopic ? `/salon/${salonTopic.topic.id}` : "/salon"}
          className="card card-hover group flex flex-col justify-between min-h-[200px]"
        >
          <div>
            <div className="flex items-center gap-2 eyebrow">
              <Wine className="w-3 h-3" />
              Salon — temat dnia
            </div>
            <div className="hero-italic text-3xl mt-2">
              {salonTopic?.topic.title ?? "Salon"}
            </div>
            <p className="text-muted text-sm mt-3 max-w-sm line-clamp-3">
              {salonTopic?.phrase.short ?? "Trzy zdania na temat. Praktyczne obycie, nie egzamin."}
            </p>
          </div>
          <div className="flex items-center gap-2 text-forest text-sm mt-6 group-hover:gap-3 transition-all">
            Otwórz <ArrowRight className="w-4 h-4" />
          </div>
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
              className="text-sm text-forest hover:text-forest-2 transition-colors"
            >
              Wszystkie
            </Link>
          </div>
          <div className="space-y-3">
            {errors.slice(0, 3).map((e) => (
              <Link
                key={e.id}
                href="/errors"
                className="card card-hover flex items-start gap-4"
              >
                <AlertTriangle className="w-4 h-4 text-gold stroke-[1.5] mt-1 shrink-0" />
                <div className="flex-1">
                  <div className="eyebrow">{e.vaultName}</div>
                  <div className="hero-italic text-xl mt-1">
                    {e.correctVersion}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    nie:{" "}
                    <span className="line-through">{e.wrongVersion}</span> ·{" "}
                    {e.context}
                  </div>
                </div>
                <div className="text-xs text-muted whitespace-nowrap">
                  ×{e.timesWrong}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
