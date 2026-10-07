import "server-only";
import type { AuctionLink } from "@/lib/domain/types";
import { fetchCached } from "./fetch-cached";

/**
 * Laufende Auktionen von Behörden (Zoll, Polizei, Bund, Länder, Kommunen) beim staatlichen
 * Auktionshaus. Gelesen wird nur die öffentliche Produkt-Sitemap, die die robots.txt ausdrücklich nennt.
 * Wie bei den Gerichtsauktionen werden nur Link und der Titel aus der Adresse übernommen;
 * Beschreibung, Bilder und Gebote bleiben beim Anbieter.
 */
const SITEMAP = "https://www.zoll-auktion.de/sitemaps/produkte.xml";
const TTL_S = 15 * 60;
/** Nur Angebote, die zuletzt geändert wurden (beendete fallen so heraus). */
const MAX_AGE_DAYS = 21;

export function parseAuthoritySitemap(xml: string, now: Date): AuctionLink[] {
  const since = now.getTime() - MAX_AGE_DAYS * 86_400_000;
  return [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)].flatMap((m) => {
    const loc = m[1]!.trim();
    const lastmod = m[2]?.trim() ?? null;
    const hit = /^https:\/\/www\.zoll-auktion\.de\/auktion\/produkt\/([^/?#]+)\/(\d+)$/.exec(loc);
    if (!hit || !lastmod || !(Date.parse(lastmod) >= since)) return [];
    let slug = decodeURIComponent(hit[1]!).replace(/[_+]+/g, " ").replace(/\s+/g, " ").trim();
    const count = /^(\d+) (.+)$/.exec(slug);
    if (count) slug = Number(count[1]) > 1 ? `${count[1]} × ${count[2]}` : count[2]!;
    if (!slug) return [];
    return [{ id: `za-${hit[2]}`, title: slug, url: loc, platform: "Behördenauktion", updatedAt: new Date(Date.parse(lastmod)).toISOString() }];
  });
}

export async function listAuthorityAuctions(now: Date): Promise<AuctionLink[]> {
  const res = await fetchCached(SITEMAP, TTL_S, {}, 15_000);
  return parseAuthoritySitemap(await res.text(), now);
}
