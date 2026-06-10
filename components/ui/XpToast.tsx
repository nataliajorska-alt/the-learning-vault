"use client";

import { useEffect } from "react";

export interface XpAward {
  xp: number;
  pillar: string;
  /** zmienny identyfikator — wymusza ponowną animację przy kolejnej nagrodzie */
  id: number;
}

/** Dyskretny złoty toast „+N XP → Filar". Sam znika po ~3,6 s.
 *  Rodzic trzyma stan nagrody i zeruje go w onDone. */
export function XpToast({
  award,
  onDone,
}: {
  award: XpAward | null;
  onDone: () => void;
}) {
  useEffect(() => {
    if (!award) return;
    const t = setTimeout(onDone, 3600);
    return () => clearTimeout(t);
  }, [award, onDone]);

  if (!award) return null;

  return (
    <div
      key={award.id}
      className="xp-toast"
      role="status"
      aria-live="polite"
      aria-label={`Plus ${award.xp} XP, filar ${award.pillar}`}
    >
      <span className="xp-toast-amount">+{award.xp} XP</span>
      <span className="xp-toast-arrow" aria-hidden>
        →
      </span>
      <span className="xp-toast-pillar">{award.pillar}</span>
    </div>
  );
}
