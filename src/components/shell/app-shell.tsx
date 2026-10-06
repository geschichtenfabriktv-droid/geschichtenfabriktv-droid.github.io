"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Brand } from "@/components/ui/brand";
import { IconBox, IconGavel, IconGrid, IconSettings, IconSpark, IconUser } from "@/components/ui/icons";
import { useSessionUser } from "@/lib/client/user-context";
import { getPlan } from "@/lib/pricing";
import { usePortfolio } from "@/lib/client/portfolio-store";

const NAV = [
  { href: "/app/", label: "Übersicht", short: "Übersicht", icon: IconGrid, exact: true },
  { href: "/app/chancen/", label: "Arbitrage-Chancen", short: "Chancen", icon: IconSpark },
  { href: "/app/insolvenzen/", label: "Insolvenzmassen", short: "Insolvenz", icon: IconGavel },
  { href: "/app/portfolio/", label: "Portfolio", short: "Portfolio", icon: IconBox, badge: true },
  { href: "/app/einstellungen/", label: "Strategie", short: "Strategie", icon: IconSettings, desktopOnly: true },
  { href: "/konto/", label: "Konto & Abo", short: "Konto", icon: IconUser },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/app/";
  const { orders, listings } = usePortfolio();
  const user = useSessionUser();
  const openItems = orders.filter((o) => o.status !== "eingetroffen").length + listings.filter((l) => l.status === "aktiv").length;

  const isActive = (href: string, exact?: boolean) => {
    const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
    return exact ? path === href : path.startsWith(href);
  };

  return (
    <div className="min-h-dvh bg-canvas">
      {/* Seitenleiste Desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-line bg-white px-5 py-6 lg:flex">
        <div className="px-2">
          <Brand href="/" />
        </div>
        <nav className="mt-10 flex flex-col gap-1" aria-label="Hauptnavigation">
          {NAV.map(({ href, label, icon: Icon, ...item }) => {
            const active = isActive(href, "exact" in item && item.exact);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${
                  active ? "bg-ink text-white" : "text-ink-2 hover:bg-canvas hover:text-ink"
                }`}
              >
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                {"badge" in item && openItems > 0 && (
                  <span className={`tabular rounded-full px-2 py-0.5 text-[11px] ${active ? "bg-white/15" : "bg-canvas text-ink"}`}>{openItems}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl bg-canvas p-4">
          <p className="flex items-center gap-2 text-[13px] font-semibold">
            <span className="size-2 rounded-full bg-good animate-pulse-dot" aria-hidden /> Dashboard aktiv
          </p>
          {user ? (
            <p className="mt-1 truncate text-[12px] leading-relaxed text-muted">
              {getPlan(user.plan)?.name ?? "Kein Tarif"} · {user.email}
            </p>
          ) : (
            <p className="mt-1 text-[12px] leading-relaxed text-muted">Verbinde deine Marktplätze im Konto.</p>
          )}
        </div>
      </aside>

      {/* Kopfzeile Smartphone */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white/85 px-4 backdrop-blur-xl lg:hidden">
        <Brand href="/" />
        <span className="flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 text-[11px] font-semibold text-ink-2">
          <span className="size-1.5 rounded-full bg-good animate-pulse-dot" aria-hidden /> {getPlan(user?.plan)?.name ?? "Konto"}
        </span>
      </header>

      <main className="pb-28 lg:pb-12 lg:pl-[264px]">
        <div className="mx-auto w-full max-w-[1240px] px-4 pt-6 sm:px-6 lg:px-10 lg:pt-10">{children}</div>
      </main>

      {/* Tab-Leiste Smartphone */}
      <nav
        aria-label="Hauptnavigation"
        className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/90 backdrop-blur-xl lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {NAV.filter((n) => !("desktopOnly" in n)).map(({ href, short, icon: Icon, ...item }) => {
            const active = isActive(href, "exact" in item && item.exact);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex h-16 flex-col items-center justify-center gap-1 text-[10.5px] font-medium transition ${active ? "text-ink" : "text-muted"}`}
                >
                  <Icon size={22} strokeWidth={active ? 2 : 1.6} />
                  {short}
                  {"badge" in item && openItems > 0 && (
                    <span className="tabular absolute top-2 left-1/2 ml-2 min-w-4 rounded-full bg-ink px-1 text-center text-[10px] leading-4 text-white">{openItems}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">{eyebrow}</p>}
        <h1 className="mt-2 font-display text-[40px] leading-[1.02] tracking-tight md:text-[52px]">{title}</h1>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
