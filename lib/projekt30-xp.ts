/**
 * Integracja XP z Projekt 30 — klient.
 *
 * Wywołuje wewnętrzny route handler `/api/projekt30-xp`, który następnie
 * woła endpoint zewnętrzny w P30 z shared secret. Klient NIE zna secretu —
 * cała komunikacja idzie przez server-side proxy w tym samym deploymencie.
 *
 * Best effort: błędy są logowane, ale NIE rzucane. XP to dodatek do flow
 * sesji, nie może go zatrzymać.
 */

import { getFirebase } from "@/lib/firebase";

export const P30_PILLARS = [
  "pozycja",
  "cialo",
  "styl",
  "kapital",
  "kariera",
  "tozsamosc",
  "milosc",
] as const;

export type P30Pillar = (typeof P30_PILLARS)[number];

/** Etykiety filarów do wyświetlenia (np. w rachunku sesji). */
export const P30_PILLAR_LABELS: Record<P30Pillar, string> = {
  pozycja: "Pozycja",
  cialo: "Ciało",
  styl: "Styl",
  kapital: "Kapitał",
  kariera: "Kariera",
  tozsamosc: "Tożsamość",
  milosc: "Miłość",
};

/**
 * Mapowanie vault.slug → filar P30.
 *
 * Logika:
 * - phil/art/music/savoir/sport/wine/es/hist/avia → TOŻSAMOŚĆ (obycie kulturowe,
 *   budowanie tożsamości intelektualnej)
 * - en/excel → KARIERA (umiejętności zawodowe — angielski biznesowy, narzędzia)
 * - econ/blackjack → KAPITAŁ (rozumienie pieniądza, ryzyka, strategii)
 *
 * Nowe vaulty bez wpisu domyślnie → TOŻSAMOŚĆ.
 */
export const VAULT_TO_PILLAR: Record<string, P30Pillar> = {
  phil: "tozsamosc",
  art: "tozsamosc",
  music: "tozsamosc",
  savoir: "tozsamosc",
  sport: "tozsamosc",
  wine: "tozsamosc",
  es: "tozsamosc",
  hist: "tozsamosc",
  avia: "tozsamosc",
  en: "kariera",
  excel: "kariera",
  econ: "kapital",
  blackjack: "kapital",
};

export function pillarForVaultSlug(slug: string | undefined): P30Pillar {
  if (!slug) return "tozsamosc";
  return VAULT_TO_PILLAR[slug] ?? "tozsamosc";
}

/**
 * Wysyła XP do Projekt 30. Best effort — błędy idą tylko do console.
 *
 * @param opts.xp dodatnia liczba całkowita (np. 25 za sesję 15 min, 10 za
 *                import presetu, 5 za odsłonięcie salonu, 1 za poprawną odp.)
 * @param opts.source krótki opis (np. "vault:finish-session", "vault:salon-view")
 *                    — trafia do logów P30
 * @param opts.pillar jeden z 7 filarów; użyj pillarForVaultSlug() do mapowania
 */
export async function awardP30Xp(opts: {
  xp: number;
  source: string;
  pillar: P30Pillar;
}): Promise<void> {
  try {
    const { auth } = getFirebase();
    const user = auth.currentUser;
    if (!user) return; // nie zalogowany → cicho pomijamy
    const idToken = await user.getIdToken();
    const res = await fetch("/api/projekt30-xp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(opts),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn("awardP30Xp failed:", res.status, text);
    }
  } catch (e) {
    console.warn("awardP30Xp error:", e);
  }
}
