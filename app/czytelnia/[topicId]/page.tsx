"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTopic, useVaults } from "@/lib/firestore-data";
import { useUser } from "@/lib/auth-context";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import { ZoomTrigger } from "@/components/ui/Lightbox";
import type { Topic } from "@/lib/types";

/* ============================================================
   CZYTELNIA — lektura teorii bez testu.
   Świadomie NIC nie zapisuje: bez SRS, bez XP, bez śladu.
   ============================================================ */

function vaultSig(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 4)
    .toUpperCase();
}

function idSig(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return String(hash % 1000).padStart(3, "0");
}

export default function CzytelniaPage({
  params,
}: {
  params: { topicId: string };
}) {
  const user = useUser();
  const vaults = useVaults();
  const [topic, setTopic] = useState<Topic | null | undefined>(undefined);

  useEffect(() => {
    if (!user) return;
    getTopic(params.topicId)
      .then(setTopic)
      .catch(() => setTopic(null));
  }, [user, params.topicId]);

  const vault = useMemo(() => {
    if (!topic || !vaults) return null;
    return vaults.find((v) => v.id === topic.vaultId) ?? null;
  }, [topic, vaults]);

  const paragraphs = useMemo(() => {
    if (!topic?.theory) return [];
    return topic.theory
      .split(/\n{2,}/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [topic]);

  if (topic === undefined) {
    return <PageSkeleton rows={4} />;
  }

  if (topic === null) {
    return (
      <div className="space-y-6">
        <Link
          href="/vaults"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold"
        >
          <ArrowLeft className="w-4 h-4" /> Sekcje
        </Link>
        <div className="card text-center py-16">
          <p className="hero-italic text-2xl text-muted">
            Nie ma takiego tomu w czytelni.
          </p>
        </div>
      </div>
    );
  }

  const signature = vault
    ? `${vaultSig(vault.name)} · ${idSig(topic.id)}`
    : idSig(topic.id);
  const backHref = vault ? `/vaults/${vault.slug}` : "/vaults";

  return (
    <div className="space-y-8 pb-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold"
      >
        <ArrowLeft className="w-4 h-4" /> {vault ? vault.name : "Sekcje"}
      </Link>

      <header>
        <div className="eyebrow">Czytelnia · lektura bez testu</div>
        <h1 className="hero-italic text-4xl mt-2">{topic.title}</h1>
        {topic.summary && (
          <p className="text-muted mt-3 max-w-2xl leading-relaxed">
            {topic.summary}
          </p>
        )}
      </header>

      <article
        className="tex-paper tex-noise-fine relative"
        style={{
          padding: "30px 34px 28px",
          boxShadow:
            "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 24px 48px -16px rgba(0,0,0,0.7)",
        }}
      >
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{ inset: 10, border: "0.5px solid rgba(27,17,8,0.14)" }}
        />
        <div className="relative" style={{ zIndex: 2 }}>
          <div
            className="flex items-baseline justify-between"
            style={{
              borderBottom: "0.5px solid rgba(27,17,8,0.18)",
              paddingBottom: 8,
              marginBottom: 20,
            }}
          >
            <span
              className="eyebrow"
              style={{ color: "rgba(27,17,8,0.55)", fontSize: 9 }}
            >
              {signature}
            </span>
            <span
              className="font-display italic"
              style={{ fontSize: 13, color: "rgba(27,17,8,0.5)" }}
            >
              sine examine
            </span>
          </div>

          {topic.learningPoints && topic.learningPoints.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div
                className="eyebrow"
                style={{
                  color: "rgba(122,74,31,0.75)",
                  fontSize: 9,
                  marginBottom: 8,
                }}
              >
                Mapa pojęć
              </div>
              <div className="flex flex-wrap" style={{ gap: 6 }}>
                {topic.learningPoints.map((point) => (
                  <span
                    key={point}
                    className="signature"
                    style={{
                      color: "rgba(27,17,8,0.6)",
                      border: "0.5px solid rgba(122,74,31,0.24)",
                      padding: "3px 7px",
                      fontSize: 10,
                    }}
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>
          )}

          {topic.imageUrl && (
            <figure
              style={{
                margin: "0 auto 24px",
                maxWidth: 560,
                padding: 10,
                background:
                  "linear-gradient(180deg, #241710 0%, #1a0f08 100%)",
                boxShadow:
                  "0 14px 30px -16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,230,180,0.12)",
              }}
            >
              <div
                style={{ padding: 4, border: "0.5px solid rgba(184,146,77,0.45)" }}
              >
                <ZoomTrigger src={topic.imageUrl} caption={topic.imageCaption}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={topic.imageUrl}
                    alt={topic.imageCaption ?? "Reprodukcja dzieła"}
                    style={{ display: "block", width: "100%", height: "auto" }}
                  />
                </ZoomTrigger>
              </div>
              {topic.imageCaption && (
                <figcaption
                  className="signature"
                  style={{
                    color: "var(--c-paper-300)",
                    opacity: 0.7,
                    fontSize: 10,
                    fontStyle: "italic",
                    textAlign: "center",
                    letterSpacing: "0.02em",
                    marginTop: 9,
                    lineHeight: 1.5,
                  }}
                >
                  {topic.imageCaption}
                </figcaption>
              )}
            </figure>
          )}

          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => (
              <p
                key={i}
                className="body-prose"
                style={{
                  color: "rgba(27,17,8,0.84)",
                  fontSize: 15,
                  lineHeight: 1.7,
                  marginBottom: 14,
                  maxWidth: 680,
                }}
              >
                {p}
              </p>
            ))
          ) : (
            <p
              className="hero-italic"
              style={{ fontSize: 18, color: "rgba(27,17,8,0.55)" }}
            >
              Ten tom nie ma jeszcze spisanej teorii.
            </p>
          )}

          <div
            className="flex items-center justify-center"
            style={{ marginTop: 22 }}
          >
            <span
              className="font-display italic"
              style={{ fontSize: 16, color: "rgba(27,17,8,0.4)" }}
              aria-hidden
            >
              ❦
            </span>
          </div>
        </div>
      </article>

      <div className="flex items-center flex-wrap" style={{ gap: 16 }}>
        <Link href={`/study/session/new?topic=${topic.id}`} className="btn-ghost">
          Otwórz sesję z tym tematem
        </Link>
        <span
          className="signature text-muted"
          style={{ fontSize: 11, fontStyle: "italic" }}
        >
          Lektura nie zmienia rytmu powtórek — bez testu, bez XP.
        </span>
      </div>
    </div>
  );
}
