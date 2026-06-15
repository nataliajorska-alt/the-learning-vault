"use client";

import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  markTopicShownInSalon,
  useSalonPhrases,
  useTopics,
  useVaults,
} from "@/lib/firestore-data";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import {
  awardP30Xp,
  pillarForVaultSlug,
  P30_PILLAR_LABELS,
} from "@/lib/projekt30-xp";
import { useUser } from "@/lib/auth-context";
import { XpToast, type XpAward } from "@/components/ui/XpToast";

export function SalonDetail({ topicId }: { topicId: string }) {
  const user = useUser();
  const topics = useTopics();
  const phrases = useSalonPhrases();
  const vaults = useVaults();
  const markedRef = useRef(false);

  const [attempt, setAttempt] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [fbBusy, setFbBusy] = useState(false);
  const [fbErr, setFbErr] = useState<string | null>(null);
  const [xpAward, setXpAward] = useState<XpAward | null>(null);
  const xpIdRef = useRef(0);

  function flashXp(xp: number, slug: string | undefined) {
    xpIdRef.current += 1;
    setXpAward({
      xp,
      pillar: P30_PILLAR_LABELS[pillarForVaultSlug(slug)],
      id: xpIdRef.current,
    });
  }

  const topic = useMemo(
    () => topics?.find((t) => t.id === topicId) ?? null,
    [topics, topicId]
  );
  const phrase = useMemo(
    () => phrases?.find((p) => p.topicId === topicId) ?? null,
    [phrases, topicId]
  );
  const vault = useMemo(
    () => (topic && vaults ? vaults.find((v) => v.id === topic.vaultId) : null),
    [topic, vaults]
  );

  // Bump lastShownInSalon once on mount, after we have the topic.
  // Plus best-effort XP do P30 (+5 za odsłonięcie salonowego tematu).
  // Pillar wyznaczony z vault.slug, jeśli vault jest już załadowany.
  useEffect(() => {
    if (topic && !markedRef.current) {
      markedRef.current = true;
      markTopicShownInSalon(topic.id).catch(() => {});
      void awardP30Xp({
        xp: 5,
        source: "vault:salon-view",
        pillar: pillarForVaultSlug(vault?.slug),
      });
      flashXp(5, vault?.slug);
    }
  }, [topic, vault]);

  async function evaluate() {
    if (!topic || !phrase) return;
    if (attempt.trim().length < 10) {
      setFbErr("Powiedz coś więcej — przynajmniej zdanie.");
      return;
    }
    setFbBusy(true);
    setFbErr(null);
    setFeedback(null);
    try {
      const idToken = (await user?.getIdToken()) ?? "";
      const res = await fetch("/api/salon-feedback", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          topic: topic.title,
          reference: {
            short: phrase.short,
            expand: phrase.expand,
            trap: phrase.trap,
          },
          attempt,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as { feedback?: string };
      setFeedback(data.feedback ?? null);
      void awardP30Xp({
        xp: 5,
        source: "vault:salon-finesse",
        pillar: pillarForVaultSlug(vault?.slug),
      });
      flashXp(5, vault?.slug);
    } catch (e) {
      setFbErr(e instanceof Error ? e.message : "Nie udało się ocenić.");
    } finally {
      setFbBusy(false);
    }
  }

  const loading = topics === null || phrases === null || vaults === null;

  if (loading) {
    return <PageSkeleton rows={2} />;
  }

  if (!topic || !phrase) {
    return (
      <div className="space-y-6">
        <Link
          href="/salon"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold"
        >
          <ArrowLeft className="w-4 h-4" /> Salon
        </Link>
        <p className="hero-italic text-3xl text-muted">
          Nie ma frazy do tego tematu.
        </p>
      </div>
    );
  }

  const sectionName = vault?.name ?? "Salon";
  const motif = (sectionName[0] ?? "§").toUpperCase();
  const accent = accentForKey(vault?.id ?? topicId);

  const steps: SalonStep[] = [
    { n: "01", label: "Krótko", time: "30 sekund", tone: "serif", text: phrase.short },
    { n: "02", label: "Rozbudowanie", time: "60 sekund", tone: "body", text: phrase.expand },
    { n: "03", label: "Pułapka", time: "uważaj", tone: "trap", trap: true, text: phrase.trap },
  ];

  return (
    <div className="page-bleed -mt-10 md:-mt-12 relative overflow-hidden">
      {/* atmosfera: kropki, ciepła poświata u góry, winieta — jak w handoffie */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(184,146,77,0.07) 1px, transparent 1.5px)",
          backgroundSize: "32px 32px",
          opacity: 0.5,
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 12%, rgba(180,80,80,0.10), transparent 60%)",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 55%, transparent 42%, rgba(0,0,0,0.55) 100%)",
          zIndex: 0,
        }}
      />

      <div
        className="relative max-w-content mx-auto px-6 md:px-12 lg:px-16 pt-10 md:pt-12 pb-20"
        style={{ zIndex: 1 }}
      >
        {/* back */}
        <Link
          href="/salon"
          className="inline-flex items-center"
          style={{
            gap: 12,
            textDecoration: "none",
            marginBottom: 32,
            color: "var(--c-paper-300)",
            opacity: 0.75,
          }}
        >
          <span aria-hidden style={{ fontSize: 18, lineHeight: 1 }}>←</span>
          <span className="font-display italic" style={{ fontSize: 21 }}>Salon</span>
        </Link>

        {/* header */}
        <header style={{ marginBottom: 40 }}>
          <div
            className="eyebrow flex items-center"
            style={{
              color: "var(--c-gold-400)",
              fontSize: 11,
              letterSpacing: "0.28em",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 22,
                height: 1,
                background: "var(--c-gold-500)",
                opacity: 0.6,
              }}
            />
            {sectionName}
          </div>
          <h1
            className="font-display italic"
            style={{
              fontSize: "clamp(34px, 5vw, 50px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--c-paper-100)",
              fontWeight: 600,
              marginBottom: 18,
              textWrap: "balance",
            }}
          >
            {topic.title}
          </h1>
          <p
            className="lead"
            style={{
              color: "var(--c-paper-300)",
              opacity: 0.72,
              maxWidth: 600,
              textWrap: "pretty",
              margin: 0,
            }}
          >
            Trzy stopnie — od skrótu, przez rozbudowanie, po pułapkę, w której
            najłatwiej potknąć się przy stole.
          </p>
        </header>

        {/* opcjonalny obraz tematu — oprawiona reprodukcja */}
        {topic.imageUrl && (
          <figure className="relative" style={{ marginBottom: 36, maxWidth: 640 }}>
            <div
              aria-hidden
              className="absolute pointer-events-none"
              style={{ inset: 6, border: "0.5px solid rgba(184,146,77,0.4)", zIndex: 2 }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={topic.imageUrl}
              alt={topic.imageCaption ?? topic.title}
              className="w-full h-auto block"
              style={{ border: "1px solid rgba(184,146,77,0.3)" }}
            />
            {topic.imageCaption && (
              <figcaption
                className="signature"
                style={{
                  color: "var(--c-paper-300)",
                  opacity: 0.6,
                  fontSize: 11,
                  marginTop: 8,
                  fontStyle: "italic",
                }}
              >
                {topic.imageCaption}
              </figcaption>
            )}
          </figure>
        )}

        {/* rozkładówka: karta czytania + przyklejona szpalta */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]"
          style={{ gap: 40, alignItems: "start" }}
        >
          {/* reading card */}
          <div
            className="tex-paper tex-noise-fine relative"
            style={{
              boxShadow:
                "0 1px 0 rgba(255,250,235,0.6) inset, 0 -1px 0 rgba(80,50,20,0.18) inset, 0 28px 60px -22px rgba(0,0,0,0.8), 0 5px 10px rgba(0,0,0,0.4)",
            }}
          >
            <div
              aria-hidden
              className="absolute pointer-events-none"
              style={{ inset: 16, border: "0.5px solid rgba(146,112,55,0.4)", zIndex: 2 }}
            />
            <div className="absolute" style={{ top: -26, left: -26, zIndex: 5 }}>
              <SalonSeal size={88} label="S" />
            </div>
            <div className="relative" style={{ padding: "46px 30px 40px", zIndex: 3 }}>
              {steps.map((s, i) => (
                <Fragment key={s.n}>
                  <StageBlock step={s} first={i === 0} />
                  {i < steps.length - 1 && <Hedera />}
                </Fragment>
              ))}
            </div>
          </div>

          {/* aside */}
          <aside
            className="flex flex-col lg:sticky"
            style={{ gap: 24, top: 96 }}
          >
            {/* plakietka sekcji */}
            <div
              className="flex items-center"
              style={{
                gap: 14,
                padding: "16px 18px",
                border: "0.5px solid rgba(184,146,77,0.22)",
                background: "rgba(27,17,8,0.4)",
              }}
            >
              <SectionMonogram motif={motif} color={accent} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  className="eyebrow"
                  style={{
                    color: "var(--c-gold-400)",
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    marginBottom: 4,
                  }}
                >
                  {sectionName}
                </div>
                <div
                  className="signature"
                  style={{
                    color: "var(--c-paper-300)",
                    opacity: 0.7,
                    fontSize: 11,
                    letterSpacing: "0.08em",
                  }}
                >
                  Trzy zdania · 90 sekund
                </div>
              </div>
            </div>

            {/* nawigacja stopni */}
            <div>
              <div
                className="eyebrow flex items-center"
                style={{
                  color: "var(--c-paper-300)",
                  opacity: 0.6,
                  fontSize: 9.5,
                  letterSpacing: "0.24em",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                Na tej karcie
                <span style={{ flex: 1, height: 0.5, background: "rgba(184,146,77,0.22)" }} />
              </div>
              <StepNav steps={steps} />
            </div>

            {/* panel oceny finezji */}
            <div
              style={{
                border: "0.5px solid rgba(184,146,77,0.28)",
                background:
                  "linear-gradient(180deg, rgba(40,24,14,0.55), rgba(20,12,7,0.35))",
                padding: "24px 22px",
              }}
            >
              <div
                className="eyebrow flex items-center"
                style={{
                  color: "var(--c-gold-400)",
                  fontSize: 10,
                  letterSpacing: "0.24em",
                  gap: 9,
                  marginBottom: 12,
                }}
              >
                <span aria-hidden style={{ fontSize: 12 }}>✦</span> Twoja wersja · ocena
                finezji
              </div>
              <p
                className="body-prose"
                style={{
                  color: "var(--c-paper-300)",
                  opacity: 0.82,
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  marginBottom: 18,
                  textWrap: "pretty",
                }}
              >
                Powiedz to swoimi słowami — tak, jakbyś rzuciła to przy stole.
                Ocenię finezję i podpowiem, co dopracować.
              </p>
              <textarea
                value={attempt}
                onChange={(e) => setAttempt(e.target.value)}
                disabled={fbBusy}
                placeholder="Twoje dwa–trzy zdania na temat…"
                rows={5}
                aria-label="Twoja wersja tematu"
                style={{
                  width: "100%",
                  resize: "vertical",
                  boxSizing: "border-box",
                  padding: "14px 16px",
                  marginBottom: 16,
                  background: "rgba(12,8,5,0.55)",
                  color: "var(--c-paper-100)",
                  border: "0.5px solid rgba(184,146,77,0.3)",
                  outline: "none",
                  fontSize: 14.5,
                  lineHeight: 1.6,
                  fontFamily: "var(--font-manrope), system-ui, sans-serif",
                }}
              />
              <WaxPrimaryButton
                onClick={evaluate}
                disabled={fbBusy || attempt.trim().length < 10}
              >
                {fbBusy ? "Oceniam…" : "Oceń finezję"}
              </WaxPrimaryButton>
              {fbErr && (
                <p
                  className="signature"
                  style={{
                    color: "rgba(200,81,47,0.9)",
                    fontSize: 11,
                    marginTop: 10,
                    letterSpacing: "0.04em",
                  }}
                >
                  {fbErr}
                </p>
              )}
              <div className="flex" style={{ gap: 10, marginTop: 12 }}>
                <GoldGhost href="/salon">Inny temat</GoldGhost>
                <GoldGhost href={`/study/session/new?topic=${topic.id}`} accentRed>
                  Przerób na quizie
                </GoldGhost>
              </div>
              {feedback && (
                <div
                  style={{
                    marginTop: 18,
                    borderTop: "0.5px solid rgba(184,146,77,0.22)",
                    paddingTop: 16,
                  }}
                >
                  <div
                    className="eyebrow"
                    style={{
                      color: "var(--c-gold-400)",
                      fontSize: 10,
                      letterSpacing: "0.22em",
                      marginBottom: 8,
                    }}
                  >
                    Ocena finezji
                  </div>
                  <p
                    className="body-prose"
                    style={{
                      color: "var(--c-paper-100)",
                      fontSize: 14,
                      lineHeight: 1.62,
                      textWrap: "pretty",
                    }}
                  >
                    {feedback}
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <XpToast award={xpAward} onDone={() => setXpAward(null)} />
    </div>
  );
}

/* ============================================================
   Komponenty wizualne — odtworzone 1:1 z handoffu „Salon - Temat"
   ============================================================ */

type SalonStep = {
  n: string;
  label: string;
  time: string;
  tone: "serif" | "body" | "trap";
  text: string;
  trap?: boolean;
};

const SECTION_ACCENTS = [
  "#1f3a52",
  "#1f3a26",
  "#3a0f1c",
  "#3a2a18",
  "#2a2433",
  "#4a2410",
];

function accentForKey(key: string): string {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return SECTION_ACCENTS[h % SECTION_ACCENTS.length]!;
}

function SalonSeal({ size = 68, label = "S" }: { size?: number; label?: string }) {
  return (
    <div
      aria-hidden
      className="relative"
      style={{ width: size, height: size, transform: "rotate(-7deg)" }}
    >
      <div
        className="absolute"
        style={{
          inset: 0,
          clipPath:
            "polygon(50% 0%, 64% 4%, 78% 10%, 90% 22%, 96% 38%, 100% 52%, 95% 68%, 86% 82%, 72% 92%, 56% 98%, 40% 99%, 24% 92%, 12% 80%, 4% 64%, 1% 48%, 6% 32%, 14% 18%, 28% 8%, 42% 2%)",
          background:
            "radial-gradient(circle at 30% 26%, #c64523 0%, #a02d16 28%, #761e12 56%, #470d07 90%, #2a0604 100%)",
          boxShadow:
            "inset 5px 5px 9px rgba(255,205,165,0.22), inset -4px -6px 12px rgba(20,2,2,0.65), 2px 4px 8px rgba(0,0,0,0.55), 0 1px 1px rgba(0,0,0,0.4)",
        }}
      />
      <div
        className="absolute"
        style={{
          inset: "13%",
          borderRadius: "50%",
          border: "0.8px solid rgba(50,6,3,0.55)",
          boxShadow:
            "inset 0 1px 1px rgba(255,180,140,0.30), 0 1px 1px rgba(255,170,130,0.18), inset 0 -1px 2px rgba(20,0,0,0.4)",
        }}
      />
      <div
        className="absolute"
        style={{ inset: "19%", borderRadius: "50%", border: "0.5px solid rgba(255,170,130,0.20)" }}
      />
      <div
        className="absolute flex items-center justify-center"
        style={{ inset: 0, gap: size * 0.07 }}
      >
        <span
          style={{
            width: 2.5,
            height: 2.5,
            borderRadius: "50%",
            background: "rgba(50,6,3,0.6)",
            boxShadow: "0 1px 0 rgba(255,180,140,0.3)",
            marginTop: 2,
          }}
        />
        <span
          className="font-display italic"
          style={{
            fontSize: size * 0.46,
            fontWeight: 600,
            color: "rgba(56,7,3,0.9)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            textShadow:
              "0 1px 0 rgba(255,180,140,0.40), 0 -1px 1px rgba(20,0,0,0.7), 0 0 2px rgba(0,0,0,0.35)",
            transform: "translateY(-1px)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            width: 2.5,
            height: 2.5,
            borderRadius: "50%",
            background: "rgba(50,6,3,0.6)",
            boxShadow: "0 1px 0 rgba(255,180,140,0.3)",
            marginTop: 2,
          }}
        />
      </div>
      <div
        className="absolute"
        style={{
          top: "13%",
          left: "18%",
          width: "24%",
          height: "15%",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(255,210,180,0.40), transparent 70%)",
          filter: "blur(2px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

function SectionMonogram({
  motif,
  color,
  size = 40,
  fontSize = 18,
}: {
  motif: string;
  color: string;
  size?: number;
  fontSize?: number;
}) {
  return (
    <div
      aria-hidden
      className="relative flex items-center justify-center"
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "50%",
        background: `radial-gradient(circle at 32% 28%, ${color} 0%, rgba(0,0,0,0.45) 115%)`,
        boxShadow:
          "inset 0 1px 0 rgba(255,235,180,0.18), inset 0 -1px 2px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.4)",
        border: "0.5px solid rgba(184,146,77,0.5)",
      }}
    >
      <span
        className="font-display italic"
        style={{ fontSize, color: "var(--c-gold-300)", fontWeight: 600 }}
      >
        {motif}
      </span>
    </div>
  );
}

function Hedera({ width = 240 }: { width?: number }) {
  return (
    <div
      aria-hidden
      className="flex items-center justify-center"
      style={{ gap: 16, padding: "26px 0" }}
    >
      <div
        style={{
          flex: 1,
          maxWidth: width,
          height: 0.5,
          background: "linear-gradient(90deg, transparent, rgba(146,112,55,0.5))",
        }}
      />
      <svg width="22" height="16" viewBox="0 0 22 16" fill="none" style={{ flexShrink: 0 }}>
        <path
          d="M11 2.5 C13.4 2.5 15 4.4 15 7 C15 10 12.6 12.6 11 13.5 C9.4 12.6 7 10 7 7 C7 4.4 8.6 2.5 11 2.5 Z"
          fill="none"
          stroke="rgba(146,112,55,0.7)"
          strokeWidth="0.7"
        />
        <path
          d="M11 13.5 C11 11 11 9 11 6.4"
          stroke="rgba(146,112,55,0.7)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        <circle cx="11" cy="4.4" r="0.7" fill="rgba(184,146,77,0.8)" />
      </svg>
      <div
        style={{
          flex: 1,
          maxWidth: width,
          height: 0.5,
          background: "linear-gradient(90deg, rgba(146,112,55,0.5), transparent)",
        }}
      />
    </div>
  );
}

function StageBlock({ step, first }: { step: SalonStep; first: boolean }) {
  const labelColor = step.trap ? "var(--c-ink)" : "var(--c-gold-700)";
  const diamond: CSSProperties = step.trap
    ? {
        background: "radial-gradient(circle at 35% 30%, #c8512f, #7a1f14 85%)",
        border: "0.6px solid rgba(60,8,4,0.6)",
        boxShadow: "0 0 7px rgba(168,48,24,0.35), inset 0 1px 0 rgba(255,200,170,0.25)",
      }
    : step.n === "02"
    ? {
        background: "radial-gradient(circle at 35% 30%, #d9b878, #927037 85%)",
        border: "0.6px solid rgba(106,81,40,0.7)",
        boxShadow: "inset 0 1px 0 rgba(255,245,220,0.4)",
      }
    : {
        background: "transparent",
        border: "0.8px solid rgba(27,17,8,0.5)",
        boxShadow: "inset 0 1px 0 rgba(255,250,235,0.35)",
      };

  const textStyle: CSSProperties =
    step.tone === "serif"
      ? {
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 25,
          lineHeight: 1.42,
          letterSpacing: "-0.005em",
          color: "#231509",
        }
      : step.tone === "trap"
      ? {
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 20,
          lineHeight: 1.5,
          color: "rgba(122,31,20,0.92)",
        }
      : {
          fontFamily: "var(--font-manrope), system-ui, sans-serif",
          fontWeight: 400,
          fontSize: 15.5,
          lineHeight: 1.72,
          color: "rgba(27,17,8,0.84)",
        };

  return (
    <div className="relative flex" style={{ gap: 22 }} id={`stage-${step.n}`}>
      <div className="relative flex flex-col items-center" style={{ width: 16, flexShrink: 0 }}>
        {!first && <span style={{ width: 0.5, height: 26, background: "rgba(27,17,8,0.18)" }} />}
        <span
          style={{
            width: 11,
            height: 11,
            transform: "rotate(45deg)",
            flexShrink: 0,
            marginTop: first ? 8 : 0,
            ...diamond,
          }}
        />
        <span style={{ width: 0.5, flex: 1, background: "rgba(27,17,8,0.18)", marginTop: 8 }} />
      </div>

      <div style={{ flex: 1, paddingTop: first ? 4 : 0, paddingBottom: 8 }}>
        <div className="flex items-baseline" style={{ gap: 12, marginBottom: 14 }}>
          <span className="eyebrow" style={{ color: labelColor, fontSize: 11, letterSpacing: "0.26em" }}>
            {step.label}
          </span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(27,17,8,0.3)" }} />
          <span
            className="signature"
            style={{
              color: "rgba(27,17,8,0.45)",
              fontSize: 10.5,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {step.time}
          </span>
        </div>
        <p style={{ ...textStyle, textWrap: "pretty", margin: 0 }}>{step.text}</p>
      </div>
    </div>
  );
}

function StepNav({ steps }: { steps: SalonStep[] }) {
  const [active, setActive] = useState(steps[0]?.n ?? "01");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {steps.map((s) => {
        const on = s.n === active;
        return (
          <a
            key={s.n}
            href={`#stage-${s.n}`}
            onClick={() => setActive(s.n)}
            className="flex items-center justify-between"
            style={{
              gap: 12,
              padding: "11px 14px",
              textDecoration: "none",
              cursor: "pointer",
              borderLeft: on
                ? "2px solid var(--c-gold-500)"
                : "2px solid rgba(184,146,77,0.18)",
              background: on ? "rgba(184,146,77,0.08)" : "transparent",
              transition: "background .15s, border-color .15s",
            }}
          >
            <span className="flex items-center" style={{ gap: 12 }}>
              <span
                className="signature"
                style={{
                  color: on ? "var(--c-gold-300)" : "var(--c-paper-300)",
                  opacity: on ? 1 : 0.55,
                  fontSize: 11,
                }}
              >
                {s.n}
              </span>
              <span
                className="eyebrow"
                style={{
                  color: on ? "var(--c-paper-100)" : "var(--c-paper-300)",
                  opacity: on ? 1 : 0.7,
                  fontSize: 10,
                  letterSpacing: "0.18em",
                }}
              >
                {s.label}
              </span>
            </span>
            <span
              className="signature"
              style={{
                color: s.trap ? "rgba(200,81,47,0.8)" : "var(--c-gold-400)",
                opacity: 0.7,
                fontSize: 10,
                letterSpacing: "0.08em",
              }}
            >
              {s.time}
            </span>
          </a>
        );
      })}
    </div>
  );
}

function WaxPrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const hot = hover && !disabled;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="eyebrow flex items-center justify-center"
      style={{
        width: "100%",
        padding: "15px 22px",
        cursor: disabled ? "default" : "pointer",
        gap: 10,
        color: "#f4d9b0",
        fontSize: 11,
        letterSpacing: "0.22em",
        border: "0.5px solid rgba(216,150,90,0.55)",
        opacity: disabled ? 0.55 : 1,
        background: hot
          ? "radial-gradient(circle at 30% 20%, #7a1f14, #4e0f0a 90%)"
          : "radial-gradient(circle at 30% 20%, #6a1810, #3f0b07 90%)",
        boxShadow: hot
          ? "inset 0 1px 0 rgba(255,190,150,0.35), 0 6px 18px -6px rgba(90,20,16,0.7)"
          : "inset 0 1px 0 rgba(255,190,150,0.25), 0 3px 10px -4px rgba(0,0,0,0.6)",
        transition: "background .2s, box-shadow .2s, opacity .2s",
      }}
    >
      {children}
      <span
        aria-hidden
        style={{
          fontSize: 13,
          transform: hot ? "translateX(3px)" : "none",
          transition: "transform .2s",
          display: "inline-block",
        }}
      >
        →
      </span>
    </button>
  );
}

function GoldGhost({
  children,
  href,
  accentRed,
}: {
  children: ReactNode;
  href: string;
  accentRed?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const c = accentRed ? "rgba(200,81,47,0.9)" : "var(--c-gold-400)";
  const edge = accentRed ? "rgba(168,48,24,0.5)" : "rgba(184,146,77,0.45)";
  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="eyebrow flex items-center justify-center"
      style={{
        flex: 1,
        padding: "13px 16px",
        cursor: "pointer",
        gap: 8,
        color: hover ? (accentRed ? "#e08a6a" : "var(--c-gold-300)") : c,
        fontSize: 10,
        letterSpacing: "0.2em",
        border: `0.5px solid ${edge}`,
        background: hover
          ? accentRed
            ? "rgba(168,48,24,0.10)"
            : "rgba(184,146,77,0.08)"
          : "transparent",
        textDecoration: "none",
        transition: "color .15s, background .15s",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Link>
  );
}
