import { analyzeDeal } from "@/lib/engine/analysis";
import { categoryAllowed, countriesAllowed, COUNTRIES, isCountry, type Country } from "@/lib/pricing";
import type { AnalyzedDeal } from "@/lib/domain/types";
import { error, handler, json, requireUser } from "@/server/http";
import { scanMarket } from "@/server/market-scan";
import { hasAccess } from "@/server/users";

/**
 * Marktdaten für Kunden: ausschließlich echte Quellen. Jede Quelle liefert, sobald ihr Zugang in den
 * Umgebungsvariablen steht; ohne Zugang steht sie in `sources` als nicht verbunden. Beispieldaten gibt
 * es nur im öffentlichen Test-Dashboard.
 */
export const GET = handler(async (req) => {
  const user = await requireUser();
  if (!hasAccess(user)) return error("Für das Dashboard wird ein aktives Abo benötigt.", 402);
  const now = new Date();
  // Länder: ?laender=DE,AT,CH; nur, was der Tarif erlaubt, mindestens Deutschland.
  const allowed = countriesAllowed(user.plan);
  const wanted = (new URL(req.url).searchParams.get("laender") ?? "DE").split(",").filter(isCountry);
  const countries: Country[] = COUNTRIES.map((c) => c.id).filter((c) => wanted.includes(c) && allowed.includes(c));
  if (!countries.length) countries.push("DE");
  const { deals, auctions, sources, news } = await scanMarket(countries, now);

  const analyzed: AnalyzedDeal[] = deals
    .map((d) => ({ ...d, analysis: analyzeDeal(d, now) }))
    .sort((a, b) => b.analysis.probability - a.analysis.probability);
  const allowedDeals = analyzed.filter((d) => categoryAllowed(user.plan, user.addons, d.categoryId));
  const auctionsAllowed = categoryAllowed(user.plan, user.addons, "insolvenz");
  return json({
    scannedAt: now.toISOString(),
    deals: allowedDeals,
    lots: [],
    auctions: auctionsAllowed ? auctions : [],
    locked: { deals: analyzed.length - allowedDeals.length, lots: auctionsAllowed ? 0 : auctions.length },
    sources,
    news,
    countries,
  });
});
