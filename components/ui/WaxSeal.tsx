"use client";

import { useId } from "react";

export type WaxTone = "oxblood" | "burgundy" | "umber";

const PALETTES: Record<
  WaxTone,
  { hi: string; mid: string; lo: string; shadow: string; shape: string }
> = {
  oxblood: {
    hi: "#c14430",
    mid: "#8a2418",
    lo: "#4a0d08",
    shadow: "#1a0403",
    shape: "49% 51% 52% 48% / 51% 47% 53% 49%",
  },
  burgundy: {
    hi: "#7a2030",
    mid: "#52111d",
    lo: "#2c0810",
    shadow: "#160405",
    shape: "52% 48% 49% 51% / 48% 52% 50% 50%",
  },
  umber: {
    hi: "#a35424",
    mid: "#723817",
    lo: "#3e1c0a",
    shadow: "#170a04",
    shape: "50% 50% 53% 47% / 53% 49% 51% 47%",
  },
};

interface Props {
  size?: number;
  label?: string;
  tone?: WaxTone;
  rotate?: number;
}

export function WaxSeal({
  size = 56,
  label = "LV",
  tone = "oxblood",
  rotate = -4,
}: Props) {
  const p = PALETTES[tone];
  const seedId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const monoSize = size * 0.42;
  const ornSize = size * 0.1;

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
        filter:
          "drop-shadow(0 6px 10px rgba(0,0,0,0.55)) drop-shadow(0 2px 3px rgba(0,0,0,0.4))",
        isolation: "isolate",
      }}
      aria-hidden
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          borderRadius: p.shape,
          background: `radial-gradient(ellipse 70% 60% at 28% 22%, ${p.hi} 0%, ${p.mid} 38%, ${p.lo} 78%, ${p.shadow} 100%)`,
          boxShadow:
            "inset 0 2px 3px rgba(255,180,150,0.32), inset 0 -4px 8px rgba(0,0,0,0.55), inset 3px 0 6px rgba(0,0,0,0.25), inset -2px 0 4px rgba(255,180,140,0.10)",
        }}
      >
        {/* drip */}
        <div
          className="absolute"
          style={{
            width: size * 0.22,
            height: size * 0.32,
            bottom: -size * 0.14,
            right: size * 0.18,
            background: `radial-gradient(ellipse 50% 80% at 50% 30%, ${p.mid} 0%, ${p.lo} 60%, ${p.shadow} 100%)`,
            borderRadius: "50% 50% 55% 45% / 35% 35% 65% 65%",
            transform: "rotate(6deg)",
            boxShadow:
              "inset 0 -3px 4px rgba(0,0,0,0.55), inset 0 1px 2px rgba(255,180,150,0.2)",
            zIndex: -1,
          }}
        />
        {/* splatter bead */}
        <div
          className="absolute"
          style={{
            width: size * 0.09,
            height: size * 0.08,
            top: -size * 0.04,
            left: size * 0.18,
            background: `radial-gradient(circle at 40% 30%, ${p.hi}, ${p.lo} 80%)`,
            borderRadius: "50%",
            boxShadow: "inset 0 -1px 1px rgba(0,0,0,0.5)",
          }}
        />
        {/* speckled noise */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: p.shape,
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='${seedId}'><feTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.06  0 0 0 0 0.02  0 0 0 0 0.01  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23${seedId})'/></svg>")`,
            mixBlendMode: "multiply",
            opacity: 0.55,
          }}
        />
        {/* debossed inner ring */}
        <div
          className="absolute"
          style={{
            inset: size * 0.1,
            borderRadius: "50%",
            boxShadow:
              "inset 0 1.5px 2px rgba(0,0,0,0.55), inset 0 -1px 0 rgba(255,180,150,0.25), 0 0.5px 0 rgba(255,180,150,0.18)",
            border: "0.5px solid rgba(0,0,0,0.25)",
          }}
        />
        {/* outer rim */}
        <div
          className="absolute"
          style={{
            inset: size * 0.05,
            borderRadius: "50%",
            border: "0.5px solid rgba(0,0,0,0.18)",
            boxShadow: "inset 0 0 0 0.5px rgba(255,180,150,0.12)",
          }}
        />
        {/* sheen */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: 0,
            borderRadius: p.shape,
            background:
              "radial-gradient(ellipse 55% 40% at 30% 18%, rgba(255,210,180,0.35), transparent 60%)",
          }}
        />
        {/* ornament stars */}
        <span
          className="absolute font-display"
          style={{
            left: size * 0.18,
            top: "50%",
            transform: "translateY(-50%)",
            color: p.shadow,
            fontSize: ornSize,
            opacity: 0.7,
            textShadow:
              "0 -0.5px 0 rgba(255,180,150,0.25), 0 0.5px 0 rgba(0,0,0,0.4)",
            lineHeight: 1,
          }}
        >
          ✦
        </span>
        <span
          className="absolute font-display"
          style={{
            right: size * 0.18,
            top: "50%",
            transform: "translateY(-50%)",
            color: p.shadow,
            fontSize: ornSize,
            opacity: 0.7,
            textShadow:
              "0 -0.5px 0 rgba(255,180,150,0.25), 0 0.5px 0 rgba(0,0,0,0.4)",
            lineHeight: 1,
          }}
        >
          ✦
        </span>
        {/* debossed monogram */}
        <span
          className="relative"
          style={{
            color: p.shadow,
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: monoSize,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            textShadow:
              "0 -1px 1.5px rgba(0,0,0,0.85), 0 0.5px 0 rgba(255,200,170,0.35), 0 1px 2px rgba(0,0,0,0.4)",
            transform: "translateY(-1px)",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
