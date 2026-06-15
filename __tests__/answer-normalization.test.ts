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

  it("treats numerically-equal answers as a match despite separator/decimal formatting", () => {
    expect(answersMatch("1,000", "1000")).toBe(true);
    expect(answersMatch("1000", "1,000")).toBe(true);
    expect(answersMatch("1 000", "1000")).toBe(true);
    expect(answersMatch("5.0", "5")).toBe(true);
    expect(answersMatch("2,5", "2.5")).toBe(true);
    expect(answersMatch("10,50", "10.5")).toBe(true);
    expect(answersMatch("1,234.56", "1234.56")).toBe(true);
    expect(answersMatch("1.234,56", "1234.56")).toBe(true);
  });

  it("does not over-accept: genuinely different numbers stay wrong", () => {
    expect(answersMatch("5", "6")).toBe(false);
    expect(answersMatch("100", "1000")).toBe(false);
    expect(answersMatch("?", "5")).toBe(false);
    expect(answersMatch("", "5")).toBe(false);
  });
});
