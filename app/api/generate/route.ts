import { NextResponse } from "next/server";
import { getAnthropic, MODEL_GENERATE } from "@/lib/anthropic";
import { requireAuth } from "@/lib/api-auth";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `Jesteś asystentem nauki Natalii. Ona uczy się w stylu obycia kulturowego, nie szkolnej kartkówki. Cel: rozumienie, nie pamięciówka. Ton: konkretny, elegancki, bez infantylizacji, bez wykrzykników, bez emoji. Po polsku.

Z notatek użytkowniczki wygeneruj strukturę nauki. Wywołaj narzędzie save_topic z odpowiednimi argumentami.

Wymagania:
- DOKŁADNIE 8 pytań: 3 ABC, 2 fill, 2 open, 1 spot_error
- Dla typu "abc" i "spot_error": pole correctAnswer = liczba (indeks 0-based z options). Pole options = lista 3-4 stringów
- Dla typu "fill" i "open": pole correctAnswer = string (wzorcowa odpowiedź). Pole options = null
- W spot_error opcje to fragmenty zdania + ostatnia opcja "wszystko OK"
- "explanation": jedno krótkie zdanie, najlepiej w stylu "pułapka jest taka..."
- Nie powtarzaj treści z notatek dosłownie — przerób na własne sformułowania, ale zachowaj fakty
- Salon: short = 2-3 zdania (30s mówienia), expand = co dodać (60s), trap = czego nie mówić`;

const SAVE_TOPIC_TOOL = {
  name: "save_topic",
  description:
    "Zapisuje wygenerowany temat nauki z pytaniami i frazami do Salonu",
  input_schema: {
    type: "object" as const,
    properties: {
      title: {
        type: "string",
        description: "Krótki tytuł tematu, 3-6 słów",
      },
      summary: {
        type: "string",
        description: "3-4 zdania podsumowania w stylu eleganckim",
      },
      theory: {
        type: "string",
        description: "1-2 paragrafy treści teoretycznej, proza",
      },
      questions: {
        type: "array",
        description: "Dokładnie 8 pytań: 3 ABC, 2 fill, 2 open, 1 spot_error",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["abc", "fill", "open", "spot_error"],
            },
            text: { type: "string" },
            options: {
              type: ["array", "null"],
              items: { type: "string" },
              description:
                "Lista opcji dla ABC i spot_error. null dla fill i open.",
            },
            correctAnswer: {
              description:
                "Liczba (indeks 0-based) dla ABC/spot_error. String dla fill/open.",
            },
            explanation: { type: "string" },
          },
          required: ["type", "text", "correctAnswer", "explanation"],
        },
      },
      salon: {
        type: "object",
        properties: {
          short: { type: "string", description: "2-3 zdania, 30s mówienia" },
          expand: { type: "string", description: "60s rozwinięcia" },
          trap: { type: "string", description: "Czego nie mówić" },
        },
        required: ["short", "expand", "trap"],
      },
    },
    required: ["title", "summary", "theory", "questions", "salon"],
  },
};

interface GenerateRequest {
  notes: string;
  vaultName: string;
}

export async function POST(req: Request) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

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
      max_tokens: 16384,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      tools: [SAVE_TOPIC_TOOL],
      tool_choice: { type: "tool", name: "save_topic" },
      messages: [
        {
          role: "user",
          content: `Sekcja: ${vaultName}\n\nNotatki:\n${notes}`,
        },
      ],
    });

    const toolUse = response.content.find((b) => b.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      console.error(
        "generate: brak tool_use w odpowiedzi",
        JSON.stringify(response.content).slice(0, 2000)
      );
      return NextResponse.json(
        {
          error:
            "Model nie wywołał narzędzia. Stop reason: " +
            (response.stop_reason ?? "unknown"),
        },
        { status: 502 }
      );
    }

    const input = toolUse.input as Record<string, unknown>;
    const qCount = Array.isArray(input.questions)
      ? input.questions.length
      : 0;
    console.log("generate qCount=" + qCount);
    console.log("generate stop=" + response.stop_reason);
    console.log("generate outputTokens=" + response.usage.output_tokens);
    console.log("generate inputTokens=" + response.usage.input_tokens);

    return NextResponse.json({
      suggestion: input,
      usage: response.usage,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("generate failed", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
