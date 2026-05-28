export type SessionPhase = "theory" | "test" | "review";
export type SessionMode = "mix" | "errors" | "vault" | "topic";

export interface SessionAttempt {
  questionId: string;
  correct: boolean;
  answer: string;
}

export interface SavedSession {
  v: 1;
  uid: string;
  sessionId: string;
  topicId: string;
  mode: SessionMode;
  vaultSlug: string | null;
  phase: SessionPhase;
  idx: number;
  attempts: SessionAttempt[];
  sessionStartMs: number;
  testStartMs: number | null;
  testEndMs: number | null;
  korektaStartMs: number | null;
  savedAt: number;
}

export interface SessionRoute {
  topicId: string | null;
  mode: SessionMode;
  vaultSlug: string | null;
}

const STORAGE_VERSION = 1 as const;

/** Sesja starsza niż to jest traktowana jako porzucona — nie wznawiamy jej. */
export const RESUME_TTL_MS = 6 * 60 * 60 * 1000;

function keyFor(uid: string): string {
  return `lv:active-session:${uid}`;
}

export function loadSavedSession(uid: string): SavedSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(keyFor(uid));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedSession;
    if (parsed?.v !== STORAGE_VERSION || parsed.uid !== uid) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(s: SavedSession): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(keyFor(s.uid), JSON.stringify(s));
  } catch {
    // brak miejsca / tryb prywatny — persystencja jest best-effort
  }
}

export function clearSavedSession(uid: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(keyFor(uid));
  } catch {
    // ignore
  }
}

/** Czy zapisaną sesję wolno wznowić na bieżącej trasie: ten sam tryb i temat,
 *  świeższa niż TTL. Chroni przed wskoczeniem starej sesji w nowo rozpoczętą. */
export function isResumable(
  saved: SavedSession | null,
  route: SessionRoute,
  now: number = Date.now()
): saved is SavedSession {
  if (!saved) return false;
  if (now - saved.savedAt > RESUME_TTL_MS) return false;
  if (saved.mode !== route.mode) return false;
  if (route.topicId) return saved.topicId === route.topicId;
  if (route.mode === "vault") return saved.vaultSlug === (route.vaultSlug ?? null);
  return true;
}
