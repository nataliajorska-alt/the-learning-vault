"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { WaxSeal } from "@/components/ui/WaxSeal";
import { reachedMilestone, streakChapter } from "@/lib/streak";

const ROMAN = ["—", "I", "II", "III", "IV", "V", "VI"];

const MILESTONE_BLURB: Record<number, string> = {
  7: "Tydzień bez przerwy. Nawyk złapany.",
  30: "Miesiąc nieprzerwanej nauki. To już nie przypadek.",
  100: "Sto dni z rzędu. Niewielu tu dochodzi.",
  365: "Rok. Cały rozdział życia w jednej passie.",
};

export function StreakMilestone({ streak }: { streak: number }) {
  const milestone = reachedMilestone(streak);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!milestone) return;
    try {
      const key = "vault:milestone-celebrated";
      const prev = Number(localStorage.getItem(key) ?? "0");
      if (milestone > prev) {
        setShow(true);
        localStorage.setItem(key, String(milestone));
      }
    } catch {
      /* ignore */
    }
  }, [milestone]);

  if (!milestone || !show) return null;

  const chapter = streakChapter(streak);
  const chapterRoman = ROMAN[chapter] ?? String(chapter);

  return (
    <div className="px-6 md:px-12 lg:px-16 pt-6 pb-2">
      <div
        className="notice-card relative"
        style={{ maxWidth: 720, margin: "0 auto" }}
      >
        <button
          onClick={() => setShow(false)}
          aria-label="Zamknij"
          className="absolute z-10"
          style={{
            top: 12,
            right: 12,
            color: "rgba(27,17,8,0.4)",
          }}
        >
          <X className="w-4 h-4" />
        </button>
        <div
          className="relative flex items-center gap-6 flex-wrap justify-center text-center sm:text-left sm:justify-start"
          style={{ zIndex: 2 }}
        >
          <div className="seal-press shrink-0">
            <WaxSeal size={72} label={chapterRoman} tone="oxblood" rotate={-6} />
          </div>
          <div className="seal-engrave">
            <div
              className="book-eyebrow"
              style={{ color: "rgba(139,46,31,0.78)" }}
            >
              Ex libris · nowy rozdział
            </div>
            <div
              className="font-display italic"
              style={{
                fontSize: 34,
                fontWeight: 600,
                color: "#1B1108",
                lineHeight: 1,
                marginTop: 6,
              }}
            >
              Rozdział {chapterRoman} · {milestone} dni
            </div>
            <p
              className="caption"
              style={{
                color: "rgba(27,17,8,0.62)",
                marginTop: 8,
                lineHeight: 1.5,
                maxWidth: 380,
              }}
            >
              {MILESTONE_BLURB[milestone] ??
                `${milestone} dni nieprzerwanej nauki.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
