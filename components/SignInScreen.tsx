"use client";

import { useState } from "react";
import { ArrowRight, BookOpenCheck, LockKeyhole, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { WaxSeal } from "./ui/WaxSeal";

const SHOWCASE_BOOKS = [
  { label: "Hiszpański", color: "#6e2418", height: 330 },
  { label: "Sztuka", color: "#1c3552", height: 382 },
  { label: "Wino", color: "#3a0c12", height: 350 },
  { label: "Filozofia", color: "#25272c", height: 406 },
  { label: "Excel", color: "#3a3a1c", height: 318 },
] as const;

export function SignInScreen() {
  const { signIn } = useAuth();
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handle() {
    setBusy(true);
    setErr(null);
    try {
      await signIn();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Coś nie zadziałało.";
      setErr(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="tex-mahogany min-h-screen flex items-center justify-center px-6 py-12 relative">
      {/* candlelight spill from above */}
      <div
        aria-hidden
        className="absolute pointer-events-none inset-x-0 top-0"
        style={{
          height: 480,
          background:
            "radial-gradient(ellipse 55% 70% at 50% 0%, rgba(255,210,160,0.10), transparent 70%)",
        }}
      />

      <div className="max-w-5xl w-full relative animate-fadein grid grid-cols-1 lg:grid-cols-[minmax(0,440px)_minmax(360px,1fr)] gap-8 lg:gap-12 items-center">
        {/* double gold-ruled frame */}
        <div
          className="relative"
          style={{
            border: "0.5px solid rgba(184,146,77,0.5)",
            padding: 4,
            boxShadow:
              "0 30px 60px -24px rgba(0,0,0,0.75), 0 8px 20px -8px rgba(0,0,0,0.5)",
            background: "rgba(21,16,10,0.55)",
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            className="relative text-center"
            style={{
              border: "0.5px solid rgba(184,146,77,0.22)",
              padding: "56px 36px 44px",
            }}
          >
            {/* seal above the title */}
            <div className="flex justify-center" style={{ marginBottom: 26 }}>
              <WaxSeal size={62} label="LV" tone="oxblood" rotate={-5} />
            </div>

            <div
              className="eyebrow"
              style={{ color: "var(--c-gold-400)", opacity: 0.85 }}
            >
              Ex libris · The Learning
            </div>

            <h1
              className="display"
              style={{
                fontSize: "clamp(56px, 9vw, 72px)",
                color: "var(--c-paper-100)",
                marginTop: 8,
                lineHeight: 1,
              }}
            >
              Vault
            </h1>

            <div
              className="ornament-sep"
              style={{
                margin: "26px 0 22px",
                color: "var(--c-gold-500)",
                opacity: 0.7,
                fontSize: 13,
              }}
            >
              ❦
            </div>

            <p
              className="font-display italic"
              style={{
                fontSize: 19,
                lineHeight: 1.5,
                color: "rgba(228,214,186,0.78)",
                maxWidth: "30ch",
                margin: "0 auto",
              }}
            >
              Aktywna nauka. Trzynaście dziedzin, jeden rytm — bez zakuwania,
              bez fajerwerków.
            </p>

            <button
              onClick={handle}
              disabled={busy}
              className="eyebrow sign-in-cta inline-flex items-center justify-center"
              style={{
                gap: 10,
                marginTop: 36,
                width: "100%",
                background:
                  "linear-gradient(180deg, #6b1a14 0%, #4a1010 55%, #2c0808 100%)",
                color: "var(--c-paper-100)",
                padding: "17px 28px",
                border: "0.5px solid rgba(184,146,77,0.55)",
                letterSpacing: "0.18em",
                fontWeight: 600,
                whiteSpace: "nowrap",
                lineHeight: 1.1,
                boxShadow:
                  "inset 0 1px 0 rgba(255,180,140,0.18), inset 0 -1px 0 rgba(0,0,0,0.45), 0 8px 20px -6px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.45)",
                cursor: busy ? "wait" : "pointer",
                textShadow: "0 -1px 0 rgba(0,0,0,0.6)",
                opacity: busy ? 0.65 : 1,
                transition: "opacity 180ms ease, transform 180ms ease",
              }}
            >
              <LockKeyhole className="h-4 w-4 stroke-[1.5]" />
              {busy ? "Łączę…" : "Zaloguj przez Google"}
              {!busy && <ArrowRight className="h-4 w-4 stroke-[1.5]" />}
            </button>

            {err && (
              <p
                className="caption"
                style={{ color: "#D86056", marginTop: 16 }}
              >
                {err}
              </p>
            )}

            <p
              className="signature"
              style={{
                color: "var(--c-paper-300)",
                opacity: 0.45,
                marginTop: 34,
              }}
            >
              Tylko ty masz dostęp do swoich danych.
            </p>
          </div>
        </div>

        {/* colophon under the frame */}
        <div className="lg:hidden">
          <div
            className="signature text-center"
            style={{
              color: "var(--c-paper-300)",
              opacity: 0.38,
              marginTop: 22,
            }}
          >
            Sub gratia studiorum · Anno MMXXVI
          </div>
        </div>

        <div
          className="hidden lg:block relative"
          style={{
            minHeight: 520,
          }}
          aria-hidden
        >
          <div
            className="absolute inset-x-8 bottom-0"
            style={{
              height: 34,
              background:
                "linear-gradient(180deg, #5a3819 0%, #321d0c 70%, #1a0e05 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,210,160,0.25), inset 0 -2px 3px rgba(0,0,0,0.65), 0 20px 34px -18px rgba(0,0,0,0.85)",
            }}
          />
          <div
            className="absolute left-0 right-0 bottom-[34px] flex items-end justify-center"
            style={{ gap: 7 }}
          >
            {SHOWCASE_BOOKS.map(({ label, color, height }, i) => (
              <div
                key={label}
                className="relative overflow-hidden"
                style={{
                  width: 72,
                  height,
                  backgroundColor: color,
                  transform: i === 1 ? "rotate(-1.4deg)" : i === 4 ? "rotate(1.8deg)" : undefined,
                  transformOrigin: "bottom center",
                  boxShadow:
                    "inset 2px 0 3px rgba(255,220,180,0.10), inset -2px 0 5px rgba(0,0,0,0.55), inset 0 -10px 18px rgba(0,0,0,0.35), 0 8px 16px -8px rgba(0,0,0,0.75)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "linear-gradient(90deg, rgba(0,0,0,0.50), transparent 26%, transparent 74%, rgba(0,0,0,0.55)), repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(0,0,0,0.08) 4px)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 38,
                    left: 0,
                    right: 0,
                    height: 2,
                    background:
                      "linear-gradient(90deg, transparent, #d9b878, transparent)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 72,
                    left: 0,
                    right: 0,
                    height: 2,
                    background:
                      "linear-gradient(90deg, transparent, #d9b878, transparent)",
                  }}
                />
                <div
                  className="font-display italic"
                  style={{
                    position: "absolute",
                    inset: "74px 0 96px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    color: "#e9c98a",
                    fontSize: 17,
                    textShadow: "0 1px 2px rgba(0,0,0,0.55)",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div
            className="tex-paper tex-noise-fine absolute"
            style={{
              right: 12,
              top: 28,
              width: 276,
              padding: "28px 28px 26px",
              transform: "rotate(2deg)",
              boxShadow:
                "0 1px 0 rgba(255,250,235,0.6) inset, 0 20px 42px -18px rgba(0,0,0,0.75), 0 5px 10px rgba(0,0,0,0.35)",
            }}
          >
            <div
              className="eyebrow flex items-center"
              style={{ gap: 8, color: "rgba(139,46,31,0.82)", marginBottom: 12 }}
            >
              <Sparkles className="h-3.5 w-3.5 stroke-[1.7]" />
              Osobisty indeks
            </div>
            <div
              className="font-display italic"
              style={{
                color: "#1B1108",
                fontSize: 34,
                lineHeight: 1.02,
                fontWeight: 600,
                marginBottom: 14,
              }}
            >
              Nauka, która wygląda jak rytuał.
            </div>
            <div
              className="caption"
              style={{ color: "rgba(27,17,8,0.70)", marginBottom: 18 }}
            >
              Regał tematów, krótka sesja, salon do obycia w rozmowie i errata
              pilnująca potknięć.
            </div>
            <div
              className="signature flex items-center"
              style={{
                gap: 8,
                color: "rgba(27,17,8,0.56)",
                textTransform: "uppercase",
              }}
            >
              <BookOpenCheck className="h-4 w-4 stroke-[1.6]" />
              15 minut · codziennie
            </div>
          </div>

          <div
            className="signature"
            style={{
              position: "absolute",
              left: 34,
              bottom: -42,
              color: "var(--c-paper-300)",
              opacity: 0.38,
            }}
          >
            Sub gratia studiorum · Anno MMXXVI
          </div>
        </div>
      </div>
    </div>
  );
}
