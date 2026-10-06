"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CategoryChips } from "@/components/market/category-chips";
import { DealCard } from "@/components/market/deal-card";
import { EmptyMarket } from "@/components/market/source-status";
import { PageHeader } from "@/components/shell/app-shell";
import { ScanStatus } from "@/components/shell/scan-status";
import { IconArrowRight, IconSearch } from "@/components/ui/icons";
import { CardSkeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/lib/client/portfolio-store";
import { useDashboard } from "@/lib/client/dashboard-mode";
import { useMarket } from "@/lib/client/use-market";
import { getCategory, isCategoryId } from "@/lib/domain/categories";
import type { AnalyzedDeal, CategoryId } from "@/lib/domain/types";

type SortKey = "wahrscheinlichkeit" | "gewinn" | "roi" | "preis" | "neu";

const SORTS: Record<SortKey, { label: string; compare: (a: AnalyzedDeal, b: AnalyzedDeal) => number }> = {
  wahrscheinlichkeit: { label: "Wahrscheinlichkeit", compare: (a, b) => b.analysis.probability - a.analysis.probability },
  gewinn: { label: "Gewinn in €", compare: (a, b) => b.analysis.expectedProfit - a.analysis.expectedProfit },
  roi: { label: "Rendite", compare: (a, b) => b.analysis.roi - a.analysis.roi },
  preis: { label: "Einkaufspreis aufsteigend", compare: (a, b) => a.source.price + a.source.shipping - (b.source.price + b.source.shipping) },
  neu: { label: "Neueste", compare: (a, b) => b.detectedAt.localeCompare(a.detectedAt) },
};

const MIN_PROB = [0, 0.45, 0.7] as const;

export function DealExplorer() {
  const routes = useDashboard();
  const { market, scanning, refresh, error } = useMarket(routes.mode);
  const { settings } = usePortfolio();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const param = params.get("kategorie");
  const category: CategoryId | "alle" = isCategoryId(param) ? param : "alle";
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("wahrscheinlichkeit");
  const [onlyDouble, setOnlyDouble] = useState(false);
  const [minProb, setMinProb] = useState<number | null>(null);
  const [source, setSource] = useState("Alle");
  const sources = useMemo(() => [...new Set((market?.deals ?? []).map((d) => d.source.platform))].sort(), [market]);
  const dirty = query !== "" || sort !== "wahrscheinlichkeit" || onlyDouble || minProb !== null || source !== "Alle" || category !== "alle";
  const reset = () => {
    setQuery("");
    setSort("wahrscheinlichkeit");
    setOnlyDouble(false);
    setMinProb(null);
    setSource("Alle");
    if (category !== "alle") router.replace(pathname, { scroll: false });
  };
  const effectiveMin = minProb ?? settings.minProbability;

  const select = (id: CategoryId | "alle") => {
    if (id === "insolvenz") {
      router.push(routes.lots);
      return;
    }
    const next = new URLSearchParams(params.toString());
    if (id === "alle") next.delete("kategorie");
    else next.set("kategorie", id);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const results = useMemo(() => {
    if (!market) return [];
    const q = query.trim().toLowerCase();
    return market.deals
      .filter((d) => category === "alle" || d.categoryId === category)
      .filter((d) => source === "Alle" || d.source.platform === source)
      .filter((d) => !onlyDouble || d.analysis.doubleUp)
      .filter((d) => d.analysis.probability >= effectiveMin)
      .filter((d) => !q || `${d.title} ${d.brand} ${d.source.platform} ${d.target.platform}`.toLowerCase().includes(q))
      .sort(SORTS[sort].compare);
  }, [market, category, source, onlyDouble, effectiveMin, query, sort]);

  const heading = category === "alle" ? "Alle Chancen" : getCategory(category).name;

  return (
    <>
      <PageHeader eyebrow="Arbitrage-Chancen" title={heading}>
        <ScanStatus scannedAt={market?.scannedAt} scanning={scanning} onRefresh={refresh} />
      </PageHeader>

      {category !== "alle" && <p className="-mt-5 mb-6 max-w-2xl text-[15px] text-ink-2">{getCategory(category).claim}.</p>}

      <div className={`mb-6 space-y-3 lg:sticky ${routes.mode === "demo" ? "lg:top-[72px]" : "lg:top-0"} lg:z-20 lg:-mx-10 lg:border-b lg:border-line lg:bg-canvas/90 lg:px-10 lg:py-3 lg:backdrop-blur-xl`}>
        {market && <CategoryChips categories={market.categories} active={category} total={market.deals.length} onSelect={select} />}
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Suchen</span>
            <IconSearch size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Produkt, Marke oder Plattform suchen"
              className="h-11 w-full rounded-[10px] bg-white pr-4 pl-10 text-sm ring-1 ring-line outline-none placeholder:text-muted focus:ring-ink"
            />
          </label>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {sources.length > 1 && (
              <label className="relative shrink-0">
                <span className="sr-only">Einkaufsquelle</span>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="h-11 appearance-none rounded-[10px] bg-white pr-9 pl-4 text-[13px] font-medium ring-1 ring-line outline-none focus:ring-ink"
                >
                  <option value="Alle">Alle Quellen</option>
                  {sources.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <span aria-hidden className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[10px] text-muted">
                  ▼
                </span>
              </label>
            )}
            <label className="relative shrink-0">
              <span className="sr-only">Sortieren nach</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-11 appearance-none rounded-[10px] bg-white pr-9 pl-4 text-[13px] font-medium ring-1 ring-line outline-none focus:ring-ink"
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
            <div className="flex shrink-0 rounded-[12px] bg-white p-1 ring-1 ring-line" role="group" aria-label="Mindest-Wahrscheinlichkeit">
              {MIN_PROB.map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={effectiveMin === m}
                  onClick={() => setMinProb(m)}
                  className={`h-9 rounded-[9px] px-3 text-[12px] font-medium transition ${effectiveMin === m ? "bg-ink text-white" : "text-ink-2 hover:text-ink"}`}
                >
                  {m === 0 ? "Alle" : `ab ${m * 100} %`}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-pressed={onlyDouble}
              onClick={() => setOnlyDouble((v) => !v)}
              className={`h-11 shrink-0 rounded-[10px] px-4 text-[13px] font-medium ring-1 transition ${onlyDouble ? "bg-ink text-white ring-ink" : "bg-white text-ink-2 ring-line hover:text-ink"}`}
            >
              2× Preis
            </button>
          </div>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-bad">{error}</p>}
      {market && market.locked.deals > 0 && (
        <Link href="/konto/" className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-white p-4 text-sm ring-1 ring-line hover:ring-ink">
          <span>
            <strong>{market.locked.deals === 1 ? "1 weitere Chance" : `${market.locked.deals} weitere Chancen`}</strong> in Kategorien, die dein Tarif nicht enthält.
          </span>
          <span className="shrink-0 font-medium underline underline-offset-4">Tarif erweitern</span>
        </Link>
      )}
      {!market ? (
        <CardSkeleton />
      ) : !market.demo && market.deals.length === 0 ? (
        <EmptyMarket
          title="Gerade keine geprüften Chancen"
          text="Hier erscheinen nur echte Angebote, die unter dem aktuellen Marktpreis liegen, nie Beispieldaten. Die Liste wird bei jedem Aufruf neu geprüft."
          sources={market.sources}
        />
      ) : results.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white px-6 py-16 text-center ring-1 ring-line">
          <p className="font-display text-3xl">Keine Treffer</p>
          <p className="mt-2 text-sm text-muted">Lockere die Filter oder wähle eine andere Kategorie.</p>
          {dirty && (
            <button type="button" onClick={reset} className="mt-4 text-sm font-medium underline underline-offset-4">
              Filter zurücksetzen
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between text-[13px] text-muted" aria-live="polite">
            <span>
              {results.length} {results.length === 1 ? "Chance" : "Chancen"}
            </span>
            {dirty && (
              <button type="button" onClick={reset} className="font-medium text-ink underline underline-offset-4">
                Filter zurücksetzen
              </button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((d, i) => (
              <DealCard key={d.id} deal={d} now={market.scannedAt} index={i} href={routes.deal(d.id)} />
            ))}
          </div>
        </>
      )}

      <Link
        href={routes.lots}
        className="group mt-10 flex items-center justify-between gap-4 rounded-[var(--radius-card)] bg-tag p-6 text-ink transition-colors hover:bg-[#ffcc1a]"
      >
        <span>
          <span className="block font-display text-[22px] md:text-[26px]">Insolvenzmassen</span>
          <span className="mt-1 block text-[15px] text-tag-ink">Warenlager, Maschinen und Rechte unter Wert</span>
        </span>
        <IconArrowRight className="shrink-0" />
      </Link>
    </>
  );
}
