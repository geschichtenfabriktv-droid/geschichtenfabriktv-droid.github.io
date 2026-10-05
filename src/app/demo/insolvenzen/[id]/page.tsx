import { LOT_SEEDS } from "@/lib/data/demo-catalog";
import { LotDetail } from "../../../app/insolvenzen/[id]/lot-detail";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOT_SEEDS.map((l) => ({ id: l.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LotDetail id={id} />;
}
