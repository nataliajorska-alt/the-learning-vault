import type { Topic, TopicStatus } from "./types";

export interface SrsUpdate {
  interval: number;
  ease: number;
  correctStreak: number;
  nextReview: Date;
  status: TopicStatus;
}

export function applySrs(topic: Topic, correct: boolean): SrsUpdate {
  let { interval, ease, correctStreak } = topic;
  const totalAttempts = topic.totalAttempts + 1;
  const totalCorrect = topic.totalCorrect + (correct ? 1 : 0);

  if (correct) {
    correctStreak += 1;
    if (correctStreak === 1) interval = 1;
    else if (correctStreak === 2) interval = 3;
    else if (correctStreak === 3) interval = 7;
    else interval = Math.round(interval * ease);
    ease = Math.min(3.0, ease + 0.1);
  } else {
    correctStreak = 0;
    interval = 1;
    ease = Math.max(1.3, ease - 0.2);
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  let status: TopicStatus = "due";
  const wrongRatio = (totalAttempts - totalCorrect) / Math.max(1, totalAttempts);
  if (correctStreak >= 4 && interval >= 30) status = "mastered";
  else if (totalAttempts >= 4 && wrongRatio > 0.5) status = "struggling";

  return { interval, ease, correctStreak, nextReview, status };
}
