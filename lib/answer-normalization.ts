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

/** Wartość liczbowa ciągu, tolerując separatory tysięcy i dziesiętne w obu
 *  konwencjach ("1,000" = "1000", "5.0" = "5", "2,5" = "2.5", "1 000" = 1000).
 *  Zwraca null, gdy to nie jest sama liczba — wtedy porównujemy tekstowo. */
function numericValue(raw: string): number | null {
  const s = raw.trim().replace(/\s+/g, "");
  if (!/^[+-]?[\d.,]*\d[\d.,]*$/.test(s)) return null;
  const sign = s.startsWith("-") ? -1 : 1;
  const body = s.replace(/^[+-]/, "");
  const hasComma = body.includes(",");
  const hasDot = body.includes(".");

  let decimalSep: "," | "." | null = null;
  if (hasComma && hasDot) {
    // ten z separatorów, który stoi później, jest dziesiętny; drugi to tysiące
    decimalSep = body.lastIndexOf(",") > body.lastIndexOf(".") ? "," : ".";
  } else if (hasComma !== hasDot) {
    const sep = hasComma ? "," : ".";
    const occurrences = body.split(sep).length - 1;
    const afterLast = body.slice(body.lastIndexOf(sep) + 1);
    // pojedynczy separator z 1–2 cyframi po nim = dziesiętny; inaczej tysiące
    if (occurrences === 1 && afterLast.length >= 1 && afterLast.length <= 2) {
      decimalSep = sep;
    }
  }

  let intPart: string;
  let fracPart = "";
  if (decimalSep) {
    const idx = body.lastIndexOf(decimalSep);
    intPart = body.slice(0, idx).replace(/[.,]/g, "");
    fracPart = body.slice(idx + 1).replace(/[.,]/g, "");
  } else {
    intPart = body.replace(/[.,]/g, "");
  }

  const num = Number((intPart || "0") + (fracPart ? "." + fracPart : ""));
  return Number.isFinite(num) ? sign * num : null;
}

export function answersMatch(given: string, expected: string): boolean {
  // Liczby równe co do wartości zaliczamy mimo różnego formatu separatorów.
  const gv = numericValue(given);
  const ev = numericValue(expected);
  if (gv !== null && ev !== null) return gv === ev;
  return normalizeAnswer(given) === normalizeAnswer(expected);
}
