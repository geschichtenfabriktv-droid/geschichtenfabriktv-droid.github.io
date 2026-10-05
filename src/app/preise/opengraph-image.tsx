import { OG_SIZE, ogImage } from "@/components/seo/og-image";

export const dynamic = "force-static";
export const alt = "Arbitrage Radar Preise";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "Preise & Tarife", title: "Ab 29 € im Monat. Ein guter Deal zahlt das Abo." });
}
