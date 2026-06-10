import { describe, expect, it } from "vitest";
import { answersMatch, normalizeAnswer } from "@/lib/answer-normalization";

describe("answer normalization", () => {
  it("ignores case, punctuation, repeated spaces and diacritics", () => {
    expect(normalizeAnswer("  Regresé  a casa.  ")).toBe("regrese a casa");
    expect(answersMatch("Regresé a casa.", "regrese a casa")).toBe(true);
  });

  it("normalizes Polish ł consistently for Error Quiz and study sessions", () => {
    expect(answersMatch("Zażółć gęślą jaźń", "zazolc gesla jazn")).toBe(true);
  });
});
