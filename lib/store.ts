import { create } from "zustand";

interface SessionPhase {
  phase: "theory" | "test" | "review";
  startedAt: number;
}

interface AppState {
  streak: number;
  currentSession: SessionPhase | null;
  setSession: (s: SessionPhase | null) => void;
  setStreak: (n: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  streak: 12,
  currentSession: null,
  setSession: (s) => set({ currentSession: s }),
  setStreak: (n) => set({ streak: n }),
}));
