"use client";

import { useMemo } from "react";
import Link from "next/link";
import { WaxSeal } from "@/components/ui/WaxSeal";
import {
  useSalonPhrases,
  useTopics,
  useVaults,
} from "@/lib/firestore-data";
import type { SalonPhrase, Topic, Vault } from "@/lib/types";
import type { Timestamp } from "firebase/firestore";

/* ---------- helpers ---------------------------------------------------- */

function toMillis(v: unknown): number {
  if (!v) return 0;
  if (v instanceof Date) return v.getTime();
  if (typeof v === "object" && v && "toMillis" in v) {
    return (v as Timestamp).toMillis();
  }
  return 0;
}

const MONTHS_PL_LONG = [
  "stycznia","lutego","marca","kwietnia","maja","czerwca",
  "lipca","sierpnia","września","października","listopada","grudnia",
];
const MONTHS_PL_SHORT = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
const WEEKDAYS_PL = ["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"];

/* Vault slug → monogram motif + accent colour for the table heading */
const VAULT_VISUALS: Record<string, { motif: string; accent: string }> = {
  es:        { motif: "ES", accent: "#7a3a1f" },
  en:        { motif: "EN", accent: "#1a2438" },
  wine:      { motif: "☙",  accent: "#3a0c12" },
  art:       { motif: "✦",  accent: "#1c3552" },
  music:     { motif: "♪",  accent: "#3a1c38" },
  savoir:    { motif: "♚",  accent: "#6b4a22" },
  phil:      { motif: "φ",  accent: "#25272c" },
  hist:      { motif: "H",  accent: "#1d3a25" },
  econ:      { motif: "§",  accent: "#1c3552" },
  blackjack: { motif: "♠",  accent: "#0f2a19" },
  avia:      { motif: "△",  accent: "#2f4658" },
  excel:     { motif: "Σ",  accent: "#3a3a1c" },
  sport:     { motif: "Ⓢ",  accent: "#4a1414" },
};

interface SalonEntry {
  topic: Topic;
  phrase: SalonPhrase;
  vault: Vault;
}

/* ---------- Page ------------------------------------------------------- */

export default function SalonPage() {
  const topics = useTopics();
  const phrases = useSalonPhrases();
  const vaults = useVaults();

  const loading = topics === null || phrases === null || vaults === null;

  const entries = useMemo<SalonEntry[]>(() => {
    if (!topics || !phrases || !vaults) return [];
    const out: SalonEntry[] = [];
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
      (a, b) =>
        toMillis(a.topic.lastShownInSalon) -
        toMillis(b.topic.lastShownInSalon)
    )[0];
  }, [entries]);

  const grouped = useMemo(() => {
    const map = new Map<string, SalonEntry[]>();
    for (const e of entries) {
      if (!map.has(e.vault.id)) map.set(e.vault.id, []);
      map.get(e.vault.id)!.push(e);
    }
    return Array.from(map.entries())
      .map(([vaultId, items]) => ({
        vault: items[0].vault,
        items,
      }))
      .sort((a, b) =>
        a.vault.name.localeCompare(b.vault.name, "pl")
      );
  }, [entries]);

  return (
    <div className="-mx-6 md:-mx-12 -mt-10 md:-mt-12 relative overflow-hidden">
      {/* dot pattern */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(184,146,77,0.07) 1px, transparent 1.5px)",
          backgroundSize: "32px 32px",
          opacity: 0.5,
          zIndex: 0,
        }}
      />
      {/* warm center pool */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 18%, rgba(180,80,80,0.10), transparent 60%)",
          zIndex: 0,
        }}
      />
      {/* vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
          zIndex: 0,
        }}
      />

      <div className="relative" style={{ zIndex: 1 }}>
        <Hero totalTopics={entries.length} />

        {loading ? (
          <div className="px-6 md:px-12 lg:px-24 pb-10">
            <p className="hero-italic text-2xl text-muted animate-candle">Ładuję...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="px-6 md:px-12 lg:px-24 pb-10">
            <div
              className="tex-paper tex-noise-fine relative"
              style={{ padding: "48px", textAlign: "center" }}
            >
              <p
                className="font-display italic"
                style={{ fontSize: 32, color: "#1B1108" }}
              >
                Salon jeszcze pusty.
              </p>
              <p
                className="body-prose"
                style={{
                  color: "rgba(27,17,8,0.7)",
                  marginTop: 12,
                }}
              >
                Tematy do Salonu dodasz przez Admin razem z teorią.
              </p>
            </div>
          </div>
        ) : (
          <>
            {topicOfDay && <TematDnia entry={topicOfDay} />}
            <OrnamentDivider />
            {grouped.map((g) => (
              <SectionTable
                key={g.vault.id}
                vault={g.vault}
                items={g.items}
              />
            ))}
          </>
        )}

        <PageFooter />
      </div>
    </div>
  );
}

/* ============================================================
   Hero
   ============================================================ */

function GobletFlourish({
  size = 56,
  color = "rgba(184,146,77,0.55)",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 64 90"
      fill="none"
      style={{ display: "block" }}
      aria-hidden
    >
      <path
        d="M14 8 Q14 38 32 42 Q50 38 50 8 Z"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M18 12 Q32 18 46 12"
        stroke={color}
        strokeWidth="0.5"
        fill="none"
        opacity="0.6"
      />
      <line x1="32" y1="42" x2="32" y2="72" stroke={color} strokeWidth="0.8" />
      <circle cx="32" cy="58" r="1.2" fill={color} />
      <ellipse
        cx="32"
        cy="74"
        rx="14"
        ry="2"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
      />
      <ellipse
        cx="32"
        cy="74"
        rx="10"
        ry="1.4"
        stroke={color}
        strokeWidth="0.4"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M6 16 Q10 14 14 16"
        stroke={color}
        strokeWidth="0.5"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M50 16 Q54 14 58 16"
        stroke={color}
        strokeWidth="0.5"
        fill="none"
        opacity="0.55"
      />
      <circle cx="6" cy="18" r="0.8" fill={color} opacity="0.55" />
      <circle cx="58" cy="18" r="0.8" fill={color} opacity="0.55" />
    </svg>
  );
}

function Hero({ totalTopics }: { totalTopics: number }) {
  return (
    <div className="relative" style={{ padding: "56px 24px 28px" }}>
      <div className="flex items-end justify-between flex-wrap gap-6">
        <div style={{ maxWidth: 760 }}>
          <div
            className="eyebrow flex items-center"
            style={{
              color: "var(--c-ink2)",
              marginBottom: 18,
              opacity: 0.92,
              gap: 12,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 22,
                height: 1,
                background: "var(--c-ink2)",
                opacity: 0.55,
              }}
            />
            Rozmowa przy winie · {totalTopics}{" "}
            {totalTopics === 1 ? "temat w salonie" : "tematów w salonie"}
          </div>
          <h1
            className="font-display italic"
            style={{
              fontSize: "clamp(40px, 6vw, 64px)",
              lineHeight: 0.94,
              letterSpacing: "-0.02em",
              color: "var(--c-paper-100)",
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            Salon
          </h1>
          <p
            className="lead"
            style={{
              color: "var(--c-paper-300)",
              opacity: 0.78,
              maxWidth: 580,
            }}
          >
            Trzy zdania na temat.{" "}
            <em style={{ color: "var(--c-gold-300)" }}>
              Krótko, rozbudowanie, pułapka.
            </em>{" "}
            Praktyczne obycie, nie egzamin — wyjdziesz z tematem do rozmowy, nie
            z notatką do zapamiętania.
          </p>
        </div>
        <div style={{ paddingBottom: 4, marginRight: 8, opacity: 0.85 }}>
          <GobletFlourish size={56} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Temat dnia — featured paper card with three-sentence ladder
   ============================================================ */

function TematDnia({ entry }: { entry: SalonEntry }) {
  const d = new Date();
  const dateStr = `${d.getDate()} ${MONTHS_PL_LONG[d.getMonth()]} · ${entry.vault.name}`;

  return (
    <div style={{ padding: "0 24px 56px" }}>
      <div
        className="flex items-center"
        style={{ gap: 16, marginBottom: 18 }}
      >
        <span
          className="eyebrow"
          style={{
            color: "var(--c-gold-400)",
            letterSpacing: "0.28em",
          }}
        >
          ✦ Temat dnia
        </span>
        <div
          style={{
            flex: 1,
            height: 0.5,
            background: "rgba(184,146,77,0.35)",
          }}
        />
        <span
          className="signature"
          style={{
            color: "var(--c-paper-300)",
            opacity: 0.55,
            fontSize: 11,
          }}
        >
          {dateStr}
        </span>
      </div>

      <div
        className="tex-paper tex-noise-fine relative"
        style={{
          boxShadow:
            "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 24px 50px -20px rgba(0,0,0,0.75), 0 4px 8px rgba(0,0,0,0.4)",
        }}
      >
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            inset: 14,
            border: "0.5px solid rgba(146,112,55,0.4)",
            zIndex: 2,
          }}
        />

        {/* wax seal — hangs off top-right corner */}
        <div
          className="absolute"
          style={{ top: -28, right: -22, zIndex: 5 }}
        >
          <WaxSeal size={72} label="S" tone="oxblood" rotate={-7} />
        </div>

        <div
          className="relative grid grid-cols-1 lg:grid-cols-12"
          style={{ zIndex: 3 }}
        >
          {/* LEFT — title + lede + trap callout + CTA */}
          <div
            className="lg:col-span-5"
            style={{
              padding: "36px 32px 32px 36px",
              borderRight: "0.5px dashed rgba(27,17,8,0.22)",
            }}
          >
            <div
              className="eyebrow flex items-center"
              style={{
                color: "rgba(139,46,31,0.82)",
                marginBottom: 14,
                gap: 8,
              }}
            >
              <span style={{ fontSize: 14, lineHeight: 1 }}>♢</span>
              <span>{entry.vault.name} · 3 zdania</span>
            </div>
            <h2
              className="font-display italic"
              style={{
                fontSize: "clamp(36px, 5vw, 54px)",
                lineHeight: 1.0,
                color: "#1B1108",
                fontWeight: 600,
                letterSpacing: "-0.015em",
                marginBottom: 20,
              }}
            >
              {entry.topic.title}
            </h2>
            <p
              className="body-prose"
              style={{
                color: "rgba(27,17,8,0.82)",
                fontSize: 15,
                lineHeight: 1.6,
                marginBottom: 22,
              }}
            >
              {entry.phrase.short}
            </p>

            {/* trap callout */}
            <div
              style={{
                borderLeft: "2px solid var(--c-ink2)",
                padding: "8px 0 8px 16px",
                marginBottom: 28,
                opacity: 0.92,
              }}
            >
              <div
                className="eyebrow"
                style={{
                  color: "var(--c-ink2)",
                  fontSize: 9.5,
                  marginBottom: 6,
                  letterSpacing: "0.22em",
                }}
              >
                Pułapka
              </div>
              <p
                className="body-prose"
                style={{
                  color: "rgba(27,17,8,0.78)",
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  fontStyle: "italic",
                }}
              >
                {entry.phrase.trap}
              </p>
            </div>

            <Link
              href={`/salon/${entry.topic.id}`}
              className="inline-flex items-baseline"
              style={{
                gap: 14,
                padding: "12px 22px 11px",
                background: "transparent",
                border: "0.5px solid rgba(146,112,55,0.7)",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              <span
                className="font-display italic"
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  color: "#1B1108",
                  lineHeight: 1,
                }}
              >
                Wejdź do salonu
              </span>
              <span
                style={{
                  width: 1,
                  alignSelf: "stretch",
                  background: "rgba(146,112,55,0.4)",
                }}
              />
              <span
                className="signature"
                style={{
                  fontSize: 11,
                  color: "rgba(27,17,8,0.6)",
                  letterSpacing: "0.14em",
                }}
              >
                3 minuty
              </span>
              <span
                style={{
                  color: "var(--c-ink2)",
                  fontSize: 14,
                  marginLeft: 2,
                }}
              >
                →
              </span>
            </Link>
          </div>

          {/* RIGHT — ladder of three sentences */}
          <div
            className="lg:col-span-7"
            style={{ padding: "36px 40px 32px 36px" }}
          >
            <div
              className="flex items-baseline justify-between"
              style={{ marginBottom: 18 }}
            >
              <span
                className="signature"
                style={{
                  color: "rgba(27,17,8,0.55)",
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                Trzy stopnie · od skrótu do pułapki
              </span>
              <span
                className="signature"
                style={{
                  color: "rgba(139,46,31,0.6)",
                  fontSize: 10.5,
                  letterSpacing: "0.12em",
                }}
              >
                ← krótko    głębiej →
              </span>
            </div>
            <SentenceLadder phrase={entry.phrase} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SentenceLadder({ phrase }: { phrase: SalonPhrase }) {
  const rungs = [
    {
      mark: "01",
      label: "Krótko",
      tone: "soft" as const,
      text: phrase.short,
    },
    {
      mark: "02",
      label: "Rozbudowanie",
      tone: "strong" as const,
      text: phrase.expand,
    },
    {
      mark: "03",
      label: "Pułapka",
      tone: "top" as const,
      text: phrase.trap,
    },
  ];

  return (
    <div className="relative" style={{ paddingLeft: 8 }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 32,
          top: 12,
          bottom: 12,
          width: 0.5,
          background: "rgba(27,17,8,0.22)",
        }}
      />
      {rungs.map((s, i) => {
        const intensity = (i + 1) / rungs.length;
        const barWidth = 36 + intensity * 120;
        const barColor =
          s.tone === "soft"
            ? "rgba(146,112,55,0.42)"
            : s.tone === "strong"
            ? "rgba(184,146,77,0.78)"
            : "rgba(184,146,77,1)";
        const isTop = i === rungs.length - 1;
        return (
          <div
            key={s.mark}
            className="relative flex items-start"
            style={{ gap: 14, padding: "10px 0" }}
          >
            {/* node */}
            <div
              aria-hidden
              style={{
                position: "relative",
                zIndex: 1,
                width: 16,
                height: 16,
                marginLeft: 24,
                marginTop: 4,
                borderRadius: "50%",
                border: "0.8px solid rgba(27,17,8,0.55)",
                background: isTop
                  ? "radial-gradient(circle at 35% 30%, #d9b878, #927037 80%)"
                  : i === 1
                  ? "rgba(184,146,77,0.6)"
                  : "rgba(27,17,8,0.08)",
                boxShadow: isTop
                  ? "0 0 8px rgba(217,184,120,0.6)"
                  : "none",
                flexShrink: 0,
              }}
            />
            <div
              className="flex flex-col flex-1"
              style={{ gap: 4 }}
            >
              <div
                className="flex items-baseline"
                style={{ gap: 12 }}
              >
                <span
                  className="signature"
                  style={{
                    color: "rgba(27,17,8,0.45)",
                    fontSize: 10.5,
                    letterSpacing: "0.1em",
                    minWidth: 18,
                  }}
                >
                  {s.mark}
                </span>
                <span
                  className="eyebrow"
                  style={{
                    color:
                      s.label === "Pułapka"
                        ? "var(--c-ink2)"
                        : "rgba(27,17,8,0.6)",
                    fontSize: 9.5,
                    letterSpacing: "0.22em",
                  }}
                >
                  {s.label}
                </span>
              </div>
              <p
                className="font-display italic"
                style={{
                  fontSize: 17,
                  fontWeight: 500,
                  color: s.label === "Pułapka" ? "#5a1a14" : "#1B1108",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.35,
                  marginLeft: 30,
                }}
              >
                {s.text}
              </p>
            </div>
            {/* intensity bar */}
            <div
              aria-hidden
              style={{
                width: barWidth,
                height: 2,
                marginTop: 12,
                background: barColor,
                boxShadow: isTop
                  ? "0 0 4px rgba(217,184,120,0.5)"
                  : "none",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   Section table — monogram + label + count + cards grid
   ============================================================ */

function SectionMonogram({
  motif,
  accent,
}: {
  motif: string;
  accent: string;
}) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: 42,
        height: 42,
        flexShrink: 0,
        borderRadius: "50%",
        background: `radial-gradient(circle at 32% 28%, ${accent} 0%, rgba(0,0,0,0.4) 110%)`,
        boxShadow:
          "inset 0 1px 0 rgba(255,235,180,0.18), inset 0 -1px 2px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.4)",
        border: "0.5px solid rgba(184,146,77,0.5)",
      }}
    >
      <span
        className="font-display italic"
        style={{
          fontSize: 18,
          color: "var(--c-gold-300)",
          fontWeight: 600,
        }}
      >
        {motif}
      </span>
    </div>
  );
}

function SectionTable({
  vault,
  items,
}: {
  vault: Vault;
  items: SalonEntry[];
}) {
  const visuals = VAULT_VISUALS[vault.slug] ?? {
    motif: vault.name[0]?.toUpperCase() ?? "·",
    accent: "#3a2418",
  };
  const visibleItems = items.slice(0, 2);
  const remaining = Math.max(0, items.length - 2);

  return (
    <div style={{ marginBottom: 56 }}>
      {/* header */}
      <div
        className="flex items-center flex-wrap"
        style={{ gap: 16, padding: "0 24px 20px" }}
      >
        <SectionMonogram motif={visuals.motif} accent={visuals.accent} />
        <div className="flex items-baseline" style={{ gap: 14 }}>
          <h3
            className="font-display italic"
            style={{
              fontSize: "clamp(28px, 3vw, 36px)",
              color: "var(--c-paper-100)",
              fontWeight: 500,
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}
          >
            {vault.name}
          </h3>
          <span
            className="signature"
            style={{
              color: "var(--c-gold-400)",
              fontSize: 12,
              letterSpacing: "0.14em",
              opacity: 0.8,
            }}
          >
            {String(items.length).padStart(2, "0")}{" "}
            {items.length === 1 ? "temat" : "tematów"}
          </span>
        </div>
        <div
          style={{
            flex: 1,
            height: 0.5,
            minWidth: 30,
            background:
              "linear-gradient(90deg, rgba(184,146,77,0.4), rgba(184,146,77,0.05))",
          }}
        />
        <span
          className="eyebrow"
          style={{
            color: "var(--c-paper-300)",
            opacity: 0.55,
            fontSize: 10,
          }}
        >
          {visibleItems.length} {visibleItems.length === 1 ? "dostępny" : "dostępne"}
          {remaining > 0 ? ` · ${remaining} ukryte` : ""}
        </span>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        style={{ gap: 22, padding: "0 24px" }}
      >
        {visibleItems.map((e, i) => (
          <CarteCard
            key={e.phrase.id}
            entry={e}
            accent={visuals.accent}
            number={i + 1}
          />
        ))}
        {remaining > 0 && (
          <MoreCard
            count={remaining}
            accent={visuals.accent}
            vaultName={vault.name}
            vaultSlug={vault.slug}
          />
        )}
      </div>
    </div>
  );
}

function CarteCard({
  entry,
  accent,
  number,
}: {
  entry: SalonEntry;
  accent: string;
  number: number;
}) {
  return (
    <Link
      href={`/salon/${entry.topic.id}`}
      className="carte-card tex-paper tex-noise-fine relative"
      style={{
        boxShadow:
          "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 10px 22px -10px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.35)",
        minHeight: 240,
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
      }}
    >
      <div
        className="relative flex items-baseline justify-between"
        style={{
          padding: "16px 22px 10px",
          borderBottom: "0.5px dashed rgba(27,17,8,0.22)",
        }}
      >
        <span
          className="font-display italic"
          style={{
            fontSize: 28,
            color: accent,
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            opacity: 0.9,
          }}
        >
          № {String(number).padStart(2, "0")}
        </span>
        <span
          className="eyebrow"
          style={{
            color: "rgba(27,17,8,0.45)",
            fontSize: 9.5,
          }}
        >
          3 zdania
        </span>
      </div>

      <div
        style={{
          padding: "16px 22px 12px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h4
          className="font-display italic"
          style={{
            fontSize: 22,
            color: "#1B1108",
            fontWeight: 500,
            lineHeight: 1.15,
            letterSpacing: "-0.005em",
            marginBottom: 10,
          }}
        >
          {entry.topic.title}
        </h4>
        <p
          className="body-prose"
          style={{
            color: "rgba(27,17,8,0.78)",
            fontSize: 13,
            lineHeight: 1.55,
            flex: 1,
          }}
        >
          {entry.phrase.short}
        </p>
      </div>

      <div
        className="flex items-center justify-between"
        style={{
          padding: "10px 22px 14px",
          borderTop: "0.5px dashed rgba(27,17,8,0.22)",
        }}
      >
        <span
          className="signature"
          style={{
            color: "rgba(27,17,8,0.55)",
            fontSize: 10.5,
            letterSpacing: "0.08em",
          }}
        >
          krótko · rozbudowanie · pułapka
        </span>
        <span
          className="eyebrow flex items-center carte-card-cta"
          style={{
            fontSize: 9.5,
            gap: 6,
            transition: "color .2s",
          }}
        >
          Wejdź <span style={{ fontSize: 12 }}>→</span>
        </span>
      </div>
    </Link>
  );
}

function MoreCard({
  count,
  accent,
  vaultName,
  vaultSlug,
}: {
  count: number;
  accent: string;
  vaultName: string;
  vaultSlug: string;
}) {
  return (
    <Link
      href={`/vaults/${vaultSlug}`}
      className="more-card relative flex flex-col items-center justify-center"
      style={{
        minHeight: 240,
        background: "rgba(27,17,8,0.35)",
        border: "0.5px dashed rgba(184,146,77,0.3)",
        cursor: "pointer",
        transition: "border-color .2s, background .2s",
        gap: 14,
        textAlign: "center",
        padding: "0 24px",
        textDecoration: "none",
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: `radial-gradient(circle at 32% 28%, ${accent}, rgba(0,0,0,0.5))`,
          opacity: 0.55,
          border: "0.5px solid rgba(184,146,77,0.3)",
        }}
      >
        <span
          className="font-display italic"
          style={{
            fontSize: 24,
            color: "var(--c-gold-300)",
            fontWeight: 500,
            opacity: 0.85,
          }}
        >
          +{count}
        </span>
      </div>
      <div
        className="font-display italic"
        style={{
          fontSize: 20,
          color: "var(--c-paper-200)",
          opacity: 0.78,
          fontWeight: 500,
          letterSpacing: "-0.01em",
        }}
      >
        {count === 1 ? "Jeden więcej" : "Pozostałe tematy"}
      </div>
      <span
        className="eyebrow"
        style={{
          color: "var(--c-gold-400)",
          fontSize: 10,
          opacity: 0.7,
        }}
      >
        Cały regał {vaultName} →
      </span>
    </Link>
  );
}

/* ============================================================
   Ornament divider + footer
   ============================================================ */

function OrnamentDivider() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ padding: "8px 24px 36px", gap: 14 }}
      aria-hidden
    >
      <div
        style={{
          flex: 1,
          height: 0.5,
          background:
            "linear-gradient(90deg, transparent, rgba(184,146,77,0.28), transparent)",
        }}
      />
      <svg width="42" height="14" viewBox="0 0 42 14" fill="none">
        <path
          d="M2 7h12M28 7h12"
          stroke="rgba(184,146,77,0.5)"
          strokeWidth="0.6"
        />
        <circle cx="16" cy="7" r="0.8" fill="rgba(184,146,77,0.6)" />
        <path
          d="M21 4 Q23 7 21 10 Q19 7 21 4 Z"
          fill="none"
          stroke="rgba(184,146,77,0.65)"
          strokeWidth="0.6"
        />
        <circle cx="26" cy="7" r="0.8" fill="rgba(184,146,77,0.6)" />
      </svg>
      <div
        style={{
          flex: 1,
          height: 0.5,
          background:
            "linear-gradient(90deg, transparent, rgba(184,146,77,0.28), transparent)",
        }}
      />
    </div>
  );
}

function PageFooter() {
  const d = new Date();
  return (
    <div
      className="flex items-center justify-between flex-wrap gap-4"
      style={{
        padding: "32px 24px 56px",
        borderTop: "1px solid rgba(184,146,77,0.18)",
        marginTop: 32,
      }}
    >
      <div
        className="signature"
        style={{ color: "var(--c-paper-300)", opacity: 0.55 }}
      >
        The Learning Vault · Anno MMXXVI · Salon
      </div>
      <div
        className="signature"
        style={{ color: "var(--c-paper-300)", opacity: 0.55 }}
      >
        ❦
      </div>
      <div
        className="signature"
        style={{ color: "var(--c-paper-300)", opacity: 0.55 }}
      >
        {WEEKDAYS_PL[d.getDay()]} · {d.getDate()} · {MONTHS_PL_SHORT[d.getMonth()]}
      </div>
    </div>
  );
}
