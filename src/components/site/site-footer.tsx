import Link from "next/link";
import { Brand } from "@/components/ui/brand";

const COLUMNS = [
  {
    title: "Produkt",
    links: [
      { href: "/#funktionen", label: "Funktionen" },
      { href: "/preise/", label: "Preise & Tarife" },
      { href: "/demo/", label: "Test-Dashboard" },
      { href: "/#faq", label: "Häufige Fragen" },
    ],
  },
  {
    title: "Konto",
    links: [
      { href: "/login/", label: "Anmelden" },
      { href: "/registrieren/", label: "Registrieren" },
      { href: "/kuendigen/", label: "Verträge hier kündigen" },
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { href: "/impressum/", label: "Impressum" },
      { href: "/datenschutz/", label: "Datenschutz" },
      { href: "/agb/", label: "AGB" },
      { href: "/widerruf/", label: "Widerrufsbelehrung" },
      { href: "/avv/", label: "Auftragsverarbeitung" },
    ],
  },
];

/** Footer ohne Personendaten: nur Markenname. Angaben zum Anbieter stehen ausschließlich im Impressum. */
export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-10">
        <div>
          <Brand />
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-ink-2">
            Arbitrage-Chancen, Vorbestellungen und Insolvenzmassen finden, bewerten und auf Knopfdruck handeln.
          </p>
          <p className="mt-6 flex flex-wrap gap-2 text-[12px] text-muted">
            <span className="rounded-full ring-1 ring-line px-2.5 py-1">Hosting in der EU</span>
            <span className="rounded-full ring-1 ring-line px-2.5 py-1">DSGVO-konform</span>
            <span className="rounded-full ring-1 ring-line px-2.5 py-1">Zahlung über Mollie</span>
          </p>
        </div>
        {COLUMNS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">{c.title}</p>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[14px] text-ink-2 transition hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-4 py-6 text-[12px] text-muted sm:px-6 md:flex-row md:justify-between lg:px-10">
          <p>© {new Date().getFullYear()} Arbitrage Radar</p>
          <p>Gewinnwahrscheinlichkeiten sind Schätzungen auf Basis von Marktdaten, keine Garantie und keine Anlageberatung.</p>
        </div>
      </div>
    </footer>
  );
}
