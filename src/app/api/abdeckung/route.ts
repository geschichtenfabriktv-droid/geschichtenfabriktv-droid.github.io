import { NextResponse } from "next/server";
import type { Country } from "@/lib/pricing";
import { env } from "@/server/env";
import { scanMarket } from "@/server/market-scan";

export const dynamic = "force-dynamic";

/**
 * Öffentliche Live-Zahlen für die Website: wie viele Quellen verbunden sind und wie viele echte Treffer
 * sie gerade liefern. Nur Zahlen, keine Inhalte. Das CDN hält die Antwort 5 Minuten, damit Besucher
 * keine Abfragen bei den Quellen auslösen.
 */
export async function GET() {
  const now = new Date();
  const countries: Country[] = env.countriesLive ? ["DE", "AT", "CH"] : ["DE"];
  const { deals, auctions, sources, news } = await scanMarket(countries, now);
  return NextResponse.json(
    {
      scannedAt: now.toISOString(),
      sourcesLive: sources.filter((s) => s.live).length,
      sourcesTotal: sources.length,
      deals: deals.length,
      auctions: auctions.length,
      news: news.length,
      countries,
    },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
  );
}
