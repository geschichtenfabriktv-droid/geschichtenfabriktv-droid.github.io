"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site/site-header";
import { LinkButton } from "@/components/ui/button";
import { DashboardModeProvider, DEMO_ROUTES } from "@/lib/client/dashboard-mode";

const TABS = [
  { href: DEMO_ROUTES.list, label: "Arbitrage-Chancen" },
  { href: DEMO_ROUTES.lots, label: "Insolvenzmassen" },
];

/** Test-Dashboard ohne Anmeldung: drei Chancen je Kategorie, Aktionen führen zu den Tarifen. */
export function DemoShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  return (
    <DashboardModeProvider mode="demo">
      <div className="min-h-dvh bg-canvas">
        <SiteHeader />
        <div className="border-b border-line bg-white">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">Test-Dashboard</p>
              <p className="mt-1 text-[14px] text-ink-2">Die drei besten Chancen je Kategorie mit Beispieldaten. Im Tarif: alle Treffer, Live-Preise, Kaufen & Einstellen.</p>
            </div>
            <LinkButton href="/preise/" size="sm" className="self-start md:self-auto">
              Vollzugang freischalten
            </LinkButton>
          </div>
          <nav className="mx-auto flex max-w-[1240px] gap-1 px-4 sm:px-6 lg:px-10" aria-label="Test-Dashboard">
            {TABS.map((t) => {
              const active = t.href === DEMO_ROUTES.lots ? pathname.includes("/demo/insolvenzen") : !pathname.includes("/demo/insolvenzen");
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={`border-b-2 px-3 py-3 text-sm font-medium transition ${active ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"}`}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <main className="pb-16">
          <div className="mx-auto w-full max-w-[1240px] px-4 pt-8 sm:px-6 lg:px-10">{children}</div>
        </main>
      </div>
    </DashboardModeProvider>
  );
}
