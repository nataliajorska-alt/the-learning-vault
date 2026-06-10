"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/lib/auth-context";

export interface WeeklyStats {
  sessions: number;
  minutes: number;
  accuracy: string | null;
  errata: number;
  mastered: number;
  streak: number;
}

/** Klucz tygodnia ISO (rok + numer tygodnia) — stabilny przez cały tydzień. */
function isoWeekKey(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7; // pon=0
  date.setUTCDate(date.getUTCDate() - dayNum + 3); // czwartek tego tygodnia
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const week =
    1 +
    Math.round(
      ((date.getTime() - firstThursday.getTime()) / 86400000 -
        3 +
        ((firstThursday.getUTCDay() + 6) % 7)) /
        7
    );
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

interface Cached {
  letter: string;
}

export function WeeklyLetter({ stats }: { stats: WeeklyStats }) {
  const user = useUser();
  const [letter, setLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!user) return;
    const cacheKey = `vault:weekly-letter:${isoWeekKey()}`;

    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setLetter((JSON.parse(cached) as Cached).letter);
        return;
      }
    } catch {
      /* ignore */
    }

    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const idToken = (await user.getIdToken()) ?? "";
        const res = await fetch("/api/weekly-letter", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(stats),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { letter?: string };
        if (cancelled) return;
        if (data.letter) {
          setLetter(data.letter);
          try {
            localStorage.setItem(cacheKey, JSON.stringify({ letter: data.letter }));
          } catch {
            /* ignore */
          }
        } else {
          setFailed(true);
        }
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Cisza zamiast błędu — list to dodatek, nie może psuć dashboardu.
  if (failed && !letter) return null;

  return (
    <section className="px-6 md:px-12 lg:px-16 pb-12 md:pb-14">
      <div
        className="tex-paper tex-noise-fine relative"
        style={{
          padding: "28px 32px 26px",
          boxShadow:
            "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 22px 46px -24px rgba(0,0,0,0.72)",
        }}
      >
        <div
          className="eyebrow"
          style={{ color: "rgba(122,74,31,0.76)", marginBottom: 12 }}
        >
          List od bibliotekarza · niedziela
        </div>

        {loading && !letter ? (
          <p
            className="font-display italic animate-candle"
            style={{
              color: "rgba(27,17,8,0.55)",
              fontSize: "clamp(22px, 3vw, 30px)",
              lineHeight: 1.15,
            }}
          >
            Bibliotekarz składa pióro do listu...
          </p>
        ) : (
          <p
            className="font-display italic"
            style={{
              color: "#1B1108",
              fontSize: "clamp(22px, 3vw, 32px)",
              lineHeight: 1.22,
              fontWeight: 600,
              maxWidth: 920,
              whiteSpace: "pre-line",
            }}
          >
            {letter}
          </p>
        )}

        {letter && (
          <div
            className="signature"
            style={{
              color: "rgba(27,17,8,0.48)",
              marginTop: 18,
              textTransform: "uppercase",
            }}
          >
            — Bibliotekarz
          </div>
        )}
      </div>
    </section>
  );
}
