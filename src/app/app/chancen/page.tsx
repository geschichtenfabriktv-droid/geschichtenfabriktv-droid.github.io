import type { Metadata } from "next";
import { Suspense } from "react";
import { CardSkeleton } from "@/components/ui/skeleton";
import { DealExplorer } from "./explorer";

export const metadata: Metadata = { title: "Arbitrage-Chancen" };

export default function Page() {
  return (
    <Suspense fallback={<CardSkeleton />}>
      <DealExplorer />
    </Suspense>
  );
}
