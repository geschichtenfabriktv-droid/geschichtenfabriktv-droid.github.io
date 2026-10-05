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

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  ...(isStatic ? { output: "export" as const, trailingSlash: true } : { trailingSlash: true }),
  basePath,
  pageExtensions: isStatic ? ["tsx", "ts"] : ["srv.tsx", "srv.ts", "tsx", "ts"],
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_BACKEND: isStatic ? "0" : "1",
  },
  ...(isStatic
    ? {}
    : {
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
