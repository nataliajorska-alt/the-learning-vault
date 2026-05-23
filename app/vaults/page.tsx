"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Bookshelf } from "@/components/ui/Bookshelf";
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
        t.status === "due" ||
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

  const totalDue = Object.values(dueByVault).reduce((s, n) => s + n, 0);

  return (
    <div className="space-y-12">
      <header>
        <div className="eyebrow">Twoja biblioteka</div>
        <h1 className="hero-italic text-5xl mt-2">Regał</h1>
        <p className="text-muted mt-3 max-w-xl">
          {vaults.length} tomów, jeden rytm.{" "}
          {totalDue > 0
            ? `Dziś ${totalDue} ${totalDue === 1 ? "rzecz czeka" : "rzeczy czekają"} na otwarcie.`
            : "Dziś nic nie zalega."}
        </p>
      </header>

      <section
        className="relative -mx-2 sm:mx-0 px-2 py-8 sm:py-10 rounded"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(184,146,77,0.08) 0%, transparent 60%), linear-gradient(180deg, rgba(18,10,4,0.5) 0%, rgba(27,17,8,0.2) 100%)",
        }}
      >
        <Bookshelf
          vaults={vaults}
          dueByVault={dueByVault}
          totalByVault={totalByVault}
        />
      </section>

      <section>
        <div className="eyebrow mb-4">Katalog</div>
        <ul className="divide-y divide-line border-y border-line">
          {vaults.map((v) => {
            const dueCount = dueByVault[v.id] ?? 0;
            const total = totalByVault[v.id] ?? 0;
            return (
              <li key={v.id}>
                <Link
                  href={`/vaults/${v.slug}`}
                  className="flex items-center gap-4 py-3 px-2 hover:bg-cream/40 transition-colors group"
                >
                  <span
                    className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                      v.color === "rose"
                        ? "bg-rose/15 text-rose"
                        : v.color === "gold"
                        ? "bg-gold/15 text-gold"
                        : "bg-forest-2/40 text-paper/70"
                    }`}
                  >
                    <VaultIcon name={v.icon} className="w-4 h-4 stroke-[1.5]" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="hero-italic text-lg text-ink truncate">
                      {v.name}
                    </div>
                    <div className="text-[10px] uppercase tracking-eyebrow text-muted mt-0.5">
                      {v.level} · {total} {total === 1 ? "temat" : total < 5 ? "tematy" : "tematów"}
                    </div>
                  </div>
                  {dueCount > 0 && (
                    <span className="text-[10px] uppercase tracking-eyebrow text-gold bg-gold/15 border border-gold/30 rounded-full px-2.5 py-1 shrink-0">
                      {dueCount} dziś
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
