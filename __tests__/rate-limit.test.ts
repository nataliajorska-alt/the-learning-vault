import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { checkRateLimit, clientKey } from "@/lib/rate-limit";

describe("clientKey", () => {
  it("używa uid, gdy jest", () => {
    const req = new Request("https://x.test", {
      headers: { "x-forwarded-for": "1.2.3.4" },
    });
    expect(clientKey(req, "abc", "generate")).toBe("generate:uid:abc");
  });

  it("bez uid bierze pierwsze IP z x-forwarded-for", () => {
    const req = new Request("https://x.test", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(clientKey(req, null, "grade")).toBe("grade:ip:1.2.3.4");
  });

  it("bez uid i bez nagłówków IP → 'unknown'", () => {
    const req = new Request("https://x.test");
    expect(clientKey(req, null, "grade")).toBe("grade:ip:unknown");
  });
});

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("przepuszcza do limitu, potem 429", () => {
    const key = "test:block:" + Math.random();
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit(key, { limit: 3, windowSec: 60 })).toBeNull();
    }
    const blocked = checkRateLimit(key, { limit: 3, windowSec: 60 });
    expect(blocked).not.toBeNull();
    expect(blocked!.status).toBe(429);
  });

  it("ustawia nagłówek Retry-After przy blokadzie", () => {
    const key = "test:retry:" + Math.random();
    checkRateLimit(key, { limit: 1, windowSec: 60 });
    const blocked = checkRateLimit(key, { limit: 1, windowSec: 60 });
    expect(blocked).not.toBeNull();
    expect(blocked!.headers.get("Retry-After")).toBeTruthy();
  });

  it("resetuje się po upływie okna", () => {
    const key = "test:reset:" + Math.random();
    expect(checkRateLimit(key, { limit: 1, windowSec: 60 })).toBeNull();
    expect(checkRateLimit(key, { limit: 1, windowSec: 60 })).not.toBeNull();
    vi.advanceTimersByTime(61_000);
    expect(checkRateLimit(key, { limit: 1, windowSec: 60 })).toBeNull();
  });

  it("różne klucze mają niezależne liczniki", () => {
    const a = "test:a:" + Math.random();
    const b = "test:b:" + Math.random();
    expect(checkRateLimit(a, { limit: 1, windowSec: 60 })).toBeNull();
    expect(checkRateLimit(a, { limit: 1, windowSec: 60 })).not.toBeNull();
    expect(checkRateLimit(b, { limit: 1, windowSec: 60 })).toBeNull();
  });
});
