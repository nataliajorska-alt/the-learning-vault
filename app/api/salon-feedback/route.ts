import { NextResponse } from "next/server";
import { getAnthropic, MODEL_GRADE } from "@/lib/anthropic";
import { requireAuth } from "@/lib/api-auth";
import { checkRateLimit, clientKey } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `Jesteś koneserem rozmowy salonowej. Natalia ćwiczy wypowiedź na temat — kilka zdań, które mogłaby powiedzieć przy stole, żeby zabłysnąć obyciem. To nie egzamin z faktów, tylko ocena FINEZJI tego, jak to ujęła.

Dostajesz materiał referencyjny: jak brzmi dobra wersja krótka, co można dodać dla rozwinięcia, oraz pułapkę, w którą łatwo wpaść. Użyj go jako punktu odniesienia, nie wzorca do przepisania.

W odpowiedzi zmieść trzy rzeczy, płynnie, bez wypunktowania:
1. co w jej wersji zabrzmiało dobrze,
2. jedną konkretną rzecz do dopracowania dla większej finezji,
3. czy uniknęła pułapki (jeśli w nią wpadła — wskaż delikatnie).

Ton: konkretny, elegancki, bez wykrzykników, bez emoji, bez "świetnie". Po polsku. 2-4 zdania. Nie chwal pusto — zawsze wskaż jedną rzecz do poprawy.`;

interface SalonFeedbackRequest {
  topic: string;
  reference: { short: string; expand: string; trap: string };
  attempt: string;
}

export async function POST(req: Request) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  const limited = checkRateLimit(clientKey(req, auth.uid, "salon"), {
    limit: 20,
    windowSec: 60,
  });
  if (limited) return limited;

  let body: SalonFeedbackRequest;
  try {
    body = (await req.json()) as SalonFeedbackRequest;
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const attempt = (body.attempt ?? "").trim();
  if (attempt.length < 10) {
    return NextResponse.json(
      { error: "Powiedz coś więcej — przynajmniej zdanie." },
      { status: 400 }
    );
  }

  const ref = body.reference ?? { short: "", expand: "", trap: "" };
  const client = getAnthropic();

  try {
    const response = await client.messages.create({
      model: MODEL_GRADE,
      max_tokens: 400,
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
          content: `Temat: ${body.topic}\n\nReferencja:\n- Krótko: ${ref.short}\n- Rozwinięcie: ${ref.expand}\n- Pułapka: ${ref.trap}\n\nWersja Natalii:\n${attempt}`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "Brak odpowiedzi modelu." }, { status: 502 });
    }
    return NextResponse.json({ feedback: textBlock.text.trim() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("salon-feedback failed", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
