import { NextResponse } from "next/server";
import { getAnthropic, MODEL_GRADE } from "@/lib/anthropic";
import { requireAuth } from "@/lib/api-auth";
import { checkRateLimit, clientKey } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `Wyjaśnij Natalii, dlaczego jej odpowiedź była błędna. To ma być mikro-korekta w aplikacji do nauki, nie wykład.

Zasady:
- po polsku
- max 2 zdania
- konkretnie: nazwij pułapkę albo brakujący element
- bez "świetnie", bez wykrzykników, bez emoji
- ton elegancki, wymagający, ale spokojny

Odpowiedz WYŁĄCZNIE valid JSON: { "feedback": "..." }`;

interface WrongNoteRequest {
  question: string;
  questionType: string;
  modelAnswer: string;
  userAnswer: string;
  explanation: string;
  skill?: string;
}

export async function POST(req: Request) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  const limited = checkRateLimit(clientKey(req, auth.uid, "wrong-note"), {
    limit: 30,
    windowSec: 60,
  });
  if (limited) return limited;

  let body: WrongNoteRequest;
  try {
    body = (await req.json()) as WrongNoteRequest;
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  if (!body.question || !body.modelAnswer || !body.explanation) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const client = getAnthropic();

  try {
    const response = await client.messages.create({
      model: MODEL_GRADE,
      max_tokens: 220,
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
          content:
            `Pytanie: ${body.question}\n` +
            `Typ: ${body.questionType}\n` +
            `Skill: ${body.skill ?? "brak"}\n` +
            `Poprawna odpowiedź: ${body.modelAnswer}\n` +
            `Odpowiedź Natalii: ${(body.userAnswer ?? "").trim() || "(brak)"}\n` +
            `Wyjaśnienie w bazie: ${body.explanation}`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "Brak tekstu" }, { status: 502 });
    }

    const parsed = extractJson(textBlock.text);
    if (!parsed || typeof parsed !== "object" || !("feedback" in parsed)) {
      return NextResponse.json(
        { error: "Nieparsowalna odpowiedź", raw: textBlock.text },
        { status: 502 }
      );
    }

    const feedback = String((parsed as { feedback: unknown }).feedback ?? "").trim();
    return NextResponse.json({ feedback });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("wrong-note failed", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (fenced ? fenced[1] : text).trim();
  try {
    return JSON.parse(raw);
  } catch {
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
