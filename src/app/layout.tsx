import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Selbst gehostet und vorgeladen, mit angepassten Ersatzschrift-Metriken gegen Layoutverschiebung (CLS).
const archivo = localFont({
  src: "../../node_modules/@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-archivo",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

export const metadata: Metadata = {
  // Ohne basePath: Next.js setzt ihn bei Bild-URLs selbst davor.
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: "Arbitrage Radar · Gewinne finden, bevor der Markt sie sieht",
    template: "%s · Arbitrage Radar",
  },
  description:
    "Arbitrage Radar erkennt Preisgefälle, Vorbestell-Chancen und Insolvenzmassen, analysiert den Markt und zeigt die Gewinnwahrscheinlichkeit. Kaufen und Einstellen auf Knopfdruck.",
  applicationName: "Arbitrage Radar",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Arbitrage Radar",
    url: "./",
    title: "Arbitrage Radar · Gewinne finden, bevor der Markt sie sieht",
    description: "Arbitrage-Chancen, Vorbestellungen und Insolvenzmassen mit Gewinnwahrscheinlichkeit. Kaufen und Einstellen auf Knopfdruck.",
  },
  manifest: `${basePath}/manifest.webmanifest`,
  icons: { icon: `${basePath}/icon.svg`, apple: `${basePath}/apple-touch-icon.png` },
  appleWebApp: { capable: true, title: "Arbitrage", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
