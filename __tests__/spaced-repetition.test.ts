import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { applySrs } from "@/lib/spaced-repetition";
import type { Topic } from "@/lib/types";

/** Buduje Topic z minimalnymi polami, które czyta applySrs. */
function topic(over: Partial<Topic> = {}): Topic {
  return {
    interval: 0,
    ease: 2.5,
    correctStreak: 0,
    totalAttempts: 0,
    totalCorrect: 0,
    ...over,
  } as Topic;
}

describe("applySrs — correct", () => {
  it("ze świeżej karty: streak→1, interval→1, ease rośnie o 0.1", () => {
    const r = applySrs(topic(), "correct");
    expect(r.correctStreak).toBe(1);
    expect(r.interval).toBe(1);
    expect(r.ease).toBeCloseTo(2.6, 5);
    expect(r.status).toBe("due");
  });

  it("progresja interwału: 1 → 3 → 7", () => {
    expect(applySrs(topic({ correctStreak: 0 }), "correct").interval).toBe(1);
    expect(applySrs(topic({ correctStreak: 1 }), "correct").interval).toBe(3);
    expect(applySrs(topic({ correctStreak: 2 }), "correct").interval).toBe(7);
  });

  it("po 3. streaku interwał = round(interval * ease)", () => {
    const r = applySrs(topic({ correctStreak: 3, interval: 7, ease: 2.5 }), "correct");
    expect(r.correctStreak).toBe(4);
    expect(r.interval).toBe(Math.round(7 * 2.5)); // 18
  });

  it("ease jest ograniczone do 3.0", () => {
    expect(applySrs(topic({ ease: 2.95 }), "correct").ease).toBe(3.0);
  });

  it("mastered przy streak ≥ 4 i interval ≥ 30", () => {
    const r = applySrs(topic({ correctStreak: 3, interval: 15, ease: 2.5 }), "correct");
    expect(r.correctStreak).toBe(4);
    expect(r.interval).toBeGreaterThanOrEqual(30); // round(15*2.5)=38
    expect(r.status).toBe("mastered");
  });
});

describe("applySrs — wrong", () => {
  it("zeruje streak, interval→1, ease spada o 0.2", () => {
    const r = applySrs(topic({ correctStreak: 5, interval: 30, ease: 2.5 }), "wrong");
    expect(r.correctStreak).toBe(0);
    expect(r.interval).toBe(1);
    expect(r.ease).toBeCloseTo(2.3, 5);
  });

  it("ease nie spada poniżej 1.3", () => {
    expect(applySrs(topic({ ease: 1.4 }), "wrong").ease).toBe(1.3);
  });

  it("struggling przy ≥4 próbach i >50% błędów", () => {
    const r = applySrs(topic({ totalAttempts: 3, totalCorrect: 1 }), "wrong");
    // po próbie: 4 prób, 1 trafna → wrongRatio 0.75
    expect(r.status).toBe("struggling");
  });
});

describe("applySrs — partial (łagodnie)", () => {
  it("nie zmienia ease ani streaku, interval→2", () => {
    const r = applySrs(topic({ correctStreak: 2, ease: 2.5, interval: 7 }), "partial");
    expect(r.correctStreak).toBe(2);
    expect(r.ease).toBe(2.5);
    expect(r.interval).toBe(2);
  });

  it("nie awansuje do mastered nawet przy wysokim streaku/interwale", () => {
    const r = applySrs(topic({ correctStreak: 10, interval: 60, ease: 3.0 }), "partial");
    expect(r.status).not.toBe("mastered");
  });

  it("liczy się jako zaliczenie — nie wpada w struggling", () => {
    // 3 dotychczasowe próby, 1 trafna; partial dolicza się jako trafna → ratio 0.5, nie >0.5
    const r = applySrs(topic({ totalAttempts: 3, totalCorrect: 1 }), "partial");
    expect(r.status).not.toBe("struggling");
  });
});

describe("applySrs — nextReview", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T12:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("nextReview = teraz + interval dni", () => {
    const r = applySrs(topic({ correctStreak: 1 }), "correct"); // interval 3
    const days = Math.round((r.nextReview.getTime() - Date.now()) / 86_400_000);
    expect(days).toBe(3);
  });
});
