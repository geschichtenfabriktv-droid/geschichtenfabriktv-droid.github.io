/** Hauptdomain der Live-Version. www und *.vercel.app leiten per vercel.json hierher um. */
export const PRIMARY_DOMAIN = "arbitrageradar.de";
export const PRIMARY_URL = `https://${PRIMARY_DOMAIN}`;

const isStatic = process.env.NEXT_PUBLIC_BACKEND === "0";

/** Öffentliche Basis-URL für Canonical, Sitemap und Open Graph. */
export const SITE_URL = (
  process.env.APP_URL ?? (isStatic ? "https://geschichtenfabriktv-droid.github.io" : PRIMARY_URL)
).replace(/\/$/, "");
