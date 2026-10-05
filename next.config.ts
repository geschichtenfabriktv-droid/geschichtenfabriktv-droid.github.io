import type { NextConfig } from "next";

/**
 * Zwei Betriebsarten:
 * - Server (Standard, z. B. Vercel): Konten, Zahlungen, Marktplatz-Verbindungen, Dashboard.
 *   Dateien mit der Endung `.srv.ts(x)` (API-Routen, Dashboard) werden nur hier gebaut.
 * - STATIC_EXPORT=1 (GitHub Pages): Verkaufsseite, Preise, Test-Dashboard und Rechtstexte als
 *   statische Vorschau unter BASE_PATH (Standard /arbitrage).
 */
const isStatic = process.env.STATIC_EXPORT === "1";
const basePath = isStatic ? (process.env.BASE_PATH ?? "/arbitrage") : "";

/**
 * Anbieterangaben fürs Impressum kommen ausschließlich aus Umgebungsvariablen (nie aus dem Repo).
 * Sie werden kodiert eingebettet und erst im Browser lesbar gemacht, damit sie nicht als Klartext im
 * HTML stehen. Rechtstexte sind zusätzlich per noindex, robots.txt und X-Robots-Tag von Suchmaschinen
 * ausgeschlossen.
 */
const impressum = ["NAME", "STREET", "CITY", "COUNTRY", "EMAIL", "PHONE", "VAT_ID"].reduce<Record<string, string>>((acc, k) => {
  const v = process.env[`IMPRESSUM_${k}`]?.trim();
  if (v) acc[k.toLowerCase()] = v;
  return acc;
}, {});
const impressumEncoded = Object.keys(impressum).length
  ? Buffer.from(JSON.stringify(impressum), "utf8").toString("base64").split("").reverse().join("")
  : "";

const LEGAL_PATHS = ["impressum", "datenschutz", "agb", "widerruf", "avv", "kuendigen"];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  ...(isStatic ? { output: "export" as const, trailingSlash: true } : { trailingSlash: true }),
  basePath,
  pageExtensions: isStatic ? ["tsx", "ts"] : ["srv.tsx", "srv.ts", "tsx", "ts"],
  images: { unoptimized: true },
  // PGlite lädt WASM-Dateien zur Laufzeit; nicht bündeln.
  serverExternalPackages: ["@electric-sql/pglite"],
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_BACKEND: isStatic ? "0" : "1",
    NEXT_PUBLIC_LEGAL_DATA: impressumEncoded,
  },
  ...(isStatic
    ? {}
    : {
        async headers() {
          const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }];
          return [
            { source: "/:path*", headers: securityHeaders },
            ...LEGAL_PATHS.map((p) => ({ source: `/${p}/:path*`, headers: noindex })),
            ...["app", "konto", "checkout", "login", "registrieren", "passwort-vergessen", "passwort-zuruecksetzen"].map((p) => ({
              source: `/${p}/:path*`,
              headers: noindex,
            })),
          ];
        },
      }),
};

export default nextConfig;
