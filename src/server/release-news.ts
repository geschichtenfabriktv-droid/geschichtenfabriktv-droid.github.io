import "server-only";
import type { NewsItem } from "@/lib/domain/types";

/**
 * Neuheiten und Erscheinungstermine aus den öffentlichen RSS- und Atom-Feeds der Hersteller
 * (Presse- und Blog-Bereiche, die ihre Feeds zum Abonnieren anbieten). Übernommen werden nur Titel,
 * Datum und Link; Texte und Bilder bleiben beim Hersteller. Im Dashboard ohne Herstellernamen.
 */
const TTL = 30 * 60_000;
const MAX_AGE_DAYS = 45;
const UA = { "User-Agent": "ArbitrageRadar/1.0 (+https://arbitrageradar.de)" };

export interface NewsFeed {
  id: string;
  url: string;
  topic: NewsItem["topic"];
  /** Nur Meldungen zu Erscheinen, Vorbestellung oder Marktstart (Technik-Feeds enthalten viel anderes). */
  strict: boolean;
}

export const NEWS_FEEDS: readonly NewsFeed[] = [
  { id: "ps", url: "https://blog.de.playstation.com/feed/", topic: "Spiele & Konsolen", strict: false },
  { id: "xb", url: "https://news.xbox.com/de-de/feed/", topic: "Spiele & Konsolen", strict: false },
  { id: "ap", url: "https://www.apple.com/de/newsroom/rss-feed.rss", topic: "Technik", strict: true },
  { id: "sa", url: "https://news.samsung.com/de/feed", topic: "Technik", strict: true },
];

const MONTHS = ["januar", "februar", "märz", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "dezember"];
const PREORDER = /vorbestell|vorverkauf|pre-?order|erscheint|erscheinen|release|launch|ab sofort|erhältlich|verfügbar|im handel/i;

const decode = (s: string) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const tag = (block: string, name: string) => new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i").exec(block)?.[1];

/** Termin aus dem Titel, z. B. „am 10. November“ oder „10.11.2026“. Ohne Jahr: der nächste solche Tag ab Veröffentlichung. */
export function releaseDateFrom(title: string, published: Date): string | null {
  const t = title.toLowerCase();
  let day: number | undefined;
  let month: number | undefined;
  let year: number | undefined;
  const named = new RegExp(`(\\d{1,2})\\.\\s*(${MONTHS.join("|")})(?:\\s+(\\d{4}))?`).exec(t);
  const numeric = /\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b/.exec(t);
  if (named) [day, month, year] = [Number(named[1]), MONTHS.indexOf(named[2]!) + 1, named[3] ? Number(named[3]) : undefined];
  else if (numeric) [day, month, year] = [Number(numeric[1]), Number(numeric[2]), Number(numeric[3])];
  if (!day || !month || day > 31 || month > 12) return null;
  let y = year ?? published.getUTCFullYear();
  const at = (yy: number) => Date.UTC(yy, month! - 1, day!);
  if (!year && at(y) < published.getTime() - 86_400_000) y += 1;
  return new Date(at(y)).toISOString().slice(0, 10);
}

export function parseNews(xml: string, feed: NewsFeed, now: Date): NewsItem[] {
  const since = now.getTime() - MAX_AGE_DAYS * 86_400_000;
  const blocks = [...xml.matchAll(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi)].map((m) => m[0]);
  return blocks.flatMap((b) => {
    const title = decode(tag(b, "title") ?? "");
    const url = decode(tag(b, "link") ?? "") || /<link[^>]*href="([^"]+)"/i.exec(b)?.[1] || "";
    const date = Date.parse(decode(tag(b, "pubDate") ?? tag(b, "updated") ?? tag(b, "published") ?? ""));
    if (!title || !url.startsWith("https://") || !Number.isFinite(date) || date < since) return [];
    const preorder = PREORDER.test(title);
    if (feed.strict && !preorder) return [];
    const published = new Date(date);
    return [
      {
        id: `${feed.id}-${url.replace(/^https:\/\/[^/]+/, "").replace(/[^a-zA-Z0-9]+/g, "-").slice(-60)}`,
        title,
        url,
        topic: feed.topic,
        publishedAt: published.toISOString(),
        releaseDate: releaseDateFrom(title, published),
        preorder,
      },
    ];
  });
}

const cache = new Map<string, { at: number; items: NewsItem[] }>();

export async function readNews(feed: NewsFeed, now: Date): Promise<NewsItem[]> {
  const hit = cache.get(feed.id);
  if (hit && Date.now() - hit.at < TTL) return hit.items;
  const res = await fetch(feed.url, { headers: UA, cache: "no-store", signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`Feed ${res.status}`);
  const items = parseNews(await res.text(), feed, now);
  cache.set(feed.id, { at: Date.now(), items });
  return items;
}

/** Alle Feeds; ein ausgefallener Feed blendet nur sich selbst aus. */
export async function scanNews(now: Date): Promise<{ items: NewsItem[]; live: number; failed: number }> {
  const results = await Promise.allSettled(NEWS_FEEDS.map((f) => readNews(f, now)));
  const items = results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return { items, live: results.filter((r) => r.status === "fulfilled").length, failed: results.filter((r) => r.status === "rejected").length };
}
