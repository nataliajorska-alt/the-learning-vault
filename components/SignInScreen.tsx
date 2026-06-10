"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { WaxSeal } from "./ui/WaxSeal";

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

      <div className="max-w-md w-full relative animate-fadein">
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
              className="eyebrow"
              style={{
                marginTop: 36,
                width: "100%",
                background:
                  "linear-gradient(180deg, #6b1a14 0%, #4a1010 55%, #2c0808 100%)",
                color: "var(--c-paper-100)",
                padding: "17px 28px",
                border: "0.5px solid rgba(184,146,77,0.55)",
                letterSpacing: "0.22em",
                fontWeight: 600,
                boxShadow:
                  "inset 0 1px 0 rgba(255,180,140,0.18), inset 0 -1px 0 rgba(0,0,0,0.45), 0 8px 20px -6px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.45)",
                cursor: busy ? "wait" : "pointer",
                textShadow: "0 -1px 0 rgba(0,0,0,0.6)",
                opacity: busy ? 0.65 : 1,
                transition: "opacity 180ms ease, transform 180ms ease",
              }}
            >
              {busy ? "Łączę…" : "Zaloguj przez Google →"}
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
    </div>
  );
}
