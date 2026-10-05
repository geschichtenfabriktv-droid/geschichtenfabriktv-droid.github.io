import { getAnalyzedDeals } from "@/lib/data/repository";

export const dynamic = "force-static";

/** Analysierte Deals als JSON (beim statischen Export zum Build-Zeitpunkt erzeugt). */
export async function GET() {
  const deals = await getAnalyzedDeals();
  return Response.json({ generatedAt: new Date().toISOString(), demo: true, count: deals.length, deals });
}
