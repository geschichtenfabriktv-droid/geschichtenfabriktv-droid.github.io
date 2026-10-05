"use client";

import { useCallback, useEffect, useState } from "react";
import { getAnalyzedDeals, getAnalyzedLots, summarizeCategories, type CategorySummary } from "../data/repository";
import type { AnalyzedDeal, AnalyzedLot } from "../domain/types";

export interface MarketState {
  deals: AnalyzedDeal[];
  lots: AnalyzedLot[];
  categories: CategorySummary[];
  scannedAt: Date;
}

let cache: MarketState | null = null;

async function scan(): Promise<MarketState> {
  const now = new Date();
  const [deals, lots] = await Promise.all([getAnalyzedDeals(now), getAnalyzedLots(now)]);
  return { deals, lots, categories: summarizeCategories(deals, lots), scannedAt: now };
}

/**
 * Lädt und analysiert die Marktdaten im Browser, damit Zeiten (gefunden vor …, Auktionsende)
 * immer zur aktuellen Uhrzeit passen. Das Ergebnis wird zwischen Seiten geteilt.
 */
export function useMarket() {
  const [state, setState] = useState<MarketState | null>(cache);
  const [scanning, setScanning] = useState(false);

  const refresh = useCallback(async () => {
    setScanning(true);
    try {
      cache = await scan();
      setState(cache);
    } finally {
      setScanning(false);
    }
  }, []);

  useEffect(() => {
    if (!cache) void refresh();
  }, [refresh]);

  return { market: state, scanning, refresh };
}
