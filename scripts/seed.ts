/**
 * Seed startowy: 12 sekcji Natalii + startowe błędy w Error Vault.
 *
 * Uruchomienie:
 *   1. Skonfiguruj .env.local z FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 *      i SEED_USER_ID (Firebase Auth UID Natalii — pobierz z konsoli Auth po pierwszym logowaniu).
 *   2. npm run seed
 */

import "dotenv/config";
import { getAdmin } from "../lib/firebase-admin";
import type { VaultColor } from "../lib/types";

interface SeedVault {
  slug: string;
  name: string;
  icon: string;
  level: string;
  color: VaultColor;
  order: number;
}

const VAULTS: SeedVault[] = [
  { slug: "es", name: "Hiszpański", icon: "Globe", level: "B1+", color: "rose", order: 1 },
  { slug: "phil", name: "Filozofia", icon: "Brain", level: "Obycie", color: "forest", order: 2 },
  { slug: "art", name: "Sztuka", icon: "Palette", level: "Obycie", color: "gold", order: 3 },
  { slug: "hist", name: "Historia", icon: "Landmark", level: "Obycie", color: "forest", order: 4 },
  { slug: "econ", name: "Ekonomia", icon: "TrendingUp", level: "Podstawy", color: "forest", order: 5 },
  { slug: "wine", name: "Wino", icon: "Wine", level: "WSET 1", color: "rose", order: 6 },
  { slug: "music", name: "Muzyka klasyczna", icon: "Music", level: "Obycie", color: "gold", order: 7 },
  { slug: "blackjack", name: "Blackjack", icon: "Spade", level: "Strategia", color: "forest", order: 8 },
  { slug: "savoir", name: "Savoir-vivre", icon: "Crown", level: "Old money", color: "gold", order: 9 },
  { slug: "avia", name: "Lotnictwo", icon: "Plane", level: "Powrót", color: "forest", order: 10 },
  { slug: "excel", name: "Excel", icon: "FileSpreadsheet", level: "Skróty", color: "forest", order: 11 },
  { slug: "en", name: "Angielski", icon: "Languages", level: "C1", color: "rose", order: 12 },
  { slug: "sport", name: "Sport", icon: "Trophy", level: "Obycie", color: "forest", order: 13 },
];

interface SeedError {
  vaultSlug: string;
  vaultName: string;
  correctVersion: string;
  wrongVersion: string;
  context: string;
}

const ERRORS: SeedError[] = [
  { vaultSlug: "es", vaultName: "Hiszpański", correctVersion: "cambiar de trabajo", wrongVersion: "cambiar trabajo", context: "Z 'cambiar' zawsze 'de'." },
  { vaultSlug: "es", vaultName: "Hiszpański", correctVersion: "otro café", wrongVersion: "un otro café", context: "'Otro' nie łączy się z 'un'." },
  { vaultSlug: "es", vaultName: "Hiszpański", correctVersion: "El suyo es azul", wrongVersion: "Su es azul", context: "Po opuszczeniu rzeczownika używaj zaimka 'suyo', nie 'su'." },
  { vaultSlug: "es", vaultName: "Hiszpański", correctVersion: "Regresé a casa", wrongVersion: "Regrese a casa", context: "Pretérito 1. os. — akcent na końcowe -é." },
  { vaultSlug: "es", vaultName: "Hiszpański", correctVersion: "treinta y un pesos", wrongVersion: "treinta y uno pesos", context: "'Uno' apokopuje się przed rzeczownikiem męskim." },
  { vaultSlug: "es", vaultName: "Hiszpański", correctVersion: "Ayer fui a una fiesta", wrongVersion: "Yo fui a fiesta ayer", context: "Bezosobowo: pomijasz 'yo', stawiasz 'a una', okolicznik czasu na początku." },
  { vaultSlug: "phil", vaultName: "Filozofia", correctVersion: "Kant = zasada, obowiązek, rozum", wrongVersion: "Kant = konsekwencje", context: "Imperatyw kategoryczny ocenia zasadę czynu, nie skutki." },
  { vaultSlug: "phil", vaultName: "Filozofia", correctVersion: "Utylitaryzm = konsekwencje", wrongVersion: "Utylitaryzm = zasada", context: "Mill ocenia czyn po sumie szczęścia, nie po intencji." },
  { vaultSlug: "art", vaultName: "Sztuka", correctVersion: "Water Lilies = pamięć po wojnie", wrongVersion: "Water Lilies = ładny ogród", context: "Cykl powstał po I WŚ jako monument w Orangerie." },
  { vaultSlug: "hist", vaultName: "Historia", correctVersion: "Powstanie Warszawskie — przyczyny też polityczne", wrongVersion: "Powstanie — tylko kwestia militarna", context: "Operacja 'Burza' miała postawić aliantów przed faktem dokonanym." },
];

async function main() {
  const userId = process.env.SEED_USER_ID;
  if (!userId) {
    console.error("Brakuje SEED_USER_ID w .env.local. Zaloguj się przez Google w aplikacji, skopiuj UID z Firebase Auth i wklej.");
    process.exit(1);
  }

  const { db } = getAdmin();
  const now = new Date();

  console.log(`Seeduję ${VAULTS.length} sekcji dla userId=${userId}...`);

  const slugToVaultId: Record<string, string> = {};

  for (const v of VAULTS) {
    const existing = await db
      .collection("vaults")
      .where("userId", "==", userId)
      .where("slug", "==", v.slug)
      .limit(1)
      .get();

    if (!existing.empty) {
      slugToVaultId[v.slug] = existing.docs[0]!.id;
      console.log(`  · ${v.name} — już istnieje`);
      continue;
    }

    const ref = await db.collection("vaults").add({
      userId,
      ...v,
      createdAt: now,
    });
    slugToVaultId[v.slug] = ref.id;
    console.log(`  + ${v.name}`);
  }

  console.log(`\nSeeduję ${ERRORS.length} startowych błędów...`);

  for (const e of ERRORS) {
    const existing = await db
      .collection("errors")
      .where("userId", "==", userId)
      .where("correctVersion", "==", e.correctVersion)
      .limit(1)
      .get();

    if (!existing.empty) {
      console.log(`  · ${e.correctVersion} — już istnieje`);
      continue;
    }

    await db.collection("errors").add({
      userId,
      topicId: null,
      questionId: null,
      vaultName: e.vaultName,
      correctVersion: e.correctVersion,
      wrongVersion: e.wrongVersion,
      context: e.context,
      timesWrong: 1,
      lastWrongAt: now,
      status: "active",
      correctStreak: 0,
    });
    console.log(`  + ${e.correctVersion}`);
  }

  console.log("\nGotowe.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
