"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand } from "@/components/ui/brand";
import { LinkButton } from "@/components/ui/button";
import { IconClose } from "@/components/ui/icons";

const LINKS = [
  { href: "/#funktionen", label: "Funktionen" },
  { href: "/demo/", label: "Test-Dashboard" },
  { href: "/preise/", label: "Preise" },
  { href: "/ratgeber/", label: "Ratgeber" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`sticky top-0 z-40 bg-white transition-[border-color] duration-200 ${scrolled || open ? "border-b border-line" : "border-b border-transparent"}`}>
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-10">
          <Brand />
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Seitennavigation">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-[15px] font-medium text-ink-2 underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors hover:text-ink hover:decoration-tag">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login/" className="hidden h-9 items-center rounded-[var(--radius-control)] px-3 text-[14px] font-medium text-ink-2 hover:bg-canvas hover:text-ink sm:inline-flex">
              Anmelden
            </Link>
            <LinkButton href="/preise/" size="sm">
              Jetzt starten
            </LinkButton>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-[var(--radius-control)] ring-1 ring-inset ring-line-strong lg:hidden"
              aria-label={open ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? (
                <IconClose size={18} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                  <path d="M4 8h16M4 16h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {open && (
          <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-white px-4 pt-4 pb-10 animate-fade lg:hidden">
            <nav className="flex flex-col" aria-label="Mobile Navigation">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-line py-4 font-display text-[26px]">
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 grid gap-3">
              <LinkButton href="/preise/" size="lg" onClick={() => setOpen(false)}>
                Jetzt starten
              </LinkButton>
              <LinkButton href="/login/" variant="secondary" size="lg" onClick={() => setOpen(false)}>
                Anmelden
              </LinkButton>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
