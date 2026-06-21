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
          padding: "40px 48px 36px",
          boxShadow:
            "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 28px 56px -24px rgba(0,0,0,0.68)",
        }}
      >
        {/* double-ruled inner frame */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 14,
            border: "1px solid rgba(122,92,40,0.32)",
            borderRadius: 1,
            pointerEvents: "none",
            zIndex: 3,
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 20,
            border: "1px solid rgba(122,92,40,0.14)",
            borderRadius: 1,
            pointerEvents: "none",
            zIndex: 3,
          }}
        />

        <div
          className="eyebrow"
          style={{
            color: "rgba(122,74,31,0.72)",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          List od bibliotekarza · niedziela
        </div>

        <div className="weekly-letter-rule" aria-hidden>
          <span />
        </div>

        {loading && !letter ? (
          <p
            className="font-display italic animate-candle"
            style={{
              color: "rgba(27,17,8,0.50)",
              fontSize: "clamp(18px, 2.3vw, 25px)",
              lineHeight: 1.2,
            }}
          >
            Bibliotekarz składa pióro do listu...
          </p>
        ) : (
          <p
            className="weekly-letter-body font-display italic"
            style={{
              color: "#1B1108",
              fontSize: "clamp(18px, 2.3vw, 26px)",
              lineHeight: 1.4,
              fontWeight: 500,
              maxWidth: 880,
              whiteSpace: "pre-line",
            }}
          >
            {letter}
          </p>
        )}

        {letter && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 28,
            }}
          >
            <span
              aria-hidden
              className="font-display"
              style={{ color: "rgba(122,92,40,0.5)", fontSize: 18, lineHeight: 1 }}
            >
              ❧
            </span>
            <div
              className="signature"
              style={{
                color: "rgba(27,17,8,0.42)",
                textTransform: "uppercase",
              }}
            >
              Bibliotekarz
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
