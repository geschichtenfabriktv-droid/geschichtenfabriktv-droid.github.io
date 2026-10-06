import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { formatAbTag, parseAbTag } from "@/lib/experiments";
import { env } from "@/server/env";
import { recordAb } from "@/server/experiments";
import { isMollieConfigured } from "@/server/mollie";
import { getCurrentUser } from "@/server/session";
import { hasAccess } from "@/server/users";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "Tarif buchen", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const qs = new URLSearchParams(Object.entries(sp).filter((e): e is [string, string] => typeof e[1] === "string")).toString();
  const user = await getCurrentUser();
  if (!user) redirect(`/registrieren/?weiter=${encodeURIComponent(`/checkout/${qs ? `?${qs}` : ""}`)}`);
  if (hasAccess(user) && user.status === "active") redirect("/konto/");
  const ab = parseAbTag(sp.ab);
  await recordAb(ab, "checkout").catch(() => {});
  return <CheckoutForm ab={formatAbTag(ab)} initialPlan={sp.plan} initialInterval={sp.intervall} email={user.email} paymentsReady={isMollieConfigured() && !env.salesPaused} paused={env.salesPaused} countriesLive={env.countriesLive} />;
}
