import "server-only";
import type { Comparable, Deal } from "@/lib/domain/types";
import type { Country } from "@/lib/pricing";
import { env } from "./env";
import { toEur } from "./fx";
import { WATCHLIST, type WatchItem } from "./watchlist";

/**
 * Echte Chancen aus der eBay Browse API (App-Token, nur öffentliche Angebotsdaten, kein Verkäuferkonto):
 * Für jedes Produkt der Beobachtungsliste werden die aktuellen Neuware-Sofortkauf-Angebote auf eBay.de
 * gelesen. Liegt ein Angebot deutlich unter dem Median der übrigen Angebote, ist es eine Chance.
 * Es werden keine Werte ergänzt, die eBay nicht liefert (Verkaufszahlen, Preisverlauf, Bestand).
 * Ergebnisse werden 30 Minuten zwischengespeichert.
 */
const TTL = 30 * 60_000;
/** Ab diesem Abstand zum Median gilt ein Angebot als Chance. */
const MAX_PRICE_SHARE = 0.85;
/** Noch billiger ist meist Zubehör, Defekt oder Betrug. */
const MIN_PRICE_SHARE = 0.55;
export const EBAY_SELL: Deal["target"] = { platform: "eBay", feeRate: 0.11, fixedFee: 0.35, shipping: 5.49 };

export interface Stats {
  median: number;
  stdDev: number;
  listings: number;
}

interface Listing {
  itemId: string;
  title: string;
  price: number;
  shipping: number;
  url: string;
  createdAt?: string;
}

/** Schlüssel: Land und Suchbegriff. */
const cache = new Map<string, { at: number; deals: Deal[]; stats: Stats | null }>();
let appToken: { value: string; until: number } | null = null;

/** Für Marktpreise reicht ein App-Zugang aus dem kostenlosen eBay-Entwicklerprogramm. */
export function isEbayBrowseConfigured() {
  return Boolean(env.ebay.clientId && env.ebay.clientSecret);
}

const apiHost = () => (env.ebay.sandbox ? "https://api.sandbox.ebay.com" : "https://api.ebay.com");

async function getAppToken(): Promise<string> {
  if (appToken && appToken.until > Date.now()) return appToken.value;
  const res = await fetch(`${apiHost()}/identity/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${env.ebay.clientId}:${env.ebay.clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials", scope: "https://api.ebay.com/oauth/api_scope" }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`eBay App-Token ${res.status}`);
  const t = (await res.json()) as { access_token: string; expires_in: number };
  appToken = { value: t.access_token, until: Date.now() + (t.expires_in - 120) * 1000 };
  return t.access_token;
}

export function summarize(prices: number[]): Stats | null {
  const sorted = prices.filter((p) => Number.isFinite(p) && p > 0).sort((a, b) => a - b);
  if (sorted.length < 5) return null;
  // Ausreißer (Zubehör, Fehlinserate) über das Interquartil entfernen.
  const q = (f: number) => sorted[Math.floor((sorted.length - 1) * f)]!;
  const lo = q(0.25) - 1.5 * (q(0.75) - q(0.25));
  const hi = q(0.75) + 1.5 * (q(0.75) - q(0.25));
  const core = sorted.filter((p) => p >= lo && p <= hi);
  const median = core[Math.floor(core.length / 2)]!;
  const mean = core.reduce((s, p) => s + p, 0) / core.length;
  const stdDev = Math.sqrt(core.reduce((s, p) => s + (p - mean) ** 2, 0) / core.length);
  return { median, stdDev, listings: sorted.length };
}

/** Wählt aus den Angeboten eines Produkts die echten Unterpreis-Angebote und baut daraus Deals. */
export const plain = (s: string) => s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

/** Angebote, die zum Produkt passen (Marke im Titel). */
function relevantListings(item: WatchItem, listings: Listing[]) {
  const brand = plain(item.brand);
  return listings.filter((l) => plain(l.title).includes(brand));
}

/** Marktpreis eines Produkts aus den passenden eBay-Angeboten; null bei zu wenig Angeboten. */
export function marketStats(item: WatchItem, listings: Listing[], total: number | undefined): Stats | null {
  const stats = summarize(relevantListings(item, listings).map((l) => l.price + l.shipping));
  if (!stats || stats.listings < 8) return null;
  return total ? { ...stats, listings: total } : stats;
}

export function findDeals(item: WatchItem, listings: Listing[], total: number | undefined, now: Date): Deal[] {
  const relevant = relevantListings(item, listings);
  const stats = marketStats(item, listings, total);
  if (!stats) return [];
  const comparables: Comparable[] = relevant
    .slice()
    .sort((a, b) => Math.abs(a.price + a.shipping - stats.median) - Math.abs(b.price + b.shipping - stats.median))
    .slice(0, 6)
    .map((l) => ({ platform: "eBay", price: l.price + l.shipping, condition: "Neu", soldDaysAgo: null, url: l.url }));
  return relevant
    .filter((l) => {
      const share = (l.price + l.shipping) / stats.median;
      return share <= MAX_PRICE_SHARE && share >= MIN_PRICE_SHARE;
    })
    .sort((a, b) => a.price + a.shipping - (b.price + b.shipping))
    .slice(0, 2)
    .map((l) => ({
      id: `ebay-${l.itemId.replace(/[^a-zA-Z0-9]/g, "-")}`,
      title: l.title,
      brand: item.brand,
      categoryId: item.categoryId,
      kind: "arbitrage" as const,
      source: { platform: "eBay", price: l.price, shipping: l.shipping, stock: null, url: l.url },
      target: EBAY_SELL,
      market: {
        medianPrice: stats.median,
        priceStdDev: stats.stdDev,
        sales30d: null,
        activeListings: stats.listings,
        trend30d: null,
        history: [],
        comparables,
        live: true,
      },
      limited: false,
      detectedAt: l.createdAt ?? now.toISOString(),
    }));
}

interface BrowseItem {
  itemId?: string;
  title?: string;
  price?: { value?: string; currency?: string };
  shippingOptions?: { shippingCost?: { value?: string } }[];
  itemWebUrl?: string;
  itemCreationDate?: string;
}

export const EBAY_MARKETS = {
  DE: { marketplace: "EBAY_DE", currency: "EUR", platform: "eBay.de" },
  AT: { marketplace: "EBAY_AT", currency: "EUR", platform: "eBay.at" },
  CH: { marketplace: "EBAY_CH", currency: "CHF", platform: "eBay.ch" },
} as const satisfies Record<Country, { marketplace: string; currency: string; platform: string }>;

async function scanItem(item: WatchItem, country: Country, now: Date): Promise<{ deals: Deal[]; stats: Stats | null }> {
  const key = `${country}:${item.query}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit;
  const market = EBAY_MARKETS[country];
  const eur = await toEur(market.currency);
  const url = new URL(`${apiHost()}/buy/browse/v1/item_summary/search`);
  url.searchParams.set("q", item.query);
  url.searchParams.set("filter", `conditions:{NEW},buyingOptions:{FIXED_PRICE},itemLocationCountry:${country},priceCurrency:${market.currency}`);
  url.searchParams.set("limit", "100");
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${await getAppToken()}`, "X-EBAY-C-MARKETPLACE-ID": market.marketplace },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`eBay-Suche ${res.status}`);
  const data = (await res.json()) as { total?: number; itemSummaries?: BrowseItem[] };
  const listings: Listing[] = (data.itemSummaries ?? []).flatMap((i) => {
    const price = Number(i.price?.value);
    if (!i.itemId || !i.title || !i.itemWebUrl || !Number.isFinite(price) || i.price?.currency !== market.currency) return [];
    const shipping = Number(i.shippingOptions?.[0]?.shippingCost?.value ?? 0);
    return [{ itemId: i.itemId, title: i.title, price: eur(price), shipping: Number.isFinite(shipping) ? eur(shipping) : 0, url: i.itemWebUrl, createdAt: i.itemCreationDate }];
  });
  const deals = findDeals(item, listings, data.total, now).map((d) => ({
    ...d,
    id: country === "DE" ? d.id : `${d.id}-${country.toLowerCase()}`,
    country,
    source: { ...d.source, platform: market.platform },
    target: { ...d.target, platform: market.platform },
  }));
  const entry = { at: Date.now(), deals, stats: marketStats(item, listings, data.total) };
  cache.set(key, entry);
  return entry;
}

export interface EbayScan {
  deals: Deal[];
  /** Abfragen, die fehlgeschlagen sind, je Land. */
  failed: Partial<Record<Country, number>>;
  /** eBay.de-Marktpreis je Produkt der Beobachtungsliste (Schlüssel: query), Grundlage für Händler-Feeds. */
  stats: Map<string, Stats>;
}

export async function scanEbay(now: Date, countries: readonly Country[] = ["DE"]): Promise<EbayScan> {
  const jobs = countries.flatMap((country) => WATCHLIST.map((item) => ({ country, item })));
  const results = await Promise.allSettled(jobs.map((j) => scanItem(j.item, j.country, now)));
  const deals = results.flatMap((r) => (r.status === "fulfilled" ? r.value.deals : []));
  const failed: Partial<Record<Country, number>> = {};
  const stats = new Map<string, Stats>();
  results.forEach((r, i) => {
    const job = jobs[i]!;
    if (r.status === "rejected") failed[job.country] = (failed[job.country] ?? 0) + 1;
    else if (job.country === "DE" && r.value.stats) stats.set(job.item.query, r.value.stats);
  });
  return { stats, deals, failed };
}
