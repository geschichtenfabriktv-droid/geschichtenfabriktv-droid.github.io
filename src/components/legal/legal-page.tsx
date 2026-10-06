import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteLayout } from "@/components/site/site-layout";

/** Rechtstexte: für Suchmaschinen gesperrt (zusätzlich robots.txt und X-Robots-Tag). */
export function legalMetadata(title: string): Metadata {
  return {
    title,
    description: undefined,
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
    openGraph: null,
  };
}

const NAV = [
  { href: "/impressum/", label: "Impressum" },
  { href: "/datenschutz/", label: "Datenschutz" },
  { href: "/agb/", label: "AGB" },
  { href: "/widerruf/", label: "Widerruf" },
  { href: "/avv/", label: "AVV" },
];

export function LegalPage({ title, updated, draft = true, children }: { title: string; updated: string; draft?: boolean; children: ReactNode }) {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1240px] px-4 pt-12 pb-24 sm:px-6 md:pt-16 lg:px-10">
        <nav aria-label="Rechtliches" className="-mx-1 flex gap-1 overflow-x-auto pb-2">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="shrink-0 rounded-[9px] px-3 py-1.5 text-[13px] text-ink-2 ring-1 ring-line hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>
        <h1 className="mt-8 font-display text-[34px] leading-[1.08] md:text-[48px]">{title}</h1>
        <p className="mt-4 text-[13px] text-muted">Stand: {updated}</p>
        {draft && (
        <p className="mt-4 max-w-3xl rounded-xl bg-[#fff7e6] p-4 text-[13px] leading-relaxed text-[#7a4b00] ring-1 ring-[#f3dca8]">
          Vorlage: Dieser Text wurde sorgfältig erstellt, ersetzt aber keine Rechtsberatung und wird vor dem Start anwaltlich geprüft.
        </p>
        )}
        <article className="legal mt-10 max-w-3xl">{children}</article>
      </div>
    </SiteLayout>
  );
}
