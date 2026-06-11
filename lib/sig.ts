/* Sygnatury katalogowe — "SZT · 001" itd., wspólne dla strony Dziś
   i kart pytania dnia. */

export function vaultSig(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 4)
    .toUpperCase();
}

export function idSig(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return String(hash % 1000).padStart(3, "0");
}
