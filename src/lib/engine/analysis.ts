import type { Analysis, Deal, Factor, InsolvencyLot, RiskLevel } from "../domain/types";
import { clamp, normalCdf, round2 } from "./stats";

const DAY_MS = 86_400_000;
export const MIN_PROFIT_EUR = 5;
export const MIN_PROFIT_RATE = 0.05;
/** Kein Modell ist sicher: Die Anzeige endet bewusst bei 97 %. */
export const MAX_PROBABILITY = 0.97;

export function chanceLevel(probability: number): RiskLevel {
  if (probability >= 0.7) return "hoch";
  if (probability >= 0.45) return "mittel";
  return "niedrig";
}

/** Anteil der Angebote, der sich in 30 Tagen verkauft (Nachfrage geteilt durch Konkurrenz). */
export function sellThroughRate(sales30d: number, activeListings: number): number {
  const velocity = sales30d / Math.max(1, activeListings);
  return clamp(1 - Math.exp(-1.2 * velocity), 0, 1);
}

/** Ein Preis knapp unter der nächsten vollen Zahl, z. B. 249,99 €. */
function psychologicalPrice(value: number): number {
  return Math.max(0.99, Math.ceil(value) - 0.01);
}

const eur = (n: number) =>
  n.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const pct = (n: number) => `${n >= 0 ? "+" : "−"}${Math.abs(Math.round(n * 100))} %`;

/**
 * Analysiert einen Deal: Die erzielbaren Verkaufspreise werden als Normalverteilung um den
 * Marktmedian (korrigiert um den Trend bis zum Verkauf) modelliert. Die Gewinnwahrscheinlichkeit
 * ist die Wahrscheinlichkeit, über dem Break-even zu verkaufen, gewichtet mit der Chance,
 * überhaupt innerhalb von 30 Tagen einen Käufer zu finden.
 */
export function analyzeDeal(deal: Deal, now: Date = new Date()): Analysis {
  const { source, target, market } = deal;
  const totalCost = source.price + source.shipping;
  const keepRate = 1 - target.feeRate;
  const breakEvenPrice = (totalCost + target.fixedFee + target.shipping) / keepRate;

  const sellThrough30d = sellThroughRate(market.sales30d, market.activeListings);
  const daysToSell = clamp(Math.round((30 * market.activeListings) / Math.max(1, market.sales30d) / 2), 1, 120);

  const daysToRelease = deal.releaseDate
    ? Math.max(0, Math.ceil((new Date(deal.releaseDate).getTime() - now.getTime()) / DAY_MS))
    : 0;
  const horizonDays = daysToRelease + daysToSell;
  const trend = clamp(market.trend30d, -0.3, 0.3);
  const expectedPrice = market.medianPrice * (1 + trend * Math.min(1, horizonDays / 30) * 0.5);

  // Vorbestellungen sind unsicherer: Die Streuung wächst mit der Zeit bis zum Release.
  const uncertainty = 1 + Math.min(0.6, daysToRelease / 120);
  const stdDev = Math.max(market.priceStdDev, market.medianPrice * 0.05) * uncertainty;

  // „Gewinn" heißt: mindestens 5 % bzw. 5 € netto nach allen Gebühren, nicht nur plus/minus null.
  const minProfit = Math.max(MIN_PROFIT_EUR, totalCost * MIN_PROFIT_RATE);
  const targetPrice = breakEvenPrice + minProfit / keepRate;
  const pAboveTarget = 1 - normalCdf(targetPrice, expectedPrice, stdDev);
  const probability = clamp(pAboveTarget * (0.6 + 0.4 * sellThrough30d), 0.01, MAX_PROBABILITY);

  const recommendedPrice = psychologicalPrice(Math.max(targetPrice, expectedPrice - 0.15 * stdDev));
  const expectedRevenue = recommendedPrice * keepRate - target.fixedFee - target.shipping;
  const expectedProfit = expectedRevenue - totalCost;

  const factors: Factor[] = [];
  const margin = (expectedPrice - breakEvenPrice) / breakEvenPrice;
  factors.push({
    label: "Preisabstand",
    impact: margin > 0.15 ? "positiv" : margin > 0 ? "neutral" : "negativ",
    detail: `Marktpreis liegt ${pct(margin)} über dem Break-even von ${eur(breakEvenPrice)}.`,
  });
  factors.push({
    label: "Nachfrage",
    impact: sellThrough30d > 0.6 ? "positiv" : sellThrough30d > 0.3 ? "neutral" : "negativ",
    detail: `${market.sales30d} Verkäufe in 30 Tagen bei ${market.activeListings} aktiven Angeboten.`,
  });
  factors.push({
    label: "Preistrend",
    impact: market.trend30d > 0.02 ? "positiv" : market.trend30d < -0.02 ? "negativ" : "neutral",
    detail: `${pct(market.trend30d)} in den letzten 30 Tagen.`,
  });
  const volatility = market.priceStdDev / market.medianPrice;
  factors.push({
    label: "Preisschwankung",
    impact: volatility < 0.08 ? "positiv" : volatility < 0.18 ? "neutral" : "negativ",
    detail: `Verkaufspreise streuen um ±${Math.round(volatility * 100)} %.`,
  });
  if (deal.releaseDate) {
    factors.push({
      label: "Erscheinungstermin",
      impact: daysToRelease > 90 ? "negativ" : "neutral",
      detail: daysToRelease > 0 ? `Release in ${daysToRelease} Tagen, Kapital bis dahin gebunden.` : "Bereits erschienen.",
    });
  }
  if (deal.limited) {
    factors.push({ label: "Limitierung", impact: "positiv", detail: "Limitierte Auflage, Angebot wird knapper." });
  }
  if (source.stock <= 3) {
    factors.push({ label: "Verfügbarkeit", impact: "neutral", detail: `Nur noch ${source.stock} Stück beim Händler.` });
  }

  return {
    totalCost: round2(totalCost),
    expectedRevenue: round2(expectedRevenue),
    expectedProfit: round2(expectedProfit),
    roi: totalCost > 0 ? expectedProfit / totalCost : 0,
    breakEvenPrice: round2(breakEvenPrice),
    recommendedPrice: round2(recommendedPrice),
    probability,
    sellThrough30d,
    estimatedDaysToSell: daysToRelease + daysToSell,
    doubleUp: expectedPrice >= 2 * source.price,
    chance: chanceLevel(probability),
    factors,
  };
}

/**
 * Analysiert ein Los aus einer Insolvenzmasse. Kosten = Gebot inkl. Aufgeld + Logistik.
 * Der empfohlene Preis ist hier das Maximalgebot, bei dem noch 20 % Marge bleiben.
 */
export function analyzeLot(lot: InsolvencyLot, now: Date = new Date()): Analysis {
  const premium = 1 + lot.buyerPremium;
  const totalCost = lot.currentBid * premium + lot.logisticsCost;
  const { median, stdDev } = lot.resale;

  // Gewinnziel bei Losen: mindestens 10 % über den Gesamtkosten (Aufwand für Abverkauf).
  const pAboveCost = 1 - normalCdf(totalCost * 1.1, median, Math.max(stdDev, median * 0.08));
  const probability = clamp(pAboveCost * (0.6 + 0.4 * lot.liquidity), 0.01, MAX_PROBABILITY);

  const breakEvenBid = (median - lot.logisticsCost) / premium;
  const maxBid = Math.max(0, (median / 1.2 - lot.logisticsCost) / premium);
  const expectedProfit = median - totalCost;
  const daysLeft = Math.max(0, Math.ceil((new Date(lot.auctionEnd).getTime() - now.getTime()) / DAY_MS));
  const daysToSell = Math.round(20 + (1 - lot.liquidity) * 100);

  const factors: Factor[] = [
    {
      label: "Gebot zum Schätzwert",
      impact: lot.currentBid < lot.appraisedValue * 0.4 ? "positiv" : lot.currentBid < lot.appraisedValue * 0.7 ? "neutral" : "negativ",
      detail: `Aktuelles Gebot liegt bei ${Math.round((lot.currentBid / lot.appraisedValue) * 100)} % des Gutachterwerts.`,
    },
    {
      label: "Wiederverkauf",
      impact: lot.liquidity > 0.65 ? "positiv" : lot.liquidity > 0.4 ? "neutral" : "negativ",
      detail: `Erwarteter Erlös ${eur(median)} bei ±${eur(stdDev)} Streuung.`,
    },
    {
      label: "Nebenkosten",
      impact: lot.logisticsCost / totalCost > 0.25 ? "negativ" : "neutral",
      detail: `${Math.round(lot.buyerPremium * 100)} % Aufgeld und ${eur(lot.logisticsCost)} für Abholung und Lager.`,
    },
    {
      label: "Auktionsende",
      impact: "neutral",
      detail: daysLeft > 0 ? `Endet in ${daysLeft} Tagen, Gebote können noch steigen.` : "Endet heute.",
    },
  ];

  return {
    totalCost: round2(totalCost),
    expectedRevenue: round2(median),
    expectedProfit: round2(expectedProfit),
    roi: totalCost > 0 ? expectedProfit / totalCost : 0,
    breakEvenPrice: round2(breakEvenBid),
    recommendedPrice: round2(Math.floor(maxBid / 10) * 10),
    probability,
    sellThrough30d: lot.liquidity,
    estimatedDaysToSell: daysLeft + daysToSell,
    doubleUp: median >= 2 * totalCost,
    chance: chanceLevel(probability),
    factors,
  };
}
