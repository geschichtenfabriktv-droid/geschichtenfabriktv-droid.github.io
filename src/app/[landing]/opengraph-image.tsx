import { OG_SIZE, ogImage } from "@/components/seo/og-image";
import { getLanding, LANDINGS } from "@/lib/content";

export const dynamic = "force-static";
export const alt = "Arbitrage Radar";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return LANDINGS.map((l) => ({ landing: l.slug }));
}

export default async function Image({ params }: { params: Promise<{ landing: string }> }) {
  const page = getLanding((await params).landing);
  return ogImage({ eyebrow: page?.eyebrow ?? "Arbitrage Radar", title: page?.h1 ?? "Arbitrage Radar" });
}
