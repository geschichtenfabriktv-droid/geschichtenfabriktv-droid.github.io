import type { Metadata } from "next";
import { DemoShell } from "@/components/shell/demo-shell";

export const metadata: Metadata = {
  title: "Test-Dashboard",
  description: "Arbitrage Radar kostenlos ansehen: die besten Arbitrage-Chancen je Kategorie mit Gewinnwahrscheinlichkeit, ohne Anmeldung.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell>{children}</DemoShell>;
}
