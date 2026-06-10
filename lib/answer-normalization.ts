export function normalizeAnswer(value: string): string {
  return value
    .replace(/[łŁ]/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function answersMatch(given: string, expected: string): boolean {
  return normalizeAnswer(given) === normalizeAnswer(expected);
}
