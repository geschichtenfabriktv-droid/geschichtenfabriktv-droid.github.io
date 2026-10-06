import "server-only";
import type { Deal } from "@/lib/domain/types";
import { round2 } from "@/lib/engine/stats";
import { EBAY_SELL, plain, type Stats } from "./live-market";
import { WATCHLIST, type WatchItem } from "./watchlist";

/**
 * Händlerpreise aus einem Awin-Produktfeed (Affiliate-Netzwerk: MediaMarkt, Saturn, Otto, Galeria u. a.).
 * Die Händler stellen ihre Feeds Partnern ausdrücklich zur Verfügung. Die vollständige Download-URL
 * aus „Create-a-Feed“ (Format CSV) steht in AWIN_FEED_URL. Ein Händlerangebot wird zur Chance, wenn es
 * deutlich unter dem eBay-Marktpreis desselben Produkts liegt; ohne eBay-Marktpreis wird nichts bewertet.
 */
const TTL = 6 * 60 * 60_000;
const MAX_PRICE_SHARE = 0.85;
const MAX_BYTES = 40_000_000;

export function isAwinConfigured() {
  return Boolean(process.env.AWIN_FEED_URL);
}

export interface FeedOffer {
  id: string;
  title: string;
  merchant: string;
  price: number;
  shipping: number;
  url: string;
}

let cache: { at: number; offers: FeedOffer[] } | null = null;

/** Minimaler CSV-Parser (Kommas, Anführungszeichen, Zeilenumbrüche in Feldern). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((f) => f.trim()));
}

export function parseFeed(text: string): FeedOffer[] {
  const [header, ...rows] = parseCsv(text);
  if (!header) return [];
  const col = (name: string) => header.findIndex((h) => h.trim().toLowerCase() === name);
  const iId = col("aw_product_id");
  const iName = col("product_name");
  const iPrice = col("search_price");
  const iMerchant = col("merchant_name");
  const iLink = col("aw_deep_link");
  const iShip = col("delivery_cost");
  if (iName < 0 || iPrice < 0 || iLink < 0) throw new Error("Awin-Feed ohne product_name, search_price oder aw_deep_link");
  return rows.flatMap((r) => {
    const price = Number((r[iPrice] ?? "").replace(",", "."));
    const url = r[iLink] ?? "";
    if (!Number.isFinite(price) || price <= 0 || !url.startsWith("https://")) return [];
    const shipping = Number((r[iShip] ?? "0").replace(",", "."));
    return [
      {
        id: (iId >= 0 ? r[iId] : "") || url,
        title: (r[iName] ?? "").trim(),
        merchant: (iMerchant >= 0 ? r[iMerchant] : "")?.trim() || "Händler",
        price,
        shipping: Number.isFinite(shipping) && shipping > 0 ? shipping : 0,
        url,
      },
    ];
  });
}

async function loadOffers(): Promise<FeedOffer[]> {
  if (cache && Date.now() - cache.at < TTL) return cache.offers;
  const res = await fetch(process.env.AWIN_FEED_URL!, { cache: "no-store", signal: AbortSignal.timeout(25_000) });
  if (!res.ok || !res.body) throw new Error(`Awin-Feed ${res.status}`);
  let buf = new Uint8Array(await res.arrayBuffer());
  if (buf.byteLength > MAX_BYTES) throw new Error("Awin-Feed zu groß: bitte nach Händlern oder Kategorien filtern");
  if (buf[0] === 0x1f && buf[1] === 0x8b) {
    buf = new Uint8Array(await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer());
  }
  const offers = parseFeed(new TextDecoder().decode(buf));
  cache = { at: Date.now(), offers };
  return offers;
}

/** Passt ein Feed-Angebot zu einem Produkt der Beobachtungsliste? Alle Suchwörter müssen im Titel stehen. */
export function matches(item: WatchItem, title: string) {
  const t = plain(title);
  return plain(item.query)
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .every((w) => t.includes(w));
}

export function feedDeals(offers: FeedOffer[], stats: Map<string, Stats>, now: Date): Deal[] {
  return WATCHLIST.flatMap((item) => {
    const market = stats.get(item.query);
    if (!market) return [];
    return offers
      .filter((o) => matches(item, o.title) && (o.price + o.shipping) / market.median <= MAX_PRICE_SHARE && (o.price + o.shipping) / market.median >= 0.5)
      .sort((a, b) => a.price + a.shipping - (b.price + b.shipping))
      .slice(0, 2)
      .map(
        (o): Deal => ({
          id: `awin-${o.id.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 60)}`,
          title: o.title,
          brand: item.brand,
          categoryId: item.categoryId,
          kind: "arbitrage",
          source: { platform: o.merchant, price: round2(o.price), shipping: round2(o.shipping), stock: null, url: o.url },
          target: EBAY_SELL,
          market: {
            medianPrice: market.median,
            priceStdDev: market.stdDev,
            sales30d: null,
            activeListings: market.listings,
            trend30d: null,
            history: [],
            comparables: [],
            live: true,
          },
          limited: false,
          detectedAt: now.toISOString(),
        }),
      );
  });
}

export async function scanAwin(stats: Map<string, Stats>, now: Date): Promise<{ deals: Deal[]; offers: number }> {
  const offers = await loadOffers();
  return { deals: feedDeals(offers, stats, now), offers: offers.length };
}
