"use client";

import Link from "next/link";

/* ============================================================
   Refined bookcase: framed, lit, with brass section plates,
   bookends, and gilt-banded book spines.
   ============================================================ */

export type SpineClass =
  | "spine-terracotta" | "spine-wine" | "spine-oxford" | "spine-lapis"
  | "spine-aubergine" | "spine-buff" | "spine-slate" | "spine-forest-v2"
  | "spine-racing-v2" | "spine-steel" | "spine-moss" | "spine-maroon";

export type GiltIconName =
  | "globe" | "glass" | "translate" | "palette" | "music" | "crown"
  | "brain" | "columns" | "trend" | "spade" | "plane" | "sheet" | "trophy";

/* slug → spine class (each book its own colour) — shared by Sekcje
   and the dashboard shelf strip */
export const SPINE_BY_SLUG: Record<string, SpineClass> = {
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

export interface BookcaseVault {
  slug: string;
  title: string;
  level: string;
  count: number;        // due today
  icon: GiltIconName;
  spine: SpineClass;
  shelf: 1 | 2;
}

/* ------------------------------------------------------------
   Gilt line-art icons (16-20px)
   ------------------------------------------------------------ */
export function GiltIcon({
  name,
  size = 16,
  color = "#d9b878",
}: {
  name: GiltIconName;
  size?: number;
  color?: string;
}) {
  const stroke = {
    fill: "none",
    stroke: color,
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "globe":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="6.2" {...stroke} />
          <ellipse cx="8" cy="8" rx="2.6" ry="6.2" {...stroke} />
          <path d="M1.8 8h12.4M2.6 5h10.8M2.6 11h10.8" {...stroke} />
        </svg>
      );
    case "glass":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <path
            d="M4.2 2.2h7.6l-0.8 4.6a3 3 0 0 1-3 2.5h0a3 3 0 0 1-3-2.5L4.2 2.2zM8 9.3v4.5M5.5 13.8h5"
            {...stroke}
          />
        </svg>
      );
    case "translate":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <path
            d="M2.5 4.5h6M5.5 3v1.5M3 13.5l2-7 2 7M3.6 11.5h2.8"
            {...stroke}
          />
          <path
            d="M9.5 7.5h4l-2 6.5M8.5 14l1.4-4M11.5 6V4.5"
            {...stroke}
          />
        </svg>
      );
    case "palette":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <path
            d="M8 1.6a6.4 6.4 0 1 0 0 12.8c0.8 0 1.1-.6 1-1.3-.2-.8 0-1.7 1-1.7h1.8a2.4 2.4 0 0 0 2.4-2.4 6.4 6.4 0 0 0-6.2-7.4z"
            {...stroke}
          />
          <circle cx="5" cy="6" r=".7" fill={color} />
          <circle cx="8" cy="4.5" r=".7" fill={color} />
          <circle cx="11" cy="6" r=".7" fill={color} />
          <circle cx="5.5" cy="9.5" r=".7" fill={color} />
        </svg>
      );
    case "music":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <path d="M6 12V3.5l6-1.3v8.5" {...stroke} />
          <ellipse cx="4.5" cy="12" rx="1.6" ry="1.2" {...stroke} />
          <ellipse cx="10.5" cy="10.7" rx="1.6" ry="1.2" {...stroke} />
        </svg>
      );
    case "crown":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <path
            d="M2.5 11.5h11M2.5 11.5L2 5l3 2.5L8 3l3 4.5L14 5l-.5 6.5"
            {...stroke}
          />
          <circle cx="2" cy="5" r=".7" fill={color} />
          <circle cx="14" cy="5" r=".7" fill={color} />
          <circle cx="8" cy="3" r=".7" fill={color} />
        </svg>
      );
    case "brain":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <path
            d="M8 3.2v9.6M5 5a1.8 1.8 0 1 1 0 3.6M5 8.6a1.8 1.8 0 1 1 0 3.6M11 5a1.8 1.8 0 1 0 0 3.6M11 8.6a1.8 1.8 0 1 0 0 3.6M5.5 5a2.5 2.5 0 0 1 5 0M5.5 11.8a2.5 2.5 0 0 0 5 0"
            {...stroke}
          />
        </svg>
      );
    case "columns":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <path
            d="M2 13.5h12M2.5 12.5h11M3.5 12.5V5.5M6 12.5V5.5M10 12.5V5.5M12.5 12.5V5.5M1.5 5.5h13L8 2 1.5 5.5z"
            {...stroke}
          />
        </svg>
      );
    case "trend":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <path d="M2 12l3.5-4 2.5 2L13.5 4M10 4h3.5v3.5" {...stroke} />
        </svg>
      );
    case "spade":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <path
            d="M8 2.2c2.2 2.6 4.2 4 4.2 6.2a2.6 2.6 0 0 1-4.5 1.8c.1 1.6.5 2.2 1.3 3H7c.8-.8 1.2-1.4 1.3-3a2.6 2.6 0 0 1-4.5-1.8c0-2.2 2-3.6 4.2-6.2z"
            {...stroke}
          />
        </svg>
      );
    case "plane":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <path
            d="M8 1.5l1.2 6L14 9.5l-4.8 1L8 14.5l-1.2-4L2 9.5l4.8-2L8 1.5z"
            {...stroke}
          />
        </svg>
      );
    case "sheet":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <path
            d="M3 2h7l3 3v9H3V2zM10 2v3h3M5 7.5h6M5 10h6M5 12.5h4"
            {...stroke}
          />
        </svg>
      );
    case "trophy":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <path
            d="M5 2.5h6v3a3 3 0 0 1-6 0v-3zM4 4H2.5v1.5A2.5 2.5 0 0 0 5 8M12 4h1.5v1.5A2.5 2.5 0 0 1 11 8M8 8.5v3M5.5 13.5h5M6.5 11.5h3"
            {...stroke}
          />
        </svg>
      );
  }
}

/* ------------------------------------------------------------
   Brass medallion floating above each spine — count today
   ------------------------------------------------------------ */
function CountMedallion({ n }: { n: number }) {
  const big = n >= 10;
  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 32% 26%, #f3d791 0%, #d9b878 28%, #b08540 70%, #6f4e1f 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,235,180,0.65), inset 0 -2px 3px rgba(50,30,8,0.55), 0 2px 4px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,220,170,0.35)",
      }}
    >
      <div
        className="absolute"
        style={{
          inset: 3,
          borderRadius: "50%",
          border: "0.5px solid rgba(80,50,15,0.55)",
          boxShadow: "inset 0 0 0 0.5px rgba(255,225,180,0.35)",
        }}
      />
      <span
        style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: big ? 11 : 12,
          fontWeight: 700,
          color: "#3a2410",
          letterSpacing: big ? "-0.02em" : 0,
          textShadow:
            "0 0.5px 0 rgba(255,230,180,0.6), 0 -0.5px 0 rgba(0,0,0,0.35)",
        }}
      >
        {n}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------
   Raised band — horizontal hub on the spine
   ------------------------------------------------------------ */
function BandHub({ y, bottom }: { y?: number; bottom?: number }) {
  const pos = bottom !== undefined ? { bottom } : { top: y };
  return (
    <div className="absolute left-0 right-0" style={{ ...pos, height: 12 }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,220,180,0.10) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <div
        className="absolute left-0 right-0"
        style={{ top: 0, height: 1, background: "rgba(0,0,0,0.55)" }}
      />
      <div
        className="absolute left-0 right-0"
        style={{ bottom: 0, height: 1, background: "rgba(0,0,0,0.55)" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------
   A single book — refined spine
   ------------------------------------------------------------ */
interface BookProps {
  vault: BookcaseVault;
  width?: number;
  baseHeight?: number;
  hDelta?: number;
  tilt?: number;
  href: string;
}

export function Book({
  vault,
  width = 108,
  baseHeight = 410,
  hDelta = 0,
  tilt = 0,
  href,
}: BookProps) {
  const h = baseHeight + hDelta;
  const leanGap = tilt < 0 ? Math.min(18, Math.abs(tilt) * 8) : 0;

  return (
    <Link
      href={href}
      aria-label={`${vault.title}${vault.count > 0 ? `, ${vault.count} dziś` : ""}`}
      className="block relative group"
      style={{
        width,
        height: h,
        marginInline: 1.5,
        marginLeft: 1.5 + leanGap,
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
        transformOrigin: "bottom center",
      }}
    >
      {/* floating medallion */}
      <div
        className="absolute z-20"
        style={{ top: -18, left: "50%", transform: "translateX(-50%)" }}
      >
        <CountMedallion n={vault.count} />
      </div>

      {/* spine body */}
      <div
        className={`${vault.spine} relative w-full h-full overflow-hidden transition-transform duration-300 ease-out group-hover:-translate-y-2 group-focus-visible:-translate-y-2`}
        style={{
          boxShadow:
            "inset 1.5px 0 2px rgba(255,220,180,0.10), inset -1.5px 0 3px rgba(0,0,0,0.55), inset 0 -8px 14px rgba(0,0,0,0.35), inset 0 4px 8px rgba(0,0,0,0.25), 0 6px 14px -6px rgba(0,0,0,0.7)",
        }}
      >
        {/* top cap (page block visible) */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: 8,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(50,30,12,0.55) 50%, rgba(20,10,5,0.85) 100%)",
            borderBottom: "0.5px solid rgba(0,0,0,0.6)",
          }}
        />

        <BandHub y={28} />

        {/* icon panel */}
        <div
          className="absolute left-0 right-0 flex items-center justify-center"
          style={{ top: 42, height: 22 }}
        >
          <GiltIcon name={vault.icon} size={15} color="#dec18a" />
        </div>

        {/* gilt rules under icon */}
        <div
          className="absolute left-3 right-3"
          style={{
            top: 70,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #d9b878 30%, #b08540 50%, #d9b878 70%, transparent)",
          }}
        />
        <div
          className="absolute left-5 right-5"
          style={{
            top: 73,
            height: 0.5,
            background: "rgba(217,184,120,0.55)",
          }}
        />

        {/* vertical title */}
        <div
          className="absolute"
          style={{
            left: 0,
            right: 0,
            top: 86,
            bottom: 96,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="font-display italic"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              fontSize: 17,
              fontWeight: 500,
              letterSpacing: "0.04em",
              color: "#e9c98a",
              textShadow:
                "0 0.5px 0 rgba(255,230,180,0.25), 0 -0.5px 0 rgba(0,0,0,0.45), 0 0 6px rgba(217,184,120,0.18)",
              whiteSpace: "nowrap",
            }}
          >
            {vault.title}
          </div>
        </div>

        {/* gilt rules above level pill */}
        <div
          className="absolute left-3 right-3"
          style={{
            bottom: 70,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #d9b878 30%, #b08540 50%, #d9b878 70%, transparent)",
          }}
        />
        <div
          className="absolute left-5 right-5"
          style={{
            bottom: 73,
            height: 0.5,
            background: "rgba(217,184,120,0.55)",
          }}
        />

        <BandHub bottom={28} />

        {/* level pill */}
        <div
          className="absolute left-0 right-0 flex items-center justify-center"
          style={{ bottom: 14 }}
        >
          <span
            className="eyebrow"
            style={{
              fontSize: 8.5,
              letterSpacing: "0.22em",
              color: "#d9b878",
              opacity: 0.92,
            }}
          >
            {vault.level.toUpperCase()}
          </span>
        </div>

        {/* bottom cap */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: 8,
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(50,30,12,0.55) 50%, rgba(20,10,5,0.85) 100%)",
            borderTop: "0.5px solid rgba(0,0,0,0.6)",
          }}
        />

        {/* glossy left edge */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: 8,
            bottom: 8,
            left: 0,
            width: 6,
            background:
              "linear-gradient(90deg, rgba(255,220,180,0.18), transparent)",
          }}
        />
        {/* shadow right edge */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: 8,
            bottom: 8,
            right: 0,
            width: 8,
            background:
              "linear-gradient(270deg, rgba(0,0,0,0.55), transparent)",
          }}
        />
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------
   Bookend — brass triangular bookend
   ------------------------------------------------------------ */
function Bookend({
  side = "left",
  height = 220,
}: {
  side?: "left" | "right";
  height?: number;
}) {
  const flip = side === "right";
  return (
    <div
      style={{
        width: 36,
        height,
        transform: flip ? "scaleX(-1)" : undefined,
        position: "relative",
        marginInline: 4,
      }}
      aria-hidden
    >
      <svg
        width="36"
        height={height}
        viewBox={`0 0 36 ${height}`}
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id={`be-${side}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3a2410" />
            <stop offset="0.4" stopColor="#8a6630" />
            <stop offset="0.55" stopColor="#d9b878" />
            <stop offset="0.7" stopColor="#8a6630" />
            <stop offset="1" stopColor="#2a1808" />
          </linearGradient>
        </defs>
        <rect
          x="0"
          y={height - 10}
          width="36"
          height="10"
          fill={`url(#be-${side})`}
        />
        <rect x="0" y="0" width="6" height={height - 10} fill={`url(#be-${side})`} />
        <circle cx="3" cy="6" r="5" fill={`url(#be-${side})`} stroke="rgba(0,0,0,0.5)" strokeWidth="0.5" />
        <circle cx="3" cy="6" r="2" fill="rgba(255,225,180,0.4)" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------
   Section plate — brass engraved plaque on the shelf rail
   ------------------------------------------------------------ */
function SectionPlate({ number, title }: { number: string; title: string }) {
  return (
    <div
      className="relative"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "3px 14px 2px",
        whiteSpace: "nowrap",
        borderRadius: 1,
        background:
          "linear-gradient(180deg, rgba(255,235,180,0.55), transparent 30%, transparent 70%, rgba(40,22,8,0.45)), linear-gradient(135deg, #b8924d 0%, #d9b878 35%, #927037 70%, #6a5128 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,235,180,0.55), inset 0 -1px 0 rgba(30,15,5,0.6), 0 2px 4px rgba(0,0,0,0.5)",
      }}
    >
      {[
        [3, 4, "auto", "auto"],
        [3, "auto", "auto", 4],
        ["auto", 4, 3, "auto"],
        ["auto", "auto", 3, 4],
      ].map((c, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 3,
            height: 3,
            top: c[0] === "auto" ? "auto" : (c[0] as number),
            right: c[1] === "auto" ? "auto" : (c[1] as number),
            bottom: c[2] === "auto" ? "auto" : (c[2] as number),
            left: c[3] === "auto" ? "auto" : (c[3] as number),
            background:
              "radial-gradient(circle at 35% 30%, #f0d28b, #6a4818 70%, #1a0e04)",
            boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.55)",
          }}
        />
      ))}
      <span
        className="font-display italic"
        style={{
          fontSize: 13,
          color: "#2a1808",
          textShadow: "0 0.5px 0 rgba(255,230,180,0.4)",
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        {number}
      </span>
      <div
        style={{ width: 1, height: 11, background: "rgba(40,22,8,0.45)" }}
      />
      <span
        className="eyebrow"
        style={{
          color: "#2a1808",
          fontSize: 8.5,
          letterSpacing: "0.2em",
          textShadow: "0 0.5px 0 rgba(255,230,180,0.4)",
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        {title}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------
   Shelf — books + bookends + plank with section plate
   ------------------------------------------------------------ */
function Shelf({
  books,
  plate,
  hrefFor,
  variances,
}: {
  books: BookcaseVault[];
  plate: React.ReactNode;
  hrefFor: (b: BookcaseVault) => string;
  variances: Record<string, { h: number; r: number }>;
}) {
  return (
    <div className="relative w-full">
      <div
        className="relative flex items-end justify-center"
        style={{ paddingInline: 28, minHeight: 440 }}
      >
        <Bookend side="left" height={230} />
        <div className="flex items-end" style={{ gap: 0 }}>
          {books.map((b) => {
            const v = variances[b.slug] ?? { h: 0, r: 0 };
            return (
              <Book
                key={b.slug}
                vault={b}
                href={hrefFor(b)}
                hDelta={v.h}
                tilt={v.r}
              />
            );
          })}
        </div>
        <Bookend side="right" height={230} />
      </div>

      {/* plank */}
      <div
        className="relative"
        style={{
          height: 28,
          background:
            "linear-gradient(180deg, rgba(255,220,180,0.15) 0%, transparent 12%, transparent 80%, rgba(0,0,0,0.45) 100%), repeating-linear-gradient(92deg, rgba(20,10,4,0) 0, rgba(20,10,4,0) 22px, rgba(40,22,10,0.18) 23px, rgba(20,10,4,0) 45px), linear-gradient(180deg, #4a2c14 0%, #36200f 60%, #1d100704 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,210,160,0.30), inset 0 -2px 3px rgba(0,0,0,0.7), 0 22px 32px -14px rgba(0,0,0,0.85), 0 4px 0 #1a0e05",
        }}
      >
        <div
          className="absolute left-0 right-0"
          style={{ top: 6, height: 0.5, background: "rgba(217,184,120,0.5)" }}
        />
        <div
          className="absolute left-0 right-0"
          style={{ top: 9, height: 0.5, background: "rgba(217,184,120,0.3)" }}
        />

        <div
          className="absolute"
          style={{ right: 60, top: "50%", transform: "translateY(-50%)" }}
        >
          {plate}
        </div>
      </div>

      {/* under-shelf brackets */}
      <div className="relative" style={{ height: 18 }}>
        <div
          className="absolute"
          style={{
            left: 28,
            top: 0,
            width: 24,
            height: 14,
            background: "linear-gradient(180deg, #2a1808, #14080300)",
            clipPath: "polygon(0 0, 100% 0, 0 100%)",
          }}
        />
        <div
          className="absolute"
          style={{
            right: 28,
            top: 0,
            width: 24,
            height: 14,
            background: "linear-gradient(180deg, #2a1808, #14080300)",
            clipPath: "polygon(100% 0, 0 0, 100% 100%)",
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   Bookcase — full wooden frame wrapping two shelves
   ------------------------------------------------------------ */
export interface BookcaseProps {
  shelf1: BookcaseVault[];
  shelf2: BookcaseVault[];
  variances?: Record<string, { h: number; r: number }>;
  hrefFor?: (b: BookcaseVault) => string;
}

const DEFAULT_VARIANCES: Record<string, { h: number; r: number }> = {};

export function Bookcase({
  shelf1,
  shelf2,
  variances = DEFAULT_VARIANCES,
  hrefFor = (b) => `/vaults/${b.slug}`,
}: BookcaseProps) {
  return (
    <div className="relative mx-auto" style={{ maxWidth: 1180 }}>
      {/* warm light pool overhead */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: -120,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 1100,
          height: 360,
          background:
            "radial-gradient(ellipse 50% 60% at 50% 30%, rgba(255,200,130,0.18) 0%, rgba(200,150,90,0.06) 35%, transparent 70%)",
          filter: "blur(8px)",
          zIndex: 5,
        }}
      />

      {/* crown molding */}
      <div
        className="relative"
        style={{
          height: 38,
          background:
            "linear-gradient(180deg, #5a3819 0%, #321d0c 70%, #1a0e05 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,210,160,0.25), inset 0 -2px 3px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="absolute left-0 right-0"
          style={{ top: 8, height: 0.5, background: "rgba(217,184,120,0.45)" }}
        />
        <div
          className="absolute left-0 right-0"
          style={{ top: 11, height: 0.5, background: "rgba(217,184,120,0.25)" }}
        />
        <div
          className="absolute left-0 right-0"
          style={{
            bottom: 6,
            height: 0.5,
            background: "rgba(217,184,120,0.35)",
          }}
        />
        {[0.07, 0.5, 0.93].map((pct, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${pct * 100}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, #d9b878, #6a4818 70%)",
              boxShadow:
                "inset 0 0 0 0.5px rgba(0,0,0,0.5), 0 0.5px 0 rgba(255,230,180,0.25)",
            }}
          />
        ))}
      </div>

      {/* interior */}
      <div
        className="relative"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 10%, rgba(180,120,60,0.16) 0%, transparent 60%), radial-gradient(ellipse 100% 100% at 50% 100%, rgba(0,0,0,0.45), transparent 60%), repeating-linear-gradient(90deg, rgba(40,20,8,0) 0, rgba(40,20,8,0) 8px, rgba(60,32,14,0.12) 9px, rgba(40,20,8,0) 18px), linear-gradient(180deg, #1f130a 0%, #18100780 50%, #160d0680 100%)",
          boxShadow:
            "inset 0 6px 14px rgba(0,0,0,0.7), inset 0 -6px 14px rgba(0,0,0,0.55)",
          borderLeft: "8px solid #2a1808",
          borderRight: "8px solid #2a1808",
          zIndex: 4,
        }}
      >
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            inset: "14px 22px",
            border: "0.5px solid rgba(217,184,120,0.06)",
            boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.35)",
          }}
        />

        <div style={{ paddingTop: 36 }}>
          <Shelf
            books={shelf1}
            hrefFor={hrefFor}
            variances={variances}
            plate={<SectionPlate number="§ I" title="Linguae & Cultura" />}
          />
        </div>
        <div style={{ paddingTop: 24 }}>
          <Shelf
            books={shelf2}
            hrefFor={hrefFor}
            variances={variances}
            plate={<SectionPlate number="§ II" title="Praktyka & Strategia" />}
          />
        </div>
        <div style={{ height: 28 }} />
      </div>

      {/* base molding */}
      <div
        className="relative"
        style={{
          height: 22,
          background: "linear-gradient(180deg, #3a2410 0%, #1a0e05 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,210,160,0.18), 0 6px 12px rgba(0,0,0,0.6)",
        }}
      >
        <div
          className="absolute left-0 right-0"
          style={{ top: 6, height: 0.5, background: "rgba(217,184,120,0.3)" }}
        />
      </div>
    </div>
  );
}
