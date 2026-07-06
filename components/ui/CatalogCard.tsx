import Link from "next/link";
import { BookOpen, Pencil } from "lucide-react";
import type { ReactNode } from "react";
import { ZoomTrigger } from "@/components/ui/Lightbox";

export type StampColor = "red" | "green" | "blue" | "orange" | "gold";

const STAMP_COLORS: Record<StampColor, string> = {
  red: "#8B2E1F",
  green: "#2D5A3F",
  blue: "#3F4A6B",
  orange: "#9A3F1E",
  gold: "#7A5E2E",
};

interface CatalogCardProps {
  signature: string;
  rightMeta?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  footer?: ReactNode;
  stamp?: { label: string; color: StampColor };
  /** postęp serii do opanowania — wypełnione pipsy z total (+ opcjonalna nota) */
  mastery?: { filled: number; total: number; note?: string };
  imageUrl?: string;
  imageCaption?: string;
  href?: string;
  /** jeśli podany, w rogu karty pojawia się dyskretna ikona edycji prowadząca tu */
  editHref?: string;
  /** jeśli podany, pod ikoną edycji pojawia się wejście do czytelni (lektura bez testu) */
  readHref?: string;
  delayMs?: number;
}

export function CatalogCard({
  signature,
  rightMeta,
  title,
  subtitle,
  footer,
  stamp,
  mastery,
  imageUrl,
  imageCaption,
  href,
  editHref,
  readHref,
  delayMs = 0,
}: CatalogCardProps) {
  const inner = (
    <article
      className="catalog-card relative animate-fadein"
      style={{
        animationDelay: `${delayMs}ms`,
      }}
    >
      <header className="flex items-baseline justify-between gap-4 mb-3">
        <span className="catalog-sig">{signature}</span>
        {rightMeta !== undefined && (
          <span className="catalog-meta">{rightMeta}</span>
        )}
      </header>

      <div className="catalog-title">{title}</div>

      {subtitle && <div className="catalog-subtitle mt-2">{subtitle}</div>}

      {mastery && (
        <div
          className="mt-3 flex items-center flex-wrap"
          style={{ gap: 6 }}
          role="img"
          aria-label={`Postęp opanowania: ${mastery.filled} z ${mastery.total}${
            mastery.note ? ` — ${mastery.note}` : ""
          }`}
        >
          {Array.from({ length: mastery.total }, (_, i) => (
            <span
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background:
                  i < mastery.filled ? "var(--c-gold-500, #B8924D)" : "transparent",
                border: "1px solid rgba(146,112,55,0.75)",
                boxShadow:
                  i < mastery.filled
                    ? "inset 0 -1px 1px rgba(0,0,0,0.25)"
                    : "none",
              }}
            />
          ))}
          {mastery.note && (
            <span
              className="signature"
              style={{
                color: "rgba(27,17,8,0.6)",
                fontSize: 10,
                fontStyle: "italic",
                marginLeft: 4,
              }}
            >
              {mastery.note}
            </span>
          )}
        </div>
      )}

      {imageUrl && (
        <figure
          className="mt-4 overflow-hidden"
          style={{
            border: "0.5px solid rgba(122,74,31,0.28)",
            background: "rgba(27,17,8,0.08)",
          }}
        >
          {/* stopLink: karta jest Linkiem — klik w obraz powiększa, nie nawiguje */}
          <ZoomTrigger
            src={imageUrl}
            caption={imageCaption ?? (typeof title === "string" ? title : undefined)}
            stopLink
          >
            <img
              src={imageUrl}
              alt={imageCaption ?? (typeof title === "string" ? title : "Ilustracja tematu")}
              loading="lazy"
              style={{
                width: "100%",
                height: 150,
                objectFit: "cover",
                display: "block",
                filter: "saturate(0.92) contrast(0.98)",
              }}
            />
          </ZoomTrigger>
          {imageCaption && (
            <figcaption
              className="signature"
              style={{
                color: "rgba(27,17,8,0.55)",
                fontSize: 9,
                lineHeight: 1.35,
                padding: "7px 9px",
              }}
            >
              {imageCaption}
            </figcaption>
          )}
        </figure>
      )}

      {footer && <div className="catalog-footer mt-3">{footer}</div>}

      {stamp && (
        <span
          className="catalog-stamp"
          style={{
            color: STAMP_COLORS[stamp.color],
            borderColor: STAMP_COLORS[stamp.color],
          }}
          aria-hidden
        >
          {stamp.label}
        </span>
      )}

      {/* perforated bottom edge with punch hole */}
      <span className="catalog-perforation" aria-hidden>
        <span className="catalog-hole" />
      </span>
    </article>
  );

  const editButton = editHref ? (
    <Link
      href={editHref}
      aria-label="Edytuj temat"
      title="Edytuj temat"
      className="absolute top-2 right-2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-cream/85 border border-line text-muted opacity-40 hover:opacity-100 hover:text-gold focus-visible:opacity-100 focus-visible:text-gold transition-opacity"
    >
      <Pencil className="w-3.5 h-3.5" />
    </Link>
  ) : null;

  const readButton = readHref ? (
    <Link
      href={readHref}
      aria-label="Otwórz w czytelni (lektura bez testu)"
      title="Czytelnia — lektura bez testu"
      className="absolute top-11 right-2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-cream/85 border border-line text-muted opacity-40 hover:opacity-100 hover:text-gold focus-visible:opacity-100 focus-visible:text-gold transition-opacity"
    >
      <BookOpen className="w-3.5 h-3.5" />
    </Link>
  ) : null;

  const corner =
    editButton || readButton ? (
      <>
        {editButton}
        {readButton}
      </>
    ) : null;

  if (href) {
    const link = (
      <Link href={href} className="catalog-link block group">
        {inner}
      </Link>
    );
    if (!corner) return link;
    return (
      <div className="relative">
        {link}
        {corner}
      </div>
    );
  }

  if (!corner) return inner;
  return (
    <div className="relative">
      {inner}
      {corner}
    </div>
  );
}
