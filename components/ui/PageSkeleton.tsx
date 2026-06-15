import type { CSSProperties } from "react";

/** Spokojny szkielet ładowania w rytmie strony — zamiast migającej linijki
 *  „Ładuję…". Złoty odcień czyta się i na ciemnym kanwasie, i na papierze;
 *  puls respektuje prefers-reduced-motion. `header` rysuje placeholder nagłówka
 *  (dla pełnoekranowych stanów), pomiń go dla slotu treści pod gotowym Hero. */
export function PageSkeleton({
  header = true,
  rows = 3,
}: {
  header?: boolean;
  rows?: number;
}) {
  const bar = (w: CSSProperties["width"], h: number, mb = 0): CSSProperties => ({
    width: w,
    height: h,
    marginBottom: mb,
    background: "rgba(184,146,77,0.13)",
    borderRadius: 1,
  });

  return (
    <div className="animate-pulse motion-reduce:animate-none" aria-hidden>
      {header && (
        <div style={{ marginBottom: 36 }}>
          <div style={bar(110, 9, 12)} />
          <div style={bar("min(420px, 64%)", 30)} />
        </div>
      )}
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 80,
              background: "rgba(184,146,77,0.06)",
              border: "0.5px solid rgba(184,146,77,0.14)",
            }}
          />
        ))}
      </div>
      <span className="sr-only" role="status">
        Ładuję…
      </span>
    </div>
  );
}
