"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Blendet Inhalte beim Scrollen weich ein. Ohne JavaScript bleibt alles sichtbar. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) return; // schon sichtbar: nicht animieren
    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`min-w-0 ${className} transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${state === "hidden" ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"}`}
      style={{ transitionDelay: state === "shown" ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}
