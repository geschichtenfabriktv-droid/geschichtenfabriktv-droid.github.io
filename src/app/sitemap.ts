import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const site = (
  process.env.APP_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://geschichtenfabriktv-droid.github.io")
).replace(/\/$/, "");

/** Nur Verkaufsseiten; Rechtstexte bewusst nicht enthalten. */
const sitemap = (): MetadataRoute.Sitemap =>
  ["/", "/preise/", "/demo/"].map((p, i) => ({ url: `${site}${base}${p}`, changeFrequency: "weekly", priority: i === 0 ? 1 : 0.8 }));

export default sitemap;
