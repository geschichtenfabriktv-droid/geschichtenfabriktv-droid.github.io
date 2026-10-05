import { OG_SIZE, ogImage } from "@/components/seo/og-image";
import { ARTICLES, getArticle } from "@/lib/content";

export const dynamic = "force-static";
export const alt = "Ratgeber von Arbitrage Radar";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug);
  return ogImage({ eyebrow: "Ratgeber", title: a?.h1 ?? "Ratgeber" });
}
