import type { Timestamp } from "firebase/firestore";

export type TopicStatus = "fresh" | "due" | "mastered" | "struggling";

export type VaultColor = "forest" | "gold" | "rose";

export interface Vault {
  id: string;
  userId: string;
  slug: string;
  name: string;
  icon: string;
  level: string;
  color: VaultColor;
  order: number;
  createdAt: Timestamp | Date;
}

export interface Topic {
  id: string;
  userId: string;
  vaultId: string;
  title: string;
  summary: string;
  theory: string;
  status: TopicStatus;
  interval: number;
  ease: number;
  nextReview: Timestamp | Date;
  correctStreak: number;
  totalAttempts: number;
  totalCorrect: number;
  lastShownInSalon: Timestamp | Date | null;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  /** slug presetu z /admin/preset jeśli temat pochodzi z gotowca */
  presetSlug?: string;
  /** opcjonalna ścieżka do obrazu (np. /art/mona-lisa.jpg) */
  imageUrl?: string;
  /** podpis pod obrazem (autor + tytuł + rok) */
  imageCaption?: string;
  /** 3-5 pojęć lub podumiejętności ćwiczonych w temacie */
  learningPoints?: string[];
}

export type QuestionType = "abc" | "fill" | "open" | "spot_error" | "translate";

export interface Question {
  id: string;
  topicId: string;
  userId: string;
  type: QuestionType;
  text: string;
  options: string[] | null;
  correctAnswer: string | number;
  explanation: string;
  /** opcjonalna etykieta podumiejętności, np. "ser vs estar" */
  skill?: string;
  order: number;
  createdAt: Timestamp | Date;
}

export interface SalonPhrase {
  id: string;
  topicId: string;
  userId: string;
  short: string;
  expand: string;
  trap: string;
}

export interface VaultError {
  id: string;
  userId: string;
  /** null dla błędów startowych (seed) — nie są powiązane z konkretnym tematem */
  topicId: string | null;
  /** null dla błędów startowych (seed) — nie są powiązane z konkretnym pytaniem */
  questionId: string | null;
  vaultName: string;
  correctVersion: string;
  wrongVersion: string;
  context: string;
  timesWrong: number;
  lastWrongAt: Timestamp | Date;
  status: "active" | "rehabilitated";
  correctStreak: number;
}

export type SessionMode = "mix" | "errors" | "vault" | "topic";

export interface StudySession {
  id: string;
  userId: string;
  startedAt: Timestamp | Date;
  endedAt: Timestamp | Date | null;
  mode: SessionMode;
  vaultId: string | null;
  topicIds: string[];
  questionsAttempted: number;
  questionsCorrect: number;
  duration: number;
}
