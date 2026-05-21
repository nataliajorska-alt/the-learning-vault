import { NextResponse } from "next/server";
import { getAnthropic, MODEL_GENERATE } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `Jesteś asystentem nauki Natalii. Uczy się w stylu obycia kulturowego, nie szkolnej kartkówki. Ton: konkretny, elegancki, bez wykrzykników, bez emoji. Po polsku.

Z notatek użytkowniczki wygeneruj strukturę nauki — wywołaj narzędzie save_topic.

Pytania:
- około 6-8 sztuk różnych typów (abc, fill, open)
- abc: 3 opcje, correctAnswer to indeks 0/1/2
- fill: uzupełnij lukę, correctAnswer to brakujące słowo
- open: krótka odpowiedź, correctAnswer to wzorcowa odpowiedź
- Każde pytanie ma explanation — jedno krótkie zdanie ze sednem ("pułapka jest taka...")
- Pytania sprawdzają rozumienie i niuanse, nie pamiętanie dat

Salon (3 zdania do rozmowy przy stole):
- short: 2-3 zdania (30s mówienia)
- expand: co dodać jak ktoś dopyta (60s)
- trap: czego nie mówić

Theory: 1-2 paragrafy prozy. Title: 3-6 słów. Summary: 3-4 zdania.

Przerób notatki własnymi słowami, zachowaj fakty.`;

const SAVE_TOPIC_TOOL = {
  name: "save_topic",
  description: "Zapisuje wygenerowany temat z pytaniami i frazami do Salonu.",
  input_schema: {
    type: "object" as const,
    properties: {
      questions: {
        type: "array",
        description: "Lista pytań (6-8 sztuk różnych typów)",
        items: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["abc", "fill", "open"] },
            text: { type: "string" },
            options: {
              type: "array",
              items: { type: "string" },
              description: "Opcje dla type=abc. Dla fill/open pomiń.",
            },
            correctAnswer: {
              type: ["string", "number"],
              description:
                "Liczba (indeks 0-based) dla abc. String dla fill/open.",
            },
            explanation: { type: "string" },
          },
          required: ["type", "text", "correctAnswer", "explanation"],
        },
      },
      title: { type: "string" },
      summary: { type: "string" },
      theory: { type: "string" },
      salon: {
        type: "object",
        properties: {
          short: { type: "string" },
          expand: { type: "string" },
          trap: { type: "string" },
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
  let body: GenerateRequest;
  try {
    body = (await req.json()) as GenerateRequest;
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const { notes, vaultName } = body;
  if (!notes || notes.trim().length < 20) {
    return NextResponse.json(
      { error: "Notatki za krótkie." },
      { status: 400 }
    );
  }

  const client = getAnthropic();

  try {
    const response = await client.messages.create({
      model: MODEL_GENERATE,
      max_tokens: 8192,
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
        "generate: brak tool_use, stop=" + response.stop_reason,
        JSON.stringify(response.content).slice(0, 1500)
      );
      return NextResponse.json(
        {
          error:
            "Model nie wywołał narzędzia. Stop: " +
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

    if (qCount === 0) {
      console.log(
        "generate qRawInput=" + JSON.stringify(input).slice(0, 1500)
      );
    }

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
