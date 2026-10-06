import "server-only";
import type { AuctionLink } from "@/lib/domain/types";

/**
 * Laufende Auktionen der Justiz (justiz-auktion.de, betrieben von der Justiz NRW für Gerichte,
 * Staatsanwaltschaften und Insolvenzverwalter). Gelesen wird nur die öffentliche Sitemap, die die
 * robots.txt ausdrücklich nennt. Übernommen werden ausschließlich Link und der Titel aus der Adresse;
 * Beschreibungen, Bilder und Gebote bleiben beim Anbieter und werden dort angesehen.
 */
const SITEMAP = "https://www.justiz-auktion.de/sitemap-auktionen.php";
const TTL = 30 * 60_000;
let cache: { at: number; links: AuctionLink[] } | null = null;

export function parseSitemap(xml: string): AuctionLink[] {
  const out: AuctionLink[] = [];
  for (const m of xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)) {
    const url = m[1]!.trim();
    const slug = /^https:\/\/www\.justiz-auktion\.de\/([^/?#]+)$/.exec(url)?.[1];
    const id = slug && /-(\d+)$/.exec(slug)?.[1];
    if (!slug || !id) continue;
    const title = decodeURIComponent(slug.replace(/-\d+$/, "")).replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
    if (!title) continue;
    out.push({ id: `ja-${id}`, title, url, platform: "Justiz-Auktion", updatedAt: m[2]?.trim() ?? null });
  }
  return out;
}

export async function listCourtAuctions(): Promise<AuctionLink[]> {
  if (cache && Date.now() - cache.at < TTL) return cache.links;
  const res = await fetch(SITEMAP, { headers: { "User-Agent": "ArbitrageRadar/1.0 (+https://arbitrageradar.de)" }, cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Justiz-Auktion ${res.status}`);
  const links = parseSitemap(await res.text());
  cache = { at: Date.now(), links };
  return links;
}
