import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEAL_SEEDS } from "@/lib/data/demo-catalog";
import { DealDetail } from "./deal-detail";

export const dynamicParams = false;

export function generateStaticParams() {
  return DEAL_SEEDS.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: DEAL_SEEDS.find((d) => d.id === id)?.title ?? "Chance" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!DEAL_SEEDS.some((d) => d.id === id)) notFound();
  return <DealDetail id={id} />;
}
