"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  if (online) return null;

  return (
    <div
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 py-1.5 px-4"
      style={{
        background: "linear-gradient(180deg, #2c1d0e 0%, #1d130a 100%)",
        borderBottom: "1px solid rgba(184,146,77,0.35)",
        boxShadow: "inset 0 1px 0 rgba(184,146,77,0.2)",
        backdropFilter: "blur(8px)",
        color: "var(--c-gold-300)",
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: 10,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
      }}
    >
      <WifiOff className="w-3 h-3 stroke-[1.5]" />
      Offline — pracujesz na podręcznej kopii
    </div>
  );
}
