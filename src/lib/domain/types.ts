export type CategoryId =
  | "elektronik"
  | "gaming"
  | "sneaker"
  | "sammler"
  | "haushalt"
  | "werkzeug"
  | "vorbestellung"
  | "dienstleistung"
  | "insolvenz";

export interface Category {
  id: CategoryId;
  name: string;
  /** Kurzer Satz, was in dieser Kategorie gesucht wird. */
  claim: string;
}

export type DealKind = "arbitrage" | "vorbestellung" | "dienstleistung";

export interface PricePoint {
  /** ISO-Datum (YYYY-MM-DD) */
  date: string;
  price: number;
}

export interface Comparable {
  platform: string;
  price: number;
  condition: "Neu" | "Wie neu" | "Gebraucht";
  /** Tage seit dem Verkauf; null bei aktuellen Angeboten (Live-Daten). */
  soldDaysAgo: number | null;
  /** Link zum Angebot (Live-Daten). */
  url?: string;
}

export interface Deal {
  id: string;
  title: string;
  brand: string;
  categoryId: Exclude<CategoryId, "insolvenz">;
  kind: DealKind;
  /** Wo eingekauft wird. */
  source: {
    platform: string;
    price: number;
    shipping: number;
    /** Verfügbare Menge; null, wenn die Quelle sie nicht nennt. */
    stock: number | null;
    /** Link zum Angebot (Live-Daten). */
    url?: string;
  };
  /** Wo verkauft wird. */
  target: {
    platform: string;
    /** Verkaufsprovision als Anteil, z. B. 0.11 */
    feeRate: number;
    fixedFee: number;
    shipping: number;
  };
  market: {
    medianPrice: number;
    /** Streuung der erzielten Verkaufspreise (Standardabweichung, EUR). */
    priceStdDev: number;
    /** Verkäufe der letzten 30 Tage; null, wenn die Quelle keine Verkaufszahlen liefert. */
    sales30d: number | null;
    activeListings: number;
    /** Preistrend der letzten 30 Tage, z. B. 0.06 = +6 %. */
    trend30d: number | null;
    /** Leer, wenn kein Preisverlauf vorliegt. */
    history: PricePoint[];
    comparables: Comparable[];
    /** true, wenn Median/Streuung/Angebote aus Live-Daten stammen */
    live?: boolean;
  };
  /** Nur bei Vorbestellungen: Erscheinungstermin (ISO). */
  releaseDate?: string;
  limited: boolean;
  detectedAt: string;
}

export type LotType = "Warenlager" | "Maschinen" | "Fahrzeuge" | "Büro & IT" | "Marken & Domains";

export interface InsolvencyLot {
  id: string;
  title: string;
  debtor: string;
  court: string;
  caseNumber: string;
  city: string;
  lotType: LotType;
  items: string[];
  /** Gutachterlicher Schätzwert. */
  appraisedValue: number;
  /** Aktuelles Gebot bzw. Mindestgebot. */
  currentBid: number;
  /** Aufgeld des Auktionshauses als Anteil. */
  buyerPremium: number;
  /** Abholung, Transport, Lagerung. */
  logisticsCost: number;
  auctioneer: string;
  auctionEnd: string;
  /** Erwarteter Wiederverkaufserlös (netto nach Gebühren) und Streuung. */
  resale: { median: number; stdDev: number };
  /** Wie schnell sich die Ware typischerweise drehen lässt (0–1). */
  liquidity: number;
  detectedAt: string;
}

export type RiskLevel = "hoch" | "mittel" | "niedrig";

export interface Factor {
  label: string;
  /** positiv = spricht für Gewinn, negativ = Risiko */
  impact: "positiv" | "neutral" | "negativ";
  detail: string;
}

export interface Analysis {
  totalCost: number;
  expectedRevenue: number;
  expectedProfit: number;
  roi: number;
  breakEvenPrice: number;
  recommendedPrice: number;
  /** Gewinnwahrscheinlichkeit 0–1 */
  probability: number;
  /** Wahrscheinlichkeit, innerhalb von 30 Tagen zu verkaufen (0–1). */
  sellThrough30d: number;
  estimatedDaysToSell: number;
  /** Erwarteter Erlös mindestens das Doppelte des Einsatzes. */
  doubleUp: boolean;
  chance: RiskLevel;
  factors: Factor[];
}

export interface AnalyzedDeal extends Deal {
  analysis: Analysis;
}

export interface AnalyzedLot extends InsolvencyLot {
  analysis: Analysis;
}

/** Status einer Datenquelle im Kunden-Dashboard. */
export interface MarketSource {
  id: string;
  name: string;
  live: boolean;
  note: string | null;
}
