"use client";

import { Volume2 } from "lucide-react";

/** Język wymowy dla sekcji językowej. Null = sekcja nie-językowa (bez TTS). */
export function langForVaultSlug(slug?: string | null): string | null {
  if (slug === "es") return "es-ES";
  if (slug === "en") return "en-GB";
  return null;
}

/** Czyta tekst na głos przez Web Speech API (wbudowane w przeglądarkę, bez
 *  zewnętrznych usług). Cicho nie robi nic, gdy API jest niedostępne. */
export function SpeakButton({
  text,
  lang,
  className,
}: {
  text: string;
  lang: string;
  className?: string;
}) {
  function speak() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.95;
    const voices = synth.getVoices();
    const match =
      voices.find((v) => v.lang === lang) ??
      voices.find((v) => v.lang.startsWith(lang.slice(0, 2)));
    if (match) u.voice = match;
    synth.speak(u);
  }

  return (
    <button
      type="button"
      onClick={speak}
      aria-label="Przeczytaj na głos"
      title="Przeczytaj na głos"
      className={
        className ??
        "inline-flex items-center justify-center w-7 h-7 rounded-full text-muted hover:text-gold transition-colors shrink-0"
      }
    >
      <Volume2 className="w-4 h-4" />
    </button>
  );
}
