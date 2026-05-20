"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Wine } from "lucide-react";
import { useSalonPhrases, useTopics, useVaults } from "@/lib/firestore-data";
import type { SalonPhrase, Topic, Vault } from "@/lib/types";
import type { Timestamp } from "firebase/firestore";

function toMillis(v: unknown): number {
  if (!v) return 0;
  if (v instanceof Date) return v.getTime();
  if (typeof v === "object" && v && "toMillis" in v) {
    return (v as Timestamp).toMillis();
  }
  return 0;
}

interface Entry {
  topic: Topic;
  phrase: SalonPhrase;
  vault: Vault;
}

export default function SalonPage() {
  const topics = useTopics();
  const phrases = useSalonPhrases();
  const vaults = useVaults();

  const loading = topics === null || phrases === null || vaults === null;

  const entries = useMemo<Entry[]>(() => {
    if (!topics || !phrases || !vaults) return [];
    const out: Entry[] = [];
    for (const p of phrases) {
      const topic = topics.find((t) => t.id === p.topicId);
      if (!topic) continue;
      const vault = vaults.find((v) => v.id === topic.vaultId);
      if (!vault) continue;
      out.push({ topic, phrase: p, vault });
    }
    return out;
  }, [topics, phrases, vaults]);

  const topicOfDay = useMemo(() => {
    if (entries.length === 0) return null;
    return [...entries].sort(
      (a, b) => toMillis(a.topic.lastShownInSalon) - toMillis(b.topic.lastShownInSalon)
    )[0];
  }, [entries]);

  const grouped = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const e of entries) {
      const key = e.vault.name;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b, "pl"));
  }, [entries]);

  return (
    <div className="space-y-12">
      <header>
        <div className="eyebrow">Rozmowa przy winie</div>
        <h1 className="hero-italic text-5xl mt-2">Salon</h1>
        <p className="text-muted mt-3 max-w-xl">
          Trzy zdania na temat. Krótko, rozbudowanie, pułapka. Praktyczne
          obycie, nie egzamin.
        </p>
      </header>

      {loading ? (
        <p className="hero-italic text-2xl text-muted">Ładuję...</p>
      ) : entries.length === 0 ? (
        <div className="card text-center py-16">
          <p className="hero-italic text-2xl text-muted">
            Tu jeszcze nic nie ma.
          </p>
          <p className="text-sm text-muted mt-2">
            Tematy do Salonu dodasz przez Admin razem z teorią.
          </p>
        </div>
      ) : (
        <>
          {topicOfDay && (
            <section>
              <Link
                href={`/salon/${topicOfDay.topic.id}`}
                className="card card-hover group block ring-1 ring-gold/20"
              >
                <div className="flex items-center gap-2 eyebrow">
                  <Wine className="w-3 h-3" />
                  Temat dnia · {topicOfDay.vault.name}
                </div>
                <h2 className="hero-italic text-3xl mt-2 text-ink">
                  {topicOfDay.topic.title}
                </h2>
                <p className="text-muted text-sm mt-3 max-w-xl">
                  {topicOfDay.phrase.short}
                </p>
                <div className="flex items-center gap-2 text-gold text-sm mt-5 group-hover:gap-3 transition-all">
                  Otwórz <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </section>
          )}

          {grouped.map(([vaultName, items]) => (
            <section key={vaultName}>
              <div className="eyebrow mb-4">{vaultName}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((e, i) => (
                  <Link
                    key={e.phrase.id}
                    href={`/salon/${e.topic.id}`}
                    className="card card-hover group block animate-fadein"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="hero-italic text-2xl text-ink">
                      {e.topic.title}
                    </div>
                    <p className="text-sm text-muted mt-2 line-clamp-2">
                      {e.phrase.short}
                    </p>
                    <div className="flex items-center gap-2 text-gold text-xs mt-4 opacity-70 group-hover:opacity-100 transition-opacity">
                      3 zdania <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
