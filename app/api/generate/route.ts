import { NextResponse } from "next/server";
import { getAnthropic, MODEL_GENERATE } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

// ---- system prompts ------------------------------------------------------

const META_PROMPT = `Jesteś asystentem nauki Natalii. Uczy się w stylu obycia kulturowego, nie szkolnej kartkówki. Ton: konkretny, elegancki, bez wykrzykników, bez emoji. Po polsku.

Z notatek użytkowniczki wygeneruj metadane tematu i frazy do Salonu. Wywołaj save_meta.

Wymagania:
- title: 3-6 słów
- summary: 3-4 zdania w stylu eleganckim
- theory: 1-2 paragrafy treści teoretycznej (proza, bez bullet points)
- salon.short: 2-3 zdania (30 sekund mówienia przy stole)
- salon.expand: 60 sekund rozwinięcia
- salon.trap: czego nie mówić, w co nie wchodzić

Przerób treść notatek na własne sformułowania, ale zachowaj fakty.`;

const QUESTIONS_PROMPT = `Jesteś asystentem nauki Natalii. Uczy się w stylu obycia kulturowego, nie szkolnej kartkówki. Ton: konkretny, elegancki, bez emoji. Po polsku.

Wywołaj save_questions z DOKŁADNIE 8 pytaniami testowymi do notatek:
- 3 pytania typu "abc" (jednokrotny wybór z 3 opcji)
- 2 pytania typu "fill" (uzupełnij lukę)
- 2 pytania typu "open" (krótka odpowiedź otwarta)
- 1 pytanie typu "spot_error" (znajdź błąd w zdaniu)

Zasady:
- Dla abc i spot_error: correctAnswer = liczba (indeks 0-based z options), options = lista stringów (dla spot_error ostatnia opcja "wszystko OK")
- Dla fill i open: correctAnswer = string (wzorcowa odpowiedź), options pomiń
- explanation: jedno krótkie zdanie, najlepiej "pułapka jest taka..."
- Pytania mają sprawdzać ROZUMIENIE i pułapki, nie pamiętanie dat`;

// ---- tool schemas --------------------------------------------------------

const SAVE_META_TOOL = {
  name: "save_meta",
  description: "Zapisuje metadane tematu i frazy do Salonu.",
  input_schema: {
    type: "object" as const,
    properties: {
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
    required: ["title", "summary", "theory", "salon"],
  },
};

const SAVE_QUESTIONS_TOOL = {
  name: "save_questions",
  description:
    "Zapisuje 8 pytań testowych. questions array MUSI zawierać dokładnie 8 obiektów, nigdy pusty.",
  input_schema: {
    type: "object" as const,
    properties: {
      questions: {
        type: "array",
        minItems: 8,
        maxItems: 8,
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
              type: "array",
              items: { type: "string" },
            },
            correctAnswer: {
              type: ["string", "number"],
            },
            explanation: { type: "string" },
          },
          required: ["type", "text", "correctAnswer", "explanation"],
        },
      },
    },
    required: ["questions"],
  },
};

// ---- handler -------------------------------------------------------------

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
  const userContent = `Sekcja: ${vaultName}\n\nNotatki:\n${notes}`;

  try {
    // Parallel calls — meta and questions independently.
    // Each call has smaller scope -> fits in 60s window comfortably.
    const [metaResp, questionsResp] = await Promise.all([
      client.messages.create({
        model: MODEL_GENERATE,
        max_tokens: 4096,
        system: [
          {
            type: "text",
            text: META_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        tools: [SAVE_META_TOOL],
        tool_choice: { type: "tool", name: "save_meta" },
        messages: [{ role: "user", content: userContent }],
      }),
      client.messages.create({
        model: MODEL_GENERATE,
        max_tokens: 8192,
        system: [
          {
            type: "text",
            text: QUESTIONS_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        tools: [SAVE_QUESTIONS_TOOL],
        tool_choice: { type: "tool", name: "save_questions" },
        messages: [{ role: "user", content: userContent }],
      }),
    ]);

    const metaTool = metaResp.content.find((b) => b.type === "tool_use");
    const questionsTool = questionsResp.content.find(
      (b) => b.type === "tool_use"
    );

    if (!metaTool || metaTool.type !== "tool_use") {
      console.error(
        "generate: meta tool_use missing, stop=" + metaResp.stop_reason
      );
      return NextResponse.json(
        { error: "Model nie wygenerował metadanych." },
        { status: 502 }
      );
    }
    if (!questionsTool || questionsTool.type !== "tool_use") {
      console.error(
        "generate: questions tool_use missing, stop=" +
          questionsResp.stop_reason
      );
      return NextResponse.json(
        { error: "Model nie wygenerował pytań." },
        { status: 502 }
      );
    }

    const meta = metaTool.input as Record<string, unknown>;
    const questionsInput = questionsTool.input as Record<string, unknown>;
    const questions = Array.isArray(questionsInput.questions)
      ? questionsInput.questions
      : [];

    console.log("generate qCount=" + questions.length);
    console.log("generate metaStop=" + metaResp.stop_reason);
    console.log("generate qStop=" + questionsResp.stop_reason);
    console.log(
      "generate outputTokens meta=" +
        metaResp.usage.output_tokens +
        " q=" +
        questionsResp.usage.output_tokens
    );

    const suggestion = {
      ...meta,
      questions,
    };

    return NextResponse.json({
      suggestion,
      usage: {
        meta: metaResp.usage,
        questions: questionsResp.usage,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("generate failed", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
