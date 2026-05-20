"use client";

import { useMemo } from "react";

interface DayPoint {
  iso: string;
  pct: number | null; // null if no attempts that day
  attempts: number;
}

interface Props {
  points: DayPoint[];
}

const W = 600;
const H = 160;
const PAD_L = 32;
const PAD_R = 12;
const PAD_T = 16;
const PAD_B = 24;
const INNER_W = W - PAD_L - PAD_R;
const INNER_H = H - PAD_T - PAD_B;

export function AccuracyChart({ points }: Props) {
  const { path, dots, hasData } = useMemo(() => {
    const xs = points.map((p, i) =>
      PAD_L + (i / Math.max(1, points.length - 1)) * INNER_W
    );
    const ys = points.map((p) =>
      p.pct === null ? null : PAD_T + (1 - p.pct / 100) * INNER_H
    );

    let path = "";
    let drawing = false;
    for (let i = 0; i < points.length; i++) {
      const y = ys[i];
      if (y === null) {
        drawing = false;
        continue;
      }
      if (!drawing) {
        path += `M ${xs[i]!.toFixed(1)} ${y.toFixed(1)} `;
        drawing = true;
      } else {
        path += `L ${xs[i]!.toFixed(1)} ${y.toFixed(1)} `;
      }
    }

    const dots = points
      .map((p, i) =>
        p.pct === null
          ? null
          : { x: xs[i]!, y: ys[i]!, p }
      )
      .filter((d): d is { x: number; y: number; p: DayPoint } => d !== null);

    return { path, dots, hasData: dots.length > 0 };
  }, [points]);

  if (!hasData) {
    return (
      <div className="card text-center py-12">
        <p className="text-sm text-muted">
          Za mało danych do wykresu. Zrób parę sesji.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Trafność z ostatnich 30 dni"
      >
        {/* Y axis ticks: 0, 50, 100 */}
        {[0, 50, 100].map((v) => {
          const y = PAD_T + (1 - v / 100) * INNER_H;
          return (
            <g key={v}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={y}
                y2={y}
                stroke="rgba(232,223,204,0.10)"
                strokeWidth={1}
              />
              <text x={6} y={y + 3} fontSize={9} fill="#9AA3A8">
                {v}%
              </text>
            </g>
          );
        })}

        <path
          d={path}
          fill="none"
          stroke="#B8924D"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={2.5}
            fill="#C9622F"
          >
            <title>
              {d.p.iso} · {d.p.pct}% ({d.p.attempts}{" "}
              {d.p.attempts === 1 ? "próba" : "prób"})
            </title>
          </circle>
        ))}

        {/* X axis labels — first, middle, last */}
        {[0, Math.floor(points.length / 2), points.length - 1].map((i) => (
          <text
            key={`xl${i}`}
            x={PAD_L + (i / Math.max(1, points.length - 1)) * INNER_W}
            y={H - 6}
            fontSize={9}
            fill="#9AA3A8"
            textAnchor="middle"
          >
            {formatShortDate(points[i]!.iso)}
          </text>
        ))}
      </svg>
    </div>
  );
}

function formatShortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${parseInt(d!)}.${parseInt(m!)}`;
}
