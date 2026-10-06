import "server-only";
import type { AuctionLink, Deal, MarketSource } from "@/lib/domain/types";
import type { Country } from "@/lib/pricing";
import { isAwinConfigured, scanAwin } from "./awin";
import { AUCTION_FEEDS, listAuctions } from "./court-auctions";
import { isKeepaConfigured, scanKeepa } from "./keepa";
import { EBAY_MARKETS, isEbayBrowseConfigured, scanEbay, type Stats } from "./live-market";

const NOT_CONNECTED = "Nicht verbunden.";

export interface MarketScan {
  deals: Deal[];
  auctions: AuctionLink[];
  sources: MarketSource[];
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

  const [ebay, keepa, ...auctionResults] = await Promise.allSettled([
    isEbayBrowseConfigured() ? scanEbay(now, countries) : Promise.resolve(null),
    isKeepaConfigured() && de ? scanKeepa(now) : Promise.resolve(null),
    ...AUCTION_FEEDS.map((f) => (de ? listAuctions(f, now) : Promise.resolve([]))),
  ]);

  let ebayStats = new Map<string, Stats>();
  for (const country of countries) {
    const name = `${EBAY_MARKETS[country].platform} (Marktpreise und Angebote${country === "CH" ? ", in Euro umgerechnet zum EZB-Kurs" : ""})`;
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

  const keepaName = "Amazon.de über Keepa (Preise und Preisverlauf)";
  if (keepa.status === "fulfilled" && keepa.value) {
    deals.push(...keepa.value.deals);
    sources.push({ id: "keepa", name: keepaName, live: true, note: failedNote(keepa.value.failed) });
  } else if (de) {
    sources.push({ id: "keepa", name: keepaName, live: false, note: keepa.status === "rejected" ? "Antwortet gerade nicht." : NOT_CONNECTED });
  }

  const awinName = "Händler-Feeds über Awin (MediaMarkt, Saturn, Otto u. a.)";
  if (isAwinConfigured() && de) {
    try {
      const awin = await scanAwin(ebayStats, now);
      deals.push(...awin.deals);
      sources.push({ id: "awin", name: awinName, live: true, note: ebayStats.size ? `${awin.offers} Händlerangebote geprüft.` : "Bewertung braucht eBay als Marktpreis." });
    } catch (e) {
      sources.push({ id: "awin", name: awinName, live: false, note: e instanceof Error ? e.message : "Feed nicht lesbar." });
    }
  } else if (de) {
    sources.push({ id: "awin", name: awinName, live: false, note: NOT_CONNECTED });
  }

  const auctions: AuctionLink[] = [];
  AUCTION_FEEDS.forEach((feed, i) => {
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

  return { deals: dedupe(deals, (d) => d.source.url), auctions: dedupe(auctions, (a) => a.url), sources };
}
