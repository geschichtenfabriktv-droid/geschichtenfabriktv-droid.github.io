import { DEAL_SEEDS } from "@/lib/data/demo-catalog";
import { DealDetail } from "../../../app/chancen/[id]/deal-detail";

export const dynamicParams = false;

export function generateStaticParams() {
  return DEAL_SEEDS.map((d) => ({ id: d.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DealDetail id={id} />;
}
