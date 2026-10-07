import "server-only";
import type { AuctionLink, Deal, MarketSource, NewsItem } from "@/lib/domain/types";
import type { Country } from "@/lib/pricing";
import { listAuthorityAuctions } from "./authority-auctions";
import { scanCalendar } from "./release-calendar";
import { scanTradingCards } from "./trading-cards";

/**
 * Offene Quellen ohne Schlüssel. Jede schaltet sich automatisch zu und lässt sich mit SOURCES_OFF
 * einzeln abschalten. Kennungen: karten (Sammelkarten-Preise und -Neuheiten), kalender
 * (Erscheinungstermine Spiele und Konsolen), behoerden (Behördenauktionen).
 * Im Dashboard stehen nur neutrale Beschreibungen, keine Anbieternamen.
 */
export interface ExtraScan {
  deals: Deal[];
  auctions: AuctionLink[];
  news: NewsItem[];
  sources: MarketSource[];
}

const DOWN = "Gerade nicht erreichbar.";

export async function scanOpenSources(countries: Country[], now: Date, on: (id: string) => boolean): Promise<ExtraScan> {
  const de = countries.includes("DE");
  const [cards, calendar, authority] = await Promise.allSettled([
    on("karten") ? scanTradingCards(now) : Promise.resolve(null),
    on("kalender") ? scanCalendar(now) : Promise.resolve(null),
    on("behoerden") && de ? listAuthorityAuctions(now) : Promise.resolve(null),
  ]);
  const out: ExtraScan = { deals: [], auctions: [], news: [], sources: [] };

  if (cards.status === "fulfilled" && cards.value) {
    const c = cards.value;
    out.deals.push(...c.deals);
    out.news.push(...c.news);
    const note = c.partial
      ? `${c.checked} Karten geprüft, der Rest folgt beim nächsten Abruf.`
      : `${c.checked} Karten der neuesten Erweiterungen geprüft.`;
    out.sources.push({ id: "karten", name: "Sammelkarten-Marktpreise (Europa)", live: true, note });
  } else if (on("karten")) {
    out.sources.push({ id: "karten", name: "Sammelkarten-Marktpreise (Europa)", live: false, note: DOWN });
  }

  if (calendar.status === "fulfilled" && calendar.value) {
    out.news.push(...calendar.value);
    out.sources.push({ id: "kalender", name: "Erscheinungskalender Spiele und Konsolen", live: true, note: `${calendar.value.length} Termine in den nächsten 120 Tagen.` });
  } else if (on("kalender")) {
    out.sources.push({ id: "kalender", name: "Erscheinungskalender Spiele und Konsolen", live: false, note: DOWN });
  }

  if (authority.status === "fulfilled" && authority.value) {
    out.auctions.push(...authority.value.map((a) => ({ ...a, country: "DE" as const })));
    out.sources.push({ id: "behoerden", name: "Behördenauktionen (Zoll, Polizei, Kommunen)", live: true, note: `${authority.value.length} laufende Auktionen` });
  } else if (on("behoerden") && de) {
    out.sources.push({ id: "behoerden", name: "Behördenauktionen (Zoll, Polizei, Kommunen)", live: false, note: DOWN });
  }

  return out;
}
