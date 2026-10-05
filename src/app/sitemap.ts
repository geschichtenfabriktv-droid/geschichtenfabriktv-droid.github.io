import type { MetadataRoute } from "next";
import { SITE_URL as site } from "@/lib/site";

export const dynamic = "force-static";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Nur Verkaufsseiten; Rechtstexte bewusst nicht enthalten. */
const sitemap = (): MetadataRoute.Sitemap =>
  ["/", "/preise/", "/demo/"].map((p, i) => ({ url: `${site}${base}${p}`, changeFrequency: "weekly", priority: i === 0 ? 1 : 0.8 }));

export default sitemap;
