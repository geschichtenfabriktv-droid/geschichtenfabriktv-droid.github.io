import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip bg-white">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

/** Seitenkopf ohne Kicker: die Überschrift trägt sich selbst. `eyebrow` bleibt für bestehende Aufrufe erhalten. */
export function PageIntro({ title, children }: { eyebrow?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1240px] px-4 pt-14 pb-10 sm:px-6 md:pt-20 lg:px-10">
      <h1 className="max-w-4xl font-display text-[40px] leading-[1.04] md:text-[60px]">{title}</h1>
      {children && <div className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-2">{children}</div>}
    </div>
  );
}
