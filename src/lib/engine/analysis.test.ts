import { describe, expect, it } from "vitest";
import { DEAL_SEEDS, LOT_SEEDS } from "../data/demo-catalog";
import { buildDeal, buildLot } from "../data/demo-source";
import { getAnalyzedDeals, summarizeCategories, getAnalyzedLots } from "../data/repository";
import type { Deal } from "../domain/types";
import { analyzeDeal, analyzeLot, chanceLevel, sellThroughRate } from "./analysis";
import { normalCdf } from "./stats";
import { parseAmount } from "../format";

const NOW = new Date("2026-10-05T12:00:00Z");

function deal(overrides: Partial<Deal["market"]> = {}, buyPrice = 100): Deal {
  return {
    id: "t",
    title: "Test",
    brand: "Test",
    categoryId: "elektronik",
    kind: "arbitrage",
    source: { platform: "A", price: buyPrice, shipping: 0, stock: 10 },
    target: { platform: "B", feeRate: 0.1, fixedFee: 0, shipping: 0 },
    market: { medianPrice: 150, priceStdDev: 10, sales30d: 100, activeListings: 20, trend30d: 0, history: [], comparables: [], ...overrides },
    limited: false,
    detectedAt: NOW.toISOString(),
  };
}

describe("stats", () => {
  it("normalCdf hat bekannte Werte", () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 6);
    expect(normalCdf(1.96)).toBeCloseTo(0.975, 3);
    expect(normalCdf(-1.96)).toBeCloseTo(0.025, 3);
  });
});

describe("analyzeDeal", () => {
  it("berechnet Break-even inklusive Gebühren", () => {
    const a = analyzeDeal(deal(), NOW);
    expect(a.totalCost).toBe(100);
    expect(a.breakEvenPrice).toBeCloseTo(100 / 0.9, 2);
  });

  it("empfohlener Preis liegt über Break-even und ergibt Gewinn", () => {
    const a = analyzeDeal(deal(), NOW);
    expect(a.recommendedPrice).toBeGreaterThan(a.breakEvenPrice);
    expect(a.expectedProfit).toBeGreaterThan(0);
  });

  it("mehr Marge und Nachfrage ergeben höhere Wahrscheinlichkeit", () => {
    const good = analyzeDeal(deal(), NOW).probability;
    const thin = analyzeDeal(deal({ medianPrice: 112 }), NOW).probability;
    const slow = analyzeDeal(deal({ sales30d: 2, activeListings: 80 }), NOW).probability;
    expect(good).toBeGreaterThan(thin);
    expect(good).toBeGreaterThan(slow);
  });

  it("Wahrscheinlichkeit bleibt zwischen 1 % und 97 %", () => {
    expect(analyzeDeal(deal({ medianPrice: 10_000 }), NOW).probability).toBeLessThanOrEqual(0.97);
    expect(analyzeDeal(deal({ medianPrice: 20 }), NOW).probability).toBeGreaterThanOrEqual(0.01);
  });

  it("erkennt Doppelter-Preis-Kandidaten", () => {
    expect(analyzeDeal(deal({ medianPrice: 210 }), NOW).doubleUp).toBe(true);
    expect(analyzeDeal(deal(), NOW).doubleUp).toBe(false);
  });

  it("Vorbestellungen mit spätem Release sind unsicherer", () => {
    const now = analyzeDeal({ ...deal({ medianPrice: 125 }) }, NOW).probability;
    const later = analyzeDeal({ ...deal({ medianPrice: 125 }), releaseDate: "2027-03-01" }, NOW).probability;
    expect(later).toBeLessThan(now);
  });
});

describe("chance & Nachfrage", () => {
  it("ordnet Stufen zu", () => {
    expect(chanceLevel(0.8)).toBe("hoch");
    expect(chanceLevel(0.5)).toBe("mittel");
    expect(chanceLevel(0.2)).toBe("niedrig");
  });
  it("sellThroughRate steigt mit Nachfrage", () => {
    expect(sellThroughRate(100, 10)).toBeGreaterThan(sellThroughRate(10, 100));
    expect(sellThroughRate(0, 0)).toBe(0);
  });
});

describe("analyzeLot", () => {
  it("Maximalgebot lässt mindestens 20 % Marge", () => {
    for (const seed of LOT_SEEDS) {
      const lot = buildLot(seed, NOW);
      const a = analyzeLot(lot, NOW);
      const costAtMax = a.recommendedPrice * (1 + lot.buyerPremium) + lot.logisticsCost;
      expect(lot.resale.median / costAtMax).toBeGreaterThanOrEqual(1.2 - 1e-9);
    }
  });
});

describe("Demo-Daten", () => {
  it("alle Deals sind gültig und eindeutig", () => {
    const ids = new Set<string>();
    for (const seed of DEAL_SEEDS) {
      const d = buildDeal(seed, NOW);
      expect(ids.has(d.id)).toBe(false);
      ids.add(d.id);
      expect(d.market.history).toHaveLength(90);
      expect(d.market.history.at(-1)?.price).toBe(d.market.medianPrice);
      const a = analyzeDeal(d, NOW);
      expect(Number.isFinite(a.probability)).toBe(true);
      expect(Number.isFinite(a.expectedProfit)).toBe(true);
    }
  });

  it("jede Kategorie hat Einträge", async () => {
    const summary = summarizeCategories(await getAnalyzedDeals(NOW), await getAnalyzedLots(NOW));
    for (const c of summary) expect(c.count).toBeGreaterThan(0);
  });

  it("ist deterministisch", async () => {
    const a = await getAnalyzedDeals(NOW);
    const b = await getAnalyzedDeals(NOW);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

describe("parseAmount", () => {
  it("liest deutsche und englische Schreibweise", () => {
    expect(parseAmount("1.234,56")).toBe(1234.56);
    expect(parseAmount("366,99")).toBe(366.99);
    expect(parseAmount("366.99")).toBe(366.99);
    expect(parseAmount("5000 €")).toBe(5000);
    expect(parseAmount("abc")).toBeNaN();
    expect(parseAmount("")).toBeNaN();
  });
});
