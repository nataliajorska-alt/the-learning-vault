"use client";

import { useMemo } from "react";
import { StatCard } from "@/components/ui/StatCard";
import {
  ActivityHeatmap,
  sessionsByDay,
} from "@/components/ActivityHeatmap";
import { AccuracyChart } from "@/components/AccuracyChart";
import {
  effectiveStreak,
  useAttempts,
  useSessions,
  useTopics,
  useUserDoc,
  useVaults,
  type AttemptRow,
} from "@/lib/firestore-data";
import type { Timestamp } from "firebase/firestore";

function toDate(v: unknown): Date {
  if (v instanceof Date) return v;
  if (v && typeof v === "object" && "toDate" in v) {
    return (v as Timestamp).toDate();
  }
  return new Date(0);
}

function isoDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function StatsPage() {
  const topics = useTopics();
  const vaults = useVaults();
  const userDoc = useUserDoc();
  const sessions90 = useSessions(90);
  const attempts30 = useAttempts(30);

  const loading =
    topics === null ||
    vaults === null ||
    sessions90 === null ||
    attempts30 === null;

  const streak = effectiveStreak(userDoc);

  const totalAttempts = topics?.reduce((s, t) => s + t.totalAttempts, 0) ?? 0;
  const totalCorrect = topics?.reduce((s, t) => s + t.totalCorrect, 0) ?? 0;
  const overallAccuracy =
    totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const mastered = topics?.filter((t) => t.status === "mastered").length ?? 0;

  // Session aggregates
  const sessionsAgg = useMemo(() => {
    if (!sessions90)
      return {
        count: 0,
        totalDuration: 0,
        avgDuration: 0,
        totalQuestions: 0,
      };
    const finished = sessions90.filter((s) => s.endedAt);
    const totalDuration = finished.reduce((s, x) => s + (x.duration ?? 0), 0);
    const totalQuestions = finished.reduce(
      (s, x) => s + (x.questionsAttempted ?? 0),
      0
    );
    return {
      count: finished.length,
      totalDuration,
      avgDuration:
        finished.length > 0 ? Math.round(totalDuration / finished.length) : 0,
      totalQuestions,
    };
  }, [sessions90]);

  const heatmapData = useMemo(
    () => (sessions90 ? sessionsByDay(sessions90) : {}),
    [sessions90]
  );

  // Accuracy points — last 30 days
  const accuracyPoints = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const buckets = new Map<string, { correct: number; total: number }>();
    for (const a of attempts30 ?? []) {
      const d = toDate(a.createdAt);
      d.setHours(0, 0, 0, 0);
      const key = isoDay(d);
      const b = buckets.get(key) ?? { correct: 0, total: 0 };
      b.total += 1;
      if (a.isCorrect) b.correct += 1;
      buckets.set(key, b);
    }
    const points: { iso: string; pct: number | null; attempts: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = isoDay(d);
      const b = buckets.get(key);
      points.push({
        iso: key,
        pct: b && b.total > 0 ? Math.round((b.correct / b.total) * 100) : null,
        attempts: b?.total ?? 0,
      });
    }
    return points;
  }, [attempts30]);

  // Top sections by mastered count
  const topVaults = useMemo(() => {
    if (!topics || !vaults) return [];
    const counts = new Map<string, number>();
    for (const t of topics) {
      if (t.status === "mastered") {
        counts.set(t.vaultId, (counts.get(t.vaultId) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([vaultId, count]) => ({
        vault: vaults.find((v) => v.id === vaultId),
        count,
      }))
      .filter((x) => x.vault);
  }, [topics, vaults]);

  // Hardest topics — top 5 by absolute wrong count
  const hardestTopics = useMemo(() => {
    if (!topics) return [];
    return [...topics]
      .filter((t) => t.totalAttempts > 0)
      .map((t) => ({ ...t, wrongs: t.totalAttempts - t.totalCorrect }))
      .sort((a, b) => b.wrongs - a.wrongs)
      .slice(0, 5)
      .filter((t) => t.wrongs > 0);
  }, [topics]);

  return (
    <div className="space-y-12">
      <header>
        <div className="eyebrow">Twój rytm</div>
        <h1 className="hero-italic text-5xl mt-2">Statystyki</h1>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Streak"
          value={`${streak} ${streak === 1 ? "dzień" : "dni"}`}
          hint={
            userDoc?.longestStreak && userDoc.longestStreak > streak
              ? `rekord: ${userDoc.longestStreak}`
              : streak > 0
              ? "to już rytuał"
              : "zacznij dziś"
          }
        />
        <StatCard
          label="Trafność"
          value={`${overallAccuracy}%`}
          hint={`z ${totalAttempts} prób`}
        />
        <StatCard
          label="Opanowane"
          value={`${mastered} / ${topics?.length ?? 0}`}
        />
        <StatCard
          label="Sesje (90 dni)"
          value={sessionsAgg.count}
          hint={
            sessionsAgg.avgDuration > 0
              ? `średnio ${Math.round(sessionsAgg.avgDuration / 60)} min`
              : undefined
          }
        />
      </section>

      <section>
        <div className="eyebrow mb-3">Aktywność · 90 dni</div>
        {loading ? (
          <p className="text-sm text-muted">Ładuję...</p>
        ) : (
          <div className="card">
            <ActivityHeatmap data={heatmapData} />
            <div className="flex items-center gap-3 mt-5 text-xs text-muted">
              <span>mniej</span>
              <div className="flex gap-1">
                {[0.05, 0.3, 0.55, 0.8, 0.95].map((a) => (
                  <span
                    key={a}
                    className="inline-block w-2.5 h-2.5 rounded-[2px]"
                    style={{ background: `rgba(184,146,77,${a})` }}
                  />
                ))}
              </div>
              <span>więcej</span>
            </div>
          </div>
        )}
      </section>

      <section>
        <div className="eyebrow mb-3">Trafność · 30 dni</div>
        {loading ? (
          <p className="text-sm text-muted">Ładuję...</p>
        ) : (
          <AccuracyChart points={accuracyPoints} />
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="eyebrow mb-3">Najmocniejsze sekcje</div>
          {topVaults.length === 0 ? (
            <p className="text-sm text-muted">
              Nic jeszcze nie opanowane.
            </p>
          ) : (
            <ul className="divide-y divide-line border-t border-b border-line">
              {topVaults.map((tv, i) => (
                <li
                  key={tv.vault!.id}
                  className="py-4 flex items-center gap-3"
                >
                  <span className="text-xs text-muted tabular-nums w-4">
                    {i + 1}
                  </span>
                  <div className="hero-italic text-xl flex-1">
                    {tv.vault!.name}
                  </div>
                  <div className="text-xs text-muted">
                    {tv.count} opanowane
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="eyebrow mb-3">Najtrudniejsze tematy</div>
          {hardestTopics.length === 0 ? (
            <p className="text-sm text-muted">
              Nic ci się nie opiera. Na razie.
            </p>
          ) : (
            <ul className="divide-y divide-line border-t border-b border-line">
              {hardestTopics.map((t) => (
                <li key={t.id} className="py-4 flex items-center gap-3">
                  <div className="hero-italic text-xl flex-1">{t.title}</div>
                  <div className="text-xs text-muted whitespace-nowrap">
                    {t.wrongs} z {t.totalAttempts}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section>
        <div className="eyebrow mb-3">Łącznie</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            label="Pytania"
            value={sessionsAgg.totalQuestions}
            hint="w ostatnich 90 dniach"
          />
          <StatCard
            label="Czas"
            value={formatDuration(sessionsAgg.totalDuration)}
            hint="w sesjach"
          />
          <StatCard
            label="Średnia sesja"
            value={
              sessionsAgg.avgDuration > 0
                ? `${Math.round(sessionsAgg.avgDuration / 60)} min`
                : "—"
            }
          />
        </div>
      </section>
    </div>
  );
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem === 0 ? `${hours} h` : `${hours} h ${rem} min`;
}
