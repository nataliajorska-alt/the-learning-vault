import { describe, it, expect } from "vitest";
import {
  computeStreakUpdate,
  computeStreakUpdateWithGrace,
  createsErrorEntry,
  effectiveStreakWithGrace,
  graceAvailable,
  isSameLocalDay,
  nextMilestone,
  reachedMilestone,
  REHAB_THRESHOLD,
  rehabError,
  streakChapter,
  streakStillValid,
} from "@/lib/streak";

const d = (s: string) => new Date(s);

describe("isSameLocalDay", () => {
  it("ta sama data, różne godziny → true", () => {
    expect(isSameLocalDay(d("2026-05-28T07:00:00"), d("2026-05-28T23:30:00"))).toBe(true);
  });
  it("różne dni → false", () => {
    expect(isSameLocalDay(d("2026-05-28T23:59:00"), d("2026-05-29T00:01:00"))).toBe(false);
  });
});

describe("computeStreakUpdate", () => {
  it("uczyła się już dziś (passa > 0) → bez zmian", () => {
    const r = computeStreakUpdate(d("2026-05-28T08:00:00"), d("2026-05-28T20:00:00"), 5);
    expect(r).toEqual({ alreadyToday: true, newStreak: 5 });
  });

  it("ostatnia nauka wczoraj → passa +1", () => {
    const r = computeStreakUpdate(d("2026-05-27T20:00:00"), d("2026-05-28T08:00:00"), 5);
    expect(r).toEqual({ alreadyToday: false, newStreak: 6 });
  });

  it("przerwa dłuższa niż dzień → reset do 1", () => {
    const r = computeStreakUpdate(d("2026-05-25T20:00:00"), d("2026-05-28T08:00:00"), 9);
    expect(r).toEqual({ alreadyToday: false, newStreak: 1 });
  });

  it("pierwsza sesja od zera → 1", () => {
    const r = computeStreakUpdate(d("1970-01-01T00:00:00"), d("2026-05-28T08:00:00"), 0);
    expect(r).toEqual({ alreadyToday: false, newStreak: 1 });
  });

  it("ten sam dzień, ale passa = 0 → liczy jak nowy dzień (1), nie 'alreadyToday'", () => {
    // streak=0 nie spełnia warunku 'już dziś', więc spada do gałęzi resetu;
    // ten sam dzień nie jest 'wczoraj', więc newStreak = 1.
    const r = computeStreakUpdate(d("2026-05-28T08:00:00"), d("2026-05-28T20:00:00"), 0);
    expect(r).toEqual({ alreadyToday: false, newStreak: 1 });
  });

  it("przejście przez koniec miesiąca liczy się jako 'wczoraj'", () => {
    const r = computeStreakUpdate(d("2026-04-30T22:00:00"), d("2026-05-01T07:00:00"), 3);
    expect(r).toEqual({ alreadyToday: false, newStreak: 4 });
  });
});

describe("streakStillValid", () => {
  const now = d("2026-05-28T12:00:00");

  it("nauka dziś → passa obowiązuje", () => {
    expect(streakStillValid(d("2026-05-28T06:00:00"), 7, now)).toBe(7);
  });
  it("nauka wczoraj → passa wciąż obowiązuje", () => {
    expect(streakStillValid(d("2026-05-27T23:00:00"), 7, now)).toBe(7);
  });
  it("pominięty dzień → efektywna passa 0", () => {
    expect(streakStillValid(d("2026-05-26T23:00:00"), 7, now)).toBe(0);
  });
  it("passa 0 → 0", () => {
    expect(streakStillValid(d("2026-05-28T06:00:00"), 0, now)).toBe(0);
  });
  it("brak daty ostatniej nauki → 0", () => {
    expect(streakStillValid(null, 7, now)).toBe(0);
  });
});

describe("rehabError", () => {
  it("partial jest neutralny → null (bez zmian)", () => {
    expect(rehabError({ correctStreak: 2 }, "partial")).toBeNull();
  });

  it("błąd zeruje passę poprawnych i trzyma status active", () => {
    expect(rehabError({ correctStreak: 2 }, "wrong")).toEqual({
      correctStreak: 0,
      status: "active",
    });
  });

  it("poprawna podbija passę, ale poniżej progu zostaje active", () => {
    expect(rehabError({ correctStreak: 0 }, "correct")).toEqual({
      correctStreak: 1,
      status: "active",
    });
    expect(rehabError({ correctStreak: 1 }, "correct")).toEqual({
      correctStreak: 2,
      status: "active",
    });
  });

  it("trzecia poprawna z rzędu rehabilituje błąd", () => {
    expect(rehabError({ correctStreak: 2 }, "correct")).toEqual({
      correctStreak: REHAB_THRESHOLD,
      status: "rehabilitated",
    });
  });

  it("pełna ścieżka: 2 poprawne, błąd resetuje, znów trzy do rehabilitacji", () => {
    let cur = { correctStreak: 0 };
    cur = rehabError(cur, "correct")!; // 1, active
    cur = rehabError(cur, "correct")!; // 2, active
    const broke = rehabError(cur, "wrong")!; // 0, active
    expect(broke).toEqual({ correctStreak: 0, status: "active" });
    let c = { correctStreak: broke.correctStreak };
    c = rehabError(c, "correct")!; // 1
    c = rehabError(c, "correct")!; // 2
    const out = rehabError(c, "correct")!; // 3 → rehab
    expect(out).toEqual({ correctStreak: 3, status: "rehabilitated" });
  });
});

describe("graceAvailable (urlop dziekański)", () => {
  const now = d("2026-05-28T12:00:00");
  it("nigdy nieużyty → dostępny", () => {
    expect(graceAvailable(null, now)).toBe(true);
  });
  it("użyty 7 dni temu → znów dostępny", () => {
    expect(graceAvailable(d("2026-05-21T12:00:00"), now)).toBe(true);
  });
  it("użyty 3 dni temu → niedostępny", () => {
    expect(graceAvailable(d("2026-05-25T12:00:00"), now)).toBe(false);
  });
});

describe("effectiveStreakWithGrace", () => {
  const now = d("2026-05-28T12:00:00");
  it("nauka wczoraj → passa stoi (bez urlopu)", () => {
    expect(effectiveStreakWithGrace(d("2026-05-27T20:00:00"), 7, null, now)).toBe(7);
  });
  it("jeden pominięty dzień + urlop dostępny → passa stoi", () => {
    expect(effectiveStreakWithGrace(d("2026-05-26T20:00:00"), 7, null, now)).toBe(7);
  });
  it("jeden pominięty dzień, ale urlop zużyty niedawno → 0", () => {
    expect(
      effectiveStreakWithGrace(d("2026-05-26T20:00:00"), 7, d("2026-05-24T12:00:00"), now)
    ).toBe(0);
  });
  it("dwa pominięte dni → 0 nawet z urlopem", () => {
    expect(effectiveStreakWithGrace(d("2026-05-25T20:00:00"), 7, null, now)).toBe(0);
  });
});

describe("computeStreakUpdateWithGrace", () => {
  it("wczoraj → +1, bez zużycia urlopu", () => {
    const r = computeStreakUpdateWithGrace(d("2026-05-27T20:00:00"), d("2026-05-28T08:00:00"), 5, null);
    expect(r).toEqual({ alreadyToday: false, newStreak: 6, graceUsed: false });
  });
  it("jeden pominięty dzień + urlop → +1, urlop zużyty", () => {
    const r = computeStreakUpdateWithGrace(d("2026-05-26T20:00:00"), d("2026-05-28T08:00:00"), 5, null);
    expect(r).toEqual({ alreadyToday: false, newStreak: 6, graceUsed: true });
  });
  it("jeden pominięty dzień, urlop zużyty → reset do 1", () => {
    const r = computeStreakUpdateWithGrace(
      d("2026-05-26T20:00:00"), d("2026-05-28T08:00:00"), 5, d("2026-05-24T12:00:00")
    );
    expect(r).toEqual({ alreadyToday: false, newStreak: 1, graceUsed: false });
  });
  it("ten sam dzień → bez zmian", () => {
    const r = computeStreakUpdateWithGrace(d("2026-05-28T08:00:00"), d("2026-05-28T20:00:00"), 5, null);
    expect(r).toEqual({ alreadyToday: true, newStreak: 5, graceUsed: false });
  });
});

describe("kamienie milowe", () => {
  it("reachedMilestone tylko dla dokładnych progów", () => {
    expect(reachedMilestone(7)).toBe(7);
    expect(reachedMilestone(30)).toBe(30);
    expect(reachedMilestone(8)).toBeNull();
  });
  it("nextMilestone zwraca najbliższy próg przed nami", () => {
    expect(nextMilestone(0)).toBe(7);
    expect(nextMilestone(7)).toBe(30);
    expect(nextMilestone(365)).toBeNull();
  });
  it("streakChapter liczy zdobyte kamienie", () => {
    expect(streakChapter(3)).toBe(0);
    expect(streakChapter(7)).toBe(1);
    expect(streakChapter(30)).toBe(2);
    expect(streakChapter(100)).toBe(3);
  });
});

describe("createsErrorEntry", () => {
  it("tylko twardy błąd tworzy nowy wpis", () => {
    expect(createsErrorEntry("wrong")).toBe(true);
    expect(createsErrorEntry("correct")).toBe(false);
    expect(createsErrorEntry("partial")).toBe(false);
  });
});
