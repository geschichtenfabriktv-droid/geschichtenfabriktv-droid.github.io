"use client";

import { useCallback, useEffect, useState } from "react";
import { getAnalyzedDeals, getAnalyzedLots, summarizeCategories, type CategorySummary } from "../data/repository";
import type { AnalyzedDeal, AnalyzedLot, MarketSource } from "../domain/types";
import { api, BACKEND } from "./api";

export interface MarketState {
  deals: AnalyzedDeal[];
  lots: AnalyzedLot[];
  categories: CategorySummary[];
  scannedAt: Date;
  locked: { deals: number; lots: number };
  /** Beispieldaten (nur Test-Dashboard und statische Vorschau). */
  demo: boolean;
  /** Herkunft der Daten im Kunden-Dashboard; leer bei Beispieldaten. */
  sources: MarketSource[];
}

/** Im Test-Dashboard: je Kategorie die drei besten Chancen. */
export const DEMO_PER_CATEGORY = 3;

let cache: { key: string; state: MarketState } | null = null;

async function scanLocal(demo: boolean): Promise<MarketState> {
  const now = new Date();
  let [deals, lots] = await Promise.all([getAnalyzedDeals(now), getAnalyzedLots(now)]);
  if (demo) {
    const per = new Map<string, number>();
    deals = deals.filter((d) => {
      const n = per.get(d.categoryId) ?? 0;
      per.set(d.categoryId, n + 1);
      return n < DEMO_PER_CATEGORY;
    });
    lots = lots.slice(0, DEMO_PER_CATEGORY);
  }
  return { deals, lots, categories: summarizeCategories(deals, lots), scannedAt: now, locked: { deals: 0, lots: 0 }, demo: true, sources: [] };
}

async function scanServer(): Promise<MarketState> {
  const data = await api<{ scannedAt: string; deals: AnalyzedDeal[]; lots: AnalyzedLot[]; locked: { deals: number; lots: number }; sources: MarketSource[] }>("/api/market/");
  return { ...data, scannedAt: new Date(data.scannedAt), categories: summarizeCategories(data.deals, data.lots), demo: false };
}

/**
 * Marktdaten. Im Dashboard mit Konto kommen sie vom Server, ausschließlich aus echten Quellen,
 * im Test-Dashboard werden die Beispieldaten im Browser berechnet.
 */
export function useMarket(mode: "app" | "demo" = "app") {
  const key = mode === "demo" || !BACKEND ? `local:${mode}` : "server";
  const [state, setState] = useState<MarketState | null>(cache?.key === key ? cache.state : null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setScanning(true);
    setError(null);
    try {
      const next = key === "server" ? await scanServer() : await scanLocal(mode === "demo");
      cache = { key, state: next };
      setState(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Marktdaten konnten nicht geladen werden.");
    } finally {
      setScanning(false);
    }
  }, [key, mode]);

  useEffect(() => {
    if (cache?.key !== key) void refresh();
  }, [key, refresh]);

  return { market: state, scanning, refresh, error };
}
