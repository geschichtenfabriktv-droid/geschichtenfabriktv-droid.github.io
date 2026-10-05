import "server-only";
import { env } from "./env";
import { getTokens, saveConnection, setConnectionStatus } from "./connections";

const EBAY_SCOPES = [
  "https://api.ebay.com/oauth/api_scope",
  "https://api.ebay.com/oauth/api_scope/sell.inventory",
  "https://api.ebay.com/oauth/api_scope/sell.account",
  "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
  "https://api.ebay.com/oauth/api_scope/commerce.identity.readonly",
];

const ebayHosts = () =>
  env.ebay.sandbox
    ? { auth: "https://auth.sandbox.ebay.com", api: "https://api.sandbox.ebay.com", apiz: "https://apiz.sandbox.ebay.com" }
    : { auth: "https://auth.ebay.com", api: "https://api.ebay.com", apiz: "https://apiz.ebay.com" };

export function isEbayConfigured() {
  return Boolean(env.ebay.clientId && env.ebay.clientSecret && env.ebay.ruName);
}

export function isAmazonConfigured() {
  return Boolean(env.amazon.appId && env.amazon.clientId && env.amazon.clientSecret);
}

export function ebayAuthorizeUrl(state: string): string {
  const url = new URL(`${ebayHosts().auth}/oauth2/authorize`);
  url.searchParams.set("client_id", env.ebay.clientId!);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", env.ebay.ruName!);
  url.searchParams.set("scope", EBAY_SCOPES.join(" "));
  url.searchParams.set("state", state);
  url.searchParams.set("locale", "de-DE");
  return url.toString();
}

function ebayBasicAuth() {
  return `Basic ${Buffer.from(`${env.ebay.clientId}:${env.ebay.clientSecret}`).toString("base64")}`;
}

interface EbayTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
}

async function ebayToken(body: Record<string, string>): Promise<EbayTokenResponse> {
  const res = await fetch(`${ebayHosts().api}/identity/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: ebayBasicAuth(), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`eBay-Token fehlgeschlagen (${res.status})`);
  return res.json();
}

export async function completeEbayConnection(userId: string, code: string, consentAt: Date) {
  const t = await ebayToken({ grant_type: "authorization_code", code, redirect_uri: env.ebay.ruName! });
  let label: string | null = null;
  try {
    const me = await fetch(`${ebayHosts().apiz}/commerce/identity/v1/user/`, { headers: { Authorization: `Bearer ${t.access_token}` } });
    if (me.ok) label = ((await me.json()) as { username?: string }).username ?? null;
  } catch {
    // Kontoname ist optional
  }
  await saveConnection(
    userId,
    "ebay",
    { accessToken: t.access_token, refreshToken: t.refresh_token },
    { accountLabel: label, scopes: EBAY_SCOPES.join(" "), expiresAt: new Date(Date.now() + t.expires_in * 1000), consentAt },
  );
}

/** Gültiges eBay-Zugriffstoken des Kunden, bei Bedarf mit dem Refresh-Token erneuert. */
export async function ebayAccessToken(userId: string): Promise<string> {
  const tokens = await getTokens(userId, "ebay");
  if (!tokens?.refreshToken) throw new Error("eBay ist nicht verbunden.");
  try {
    const t = await ebayToken({ grant_type: "refresh_token", refresh_token: tokens.refreshToken, scope: EBAY_SCOPES.join(" ") });
    return t.access_token;
  } catch (e) {
    await setConnectionStatus(userId, "ebay", "abgelaufen");
    throw e;
  }
}

/**
 * Erstellt ein Festpreis-Angebot über die eBay Inventory API: Inventar-Artikel, Angebot, Veröffentlichung.
 * Nutzt die ersten Versand-, Zahlungs- und Rücknahmerichtlinien des Verkäuferkontos.
 */
export async function createEbayListing(
  userId: string,
  input: { sku: string; title: string; description: string; price: number; quantity: number; categoryId?: string },
): Promise<{ listingId: string }> {
  const token = await ebayAccessToken(userId);
  const api = ebayHosts().api;
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "Content-Language": "de-DE", "Accept-Language": "de-DE" };
  const call = async <T>(method: string, path: string, body?: unknown): Promise<T> => {
    const res = await fetch(`${api}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
    if (res.status === 204) return undefined as T;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`eBay ${path}: ${res.status} ${JSON.stringify((data as { errors?: unknown }).errors ?? "")}`);
    return data as T;
  };

  const marketplaceId = "EBAY_DE";
  const [fulfillment, payment, returns] = await Promise.all([
    call<{ fulfillmentPolicies?: { fulfillmentPolicyId: string }[] }>("GET", `/sell/account/v1/fulfillment_policy?marketplace_id=${marketplaceId}`),
    call<{ paymentPolicies?: { paymentPolicyId: string }[] }>("GET", `/sell/account/v1/payment_policy?marketplace_id=${marketplaceId}`),
    call<{ returnPolicies?: { returnPolicyId: string }[] }>("GET", `/sell/account/v1/return_policy?marketplace_id=${marketplaceId}`),
  ]);
  const fp = fulfillment.fulfillmentPolicies?.[0]?.fulfillmentPolicyId;
  const pp = payment.paymentPolicies?.[0]?.paymentPolicyId;
  const rp = returns.returnPolicies?.[0]?.returnPolicyId;
  if (!fp || !pp || !rp) throw new Error("Im eBay-Konto fehlen Versand-, Zahlungs- oder Rücknahmerichtlinien.");

  await call("PUT", `/sell/inventory/v1/inventory_item/${encodeURIComponent(input.sku)}`, {
    availability: { shipToLocationAvailability: { quantity: input.quantity } },
    condition: "NEW",
    product: { title: input.title.slice(0, 80), description: input.description },
  });
  const offer = await call<{ offerId: string }>("POST", "/sell/inventory/v1/offer", {
    sku: input.sku,
    marketplaceId,
    format: "FIXED_PRICE",
    availableQuantity: input.quantity,
    categoryId: input.categoryId,
    listingPolicies: { fulfillmentPolicyId: fp, paymentPolicyId: pp, returnPolicyId: rp },
    pricingSummary: { price: { value: input.price.toFixed(2), currency: "EUR" } },
  });
  const published = await call<{ listingId: string }>("POST", `/sell/inventory/v1/offer/${offer.offerId}/publish`);
  return { listingId: published.listingId };
}

/** Amazon: Website-Autorisierung in Seller Central (EU). */
export function amazonAuthorizeUrl(state: string): string {
  const url = new URL("https://sellercentral-europe.amazon.com/apps/authorize/consent");
  url.searchParams.set("application_id", env.amazon.appId!);
  url.searchParams.set("state", state);
  if (process.env.AMAZON_SP_DRAFT === "1") url.searchParams.set("version", "beta");
  return url.toString();
}

export async function completeAmazonConnection(userId: string, code: string, sellerId: string | null, consentAt: Date) {
  const res = await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: env.amazon.clientId!,
      client_secret: env.amazon.clientSecret!,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Amazon-Token fehlgeschlagen (${res.status})`);
  const t = (await res.json()) as { refresh_token: string; access_token: string; expires_in: number };
  await saveConnection(
    userId,
    "amazon",
    { refreshToken: t.refresh_token, accountId: sellerId ?? undefined },
    { accountLabel: sellerId ? `Verkäufer ${sellerId}` : null, scopes: "sellingpartnerapi", expiresAt: null, consentAt },
  );
}

/** Prüft einen Keepa-Schlüssel mit einer kostenlosen Statusabfrage. */
export async function verifyKeepaKey(key: string): Promise<{ tokensLeft: number }> {
  const res = await fetch(`https://api.keepa.com/token?key=${encodeURIComponent(key)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Der Keepa-Schlüssel wurde nicht akzeptiert.");
  const data = (await res.json()) as { tokensLeft?: number };
  return { tokensLeft: data.tokensLeft ?? 0 };
}
