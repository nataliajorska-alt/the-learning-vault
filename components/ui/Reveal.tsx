"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* Sekcja wjeżdża delikatnie przy scrollu. Stan bazowy jest widoczny —
   .is-in odpala animację od ukrytego do widocznego, a po jej zakończeniu
   .settled zdejmuje animację timerem (działa nawet przy zamrożonym zegarze
   animacji), więc sekcja nigdy nie zostaje w klatce 0. */
export function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const show = () => {
      el.classList.add("is-in");
      timer = setTimeout(() => el.classList.add("settled"), 800 + delay);
    };
    // elementy już w kadrze przy starcie — pokaż od razu, bez obserwatora
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      show();
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show();
            io.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [delay]);

  return (
    <div ref={ref} className="reveal" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
