import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("Brak ANTHROPIC_API_KEY w .env.local");
    }
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export const MODEL_GENERATE_META = "claude-sonnet-4-6";
export const MODEL_GENERATE_QUESTIONS = "claude-haiku-4-5";
export const MODEL_GRADE = "claude-haiku-4-5";
