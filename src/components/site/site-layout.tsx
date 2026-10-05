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

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1320px] px-4 pt-14 pb-10 sm:px-6 md:pt-20 lg:px-10">
      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">{eyebrow}</p>
      <h1 className="mt-4 max-w-4xl font-display text-[46px] leading-[0.98] tracking-tight md:text-[76px]">{title}</h1>
      {children && <div className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-2">{children}</div>}
    </div>
  );
}
