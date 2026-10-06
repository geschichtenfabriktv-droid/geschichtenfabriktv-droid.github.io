import "server-only";
import type { AuctionLink } from "@/lib/domain/types";

/**
 * Laufende Justiz-, Insolvenz- und Industrieauktionen. Gelesen werden nur öffentliche Sitemaps,
 * die die robots.txt der Anbieter ausdrücklich nennt. Übernommen werden ausschließlich Link und der
 * Titel aus der Adresse; Beschreibungen, Bilder und Gebote bleiben beim Anbieter.
 */
const TTL = 10 * 60_000;
const UA = { "User-Agent": "ArbitrageRadar/1.0 (+https://arbitrageradar.de)" };
/** NetBid führt auch beendete Auktionen in der Sitemap; gezeigt wird nur, was zuletzt geändert wurde. */
const NETBID_MAX_AGE_DAYS = 14;

export interface AuctionFeed {
  id: "justiz" | "netbid";
  name: string;
  sitemap: string;
  parse: (xml: string, now: Date) => AuctionLink[];
}

const urls = (xml: string) =>
  [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)].map((m) => ({ loc: m[1]!.trim(), lastmod: m[2]?.trim() ?? null }));

const words = (slug: string) => decodeURIComponent(slug).replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();

export function parseSitemap(xml: string): AuctionLink[] {
  return urls(xml).flatMap(({ loc, lastmod }) => {
    const slug = /^https:\/\/www\.justiz-auktion\.de\/([^/?#]+)$/.exec(loc)?.[1];
    const id = slug && /-(\d+)$/.exec(slug)?.[1];
    const title = slug ? words(slug.replace(/-\d+$/, "")) : "";
    return id && title ? [{ id: `ja-${id}`, title, url: loc, platform: "Gerichtsauktion", updatedAt: lastmod }] : [];
  });
}

export function parseNetbid(xml: string, now: Date): AuctionLink[] {
  const since = now.getTime() - NETBID_MAX_AGE_DAYS * 86_400_000;
  return urls(xml).flatMap(({ loc, lastmod }) => {
    const m = /^https:\/\/www\.netbid\.com\/de\/auktionen\/(\d+)-\d+-([^/?#]+)$/.exec(loc);
    if (!m || !lastmod || !(Date.parse(lastmod) >= since)) return [];
    const title = words(m[2]!);
    return title ? [{ id: `nb-${m[1]}`, title: title[0]!.toUpperCase() + title.slice(1), url: loc, platform: "Industrieauktion", updatedAt: lastmod }] : [];
  });
}

export const AUCTION_FEEDS: readonly AuctionFeed[] = [
  { id: "justiz", name: "Gerichts- und Insolvenzauktionen", sitemap: "https://www.justiz-auktion.de/sitemap-auktionen.php", parse: (xml) => parseSitemap(xml) },
  { id: "netbid", name: "Industrie- und Insolvenzauktionen", sitemap: "https://www.netbid.com/sitemap/sitemap-de-auctions.xml", parse: parseNetbid },
];

const cache = new Map<string, { at: number; links: AuctionLink[] }>();

export async function listAuctions(feed: AuctionFeed, now: Date): Promise<AuctionLink[]> {
  const hit = cache.get(feed.id);
  if (hit && Date.now() - hit.at < TTL) return hit.links;
  const res = await fetch(feed.sitemap, { headers: UA, cache: "no-store", signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`${feed.name} ${res.status}`);
  const links = feed.parse(await res.text(), now);
  cache.set(feed.id, { at: Date.now(), links });
  return links;
}
