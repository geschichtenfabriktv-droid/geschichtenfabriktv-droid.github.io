import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { DemoShell } from "@/components/shell/demo-shell";

export const metadata: Metadata = pageMetadata({
  path: "/demo/",
  title: "Test-Dashboard: Arbitrage-Deals kostenlos ansehen",
  description: "Die Top-3-Arbitrage-Chancen je Kategorie mit Gewinnwahrscheinlichkeit, Break-even und Zielpreis. Ohne Anmeldung, sofort im Browser.",
});

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell>{children}</DemoShell>;
}
