import "server-only";
import type { AuctionLink, Deal, MarketSource, NewsItem } from "@/lib/domain/types";
import type { Country } from "@/lib/pricing";
import { isAwinConfigured, scanAwin } from "./awin";
import { AUCTION_FEEDS, listAuctions } from "./court-auctions";
import { env } from "./env";
import { isKeepaConfigured, scanKeepa } from "./keepa";
import { isEbayBrowseConfigured, scanEbay, type Stats } from "./live-market";
import { scanNews } from "./release-news";
import { scanOpenSources, type ExtraScan } from "./sources";

/** Im Dashboard werden Quellen nur neutral beschrieben, ohne Anbieternamen. */
const COUNTRY_NAME: Record<Country, string> = { DE: "Deutschland", AT: "Österreich", CH: "Schweiz" };

const NOT_CONNECTED = "Nicht verbunden.";

export interface MarketScan {
  deals: Deal[];
  auctions: AuctionLink[];
  sources: MarketSource[];
  news: NewsItem[];
}

/** Dasselbe Angebot nur einmal: gleiche Adresse oder gleiche Kennung gilt als Dublette, das erste gewinnt. */
export function dedupe<T extends { id: string }>(items: T[], url: (item: T) => string | undefined): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const keys = [`id:${item.id}`, ...(url(item) ? [`url:${url(item)!.replace(/[?#].*$/, "").replace(/\/$/, "")}`] : [])];
    if (keys.some((k) => seen.has(k))) return false;
    keys.forEach((k) => seen.add(k));
    return true;
  });
}

/**
 * Fragt alle echten Quellen für die gewählten Länder ab. Jede Quelle liefert, sobald ihr Zugang in den
 * Umgebungsvariablen steht; ohne Zugang steht sie in `sources` als nicht verbunden.
 */
export async function scanMarket(countries: Country[], now: Date): Promise<MarketScan> {
  const sources: MarketSource[] = [];
  const deals: Deal[] = [];
  const de = countries.includes("DE");
  const failedNote = (failed: number) => (failed ? `${failed} Abfragen gerade nicht erreichbar.` : null);

  const on = (id: string) => !env.sourceOff(id);
  const feeds = AUCTION_FEEDS.filter((f) => on(f.id));
  // Offene Quellen ohne Schlüssel (src/server/sources) laufen parallel zu den übrigen.
  const extraScan: Promise<ExtraScan> = scanOpenSources(countries, now, on).catch(() => ({ deals: [], auctions: [], news: [], sources: [] }));

  const [ebay, keepa, news, ...auctionResults] = await Promise.allSettled([
    on("ebay") && isEbayBrowseConfigured() ? scanEbay(now, countries) : Promise.resolve(null),
    on("keepa") && isKeepaConfigured() && de ? scanKeepa(now) : Promise.resolve(null),
    on("news") ? scanNews(now) : Promise.resolve(null),
    ...feeds.map((f) => (de ? listAuctions(f, now) : Promise.resolve([]))),
  ]);

  let ebayStats = new Map<string, Stats>();
  for (const country of on("ebay") ? countries : []) {
    const name = `Marktpreise und Angebote ${COUNTRY_NAME[country]}${country === "CH" ? " (in Euro umgerechnet)" : ""}`;
    const id = `ebay-${country.toLowerCase()}`;
    if (ebay.status === "fulfilled" && ebay.value) {
      sources.push({ id, name, live: true, note: failedNote(ebay.value.failed[country] ?? 0) });
    } else {
      sources.push({ id, name, live: false, note: ebay.status === "rejected" ? "Antwortet gerade nicht." : NOT_CONNECTED });
    }
  }
  if (ebay.status === "fulfilled" && ebay.value) {
    deals.push(...ebay.value.deals);
    ebayStats = ebay.value.stats;
  }

  const keepaName = "Online-Marktplatz mit Preisverlauf";
  if (keepa.status === "fulfilled" && keepa.value) {
    deals.push(...keepa.value.deals);
    sources.push({ id: "keepa", name: keepaName, live: true, note: failedNote(keepa.value.failed) });
  } else if (de && on("keepa")) {
    sources.push({ id: "keepa", name: keepaName, live: false, note: keepa.status === "rejected" ? "Antwortet gerade nicht." : NOT_CONNECTED });
  }

  const awinName = "Händlerpreise aus Partner-Feeds";
  if (on("awin") && isAwinConfigured() && de) {
    try {
      const awin = await scanAwin(ebayStats, now);
      deals.push(...awin.deals);
      sources.push({ id: "awin", name: awinName, live: true, note: ebayStats.size ? `${awin.offers} Händlerangebote geprüft.` : "Bewertung braucht die Marktpreise." });
    } catch {
      sources.push({ id: "awin", name: awinName, live: false, note: "Gerade nicht lesbar." });
    }
  } else if (de && on("awin")) {
    sources.push({ id: "awin", name: awinName, live: false, note: NOT_CONNECTED });
  }

  const auctions: AuctionLink[] = [];
  feeds.forEach((feed, i) => {
    if (!de) return;
    const r = auctionResults[i]!;
    if (r.status === "fulfilled") {
      const links = r.value as AuctionLink[];
      auctions.push(...links.map((a) => ({ ...a, country: "DE" as const })));
      sources.push({ id: feed.id, name: feed.name, live: true, note: `${links.length} laufende Auktionen` });
    } else {
      sources.push({ id: feed.id, name: feed.name, live: false, note: "Gerade nicht erreichbar." });
    }
  });

  const newsName = "Hersteller-News (Neuheiten und Termine)";
  let newsItems: NewsItem[] = [];
  if (news.status === "fulfilled" && news.value) {
    newsItems = news.value.items;
    sources.push({ id: "news", name: newsName, live: news.value.live > 0, note: `${newsItems.length} Meldungen der letzten Wochen${news.value.failed ? `, ${news.value.failed} Feeds gerade nicht erreichbar` : ""}.` });
  } else if (on("news")) {
    sources.push({ id: "news", name: newsName, live: false, note: "Gerade nicht erreichbar." });
  }

  const extra = await extraScan;
  sources.push(...extra.sources);
  auctions.push(...extra.auctions);
  // Sammelkarten verlinken auf eine Suche (gleiche Adresse, andere Karte): nur nach Kennung zusammenführen.
  return {
    deals: dedupe([...dedupe(deals, (d) => d.source.url), ...extra.deals], () => undefined),
    auctions: dedupe(auctions, (a) => a.url),
    sources,
    news: dedupe([...dedupe(newsItems, (n) => n.url), ...extra.news], () => undefined),
  };
}
