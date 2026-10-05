import { NextResponse } from "next/server";
import { createOAuthState } from "@/server/connections";
import { env } from "@/server/env";
import { getCurrentUser } from "@/server/session";
import { hasAccess } from "@/server/users";

/**
 * Login-URI der Amazon-App: Startet ein Händler die Verbindung im Amazon Appstore, schickt Amazon ihn
 * hierher. Nach Anmeldung geht es mit unserem State zurück zur Zustimmungsseite von Amazon.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const callback = url.searchParams.get("amazon_callback_uri") ?? "";
  const amazonState = url.searchParams.get("amazon_state") ?? "";
  const back = (status: string) => NextResponse.redirect(`${env.appUrl}/konto/verbindungen/?${new URLSearchParams({ anbieter: "amazon", status })}`);

  let target: URL;
  try {
    target = new URL(callback);
  } catch {
    return back("fehler");
  }
  // Nur echte Amazon-Seller-Central-Adressen, damit niemand diese Seite als Weiterleitung missbraucht.
  if (target.protocol !== "https:" || !/^sellercentral(-europe)?\.amazon\.[a-z.]+$/.test(target.hostname) || !amazonState) return back("fehler");

  const user = await getCurrentUser();
  if (!user) {
    const next = `/api/amazon/login/?${url.searchParams.toString()}`;
    return NextResponse.redirect(`${env.appUrl}/login/?${new URLSearchParams({ weiter: next })}`);
  }
  if (!hasAccess(user)) return NextResponse.redirect(`${env.appUrl}/konto/?hinweis=abo`);

  target.searchParams.set("redirect_uri", `${env.appUrl}/api/verbindungen/amazon/callback/`);
  target.searchParams.set("amazon_state", amazonState);
  target.searchParams.set("state", await createOAuthState(user.id, "amazon"));
  if (process.env.AMAZON_SP_DRAFT === "1") target.searchParams.set("version", "beta");
  return NextResponse.redirect(target.toString());
}
