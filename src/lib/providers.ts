/** Marktplätze und Datendienste, die Kunden mit ihrem eigenen Konto verbinden können. */
export type ProviderId = "ebay" | "amazon" | "keepa" | "kleinanzeigen" | "stockx" | "cardmarket";

export interface ProviderInfo {
  id: ProviderId;
  name: string;
  purpose: string;
  /** oauth = offizielle Freigabe beim Anbieter, apikey = eigener Schlüssel des Kunden, none = kein offizieller Zugang */
  method: "oauth" | "apikey" | "none";
  dataUsed: string;
  note?: string;
}

export const PROVIDERS: readonly ProviderInfo[] = [
  {
    id: "ebay",
    name: "eBay",
    purpose: "Inserate erstellen, Preise automatisch anpassen, Verkäufe abrufen",
    method: "oauth",
    dataUsed: "eBay-Nutzername, Inventar, Angebote und Bestellungen deines Verkäuferkontos",
  },
  {
    id: "amazon",
    name: "Amazon Seller Central",
    purpose: "Angebote einstellen und Preise über die Selling Partner API steuern",
    method: "oauth",
    dataUsed: "Verkäufer-ID, Angebote, Preise und Bestellungen deines Verkäuferkontos",
  },
  {
    id: "keepa",
    name: "Keepa",
    purpose: "Amazon-Preisverläufe und Verkaufsränge für genauere Analysen",
    method: "apikey",
    dataUsed: "Nur dein Keepa-API-Schlüssel; abgefragt werden öffentliche Produktdaten",
  },
  {
    id: "cardmarket",
    name: "Cardmarket",
    purpose: "Preise für Trading Cards und Sammlerprodukte",
    method: "none",
    dataUsed: "–",
    note: "Zugang für Drittanbieter wird bei Cardmarket beantragt.",
  },
  {
    id: "stockx",
    name: "StockX",
    purpose: "Sneaker- und Streetwear-Preise",
    method: "none",
    dataUsed: "–",
    note: "Zugang über das StockX-Partnerprogramm in Vorbereitung.",
  },
  {
    id: "kleinanzeigen",
    name: "Kleinanzeigen",
    purpose: "Lokale Verkäufe",
    method: "none",
    dataUsed: "–",
    note: "Kleinanzeigen bietet keine offizielle Schnittstelle. Inserate erstellst du dort selbst; wir liefern Text und Preis.",
  },
] as const;

export function getProvider(id: string): ProviderInfo | undefined {
  return PROVIDERS.find((p) => p.id === id);
}
