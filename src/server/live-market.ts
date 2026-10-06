import "server-only";
import type { AnalyzedDeal, Comparable, Deal } from "@/lib/domain/types";
import { analyzeDeal } from "@/lib/engine/analysis";
import { env } from "./env";

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
const EBAY_SELL: Deal["target"] = { platform: "eBay", feeRate: 0.11, fixedFee: 0.35, shipping: 5.49 };

interface WatchItem {
  query: string;
  brand: string;
  categoryId: Deal["categoryId"];
}

/** Produkte mit genug Handel auf eBay.de, um einen belastbaren Median zu bilden. */
export const WATCHLIST: readonly WatchItem[] = [
  { query: "Sony WH-1000XM5", brand: "Sony", categoryId: "elektronik" },
  { query: "Apple AirPods Pro 2", brand: "Apple", categoryId: "elektronik" },
  { query: "Apple Watch Series 10", brand: "Apple", categoryId: "elektronik" },
  { query: "Garmin Fenix 8", brand: "Garmin", categoryId: "elektronik" },
  { query: "DJI Mini 4 Pro", brand: "DJI", categoryId: "elektronik" },
  { query: "Kindle Paperwhite", brand: "Amazon", categoryId: "elektronik" },
  { query: "iPad Air M2", brand: "Apple", categoryId: "elektronik" },
  { query: "Nintendo Switch 2", brand: "Nintendo", categoryId: "gaming" },
  { query: "PlayStation 5 Pro", brand: "Sony", categoryId: "gaming" },
  { query: "Steam Deck OLED", brand: "Valve", categoryId: "gaming" },
  { query: "DualSense Edge", brand: "Sony", categoryId: "gaming" },
  { query: "Meta Quest 3", brand: "Meta", categoryId: "gaming" },
  { query: "New Balance 2002R", brand: "New Balance", categoryId: "sneaker" },
  { query: "Nike Air Jordan 1 High OG", brand: "Nike", categoryId: "sneaker" },
  { query: "Adidas Samba OG", brand: "Adidas", categoryId: "sneaker" },
  { query: "Pokemon Top Trainer Box", brand: "Pokémon", categoryId: "sammler" },
  { query: "LEGO Titanic 10294", brand: "LEGO", categoryId: "sammler" },
  { query: "One Piece Booster Display", brand: "Bandai", categoryId: "sammler" },
  { query: "Dyson V15 Detect", brand: "Dyson", categoryId: "haushalt" },
  { query: "Thermomix TM7", brand: "Vorwerk", categoryId: "haushalt" },
  { query: "De'Longhi Eletta Explore", brand: "De'Longhi", categoryId: "haushalt" },
  { query: "Makita DLX Combo Set", brand: "Makita", categoryId: "werkzeug" },
  { query: "Festool TS 55", brand: "Festool", categoryId: "werkzeug" },
];

interface Stats {
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

const cache = new Map<string, { at: number; deals: Deal[] }>();
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
export function findDeals(item: WatchItem, listings: Listing[], total: number | undefined, now: Date): Deal[] {
  const brand = item.brand.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const relevant = listings.filter((l) => l.title.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").includes(brand));
  const stats = summarize(relevant.map((l) => l.price + l.shipping));
  if (!stats || stats.listings < 8) return [];
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
        activeListings: total ?? stats.listings,
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

async function scanItem(item: WatchItem, now: Date): Promise<Deal[]> {
  const hit = cache.get(item.query);
  if (hit && Date.now() - hit.at < TTL) return hit.deals;
  const url = new URL(`${apiHost()}/buy/browse/v1/item_summary/search`);
  url.searchParams.set("q", item.query);
  url.searchParams.set("filter", "conditions:{NEW},buyingOptions:{FIXED_PRICE},itemLocationCountry:DE,priceCurrency:EUR");
  url.searchParams.set("limit", "100");
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${await getAppToken()}`, "X-EBAY-C-MARKETPLACE-ID": "EBAY_DE" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`eBay-Suche ${res.status}`);
  const data = (await res.json()) as { total?: number; itemSummaries?: BrowseItem[] };
  const listings: Listing[] = (data.itemSummaries ?? []).flatMap((i) => {
    const price = Number(i.price?.value);
    if (!i.itemId || !i.title || !i.itemWebUrl || !Number.isFinite(price) || i.price?.currency !== "EUR") return [];
    const shipping = Number(i.shippingOptions?.[0]?.shippingCost?.value ?? 0);
    return [{ itemId: i.itemId, title: i.title, price, shipping: Number.isFinite(shipping) ? shipping : 0, url: i.itemWebUrl, createdAt: i.itemCreationDate }];
  });
  const deals = findDeals(item, listings, data.total, now);
  cache.set(item.query, { at: Date.now(), deals });
  return deals;
}

export interface EbayScan {
  deals: AnalyzedDeal[];
  /** Produkte, deren Abfrage fehlgeschlagen ist. */
  failed: number;
}

export async function scanEbay(now: Date): Promise<EbayScan> {
  const results = await Promise.allSettled(WATCHLIST.map((item) => scanItem(item, now)));
  const deals = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  const failed = results.filter((r) => r.status === "rejected").length;
  return {
    deals: deals.map((d) => ({ ...d, analysis: analyzeDeal(d, now) })).sort((a, b) => b.analysis.probability - a.analysis.probability),
    failed,
  };
}
