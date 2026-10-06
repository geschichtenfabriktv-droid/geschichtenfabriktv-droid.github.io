import { analyzeDeal } from "@/lib/engine/analysis";
import { categoryAllowed, countriesAllowed, COUNTRIES, isCountry, type Country } from "@/lib/pricing";
import type { AnalyzedDeal, AuctionLink, Deal, MarketSource } from "@/lib/domain/types";
import { isAwinConfigured, scanAwin } from "@/server/awin";
import { AUCTION_FEEDS, listAuctions } from "@/server/court-auctions";
import { error, handler, json, requireUser } from "@/server/http";
import { isKeepaConfigured, scanKeepa } from "@/server/keepa";
import { EBAY_MARKETS, isEbayBrowseConfigured, scanEbay, type Stats } from "@/server/live-market";
import { hasAccess } from "@/server/users";

const NOT_CONNECTED = "Nicht verbunden.";

/**
 * Marktdaten für Kunden: ausschließlich echte Quellen. Jede Quelle liefert, sobald ihr Zugang in den
 * Umgebungsvariablen steht; ohne Zugang steht sie in `sources` als nicht verbunden. Beispieldaten gibt
 * es nur im öffentlichen Test-Dashboard.
 */
export const GET = handler(async (req) => {
  const user = await requireUser();
  if (!hasAccess(user)) return error("Für das Dashboard wird ein aktives Abo benötigt.", 402);
  const now = new Date();
  // Länder: ?laender=DE,AT,CH; nur, was der Tarif erlaubt, mindestens Deutschland.
  const allowed = countriesAllowed(user.plan);
  const wanted = (new URL(req.url).searchParams.get("laender") ?? "DE").split(",").filter(isCountry);
  const countries: Country[] = COUNTRIES.map((c) => c.id).filter((c) => wanted.includes(c) && allowed.includes(c));
  if (!countries.length) countries.push("DE");
  const sources: MarketSource[] = [];
  const deals: Deal[] = [];
  const failedNote = (failed: number) => (failed ? `${failed} Abfragen gerade nicht erreichbar.` : null);

  const [ebay, keepa, ...auctionResults] = await Promise.allSettled([
    isEbayBrowseConfigured() ? scanEbay(now, countries) : Promise.resolve(null),
    isKeepaConfigured() && countries.includes("DE") ? scanKeepa(now) : Promise.resolve(null),
    ...AUCTION_FEEDS.map((f) => (countries.includes("DE") ? listAuctions(f, now) : Promise.resolve([]))),
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

  if (keepa.status === "fulfilled" && keepa.value) {
    deals.push(...keepa.value.deals);
    sources.push({ id: "keepa", name: "Amazon.de über Keepa (Preise und Preisverlauf)", live: true, note: failedNote(keepa.value.failed) });
  } else if (countries.includes("DE")) {
    sources.push({ id: "keepa", name: "Amazon.de über Keepa (Preise und Preisverlauf)", live: false, note: keepa.status === "rejected" ? "Antwortet gerade nicht." : NOT_CONNECTED });
  }

  const awinName = "Händler-Feeds über Awin (MediaMarkt, Saturn, Otto u. a.)";
  if (isAwinConfigured() && countries.includes("DE")) {
    try {
      const awin = await scanAwin(ebayStats, now);
      deals.push(...awin.deals);
      sources.push({ id: "awin", name: awinName, live: true, note: ebayStats.size ? `${awin.offers} Händlerangebote geprüft.` : "Bewertung braucht eBay als Marktpreis." });
    } catch (e) {
      sources.push({ id: "awin", name: awinName, live: false, note: e instanceof Error ? e.message : "Feed nicht lesbar." });
    }
  } else if (countries.includes("DE")) {
    sources.push({ id: "awin", name: awinName, live: false, note: NOT_CONNECTED });
  }

  const auctions: AuctionLink[] = [];
  AUCTION_FEEDS.forEach((feed, i) => {
    if (!countries.includes("DE")) return;
    const r = auctionResults[i]!;
    if (r.status === "fulfilled") {
      auctions.push(...(r.value as AuctionLink[]).map((a) => ({ ...a, country: "DE" as const })));
      sources.push({ id: feed.id, name: feed.name, live: true, note: `${(r.value as AuctionLink[]).length} laufende Auktionen` });
    } else {
      sources.push({ id: feed.id, name: feed.name, live: false, note: "Gerade nicht erreichbar." });
    }
  });

  const analyzed: AnalyzedDeal[] = deals
    .map((d) => ({ ...d, analysis: analyzeDeal(d, now) }))
    .sort((a, b) => b.analysis.probability - a.analysis.probability);
  const allowedDeals = analyzed.filter((d) => categoryAllowed(user.plan, user.addons, d.categoryId));
  const auctionsAllowed = categoryAllowed(user.plan, user.addons, "insolvenz");
  return json({
    scannedAt: now.toISOString(),
    deals: allowedDeals,
    lots: [],
    auctions: auctionsAllowed ? auctions : [],
    locked: { deals: analyzed.length - allowedDeals.length, lots: auctionsAllowed ? 0 : auctions.length },
    sources,
    countries,
  });
});
