"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useTopics, useVaults } from "@/lib/firestore-data";
import { normalizeAnswer } from "@/lib/answer-normalization";
import type { Vault } from "@/lib/types";

type Result = {
  kind: "topic" | "vault";
  id: string;
  title: string;
  sub: string;
  href: string;
};

const MAX_RESULTS = 12;

/** Globalna paleta wyszukiwania (⌘/Ctrl+K). Szuka po tytułach/streszczeniach
 *  tematów i nazwach sekcji — akcent- i wielkość-liter-niewrażliwie — i skacze
 *  prosto do tematu albo sekcji. Otwiera ją też zdarzenie "open-command-palette"
 *  (przycisk w nawigacji). */
export function CommandPalette() {
  const router = useRouter();
  const topics = useTopics();
  const vaults = useVaults();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  // Skrót ⌘/Ctrl+K + zdarzenie z nawigacji
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    function onEvent() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onEvent);
    };
  }, []);

  // Reset + fokus przy otwarciu; przywrócenie fokusu przy zamknięciu
  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
      setQ("");
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(t);
    }
    restoreFocusRef.current?.focus?.();
  }, [open]);

  const vaultById = useMemo(() => {
    const m = new Map<string, Vault>();
    (vaults ?? []).forEach((v) => m.set(v.id, v));
    return m;
  }, [vaults]);

  const results = useMemo<Result[]>(() => {
    const nq = normalizeAnswer(q);
    if (!nq) return [];
    const out: Result[] = [];
    for (const v of vaults ?? []) {
      if (normalizeAnswer(v.name).includes(nq)) {
        out.push({
          kind: "vault",
          id: v.id,
          title: v.name,
          sub: "Sekcja",
          href: `/vaults/${v.slug}`,
        });
      }
    }
    for (const t of topics ?? []) {
      const hay = normalizeAnswer(
        [t.title, t.summary, (t.learningPoints ?? []).join(" ")].join(" ")
      );
      if (hay.includes(nq)) {
        const v = vaultById.get(t.vaultId);
        out.push({
          kind: "topic",
          id: t.id,
          title: t.title,
          sub: v?.name ?? "Temat",
          href: v ? `/vaults/${v.slug}/${t.id}` : `/study/session/new?topic=${t.id}`,
        });
      }
      if (out.length >= MAX_RESULTS) break;
    }
    return out.slice(0, MAX_RESULTS);
  }, [q, topics, vaults, vaultById]);

  useEffect(() => {
    setActive(0);
  }, [q]);

  if (!open) return null;

  function go(r: Result) {
    setOpen(false);
    router.push(r.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[active];
      if (r) go(r);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Szukaj w zbiorze"
      onMouseDown={() => setOpen(false)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(10,6,2,0.6)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "12vh",
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        style={{
          width: "min(620px, 100%)",
          background: "rgba(18,10,4,0.98)",
          border: "1px solid rgba(184,146,77,0.3)",
          boxShadow: "0 24px 60px -20px rgba(0,0,0,0.85)",
        }}
      >
        <div
          className="flex items-center"
          style={{
            gap: 12,
            padding: "14px 18px",
            borderBottom: "0.5px solid rgba(184,146,77,0.2)",
          }}
        >
          <Search
            className="w-4 h-4"
            style={{ color: "var(--c-gold-400)", flexShrink: 0 }}
            aria-hidden
          />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Szukaj tematu lub sekcji…"
            autoComplete="off"
            aria-label="Szukaj tematu lub sekcji"
            className="w-full"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--c-paper-100)",
              fontSize: 16,
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontStyle: "italic",
            }}
          />
          <kbd
            aria-hidden
            className="signature hidden sm:inline"
            style={{
              color: "rgba(228,214,186,0.45)",
              fontSize: 10,
              letterSpacing: "0.1em",
              border: "0.5px solid rgba(184,146,77,0.25)",
              padding: "2px 6px",
            }}
          >
            esc
          </kbd>
        </div>

        <div style={{ maxHeight: "52vh", overflowY: "auto" }}>
          {q.trim() === "" ? (
            <p
              className="signature"
              style={{
                color: "rgba(228,214,186,0.5)",
                padding: "18px 20px",
                fontSize: 12,
              }}
            >
              Wpisz, by przeszukać tematy i sekcje w całym zbiorze.
            </p>
          ) : results.length === 0 ? (
            <p
              className="signature"
              style={{
                color: "rgba(228,214,186,0.5)",
                padding: "18px 20px",
                fontSize: 12,
              }}
            >
              Nic nie znaleziono dla „{q}”.
            </p>
          ) : (
            results.map((r, i) => {
              const isActive = i === active;
              return (
                <button
                  key={`${r.kind}-${r.id}`}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r)}
                  className="w-full flex items-baseline text-left"
                  style={{
                    gap: 14,
                    padding: "11px 20px",
                    background: isActive
                      ? "rgba(184,146,77,0.1)"
                      : "transparent",
                    border: "none",
                    borderLeft: isActive
                      ? "2px solid var(--c-gold-400)"
                      : "2px solid transparent",
                    cursor: "pointer",
                    font: "inherit",
                  }}
                >
                  <span
                    className="font-display italic"
                    style={{
                      flex: 1,
                      color: "var(--c-paper-100)",
                      fontSize: 16,
                      lineHeight: 1.3,
                    }}
                  >
                    {r.title}
                  </span>
                  <span
                    className="signature"
                    style={{
                      color:
                        r.kind === "vault"
                          ? "var(--c-gold-400)"
                          : "rgba(228,214,186,0.45)",
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      flexShrink: 0,
                    }}
                  >
                    {r.sub}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
