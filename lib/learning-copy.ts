import type { Topic } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

export function toReviewMillis(value: unknown): number {
  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "object" && value && "toMillis" in value) {
    return (value as { toMillis: () => number }).toMillis();
  }
  if (typeof value === "object" && value && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().getTime();
  }
  return 0;
}

export function isTopicDue(topic: Topic, now = Date.now()): boolean {
  return (
    topic.status === "fresh" ||
    topic.status === "struggling" ||
    toReviewMillis(topic.nextReview) <= now
  );
}

export function reviewDateLabel(value: unknown, now = new Date()): string {
  const ms = toReviewMillis(value);
  if (!ms) return "dziś";
  const target = new Date(ms);
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const day = new Date(target);
  day.setHours(0, 0, 0, 0);
  const diff = Math.round((day.getTime() - start.getTime()) / DAY_MS);
  if (diff <= -2) return `${Math.abs(diff)} dni temu`;
  if (diff === -1) return "wczoraj";
  if (diff === 0) return "dziś";
  if (diff === 1) return "jutro";
  if (diff < 7) return `za ${diff} dni`;
  return target.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
  });
}

export function topicQueueReason(topic: Topic, now = Date.now()): string {
  if (topic.status === "fresh") {
    return "Nowa karta. Najpierw lekka teoria, potem pierwszy ślad w pamięci.";
  }
  if (topic.status === "struggling") {
    return "Temat oznaczony jako trudny. System skraca odstęp, żeby błąd nie zdążył stwardnieć.";
  }
  if (topic.status === "mastered") {
    return "Temat opanowany. Wraca tylko kontrolnie, kiedy warto odświeżyć ślad.";
  }

  const nextMs = toReviewMillis(topic.nextReview);
  if (!nextMs || nextMs <= now) {
    const daysLate = Math.floor((now - nextMs) / DAY_MS);
    if (daysLate <= 0) return "Powtórka wypada dziś. To dobry moment, zanim ślad zacznie słabnąć.";
    if (daysLate === 1) return "Powtórka była wczoraj. Krótki powrót domknie zaległość.";
    return `Powtórka czeka od ${daysLate} dni. Najlepiej zdjąć ją z kolejki teraz.`;
  }

  return `Następna powtórka: ${reviewDateLabel(topic.nextReview)}.`;
}

export function topicStatusLabel(status: Topic["status"]): string {
  if (status === "fresh") return "nowy";
  if (status === "due") return "w rytmie";
  if (status === "struggling") return "trudny";
  return "opanowany";
}
