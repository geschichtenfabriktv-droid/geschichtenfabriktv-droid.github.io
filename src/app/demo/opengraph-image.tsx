import { OG_SIZE, ogImage } from "@/components/seo/og-image";

export const dynamic = "force-static";
export const alt = "Arbitrage Radar Test-Dashboard";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "Test-Dashboard", title: "Die besten Chancen je Kategorie, kostenlos ansehen." });
}
