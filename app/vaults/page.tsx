"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bookcase,
  GiltIcon,
  type BookcaseVault,
  type GiltIconName,
  type SpineClass,
} from "@/components/ui/Bookcase";
import {
  effectiveStreak,
  useTopics,
  useUserDoc,
  useVaults,
} from "@/lib/firestore-data";
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

/* slug → spine class (each book its own colour) */
const SPINE_BY_SLUG: Record<string, SpineClass> = {
  es: "spine-terracotta",
  wine: "spine-wine",
  en: "spine-oxford",
  art: "spine-lapis",
  music: "spine-aubergine",
  savoir: "spine-buff",
  phil: "spine-slate",
  hist: "spine-forest-v2",
  econ: "spine-oxford",
  blackjack: "spine-racing-v2",
  avia: "spine-steel",
  excel: "spine-moss",
  sport: "spine-maroon",
};

/* shelf assignment: I — cultural; II — practical/strategy */
const SHELF_BY_SLUG: Record<string, 1 | 2> = {
  es: 1, wine: 1, en: 1, art: 1, music: 1, savoir: 1,
  phil: 2, hist: 2, econ: 2, blackjack: 2, avia: 2, excel: 2, sport: 2,
};

/* legacy lucide name → gilt icon name */
const ICON_MAP: Record<string, GiltIconName> = {
  Globe: "globe",
  Brain: "brain",
  Palette: "palette",
  Landmark: "columns",
  TrendingUp: "trend",
  Wine: "glass",
  Music: "music",
  Spade: "spade",
  Crown: "crown",
  Plane: "plane",
  FileSpreadsheet: "sheet",
  Languages: "translate",
  Trophy: "trophy",
};

/* per-slug variance for natural shelving */
const VARIANCE: Record<string, { h: number; r: number }> = {
  es:        { h:  0, r:  0 },
  wine:      { h: -14, r:  0 },
  en:        { h:  8, r:  0 },
  art:       { h: -4, r:  0 },
  music:     { h: -22, r:  0 },
  savoir:    { h: -6, r: -1.4 },
  phil:      { h:  6, r:  0 },
  hist:      { h:  0, r:  0 },
  econ:      { h: -12, r:  0 },
  blackjack: { h:  2, r:  0 },
  avia:      { h: -26, r:  0 },
  excel:     { h: -16, r:  0 },
  sport:     { h: -30, r: -1.8 },
};

const ROMAN_NUMERALS = [
  "I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII",
];

const MONTHS_PL_SHORT = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];

function shortDate(ms: number): string {
  if (!ms) return "—";
  const d = new Date(ms);
  return `${d.getDate()}.${MONTHS_PL_SHORT[d.getMonth()]}`;
}

/* ---------- Page ------------------------------------------------------- */

type SortMode = "alpha" | "today" | "recent";

export default function VaultsPage() {
  const vaults = useVaults();
  const topics = useTopics();
  const userDoc = useUserDoc();
  const streak = effectiveStreak(userDoc);

  const [sortMode, setSortMode] = useState<SortMode>("today");

  const dueByVault = useMemo(() => {
    const map: Record<string, number> = {};
    if (!topics) return map;
    const now = Date.now();
    for (const t of topics) {
      const isDue =
        t.status === "fresh" ||
        t.status === "struggling" ||
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

  const lastTouchedByVault = useMemo(() => {
    const map: Record<string, number> = {};
    if (!topics) return map;
    for (const t of topics) {
      const candidates: number[] = [];
      const lr = (t as unknown as { lastReviewed?: unknown }).lastReviewed;
      const ls = (t as unknown as { lastShownInSalon?: unknown }).lastShownInSalon;
      candidates.push(toMillis(lr));
      candidates.push(toMillis(ls));
      const best = Math.max(...candidates, 0);
      if (best > (map[t.vaultId] ?? 0)) {
        map[t.vaultId] = best;
      }
    }
    return map;
  }, [topics]);

  if (vaults === null) {
    return (
      <div className="text-muted hero-italic text-2xl">Ładuję sekcje...</div>
    );
  }

  const bookcaseItems: BookcaseVault[] = vaults.map((v) => ({
    slug: v.slug,
    title: v.name,
    level: v.level,
    count: dueByVault[v.id] ?? 0,
    icon: ICON_MAP[v.icon] ?? "columns",
    spine: SPINE_BY_SLUG[v.slug] ?? "spine-slate",
    shelf: SHELF_BY_SLUG[v.slug] ?? 2,
  }));

  const shelf1 = bookcaseItems.filter((b) => b.shelf === 1);
  const shelf2 = bookcaseItems.filter((b) => b.shelf === 2);

  const totalDue = Object.values(dueByVault).reduce((s, n) => s + n, 0);

  return (
    /* Bust the container so the bookcase has room */
    <div className="-mx-6 md:-mx-12 -mt-10 md:-mt-12 relative overflow-hidden">
      {/* subtle dot pattern */}
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

      <div className="relative" style={{ zIndex: 1 }}>
        <Hero
          sectionsCount={vaults.length}
          totalDue={totalDue}
          streak={streak}
        />

        <div style={{ paddingBottom: 80 }}>
          <Bookcase
            shelf1={shelf1}
            shelf2={shelf2}
            variances={VARIANCE}
          />
        </div>

        <Catalog
          vaults={vaults}
          dueByVault={dueByVault}
          totalByVault={totalByVault}
          lastTouchedByVault={lastTouchedByVault}
          sortMode={sortMode}
          onSortChange={setSortMode}
        />

        <PageFooter />
      </div>
    </div>
  );
}

/* ============================================================
   Hero
   ============================================================ */
function Hero({
  sectionsCount,
  totalDue,
  streak,
}: {
  sectionsCount: number;
  totalDue: number;
  streak: number;
}) {
  return (
    <div
      className="regal-header flex items-end justify-between flex-wrap gap-8"
      style={{ padding: "clamp(32px, 6vw, 56px) clamp(20px, 5vw, 24px) clamp(28px, 5vw, 40px)" }}
    >
      <div style={{ maxWidth: 720 }}>
        <div
          className="eyebrow"
          style={{ color: "var(--c-gold-400)", marginBottom: 14 }}
        >
          § II · Twoja biblioteka · {sectionsCount} tomów
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
          Regał
        </h1>
        <p
          className="lead"
          style={{
            color: "var(--c-paper-300)",
            opacity: 0.85,
            maxWidth: 540,
          }}
        >
          Trzynaście tomów, jeden rytm.{" "}
          {totalDue > 0 ? (
            <>
              Dziś{" "}
              <span
                className="font-display italic"
                style={{ color: "var(--c-gold-300)", fontSize: 22 }}
              >
                {totalDue}
              </span>{" "}
              {totalDue === 1 ? "rzecz czeka" : "rzeczy czeka"} na otwarcie.
            </>
          ) : (
            "Dziś nic nie zalega. Możesz pobuszować po katalogu."
          )}
        </p>
      </div>

      <div className="regal-stats flex items-stretch flex-shrink-0">
        <BrassStat label="Tomów" value={sectionsCount} sub="czynnych" />
        <Divider />
        <BrassStat label="Dziś" value={totalDue} sub="powtórek" />
        <Divider />
        <BrassStat
          label="Passa"
          value={streak}
          sub={streak === 1 ? "dzień" : "dni"}
        />
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        width: 1,
        alignSelf: "stretch",
        background:
          "linear-gradient(180deg, transparent, rgba(184,146,77,0.4), transparent)",
      }}
    />
  );
}

function BrassStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: number | string;
  sub: string;
}) {
  return (
    <div className="brass-stat" style={{ padding: "8px 24px", textAlign: "center" }}>
      <div
        className="eyebrow"
        style={{ color: "var(--c-gold-400)", marginBottom: 6 }}
      >
        {label}
      </div>
      <div
        className="brass-stat-value font-display italic"
        style={{
          fontSize: 40,
          lineHeight: 1,
          color: "var(--c-paper-100)",
          fontWeight: 600,
        }}
      >
        {value}
      </div>
      <div
        className="signature"
        style={{
          color: "var(--c-paper-300)",
          opacity: 0.55,
          marginTop: 4,
        }}
      >
        {sub}
      </div>
    </div>
  );
}

/* ============================================================
   Catalog
   ============================================================ */
interface CatalogProps {
  vaults: Array<{
    id: string;
    slug: string;
    name: string;
    level: string;
    icon: string;
    order?: number;
  }>;
  dueByVault: Record<string, number>;
  totalByVault: Record<string, number>;
  lastTouchedByVault: Record<string, number>;
  sortMode: SortMode;
  onSortChange: (m: SortMode) => void;
}

function Catalog({
  vaults,
  dueByVault,
  totalByVault,
  lastTouchedByVault,
  sortMode,
  onSortChange,
}: CatalogProps) {
  const rows = useMemo(() => {
    const sorted = [...vaults];
    if (sortMode === "alpha") {
      sorted.sort((a, b) => a.name.localeCompare(b.name, "pl"));
    } else if (sortMode === "today") {
      sorted.sort(
        (a, b) => (dueByVault[b.id] ?? 0) - (dueByVault[a.id] ?? 0)
      );
    } else {
      sorted.sort(
        (a, b) =>
          (lastTouchedByVault[b.id] ?? 0) - (lastTouchedByVault[a.id] ?? 0)
      );
    }
    return sorted;
  }, [vaults, sortMode, dueByVault, lastTouchedByVault]);

  return (
    <div style={{ padding: "clamp(48px, 9vw, 100px) clamp(20px, 5vw, 24px) clamp(48px, 7vw, 80px)" }}>
      <div
        className="flex items-baseline justify-between flex-wrap gap-6"
        style={{ marginBottom: 28 }}
      >
        <div>
          <div
            className="eyebrow"
            style={{ color: "var(--c-gold-400)", marginBottom: 8 }}
          >
            Katalog
          </div>
          <h2
            className="h2"
            style={{ fontSize: "clamp(32px, 4vw, 44px)", color: "var(--c-paper-100)" }}
          >
            Pełny spis treści
          </h2>
        </div>
        <div className="flex items-center" style={{ gap: 24 }}>
          <SortTab
            active={sortMode === "alpha"}
            onClick={() => onSortChange("alpha")}
          >
            Alfabetycznie
          </SortTab>
          <SortTab
            active={sortMode === "today"}
            onClick={() => onSortChange("today")}
          >
            Dziś najwięcej
          </SortTab>
          <SortTab
            active={sortMode === "recent"}
            onClick={() => onSortChange("recent")}
          >
            Ostatnio
          </SortTab>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(184,146,77,0.25)" }}>
        {rows.map((v, i) => (
          <CatalogRow
            key={v.id}
            i={i}
            slug={v.slug}
            title={v.name}
            level={v.level}
            iconName={ICON_MAP[v.icon] ?? "columns"}
            due={dueByVault[v.id] ?? 0}
            total={totalByVault[v.id] ?? 0}
            lastTouched={lastTouchedByVault[v.id] ?? 0}
            romanIndex={ROMAN_NUMERALS[i] ?? String(i + 1)}
          />
        ))}
      </div>
    </div>
  );
}

function SortTab({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="eyebrow"
      style={{
        color: active ? "var(--c-gold-300)" : "var(--c-paper-300)",
        opacity: active ? 1 : 0.6,
        borderBottom: active
          ? "1px solid var(--c-gold-500)"
          : "1px solid transparent",
        paddingBottom: 4,
        cursor: "pointer",
        background: "transparent",
        transition: "color 180ms ease, opacity 180ms ease",
      }}
    >
      {children}
    </button>
  );
}

function CatalogRow({
  i,
  slug,
  title,
  level,
  iconName,
  due,
  total,
  lastTouched,
  romanIndex,
}: {
  i: number;
  slug: string;
  title: string;
  level: string;
  iconName: GiltIconName;
  due: number;
  total: number;
  lastTouched: number;
  romanIndex: string;
}) {
  const lastStr = shortDate(lastTouched);
  const recent =
    lastTouched > 0 &&
    Date.now() - lastTouched < 3 * 24 * 60 * 60 * 1000;
  const cap = Math.max(60, total + due);

  return (
    <Link
      href={`/vaults/${slug}`}
      className="catalog-row grid items-center cursor-pointer group"
      style={{
        gridTemplateColumns:
          "44px 48px minmax(0,1fr) 160px 130px 90px 28px",
        gap: 14,
        padding: "18px 0",
        borderBottom: "1px solid rgba(184,146,77,0.16)",
        transition: "background-color .25s ease",
      }}
    >
      {/* index */}
      <div
        className="signature"
        style={{
          color: "var(--c-paper-400)",
          opacity: 0.5,
          fontSize: 11,
        }}
      >
        {String(i + 1).padStart(2, "0")}
      </div>

      {/* icon tile */}
      <div
        className="flex items-center justify-center"
        style={{
          width: 40,
          height: 40,
          borderRadius: 2,
          background:
            "linear-gradient(180deg, rgba(184,146,77,0.08), rgba(184,146,77,0.03))",
          border: "0.5px solid rgba(184,146,77,0.22)",
        }}
      >
        <GiltIcon name={iconName} size={18} color="#d9b878" />
      </div>

      {/* title + level */}
      <div className="min-w-0">
        <div
          className="font-display italic"
          style={{
            fontSize: "clamp(20px, 2vw, 26px)",
            color: "var(--c-paper-100)",
            lineHeight: 1.1,
            marginBottom: 4,
          }}
        >
          {title}
        </div>
        <div
          className="eyebrow"
          style={{ color: "var(--c-paper-300)", opacity: 0.55 }}
        >
          {level} · Tom {romanIndex}
          {/* Mobile-only meta: due count + last-touched (pokazują się
              gdy główne kolumny są ukryte przez media query) */}
          <span
            className="catalog-mobile-meta"
            style={{
              color: due > 0 ? "var(--c-gold-300)" : "var(--c-paper-400)",
              opacity: due > 0 ? 0.9 : 0.5,
              marginLeft: 8,
            }}
          >
            · {due} dziś{lastStr ? ` · ${lastStr}` : ""}
          </span>
        </div>
      </div>

      {/* progress */}
      <div className="catalog-progress">
        <div
          className="signature"
          style={{
            color: "var(--c-paper-300)",
            opacity: 0.6,
            fontSize: 10,
            marginBottom: 6,
            letterSpacing: "0.1em",
          }}
        >
          DZIŚ · {due} / {cap}
        </div>
        <div
          style={{
            height: 2,
            background: "rgba(184,146,77,0.18)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${Math.min(100, (due / cap) * 100)}%`,
              background:
                "linear-gradient(90deg, #927037, #d9b878, #B8924D)",
              boxShadow: "0 0 6px rgba(217,184,120,0.4)",
            }}
          />
        </div>
      </div>

      {/* last touched */}
      <div className="catalog-last flex items-center" style={{ gap: 10 }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: recent ? "#d9b878" : "rgba(184,146,77,0.3)",
            boxShadow: recent ? "0 0 6px rgba(217,184,120,0.6)" : "none",
            flexShrink: 0,
          }}
        />
        <div>
          <div
            className="eyebrow"
            style={{
              color: "var(--c-paper-400)",
              opacity: 0.55,
              fontSize: 9,
            }}
          >
            Ostatnio
          </div>
          <div
            className="signature"
            style={{ color: "var(--c-paper-200)", fontSize: 12 }}
          >
            {lastStr}
          </div>
        </div>
      </div>

      {/* today pill */}
      <div className="catalog-today flex justify-end">
        <span
          className="signature"
          style={{
            fontSize: 11,
            color: due > 0 ? "var(--c-gold-300)" : "var(--c-paper-400)",
            border: "0.5px solid rgba(184,146,77,0.45)",
            borderRadius: 999,
            padding: "5px 12px 4px",
            letterSpacing: "0.14em",
            background: "transparent",
            transition: "background-color .2s ease",
            whiteSpace: "nowrap",
          }}
        >
          {due} DZIŚ
        </span>
      </div>

      {/* chevron */}
      <div
        style={{
          textAlign: "right",
          color: "var(--c-gold-400)",
          opacity: 0.4,
          transition: "opacity .2s",
          fontSize: 18,
        }}
        className="group-hover:opacity-100"
      >
        →
      </div>
    </Link>
  );
}

/* ============================================================
   Footer
   ============================================================ */
function PageFooter() {
  const d = new Date();
  const weekday = ["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"][d.getDay()];
  return (
    <div
      className="flex items-center justify-between flex-wrap gap-4"
      style={{
        padding: "32px 24px 56px",
        borderTop: "1px solid rgba(184,146,77,0.18)",
      }}
    >
      <div
        className="signature"
        style={{ color: "var(--c-paper-300)", opacity: 0.55 }}
      >
        The Learning Vault · Anno MMXXVI · Sekcje
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
        {weekday} · {d.getDate()} · {MONTHS_PL_SHORT[d.getMonth()]}
      </div>
    </div>
  );
}
