import "server-only";
import type { Deal, NewsItem } from "@/lib/domain/types";
import { round2 } from "@/lib/engine/stats";
import { fetchCached, mapLimited } from "./fetch-cached";

/**
 * Pokémon-Sammelkarten über die offene TCGdex-API (frei nutzbar, ohne Schlüssel). Sie liefert je Karte
 * die Marktpreise des größten europäischen Kartenmarkts in Euro: günstigstes Angebot, Trend und
 * Durchschnitt der verkauften Karten über 7 und 30 Tage.
 *
 * Chance = das günstigste Angebot liegt deutlich unter dem Preis, zu dem die Karte zuletzt verkauft wurde.
 * Geprüft werden die Karten der neuesten Erweiterungen, weil dort Preise und Nachfrage am stärksten schwanken.
 */
const API = "https://api.tcgdex.net/v2/en";
const SETS_TO_SCAN = 3;
/** Nur Karten, bei denen sich der Aufwand lohnt. */
const MIN_MARKET_EUR = 15;
/** Das günstigste Angebot muss mindestens 30 % unter dem Marktpreis liegen. */
const MAX_PRICE_SHARE = 0.7;
const SET_TTL_S = 6 * 60 * 60;
const CARD_TTL_S = 12 * 60 * 60;
const MEMORY_TTL = 60 * 60_000;
/** Neu erschienene Erweiterungen bleiben so lange als Neuheit in der Liste. */
const NEW_SET_DAYS = 45;

const SELL_ON: Deal["target"] = { platform: "Cardmarket", feeRate: 0.05, fixedFee: 0, shipping: 0 };

export interface TcgSetBrief {
  id: string;
  name: string;
}
export interface TcgSet {
  id: string;
  name: string;
  releaseDate?: string;
  serie?: { id?: string; name?: string };
  cards?: { id: string; name: string }[];
}
interface Cardmarket {
  updated?: string;
  low?: number | null;
  trend?: number | null;
  avg?: number | null;
  avg7?: number | null;
  avg30?: number | null;
  idProduct?: number;
}
export interface TcgCard {
  id: string;
  name: string;
  rarity?: string;
  set?: { id: string; name: string };
  pricing?: { cardmarket?: Cardmarket | null } | null;
}

const num = (v: number | null | undefined) => (typeof v === "number" && v > 0 ? v : null);

/** Physische Erweiterungen (die digitale App-Variante hat keinen Kartenmarkt). */
export function isPhysicalSet(set: TcgSet): boolean {
  return !/pocket/i.test(set.serie?.name ?? "") && !/^tcgp/i.test(set.serie?.id ?? "");
}

/** Baut aus einer Karte eine Chance, wenn das günstigste Angebot klar unter dem zuletzt bezahlten Preis liegt. */
export function cardDeal(card: TcgCard, now: Date): Deal | null {
  const cm = card.pricing?.cardmarket;
  const low = num(cm?.low);
  const trend = num(cm?.trend);
  const avg7 = num(cm?.avg7);
  const avg30 = num(cm?.avg30);
  if (!cm || !low || !trend || !avg30) return null;
  // Vorsichtig: Marktpreis ist der niedrigste der drei Werte, damit Ausreißer nach oben nicht zählen.
  const market = Math.min(trend, avg30, avg7 ?? Infinity);
  if (market < MIN_MARKET_EUR || low > market * MAX_PRICE_SHARE) return null;
  const spread = Math.max(Math.abs(trend - avg30), Math.abs((avg7 ?? trend) - avg30), market * 0.08);
  const setName = card.set?.name ? ` · ${card.set.name}` : "";
  const search = encodeURIComponent(card.name);
  return {
    id: `tcg-${card.id}`,
    title: `${card.name}${card.rarity && card.rarity !== "None" ? ` (${card.rarity})` : ""}${setName}`,
    brand: "Pokémon",
    categoryId: "sammler",
    kind: "arbitrage",
    source: {
      platform: "Cardmarket",
      price: round2(low),
      // Versand einer Einzelkarte; ab etwa 25 € mit Sendungsverfolgung.
      shipping: low >= 25 ? 3.95 : 1.6,
      stock: null,
      url: `https://www.cardmarket.com/de/Pokemon/Products/Search?searchString=${search}`,
    },
    target: SELL_ON,
    market: {
      medianPrice: round2(market),
      priceStdDev: round2(spread),
      sales30d: null,
      activeListings: 1,
      trend30d: avg7 ? round2((avg7 - avg30) / avg30) : null,
      history: [],
      comparables: [],
      live: true,
    },
    limited: false,
    detectedAt: (cm.updated && Number.isFinite(Date.parse(cm.updated)) ? new Date(cm.updated) : now).toISOString(),
  };
}

/** Neu erschienene Erweiterungen als Neuheit (Termin = Erscheinungstag). */
export function setNews(sets: TcgSet[], now: Date): NewsItem[] {
  const since = now.getTime() - NEW_SET_DAYS * 86_400_000;
  return sets.flatMap((s) => {
    const at = s.releaseDate ? Date.parse(s.releaseDate) : NaN;
    if (!Number.isFinite(at) || at < since || !isPhysicalSet(s)) return [];
    const future = at > now.getTime();
    return [
      {
        id: `tcg-set-${s.id}`,
        title: `Pokémon-Sammelkarten: Erweiterung „${s.name}“ ${future ? "erscheint" : "ist erschienen"}`,
        url: `https://www.cardmarket.com/de/Pokemon/Products/Search?searchString=${encodeURIComponent(s.name)}`,
        topic: "Sammeln" as const,
        publishedAt: new Date(Math.min(at, now.getTime())).toISOString(),
        releaseDate: s.releaseDate!.slice(0, 10),
        preorder: future,
      },
    ];
  });
}

async function json<T>(url: string, ttl: number): Promise<T> {
  return (await (await fetchCached(url, ttl)).json()) as T;
}

let memory: { at: number; deals: Deal[]; news: NewsItem[]; checked: number } | null = null;

export async function scanTradingCards(now: Date, budgetMs = 9_000): Promise<{ deals: Deal[]; news: NewsItem[]; checked: number; failed: number; partial: boolean }> {
  if (memory && Date.now() - memory.at < MEMORY_TTL) return { ...memory, failed: 0, partial: false };
  const deadline = Date.now() + budgetMs;
  const briefs = await json<TcgSetBrief[]>(`${API}/sets?sort:field=releaseDate&sort:order=DESC&pagination:itemsPerPage=10`, SET_TTL_S);
  const sets = (await mapLimited(briefs, 5, deadline, (b) => json<TcgSet>(`${API}/sets/${encodeURIComponent(b.id)}`, SET_TTL_S))).results
    .filter((s) => s.releaseDate && Date.parse(s.releaseDate) <= now.getTime() + 120 * 86_400_000)
    .sort((a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? ""));
  const news = setNews(sets, now);
  const released = sets.filter((s) => isPhysicalSet(s) && Date.parse(s.releaseDate!) <= now.getTime()).slice(0, SETS_TO_SCAN);
  const cardIds = released.flatMap((s) => (s.cards ?? []).map((c) => c.id));
  const cards = await mapLimited(cardIds, 12, deadline, (id) => json<TcgCard>(`${API}/cards/${encodeURIComponent(id)}`, CARD_TTL_S));
  const deals = cards.results
    .flatMap((c) => cardDeal(c, now) ?? [])
    .sort((a, b) => a.source.price / a.market.medianPrice - b.source.price / b.market.medianPrice)
    .slice(0, 40);
  const partial = cards.skipped > 0;
  // Unvollständige Durchläufe nicht merken: Beim nächsten Aufruf kommen die übrigen Karten aus dem Daten-Cache.
  if (!partial) memory = { at: Date.now(), deals, news, checked: cards.results.length };
  return { deals, news, checked: cards.results.length, failed: cards.failed, partial };
}
