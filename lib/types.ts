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
  topicId: string;
  questionId: string;
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
