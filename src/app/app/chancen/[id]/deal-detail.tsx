"use client";

import Link from "next/link";
import { useState } from "react";
import { FactorList } from "@/components/market/factor-list";
import { PriceChart } from "@/components/market/price-chart";
import { TradeSheet, type TradeMode } from "@/components/market/trade-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconBolt, IconCart, IconTag } from "@/components/ui/icons";
import { ProbabilityBar } from "@/components/ui/probability-bar";
import { CardSkeleton } from "@/components/ui/skeleton";
import { UpsellCard } from "@/components/market/upsell";
import { useDashboard } from "@/lib/client/dashboard-mode";
import { useSessionUser } from "@/lib/client/user-context";
import { useMarket } from "@/lib/client/use-market";
import { hasFeature } from "@/lib/pricing";
import { useRouter } from "next/navigation";
import { getCategory } from "@/lib/domain/categories";
import { dateDe, eur, number, percent, relativeTime, signedEur, signedPercent } from "@/lib/format";

export function DealDetail({ id }: { id: string }) {
  const routes = useDashboard();
  const user = useSessionUser();
  const router = useRouter();
  const { market } = useMarket(routes.mode);
  const [mode, setModeRaw] = useState<TradeMode | null>(null);
  const demo = routes.mode === "demo";
  const canAutopilot = demo || hasFeature(user?.plan, user?.addons ?? [], "autopilot");
  const setMode = (m: TradeMode | null) => {
    if (m && demo) {
      router.push("/preise/");
      return;
    }
    if (m === "autopilot" && !canAutopilot) {
      router.push("/konto/?hinweis=autopilot");
      return;
    }
    setModeRaw(m);
  };

  if (!market) return <CardSkeleton count={2} />;
  const deal = market.deals.find((d) => d.id === id);
  if (!deal)
    return (
      <div className="mx-auto max-w-xl py-10">
        <UpsellCard
          title={demo ? "Diese Chance ist im Tarif enthalten" : "Diese Chance ist nicht mehr verfügbar"}
          text={demo ? "Im Test-Dashboard siehst du die drei besten Chancen je Kategorie. Mit einem Tarif bekommst du alle Treffer, Live-Preise und die Aktionen." : "Der Markt hat sich bewegt. Sieh dir die aktuellen Chancen an."}
          href={demo ? "/preise/" : routes.list}
          cta={demo ? "Tarife ansehen" : "Zu den Chancen"}
        />
      </div>
    );
  const a = deal.analysis;
  const m = deal.market;
  const category = getCategory(deal.categoryId);

  const costs = [
    { label: `Einkauf bei ${deal.source.platform}`, value: -deal.source.price },
    { label: "Versand Einkauf", value: -deal.source.shipping },
    { label: `Verkauf auf ${deal.target.platform}`, value: a.recommendedPrice },
    { label: `Provision ${percent(deal.target.feeRate, 1)}${deal.target.fixedFee ? ` + ${eur(deal.target.fixedFee)}` : ""}`, value: -(a.recommendedPrice * deal.target.feeRate + deal.target.fixedFee) },
    { label: "Versand an Käufer", value: -deal.target.shipping },
  ].filter((c) => c.value !== 0);

  return (
    <>
      <Link href={`${routes.list}?kategorie=${deal.categoryId}`} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink-2 hover:text-ink">
        <IconArrowLeft size={16} /> {category.name}
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
        <div className="min-w-0 space-y-6">
          <header className="animate-rise">
            <div className="flex flex-wrap gap-2">
              <Badge tone="outline">{deal.brand}</Badge>
              {a.doubleUp && <Badge tone="ink">2× Preis-Kandidat</Badge>}
              {deal.limited && <Badge tone="outline">Limitiert</Badge>}
              {deal.kind === "vorbestellung" && <Badge tone="warn">Vorbestellung</Badge>}
              {deal.kind === "dienstleistung" && <Badge tone="neutral">Dienstleistung</Badge>}
            </div>
            <h1 className="mt-4 font-display text-[38px] leading-[1.04] tracking-tight md:text-[54px]">{deal.title}</h1>
            <p className="mt-3 text-[15px] text-ink-2">
              Gefunden {relativeTime(deal.detectedAt, market.scannedAt)} bei {deal.source.platform}
              {deal.releaseDate && <> · Release am {dateDe(deal.releaseDate)}</>}
            </p>
          </header>

          <section className="rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line md:p-6" aria-labelledby="chart">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="chart" className="text-[13px] font-medium text-muted">
                  Marktpreis, 90 Tage
                </h2>
                <p className="tabular mt-1 text-3xl font-semibold tracking-tight">{eur(m.medianPrice)}</p>
              </div>
              <Badge tone={m.trend30d > 0.02 ? "good" : m.trend30d < -0.02 ? "bad" : "neutral"}>{signedPercent(m.trend30d)} in 30 Tagen</Badge>
            </div>
            <div className="mt-6">
              <PriceChart
                history={m.history}
                references={[
                  { value: a.totalCost, label: "Einkauf", tone: "ink" },
                  { value: a.breakEvenPrice, label: "Break-even", tone: "muted" },
                ]}
              />
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Marktdaten">
            {[
              { k: "Verkäufe 30 T.", v: number(m.sales30d) },
              { k: "Aktive Angebote", v: number(m.activeListings) },
              { k: "Abverkauf 30 T.", v: percent(a.sellThrough30d) },
              { k: "Bis Verkauf", v: `~${a.estimatedDaysToSell} Tage` },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl bg-white p-4 ring-1 ring-line">
                <p className="text-[12px] text-muted">{s.k}</p>
                <p className="tabular mt-1 text-lg font-semibold">{s.v}</p>
              </div>
            ))}
          </section>

          <section className="rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line md:p-6" aria-labelledby="factors">
            <h2 id="factors" className="mb-4 text-lg font-semibold tracking-tight">
              Marktanalyse
            </h2>
            <FactorList factors={a.factors} />
          </section>

          <section className="rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line md:p-6" aria-labelledby="comps">
            <h2 id="comps" className="mb-4 text-lg font-semibold tracking-tight">
              Vergleichsverkäufe
            </h2>
            <div>
              <table className="w-full text-[13px] md:text-sm">
                <thead>
                  <tr className="text-left text-[12px] text-muted">
                    <th className="pb-2 font-medium">Plattform</th>
                    <th className="pb-2 font-medium">Zustand</th>
                    <th className="pb-2 font-medium">Verkauft</th>
                    <th className="pb-2 text-right font-medium">Preis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {m.comparables.map((c, i) => (
                    <tr key={i}>
                      <td className="py-3">{c.platform}</td>
                      <td className="py-3 text-ink-2">{c.condition}</td>
                      <td className="py-3 text-ink-2">vor {c.soldDaysAgo} T.</td>
                      <td className="tabular py-3 text-right font-medium">{eur(c.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-10 lg:self-start">
          <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-line md:p-6 animate-rise">
            <p className="text-[13px] font-medium text-muted">Gewinnwahrscheinlichkeit</p>
            <ProbabilityBar probability={a.probability} size="lg" className="mt-2" />
            <p className="mt-3 text-[12px] leading-relaxed text-muted">
              Chance, innerhalb von {Math.max(30, a.estimatedDaysToSell)} Tagen mit mindestens 5 % Gewinn nach allen Gebühren zu verkaufen.
            </p>

            <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm">
              {costs.map((c) => (
                <div key={c.label} className="flex justify-between gap-4">
                  <dt className="text-ink-2">{c.label}</dt>
                  <dd className="tabular">{signedEur(c.value)}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-4 border-t border-line pt-3 text-base font-semibold">
                <dt>Gewinn je Stück</dt>
                <dd className="tabular">
                  {signedEur(a.expectedProfit)} <span className="text-[12px] font-medium text-muted">{percent(a.roi)}</span>
                </dd>
              </div>
            </dl>

            <div className="mt-6 grid gap-2">
              <Button size="lg" onClick={() => setMode("autopilot")}>
                <IconBolt size={17} /> {canAutopilot ? "Autopilot: kaufen & einstellen" : "Autopilot ab Tarif Pro"}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => setMode("kauf")}>
                  <IconCart size={16} /> Kaufen
                </Button>
                <Button variant="secondary" onClick={() => setMode("inserat")}>
                  <IconTag size={16} /> Einstellen
                </Button>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-muted">
              {demo ? "Test-Dashboard: Aktionen sind im Tarif freigeschaltet." : `Empfohlener Verkaufspreis ${eur(a.recommendedPrice)}`}
            </p>
            {m.live && <p className="mt-1 text-center text-[11px] font-medium text-good">Live-Marktpreise von eBay.de</p>}
          </div>
        </aside>
      </div>

      {/* Schnellaktionen auf dem Smartphone, immer erreichbar über der Tab-Leiste */}
      <div className="h-20 lg:hidden" aria-hidden />
      <div className={`fixed inset-x-0 ${demo ? "bottom-0 pb-[max(env(safe-area-inset-bottom),12px)]" : "bottom-[calc(4rem+env(safe-area-inset-bottom))]"} z-20 border-t border-line bg-white/95 px-4 py-3 backdrop-blur-xl lg:hidden`}>
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="tabular text-sm font-semibold">
              {Math.round(a.probability * 100)} % · {signedEur(a.expectedProfit)}
            </p>
            <p className="truncate text-[11px] text-muted">Gewinnwahrscheinlichkeit · je Stück</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setMode("kauf")} aria-label="Kaufen">
            <IconCart size={16} />
          </Button>
          <Button size="sm" onClick={() => setMode("autopilot")}>
            <IconBolt size={15} /> Autopilot
          </Button>
        </div>
      </div>

      <TradeSheet deal={deal} mode={mode} onClose={() => setMode(null)} />
    </>
  );
}
