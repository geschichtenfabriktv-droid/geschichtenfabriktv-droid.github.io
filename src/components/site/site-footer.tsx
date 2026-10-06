import Link from "next/link";
import { Brand } from "@/components/ui/brand";

const COLUMNS = [
  {
    title: "Produkt",
    links: [
      { href: "/#funktionen", label: "Funktionen" },
      { href: "/preise/", label: "Preise & Tarife" },
      { href: "/demo/", label: "Test-Dashboard" },
      { href: "/rechner/", label: "Reselling-Rechner" },
      { href: "/#faq", label: "Häufige Fragen" },
    ],
  },
  {
    title: "Lösungen",
    links: [
      { href: "/arbitrage-software/", label: "Arbitrage-Software" },
      { href: "/reselling-tool/", label: "Reselling-Tool" },
      { href: "/amazon-ebay-arbitrage/", label: "Amazon-eBay-Arbitrage" },
      { href: "/vorbestellung-arbitrage/", label: "Vorbestellungen weiterverkaufen" },
      { href: "/insolvenzmasse-kaufen/", label: "Insolvenzmasse kaufen" },
    ],
  },
  {
    title: "Ratgeber",
    links: [
      { href: "/ratgeber/", label: "Alle Artikel" },
      { href: "/ratgeber/online-arbitrage-anleitung/", label: "Online-Arbitrage Anleitung" },
      { href: "/ratgeber/reselling-gewinn-berechnen/", label: "Gewinn berechnen" },
      { href: "/ratgeber/reselling-gewerbe-steuern/", label: "Gewerbe & Steuern" },
      { href: "/ratgeber/insolvenzversteigerung-ablauf/", label: "Insolvenzversteigerung" },
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
      <div className="mx-auto grid max-w-[1240px] gap-12 px-4 py-16 sm:px-6 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(5,1fr)] lg:px-10">
        <div>
          <Brand />
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-ink-2">
            Arbitrage-Chancen, Vorbestellungen und Insolvenzmassen finden, bewerten und auf Knopfdruck handeln.
          </p>
          <p className="mt-6 max-w-xs text-[13px] leading-relaxed text-muted">Server in der EU, Datenschutz nach DSGVO, Zahlung über Mollie.</p>
        </div>
        {COLUMNS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="text-[14px] font-semibold text-ink">{c.title}</p>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[14px] text-ink-2 transition-colors hover:text-ink hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-4 py-6 text-[12px] text-muted sm:px-6 md:flex-row md:justify-between lg:px-10">
          <p>© {new Date().getFullYear()} Arbitrage Radar</p>
          <p>Gewinnwahrscheinlichkeiten sind Schätzungen auf Basis von Marktdaten, keine Garantie und keine Anlageberatung.</p>
        </div>
      </div>
    </footer>
  );
}
