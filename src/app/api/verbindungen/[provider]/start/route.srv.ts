import { getProvider } from "@/lib/providers";
import { createOAuthState, saveConnection } from "@/server/connections";
import { error, handler, json, readJson, requireUser } from "@/server/http";
import { amazonAuthorizeUrl, ebayAuthorizeUrl, isAmazonConfigured, isEbayConfigured, verifyKeepaKey } from "@/server/marketplaces";
import * as v from "@/server/validate";

/** Startet eine Verbindung. Ohne ausdrückliche Einwilligung wird nichts verbunden. */
export const POST = handler(async (req, ctx: { params: Promise<{ provider: string }> }) => {
  const user = await requireUser();
  const { provider } = await ctx.params;
  const info = getProvider(provider);
  if (!info) return error("Unbekannter Anbieter.", 404);
  const body = await readJson(req);
  v.accepted(body.consent, "Bitte bestätige die Einwilligung zur Datenverarbeitung.");

  if (info.id === "ebay") {
    if (!isEbayConfigured()) return error("Die eBay-Anbindung wird gerade freigeschaltet. Bitte versuche es später.", 503);
    return json({ redirect: ebayAuthorizeUrl(await createOAuthState(user.id, "ebay")) });
  }
  if (info.id === "amazon") {
    if (!isAmazonConfigured()) return error("Die Amazon-Anbindung wird gerade freigeschaltet. Bitte versuche es später.", 503);
    return json({ redirect: amazonAuthorizeUrl(await createOAuthState(user.id, "amazon")) });
  }
  if (info.id === "keepa") {
    const key = v.text(body.apiKey, 200, "Schlüssel");
    if (!/^[A-Za-z0-9]{20,}$/.test(key)) return error("Bitte gib einen gültigen Keepa-API-Schlüssel ein.");
    const { tokensLeft } = await verifyKeepaKey(key);
    await saveConnection(user.id, "keepa", { apiKey: key }, { accountLabel: `${tokensLeft} Tokens verfügbar`, consentAt: new Date() });
    return json({ ok: true });
  }
  return error("Für diesen Anbieter gibt es noch keinen offiziellen Zugang.", 400);
});
