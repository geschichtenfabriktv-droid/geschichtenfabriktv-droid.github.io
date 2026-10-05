"use client";

import { useEffect, useState } from "react";
import { Brand } from "@/components/ui/brand";
import { LinkButton } from "@/components/ui/button";

const LINKS = [
  { href: "#funktionen", label: "Funktionen" },
  { href: "#analyse", label: "Analyse" },
  { href: "#kategorien", label: "Kategorien" },
  { href: "#ablauf", label: "Ablauf" },
  { href: "#faq", label: "FAQ" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "border-b border-line bg-white/80 backdrop-blur-xl" : "border-b border-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-10">
        <Brand />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Seitennavigation">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-ink-2 transition hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <LinkButton href="/app/" size="sm">
          Dashboard öffnen
        </LinkButton>
      </div>
    </header>
  );
}
