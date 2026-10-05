"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/konto/", label: "Abo & Rechnungen" },
  { href: "/konto/verbindungen/", label: "Verbindungen" },
  { href: "/konto/daten/", label: "Profil & Datenschutz" },
];

export function KontoTabs() {
  const path = usePathname() ?? "";
  const normalized = path.endsWith("/") ? path : `${path}/`;
  return (
    <div className="mb-8">
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">Kundenkonto</p>
      <nav className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0" aria-label="Kundenkonto">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            aria-current={normalized === t.href ? "page" : undefined}
            className={`flex h-10 shrink-0 items-center rounded-full px-4 text-[13px] font-medium transition ${normalized === t.href ? "bg-ink text-white" : "bg-white text-ink-2 ring-1 ring-line hover:text-ink"}`}
          >
            {t.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
