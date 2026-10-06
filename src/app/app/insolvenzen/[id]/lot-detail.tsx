"use client";

import Link from "next/link";
import { useState } from "react";
import { FactorList } from "@/components/market/factor-list";
import { Badge } from "@/components/ui/badge";
import { Button, buttonClass } from "@/components/ui/button";
import { IconArrowLeft, IconCheck, IconGavel } from "@/components/ui/icons";
import { ProbabilityBar } from "@/components/ui/probability-bar";
import { Sheet } from "@/components/ui/sheet";
import { CardSkeleton } from "@/components/ui/skeleton";
import { portfolio } from "@/lib/client/portfolio-store";
import { UpsellCard } from "@/components/market/upsell";
import { useDashboard } from "@/lib/client/dashboard-mode";
import { useMarket } from "@/lib/client/use-market";
import { useRouter } from "next/navigation";
import { amountInput, countdown, eur, parseAmount, percent, signedEur } from "@/lib/format";

export function LotDetail({ id }: { id: string }) {
  const routes = useDashboard();
  const router = useRouter();
  const { market } = useMarket(routes.mode);
  const [open, setOpen] = useState(false);
  const [bid, setBid] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!market) return <CardSkeleton count={2} />;
  const lot = market.lots.find((l) => l.id === id);
  if (!lot)
    return (
      <div className="mx-auto max-w-xl py-10">
        <UpsellCard
          title={routes.mode === "demo" ? "Dieses Verfahren ist im Tarif enthalten" : "Dieses Verfahren ist nicht verfügbar"}
          text="Der Insolvenz-Finder ist im Tarif Business enthalten oder als Erweiterung buchbar."
        />
      </div>
    );
  const a = lot.analysis;

  const bidValue = parseAmount(bid ?? amountInput(a.recommendedPrice, 0));
  const bidValid = Number.isFinite(bidValue) && bidValue >= lot.currentBid;
  const costAtBid = bidValid ? bidValue * (1 + lot.buyerPremium) + lot.logisticsCost : 0;
  const profitAtBid = lot.resale.median - costAtBid;

  const close = () => {
    setOpen(false);
    setDone(false);
  };

  const submit = () => {
    if (!bidValid) return;
    portfolio.addOrder({
      itemId: lot.id,
      itemType: "lot",
      title: lot.title,
      platform: lot.auctioneer,
      quantity: 1,
      unitCost: costAtBid,
      mode: "gebot",
    });
    setDone(true);
  };

  return (
    <>
      <Link href={routes.lots} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink-2 hover:text-ink">
        <IconArrowLeft size={16} /> Insolvenzmassen
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
        <div className="min-w-0 space-y-6">
          <header className="animate-rise">
            <div className="flex flex-wrap gap-2">
              <Badge tone="outline">{lot.lotType}</Badge>
              <Badge tone="warn">{countdown(lot.auctionEnd, market.scannedAt)}</Badge>
              <Badge tone="neutral">Beispieldaten (fiktiv)</Badge>
            </div>
            <h1 className="mt-4 font-display text-[38px] leading-[1.04] tracking-tight md:text-[54px]">{lot.title}</h1>
            <p className="mt-3 text-[15px] text-ink-2">
              {lot.debtor} · {lot.court} · Az. {lot.caseNumber}
            </p>
          </header>

          <section className="rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line md:p-6">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">Inhalt der Masse</h2>
            <ul className="space-y-2">
              {lot.items.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px]">
                  <span className="size-1.5 rounded-full bg-ink" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { k: "Gutachterwert", v: eur(lot.appraisedValue, { cents: false }) },
                { k: "Aktuelles Gebot", v: eur(lot.currentBid, { cents: false }) },
                { k: "Aufgeld", v: percent(lot.buyerPremium) },
                { k: "Logistik", v: eur(lot.logisticsCost, { cents: false }) },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl bg-canvas p-4">
                  <dt className="text-[12px] text-muted">{s.k}</dt>
                  <dd className="tabular mt-1 text-base font-semibold">{s.v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line md:p-6">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">Marktanalyse</h2>
            <FactorList factors={a.factors} />
          </section>
        </div>

        <aside className="lg:sticky lg:top-10 lg:self-start">
          <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-line md:p-6 animate-rise">
            <p className="text-[13px] font-medium text-muted">Gewinnwahrscheinlichkeit</p>
            <ProbabilityBar probability={a.probability} size="lg" className="mt-2" />
            <p className="mt-3 text-[12px] leading-relaxed text-muted">Beim aktuellen Gebot, mit mindestens 10 % Überschuss nach Aufgeld und Logistik.</p>
            <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-2">Kosten beim aktuellen Gebot</dt>
                <dd className="tabular">{eur(a.totalCost, { cents: false })}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-2">Erwarteter Erlös</dt>
                <dd className="tabular">{eur(lot.resale.median, { cents: false })}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-2">Gebot bei Break-even</dt>
                <dd className="tabular">{eur(a.breakEvenPrice, { cents: false })}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
                <dt>Empfohlenes Maximalgebot</dt>
                <dd className="tabular">{eur(a.recommendedPrice, { cents: false })}</dd>
              </div>
            </dl>
            <Button size="lg" className="mt-6 w-full" onClick={() => (routes.mode === "demo" ? router.push("/preise/") : setOpen(true))} disabled={a.recommendedPrice < lot.currentBid}>
              <IconGavel size={17} /> Bietlimit festlegen
            </Button>
            {a.recommendedPrice < lot.currentBid && (
              <p className="mt-2 text-center text-[12px] text-bad">Das aktuelle Gebot liegt bereits über dem sinnvollen Maximum.</p>
            )}
          </div>
        </aside>
      </div>

      <Sheet open={open} onClose={close} title={done ? "Bietlimit gespeichert" : "Bietlimit festlegen"} subtitle={done ? undefined : "Bis zu diesem Gebot lohnt sich die Masse"}>
        {done ? (
          <div className="animate-rise">
            <div className="grid size-14 place-items-center rounded-full bg-good-soft text-good">
              <IconCheck size={26} />
            </div>
            <p className="mt-4 text-[15px] text-ink-2">Dein Bietlimit von {eur(bidValue, { cents: false })} ist gespeichert. Gib dein Gebot beim Auktionshaus ab; wir zeigen dir das Limit.</p>
            <Link href="/app/portfolio/" className={buttonClass("primary", "md", "mt-6 w-full")} onClick={close}>
              Zum Portfolio
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium">Maximalgebot</span>
              <div className="mt-2 flex items-center rounded-2xl ring-1 ring-line focus-within:ring-ink">
                <input
                  inputMode="decimal"
                  value={bid ?? amountInput(a.recommendedPrice, 0)}
                  onChange={(e) => setBid(e.target.value)}
                  className="tabular h-12 w-full rounded-2xl bg-transparent px-4 text-lg font-semibold outline-none"
                />
                <span className="pr-4 text-muted">€</span>
              </div>
              <span className={`mt-1.5 block text-[12px] ${bidValid ? "text-muted" : "text-bad"}`}>
                {bidValid ? `Empfohlen ${eur(a.recommendedPrice, { cents: false })}` : `Mindestens das aktuelle Gebot von ${eur(lot.currentBid, { cents: false })}.`}
              </span>
            </label>
            <dl className="space-y-2 rounded-2xl bg-canvas p-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-2">Kosten inkl. Aufgeld & Logistik</dt>
                <dd className="tabular">{eur(costAtBid, { cents: false })}</dd>
              </div>
              <div className="flex justify-between font-semibold">
                <dt>Erwarteter Gewinn</dt>
                <dd className={`tabular ${profitAtBid < 0 ? "text-bad" : "text-[#0b7a43]"}`}>{signedEur(profitAtBid)}</dd>
              </div>
            </dl>
            <Button size="lg" className="w-full" disabled={!bidValid} onClick={submit}>
              Limit speichern
            </Button>
          </div>
        )}
      </Sheet>
    </>
  );
}
