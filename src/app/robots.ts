import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const site = (process.env.APP_URL ?? "").replace(/\/$/, "");

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
  ...(site ? { sitemap: `${site}${base}/sitemap.xml` } : {}),
});

export default robots;
