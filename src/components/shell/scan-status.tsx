"use client";

import { useEffect, useState } from "react";
import { IconRefresh } from "@/components/ui/icons";
import { relativeTime } from "@/lib/format";

export function ScanStatus({ scannedAt, scanning, onRefresh }: { scannedAt?: Date; scanning: boolean; onRefresh: () => void }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(t);
  }, []);

  return (
    <button
      type="button"
      onClick={onRefresh}
      disabled={scanning}
      className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[13px] font-medium text-ink-2 ring-1 ring-line transition hover:text-ink hover:ring-line-strong disabled:opacity-60"
    >
      <IconRefresh size={15} className={scanning ? "animate-spin" : ""} />
      {scanning ? "Aktualisiere …" : scannedAt ? `Aktualisiert ${relativeTime(scannedAt.toISOString(), now)}` : "Aktualisieren"}
    </button>
  );
}
