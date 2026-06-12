"use client";

import { Fragment, useMemo } from "react";
import Link from "next/link";
import {
  useSalonPhrases,
  useTopics,
  useVaults,
} from "@/lib/firestore-data";
import { plPlural } from "@/lib/plural";
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
    <div className="page-bleed -mt-10 md:-mt-12 relative overflow-hidden anim-on">
      {/* top light spill — jak w Dziś, oddycha (reduced-motion: statyczne) */}
      <div
        aria-hidden
        className="candle-glow absolute pointer-events-none"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: 600,
          background:
            "radial-gradient(ellipse 55% 70% at 50% 0%, rgba(255,210,160,0.10), transparent 70%)",
          zIndex: 0,
        }}
      />

      <div className="relative max-w-content mx-auto" style={{ zIndex: 1 }}>
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
            <RegalyHeader
              sections={grouped.length}
              available={grouped.reduce(
                (a, g) => a + Math.min(2, g.items.length),
                0
              )}
            />
            {grouped.map((g, i) => (
              <Fragment key={g.vault.id}>
                <SectionTable vault={g.vault} items={g.items} />
                {i < grouped.length - 1 && <OrnamentDivider />}
              </Fragment>
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
            {plPlural(totalTopics, "temat w salonie", "tematy w salonie", "tematów w salonie")}
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
              maxWidth: 560,
              textWrap: "pretty",
            }}
          >
            Trzy zdania na temat.{" "}
            <em
              className="font-display italic"
              style={{ color: "var(--c-gold-300)", fontSize: 21 }}
            >
              Krótko, rozbudowanie, pułapka.
            </em>
          </p>
        </div>
        {/* hedera — typograficzny ornament, przygaszony jak znak wodny */}
        <div
          aria-hidden
          className="relative flex flex-col items-center justify-center"
          style={{ marginRight: 32, paddingBottom: 8 }}
        >
          <div
            className="absolute"
            style={{
              inset: "-30px -70px",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at center, rgba(139,46,31,0.10), transparent 65%)",
              pointerEvents: "none",
            }}
          />
          <span
            className="font-display relative"
            style={{
              fontSize: 136,
              lineHeight: 1,
              color: "var(--c-gold-600)",
              opacity: 0.34,
              transform: "rotate(-90deg)",
              display: "block",
            }}
          >
            ☙
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Wax seal — wytłoczony lak na lewym górnym rogu karty
   ============================================================ */

function SalonSeal({ size = 68, label = "S" }: { size?: number; label?: string }) {
  return (
    <div
      aria-hidden
      className="relative"
      style={{ width: size, height: size, transform: "rotate(-7deg)" }}
    >
      <div
        className="absolute"
        style={{
          inset: 0,
          clipPath:
            "polygon(50% 0%, 64% 4%, 78% 10%, 90% 22%, 96% 38%, 100% 52%, 95% 68%, 86% 82%, 72% 92%, 56% 98%, 40% 99%, 24% 92%, 12% 80%, 4% 64%, 1% 48%, 6% 32%, 14% 18%, 28% 8%, 42% 2%)",
          background:
            "radial-gradient(circle at 30% 26%, #c64523 0%, #a02d16 28%, #761e12 56%, #470d07 90%, #2a0604 100%)",
          boxShadow:
            "inset 5px 5px 9px rgba(255,205,165,0.22), inset -4px -6px 12px rgba(20,2,2,0.65), 2px 4px 8px rgba(0,0,0,0.55), 0 1px 1px rgba(0,0,0,0.4)",
        }}
      />
      {/* wytłoczony krąg sygnetu — podwójny ring */}
      <div
        className="absolute"
        style={{
          inset: "13%",
          borderRadius: "50%",
          border: "0.8px solid rgba(50,6,3,0.55)",
          boxShadow:
            "inset 0 1px 1px rgba(255,180,140,0.30), 0 1px 1px rgba(255,170,130,0.18), inset 0 -1px 2px rgba(20,0,0,0.4)",
        }}
      />
      <div
        className="absolute"
        style={{
          inset: "19%",
          borderRadius: "50%",
          border: "0.5px solid rgba(255,170,130,0.20)",
        }}
      />
      {/* monogram z kropkami */}
      <div
        className="absolute flex items-center justify-center"
        style={{ inset: 0, gap: size * 0.07 }}
      >
        <span
          style={{
            width: 2.5,
            height: 2.5,
            borderRadius: "50%",
            background: "rgba(50,6,3,0.6)",
            boxShadow: "0 1px 0 rgba(255,180,140,0.3)",
            marginTop: 2,
          }}
        />
        <span
          className="font-display italic"
          style={{
            fontSize: size * 0.46,
            fontWeight: 600,
            color: "rgba(56,7,3,0.9)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            textShadow:
              "0 1px 0 rgba(255,180,140,0.40), 0 -1px 1px rgba(20,0,0,0.7), 0 0 2px rgba(0,0,0,0.35)",
            transform: "translateY(-1px)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            width: 2.5,
            height: 2.5,
            borderRadius: "50%",
            background: "rgba(50,6,3,0.6)",
            boxShadow: "0 1px 0 rgba(255,180,140,0.3)",
            marginTop: 2,
          }}
        />
      </div>
      {/* bliki — główny i kontrowy */}
      <div
        className="absolute"
        style={{
          top: "13%",
          left: "18%",
          width: "24%",
          height: "15%",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(255,210,180,0.40), transparent 70%)",
          filter: "blur(2px)",
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: "16%",
          right: "20%",
          width: "16%",
          height: "10%",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(255,160,120,0.18), transparent 70%)",
          filter: "blur(2px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ============================================================
   Temat dnia — tytuł i krótko po lewej, trzy stopnie pionowo
   po prawej; lak wisi na lewym rogu, nic nie zasłania
   ============================================================ */

function StepRow({
  step,
  last,
}: {
  step: { n: string; label: string; text: string; trap?: boolean };
  last: boolean;
}) {
  const labelColor = step.trap ? "var(--c-ink2)" : "rgba(27,17,8,0.55)";
  /* romby — jak ♢ w eyebrow i ✦ w ornamentach */
  const diamondStyle = step.trap
    ? {
        background: "radial-gradient(circle at 35% 30%, #c8512f, #7a1f14 85%)",
        border: "0.6px solid rgba(60,8,4,0.6)",
        boxShadow:
          "0 0 6px rgba(168,48,24,0.30), inset 0 1px 0 rgba(255,200,170,0.25)",
      }
    : step.n === "02"
    ? {
        background: "radial-gradient(circle at 35% 30%, #d9b878, #927037 85%)",
        border: "0.6px solid rgba(106,81,40,0.7)",
        boxShadow: "inset 0 1px 0 rgba(255,245,220,0.4)",
      }
    : {
        background: "transparent",
        border: "0.7px solid rgba(27,17,8,0.5)",
        boxShadow: "inset 0 1px 0 rgba(255,250,235,0.35)",
      };
  return (
    <div
      className="relative flex"
      style={{
        gap: 18,
        paddingBottom: last ? 0 : 26,
        flex: last ? "0 0 auto" : "1 0 auto",
      }}
    >
      {/* romb + linia prowadząca */}
      <div
        aria-hidden
        className="relative flex flex-col items-center"
        style={{ width: 14, flexShrink: 0 }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            transform: "rotate(45deg)",
            flexShrink: 0,
            marginTop: 4,
            ...diamondStyle,
          }}
        />
        {!last && (
          <span
            style={{
              width: 0.5,
              flex: 1,
              background: "rgba(27,17,8,0.22)",
              marginTop: 8,
            }}
          />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div className="flex items-baseline" style={{ gap: 12, marginBottom: 8 }}>
          <span
            className="signature"
            style={{
              color: "rgba(27,17,8,0.4)",
              fontSize: 10.5,
              letterSpacing: "0.1em",
            }}
          >
            {step.n}
          </span>
          <span
            className="eyebrow"
            style={{ color: labelColor, fontSize: 10, letterSpacing: "0.24em" }}
          >
            {step.label}
          </span>
        </div>
        <p
          className="body-prose"
          style={{
            color: "rgba(27,17,8,0.82)",
            fontSize: 13.5,
            lineHeight: 1.62,
            textWrap: "pretty",
          }}
        >
          {step.text}
        </p>
      </div>
    </div>
  );
}

function TematDnia({ entry }: { entry: SalonEntry }) {
  const d = new Date();
  const dateStr = `${d.getDate()} ${MONTHS_PL_LONG[d.getMonth()]} · ${entry.vault.name}`;
  const steps = [
    { n: "01", label: "Krótko", text: entry.phrase.short },
    { n: "02", label: "Rozbudowanie", text: entry.phrase.expand },
    { n: "03", label: "Pułapka", text: entry.phrase.trap, trap: true },
  ];

  return (
    <div style={{ padding: "0 24px 56px" }}>
      <div
        className="flex items-center"
        style={{ gap: 16 }}
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

      {/* odstęp 44px — lak ma własny pas powietrza, nie dotyka nagłówka */}
      <div
        className="tex-paper tex-noise-fine relative"
        style={{
          marginTop: 44,
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

        {/* lak — duży, na lewym rogu karty; po prawej u góry jest hedera */}
        <div className="absolute" style={{ top: -24, left: -24, zIndex: 5 }}>
          <SalonSeal size={92} label="S" />
        </div>

        <div
          className="relative grid grid-cols-1 lg:grid-cols-12"
          style={{ zIndex: 3 }}
        >
          {/* LEFT — tytuł + krótko + CTA */}
          <div
            className="lg:col-span-5"
            style={{
              padding: "40px 36px 36px 44px",
              borderRight: "0.5px dashed rgba(27,17,8,0.22)",
            }}
          >
            <div
              className="eyebrow flex items-center"
              style={{
                color: "rgba(139,46,31,0.82)",
                marginBottom: 16,
                gap: 8,
                paddingLeft: 56,
              }}
            >
              <span style={{ fontSize: 13, lineHeight: 1 }}>♢</span>
              <span>{entry.vault.name} · 3 zdania</span>
            </div>
            <h2
              className="font-display italic"
              style={{
                fontSize: "clamp(36px, 5vw, 50px)",
                lineHeight: 1.04,
                color: "#1B1108",
                fontWeight: 600,
                letterSpacing: "-0.015em",
                marginBottom: 22,
                textWrap: "balance",
              }}
            >
              {entry.topic.title}
            </h2>
            <p
              className="body-prose"
              style={{
                color: "rgba(27,17,8,0.82)",
                fontSize: 14.5,
                lineHeight: 1.6,
                marginBottom: 30,
                textWrap: "pretty",
              }}
            >
              {entry.phrase.short}
            </p>

            <Link
              href={`/salon/${entry.topic.id}`}
              className="salon-cta inline-flex items-baseline"
              style={{
                gap: 14,
                padding: "13px 24px 12px",
                background: "transparent",
                border: "0.5px solid rgba(146,112,55,0.7)",
                cursor: "pointer",
                textDecoration: "none",
                whiteSpace: "nowrap",
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
                className="salon-cta-arrow"
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

          {/* RIGHT — trzy stopnie pionowo, rozciągnięte na wysokość karty */}
          <div
            className="lg:col-span-7 flex flex-col"
            style={{ padding: "40px 44px 40px 40px" }}
          >
            <div
              className="flex items-baseline justify-between"
              style={{ marginBottom: 24 }}
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
                głębiej ↓
              </span>
            </div>
            <div className="flex flex-col" style={{ flex: 1 }}>
              {steps.map((s, i) => (
                <StepRow key={s.n} step={s} last={i === steps.length - 1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Regały — nagłówek pasa sekcji + section table
   ============================================================ */

function RegalyHeader({
  sections,
  available,
}: {
  sections: number;
  available: number;
}) {
  return (
    <div
      className="flex items-center"
      style={{ gap: 16, padding: "0 24px", marginBottom: 40 }}
    >
      <span
        className="eyebrow"
        style={{
          color: "var(--c-gold-400)",
          letterSpacing: "0.28em",
          whiteSpace: "nowrap",
        }}
      >
        ✦ Regały
      </span>
      <div
        style={{ flex: 1, height: 0.5, background: "rgba(184,146,77,0.35)" }}
      />
      <span
        className="signature"
        style={{
          color: "var(--c-paper-300)",
          opacity: 0.6,
          fontSize: 11,
          whiteSpace: "nowrap",
        }}
      >
        {sections} {plPlural(sections, "sekcja", "sekcje", "sekcji")} ·{" "}
        {available} {plPlural(available, "dostępny", "dostępne", "dostępnych")} dziś
      </span>
    </div>
  );
}

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
    <div style={{ marginBottom: 64 }}>
      {/* header */}
      <div
        className="flex items-center flex-wrap"
        style={{ gap: 16, padding: "0 24px 24px" }}
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
            {plPlural(items.length, "temat", "tematy", "tematów")}
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
        style={{ gap: 24, padding: "0 24px" }}
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
        minHeight: 250,
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
            fontSize: 24,
            color: "#1B1108",
            fontWeight: 500,
            lineHeight: 1.15,
            letterSpacing: "-0.005em",
            marginBottom: 10,
            textWrap: "balance",
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
        <StepPips />
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

function StepPips() {
  return (
    <span className="flex items-baseline" style={{ gap: 8 }}>
      {["krótko", "rozbudowanie", "pułapka"].map((l, i) => (
        <span key={l} className="flex items-baseline" style={{ gap: 8 }}>
          {i > 0 && (
            <span style={{ color: "rgba(27,17,8,0.3)", fontSize: 9 }}>·</span>
          )}
          <span
            className="signature"
            style={{
              color: "rgba(27,17,8,0.5)",
              fontSize: 10,
              letterSpacing: "0.08em",
            }}
          >
            {l}
          </span>
        </span>
      ))}
    </span>
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
        minHeight: 250,
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
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: `radial-gradient(circle at 32% 28%, ${accent} 0%, rgba(0,0,0,0.5) 115%)`,
          opacity: 0.7,
          border: "0.5px solid rgba(184,146,77,0.4)",
          boxShadow:
            "inset 0 1px 0 rgba(255,235,180,0.14), 0 2px 6px rgba(0,0,0,0.4)",
        }}
      >
        <span
          className="font-display italic"
          style={{
            fontSize: 23,
            color: "var(--c-gold-300)",
            fontWeight: 500,
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
