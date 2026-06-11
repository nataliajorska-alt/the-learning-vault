/** Polish plural: 1 → one, 2–4 (poza 12–14) → few, reszta → many */
export function plPlural(
  n: number,
  one: string,
  few: string,
  many: string
): string {
  if (n === 1) return one;
  const d10 = n % 10;
  const d100 = n % 100;
  if (d10 >= 2 && d10 <= 4 && (d100 < 12 || d100 > 14)) return few;
  return many;
}
