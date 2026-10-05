import { getAnalyzedDeals, getAnalyzedLots, summarizeCategories } from "@/lib/data/repository";

export const dynamic = "force-static";

export async function GET() {
  const now = new Date();
  const categories = summarizeCategories(await getAnalyzedDeals(now), await getAnalyzedLots(now));
  return Response.json({ generatedAt: now.toISOString(), demo: true, categories });
}
