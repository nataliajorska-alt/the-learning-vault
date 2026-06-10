"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center text-center gap-10 py-10">
      <div>
        <div className="eyebrow">Katalog · Usterka</div>
        <h1 className="hero-italic text-4xl mt-2">Strona się rozsypała</h1>
      </div>

      <div className="catalog-card relative max-w-md w-full text-left animate-fadein">
        <header className="flex items-baseline justify-between gap-4 mb-3">
          <span className="catalog-sig">SYGN. ERR</span>
          <span className="catalog-meta">AWARIA</span>
        </header>
        <div className="catalog-title">Coś poszło nie tak</div>
        <p className="catalog-subtitle mt-2">
          Kartoteka się zacięła. Spróbuj otworzyć szufladę jeszcze raz —
          jeśli to się powtarza, wróć do czytelni i spróbuj innej półki.
        </p>
        {error.digest && (
          <div className="catalog-footer mt-3">REF. {error.digest}</div>
        )}
        <span
          className="catalog-stamp"
          style={{ color: "#9A3F1E", borderColor: "#9A3F1E" }}
          aria-hidden
        >
          Uszkodzona
        </span>
        <span className="catalog-perforation" aria-hidden>
          <span className="catalog-hole" />
        </span>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <button onClick={reset} className="btn-primary">
          Spróbuj ponownie
        </button>
        <Link href="/" className="btn-ghost">
          Wróć do czytelni
        </Link>
      </div>
    </div>
  );
}
