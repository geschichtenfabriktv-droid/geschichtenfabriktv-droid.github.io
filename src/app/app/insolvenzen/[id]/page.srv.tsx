import type { Metadata } from "next";
import { LotDetail } from "./lot-detail";

// Echte Chancen haben wechselnde IDs; ob es sie (noch) gibt, prüft die Detailansicht anhand der Marktdaten.
export const metadata: Metadata = { title: "Insolvenzmasse" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LotDetail id={id} />;
}
