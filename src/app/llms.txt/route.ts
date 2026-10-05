import { ARTICLES, articlePath, LANDINGS, landingPath } from "@/lib/content";
import { PLANS } from "@/lib/pricing";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

/** Kurzüberblick für KI-Suchmaschinen (llms.txt). Nur Markenname, keine Personendaten. */
export function GET() {
  const lines = [
    "# Arbitrage Radar",
    "",
    "> Software für Online-Arbitrage und Reselling aus Deutschland: findet Preisgefälle zwischen Händlern und Marktplätzen, Vorbestell-Chancen und Insolvenzmassen, berechnet Break-even und Gewinnwahrscheinlichkeit und stellt Angebote per Knopfdruck auf eBay ein.",
    "",
    `Tarife: ${PLANS.map((p) => `${p.name} ${p.monthly} € pro Monat`).join(", ")}. Monatlich kündbar, 14 Tage Geld-zurück-Garantie. Hosting in der EU.`,
    "",
    "## Produkt",
    `- [Startseite](${absoluteUrl("/")}): Funktionen und Überblick`,
    `- [Preise](${absoluteUrl("/preise/")}): Tarife, Add-ons, Vergleich`,
    `- [Test-Dashboard](${absoluteUrl("/demo/")}): Top-3-Chancen je Kategorie ohne Anmeldung`,
    "",
    "## Lösungen",
    ...LANDINGS.map((l) => `- [${l.h1}](${absoluteUrl(landingPath(l.slug))}): ${l.description}`),
    "",
    "## Ratgeber",
    ...ARTICLES.map((a) => `- [${a.h1}](${absoluteUrl(articlePath(a.slug))}): ${a.description}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
