import { describe, it, expect } from "vitest";
import {
  isResumable,
  RESUME_TTL_MS,
  type SavedSession,
  type SessionRoute,
} from "@/lib/session-persistence";

const NOW = 1_700_000_000_000;

function saved(over: Partial<SavedSession> = {}): SavedSession {
  return {
    v: 1,
    uid: "u1",
    sessionId: "s1",
    topicId: "t1",
    mode: "topic",
    vaultSlug: null,
    phase: "test",
    idx: 0,
    attempts: [],
    sessionStartMs: NOW,
    testStartMs: null,
    testEndMs: null,
    korektaStartMs: null,
    questionLimit: null,
    savedAt: NOW,
    ...over,
  };
}

function route(over: Partial<SessionRoute> = {}): SessionRoute {
  return {
    topicId: null,
    mode: "topic",
    vaultSlug: null,
    questionLimit: null,
    ...over,
  };
}

describe("isResumable", () => {
  it("null saved → false", () => {
    expect(isResumable(null, route(), NOW)).toBe(false);
  });

  it("starsza niż TTL → false", () => {
    const s = saved({ savedAt: NOW - RESUME_TTL_MS - 1 });
    expect(isResumable(s, route({ topicId: "t1" }), NOW)).toBe(false);
  });

  it("świeża, ten sam tryb i temat → true", () => {
    expect(
      isResumable(saved({ topicId: "t1" }), route({ topicId: "t1" }), NOW)
    ).toBe(true);
  });

  it("inny tryb → false", () => {
    expect(
      isResumable(saved({ mode: "mix" }), route({ mode: "topic" }), NOW)
    ).toBe(false);
  });

  it("inny questionLimit → false (3 vs null)", () => {
    expect(
      isResumable(
        saved({ mode: "mix", questionLimit: 3 }),
        route({ mode: "mix", questionLimit: null }),
        NOW
      )
    ).toBe(false);
  });

  it("questionLimit undefined ≈ null → true dla mix", () => {
    expect(
      isResumable(
        saved({ mode: "mix", questionLimit: undefined }),
        route({ mode: "mix", questionLimit: null }),
        NOW
      )
    ).toBe(true);
  });

  it("topicId trasy ma pierwszeństwo: niezgodny temat → false", () => {
    expect(
      isResumable(saved({ topicId: "tA" }), route({ topicId: "tB" }), NOW)
    ).toBe(false);
  });

  it("tryb vault: zgodny vaultSlug → true", () => {
    expect(
      isResumable(
        saved({ mode: "vault", vaultSlug: "es" }),
        route({ mode: "vault", vaultSlug: "es" }),
        NOW
      )
    ).toBe(true);
  });

  it("tryb vault: niezgodny vaultSlug → false", () => {
    expect(
      isResumable(
        saved({ mode: "vault", vaultSlug: "es" }),
        route({ mode: "vault", vaultSlug: "econ" }),
        NOW
      )
    ).toBe(false);
  });

  it("mix bez topicId trasy i nie-vault → true (tryb i limit zgodne)", () => {
    expect(isResumable(saved({ mode: "mix" }), route({ mode: "mix" }), NOW)).toBe(
      true
    );
  });
});
