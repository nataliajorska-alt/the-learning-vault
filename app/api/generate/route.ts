import { NextResponse } from "next/server";
import { getAnthropic, MODEL_GENERATE } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `Jesteś asystentem nauki Natalii. Ona uczy się w stylu obycia kulturowego, nie szkolnej kartkówki. Cel: rozumienie, nie pamięciówka. Ton: konkretny, elegancki, bez infantylizacji, bez wykrzykników, bez emoji. Po polsku.

Z notatek użytkowniczki wygeneruj strukturę nauki. Wywołaj narzędzie save_topic z odpowiednimi argumentami.

WAŻNE — questions ARRAY MUSI zawierać DOKŁADNIE 8 obiektów-pytań. Nigdy nie zwracaj pustego array. To najważniejsze pole w odpowiedzi.

Wymagania pytań:
- DOKŁADNIE 8 pytań w array: 3 ABC, 2 fill, 2 open, 1 spot_error
- Dla typu "abc" i "spot_error": pole correctAnswer = liczba (indeks 0-based z options). Pole options = lista 3-4 stringów
- Dla typu "fill" i "open": pole correctAnswer = string (wzorcowa odpowiedź). Pole options = null lub pominięte
- W spot_error opcje to fragmenty zdania + ostatnia opcja "wszystko OK"
- "explanation": jedno krótkie zdanie, najlepiej w stylu "pułapka jest taka..."

Inne pola:
- title: 3-6 słów
- summary: 3-4 zdania, krótkie
- theory: 1-2 paragrafy, ale POMIŃ jeśli musisz wybrać między teorią a pytaniami — pytania ważniejsze
- salon.short: 2-3 zdania (30s), salon.expand: 60s, salon.trap: czego nie mówić

Nie powtarzaj treści z notatek dosłownie — przerób na własne sformułowania, ale zachowaj fakty.`;

const SAVE_TOPIC_TOOL = {
  name: "save_topic",
  description:
    "Zapisuje wygenerowany temat nauki. WAŻNE: questions array musi mieć dokładnie 8 obiektów, nigdy pusty.",
  input_schema: {
    type: "object" as const,
    properties: {
      // questions umieszczone PIERWSZE — żeby model wypełnił najważniejsze pole
      // zanim ewentualnie ucznie się max_tokens
      questions: {
        type: "array",
        minItems: 8,
        maxItems: 8,
        description:
          "DOKŁADNIE 8 obiektów-pytań. 3 ABC, 2 fill, 2 open, 1 spot_error. Nigdy pusty array.",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["abc", "fill", "open", "spot_error"],
            },
            text: { type: "string" },
            options: {
              type: "array",
              items: { type: "string" },
              description:
                "Lista opcji dla ABC i spot_error. Dla fill/open pomiń to pole.",
            },
            correctAnswer: {
              type: ["string", "number"],
              description:
                "Liczba (indeks 0-based) dla ABC/spot_error. String dla fill/open.",
            },
            explanation: { type: "string" },
          },
          required: ["type", "text", "correctAnswer", "explanation"],
        },
      },
      title: {
        type: "string",
        description: "Krótki tytuł tematu, 3-6 słów",
      },
      summary: {
        type: "string",
        description: "3-4 zdania podsumowania w stylu eleganckim",
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
      theory: {
        type: "string",
        description: "1-2 paragrafy treści teoretycznej, proza",
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
    if (qCount > 0 && Array.isArray(input.questions)) {
      const firstQ = input.questions[0] as Record<string, unknown>;
      console.log("generate firstQ=" + JSON.stringify(firstQ).slice(0, 400));
    }

    return NextResponse.json({
      suggestion: toolUse.input,
      usage: response.usage,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("generate failed", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
