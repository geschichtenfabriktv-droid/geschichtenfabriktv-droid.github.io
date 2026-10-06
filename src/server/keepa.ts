import "server-only";
import type { Deal, PricePoint } from "@/lib/domain/types";
import { round2 } from "@/lib/engine/stats";
import { WATCHLIST, type WatchItem } from "./watchlist";

/**
 * Amazon.de-Preise über die Keepa-API (offizieller, kostenpflichtiger Zugang; kein Scraping).
 * Je Produkt der Beobachtungsliste: aktueller Preis gegen den 90-Tage-Durchschnitt. Liegt der
 * aktuelle Preis deutlich darunter, ist es eine Chance, mit echtem Preisverlauf aus Keepa.
 * Keepa rechnet in Tokens; deshalb wird je Produkt nur alle 2 Stunden neu gefragt.
 */
const TTL = 2 * 60 * 60_000;
const DOMAIN_DE = 3;
/** Keepa-Zeit: Minuten seit 2011-01-01. */
const KEEPA_EPOCH_MIN = 21_564_000;
const MAX_PRICE_SHARE = 0.85;
const AMAZON_SELL: Deal["target"] = { platform: "Amazon", feeRate: 0.15, fixedFee: 0.99, shipping: 0 };
/** Keepa-Preistypen: 0 = Amazon selbst, 1 = Neu (Marketplace); 11 = Anzahl Neu-Angebote. */
const PRICE_TYPES = [
  { index: 0, platform: "Amazon" },
  { index: 1, platform: "Amazon Marketplace" },
] as const;
const COUNT_NEW = 11;

export function isKeepaConfigured() {
  return Boolean(process.env.KEEPA_API_KEY);
}

interface KeepaProduct {
  asin?: string;
  title?: string;
  brand?: string;
  csv?: (number[] | null)[];
  stats?: { current?: number[]; avg30?: number[]; avg90?: number[]; salesRankDrops30?: number };
}

const cache = new Map<string, { at: number; deals: Deal[] }>();

export function keepaTime(minutes: number): Date {
  return new Date((minutes + KEEPA_EPOCH_MIN) * 60_000);
}

/** Tagesschlusskurse der letzten 90 Tage aus einer Keepa-Preisreihe [zeit, cent, zeit, cent, …]. */
export function dailyHistory(series: number[] | null | undefined, now: Date): PricePoint[] {
  if (!series?.length) return [];
  const byDay = new Map<string, number>();
  const from = now.getTime() - 90 * 86_400_000;
  let last: number | null = null;
  for (let i = 0; i + 1 < series.length; i += 2) {
    const at = keepaTime(series[i]!).getTime();
    const cents = series[i + 1]!;
    if (at < from) {
      last = cents > 0 ? cents : null;
      continue;
    }
    if (last !== null && !byDay.size) byDay.set(new Date(from).toISOString().slice(0, 10), last);
    if (cents > 0) byDay.set(new Date(at).toISOString().slice(0, 10), cents);
    last = cents > 0 ? cents : null;
  }
  return [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, cents]) => ({ date, price: round2(cents / 100) }));
}

function stdDev(points: PricePoint[]): number {
  if (points.length < 2) return 0;
  const mean = points.reduce((s, p) => s + p.price, 0) / points.length;
  return Math.sqrt(points.reduce((s, p) => s + (p.price - mean) ** 2, 0) / points.length);
}

/** Baut aus einem Keepa-Produkt eine Chance, wenn der aktuelle Preis deutlich unter dem 90-Tage-Schnitt liegt. */
export function keepaDeal(item: WatchItem, p: KeepaProduct, now: Date): Deal | null {
  if (!p.asin || !p.title || !p.stats?.current || !p.stats.avg90) return null;
  for (const { index, platform } of PRICE_TYPES) {
    const current = p.stats.current[index] ?? -1;
    const avg90 = p.stats.avg90[index] ?? -1;
    if (current <= 0 || avg90 <= 0 || current > avg90 * MAX_PRICE_SHARE) continue;
    const history = dailyHistory(p.csv?.[index], now);
    const avg30 = p.stats.avg30?.[index] ?? -1;
    const offers = p.stats.current[COUNT_NEW] ?? -1;
    const drops = p.stats.salesRankDrops30 ?? -1;
    return {
      id: `amazon-${p.asin}-${index}`,
      title: p.title,
      brand: p.brand || item.brand,
      categoryId: item.categoryId,
      kind: "arbitrage",
      source: { platform, price: round2(current / 100), shipping: 0, stock: null, url: `https://www.amazon.de/dp/${p.asin}` },
      target: AMAZON_SELL,
      market: {
        medianPrice: round2(avg90 / 100),
        priceStdDev: round2(stdDev(history)),
        // Keepa: Sprünge im Verkaufsrang in 30 Tagen, ein gängiger Näherungswert für Verkäufe.
        sales30d: drops >= 0 ? drops : null,
        activeListings: offers > 0 ? offers : 1,
        trend30d: avg30 > 0 ? round2((avg30 - avg90) / avg90) : null,
        history,
        comparables: [],
        live: true,
      },
      limited: false,
      detectedAt: now.toISOString(),
    };
  }
  return null;
}

async function scanItem(item: WatchItem, now: Date): Promise<Deal[]> {
  const hit = cache.get(item.query);
  if (hit && Date.now() - hit.at < TTL) return hit.deals;
  const url = new URL("https://api.keepa.com/search");
  url.searchParams.set("key", process.env.KEEPA_API_KEY!);
  url.searchParams.set("domain", String(DOMAIN_DE));
  url.searchParams.set("type", "product");
  url.searchParams.set("term", item.query);
  url.searchParams.set("stats", "90");
  url.searchParams.set("history", "1");
  const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`Keepa ${res.status}`);
  const data = (await res.json()) as { products?: KeepaProduct[] };
  const deals = (data.products ?? [])
    .filter((p) => (p.title ?? "").toLowerCase().includes(item.brand.toLowerCase().split(" ")[0]!))
    .flatMap((p) => keepaDeal(item, p, now) ?? [])
    .slice(0, 2);
  cache.set(item.query, { at: Date.now(), deals });
  return deals;
}

export async function scanKeepa(now: Date): Promise<{ deals: Deal[]; failed: number }> {
  const results = await Promise.allSettled(WATCHLIST.map((item) => scanItem(item, now)));
  return {
    deals: results.flatMap((r) => (r.status === "fulfilled" ? r.value : [])),
    failed: results.filter((r) => r.status === "rejected").length,
  };
}
