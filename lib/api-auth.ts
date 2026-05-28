/**
 * Garda autoryzacji dla route'ów API, które kosztują (Anthropic).
 *
 * Wymaga nagłówka `Authorization: Bearer <firebase-id-token>`. Jeśli skonfigurowane
 * są env vary Firebase Admin (FIREBASE_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY) —
 * token jest realnie weryfikowany przez verifyIdToken. Bez nich (np. lokalnie bez
 * service accounta) wpadamy w tryb luźny: wymagamy tylko obecności tokena.
 *
 * Wzorzec spójny z app/api/projekt30-xp/route.ts.
 */

import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebase-admin";

export type AuthResult =
  | { ok: true; uid: string | null }
  | { ok: false; response: NextResponse };

export async function requireAuth(req: Request): Promise<AuthResult> {
  const authHeader = req.headers.get("authorization") ?? "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!idToken) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Wymagane logowanie." },
        { status: 401 }
      ),
    };
  }

  const haveAdminCreds =
    !!process.env.FIREBASE_PROJECT_ID &&
    !!process.env.FIREBASE_CLIENT_EMAIL &&
    !!process.env.FIREBASE_PRIVATE_KEY;

  if (!haveAdminCreds) {
    console.info("api-auth: skipping verifyIdToken (no FIREBASE_ADMIN env vars)");
    return { ok: true, uid: null };
  }

  try {
    const { app } = getAdmin();
    const adminAuth = await import("firebase-admin/auth").then((m) =>
      m.getAuth(app)
    );
    const decoded = await adminAuth.verifyIdToken(idToken);
    return { ok: true, uid: decoded.uid };
  } catch (e) {
    console.warn(
      "api-auth: verifyIdToken failed:",
      e instanceof Error ? e.message : "unknown"
    );
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Nieprawidłowy token." },
        { status: 401 }
      ),
    };
  }
}
