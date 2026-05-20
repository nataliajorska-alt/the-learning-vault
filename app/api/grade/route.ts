import { NextResponse } from "next/server";
import { getAnthropic, MODEL_GRADE } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `Oceń odpowiedź użytkowniczki na pytanie. Bądź wymagająca, ale fair.

Skala:
- "correct": odpowiedź zawiera sedno wzorca, własnymi słowami też akceptujemy
- "partial": kierunek dobry, ale czegoś brakuje albo coś dodała źle
- "wrong": minęła się z tematem albo podała nieprawdę

Ton: konkretnie, bez "świetnie!", bez wykrzykników, bez emoji. Po polsku. Max 2 zdania feedbacku.

Odpowiedz WYŁĄCZNIE valid JSON: { "verdict": "correct" | "partial" | "wrong", "feedback": "..." }`;

interface GradeRequest {
  question: string;
  modelAnswer: string;
  userAnswer: string;
}

export async function POST(req: Request) {
  let body: GradeRequest;
  try {
    body = (await req.json()) as GradeRequest;
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const { question, modelAnswer, userAnswer } = body;
  if (!question || !modelAnswer) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const trimmed = (userAnswer ?? "").trim();
  if (trimmed.length === 0) {
    return NextResponse.json({
      verdict: "wrong",
      feedback: "Brak odpowiedzi.",
    });
  }

  const client = getAnthropic();

  try {
    const response = await client.messages.create({
      model: MODEL_GRADE,
      max_tokens: 256,
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
          content: `Pytanie: ${question}\nWzorcowa odpowiedź: ${modelAnswer}\nOdpowiedź użytkowniczki: ${trimmed}`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "Brak tekstu" }, { status: 502 });
    }

    const parsed = extractJson(textBlock.text);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("verdict" in parsed) ||
      !("feedback" in parsed)
    ) {
      return NextResponse.json(
        { error: "Nieparsowalna odpowiedź", raw: textBlock.text },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("grade failed", err);
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
