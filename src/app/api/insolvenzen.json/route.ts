import { getAnalyzedLots } from "@/lib/data/repository";

export const dynamic = "force-static";

export async function GET() {
  const lots = await getAnalyzedLots();
  return Response.json({ generatedAt: new Date().toISOString(), demo: true, count: lots.length, lots });
}
