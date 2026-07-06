"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/* ============================================================
   Lightbox — muzealne powiększenie reprodukcji.
   Portal do <body>, bo karty/strony używają transformów
   (fixed liczyłby się od przodka, nie od okna).
   ============================================================ */

interface LightboxProps {
  src: string;
  caption?: string;
  onClose: () => void;
}

export function Lightbox({ src, caption, onClose }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={caption ?? "Powiększona reprodukcja"}
      className="fixed inset-0 flex items-center justify-center animate-fadein"
      style={{
        zIndex: 1000,
        background: "rgba(10,6,3,0.9)",
        backdropFilter: "blur(2px)",
        padding: 24,
      }}
      onClick={onClose}
    >
      <figure
        onClick={(e) => e.stopPropagation()}
        style={{ margin: 0, maxWidth: "min(1080px, 94vw)" }}
      >
        <div
          style={{
            padding: 10,
            background: "linear-gradient(180deg, #241710 0%, #1a0f08 100%)",
            boxShadow:
              "0 30px 80px -20px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,230,180,0.12)",
          }}
        >
          <div style={{ padding: 4, border: "0.5px solid rgba(184,146,77,0.5)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={caption ?? "Reprodukcja dzieła"}
              style={{
                display: "block",
                maxWidth: "100%",
                maxHeight: "80vh",
                width: "auto",
                height: "auto",
                margin: "0 auto",
              }}
            />
          </div>
        </div>
        {caption && (
          <figcaption
            className="signature"
            style={{
              color: "var(--c-paper-300)",
              opacity: 0.78,
              fontSize: 11,
              fontStyle: "italic",
              textAlign: "center",
              marginTop: 10,
              lineHeight: 1.5,
            }}
          >
            {caption}
          </figcaption>
        )}
      </figure>
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Zamknij podgląd"
        className="absolute flex items-center justify-center"
        style={{
          top: 18,
          right: 18,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "0.5px solid rgba(184,146,77,0.5)",
          color: "var(--c-paper-100)",
          background: "rgba(27,17,8,0.65)",
          cursor: "pointer",
        }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>,
    document.body
  );
}

/* Klikalna oprawa obrazka: sama trzyma stan i otwiera Lightbox.
   stopLink — użyj wewnątrz <Link>, żeby klik nie nawigował. */
export function ZoomTrigger({
  src,
  caption,
  children,
  stopLink = false,
  style,
}: {
  src: string;
  caption?: string;
  children: ReactNode;
  stopLink?: boolean;
  style?: CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label="Powiększ reprodukcję"
        title="Powiększ"
        onClick={(e) => {
          if (stopLink) {
            e.preventDefault();
            e.stopPropagation();
          }
          setOpen(true);
        }}
        style={{
          display: "block",
          width: "100%",
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "zoom-in",
          ...style,
        }}
      >
        {children}
      </button>
      {open && (
        <Lightbox src={src} caption={caption} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
