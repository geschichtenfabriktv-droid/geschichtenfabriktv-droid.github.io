import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
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
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
