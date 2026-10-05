import type { Comparable, Deal, InsolvencyLot, PricePoint } from "../domain/types";
import { round2, seededRandom } from "../engine/stats";
import { DEAL_SEEDS, LOT_SEEDS, type DealSeed, type LotSeed } from "./demo-catalog";
import type { DataSource } from "./source";

const DAY_MS = 86_400_000;
const HISTORY_DAYS = 90;

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Erzeugt einen plausiblen 90-Tage-Preisverlauf, der heute beim Marktmedian endet. */
function buildHistory(seed: DealSeed, now: Date): PricePoint[] {
  const rand = seededRandom(`${seed.id}:history`);
  const [median, stdDev, , , trend] = seed.market;
  // Der Trend gilt für 30 Tage; rückwärts gerechnet beginnt die Kurve entsprechend tiefer/höher.
  const dailyDrift = trend / 30;
  const points: PricePoint[] = [];
  let noise = 0;
  for (let i = HISTORY_DAYS - 1; i >= 0; i--) {
    noise = noise * 0.8 + (rand() - 0.5) * stdDev * 0.35;
    const base = median * (1 - dailyDrift * i);
    const price = i === 0 ? median : base + noise;
    points.push({ date: isoDate(new Date(now.getTime() - i * DAY_MS)), price: round2(Math.max(1, price)) });
  }
  return points;
}

function buildComparables(seed: DealSeed): Comparable[] {
  const rand = seededRandom(`${seed.id}:comps`);
  const [median, stdDev] = seed.market;
  const platforms = [seed.sell[0], "eBay", "Kleinanzeigen", "idealo"];
  const conditions: Comparable["condition"][] = ["Neu", "Neu", "Wie neu", "Gebraucht"];
  return Array.from({ length: 6 }, (_, i) => {
    const condition = conditions[Math.floor(rand() * conditions.length)] ?? "Neu";
    const discount = condition === "Gebraucht" ? 0.82 : condition === "Wie neu" ? 0.93 : 1;
    return {
      platform: platforms[i % platforms.length] ?? "eBay",
      price: round2((median + (rand() - 0.5) * 2 * stdDev) * discount),
      condition,
      soldDaysAgo: 1 + Math.floor(rand() * 20),
    };
  }).sort((a, b) => a.soldDaysAgo - b.soldDaysAgo);
}

export function buildDeal(seed: DealSeed, now: Date): Deal {
  const [buyPlatform, price, shipping, stock] = seed.buy;
  const [sellPlatform, feeRate, fixedFee, sellShipping] = seed.sell;
  const [medianPrice, priceStdDev, sales30d, activeListings, trend30d] = seed.market;
  return {
    id: seed.id,
    title: seed.title,
    brand: seed.brand,
    categoryId: seed.categoryId,
    kind: seed.kind ?? "arbitrage",
    source: { platform: buyPlatform, price, shipping, stock },
    target: { platform: sellPlatform, feeRate, fixedFee, shipping: sellShipping },
    market: {
      medianPrice,
      priceStdDev,
      sales30d,
      activeListings,
      trend30d,
      history: buildHistory(seed, now),
      comparables: buildComparables(seed),
    },
    releaseDate: seed.releaseInDays !== undefined ? isoDate(new Date(now.getTime() + seed.releaseInDays * DAY_MS)) : undefined,
    limited: seed.limited ?? false,
    detectedAt: new Date(now.getTime() - seed.detectedMinutesAgo * 60_000).toISOString(),
  };
}

export function buildLot(seed: LotSeed, now: Date): InsolvencyLot {
  const { endsInHours, detectedMinutesAgo, resale, ...rest } = seed;
  return {
    ...rest,
    resale: { median: resale[0], stdDev: resale[1] },
    auctionEnd: new Date(now.getTime() + endsInHours * 3_600_000).toISOString(),
    detectedAt: new Date(now.getTime() - detectedMinutesAgo * 60_000).toISOString(),
  };
}

export function createDemoSource(now: Date = new Date()): DataSource {
  return {
    name: "Demo-Marktdaten",
    isDemo: true,
    listDeals: async () => DEAL_SEEDS.map((s) => buildDeal(s, now)),
    listLots: async () => LOT_SEEDS.map((s) => buildLot(s, now)),
  };
}
