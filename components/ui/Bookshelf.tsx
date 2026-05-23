"use client";

import Link from "next/link";
import { VaultIcon } from "@/components/ui/VaultIcon";

export interface BookVault {
  id: string;
  slug: string;
  name: string;
  icon: string;
  level: string;
  color: "gold" | "rose" | "forest";
}

interface BookProps {
  vault: BookVault;
  total: number;
  dueCount: number;
  index: number;
  leans?: boolean;
}

const SPINE_HEIGHTS = [296, 304, 292, 308, 298, 302, 294, 306, 296, 300, 290, 304, 298];
const SPINE_WIDTHS = [64, 68, 66, 70, 64, 68, 66, 70, 64, 68, 66, 70, 66];

function spineGradient(color: BookVault["color"]) {
  if (color === "rose") {
    return "linear-gradient(90deg, #2b0a0a 0%, #5a1a1a 14%, #3d1010 50%, #5a1a1a 86%, #2b0a0a 100%)";
  }
  if (color === "gold") {
    return "linear-gradient(90deg, #2a1808 0%, #5e3e1f 14%, #422a13 50%, #5e3e1f 86%, #2a1808 100%)";
  }
  return "linear-gradient(90deg, #0a1410 0%, #1d3527 14%, #122318 50%, #1d3527 86%, #0a1410 100%)";
}

const COLOR_ORDER: Record<BookVault["color"], number> = {
  rose: 0,
  gold: 1,
  forest: 2,
};

function Book({ vault, dueCount, index, leans }: BookProps) {
  const height = SPINE_HEIGHTS[index % SPINE_HEIGHTS.length];
  const width = SPINE_WIDTHS[index % SPINE_WIDTHS.length];
  const tilt = leans ? -2 : 0;

  return (
    <Link
      href={`/vaults/${vault.slug}`}
      aria-label={`${vault.name}${dueCount > 0 ? `, ${dueCount} do zrobienia` : ""}`}
      className="book group relative shrink-0 flex flex-col items-center justify-between rounded-t-[3px] shadow-lift hover:-translate-y-3 transition-transform duration-300 ease-gentle animate-fadein focus:outline-none focus-visible:-translate-y-3 focus-visible:ring-2 focus-visible:ring-gold/60"
      style={{
        height,
        width,
        background: spineGradient(vault.color),
        animationDelay: `${index * 50}ms`,
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
        transformOrigin: "bottom center",
      }}
    >
      {/* leather/cloth grain overlay */}
      <span
        className="pointer-events-none absolute inset-0 rounded-t-[3px] opacity-40 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)",
          backgroundSize: "3px 3px",
        }}
      />
      {/* spine highlight (left edge) */}
      <span className="pointer-events-none absolute inset-y-0 left-0 w-px bg-white/15" />
      {/* spine shadow (right edge) */}
      <span className="pointer-events-none absolute inset-y-0 right-0 w-px bg-black/40" />

      {/* top cap / headband */}
      <span className="pointer-events-none absolute top-0 left-0 right-0 h-1.5 rounded-t-[3px] bg-gradient-to-b from-paper/70 to-paper/20" />

      {/* decorative gold bands — embossed, restrained */}
      <span className="pointer-events-none absolute left-2 right-2 top-7 h-px bg-gold/55" />
      <span className="pointer-events-none absolute left-2.5 right-2.5 top-[34px] h-px bg-gold/25" />
      <span className="pointer-events-none absolute left-2.5 right-2.5 bottom-[40px] h-px bg-gold/25" />
      <span className="pointer-events-none absolute left-2 right-2 bottom-12 h-px bg-gold/55" />

      {/* due badge */}
      {dueCount > 0 && (
        <span
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-10 text-[9px] font-medium tracking-wide bg-gold text-ivory rounded-full px-1.5 py-0.5 shadow-soft"
          aria-hidden
        >
          {dueCount}
        </span>
      )}

      {/* icon */}
      <span className="relative mt-3 text-paper/90 drop-shadow">
        <VaultIcon name={vault.icon} className="w-3.5 h-3.5 stroke-[1.5]" />
      </span>

      {/* vertical title */}
      <span
        className="relative flex-1 flex items-center justify-center mt-3 mb-3 px-1"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        <span
          className="hero-italic text-paper text-[15px] leading-none whitespace-nowrap drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
        >
          {vault.name}
        </span>
      </span>

      {/* level eyebrow */}
      <span
        className="relative mb-2.5 text-[7.5px] uppercase tracking-[0.2em] text-paper/70 whitespace-nowrap"
        style={{ writingMode: "horizontal-tb" }}
      >
        {vault.level}
      </span>

      {/* bottom edge — pages cream */}
      <span className="pointer-events-none absolute -bottom-0.5 left-0.5 right-0.5 h-1 bg-paper/15 rounded-b-[2px]" />
    </Link>
  );
}

interface ShelfProps {
  vaults: BookVault[];
  dueByVault: Record<string, number>;
  totalByVault: Record<string, number>;
  startIndex?: number;
}

function Shelf({ vaults, dueByVault, totalByVault, startIndex = 0 }: ShelfProps) {
  return (
    <div className="relative">
      {/* books — sit on top of the shelf */}
      <div className="flex items-end justify-center gap-[2px] overflow-x-auto px-3 pb-0 scrollbar-thin">
        {vaults.map((v, i) => (
          <Book
            key={v.id}
            vault={v}
            total={totalByVault[v.id] ?? 0}
            dueCount={dueByVault[v.id] ?? 0}
            index={startIndex + i}
            leans={i === vaults.length - 1}
          />
        ))}
      </div>
      {/* shelf plank */}
      <div
        className="h-3.5 rounded-[2px] shadow-lift"
        style={{
          background:
            "linear-gradient(180deg, #4a3320 0%, #3a2614 40%, #2a1a0c 100%)",
          boxShadow:
            "0 12px 24px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(184,146,77,0.25)",
        }}
      />
      {/* shelf shadow under plank */}
      <div className="h-2 bg-gradient-to-b from-black/40 to-transparent" />
    </div>
  );
}

export function Bookshelf({
  vaults,
  dueByVault,
  totalByVault,
}: {
  vaults: BookVault[];
  dueByVault: Record<string, number>;
  totalByVault: Record<string, number>;
}) {
  // group by color (rose → gold → forest) then by order within group
  const sorted = [...vaults].sort((a, b) => {
    const ca = COLOR_ORDER[a.color] ?? 99;
    const cb = COLOR_ORDER[b.color] ?? 99;
    if (ca !== cb) return ca - cb;
    const ao = (a as unknown as { order?: number }).order ?? 0;
    const bo = (b as unknown as { order?: number }).order ?? 0;
    return ao - bo;
  });
  // split into two shelves: warm tones on top (rose + gold), cool/green on bottom
  const top = sorted.filter((v) => v.color !== "forest");
  const bottom = sorted.filter((v) => v.color === "forest");

  return (
    <div className="space-y-8">
      <Shelf
        vaults={top}
        dueByVault={dueByVault}
        totalByVault={totalByVault}
        startIndex={0}
      />
      <Shelf
        vaults={bottom}
        dueByVault={dueByVault}
        totalByVault={totalByVault}
        startIndex={top.length}
      />
    </div>
  );
}
