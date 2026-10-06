"use client";

import Link from "next/link";
import { DealCard } from "@/components/market/deal-card";
import { LotCard } from "@/components/market/lot-card";
import { PageHeader } from "@/components/shell/app-shell";
import { ScanStatus } from "@/components/shell/scan-status";
import { IconArrowRight } from "@/components/ui/icons";
import { ProbabilityBar } from "@/components/ui/probability-bar";
import { CardSkeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/lib/client/dashboard-mode";
import { useMarket } from "@/lib/client/use-market";
import { eur, number, percent } from "@/lib/format";

function greeting(d: Date) {
  const h = d.getHours();
  return h < 11 ? "Guten Morgen" : h < 18 ? "Guten Tag" : "Guten Abend";
}

export function Overview() {
  const routes = useDashboard();
  const { market, scanning, refresh, error } = useMarket(routes.mode);

  if (!market) {
    return (
      <>
        <PageHeader eyebrow="Übersicht" title={error ? "Daten nicht verfügbar" : "Chancen werden geladen …"} />
        {error && <p className="mb-6 text-sm text-bad">{error}</p>}
        <CardSkeleton />
      </>
    );
  }

  const { deals, lots, categories, scannedAt } = market;
  const strong = deals.filter((d) => d.analysis.chance === "hoch");
  const potential = strong.reduce((s, d) => s + d.analysis.expectedProfit, 0);
  const avgProbability = deals.reduce((s, d) => s + d.analysis.probability, 0) / deals.length;
  const doubles = deals.filter((d) => d.analysis.doubleUp).length;

  const kpis = [
    { label: "Aktive Chancen", value: number(deals.length + lots.length), note: `${strong.length} mit hoher Chance` },
    { label: "Gewinnpotenzial", value: eur(potential, { cents: false }), note: "aus Chancen mit hoher Wahrscheinlichkeit" },
    { label: "Ø Wahrscheinlichkeit", value: percent(avgProbability), note: "über alle Produkt-Deals" },
    { label: "2×-Kandidaten", value: number(doubles), note: "Marktpreis mind. doppelt so hoch" },
  ];

  return (
    <>
      <PageHeader
        eyebrow={scannedAt.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
        title={
          <>
            {greeting(scannedAt)}.{" "}
            {strong.length === 0 ? (
              <span className="italic text-muted">Gerade keine starken Chancen.</span>
            ) : strong.length === 1 ? (
              <>
                <span className="italic text-muted">1 starke Chance</span> wartet.
              </>
            ) : (
              <>
                <span className="italic text-muted">{strong.length} starke Chancen</span> warten.
              </>
            )}
          </>
        }
      >
        <ScanStatus scannedAt={scannedAt} scanning={scanning} onRefresh={refresh} />
      </PageHeader>

      <section aria-label="Kennzahlen" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <div key={k.label} className="rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line animate-rise" style={{ animationDelay: `${i * 50}ms` }}>
            <p className="text-[12px] font-medium text-muted">{k.label}</p>
            <p className="tabular mt-2 text-[26px] font-semibold tracking-tight md:text-[32px]">{k.value}</p>
            <p className="mt-1 text-[12px] leading-snug text-muted">{k.note}</p>
          </div>
        ))}
      </section>

      <section className="mt-12" aria-labelledby="kat">
        <div className="mb-4 flex items-end justify-between">
          <h2 id="kat" className="text-xl font-semibold tracking-tight">
            Kategorien
          </h2>
          <Link href={routes.list} className="text-sm font-medium text-ink-2 hover:text-ink">
            Alle Chancen
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              href={c.id === "insolvenz" ? routes.lots : `${routes.list}?kategorie=${c.id}`}
              className="group flex flex-col rounded-[var(--radius-card)] bg-white p-4 ring-1 sm:p-5 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)] animate-rise"
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[15px] font-semibold leading-tight tracking-tight sm:text-[16px]">{c.name}</h3>
                  <p className="mt-1 line-clamp-2 hidden text-[13px] leading-snug text-muted sm:block">{c.claim}</p>
                </div>
                <span className="hidden size-9 shrink-0 place-items-center rounded-full bg-canvas transition sm:grid group-hover:bg-ink group-hover:text-white">
                  <IconArrowRight size={16} />
                </span>
              </div>
              <div className="mt-auto flex flex-col gap-x-4 gap-y-0.5 pt-3 text-[12px] text-muted sm:mt-4 sm:flex-row sm:items-center sm:pt-0">
                <span className="tabular">
                  <strong className="font-semibold text-ink">{c.count}</strong> Treffer
                </span>
                <span className="tabular">
                  bis <strong className="font-semibold text-ink">{eur(c.bestProfit, { cents: false })}</strong> Gewinn
                </span>
              </div>
              <ProbabilityBar probability={c.avgProbability} size="sm" className="mt-3" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="top">
        <div className="mb-4 flex items-end justify-between">
          <h2 id="top" className="text-xl font-semibold tracking-tight">
            Top-Chancen jetzt
          </h2>
          <Link href={routes.list} className="text-sm font-medium text-ink-2 hover:text-ink">
            Alle ansehen
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {deals.slice(0, 6).map((d, i) => (
            <DealCard key={d.id} deal={d} now={scannedAt} index={i} href={routes.deal(d.id)} />
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="ins">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 id="ins" className="text-xl font-semibold tracking-tight">
              Insolvenzmassen
            </h2>
            <p className="mt-0.5 text-[12px] text-muted">Beispieldaten – alle Verfahren sind fiktiv.</p>
          </div>
          <Link href={routes.lots} className="text-sm font-medium text-ink-2 hover:text-ink">
            Alle Verfahren
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {lots.slice(0, 3).map((l, i) => (
            <LotCard key={l.id} lot={l} now={scannedAt} index={i} href={routes.lot(l.id)} />
          ))}
        </div>
      </section>
    </>
  );
}
