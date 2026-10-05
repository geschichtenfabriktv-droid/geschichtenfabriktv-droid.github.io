import type { MetadataRoute } from "next";
import { ARTICLES, articlePath, LANDINGS, landingPath } from "@/lib/content";
import { SITE_URL as site } from "@/lib/site";

export const dynamic = "force-static";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Nur Verkaufsseiten; Rechtstexte bewusst nicht enthalten. */
const sitemap = (): MetadataRoute.Sitemap => {
  const url = (p: string) => `${site}${base}${p}`;
  return [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/preise/"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/demo/"), changeFrequency: "daily", priority: 0.8 },
    ...LANDINGS.map((l) => ({ url: url(landingPath(l.slug)), changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: url("/ratgeber/"), changeFrequency: "weekly", priority: 0.6 },
    ...ARTICLES.map((a) => ({ url: url(articlePath(a.slug)), lastModified: a.updated, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
};

export default sitemap;
