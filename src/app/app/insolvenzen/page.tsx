import type { Metadata } from "next";
import { LotExplorer } from "./explorer";

export const metadata: Metadata = { title: "Insolvenzmassen" };

export default function Page() {
  return <LotExplorer />;
}
