"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Shuffle, AlertTriangle, Library, Target } from "lucide-react";
import { useErrors, useTopics, useVaults } from "@/lib/firestore-data";
import type { Timestamp } from "firebase/firestore";

function toMillis(v: unknown): number {
  if (!v) return 0;
  if (v instanceof Date) return v.getTime();
  if (typeof v === "object" && v && "toMillis" in v) {
    return (v as Timestamp).toMillis();
  }
  return 0;
}

export default function StudyPage() {
  const vaults = useVaults();
  const topics = useTopics();
  const errors = useErrors();

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

  // pick first due topic for "mix" mode link
  const mixTopicId = due[0]?.id;

  const modes = [
    {
      href: mixTopicId
        ? `/study/session/new?mode=mix&topic=${mixTopicId}`
        : "/study/session/new?mode=mix",
      icon: Shuffle,
      title: "Mix dnia",
      desc: `${due.length} ${due.length === 1 ? "temat" : "tematów"} w kolejce.`,
      primary: true,
      disabled: due.length === 0,
    },
    {
      href: "/errors/quiz",
      icon: AlertTriangle,
      title: "Tylko błędy",
      desc: `${errors?.length ?? 0} aktywnych w Error Vault.`,
      disabled: !errors || errors.length === 0,
    },
    {
      href: "/study/session/new?mode=vault",
      icon: Library,
      title: "Konkretna sekcja",
      desc: "Wybierz jedną z poniższych.",
      disabled: false,
    },
    {
      href: "/vaults",
      icon: Target,
      title: "Konkretny temat",
      desc: "Otwórz sekcję i kliknij temat.",
      disabled: false,
    },
  ];

  return (
    <div className="space-y-10">
      <header>
        <div className="eyebrow">15 minut</div>
        <h1 className="hero-italic text-5xl mt-2">Ucz mnie</h1>
        <p className="text-muted mt-3 max-w-xl">
          Wybierz format. Trzy minuty teorii, dziesięć testu, dwie korekty. Bez
          presji, ale z timerem.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modes.map((m) => {
          const Icon = m.icon;
          if (m.disabled) {
            return (
              <div
                key={m.title}
                className="card opacity-50 cursor-not-allowed"
                aria-disabled
              >
                <Icon className="w-5 h-5 stroke-[1.5] text-forest" />
                <div className="hero-italic text-2xl mt-4">{m.title}</div>
                <p className="text-sm text-muted mt-2">{m.desc}</p>
              </div>
            );
          }
          return (
            <Link
              key={m.title}
              href={m.href}
              className={`card card-hover block ${
                m.primary ? "ring-1 ring-forest/15" : ""
              }`}
            >
              <Icon className="w-5 h-5 stroke-[1.5] text-forest" />
              <div className="hero-italic text-2xl mt-4">{m.title}</div>
              <p className="text-sm text-muted mt-2">{m.desc}</p>
            </Link>
          );
        })}
      </section>

      {vaults && vaults.length > 0 && (
        <section>
          <div className="eyebrow mb-4">Sekcje</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {vaults.map((v) => (
              <Link
                key={v.id}
                href={`/vaults/${v.slug}`}
                className="text-sm border border-line rounded px-3 py-2.5 hover:border-forest/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                {v.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
