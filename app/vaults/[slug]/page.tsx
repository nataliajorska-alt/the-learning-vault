"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CatalogCard, type StampColor } from "@/components/ui/CatalogCard";
import { VaultIcon } from "@/components/ui/VaultIcon";
import { useTopics, useVaultBySlug } from "@/lib/firestore-data";

const statusLabel: Record<string, string> = {
  fresh: "świeże",
  due: "do powtórki",
  mastered: "opanowane",
  struggling: "uciążliwe",
};

const statusStampColor: Record<string, StampColor> = {
  fresh: "blue",
  due: "red",
  mastered: "green",
  struggling: "orange",
};

function vaultSig(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 4)
    .toUpperCase();
}

function idSig(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return String(hash % 1000).padStart(3, "0");
}

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
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold"
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
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold transition-colors"
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
              : "bg-gold/10 text-gold"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {topics.map((t, i) => (
            <CatalogCard
              key={t.id}
              href={`/study/session/new?topic=${t.id}`}
              signature={`${vaultSig(vault.name)} · ${idSig(t.id)}`}
              rightMeta={
                t.totalAttempts > 0
                  ? `${Math.round((t.totalCorrect / t.totalAttempts) * 100)}%`
                  : "—"
              }
              title={t.title}
              subtitle={t.summary}
              stamp={{
                label: statusLabel[t.status] ?? t.status,
                color: statusStampColor[t.status] ?? "gold",
              }}
              delayMs={i * 35}
            />
          ))}
        </div>
      )}
    </div>
  );
}
