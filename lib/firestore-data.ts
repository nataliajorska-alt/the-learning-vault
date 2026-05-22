"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  Timestamp,
  type DocumentData,
  type QuerySnapshot,
} from "firebase/firestore";
import { getFirebase } from "./firebase";
import { useUser } from "./auth-context";
import { applySrs } from "./spaced-repetition";
import type {
  Question,
  SalonPhrase,
  StudySession,
  Topic,
  Vault,
  VaultColor,
  VaultError,
} from "./types";

function unwrap<T>(snap: QuerySnapshot<DocumentData>): T[] {
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

function toDate(v: unknown): Date {
  if (v instanceof Timestamp) return v.toDate();
  if (v instanceof Date) return v;
  return new Date(0);
}

// --- USER DOC --------------------------------------------------------------

export interface UserDoc {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp | Date;
  lastActiveAt: Timestamp | Date;
  streak: number;
  longestStreak: number;
  timezone: string;
}

export async function ensureUserDoc(): Promise<void> {
  const { auth, db } = getFirebase();
  const u = auth.currentUser;
  if (!u) return;
  const ref = doc(db, "users", u.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      photoURL: u.photoURL,
      createdAt: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
      streak: 0,
      longestStreak: 0,
      timezone: "Europe/Warsaw",
    });
  } else {
    await updateDoc(ref, { lastActiveAt: serverTimestamp() });
  }
}

export function useUserDoc() {
  const user = useUser();
  const [data, setData] = useState<UserDoc | null>(null);
  useEffect(() => {
    if (!user) {
      setData(null);
      return;
    }
    const { db } = getFirebase();
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setData(snap.exists() ? (snap.data() as UserDoc) : null);
    });
    return () => unsub();
  }, [user]);
  return data;
}

// --- VAULTS ----------------------------------------------------------------

export function useVaults() {
  const user = useUser();
  const [vaults, setVaults] = useState<Vault[] | null>(null);

  useEffect(() => {
    if (!user) return;
    const { db } = getFirebase();
    const q = query(
      collection(db, "vaults"),
      where("userId", "==", user.uid),
      orderBy("order", "asc")
    );
    const unsub = onSnapshot(q, (snap) => setVaults(unwrap<Vault>(snap)));
    return () => unsub();
  }, [user]);

  return vaults;
}

export function useVaultBySlug(slug: string) {
  const vaults = useVaults();
  if (!vaults) return undefined;
  return vaults.find((v) => v.slug === slug) ?? null;
}

// --- TOPICS ----------------------------------------------------------------

export function useTopics(vaultId?: string) {
  const user = useUser();
  const [topics, setTopics] = useState<Topic[] | null>(null);

  useEffect(() => {
    if (!user) return;
    const { db } = getFirebase();
    const constraints = [where("userId", "==", user.uid)];
    if (vaultId) constraints.push(where("vaultId", "==", vaultId));
    const q = query(collection(db, "topics"), ...constraints);
    const unsub = onSnapshot(q, (snap) => setTopics(unwrap<Topic>(snap)));
    return () => unsub();
  }, [user, vaultId]);

  return topics;
}

export async function getTopic(id: string): Promise<Topic | null> {
  const { db } = getFirebase();
  const snap = await getDoc(doc(db, "topics", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Topic;
}

// --- QUESTIONS -------------------------------------------------------------

export async function getQuestionsForTopic(topicId: string): Promise<Question[]> {
  const { auth, db } = getFirebase();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Nie jesteś zalogowana.");
  const q = query(
    collection(db, "questions"),
    where("userId", "==", uid),
    where("topicId", "==", topicId),
    orderBy("order", "asc")
  );
  const snap = await getDocs(q);
  return unwrap<Question>(snap);
}

// --- ERRORS ----------------------------------------------------------------

export function useErrors() {
  const user = useUser();
  const [errors, setErrors] = useState<VaultError[] | null>(null);

  useEffect(() => {
    if (!user) return;
    const { db } = getFirebase();
    const q = query(
      collection(db, "errors"),
      where("userId", "==", user.uid),
      where("status", "==", "active"),
      orderBy("timesWrong", "desc")
    );
    const unsub = onSnapshot(q, (snap) => setErrors(unwrap<VaultError>(snap)));
    return () => unsub();
  }, [user]);

  return errors;
}

// --- SALON -----------------------------------------------------------------

export function useSalonPhrases() {
  const user = useUser();
  const [phrases, setPhrases] = useState<SalonPhrase[] | null>(null);

  useEffect(() => {
    if (!user) return;
    const { db } = getFirebase();
    const q = query(
      collection(db, "salon_phrases"),
      where("userId", "==", user.uid)
    );
    const unsub = onSnapshot(q, (snap) => setPhrases(unwrap<SalonPhrase>(snap)));
    return () => unsub();
  }, [user]);

  return phrases;
}

export async function markTopicShownInSalon(topicId: string): Promise<void> {
  const { db } = getFirebase();
  await updateDoc(doc(db, "topics", topicId), {
    lastShownInSalon: new Date(),
  });
}

// --- AI SUGGESTIONS --------------------------------------------------------

export interface SuggestionPayload {
  title: string;
  summary: string;
  theory: string;
  questions: Array<{
    type: "abc" | "fill" | "open" | "spot_error" | "translate";
    text: string;
    options: string[] | null;
    correctAnswer: string | number;
    explanation: string;
  }>;
  salon: {
    short: string;
    expand: string;
    trap: string;
  } | null;
}

export async function commitSuggestion(opts: {
  userId: string;
  vaultId: string;
  payload: SuggestionPayload;
  /** opcjonalny slug presetu — zapisuje się na topic, służy do detekcji importu */
  presetSlug?: string;
}): Promise<{ topicId: string }> {
  const { db } = getFirebase();
  const now = new Date();
  const { userId, vaultId, payload, presetSlug } = opts;

  const topicData: Record<string, unknown> = {
    userId,
    vaultId,
    title: payload.title,
    summary: payload.summary,
    theory: payload.theory,
    status: "fresh",
    interval: 0,
    ease: 2.5,
    nextReview: now,
    correctStreak: 0,
    totalAttempts: 0,
    totalCorrect: 0,
    lastShownInSalon: null,
    createdAt: now,
    updatedAt: now,
  };
  if (presetSlug) topicData.presetSlug = presetSlug;
  const topicRef = await addDoc(collection(db, "topics"), topicData);

  for (let i = 0; i < payload.questions.length; i++) {
    const q = payload.questions[i]!;
    await addDoc(collection(db, "questions"), {
      userId,
      topicId: topicRef.id,
      type: q.type,
      text: q.text,
      options: q.options ?? null,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      order: i + 1,
      createdAt: now,
    });
  }

  if (payload.salon && payload.salon.short.trim().length > 0) {
    await addDoc(collection(db, "salon_phrases"), {
      userId,
      topicId: topicRef.id,
      short: payload.salon.short,
      expand: payload.salon.expand,
      trap: payload.salon.trap,
    });
  }

  return { topicId: topicRef.id };
}

// --- MUTATIONS: SRS + attempts + errors -----------------------------------

export async function recordAttempt(opts: {
  userId: string;
  sessionId: string;
  topic: Topic;
  question: Question;
  answer: string;
  correct: boolean;
  timeTaken: number;
  vaultName: string;
}): Promise<void> {
  const { db } = getFirebase();
  const { userId, sessionId, topic, question, answer, correct, timeTaken } = opts;

  const srs = applySrs(topic, correct);

  const batch = writeBatch(db);

  // 1. attempts/{auto}
  const attemptRef = doc(collection(db, "attempts"));
  batch.set(attemptRef, {
    userId,
    sessionId,
    questionId: question.id,
    topicId: topic.id,
    answer,
    isCorrect: correct,
    timeTaken,
    createdAt: serverTimestamp(),
  });

  // 2. topics/{id} — SRS update
  const topicRef = doc(db, "topics", topic.id);
  batch.update(topicRef, {
    interval: srs.interval,
    ease: srs.ease,
    correctStreak: srs.correctStreak,
    nextReview: srs.nextReview,
    status: srs.status,
    totalAttempts: topic.totalAttempts + 1,
    totalCorrect: topic.totalCorrect + (correct ? 1 : 0),
    updatedAt: serverTimestamp(),
  });

  await batch.commit();

  // 3. errors/{...} — bump or create / rehabilitate
  await upsertErrorEntry({
    userId,
    topic,
    question,
    answer,
    correct,
    vaultName: opts.vaultName,
  });
}

async function upsertErrorEntry(opts: {
  userId: string;
  topic: Topic;
  question: Question;
  answer: string;
  correct: boolean;
  vaultName: string;
}) {
  const { db } = getFirebase();
  const { userId, topic, question, answer, correct, vaultName } = opts;

  const existingQ = query(
    collection(db, "errors"),
    where("userId", "==", userId),
    where("questionId", "==", question.id)
  );
  const existing = await getDocs(existingQ);
  const now = new Date();

  if (!correct) {
    const correctVersion =
      question.type === "abc" || question.type === "spot_error"
        ? (question.options ?? [])[Number(question.correctAnswer)] ?? String(question.correctAnswer)
        : String(question.correctAnswer);

    if (existing.empty) {
      await addDoc(collection(db, "errors"), {
        userId,
        topicId: topic.id,
        questionId: question.id,
        vaultName,
        correctVersion,
        wrongVersion: answer || "(brak)",
        context: question.explanation,
        timesWrong: 1,
        lastWrongAt: now,
        status: "active",
        correctStreak: 0,
      });
    } else {
      const ref = existing.docs[0]!.ref;
      const cur = existing.docs[0]!.data() as VaultError;
      await updateDoc(ref, {
        timesWrong: (cur.timesWrong ?? 0) + 1,
        lastWrongAt: now,
        wrongVersion: answer || cur.wrongVersion,
        status: "active",
        correctStreak: 0,
      });
    }
    return;
  }

  // correct + has existing error => bump streak; rehabilitate at 3
  if (!existing.empty) {
    const ref = existing.docs[0]!.ref;
    const cur = existing.docs[0]!.data() as VaultError;
    const newStreak = (cur.correctStreak ?? 0) + 1;
    await updateDoc(ref, {
      correctStreak: newStreak,
      status: newStreak >= 3 ? "rehabilitated" : "active",
    });
  }
}

// --- ERRORS QUIZ -----------------------------------------------------------

export async function bumpErrorOnAnswer(opts: {
  errorId: string;
  correct: boolean;
  givenAnswer: string;
}): Promise<{ rehabilitated: boolean }> {
  const { db } = getFirebase();
  const ref = doc(db, "errors", opts.errorId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { rehabilitated: false };
  const cur = snap.data() as VaultError;

  if (opts.correct) {
    const newStreak = (cur.correctStreak ?? 0) + 1;
    const rehabilitated = newStreak >= 3;
    await updateDoc(ref, {
      correctStreak: newStreak,
      status: rehabilitated ? "rehabilitated" : "active",
    });
    return { rehabilitated };
  } else {
    await updateDoc(ref, {
      timesWrong: (cur.timesWrong ?? 0) + 1,
      lastWrongAt: new Date(),
      wrongVersion: opts.givenAnswer || cur.wrongVersion,
      correctStreak: 0,
      status: "active",
    });
    return { rehabilitated: false };
  }
}

// --- SESSIONS / ATTEMPTS QUERIES (stats) -----------------------------------

function startOfDayDaysAgo(daysBack: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysBack);
  return d;
}

export function useSessions(daysBack: number) {
  const user = useUser();
  const [data, setData] = useState<StudySession[] | null>(null);

  useEffect(() => {
    if (!user) return;
    const { db } = getFirebase();
    const cutoff = startOfDayDaysAgo(daysBack);
    const q = query(
      collection(db, "sessions"),
      where("userId", "==", user.uid),
      where("startedAt", ">=", cutoff)
    );
    const unsub = onSnapshot(q, (snap) =>
      setData(unwrap<StudySession>(snap))
    );
    return () => unsub();
  }, [user, daysBack]);

  return data;
}

export interface AttemptRow {
  id: string;
  userId: string;
  sessionId: string;
  questionId: string;
  topicId: string;
  answer: string;
  isCorrect: boolean;
  timeTaken: number;
  createdAt: Timestamp | Date;
}

export function useAttempts(daysBack: number) {
  const user = useUser();
  const [data, setData] = useState<AttemptRow[] | null>(null);

  useEffect(() => {
    if (!user) return;
    const { db } = getFirebase();
    const cutoff = startOfDayDaysAgo(daysBack);
    const q = query(
      collection(db, "attempts"),
      where("userId", "==", user.uid),
      where("createdAt", ">=", cutoff)
    );
    const unsub = onSnapshot(q, (snap) => setData(unwrap<AttemptRow>(snap)));
    return () => unsub();
  }, [user, daysBack]);

  return data;
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function effectiveStreak(userDoc: UserDoc | null): number {
  if (!userDoc) return 0;
  const stored = userDoc.streak ?? 0;
  if (stored === 0) return 0;
  const last = userDoc.lastActiveAt instanceof Timestamp
    ? userDoc.lastActiveAt.toDate()
    : userDoc.lastActiveAt instanceof Date
    ? userDoc.lastActiveAt
    : null;
  if (!last) return 0;
  const now = new Date();
  const yest = new Date(now);
  yest.setDate(yest.getDate() - 1);
  if (isSameLocalDay(last, now) || isSameLocalDay(last, yest)) return stored;
  return 0;
}

// --- SESSIONS (lifecycle) --------------------------------------------------

export async function startSession(opts: {
  userId: string;
  mode: StudySession["mode"];
  vaultId: string | null;
  topicIds: string[];
}): Promise<string> {
  const { db } = getFirebase();
  const ref = await addDoc(collection(db, "sessions"), {
    userId: opts.userId,
    mode: opts.mode,
    vaultId: opts.vaultId,
    topicIds: opts.topicIds,
    startedAt: serverTimestamp(),
    endedAt: null,
    questionsAttempted: 0,
    questionsCorrect: 0,
    duration: 0,
  });
  return ref.id;
}

export async function finishSession(
  sessionId: string,
  result: { attempted: number; correct: number; duration: number }
): Promise<void> {
  const { db } = getFirebase();
  await updateDoc(doc(db, "sessions", sessionId), {
    endedAt: serverTimestamp(),
    questionsAttempted: result.attempted,
    questionsCorrect: result.correct,
    duration: result.duration,
  });
  await bumpStreakIfNeeded();
}

async function bumpStreakIfNeeded() {
  const { auth, db } = getFirebase();
  const u = auth.currentUser;
  if (!u) return;
  const ref = doc(db, "users", u.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as UserDoc;
  const last = toDate(data.lastActiveAt);
  const now = new Date();

  const sameDay =
    last.getFullYear() === now.getFullYear() &&
    last.getMonth() === now.getMonth() &&
    last.getDate() === now.getDate();

  if (sameDay && data.streak > 0) return;

  const yest = new Date(now);
  yest.setDate(yest.getDate() - 1);
  const wasYesterday =
    last.getFullYear() === yest.getFullYear() &&
    last.getMonth() === yest.getMonth() &&
    last.getDate() === yest.getDate();

  const newStreak = wasYesterday ? data.streak + 1 : 1;
  await updateDoc(ref, {
    streak: newStreak,
    longestStreak: Math.max(data.longestStreak ?? 0, newStreak),
    lastActiveAt: serverTimestamp(),
  });
}

// --- CLIENT-SIDE FIRST-RUN SEED -------------------------------------------

interface VaultSeed {
  slug: string;
  name: string;
  icon: string;
  level: string;
  color: VaultColor;
  order: number;
}

const STARTER_VAULTS: VaultSeed[] = [
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
];

const STARTER_ERRORS: Array<{
  vaultName: string;
  correctVersion: string;
  wrongVersion: string;
  context: string;
}> = [
  { vaultName: "Hiszpański", correctVersion: "cambiar de trabajo", wrongVersion: "cambiar trabajo", context: "Z 'cambiar' zawsze 'de'." },
  { vaultName: "Hiszpański", correctVersion: "otro café", wrongVersion: "un otro café", context: "'Otro' nie łączy się z 'un'." },
  { vaultName: "Hiszpański", correctVersion: "El suyo es azul", wrongVersion: "Su es azul", context: "Po opuszczeniu rzeczownika używaj 'suyo'." },
  { vaultName: "Hiszpański", correctVersion: "Regresé a casa", wrongVersion: "Regrese a casa", context: "Pretérito 1. os. — akcent na końcowe -é." },
  { vaultName: "Hiszpański", correctVersion: "treinta y un pesos", wrongVersion: "treinta y uno pesos", context: "'Uno' apokopuje się przed rzeczownikiem męskim." },
  { vaultName: "Hiszpański", correctVersion: "Ayer fui a una fiesta", wrongVersion: "Yo fui a fiesta ayer", context: "Pomiń 'yo', okolicznik czasu na początku." },
  { vaultName: "Filozofia", correctVersion: "Kant = zasada, obowiązek, rozum", wrongVersion: "Kant = konsekwencje", context: "Imperatyw kategoryczny ocenia zasadę, nie skutki." },
  { vaultName: "Filozofia", correctVersion: "Utylitaryzm = konsekwencje", wrongVersion: "Utylitaryzm = zasada", context: "Mill ocenia czyn po sumie szczęścia." },
  { vaultName: "Sztuka", correctVersion: "Water Lilies = pamięć po wojnie", wrongVersion: "Water Lilies = ładny ogród", context: "Cykl powstał po I WŚ jako monument w Orangerie." },
  { vaultName: "Historia", correctVersion: "Powstanie Warszawskie — przyczyny też polityczne", wrongVersion: "Powstanie — tylko militarne", context: "Operacja 'Burza' miała fakt dokonany wobec Sowietów." },
];

interface StarterTopic {
  vaultSlug: string;
  title: string;
  summary: string;
  theory: string;
  questions: Array<Omit<Question, "id" | "topicId" | "userId" | "createdAt">>;
  salon?: { short: string; expand: string; trap: string };
}

const STARTER_TOPICS: StarterTopic[] = [
  {
    vaultSlug: "es",
    title: "Ser vs estar",
    summary:
      "Dwa czasowniki 'być'. Ser dotyczy tożsamości i cech. Estar — stanu, lokalizacji, chwili.",
    theory:
      "Ser opisuje to, kim albo czym coś jest w sposób trwały: zawód, narodowość, cechy. Estar opisuje gdzie coś jest, w jakim stanie, jak się czuje. 'Soy aburrida' = jestem nudna (cecha). 'Estoy aburrida' = nudzę się teraz (stan).",
    questions: [
      {
        type: "abc",
        text: "Maria jest nauczycielką. Po hiszpańsku:",
        options: ["María está profesora", "María es profesora", "María está de profesora"],
        correctAnswer: 1,
        explanation: "Zawód to cecha tożsamości — ser, nie estar.",
        order: 1,
      },
      {
        type: "fill",
        text: "_____ cansada (Jestem zmęczona — teraz).",
        options: null,
        correctAnswer: "Estoy",
        explanation: "Zmęczenie to stan, nie cecha. Estar.",
        order: 2,
      },
      {
        type: "spot_error",
        text: "La fiesta está en mi casa el sábado.",
        options: ["está", "en mi casa", "el sábado", "wszystko OK"],
        correctAnswer: 0,
        explanation: "Wydarzenie 'odbywa się' — ser. 'La fiesta es en mi casa'.",
        order: 3,
      },
      {
        type: "open",
        text: "Wyjaśnij krótko różnicę między 'Soy aburrida' a 'Estoy aburrida'.",
        options: null,
        correctAnswer:
          "Soy = jestem nudna (cecha), Estoy = nudzę się teraz (stan).",
        explanation: "Ten sam przymiotnik, ale ser podaje cechę, estar — stan chwilowy.",
        order: 4,
      },
    ],
  },
  {
    vaultSlug: "phil",
    title: "Kant vs utylitaryzm",
    summary:
      "Kant: liczy się zasada i obowiązek. Utylitaryzm: liczy się tylko wynik — najwięcej dobra dla największej liczby.",
    theory:
      "Imperatyw kategoryczny Kanta każe pytać: czy mogłabym chcieć, żeby moja zasada stała się prawem powszechnym. Utylitaryzm Milla pyta: który wybór daje więcej szczęścia. Pułapka: nie podawaj utylitaryzmu jako 'liczy się intencja' — to dokładnie odwrotnie.",
    questions: [
      {
        type: "abc",
        text: "Według Kanta czyn jest moralnie dobry, gdy:",
        options: [
          "jego skutki są dobre",
          "wynika z zasady, którą da się uogólnić",
          "kierowała nim sympatia",
        ],
        correctAnswer: 1,
        explanation: "Imperatyw kategoryczny: zasada, nie skutek.",
        order: 1,
      },
      {
        type: "abc",
        text: "Utylitaryzm ocenia czyn po:",
        options: ["intencji", "zasadzie", "sumie szczęścia/cierpienia"],
        correctAnswer: 2,
        explanation: "Mill: wynik liczony netto.",
        order: 2,
      },
      {
        type: "open",
        text: "Sformułuj w jednym zdaniu różnicę między Kantem a utylitaryzmem.",
        options: null,
        correctAnswer:
          "Kant: zasada i obowiązek (deontologia). Utylitaryzm: skutek i suma szczęścia (konsekwencjalizm).",
        explanation: "Deontologia kontra konsekwencjalizm.",
        order: 3,
      },
    ],
  },
  {
    vaultSlug: "art",
    title: "Monet — Water Lilies",
    summary:
      "Późny Monet, malowany po I wojnie. To nie ogrodowa pocztówka, tylko malarski pomnik.",
    theory:
      "Cykl powstawał z myślą o paryskiej Orangerie — płótna mają widza otoczyć. Pogarszający się wzrok Moneta wpłynął na fakturę koloru, ale układ kompozycji to świadoma decyzja, nie skutek wady.",
    questions: [
      {
        type: "abc",
        text: "Water Lilies powstały:",
        options: ["w młodości Moneta", "po I wojnie światowej", "w czasie II wojny"],
        correctAnswer: 1,
        explanation: "Cykl późny, lata 1914–1926.",
        order: 1,
      },
      {
        type: "abc",
        text: "Dla jakiej przestrzeni Monet planował cykl?",
        options: ["Luwr", "Musée d'Orsay", "Orangerie"],
        correctAnswer: 2,
        explanation: "Dwie owalne sale Orangerie w Tuileries.",
        order: 2,
      },
      {
        type: "open",
        text: "Czego nie mówić o Water Lilies przy stole?",
        options: null,
        correctAnswer:
          "Że to ładny ogród albo że Monet malował tak, bo gorzej widział.",
        explanation:
          "Cykl to monument, nie pocztówka. Wzrok wpłynął na fakturę, ale kompozycja jest świadoma.",
        order: 3,
      },
    ],
    salon: {
      short:
        "Late Monet, malowane po I WŚ. To nie ogrodowa pocztówka, tylko malarski pomnik. Stąd brak horyzontu i monumentalna skala.",
      expand:
        "Stworzone z myślą o Orangerie w Paryżu — mają widza otoczyć. Pogarszający się wzrok Moneta zmienił sposób kładzenia koloru, ale to nadal świadoma decyzja artystyczna.",
      trap:
        "Nie redukuj tego do 'malował tak, bo gorzej widział'. I nie nazywaj tego 'ogrodem'.",
    },
  },
];

export async function seedFirstRun(userId: string): Promise<void> {
  const { db } = getFirebase();
  const now = new Date();

  // 1. Vaults (skip if any exist)
  const existing = await getDocs(
    query(collection(db, "vaults"), where("userId", "==", userId))
  );
  const slugToVaultId: Record<string, string> = {};
  if (existing.empty) {
    for (const v of STARTER_VAULTS) {
      const ref = await addDoc(collection(db, "vaults"), {
        userId,
        ...v,
        createdAt: now,
      });
      slugToVaultId[v.slug] = ref.id;
    }
  } else {
    existing.docs.forEach((d) => {
      const data = d.data() as Vault;
      slugToVaultId[data.slug] = d.id;
    });
  }

  // 2. Starter errors (only if zero errors)
  const errSnap = await getDocs(
    query(collection(db, "errors"), where("userId", "==", userId))
  );
  if (errSnap.empty) {
    for (const e of STARTER_ERRORS) {
      await addDoc(collection(db, "errors"), {
        userId,
        topicId: "",
        questionId: "",
        vaultName: e.vaultName,
        correctVersion: e.correctVersion,
        wrongVersion: e.wrongVersion,
        context: e.context,
        timesWrong: 1,
        lastWrongAt: now,
        status: "active",
        correctStreak: 0,
      });
    }
  }

  // 3. Starter topics + questions + salon phrases (only if zero topics)
  const topSnap = await getDocs(
    query(collection(db, "topics"), where("userId", "==", userId))
  );
  if (topSnap.empty) {
    for (const t of STARTER_TOPICS) {
      const vaultId = slugToVaultId[t.vaultSlug];
      if (!vaultId) continue;

      const topicRef = await addDoc(collection(db, "topics"), {
        userId,
        vaultId,
        title: t.title,
        summary: t.summary,
        theory: t.theory,
        status: "fresh",
        interval: 0,
        ease: 2.5,
        nextReview: now,
        correctStreak: 0,
        totalAttempts: 0,
        totalCorrect: 0,
        lastShownInSalon: null,
        createdAt: now,
        updatedAt: now,
      });

      for (const q of t.questions) {
        await addDoc(collection(db, "questions"), {
          userId,
          topicId: topicRef.id,
          ...q,
          createdAt: now,
        });
      }

      if (t.salon) {
        await addDoc(collection(db, "salon_phrases"), {
          userId,
          topicId: topicRef.id,
          ...t.salon,
        });
      }
    }
  }
}
