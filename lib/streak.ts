/** Czysta logika passy nauki i rehabilitacji błędów — bez Firestore, żeby dało
 *  się ją testować w izolacji. Warstwa firestore-data tylko ją wywołuje. */

export function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Decyzja o passie przy domknięciu sesji.
 *  - uczyła się już dziś (i passa stoi) → bez zmian
 *  - ostatni dzień nauki to wczoraj → passa +1
 *  - dłuższa przerwa (albo pierwsza sesja) → reset do 1 */
export function computeStreakUpdate(
  lastStudy: Date,
  now: Date,
  currentStreak: number
): { alreadyToday: boolean; newStreak: number } {
  if (isSameLocalDay(lastStudy, now) && currentStreak > 0) {
    return { alreadyToday: true, newStreak: currentStreak };
  }
  const yest = new Date(now);
  yest.setDate(yest.getDate() - 1);
  const wasYesterday = isSameLocalDay(lastStudy, yest);
  return { alreadyToday: false, newStreak: wasYesterday ? currentStreak + 1 : 1 };
}

/** Odczytowa passa: zapisana wartość obowiązuje tylko, gdy ostatni dzień nauki
 *  to dziś albo wczoraj. Po pominiętym dniu efektywna passa to 0 (mimo że w
 *  bazie wciąż leży stara liczba — wyzeruje ją dopiero następna sesja). */
export function streakStillValid(
  lastStudy: Date | null,
  currentStreak: number,
  now: Date
): number {
  if (currentStreak <= 0 || !lastStudy) return 0;
  const yest = new Date(now);
  yest.setDate(yest.getDate() - 1);
  if (isSameLocalDay(lastStudy, now) || isSameLocalDay(lastStudy, yest)) {
    return currentStreak;
  }
  return 0;
}

/* ============================================================
   Urlop dziekański — 1 dzień ochrony passy na 7 dni
   ============================================================ */

export const GRACE_COOLDOWN_DAYS = 7;

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Liczba pełnych dni kalendarzowych między a i b (b - a). */
export function dayGap(a: Date, b: Date): number {
  return Math.round(
    (startOfDay(b).getTime() - startOfDay(a).getTime()) / 86400000
  );
}

/** Czy „urlop dziekański" jest teraz dostępny (nieużyty od ≥7 dni). */
export function graceAvailable(lastGrace: Date | null, now: Date): boolean {
  if (!lastGrace) return true;
  return dayGap(lastGrace, now) >= GRACE_COOLDOWN_DAYS;
}

/** Odczytowa passa z urlopem dziekańskim. Jak streakStillValid, ale jeden
 *  pominięty dzień (luka = 2) jest wybaczany, gdy urlop jest dostępny. */
export function effectiveStreakWithGrace(
  lastStudy: Date | null,
  currentStreak: number,
  lastGrace: Date | null,
  now: Date
): number {
  if (currentStreak <= 0 || !lastStudy) return 0;
  const gap = dayGap(lastStudy, now);
  if (gap <= 1) return currentStreak; // dziś lub wczoraj
  if (gap === 2 && graceAvailable(lastGrace, now)) return currentStreak;
  return 0;
}

export interface StreakUpdate {
  alreadyToday: boolean;
  newStreak: number;
  graceUsed: boolean;
}

/** Decyzja o passie przy domknięciu sesji, z urlopem dziekańskim.
 *  - ten sam dzień (passa stoi) → bez zmian
 *  - wczoraj → +1
 *  - jeden pominięty dzień (luka = 2) i urlop dostępny → +1, urlop zużyty
 *  - dalej → nowy rozdział (reset do 1) */
export function computeStreakUpdateWithGrace(
  lastStudy: Date,
  now: Date,
  currentStreak: number,
  lastGrace: Date | null
): StreakUpdate {
  const gap = dayGap(lastStudy, now);
  if (gap === 0 && currentStreak > 0) {
    return { alreadyToday: true, newStreak: currentStreak, graceUsed: false };
  }
  if (gap === 1) {
    return { alreadyToday: false, newStreak: currentStreak + 1, graceUsed: false };
  }
  if (gap === 2 && currentStreak > 0 && graceAvailable(lastGrace, now)) {
    return { alreadyToday: false, newStreak: currentStreak + 1, graceUsed: true };
  }
  return { alreadyToday: false, newStreak: 1, graceUsed: false };
}

/* ============================================================
   Kamienie milowe — rozdziały passy
   ============================================================ */

export const STREAK_MILESTONES = [7, 30, 100, 365] as const;

/** Kamień osiągnięty dokładnie dziś (streak === próg), inaczej null. */
export function reachedMilestone(streak: number): number | null {
  return (STREAK_MILESTONES as readonly number[]).includes(streak)
    ? streak
    : null;
}

/** Następny kamień przed nami (null, gdy wszystkie zdobyte). */
export function nextMilestone(streak: number): number | null {
  for (const m of STREAK_MILESTONES) if (m > streak) return m;
  return null;
}

/** Numer rozdziału = ile kamieni już za nami (0 przed pierwszym). */
export function streakChapter(streak: number): number {
  let ch = 0;
  for (const m of STREAK_MILESTONES) if (streak >= m) ch += 1;
  return ch;
}

export interface StreakNarrative {
  chapter: number;
  next: number | null;
  toNext: number | null;
}

export function streakNarrative(streak: number): StreakNarrative {
  const next = nextMilestone(streak);
  return {
    chapter: streakChapter(streak),
    next,
    toNext: next != null ? next - streak : null,
  };
}

export type ErrorVerdict = "correct" | "partial" | "wrong";

/** Po tylu poprawnych odpowiedziach z rzędu błąd wypada z Error Vault. */
export const REHAB_THRESHOLD = 3;

/** Nowy stan ISTNIEJĄCEGO wpisu w Error Vault po odpowiedzi.
 *  null = bez zmian (partial jest neutralny: nie bije passy, nie zeruje). */
export function rehabError(
  current: { correctStreak: number },
  verdict: ErrorVerdict
): { correctStreak: number; status: "active" | "rehabilitated" } | null {
  if (verdict === "partial") return null;
  if (verdict === "wrong") {
    return { correctStreak: 0, status: "active" };
  }
  const newStreak = (current.correctStreak ?? 0) + 1;
  return {
    correctStreak: newStreak,
    status: newStreak >= REHAB_THRESHOLD ? "rehabilitated" : "active",
  };
}

/** Czy werdykt zakłada utworzenie nowego wpisu błędu, gdy jeszcze go nie ma.
 *  Tylko twardy błąd; correct/partial nie tworzą wpisu. */
export function createsErrorEntry(verdict: ErrorVerdict): boolean {
  return verdict === "wrong";
}
