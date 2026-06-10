/**
 * Garda autoryzacji dla route'ów API, które kosztują (Anthropic, P30 XP bridge).
 *
 * Wymaga nagłówka `Authorization: Bearer <firebase-id-token>`. Token jest
 * weryfikowany przez verifyIdToken (Firebase Admin — FIREBASE_PROJECT_ID/
 * CLIENT_EMAIL/PRIVATE_KEY). Jeśli te env vary nie są skonfigurowane:
 *  - poza produkcją (np. lokalny `next dev`) wpadamy w tryb luźny — wymagamy
 *    tylko obecności tokena, bez weryfikacji;
 *  - na produkcji odmawiamy (fail-closed) — brak konfiguracji nie może
 *    oznaczać otwartej bramy.
 *
 * Apka jest jednoosobowa: jeśli ALLOWED_UIDS jest ustawione (CSV uidów),
 * tylko te konta przechodzą — każdy inny zalogowany Google-użytkownik
 * dostaje 403, mimo ważnego tokena Firebase.
 *
 * Wzorzec spójny z app/api/projekt30-xp/route.ts (korzysta z tej samej gardy).
 */

import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebase-admin";

export type AuthResult =
  | { ok: true; uid: string | null }
  | { ok: false; response: NextResponse };

const ALLOWED_UIDS = (process.env.ALLOWED_UIDS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

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
    if (process.env.NODE_ENV === "production") {
      console.error(
        "api-auth: brak FIREBASE_ADMIN env vars na produkcji — odmowa (fail-closed)"
      );
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Serwer nieskonfigurowany." },
          { status: 503 }
        ),
      };
    }
    console.info("api-auth: skipping verifyIdToken (no FIREBASE_ADMIN env vars, dev)");
    return { ok: true, uid: null };
  }

  try {
    const { app } = getAdmin();
    const adminAuth = await import("firebase-admin/auth").then((m) =>
      m.getAuth(app)
    );
    const decoded = await adminAuth.verifyIdToken(idToken);
    if (ALLOWED_UIDS.length > 0 && !ALLOWED_UIDS.includes(decoded.uid)) {
      console.warn("api-auth: uid spoza allowlisty:", decoded.uid);
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Brak dostępu." },
          { status: 403 }
        ),
      };
    }
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
