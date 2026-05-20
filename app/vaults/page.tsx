"use client";

import { useMemo } from "react";
import Link from "next/link";
import { VaultIcon } from "@/components/ui/VaultIcon";
import { useTopics, useVaults } from "@/lib/firestore-data";
import type { Timestamp } from "firebase/firestore";

function toMillis(v: unknown): number {
  if (!v) return 0;
  if (v instanceof Date) return v.getTime();
  if (typeof v === "object" && v && "toMillis" in v) {
    return (v as Timestamp).toMillis();
  }
  return 0;
}

export default function VaultsPage() {
  const vaults = useVaults();
  const topics = useTopics();

  const dueByVault = useMemo(() => {
    const map: Record<string, number> = {};
    if (!topics) return map;
    const now = Date.now();
    for (const t of topics) {
      const isDue =
        t.status === "struggling" ||
        t.status === "fresh" ||
        (t.status === "due") ||
        toMillis(t.nextReview) <= now;
      if (isDue && t.status !== "mastered") {
        map[t.vaultId] = (map[t.vaultId] ?? 0) + 1;
      }
    }
    return map;
  }, [topics]);

  const totalByVault = useMemo(() => {
    const map: Record<string, number> = {};
    if (!topics) return map;
    for (const t of topics) {
      map[t.vaultId] = (map[t.vaultId] ?? 0) + 1;
    }
    return map;
  }, [topics]);

  if (vaults === null) {
    return <div className="text-muted hero-italic text-2xl">Ładuję sekcje...</div>;
  }

  return (
    <div className="space-y-10">
      <header>
        <div className="eyebrow">Twoje obszary</div>
        <h1 className="hero-italic text-5xl mt-2">Sekcje</h1>
        <p className="text-muted mt-3 max-w-xl">
          {vaults.length} obszarów, jeden rytm. Każda sekcja ma własną kolejkę.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vaults.map((v, i) => {
          const dueCount = dueByVault[v.id] ?? 0;
          const total = totalByVault[v.id] ?? 0;
          return (
            <Link
              key={v.id}
              href={`/vaults/${v.slug}`}
              className="card card-hover group block relative animate-fadein"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-10 h-10 rounded flex items-center justify-center ${
                    v.color === "gold"
                      ? "bg-gold/10 text-gold"
                      : v.color === "rose"
                      ? "bg-rose/10 text-rose"
                      : "bg-forest/10 text-forest"
                  }`}
                >
                  <VaultIcon name={v.icon} />
                </div>
                {dueCount > 0 && (
                  <span className="text-[10px] uppercase tracking-eyebrow text-forest bg-gold/20 border border-gold/30 rounded-full px-2.5 py-1">
                    {dueCount} dziś
                  </span>
                )}
              </div>

              <div className="eyebrow mt-6">{v.level}</div>
              <div className="hero-italic text-2xl mt-1 text-ink">{v.name}</div>
              <div className="text-xs text-muted mt-4">
                {total} {total === 1 ? "temat" : total < 5 ? "tematy" : "tematów"}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
