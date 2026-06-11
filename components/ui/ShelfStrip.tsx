"use client";

import Link from "next/link";
import { SPINE_BY_SLUG } from "@/components/ui/Bookcase";

/* ============================================================
   ShelfStrip — sekcje jako grzbiety na niskiej półce (Dziś v3).
   Kompaktowa wersja regału: jeden rząd małych grzbietów na
   desce, każdy linkuje do swojej sekcji.
   ============================================================ */

export interface ShelfStripVault {
  id: string;
  slug: string;
  name: string;
}

function MiniSpine({
  vault,
  idx,
  height = 148,
  width = 56,
}: {
  vault: ShelfStripVault;
  idx: number;
  height?: number;
  width?: number;
}) {
  // small deterministic height variance so the shelf feels real
  const variance = ((idx * 13) % 18) - 9;
  const h = height + variance;
  const spine = SPINE_BY_SLUG[vault.slug] ?? "spine-slate";

  return (
    <Link
      href={`/vaults/${vault.slug}`}
      aria-label={vault.name}
      className={`${spine} relative shrink-0 transition-transform duration-300 ease-out hover:-translate-y-1.5 focus-visible:-translate-y-1.5 focus:outline-none`}
      style={{
        height: h,
        width,
        marginInline: 1,
        boxShadow:
          "inset 0 0 24px rgba(0,0,0,0.45), 0 2px 0 rgba(0,0,0,0.6)",
      }}
    >
      {/* top + bottom caps (page block) */}
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0"
        style={{
          height: 6,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(60,40,20,0.4) 35%, rgba(40,25,10,0.7) 100%)",
        }}
      />
      <span
        aria-hidden
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: 6,
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(60,40,20,0.4) 35%, rgba(40,25,10,0.7) 100%)",
        }}
      />

      {/* gold bands */}
      <span aria-hidden className="absolute left-0 right-0 tex-gold" style={{ top: "18%", height: 2, opacity: 0.9 }} />
      <span aria-hidden className="absolute left-0 right-0 tex-gold" style={{ top: "21%", height: 1, opacity: 0.7 }} />
      <span aria-hidden className="absolute left-0 right-0 tex-gold" style={{ bottom: "18%", height: 2, opacity: 0.9 }} />
      <span aria-hidden className="absolute left-0 right-0 tex-gold" style={{ bottom: "21%", height: 1, opacity: 0.7 }} />

      {/* gilt title — rotated vertical */}
      <span
        className="absolute left-1/2 top-1/2 whitespace-nowrap font-display italic font-medium"
        style={{
          writingMode: "vertical-rl",
          transform: "translate(-50%,-50%) rotate(180deg)",
          fontSize: 13,
          letterSpacing: "0.12em",
          color: "#d9b878",
          textShadow: "0 0 1px rgba(60,30,10,0.6)",
        }}
      >
        {vault.name}
      </span>

      {/* small index at the foot */}
      <span
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: 12,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 7,
          color: "#c8a25c",
          letterSpacing: "0.1em",
        }}
      >
        {String(idx + 1).padStart(2, "0")}
      </span>
    </Link>
  );
}

export function ShelfStrip({
  vaults,
  height = 148,
}: {
  vaults: ShelfStripVault[];
  height?: number;
}) {
  return (
    <div className="relative">
      <div
        className="flex items-end overflow-x-auto hide-scrollbar"
        style={{ paddingInline: 12 }}
      >
        {vaults.map((v, i) => (
          <MiniSpine key={v.id} vault={v} idx={i} height={height} />
        ))}
      </div>
      {/* shelf plank under the books */}
      <div
        className="tex-desk relative"
        style={{
          height: 22,
          boxShadow:
            "inset 0 2px 0 rgba(0,0,0,0.55), inset 0 -2px 4px rgba(0,0,0,0.45), 0 18px 30px -10px rgba(0,0,0,0.7)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px rule-gold opacity-50" />
      </div>
    </div>
  );
}
