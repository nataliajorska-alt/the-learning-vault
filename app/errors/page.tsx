"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useErrors } from "@/lib/firestore-data";
import { plPlural } from "@/lib/plural";
import type { VaultError } from "@/lib/types";

/* ---------- helpers ---------------------------------------------------- */

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

const MONTHS_PL_SHORT = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
const WEEKDAYS_PL = ["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"];

/* ---------- Page ------------------------------------------------------- */

export default function ErrorsPage() {
  const errors = useErrors();
  const [onlyChronic, setOnlyChronic] = useState(false);
  const [section, setSection] = useState<string>("Wszystkie sekcje");

  /* Build dynamic section selector options from real data */
  const sectionOptions = useMemo(() => {
    const opts: Array<{ key: string; label: string; prefix: string }> = [
      { key: "all", label: "Wszystkie sekcje", prefix: "" },
    ];
    if (!errors) return opts;
    const seen = new Map<string, string>();
    for (const e of errors) {
      const prefix = vaultSig(e.vaultName);
      if (!seen.has(prefix)) seen.set(prefix, e.vaultName);
    }
    for (const [prefix, name] of seen) {
      opts.push({ key: prefix, label: `${prefix} · ${name}`, prefix });
    }
    return opts;
  }, [errors]);

  /* Sort by count desc */
  const sorted = useMemo(() => {
    if (!errors) return [];
    return [...errors].sort((a, b) => b.timesWrong - a.timesWrong);
  }, [errors]);

  const chronicCount = useMemo(
    () => (errors ?? []).filter((e) => e.timesWrong >= 3).length,
    [errors]
  );

  const filtered = useMemo(() => {
    let f = sorted;
    if (onlyChronic) f = f.filter((e) => e.timesWrong >= 3);
    if (section !== "Wszystkie sekcje") {
      const opt = sectionOptions.find((o) => o.label === section);
      const prefix = opt?.prefix;
      if (prefix) {
        f = f.filter((e) => vaultSig(e.vaultName) === prefix);
      }
    }
    return f;
  }, [sorted, onlyChronic, section, sectionOptions]);

  if (errors === null) {
    return (
      <div className="text-muted hero-italic text-2xl animate-candle">Ładuję Errata...</div>
    );
  }

  return (
    /* bust container for wide canvas */
    <div className="page-bleed -mt-10 md:-mt-12 relative overflow-hidden">
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

      <div className="relative max-w-content mx-auto" style={{ zIndex: 1 }}>
        <Hero total={errors.length} />
        <FilterBar
          totalChronic={chronicCount}
          totalFiltered={filtered.length}
          totalAll={errors.length}
          onlyChronic={onlyChronic}
          setOnlyChronic={setOnlyChronic}
          section={section}
          setSection={setSection}
          options={sectionOptions.map((o) => o.label)}
        />
        <div style={{ paddingBottom: 40 }}>
          <VaultSurface>
            <GroupedErrata items={filtered} />
          </VaultSurface>
        </div>
        <PageFooter />
      </div>
    </div>
  );
}

/* ============================================================
   Hero
   ============================================================ */

function Hero({ total }: { total: number }) {
  return (
    <div
      className="flex items-end justify-between flex-wrap gap-6"
      style={{ padding: "56px 24px 24px" }}
    >
      <div style={{ maxWidth: 760 }}>
        <div
          className="eyebrow"
          style={{ color: "var(--c-ink2)", marginBottom: 18, opacity: 0.92 }}
        >
          Twoje błędy · {total} {plPlural(total, "wpis", "wpisy", "wpisów")}
        </div>
        <h1
          className="font-display italic"
          style={{
            fontSize: "clamp(40px, 6vw, 64px)",
            lineHeight: 0.96,
            letterSpacing: "-0.02em",
            color: "var(--c-paper-100)",
            fontWeight: 600,
            marginBottom: 14,
          }}
        >
          Error Vault
        </h1>
        <p
          className="lead"
          style={{
            color: "var(--c-paper-300)",
            opacity: 0.78,
            maxWidth: 580,
          }}
        >
          Tylko twoje błędy. Im więcej razy pomylone, tym wyżej w stosie. Po{" "}
          <span
            className="font-display italic"
            style={{ color: "var(--c-gold-300)", fontSize: 22 }}
          >
            trzech
          </span>{" "}
          poprawnych z rzędu wpis znika z aktywnej listy.
        </p>
      </div>
      {total > 0 && <QuizButton count={total} />}
    </div>
  );
}

function QuizButton({ count }: { count: number }) {
  return (
    <Link
      href="/errors/quiz"
      className="relative inline-flex items-baseline group"
      style={{
        gap: 14,
        padding: "12px 22px 11px",
        whiteSpace: "nowrap",
        flexWrap: "nowrap",
        background: "transparent",
        border: "0.5px solid rgba(184,146,77,0.55)",
        color: "var(--c-gold-300)",
        cursor: "pointer",
        transition: "background-color .2s ease, border-color .2s ease",
      }}
    >
      <span
        className="font-display italic"
        style={{
          fontSize: 22,
          fontWeight: 500,
          color: "var(--c-gold-300)",
          lineHeight: 1,
        }}
      >
        Quiz z błędów
      </span>
      <span
        style={{
          width: 1,
          alignSelf: "stretch",
          background: "rgba(184,146,77,0.3)",
        }}
      />
      <span
        className="signature"
        style={{
          fontSize: 11,
          color: "var(--c-paper-300)",
          opacity: 0.7,
          letterSpacing: "0.14em",
        }}
      >
        {count} {plPlural(count, "wpis", "wpisy", "wpisów")}
      </span>
      <span
        style={{ color: "var(--c-gold-400)", fontSize: 14, marginLeft: 2 }}
      >
        →
      </span>
    </Link>
  );
}

/* ============================================================
   Filter bar
   ============================================================ */

function FilterBar({
  totalChronic,
  totalFiltered,
  totalAll,
  onlyChronic,
  setOnlyChronic,
  section,
  setSection,
  options,
}: {
  totalChronic: number;
  totalFiltered: number;
  totalAll: number;
  onlyChronic: boolean;
  setOnlyChronic: (v: boolean) => void;
  section: string;
  setSection: (v: string) => void;
  options: string[];
}) {
  return (
    <div
      className="flex items-center justify-between flex-wrap gap-6"
      style={{ padding: "20px 24px 28px" }}
    >
      <div className="flex items-center flex-wrap" style={{ gap: 24 }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path
            d="M2 3h14l-5 7v5l-4 1v-6L2 3z"
            stroke="var(--c-gold-400)"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>

        <SectionSelector value={section} onChange={setSection} options={options} />

        <label
          className="flex items-center cursor-pointer"
          style={{ gap: 10 }}
        >
          <span
            className="relative flex items-center justify-center"
            style={{
              width: 16,
              height: 16,
              border: "1px solid rgba(184,146,77,0.55)",
              background: onlyChronic ? "rgba(184,146,77,0.18)" : "transparent",
            }}
          >
            {onlyChronic && (
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                <path
                  d="M1.5 5.5L4 8l4.5-6"
                  stroke="var(--c-gold-300)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            )}
            <input
              type="checkbox"
              checked={onlyChronic}
              onChange={(e) => setOnlyChronic(e.target.checked)}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                cursor: "pointer",
              }}
            />
          </span>
          <span
            className="caption"
            style={{
              color: "var(--c-paper-200)",
              opacity: 0.85,
              fontSize: 14,
            }}
          >
            Tylko uciążliwe{" "}
            <span
              style={{ color: "var(--c-paper-300)", opacity: 0.6 }}
            >
              (3+ błędy · {totalChronic})
            </span>
          </span>
        </label>
      </div>

      <div
        className="signature"
        style={{ color: "var(--c-paper-300)", opacity: 0.6, fontSize: 12 }}
      >
        {totalFiltered} z {totalAll}
      </div>
    </div>
  );
}

function SectionSelector({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center"
        style={{
          gap: 14,
          padding: "10px 14px 9px 16px",
          border: "0.5px solid rgba(184,146,77,0.5)",
          background: "rgba(27,17,8,0.55)",
          color: "var(--c-paper-100)",
          cursor: "pointer",
        }}
      >
        <span
          className="caption"
          style={{ fontSize: 14, letterSpacing: "0.01em" }}
        >
          {value}
        </span>
        <span
          style={{
            color: "var(--c-gold-400)",
            fontSize: 9,
            opacity: 0.9,
            lineHeight: 1,
          }}
        >
          ▼
        </span>
      </button>
      {open && (
        <div
          className="absolute"
          style={{
            top: "calc(100% + 6px)",
            left: 0,
            minWidth: "100%",
            background: "#1B1108",
            border: "0.5px solid rgba(184,146,77,0.45)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.65)",
            zIndex: 10,
          }}
        >
          {options.map((s) => (
            <div
              key={s}
              onClick={() => {
                onChange(s);
                setOpen(false);
              }}
              className="caption"
              style={{
                padding: "10px 16px",
                fontSize: 13,
                cursor: "pointer",
                color: s === value ? "var(--c-gold-300)" : "var(--c-paper-200)",
                whiteSpace: "nowrap",
                borderBottom: "0.5px solid rgba(184,146,77,0.12)",
              }}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   VaultSurface — oxblood leather desk with gilt double rule + corners
   ============================================================ */

function VaultSurface({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative mx-auto"
      style={{
        maxWidth: 1280,
        padding: "44px 32px 46px",
        background:
          "radial-gradient(ellipse 90% 80% at 30% 18%, #4a1410 0%, #310c0a 55%, #1a0604 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,180,140,0.14), inset 0 -3px 8px rgba(0,0,0,0.6), 0 30px 60px -20px rgba(0,0,0,0.8), 0 6px 12px rgba(0,0,0,0.45)",
        isolation: "isolate",
      }}
    >
      {/* leather grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='lp'><feTurbulence type='fractalNoise' baseFrequency='1.0' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.15  0 0 0 0 0.04  0 0 0 0 0.02  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23lp)'/></svg>\")",
          mixBlendMode: "multiply",
          opacity: 0.6,
        }}
      />
      {/* double gold rule */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          inset: 16,
          border: "0.5px solid rgba(184,146,77,0.55)",
          boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.5)",
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          inset: 24,
          border: "0.5px solid rgba(184,146,77,0.22)",
        }}
      />
      {/* corner fleurons */}
      <CornerFleuron pos={{ top: 10, left: 10 }} />
      <CornerFleuron
        pos={{ top: 10, right: 10 }}
        transform="scaleX(-1)"
      />
      <CornerFleuron
        pos={{ bottom: 10, left: 10 }}
        transform="scaleY(-1)"
      />
      <CornerFleuron
        pos={{ bottom: 10, right: 10 }}
        transform="scale(-1,-1)"
      />

      <div className="relative" style={{ zIndex: 3 }}>
        {children}
      </div>
    </div>
  );
}

function CornerFleuron({
  pos,
  transform,
}: {
  pos: { top?: number; right?: number; bottom?: number; left?: number };
  transform?: string;
}) {
  return (
    <div
      aria-hidden
      className="absolute pointer-events-none"
      style={{ ...pos, width: 30, height: 30, transform }}
    >
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <path
          d="M2 2h10M2 2v10M2 2l8 8M14 6c-2 0-3 1-3 3M6 14c0-2 1-3 3-3"
          stroke="rgba(184,146,77,0.55)"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
        <circle cx="11" cy="11" r="0.8" fill="rgba(217,184,120,0.7)" />
      </svg>
    </div>
  );
}

/* ============================================================
   Grid — balanced two-column masonry: estimate each card's height
   and greedily assign to the shorter column, so neither column
   ends with a hole in the leather mat
   ============================================================ */

function ErrataGrid({ items }: { items: VaultError[] }) {
  const rotateFor = (i: number) => {
    const seq = [
      -0.6, 0.4, -0.3, 0.7, 0.2, -0.5, 0.5, -0.4, 0.3, 0.6, -0.2, 0.4,
      -0.6, 0.3, 0.5, -0.4, 0.2, -0.3,
    ];
    return seq[i % seq.length];
  };

  if (items.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{ padding: "80px 0", gap: 18 }}
      >
        <div
          className="font-display italic"
          style={{ fontSize: 42, color: "var(--c-paper-100)" }}
        >
          Czysto.
        </div>
        <p
          className="body-prose"
          style={{
            color: "var(--c-paper-300)",
            opacity: 0.7,
            textAlign: "center",
            maxWidth: 380,
          }}
        >
          Żaden wpis nie spełnia tych kryteriów. Albo nie pomyliłaś się dość
          często, albo zmień filtr.
        </p>
      </div>
    );
  }

  const estimate = (card: VaultError) => {
    const compact = card.correctVersion.length < 60;
    const frontH = Math.ceil(card.correctVersion.length / 50) * 29;
    const restH =
      Math.ceil((card.wrongVersion.length + card.context.length) / 78) * 20;
    return (compact ? 96 : 130) + frontH + restH;
  };
  const cols: Array<Array<{ card: VaultError; i: number }>> = [[], []];
  const heights = [0, 0];
  items.forEach((card, i) => {
    const k = heights[0] <= heights[1] ? 0 : 1;
    cols[k].push({ card, i });
    heights[k] += estimate(card) + 28;
  });

  return (
    <div className="flex flex-col md:flex-row md:items-start" style={{ gap: 32 }}>
      {cols.map((col, ci) => (
        <div key={ci} style={{ flex: 1, minWidth: 0 }}>
          {col.map(({ card, i }) => (
            <ErratumCard key={card.id} card={card} rotate={rotateFor(i)} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   Grouping — chronic on top, rest below a gilt divider
   ============================================================ */

function GroupDivider({
  label,
  sub,
  first,
}: {
  label: string;
  sub: string;
  first?: boolean;
}) {
  return (
    <div
      className="flex items-center"
      style={{ gap: 16, margin: first ? "2px 4px 26px" : "14px 4px 26px" }}
    >
      <span
        className="eyebrow"
        style={{ color: "var(--c-gold-300)", fontSize: 10, whiteSpace: "nowrap" }}
      >
        {label}
      </span>
      <span
        className="signature"
        style={{
          color: "var(--c-paper-300)",
          opacity: 0.55,
          fontSize: 11,
          whiteSpace: "nowrap",
        }}
      >
        {sub}
      </span>
      <span
        style={{
          flex: 1,
          height: 1,
          background:
            "linear-gradient(90deg, rgba(184,146,77,0.5), rgba(184,146,77,0.06))",
        }}
      />
    </div>
  );
}

function GroupedErrata({ items }: { items: VaultError[] }) {
  const chronic = items.filter((e) => e.timesWrong >= 3);
  const rest = items.filter((e) => e.timesWrong < 3);
  if (items.length === 0) return <ErrataGrid items={[]} />;
  return (
    <>
      {chronic.length > 0 && (
        <>
          <GroupDivider
            first
            label="Uciążliwe"
            sub={`3+ pomyłki · ${chronic.length}`}
          />
          <ErrataGrid items={chronic} />
        </>
      )}
      {rest.length > 0 && (
        <>
          <GroupDivider
            first={chronic.length === 0}
            label="Obserwacja"
            sub={`${rest.length} ${plPlural(rest.length, "wpis", "wpisy", "wpisów")}`}
          />
          <ErrataGrid items={rest} />
        </>
      )}
    </>
  );
}

/* ============================================================
   ErratumCard — refined: tally + rehab pips + chronic stamp.
   Compact variant for short fronts; long wrong answers get the
   strikethrough on its own muted line with the note below.
   ============================================================ */

/* Section ink markers — z palety grzbietów książek */
const SECTION_INK: Record<string, string> = {
  HIST: "#5a1410", // oxblood
  FILO: "#1f3a26", // butelkowa zieleń
  HISZ: "#7a4a1f", // koniak
  EKON: "#14213a", // granat
  MUZY: "#3a0f1c", // burgund
};

function ErratumCard({
  card,
  rotate = 0,
}: {
  card: VaultError;
  rotate?: number;
}) {
  const chronic = card.timesWrong >= 3;
  const shortFront = card.correctVersion.length < 60;
  const compact = shortFront;
  const longWrong = card.wrongVersion.length > 48;
  const prefix = vaultSig(card.vaultName);
  const sig = `${prefix} · ${idSig(card.id)}`;

  return (
    <div
      className="tex-paper tex-noise-fine relative"
      style={{
        breakInside: "avoid",
        marginBottom: 28,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        boxShadow:
          "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 18px 36px -16px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.35)",
      }}
    >
      {/* header — sig + section ink left, tally right */}
      <div
        className="relative flex items-center justify-between"
        style={{
          height: compact ? 32 : 36,
          padding: compact ? "0 18px" : "0 22px",
          borderBottom: "0.5px dashed rgba(27,17,8,0.28)",
        }}
      >
        <div className="flex items-center" style={{ gap: 9 }}>
          <span
            aria-hidden
            style={{
              width: 3,
              height: 12,
              borderRadius: 0.5,
              background: SECTION_INK[prefix] ?? "rgba(27,17,8,0.5)",
              opacity: 0.85,
              boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.25)",
            }}
          />
          <div
            className="signature"
            style={{
              color: "rgba(27,17,8,0.7)",
              fontSize: 11.5,
              letterSpacing: "0.18em",
              fontWeight: 600,
            }}
          >
            {sig}
          </div>
        </div>
        <div className="flex items-center" style={{ gap: 10 }}>
          <span
            className="eyebrow"
            style={{
              color: "rgba(139,46,31,0.7)",
              fontSize: 8.5,
              letterSpacing: "0.22em",
            }}
          >
            {plPlural(card.timesWrong, "pomyłka", "pomyłki", "pomyłek")}
          </span>
          <TallyMark count={card.timesWrong} />
        </div>
      </div>

      {/* body */}
      <div
        style={{
          padding: compact ? "16px 20px 14px" : "24px 26px 20px",
          position: "relative",
        }}
      >
        <p
          className="font-display italic"
          style={{
            fontSize: shortFront ? 27 : 22,
            color: "#1B1108",
            lineHeight: 1.32,
            marginBottom: compact ? 10 : 14,
            fontWeight: 500,
            letterSpacing: shortFront ? "-0.005em" : 0,
            textWrap: "pretty",
          }}
        >
          {card.correctVersion}
        </p>
        <div
          style={{
            height: 0.5,
            background: "rgba(27,17,8,0.22)",
            margin: compact ? "10px 0" : "14px 0",
          }}
        />
        {longWrong ? (
          <>
            <p
              className="body-prose"
              style={{
                color: "rgba(27,17,8,0.62)",
                fontSize: 12.5,
                lineHeight: 1.5,
                textWrap: "pretty",
                marginBottom: card.context ? 7 : 0,
              }}
            >
              <span
                style={{ color: "rgba(139,46,31,0.78)", fontStyle: "italic" }}
              >
                nie:{" "}
              </span>
              <span
                style={{
                  textDecoration: "line-through",
                  textDecorationThickness: "1px",
                  opacity: 0.72,
                }}
              >
                {card.wrongVersion}
              </span>
            </p>
            {card.context && (
              <p
                className="body-prose"
                style={{
                  color: "rgba(27,17,8,0.85)",
                  fontSize: 13,
                  lineHeight: 1.55,
                  textWrap: "pretty",
                }}
              >
                {card.context}
              </p>
            )}
          </>
        ) : (
          <p
            className="body-prose"
            style={{
              color: "rgba(27,17,8,0.85)",
              fontSize: 13,
              lineHeight: 1.55,
              textWrap: "pretty",
            }}
          >
            <span
              style={{ color: "rgba(139,46,31,0.78)", fontStyle: "italic" }}
            >
              nie:{" "}
            </span>
            <span
              style={{
                textDecoration: "line-through",
                textDecorationThickness: "1px",
                opacity: 0.6,
                color: "rgba(27,17,8,0.72)",
              }}
            >
              {card.wrongVersion}
            </span>
            {card.context && (
              <>
                <span style={{ color: "rgba(27,17,8,0.4)" }}> · </span>
                {card.context}
              </>
            )}
          </p>
        )}
      </div>

      {/* footer */}
      <div
        className="relative flex items-center justify-between"
        style={{
          padding: compact ? "8px 18px 9px" : "12px 22px 14px",
          borderTop: "0.5px dashed rgba(27,17,8,0.28)",
          minHeight: compact ? 34 : 44,
        }}
      >
        <RehabPips value={Math.min(3, card.correctStreak)} />
        {chronic ? (
          <ErrataStamp
            rotate={-4 - ((card.timesWrong * 7) % 5)}
          />
        ) : (
          <span
            className="signature"
            style={{
              color: "rgba(27,17,8,0.4)",
              fontSize: 10.5,
              letterSpacing: "0.08em",
            }}
          >
            obserwacja
          </span>
        )}
      </div>
    </div>
  );
}

/* Tally marks — groups of 5 */
function TallyMark({ count }: { count: number }) {
  const groups: number[] = [];
  let remaining = count;
  while (remaining > 0) {
    groups.push(Math.min(5, remaining));
    remaining -= 5;
  }
  return (
    <div className="flex items-center" style={{ gap: 8 }}>
      {groups.map((g, gi) => (
        <div
          key={gi}
          className="relative"
          style={{ width: 22, height: 18 }}
        >
          {Array.from({ length: Math.min(4, g) }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: i * 5 + 1,
                top: 1,
                bottom: 1,
                width: 1.4,
                background: "rgba(139,46,31,0.78)",
                transform: `rotate(${(((i * 31) % 5) - 2) * 0.6}deg)`,
                borderRadius: 1,
              }}
            />
          ))}
          {g === 5 && (
            <div
              style={{
                position: "absolute",
                left: -1,
                top: "50%",
                width: 22,
                height: 1.6,
                background: "rgba(139,46,31,0.85)",
                transform: "translateY(-50%) rotate(-18deg)",
                borderRadius: 2,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function RehabPips({ value }: { value: number }) {
  return (
    <div className="flex items-center" style={{ gap: 5 }}>
      <span
        className="eyebrow"
        style={{
          color: "rgba(27,17,8,0.5)",
          fontSize: 8.5,
          letterSpacing: "0.22em",
          marginRight: 6,
        }}
      >
        Rehab
      </span>
      {[0, 1, 2].map((i) => {
        const filled = i < value;
        return (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              border: "0.8px solid rgba(27,17,8,0.55)",
              background: filled
                ? "radial-gradient(circle at 35% 30%, #d9b878, #927037 80%)"
                : "transparent",
              boxShadow: filled
                ? "inset 0 -0.5px 0 rgba(0,0,0,0.35), 0 0 4px rgba(217,184,120,0.45)"
                : "none",
            }}
          />
        );
      })}
    </div>
  );
}

function ErrataStamp({ rotate = -6 }: { rotate?: number }) {
  return (
    <div
      aria-hidden
      style={{
        transform: `rotate(${rotate}deg)`,
        border: "1.5px solid var(--c-ink2)",
        color: "var(--c-ink2)",
        padding: "5px 10px 4px",
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: 9,
        letterSpacing: "0.2em",
        fontWeight: 600,
        opacity: 0.88,
        whiteSpace: "nowrap",
        background: "rgba(255,250,235,0.05)",
        lineHeight: 1.1,
      }}
    >
      <div
        style={{
          borderTop: "0.5px solid var(--c-ink2)",
          borderBottom: "0.5px solid var(--c-ink2)",
          padding: "2px 0",
          marginInline: -2,
        }}
      >
        DO UPILNOWANIA
      </div>
    </div>
  );
}

/* ============================================================
   Footer
   ============================================================ */

function PageFooter() {
  const d = new Date();
  return (
    <div
      className="flex items-center justify-between flex-wrap gap-4"
      style={{
        padding: "32px 24px 56px",
        borderTop: "1px solid rgba(184,146,77,0.18)",
        marginTop: 64,
      }}
    >
      <div
        className="signature"
        style={{ color: "var(--c-paper-300)", opacity: 0.55 }}
      >
        The Learning Vault · Anno MMXXVI · Errata
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
