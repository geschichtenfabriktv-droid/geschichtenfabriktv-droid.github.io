import { hasFeature } from "@/lib/pricing";
import { error, handler, json, readJson, requireUser } from "@/server/http";
import { createEbayListing } from "@/server/marketplaces";
import { hasAccess } from "@/server/users";
import * as v from "@/server/validate";

/** Echtes eBay-Inserat im Konto des Kunden (nur mit verbundenem eBay-Konto). */
export const POST = handler(async (req) => {
  const user = await requireUser();
  if (!hasAccess(user) || !hasFeature(user.plan, user.addons, "inserat")) return error("Dein Tarif enthält diese Funktion nicht.", 402);
  const body = await readJson(req);
  const price = Number(body.price);
  const quantity = Math.floor(Number(body.quantity));
  if (!Number.isFinite(price) || price <= 0 || price > 100_000) return error("Ungültiger Preis.");
  if (!Number.isFinite(quantity) || quantity < 1 || quantity > 100) return error("Ungültige Menge.");
  const title = v.text(body.title, 200, "Titel");
  const sku = `AR-${v.text(body.itemId, 80, "Artikel").replace(/[^A-Za-z0-9-]/g, "")}-${Date.now().toString(36)}`;
  try {
    const result = await createEbayListing(user.id, {
      sku,
      title,
      description: v.text(body.description, 4000, "Beschreibung") || title,
      price,
      quantity,
    });
    return json(result);
  } catch (e) {
    return error(e instanceof Error ? e.message : "eBay hat das Inserat abgelehnt.", 502);
  }
});
