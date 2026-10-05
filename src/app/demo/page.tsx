import { Suspense } from "react";
import { CardSkeleton } from "@/components/ui/skeleton";
import { DealExplorer } from "../app/chancen/explorer";

export default function DemoPage() {
  return (
    <Suspense fallback={<CardSkeleton />}>
      <DealExplorer />
    </Suspense>
  );
}
