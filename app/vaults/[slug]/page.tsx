"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StatusDot } from "@/components/ui/StatusDot";
import { VaultIcon } from "@/components/ui/VaultIcon";
import { useTopics, useVaultBySlug } from "@/lib/firestore-data";

const statusLabel: Record<string, string> = {
  fresh: "świeże",
  due: "do powtórki",
  mastered: "opanowane",
  struggling: "uciążliwe",
};

export default function VaultDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const vault = useVaultBySlug(params.slug);
  const allTopics = useTopics(vault?.id);

  if (vault === undefined) {
    return <div className="text-muted hero-italic text-2xl">Ładuję...</div>;
  }
  if (!vault) {
    return (
      <div className="space-y-6">
        <Link
          href="/vaults"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest"
        >
          <ArrowLeft className="w-4 h-4" /> Sekcje
        </Link>
        <p className="hero-italic text-3xl text-muted">Nie ma takiej sekcji.</p>
      </div>
    );
  }

  const topics = allTopics ?? [];

  return (
    <div className="space-y-10">
      <Link
        href="/vaults"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Sekcje
      </Link>

      <header className="flex items-start gap-5">
        <div
          className={`w-12 h-12 rounded flex items-center justify-center shrink-0 ${
            vault.color === "gold"
              ? "bg-gold/10 text-gold"
              : vault.color === "rose"
              ? "bg-rose/10 text-rose"
              : "bg-forest/10 text-forest"
          }`}
        >
          <VaultIcon name={vault.icon} className="w-6 h-6 stroke-[1.5]" />
        </div>
        <div>
          <div className="eyebrow">{vault.level}</div>
          <h1 className="hero-italic text-5xl mt-1">{vault.name}</h1>
          <p className="text-muted mt-3 max-w-xl">
            {topics.length}{" "}
            {topics.length === 1 ? "temat" : topics.length < 5 ? "tematy" : "tematów"} w
            tej sekcji.
          </p>
        </div>
      </header>

      {topics.length === 0 ? (
        <div className="card text-center py-16">
          <p className="hero-italic text-2xl text-muted">
            Tu jeszcze nic nie ma.
          </p>
          <p className="text-sm text-muted mt-2">
            Wklej notatki w sekcji Admin, a ja podpowiem strukturę.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-line border-t border-b border-line">
          {topics.map((t, i) => (
            <li
              key={t.id}
              className="animate-fadein"
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <Link
                href={`/study/session/new?topic=${t.id}`}
                className="flex items-center gap-4 py-5 group hover:bg-cream/60 -mx-2 px-2 rounded transition-colors"
              >
                <div className="w-5 flex items-center justify-center">
                  <StatusDot status={t.status} />
                </div>
                <div className="flex-1">
                  <div className="hero-italic text-xl text-ink">{t.title}</div>
                  <div className="text-xs text-muted mt-1">{t.summary}</div>
                </div>
                <div className="text-[10px] uppercase tracking-eyebrow text-muted whitespace-nowrap">
                  {statusLabel[t.status]}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
