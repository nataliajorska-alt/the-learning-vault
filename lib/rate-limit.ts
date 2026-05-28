/**
 * Lekki rate-limiter okienkowy (fixed window) w pamięci procesu.
 *
 * UWAGA: stan jest per-instancja. Lambdy Vercela są efemeryczne i nie współdzielą
 * pamięci, więc to NIE jest twarda gwarancja globalna — to "próg zwalniający"
 * proporcjonalny do apki jednoosobowej, która i tak jest za auth-gate. Chroni
 * przed pętlą po stronie klienta i spamem z wyciekniętego tokena na ciepłej
 * instancji. Dla twardych gwarancji cross-instance trzeba store współdzielony
 * (Firestore / Upstash / Vercel KV).
 */

import { NextResponse } from "next/server";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function prune(now: number) {
  if (buckets.size < 500) return;
  for (const [k, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(k);
  }
}

/** Klucz limitu: po uid (jeśli zweryfikowany), inaczej po IP z nagłówków. */
export function clientKey(req: Request, uid: string | null, scope: string): string {
  if (uid) return `${scope}:uid:${uid}`;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  return `${scope}:ip:${ip}`;
}

/**
 * Zlicza żądanie dla danego klucza. Zwraca NextResponse 429, jeśli przekroczono
 * limit w bieżącym oknie — wtedy route powinien od razu zwrócić tę odpowiedź.
 * Zwraca null, gdy żądanie mieści się w limicie.
 */
export function checkRateLimit(
  key: string,
  opts: { limit: number; windowSec: number }
): NextResponse | null {
  const now = Date.now();
  prune(now);

  let b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    b = { count: 0, resetAt: now + opts.windowSec * 1000 };
    buckets.set(key, b);
  }
  b.count += 1;

  if (b.count > opts.limit) {
    const retryAfterSec = Math.max(1, Math.ceil((b.resetAt - now) / 1000));
    return NextResponse.json(
      { error: `Za dużo żądań. Spróbuj ponownie za ${retryAfterSec}s.` },
      { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
    );
  }
  return null;
}
