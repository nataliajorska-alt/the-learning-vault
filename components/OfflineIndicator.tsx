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
    <div className="fixed top-0 inset-x-0 z-50 bg-forest/95 text-cream text-xs tracking-wide py-1.5 px-4 flex items-center justify-center gap-2 backdrop-blur">
      <WifiOff className="w-3 h-3 stroke-[1.5]" />
      Offline — pracujesz na podręcznej kopii.
    </div>
  );
}
