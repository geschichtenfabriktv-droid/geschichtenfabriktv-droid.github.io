import { OG_SIZE, ogImage } from "@/components/seo/og-image";

export const dynamic = "force-static";
export const alt = "Ratgeber von Arbitrage Radar";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "Ratgeber", title: "Wissen für Reseller: Arbitrage, Gewinn, Gebühren, Steuern." });
}
