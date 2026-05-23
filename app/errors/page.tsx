"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Filter } from "lucide-react";
import { CatalogCard } from "@/components/ui/CatalogCard";
import { useErrors, useVaults } from "@/lib/firestore-data";

function sigFromVault(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 4)
    .toUpperCase();
}

function sigFromId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return String(hash % 1000).padStart(3, "0");
}

export default function ErrorsPage() {
  const errors = useErrors();
  const vaults = useVaults();

  const [vaultFilter, setVaultFilter] = useState<string>("all");
  const [onlyTough, setOnlyTough] = useState(false);

  const filtered = useMemo(() => {
    if (!errors) return null;
    return errors.filter((e) => {
      if (vaultFilter !== "all" && e.vaultName !== vaultFilter) return false;
      if (onlyTough && e.timesWrong < 3) return false;
      return true;
    });
  }, [errors, vaultFilter, onlyTough]);

  const vaultNames = useMemo(() => {
    if (!vaults) return [];
    const names = new Set<string>();
    errors?.forEach((e) => names.add(e.vaultName));
    return Array.from(names).sort();
  }, [vaults, errors]);

  return (
    <div className="space-y-10">
      <header className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="eyebrow">Twoje błędy</div>
          <h1 className="hero-italic text-5xl mt-2">Error Vault</h1>
          <p className="text-muted mt-3 max-w-xl">
            Tylko twoje błędy. Im więcej razy je popełniłaś, tym wyżej. Po trzech
            poprawnych z rzędu wpis znika z aktywnej listy.
          </p>
        </div>
        {errors && errors.length > 0 && (
          <Link href="/errors/quiz" className="btn-primary self-start">
            Quiz z błędów
          </Link>
        )}
      </header>

      {errors === null ? (
        <p className="hero-italic text-2xl text-muted">Ładuję...</p>
      ) : errors.length === 0 ? (
        <div className="card text-center py-16">
          <p className="hero-italic text-2xl text-muted">Nic tu nie zalega.</p>
          <p className="text-sm text-muted mt-2">
            Albo nie popełniłaś jeszcze błędów, albo wszystkie się zrehabilitowały.
          </p>
        </div>
      ) : (
        <>
          <section className="flex items-center gap-3 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-muted" />
            <select
              value={vaultFilter}
              onChange={(e) => setVaultFilter(e.target.value)}
              className="text-sm border border-line rounded px-3 py-2 bg-cream focus:outline-none focus:border-gold/40"
            >
              <option value="all">Wszystkie sekcje</option>
              {vaultNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <label className="text-sm text-muted flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyTough}
                onChange={(e) => setOnlyTough(e.target.checked)}
                className="accent-gold"
              />
              Tylko uciążliwe (3+ błędy)
            </label>
            <span className="text-xs text-muted ml-auto">
              {filtered?.length ?? 0} z {errors.length}
            </span>
          </section>

          {filtered && filtered.length === 0 ? (
            <p className="text-sm text-muted">
              Nic nie pasuje do filtrów.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filtered!.map((e, i) => {
                const tough = e.timesWrong >= 3;
                return (
                  <CatalogCard
                    key={e.id}
                    signature={`${sigFromVault(e.vaultName)} · ${sigFromId(e.id)}`}
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
                    footer={
                      e.correctStreak > 0
                        ? `${e.correctStreak}/3 do rehabilitacji`
                        : undefined
                    }
                    stamp={
                      tough
                        ? { label: "uciążliwe", color: "orange" }
                        : { label: "do upilnowania", color: "red" }
                    }
                    delayMs={i * 40}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
