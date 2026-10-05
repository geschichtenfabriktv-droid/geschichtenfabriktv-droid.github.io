import { CATEGORIES } from "../domain/categories";
import type { AnalyzedDeal, AnalyzedLot, CategoryId } from "../domain/types";
import { analyzeDeal, analyzeLot } from "../engine/analysis";
import { createDemoSource } from "./demo-source";
import type { DataSource } from "./source";

/**
 * Zentraler Zugriff auf analysierte Daten. Seiten und API-Routen lesen nur hierüber,
 * damit eine echte Datenquelle ohne Änderungen an der Oberfläche eingesetzt werden kann.
 */
export function getDataSource(now: Date = new Date()): DataSource {
  return createDemoSource(now);
}

export async function getAnalyzedDeals(now: Date = new Date()): Promise<AnalyzedDeal[]> {
  const deals = await getDataSource(now).listDeals();
  return deals
    .map((deal) => ({ ...deal, analysis: analyzeDeal(deal, now) }))
    .sort((a, b) => b.analysis.probability - a.analysis.probability);
}

export async function getAnalyzedLots(now: Date = new Date()): Promise<AnalyzedLot[]> {
  const lots = await getDataSource(now).listLots();
  return lots
    .map((lot) => ({ ...lot, analysis: analyzeLot(lot, now) }))
    .sort((a, b) => b.analysis.probability - a.analysis.probability);
}

export interface CategorySummary {
  id: CategoryId;
  name: string;
  claim: string;
  count: number;
  avgProbability: number;
  bestProfit: number;
}

export function summarizeCategories(deals: AnalyzedDeal[], lots: AnalyzedLot[]): CategorySummary[] {
  return CATEGORIES.map((c) => {
    const items = c.id === "insolvenz" ? lots : deals.filter((d) => d.categoryId === c.id);
    const count = items.length;
    const avgProbability = count ? items.reduce((s, i) => s + i.analysis.probability, 0) / count : 0;
    const bestProfit = items.reduce((m, i) => Math.max(m, i.analysis.expectedProfit), 0);
    return { id: c.id, name: c.name, claim: c.claim, count, avgProbability, bestProfit };
  });
}
