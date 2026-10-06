import "server-only";

/**
 * Euro-Referenzkurse der Europäischen Zentralbank (offene Daten, täglich). Wird nur gebraucht,
 * um Schweizer Angebote in CHF in Euro umzurechnen. Ohne Kurs werden keine CHF-Angebote gezeigt.
 */
const ECB = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
const TTL = 6 * 60 * 60_000;
let cache: { at: number; rates: Map<string, number> } | null = null;

export function parseEcb(xml: string): Map<string, number> {
  const rates = new Map<string, number>();
  for (const m of xml.matchAll(/currency=['"]([A-Z]{3})['"]\s+rate=['"]([\d.]+)['"]/g)) rates.set(m[1]!, Number(m[2]));
  return rates;
}

/** Wie viele Euro ein Betrag in `currency` wert ist. */
export async function toEur(currency: string): Promise<(amount: number) => number> {
  if (currency === "EUR") return (a) => a;
  if (!cache || Date.now() - cache.at > TTL) {
    const res = await fetch(ECB, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`EZB-Kurse ${res.status}`);
    cache = { at: Date.now(), rates: parseEcb(await res.text()) };
  }
  const rate = cache.rates.get(currency);
  if (!rate) throw new Error(`Kein EZB-Kurs für ${currency}`);
  return (a) => Math.round((a / rate) * 100) / 100;
}
