import "server-only";
import type { AnalyzedDeal } from "@/lib/domain/types";
import { analyzeDeal } from "@/lib/engine/analysis";
import { env } from "./env";
import { isEbayConfigured } from "./marketplaces";

/**
 * Live-Marktpreise über die eBay Browse API (App-Token, keine Kundendaten): aktuelle Neuware-Angebote
 * auf eBay.de je Produkt. Ersetzt Median, Streuung und Angebotszahl der Analyse. Ergebnisse werden
 * 30 Minuten zwischengespeichert. Ohne eBay-App-Zugang bleiben die Modelldaten aktiv.
 */
const TTL = 30 * 60_000;
const cache = new Map<string, { at: number; stats: Stats | null }>();
let appToken: { value: string; until: number } | null = null;

interface Stats {
  median: number;
  stdDev: number;
  listings: number;
}

async function getAppToken(): Promise<string> {
  if (appToken && appToken.until > Date.now()) return appToken.value;
  const host = env.ebay.sandbox ? "https://api.sandbox.ebay.com" : "https://api.ebay.com";
  const res = await fetch(`${host}/identity/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${env.ebay.clientId}:${env.ebay.clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials", scope: "https://api.ebay.com/oauth/api_scope" }),
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

async function fetchStats(query: string): Promise<Stats | null> {
  const hit = cache.get(query);
  if (hit && Date.now() - hit.at < TTL) return hit.stats;
  const host = env.ebay.sandbox ? "https://api.sandbox.ebay.com" : "https://api.ebay.com";
  const url = new URL(`${host}/buy/browse/v1/item_summary/search`);
  url.searchParams.set("q", query);
  url.searchParams.set("filter", "conditions:{NEW},buyingOptions:{FIXED_PRICE},itemLocationCountry:DE");
  url.searchParams.set("limit", "50");
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${await getAppToken()}`, "X-EBAY-C-MARKETPLACE-ID": "EBAY_DE" },
  });
  let stats: Stats | null = null;
  if (res.ok) {
    const data = (await res.json()) as { total?: number; itemSummaries?: { price?: { value: string } }[] };
    stats = summarize((data.itemSummaries ?? []).map((i) => Number(i.price?.value)));
    if (stats && data.total) stats.listings = data.total;
  }
  cache.set(query, { at: Date.now(), stats });
  return stats;
}

export async function applyLiveMarketData(deals: AnalyzedDeal[], now: Date): Promise<AnalyzedDeal[]> {
  if (!isEbayConfigured()) return deals;
  const out = await Promise.all(
    deals.map(async (deal) => {
      if (deal.kind !== "arbitrage") return deal;
      try {
        const stats = await fetchStats(deal.title);
        if (!stats) return deal;
        const market = { ...deal.market, medianPrice: stats.median, priceStdDev: stats.stdDev, activeListings: stats.listings, live: true };
        const updated = { ...deal, market };
        return { ...updated, analysis: analyzeDeal(updated, now) };
      } catch {
        return deal;
      }
    }),
  );
  return out.sort((a, b) => b.analysis.probability - a.analysis.probability);
}
