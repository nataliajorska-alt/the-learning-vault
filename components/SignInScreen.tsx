"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

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
    <div className="min-h-screen flex items-center justify-center bg-ivory bg-grain px-6">
      <div className="max-w-md w-full text-center">
        <div className="eyebrow">The Learning</div>
        <h1 className="hero-italic text-6xl mt-2">Vault</h1>
        <p className="text-muted mt-6 leading-relaxed">
          Aktywna nauka. Dwanaście obszarów, jeden rytm. Bez zakuwania, bez
          fajerwerków.
        </p>

        <button
          onClick={handle}
          disabled={busy}
          className="btn-primary mt-10 w-full justify-center disabled:opacity-60"
        >
          {busy ? "Łączę..." : "Zaloguj przez Google"}
        </button>

        {err && (
          <p className="text-xs text-danger mt-4 max-w-sm mx-auto">{err}</p>
        )}

        <p className="text-xs text-muted mt-10">
          Tylko ty masz dostęp do swoich danych. Reguły Firestore są zakotwiczone na twoim UID.
        </p>
      </div>
    </div>
  );
}
