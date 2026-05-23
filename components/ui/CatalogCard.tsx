import Link from "next/link";
import type { ReactNode } from "react";

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
  href?: string;
  delayMs?: number;
}

export function CatalogCard({
  signature,
  rightMeta,
  title,
  subtitle,
  footer,
  stamp,
  href,
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

  if (href) {
    return (
      <Link href={href} className="catalog-link block group">
        {inner}
      </Link>
    );
  }
  return inner;
}
