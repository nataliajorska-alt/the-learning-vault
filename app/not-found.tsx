import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center text-center gap-10 py-10">
      <div>
        <div className="eyebrow">Katalog · Sygnatura nieznaleziona</div>
        <h1 className="hero-italic text-4xl mt-2">Karta wypadła z szuflady</h1>
      </div>

      <div className="catalog-card relative max-w-md w-full text-left animate-fadein">
        <header className="flex items-baseline justify-between gap-4 mb-3">
          <span className="catalog-sig">SYGN. 404</span>
          <span className="catalog-meta">BRAK WPISU</span>
        </header>
        <div className="catalog-title">Tej strony nie ma w katalogu</div>
        <p className="catalog-subtitle mt-2">
          Albo karta zaginęła, albo nigdy jej tu nie było. Sprawdź adres
          jeszcze raz albo wróć do czytelni.
        </p>
        <div className="catalog-footer mt-3">404 · NOT FOUND</div>
        <span
          className="catalog-stamp"
          style={{ color: "#8B2E1F", borderColor: "#8B2E1F" }}
          aria-hidden
        >
          Zaginiona
        </span>
        <span className="catalog-perforation" aria-hidden>
          <span className="catalog-hole" />
        </span>
      </div>

      <Link href="/" className="btn-primary">
        Wróć do czytelni
      </Link>
    </div>
  );
}
