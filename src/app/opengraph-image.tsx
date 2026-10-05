import { OG_SIZE, ogImage } from "@/components/seo/og-image";

export const dynamic = "force-static";
export const alt = "Arbitrage Radar: Gewinne finden, bevor der Markt sie sieht";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "Arbitrage-Software", title: "Gewinne finden, bevor der Markt sie sieht." });
}
