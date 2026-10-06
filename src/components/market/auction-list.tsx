"use client";

import { useMemo, useState } from "react";
import { IconSearch } from "@/components/ui/icons";
import type { AuctionLink } from "@/lib/domain/types";

const fmt = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/** Laufende Auktionen bei externen Anbietern. Gebote, Fotos und Beschreibung stehen beim Anbieter. */
export function AuctionList({ auctions, limit, search = false }: { auctions: AuctionLink[]; limit?: number; search?: boolean }) {
  const [query, setQuery] = useState("");
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = auctions
      .filter((a) => !q || a.title.toLowerCase().includes(q))
      .slice()
      .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
    return limit ? sorted.slice(0, limit) : sorted;
  }, [auctions, query, limit]);

  return (
    <div>
      {search && (
        <label className="mb-3 flex h-11 items-center gap-2 rounded-[10px] bg-white px-3 ring-1 ring-line focus-within:ring-ink">
          <IconSearch size={16} className="text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="z. B. Rolex, BMW, Maschine"
            className="h-full w-full bg-transparent text-sm outline-none"
            aria-label="Auktionen durchsuchen"
          />
        </label>
      )}
      <ul className="divide-y divide-line rounded-[var(--radius-card)] bg-white ring-1 ring-line">
        {shown.map((a) => (
          <li key={a.id}>
            <a href={a.url} target="_blank" rel="noopener noreferrer nofollow" className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-canvas">
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-medium">{a.title}</span>
                <span className="block text-[12px] text-muted">
                  {a.platform}
                  {a.updatedAt && ` · aktualisiert ${fmt.format(new Date(a.updatedAt))}`}
                </span>
              </span>
              <span className="shrink-0 text-[13px] font-medium underline underline-offset-4">Gebote ansehen</span>
            </a>
          </li>
        ))}
        {shown.length === 0 && <li className="px-4 py-6 text-sm text-muted">Keine Auktion passt zur Suche.</li>}
      </ul>
      <p className="mt-2 text-[12px] leading-relaxed text-muted">
        Quelle: justiz-auktion.de, die Versteigerungsplattform der Justiz für Gerichte, Staatsanwaltschaften und Insolvenzverwalter. Gebote, Fotos und
        Bedingungen stehen beim Anbieter.
      </p>
    </div>
  );
}
