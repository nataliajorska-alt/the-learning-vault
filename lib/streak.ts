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
