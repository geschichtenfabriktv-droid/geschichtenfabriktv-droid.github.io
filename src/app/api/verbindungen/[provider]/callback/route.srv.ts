import { NextResponse } from "next/server";
import { consumeOAuthState } from "@/server/connections";
import { env } from "@/server/env";
import { completeAmazonConnection, completeEbayConnection } from "@/server/marketplaces";
import { getCurrentUser } from "@/server/session";

/** Rücksprung vom Anbieter. Der State muss zum angemeldeten Nutzer passen. */
export async function GET(req: Request, ctx: { params: Promise<{ provider: string }> }) {
  const { provider } = await ctx.params;
  const url = new URL(req.url);
  const back = (status: string) => NextResponse.redirect(`${env.appUrl}/konto/verbindungen/?${new URLSearchParams({ anbieter: provider, status })}`);
  try {
    const user = await getCurrentUser();
    const state = url.searchParams.get("state") ?? "";
    if (provider !== "ebay" && provider !== "amazon") return back("fehler");
    const owner = await consumeOAuthState(state, provider);
    if (!user || owner !== user.id) return back("ungueltig");
    if (provider === "ebay") {
      const code = url.searchParams.get("code");
      if (!code) return back("abgelehnt");
      await completeEbayConnection(user.id, code, new Date());
    } else {
      const code = url.searchParams.get("spapi_oauth_code");
      if (!code) return back("abgelehnt");
      await completeAmazonConnection(user.id, code, url.searchParams.get("selling_partner_id"), new Date());
    }
    return back("verbunden");
  } catch (e) {
    console.error(`[oauth:${provider}]`, e);
    return back("fehler");
  }
}
