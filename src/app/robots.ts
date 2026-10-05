import type { MetadataRoute } from "next";
import { SITE_URL as site } from "@/lib/site";

export const dynamic = "force-static";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Rechtstexte (mit Anbieterangaben) und private Bereiche sind für Suchmaschinen gesperrt. */
const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: "*",
      allow: `${base}/`,
      disallow: ["impressum", "datenschutz", "agb", "widerruf", "avv", "kuendigen", "app", "konto", "checkout", "api", "login", "registrieren", "passwort-vergessen", "passwort-zuruecksetzen"].map(
        (p) => `${base}/${p}/`,
      ),
    },
  ],
  sitemap: `${site}${base}/sitemap.xml`,
  host: site,
});

export default robots;
