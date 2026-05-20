"use client";

import { useState } from "react";
import { useUser } from "@/lib/auth-context";
import { ensureUserDoc, seedFirstRun } from "@/lib/firestore-data";

export function FirstRunSeed() {
  const user = useUser();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function run() {
    if (!user) return;
    setBusy(true);
    setErr(null);
    try {
      await ensureUserDoc();
      await seedFirstRun(user.uid);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Nie udało się zaseedować.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card max-w-xl">
      <div className="eyebrow">Pierwsze uruchomienie</div>
      <h2 className="hero-italic text-3xl mt-2">
        Załóż swoje dwanaście sekcji.
      </h2>
      <p className="text-muted text-sm mt-3 leading-relaxed">
        Hiszpański, filozofia, sztuka, historia, ekonomia, wino, muzyka, blackjack,
        savoir-vivre, lotnictwo, Excel, angielski. Plus kilka startowych błędów
        i trzy pierwsze tematy do potrenowania od razu.
      </p>
      <button onClick={run} disabled={busy} className="btn-primary mt-6 disabled:opacity-60">
        {busy ? "Tworzę..." : "Załóż sekcje"}
      </button>
      {err && <p className="text-xs text-danger mt-3">{err}</p>}
    </div>
  );
}
