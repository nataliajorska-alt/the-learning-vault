/**
 * POST /api/projekt30-xp
 *
 * Server-side proxy do P30 endpointa XP. Klient (sesja, salon, preset) woła
 * ten route handler z ID tokenem zalogowanego usera; tu weryfikujemy token,
 * potem przekazujemy XP do P30 z shared secret (który nigdy nie trafia do
 * client bundle).
 *
 * Headers (od klienta):
 *   Authorization: Bearer <firebase-id-token>
 *
 * Body:
 *   { xp: number, source: string, pillar: P30Pillar }
 *
 * Env vars (server-side):
 *   PROJEKT30_API_URL  — np. "https://projekt-30.vercel.app/api/external/xp"
 *   PROJEKT30_API_KEY  — shared secret (ten sam co LEARNING_VAULT_API_KEY w P30)
 *
 * Plus standardowe Firebase Admin SDK env vars (już skonfigurowane w Vault dla seed):
 *   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 * Plus ALLOWED_UIDS (patrz lib/api-auth.ts) — tylko Twój uid przechodzi.
 */

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

export const runtime = "nodejs";
export const maxDuration = 15;

// Zawieszony Projekt 30 nie może blokować requestu — twardy timeout na forward.
const UPSTREAM_TIMEOUT_MS = 8000;

const ALLOWED_PILLARS = [
  "pozycja",
  "cialo",
  "styl",
  "kapital",
  "kariera",
  "tozsamosc",
  "milosc",
] as const;

const MAX_XP_PER_REQUEST = 200;

export async function POST(req: Request) {
  // 1. Konfiguracja
  const targetUrl = process.env.PROJEKT30_API_URL;
  const apiKey = process.env.PROJEKT30_API_KEY;
  if (!targetUrl || !apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "server misconfigured: PROJEKT30_API_URL or PROJEKT30_API_KEY missing",
      },
      { status: 500 }
    );
  }

  // 2. Auth + allowlist (patrz lib/api-auth.ts) — token Firebase + ALLOWED_UIDS
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  // 3. Parse + walidacja body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid json" },
      { status: 400 }
    );
  }
  const { xp, source, pillar } = (body ?? {}) as Partial<{
    xp: unknown;
    source: unknown;
    pillar: unknown;
  }>;

  if (
    typeof xp !== "number" ||
    !Number.isFinite(xp) ||
    !Number.isInteger(xp) ||
    xp <= 0 ||
    xp > MAX_XP_PER_REQUEST
  ) {
    return NextResponse.json(
      { ok: false, error: "xp must be a positive integer <= 200" },
      { status: 400 }
    );
  }
  if (
    typeof pillar !== "string" ||
    !(ALLOWED_PILLARS as readonly string[]).includes(pillar)
  ) {
    return NextResponse.json(
      { ok: false, error: "invalid pillar" },
      { status: 400 }
    );
  }
  const sourceSafe =
    typeof source === "string" && source.length > 0
      ? source.slice(0, 80)
      : "vault";

  // 4. Forward do P30 z shared secret
  try {
    const upstream = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ xp, source: sourceSafe, pillar }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return NextResponse.json(
        { ok: false, error: "p30 rejected", upstream: data },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, p30: data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json(
      { ok: false, error: `fetch failed: ${msg}` },
      { status: 502 }
    );
  }
}
