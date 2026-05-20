"use client";

import { useMemo } from "react";
import type { Timestamp } from "firebase/firestore";

interface Props {
  /** ISO date string → count of sessions that day */
  data: Record<string, number>;
  /** how many days back from today to render */
  days?: number;
}

function startOfLocalDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isoDay(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const WEEKDAY_LABELS = ["P", "W", "Ś", "C", "P", "S", "N"];
const MONTH_LABELS_PL = [
  "sty",
  "lut",
  "mar",
  "kwi",
  "maj",
  "cze",
  "lip",
  "sie",
  "wrz",
  "paź",
  "lis",
  "gru",
];

export function ActivityHeatmap({ data, days = 90 }: Props) {
  const { weeks, monthLabels, maxCount } = useMemo(() => {
    const today = startOfLocalDay(new Date());
    // Build list of days, ending at today, length = days
    const cells: { date: Date; iso: string; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = isoDay(d);
      cells.push({ date: d, iso, count: data[iso] ?? 0 });
    }

    // Pad front so the first column starts on Monday (getDay: 0=Sun, 1=Mon...)
    const firstDow = (cells[0]!.date.getDay() + 6) % 7; // Monday=0
    const padded: ({ date: Date; iso: string; count: number } | null)[] = [
      ...Array<null>(firstDow).fill(null),
      ...cells,
    ];
    // Pad end to fill last column
    while (padded.length % 7 !== 0) padded.push(null);

    const weeks: ((typeof cells)[number] | null)[][] = [];
    for (let w = 0; w < padded.length / 7; w++) {
      weeks.push(padded.slice(w * 7, w * 7 + 7));
    }

    const monthLabels: { weekIdx: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((col, wi) => {
      const firstReal = col.find((c) => c !== null);
      if (firstReal && firstReal.date.getMonth() !== lastMonth) {
        monthLabels.push({
          weekIdx: wi,
          label: MONTH_LABELS_PL[firstReal.date.getMonth()]!,
        });
        lastMonth = firstReal.date.getMonth();
      }
    });

    const maxCount = Math.max(1, ...cells.map((c) => c.count));
    return { weeks, monthLabels, maxCount };
  }, [data, days]);

  const cell = 12;
  const gap = 3;
  const labelW = 18;
  const labelH = 14;
  const width = labelW + weeks.length * (cell + gap);
  const height = labelH + 7 * (cell + gap);

  function shade(count: number): string {
    if (count === 0) return "rgba(31,58,46,0.06)";
    const t = Math.min(1, count / Math.max(1, maxCount));
    // forest with varying alpha; bias intensity so 1 session is visible
    const alpha = 0.25 + 0.7 * t;
    return `rgba(31,58,46,${alpha.toFixed(2)})`;
  }

  return (
    <div className="overflow-x-auto">
      <svg
        width={width}
        height={height}
        className="font-body"
        aria-label="Aktywność z ostatnich 90 dni"
      >
        {monthLabels.map((m) => (
          <text
            key={`m${m.weekIdx}`}
            x={labelW + m.weekIdx * (cell + gap)}
            y={10}
            fontSize={9}
            fill="#5C6B5F"
            letterSpacing="0.1em"
          >
            {m.label}
          </text>
        ))}

        {WEEKDAY_LABELS.map((d, i) =>
          i % 2 === 0 ? (
            <text
              key={`d${i}`}
              x={0}
              y={labelH + i * (cell + gap) + cell - 2}
              fontSize={9}
              fill="#5C6B5F"
            >
              {d}
            </text>
          ) : null
        )}

        {weeks.map((col, wi) =>
          col.map((c, di) => {
            const x = labelW + wi * (cell + gap);
            const y = labelH + di * (cell + gap);
            if (!c) {
              return (
                <rect
                  key={`${wi}-${di}`}
                  x={x}
                  y={y}
                  width={cell}
                  height={cell}
                  rx={2}
                  fill="transparent"
                />
              );
            }
            return (
              <rect
                key={`${wi}-${di}`}
                x={x}
                y={y}
                width={cell}
                height={cell}
                rx={2}
                fill={shade(c.count)}
              >
                <title>
                  {c.iso} · {c.count}{" "}
                  {c.count === 1 ? "sesja" : c.count < 5 ? "sesje" : "sesji"}
                </title>
              </rect>
            );
          })
        )}
      </svg>
    </div>
  );
}

export function sessionsByDay(
  sessions: { startedAt: Timestamp | Date }[]
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const s of sessions) {
    const d =
      s.startedAt instanceof Date
        ? s.startedAt
        : "toDate" in s.startedAt
        ? s.startedAt.toDate()
        : new Date(0);
    const key = isoDay(d);
    out[key] = (out[key] ?? 0) + 1;
  }
  return out;
}
