import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOT_SEEDS } from "@/lib/data/demo-catalog";
import { LotDetail } from "./lot-detail";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: LOT_SEEDS.find((l) => l.id === id)?.title ?? "Insolvenzmasse" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!LOT_SEEDS.some((l) => l.id === id)) notFound();
  return <LotDetail id={id} />;
}
