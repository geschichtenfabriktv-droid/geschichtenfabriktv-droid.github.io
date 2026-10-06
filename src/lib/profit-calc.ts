/**
 * Gewinnrechnung für einen einzelnen Weiterverkauf (öffentlicher Rechner unter /rechner/).
 * Bewusst ohne Umsatz- und Einkommensteuer: gerechnet wird, was nach Einkauf, Versand und
 * Marktplatzgebühren übrig bleibt. Gebührensätze gibt der Nutzer selbst ein.
 */
export interface ProfitInput {
  /** Einkaufspreis inkl. Lieferung zu dir */
  buy: number;
  /** Verkaufspreis des Artikels (ohne Versand) */
  sell: number;
  /** Versandkosten, die der Käufer zahlt */
  buyerShipping: number;
  /** Deine tatsächlichen Versandkosten (Porto, Verpackung) */
  ownShipping: number;
  /** Verkaufsprovision in Prozent vom Gesamtbetrag inkl. Versand */
  feePct: number;
  /** Feste Gebühr pro Bestellung */
  fixedFee: number;
  /** Anzeigensatz in Prozent vom Gesamtbetrag (0 = keine Anzeige) */
  adPct: number;
}

export interface ProfitResult {
  /** Was der Käufer insgesamt zahlt */
  total: number;
  fees: number;
  profit: number;
  /** Gewinn im Verhältnis zum Verkaufspreis inkl. Versand, in Prozent */
  margin: number;
  /** Gewinn im Verhältnis zum Einkaufspreis, in Prozent (null ohne Einkaufspreis) */
  roi: number | null;
  /** Verkaufspreis (ohne Versand), ab dem kein Verlust entsteht; null, wenn Gebühren ≥ 100 % */
  breakEven: number | null;
}

const round = (n: number) => Math.round(n * 100) / 100;
const clean = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function calcProfit(raw: ProfitInput): ProfitResult {
  const i = {
    buy: clean(raw.buy),
    sell: clean(raw.sell),
    buyerShipping: clean(raw.buyerShipping),
    ownShipping: clean(raw.ownShipping),
    feePct: Math.min(clean(raw.feePct), 100),
    fixedFee: clean(raw.fixedFee),
    adPct: Math.min(clean(raw.adPct), 100),
  };
  const rate = (i.feePct + i.adPct) / 100;
  const total = i.sell + i.buyerShipping;
  const fees = total > 0 ? total * rate + i.fixedFee : 0;
  const profit = total - fees - i.ownShipping - i.buy;
  const keep = 1 - rate;
  const breakEven = keep > 0 ? Math.max(0, (i.buy + i.ownShipping + i.fixedFee) / keep - i.buyerShipping) : null;
  return {
    total: round(total),
    fees: round(fees),
    profit: round(profit),
    margin: total > 0 ? round((profit / total) * 100) : 0,
    roi: i.buy > 0 ? round((profit / i.buy) * 100) : null,
    breakEven: breakEven === null ? null : round(breakEven),
  };
}
