import { NextResponse } from "next/server";
import { getAnthropic, MODEL_GENERATE } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `Jesteś asystentem nauki Natalii. Ona uczy się w stylu obycia kulturowego, nie szkolnej kartkówki. Cel: rozumienie, nie pamięciówka. Ton: konkretny, elegancki, bez infantylizacji, bez wykrzykników, bez emoji. Po polsku.

Z notatek użytkowniczki wygeneruj strukturę nauki. Odpowiedz WYŁĄCZNIE jednym valid JSON object — bez markdown fences, bez tekstu wokół, bez komentarzy.

Schemat:
{
  "title": "krótki tytuł tematu, 3-6 słów",
  "summary": "3-4 zdania podsumowania w stylu eleganckim",
  "theory": "1-2 paragrafy treści teoretycznej, proza, bez bullet points jeśli nie konieczne",
  "questions": [
    { "type": "abc", "text": "...", "options": ["A","B","C"], "correctAnswer": 0, "explanation": "..." },
    { "type": "fill", "text": "_____ ...", "options": null, "correctAnswer": "wyraz", "explanation": "..." },
    { "type": "open", "text": "...", "options": null, "correctAnswer": "wzorcowa odpowiedź", "explanation": "..." },
    { "type": "spot_error", "text": "zdanie z błędem", "options": ["element 1","element 2","element 3","wszystko OK"], "correctAnswer": 0, "explanation": "..." }
  ],
  "salon": {
    "short": "2-3 zdania, 30s mówienia, co powiedzieć przy stole",
    "expand": "60s, co dodać jak ktoś dopyta",
    "trap": "czego nie mówić, w co nie wchodzić"
  }
}

Wymagania:
- DOKŁADNIE 8 pytań: 3 ABC, 2 fill, 2 open, 1 spot_error
- "correctAnswer" dla ABC/spot_error: indeks 0-based z "options"
- "correctAnswer" dla fill/open: string
- "explanation": jedno krótkie zdanie, najlepiej "pułapka jest taka..."
- Nie powtarzaj treści z notatek dosłownie — przerób na własne sformułowania, ale zachowaj fakty.
- Jeśli notatki są zbyt skąpe na 8 pytań, wygeneruj mniej, ale zachowaj proporcje typów.`;

interface GenerateRequest {
  notes: string;
  vaultName: string;
}

export async function POST(req: Request) {
  let body: GenerateRequest;
  try {
    body = (await req.json()) as GenerateRequest;
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const { notes, vaultName } = body;
  if (!notes || notes.trim().length < 20) {
    return NextResponse.json(
      { error: "Notatki za krótkie. Wklej co najmniej kilka zdań." },
      { status: 400 }
    );
  }

  const client = getAnthropic();

  try {
    const response = await client.messages.create({
      model: MODEL_GENERATE,
      max_tokens: 4096,
      thinking: { type: "adaptive" },
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
          content: `Sekcja: ${vaultName}\n\nNotatki:\n${notes}`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "Model nie zwrócił tekstu." },
        { status: 502 }
      );
    }

    const parsed = extractJson(textBlock.text);
    if (!parsed) {
      return NextResponse.json(
        { error: "Nie udało się sparsować JSON-a od modelu.", raw: textBlock.text },
        { status: 502 }
      );
    }

    return NextResponse.json({
      suggestion: parsed,
      usage: response.usage,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("generate failed", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (fenced ? fenced[1] : text).trim();
  try {
    return JSON.parse(raw);
  } catch {
    // Try to find first { and last } in case there's prose around
    const first = raw.indexOf("{");
    const last = raw.lastIndexOf("}");
    if (first === -1 || last === -1) return null;
    try {
      return JSON.parse(raw.slice(first, last + 1));
    } catch {
      return null;
    }
  }
}
