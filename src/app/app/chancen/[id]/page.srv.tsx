import type { Metadata } from "next";
import { DealDetail } from "./deal-detail";

// Echte Chancen haben wechselnde IDs; ob es sie (noch) gibt, prüft die Detailansicht anhand der Marktdaten.
export const metadata: Metadata = { title: "Chance" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DealDetail id={id} />;
}
