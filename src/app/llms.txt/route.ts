import { ARTICLES, articlePath, LANDINGS, landingPath } from "@/lib/content";
import { PLANS } from "@/lib/pricing";
import { env } from "@/server/env";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

/** Kurzüberblick für KI-Suchmaschinen (llms.txt). Nur Markenname, keine Personendaten. */
export function GET() {
  const lines = [
    "# Arbitrage Radar",
    "",
    "> Software für Online-Arbitrage und Reselling aus Deutschland: vergleicht Händlerpreise mit den Marktpreisen auf eBay und Amazon, bewertet Vorbestell-Chancen und Insolvenzmasse-Posten mit Maximalgebot, berechnet Break-even (inklusive Gebühren und Versand) und Gewinnwahrscheinlichkeit und stellt Angebote per Knopfdruck auf eBay ein.",
    "",
    `Tarife: ${PLANS.map((p) => `${p.name} ${p.monthly} € pro Monat`).join(", ")}. Monatlich kündbar, 14 Tage Geld-zurück-Garantie. Hosting in der EU.`,
    ...(env.countriesLive ? ["", "Länder: Deutschland in jedem Tarif, Österreich und Schweiz zusätzlich im Business-Tarif (Marktpreise von eBay.at und eBay.ch)."] : []),
    "",
    "## Produkt",
    `- [Startseite](${absoluteUrl("/")}): Funktionen und Überblick`,
    `- [Preise](${absoluteUrl("/preise/")}): Tarife, Erweiterungen, Vergleich`,
    `- [Test-Dashboard](${absoluteUrl("/demo/")}): Top-3-Chancen je Kategorie mit Beispieldaten, ohne Anmeldung`,
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
