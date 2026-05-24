import type { ReactNode } from "react";

interface Props {
  label: string;
  value: ReactNode;
  prefix?: string;
  suffix?: string;
  sub?: string;
}

export function BrassPlaque({ label, value, prefix, suffix, sub }: Props) {
  return (
    <div
      className="relative"
      style={{
        padding: "28px 32px 26px",
        borderRadius: 2,
        background:
          "linear-gradient(135deg, #d5b06a 0%, #b08838 30%, #8a6926 55%, #ad8538 78%, #c89e54 100%)",
        boxShadow:
          "inset 0 1.5px 0 rgba(255,235,180,0.5), inset 0 -2px 0 rgba(40,22,8,0.55), inset 1px 0 0 rgba(255,235,180,0.18), inset -1px 0 0 rgba(40,22,8,0.3), 0 14px 24px -10px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.4)",
        isolation: "isolate",
      }}
    >
      {/* brushed striations */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(135deg, rgba(255,235,180,0) 0px, rgba(255,235,180,0.03) 1px, rgba(40,22,8,0) 2px, rgba(40,22,8,0.04) 3px)",
          opacity: 0.7,
        }}
      />
      {/* sheen */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 25% 15%, rgba(255,240,200,0.32), transparent 55%)",
        }}
      />
      {/* fine grain via inline SVG noise */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='b'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.18  0 0 0 0 0.10  0 0 0 0 0.04  0 0 0 0.28 0'/></filter><rect width='100%25' height='100%25' filter='url(%23b)'/></svg>\")",
          mixBlendMode: "multiply",
          opacity: 0.55,
        }}
      />
      {/* rivets in corners */}
      {[
        { t: 9, l: 9 },
        { t: 9, r: 9 },
        { b: 9, l: 9 },
        { b: 9, r: 9 },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: 7,
            height: 7,
            top: p.t,
            right: p.r,
            bottom: p.b,
            left: p.l,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 32% 28%, #f0d090 0%, #a8782c 45%, #4a2a08 80%, #1a0f05 100%)",
            boxShadow:
              "inset 0 0 0 0.5px rgba(0,0,0,0.7), 0 1px 1px rgba(255,230,170,0.35)",
          }}
        />
      ))}

      <div className="relative" style={{ zIndex: 2 }}>
        <div
          className="eyebrow"
          style={{
            color: "#3a2410",
            opacity: 0.78,
            textShadow: "0 1px 0 rgba(255,235,180,0.45)",
          }}
        >
          {label}
        </div>
        <div
          className="flex items-baseline"
          style={{ marginTop: 10, gap: 6 }}
        >
          {prefix && (
            <span
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 22,
                color: "#2a1808",
                opacity: 0.75,
              }}
            >
              {prefix}
            </span>
          )}
          <span
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: 52,
              lineHeight: 0.95,
              color: "#1f1208",
              letterSpacing: "-0.02em",
              textShadow:
                "0 1px 0 rgba(255,235,180,0.55), 0 -0.5px 0 rgba(0,0,0,0.35), 0 2px 3px rgba(0,0,0,0.25)",
            }}
          >
            {value}
          </span>
          {suffix && (
            <span
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 22,
                color: "#2a1808",
                opacity: 0.78,
                marginBottom: 6,
              }}
            >
              {suffix}
            </span>
          )}
        </div>
        {sub && (
          <div
            className="signature"
            style={{
              color: "#3a2410",
              opacity: 0.7,
              marginTop: 8,
              textShadow: "0 1px 0 rgba(255,235,180,0.35)",
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
