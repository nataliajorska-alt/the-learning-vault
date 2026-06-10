/**
 * POST /api/weekly-letter
 *
 * Tygodniowy „list od bibliotekarza" — krótkie podsumowanie tygodnia w stylu
 * old money. Dane (sesje, trafność, errata...) przychodzą od klienta; tu tylko
 * składamy je w prompt i prosimy Haiku o elegancki akapit. Grosze za tydzień,
 * bo klient cache'uje wynik per tydzień i woła to tylko w niedzielę.
 *
 * Garda: requireAuth + ALLOWED_UIDS (patrz lib/api-auth.ts).
 */

import { NextResponse } from "next/server";
import { getAnthropic, MODEL_GRADE } from "@/lib/anthropic";
import { requireAuth } from "@/lib/api-auth";
import { checkRateLimit, clientKey } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `Jesteś bibliotekarzem prywatnej czytelni Natalii — uczy się tu aktywnie (sesje 15 min, errata, salon). Raz w tygodniu, w niedzielę, piszesz do niej krótki list z podsumowaniem minionego tygodnia.

Dostajesz suche liczby. Twoje zadanie: ująć je z taktem i ciągłością, jak prywatny sekretarz starej rodziny, nie jak aplikacja fitness.

Zasady:
- Po polsku, do Natalii (per "ty"/"ją" naturalnie, bez sztywności).
- 3-5 zdań. Jeden płynny akapit, bez wypunktowań.
- Odnieś się do liczb konkretnie, ale bez ich recytowania jak raportu.
- Ton: ciepły, opanowany, lekko literacki. Old money: spokój, ciągłość, żadnej euforii.
- Bez wykrzykników, bez emoji, bez "świetnie/super/brawo".
- Jeśli tydzień był pusty — bez wyrzutów; zaproś łagodnie do powrotu.
- Jeśli był mocny — doceń wstrzemięźliwie, wskaż jeden spokojny ruch na kolejny tydzień.
- NIE podpisuj się (podpis dokłada interfejs).`;

interface WeeklyLetterRequest {
  sessions: number;
  minutes: number;
  accuracy: string | null;
  errata: number;
  mastered: number;
  streak: number;
}

export async function POST(req: Request) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  const limited = checkRateLimit(clientKey(req, auth.uid, "weekly-letter"), {
    limit: 6,
    windowSec: 60,
  });
  if (limited) return limited;

  let body: WeeklyLetterRequest;
  try {
    body = (await req.json()) as WeeklyLetterRequest;
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const sessions = Math.max(0, Math.round(body.sessions ?? 0));
  const minutes = Math.max(0, Math.round(body.minutes ?? 0));
  const errata = Math.max(0, Math.round(body.errata ?? 0));
  const mastered = Math.max(0, Math.round(body.mastered ?? 0));
  const streak = Math.max(0, Math.round(body.streak ?? 0));
  const accuracy = body.accuracy ? `${body.accuracy}%` : "brak danych";

  const facts = [
    `Sesje w tym tygodniu: ${sessions}`,
    `Łączny czas nauki: ${minutes} min`,
    `Średnia trafność: ${accuracy}`,
    `Aktywne wpisy w erracie: ${errata}`,
    `Opanowane karty łącznie: ${mastered}`,
    `Bieżąca passa: ${streak} dni`,
  ].join("\n");

  const client = getAnthropic();
  try {
    const response = await client.messages.create({
      model: MODEL_GRADE,
      max_tokens: 320,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Liczby minionego tygodnia:\n${facts}\n\nNapisz list.`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "Brak odpowiedzi modelu." }, { status: 502 });
    }
    return NextResponse.json({ letter: textBlock.text.trim() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("weekly-letter failed", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
