import { categoryAllowed } from "@/lib/pricing";
import type { AuctionLink, MarketSource } from "@/lib/domain/types";
import { listCourtAuctions } from "@/server/court-auctions";
import { error, handler, json, requireUser } from "@/server/http";
import { isEbayBrowseConfigured, scanEbay } from "@/server/live-market";
import { hasAccess } from "@/server/users";

/**
 * Marktdaten für Kunden: ausschließlich echte Quellen. Fehlt eine Quelle, bleibt der Bereich leer
 * und `sources` sagt, warum. Beispieldaten gibt es nur im öffentlichen Test-Dashboard.
 */
export const GET = handler(async () => {
  const user = await requireUser();
  if (!hasAccess(user)) return error("Für das Dashboard wird ein aktives Abo benötigt.", 402);
  const now = new Date();
  const sources: MarketSource[] = [];

  let deals: Awaited<ReturnType<typeof scanEbay>>["deals"] = [];
  if (isEbayBrowseConfigured()) {
    try {
      const scan = await scanEbay(now);
      deals = scan.deals;
      sources.push({ id: "ebay", name: "eBay.de", live: scan.failed === 0 || deals.length > 0, note: scan.failed ? `${scan.failed} Abfragen gerade nicht erreichbar.` : null });
    } catch {
      sources.push({ id: "ebay", name: "eBay.de", live: false, note: "eBay antwortet gerade nicht." });
    }
  } else {
    sources.push({ id: "ebay", name: "eBay.de", live: false, note: "Noch nicht angebunden." });
  }
  let auctions: AuctionLink[] = [];
  const auctionsAllowed = categoryAllowed(user.plan, user.addons, "insolvenz");
  try {
    auctions = await listCourtAuctions();
    sources.push({ id: "insolvenz", name: "Justiz-Auktion (Gerichte, Insolvenzverwalter)", live: true, note: `${auctions.length} laufende Auktionen` });
  } catch {
    sources.push({ id: "insolvenz", name: "Justiz-Auktion (Gerichte, Insolvenzverwalter)", live: false, note: "Gerade nicht erreichbar." });
  }

  const lots: never[] = [];
  const allowedDeals = deals.filter((d) => categoryAllowed(user.plan, user.addons, d.categoryId));
  return json({
    scannedAt: now.toISOString(),
    deals: allowedDeals,
    lots,
    auctions: auctionsAllowed ? auctions : [],
    locked: { deals: deals.length - allowedDeals.length, lots: auctionsAllowed ? 0 : auctions.length },
    sources,
  });
});
