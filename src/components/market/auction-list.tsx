"use client";

import { useMemo, useState } from "react";
import { IconSearch } from "@/components/ui/icons";
import { AUCTION_KINDS, auctionKind, type AuctionKind } from "@/lib/auction-kind";
import type { AuctionLink } from "@/lib/domain/types";

const fmt = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

type SortKey = "neu" | "alt" | "az" | "za";
const SORTS: Record<SortKey, { label: string; compare: (a: AuctionLink, b: AuctionLink) => number }> = {
  neu: { label: "Zuletzt aktualisiert", compare: (a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "") },
  alt: { label: "Am längsten unverändert", compare: (a, b) => (a.updatedAt ?? "").localeCompare(b.updatedAt ?? "") },
  az: { label: "Titel A–Z", compare: (a, b) => a.title.localeCompare(b.title, "de") },
  za: { label: "Titel Z–A", compare: (a, b) => b.title.localeCompare(a.title, "de") },
};

const chip = (active: boolean) =>
  `h-9 shrink-0 rounded-[10px] px-3 text-[13px] font-medium transition ${active ? "bg-ink text-white" : "bg-white text-ink-2 ring-1 ring-line hover:text-ink"}`;

/**
 * Laufende Auktionen bei externen Anbietern. Gebote, Fotos und Beschreibung stehen beim Anbieter.
 * Mit `filters` gibt es Suche, Anbieter, Art, Sortierung, Trefferzahl und Zurücksetzen.
 */
export function AuctionList({ auctions, limit, filters = false }: { auctions: AuctionLink[]; limit?: number; filters?: boolean }) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<string>("Alle");
  const [kind, setKind] = useState<AuctionKind | "Alle">("Alle");
  const [sort, setSort] = useState<SortKey>("neu");

  const withKind = useMemo(() => auctions.map((a) => ({ ...a, kind: auctionKind(a.title) })), [auctions]);
  const platforms = useMemo(() => [...new Set(auctions.map((a) => a.platform))].sort(), [auctions]);
  const kindCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of withKind) if (platform === "Alle" || a.platform === platform) m.set(a.kind, (m.get(a.kind) ?? 0) + 1);
    return m;
  }, [withKind, platform]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return withKind
      .filter((a) => platform === "Alle" || a.platform === platform)
      .filter((a) => kind === "Alle" || a.kind === kind)
      .filter((a) => !q || a.title.toLowerCase().includes(q))
      .sort(SORTS[sort].compare);
  }, [withKind, platform, kind, query, sort]);
  const shown = limit ? filtered.slice(0, limit) : filtered;
  const dirty = query !== "" || platform !== "Alle" || kind !== "Alle" || sort !== "neu";
  const reset = () => {
    setQuery("");
    setPlatform("Alle");
    setKind("Alle");
    setSort("neu");
  };

  return (
    <div>
      {filters && (
        <div className="mb-4 space-y-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Auktionen durchsuchen</span>
              <IconSearch size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="z. B. Rolex, BMW, Maschine"
                className="h-11 w-full rounded-[10px] bg-white pr-4 pl-10 text-sm ring-1 ring-line outline-none placeholder:text-muted focus:ring-ink"
              />
            </label>
            <div className="flex gap-2">
              <label className="relative min-w-0 flex-1 md:flex-none">
                <span className="sr-only">Anbieter</span>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="h-11 w-full appearance-none rounded-[10px] bg-white pr-9 pl-4 text-[13px] font-medium ring-1 ring-line outline-none focus:ring-ink"
                >
                  <option value="Alle">Alle Anbieter</option>
                  {platforms.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <span aria-hidden className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[10px] text-muted">
                  ▼
                </span>
              </label>
              <label className="relative min-w-0 flex-1 md:flex-none">
                <span className="sr-only">Sortieren nach</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-11 w-full appearance-none rounded-[10px] bg-white pr-9 pl-4 text-[13px] font-medium ring-1 ring-line outline-none focus:ring-ink"
                >
                  {Object.entries(SORTS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
                <span aria-hidden className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[10px] text-muted">
                  ▼
                </span>
              </label>
            </div>
          </div>
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0" role="toolbar" aria-label="Art">
            <button type="button" aria-pressed={kind === "Alle"} onClick={() => setKind("Alle")} className={chip(kind === "Alle")}>
              Alle
            </button>
            {AUCTION_KINDS.filter((k) => kindCounts.get(k)).map((k) => (
              <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={chip(kind === k)}>
                {k} <span className="tabular opacity-60">{kindCounts.get(k)}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between text-[13px] text-muted" aria-live="polite">
            <span>
              {filtered.length} {filtered.length === 1 ? "Auktion" : "Auktionen"}
            </span>
            {dirty && (
              <button type="button" onClick={reset} className="font-medium text-ink underline underline-offset-4">
                Filter zurücksetzen
              </button>
            )}
          </div>
        </div>
      )}
      <ul className="divide-y divide-line rounded-[var(--radius-card)] bg-white ring-1 ring-line">
        {shown.map((a) => (
          <li key={a.id}>
            <a href={a.url} target="_blank" rel="noopener noreferrer nofollow" className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-canvas">
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-medium">{a.title}</span>
                <span className="block text-[12px] text-muted">
                  {a.platform} · {a.kind}
                  {a.updatedAt && ` · aktualisiert ${fmt.format(new Date(a.updatedAt))}`}
                </span>
              </span>
              <span className="shrink-0 text-[13px] font-medium underline underline-offset-4">Gebote ansehen</span>
            </a>
          </li>
        ))}
        {shown.length === 0 && <li className="px-4 py-6 text-sm text-muted">Keine Auktion passt zu den Filtern.</li>}
      </ul>
      <p className="mt-2 text-[12px] leading-relaxed text-muted">
        Quellen: justiz-auktion.de (Versteigerungsplattform der Justiz für Gerichte, Staatsanwaltschaften und Insolvenzverwalter) und netbid.com
        (Industrie- und Insolvenzauktionen). Die Art ist aus dem Titel abgeleitet. Gebote, Fotos und Bedingungen stehen beim Anbieter.
      </p>
    </div>
  );
}
