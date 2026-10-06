"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, buttonClass } from "@/components/ui/button";
import { IconCheck, IconMinus, IconPlus } from "@/components/ui/icons";
import { Sheet } from "@/components/ui/sheet";
import { api, ApiError, BACKEND } from "@/lib/client/api";
import { committedCapital, portfolio, usePortfolio } from "@/lib/client/portfolio-store";
import type { AnalyzedDeal } from "@/lib/domain/types";
import { amountInput, eur, parseAmount, signedEur } from "@/lib/format";

export type TradeMode = "kauf" | "inserat" | "autopilot";

const PLATFORM_FEES: Record<string, { feeRate: number; fixedFee: number }> = {
  eBay: { feeRate: 0.11, fixedFee: 0.35 },
  Amazon: { feeRate: 0.15, fixedFee: 0.99 },
  Kleinanzeigen: { feeRate: 0, fixedFee: 0 },
  StockX: { feeRate: 0.09, fixedFee: 0 },
  Cardmarket: { feeRate: 0.05, fixedFee: 0 },
  Vinted: { feeRate: 0.05, fixedFee: 0.7 },
  Direktkunde: { feeRate: 0.03, fixedFee: 0.25 },
};

interface Props {
  deal: AnalyzedDeal;
  mode: TradeMode | null;
  onClose: () => void;
}

const TITLES: Record<TradeMode, [string, string]> = {
  kauf: ["Kauf vorbereiten", "Händlerangebot suchen und Kauf im Portfolio vermerken"],
  inserat: ["Einstellen", "Inserat zum empfohlenen Preis anlegen, bei eBay mit einem Klick"],
  autopilot: ["Autopilot", "Händlerangebot öffnen und die Ware mit einem Klick einstellen"],
};

export function TradeSheet({ deal, mode, onClose }: Props) {
  const a = deal.analysis;
  const { settings, orders } = usePortfolio();
  const maxQty = Math.max(1, Math.min(deal.source.stock, 10));
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(amountInput(a.recommendedPrice));
  const [platforms, setPlatforms] = useState<string[]>([deal.target.platform]);
  const [repricing, setRepricing] = useState(settings.autoRepricing);
  const [done, setDone] = useState<null | TradeMode>(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [ebayListingId, setEbayListingId] = useState<string | null>(null);

  const unitCost = a.totalCost;
  const total = unitCost * qty;
  const budgetLeft = settings.budget - committedCapital(orders);
  const overBudget = mode !== "inserat" && total > budgetLeft;

  const numericPrice = parseAmount(price);
  const priceValid = Number.isFinite(numericPrice) && numericPrice > 0;
  // Gewinn je Plattform: die teuerste gewählte Plattform ist maßgeblich (konservativ).
  const profitPerUnit = useMemo(() => {
    if (!priceValid || platforms.length === 0) return 0;
    return Math.min(
      ...platforms.map((p) => {
        const fee = PLATFORM_FEES[p] ?? { feeRate: deal.target.feeRate, fixedFee: deal.target.fixedFee };
        return numericPrice * (1 - fee.feeRate) - fee.fixedFee - deal.target.shipping - unitCost;
      }),
    );
  }, [priceValid, platforms, numericPrice, deal.target, unitCost]);

  const belowBreakEven = priceValid && numericPrice < a.breakEvenPrice;
  const needsListing = mode === "inserat" || mode === "autopilot";
  const canSubmit = !overBudget && (!needsListing || (priceValid && platforms.length > 0));

  const close = () => {
    setDone(null);
    setQty(1);
    setProblem(null);
    setEbayListingId(null);
    onClose();
  };

  const shopUrl = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(`${deal.title} ${deal.source.platform}`)}`;

  const submit = async () => {
    if (!mode || !canSubmit || busy) return;
    setProblem(null);
    if (needsListing && BACKEND && platforms.includes("eBay")) {
      setBusy(true);
      try {
        const r = await api<{ listingId: string }>("/api/listings/ebay/", {
          body: { itemId: deal.id, title: deal.title, description: `${deal.title}. Neu und originalverpackt.`, price: numericPrice, quantity: qty },
        });
        setEbayListingId(r.listingId);
      } catch (e) {
        setBusy(false);
        setProblem(e instanceof ApiError ? e.message : "eBay ist gerade nicht erreichbar.");
        return;
      }
      setBusy(false);
    }
    if (mode === "kauf" || mode === "autopilot") {
      window.open(shopUrl, "_blank", "noopener,noreferrer");
      portfolio.addOrder({
        itemId: deal.id,
        itemType: "deal",
        title: deal.title,
        platform: deal.source.platform,
        quantity: qty,
        unitCost,
        mode: "kauf",
      });
    }
    if (needsListing) {
      portfolio.addListing({
        itemId: deal.id,
        title: deal.title,
        platforms,
        price: numericPrice,
        floorPrice: Math.ceil(a.breakEvenPrice),
        quantity: qty,
        autoRepricing: repricing,
        expectedProfitPerUnit: profitPerUnit,
      });
    }
    setDone(mode);
  };

  if (!mode) return null;
  const [title, subtitle] = TITLES[mode];
  // Automatisch veröffentlichen geht bisher nur bei eBay; andere Marktplätze werden im Portfolio vermerkt.
  const live = BACKEND && platforms.includes("eBay");
  const manual = platforms.filter((p) => !(live && p === "eBay"));
  const listingHint = live
    ? `Das eBay-Inserat wird live in deinem Konto veröffentlicht.${manual.length ? ` ${manual.join(", ")}: im Portfolio vermerkt, dort stellst du selbst ein.` : ""}`
    : `Wird im Portfolio vermerkt. Auf ${platforms.join(", ") || "dem Marktplatz"} stellst du das Inserat selbst ein; automatisch geht das bisher nur bei eBay.`;

  return (
    <Sheet open={mode !== null} onClose={close} title={done ? "Erledigt" : title} subtitle={done ? undefined : subtitle}>
      {done ? (
        <div className="animate-rise">
          <div className="grid size-14 place-items-center rounded-full bg-good-soft text-good">
            <IconCheck size={26} />
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
            {done === "kauf" && <>Der Kauf von {qty} × „{deal.title}“ ist in deinem Portfolio vermerkt. Die Suche nach dem Händlerangebot ist in einem neuen Tab geöffnet – den Kauf schließt du dort selbst ab.</>}
            {done === "inserat" && <>{ebayListingId ? "Das eBay-Inserat ist veröffentlicht" : `Inserat für ${platforms.join(", ")} im Portfolio vermerkt`}{repricing ? ", die Preisuntergrenze ist gespeichert" : ""}.</>}
            {done === "autopilot" && <>Kauf vermerkt und Inserat für {platforms.join(", ")} zu {eur(numericPrice)} {ebayListingId ? "auf eBay veröffentlicht" : "im Portfolio vermerkt"}.</>}
          </p>
          <p className="mt-2 text-[13px] text-muted">
            {ebayListingId
              ? `Live auf eBay veröffentlicht (Angebotsnummer ${ebayListingId}).`
              : platforms.some((p) => p !== "eBay") && needsListingFor(done)
                ? "Für Marktplätze ohne verbundene Schnittstelle liegen Titel und Preis im Portfolio bereit."
                : "Alle Schritte sind im Portfolio nachvollziehbar."}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link href="/app/portfolio/" className={buttonClass("primary", "md", "flex-1")} onClick={close}>
              Zum Portfolio
            </Link>
            <Button variant="secondary" className="flex-1" onClick={close}>
              Weiter suchen
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {mode !== "inserat" && (
            <section>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Menge</p>
                  <p className="text-[12px] text-muted">
                    {deal.source.stock} verfügbar bei {deal.source.platform}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-[10px] ring-1 ring-line">
                  <button type="button" aria-label="Weniger" className="grid size-10 place-items-center rounded-full hover:bg-canvas disabled:opacity-30" disabled={qty <= 1} onClick={() => setQty((q) => q - 1)}>
                    <IconMinus size={16} />
                  </button>
                  <span className="tabular w-6 text-center font-semibold" aria-live="polite">
                    {qty}
                  </span>
                  <button type="button" aria-label="Mehr" className="grid size-10 place-items-center rounded-full hover:bg-canvas disabled:opacity-30" disabled={qty >= maxQty} onClick={() => setQty((q) => q + 1)}>
                    <IconPlus size={16} />
                  </button>
                </div>
              </div>
              <dl className="mt-4 space-y-2 rounded-xl bg-canvas p-4 text-sm">
                <Row label="Stückpreis inkl. Versand" value={eur(unitCost)} />
                <Row label="Gesamt" value={eur(total)} strong />
                <Row label="Freies Budget" value={eur(budgetLeft)} tone={overBudget ? "bad" : undefined} />
              </dl>
              {overBudget && <p className="mt-2 text-[13px] text-bad">Übersteigt dein freies Budget. Passe die Menge oder das Budget in den Einstellungen an.</p>}
            </section>
          )}

          {needsListing && (
            <section className="space-y-4">
              <fieldset>
                <legend className="text-sm font-medium">Marktplätze</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.keys(PLATFORM_FEES).map((p) => {
                    const on = platforms.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setPlatforms((cur) => (on ? cur.filter((x) => x !== p) : [...cur, p]))}
                        className={`h-9 rounded-[9px] px-3.5 text-[13px] font-medium transition ${on ? "bg-ink text-white" : "ring-1 ring-line text-ink-2 hover:ring-line-strong"}`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <label className="block">
                <span className="text-sm font-medium">Verkaufspreis</span>
                <div className="mt-2 flex items-center rounded-xl ring-1 ring-line focus-within:ring-ink">
                  <input
                    inputMode="decimal"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="tabular h-12 w-full rounded-xl bg-transparent px-4 text-lg font-semibold outline-none"
                    aria-describedby="price-hint"
                  />
                  <span className="pr-4 text-muted">€</span>
                </div>
                <span id="price-hint" className={`mt-1.5 block text-[12px] ${belowBreakEven ? "text-bad" : "text-muted"}`}>
                  {belowBreakEven
                    ? `Unter dem Break-even von ${eur(a.breakEvenPrice)}, so entsteht Verlust.`
                    : `Empfohlen ${eur(a.recommendedPrice)} · Break-even ${eur(a.breakEvenPrice)}`}
                </span>
              </label>

              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl ring-1 ring-line p-4">
                <span>
                  <span className="block text-sm font-medium">Preisuntergrenze merken</span>
                  <span className="block text-[12px] text-muted">
                    Speichert {eur(Math.ceil(a.breakEvenPrice))} als Untergrenze im Portfolio. Der Preis wird nicht automatisch angepasst.
                  </span>
                </span>
                <input type="checkbox" className="peer sr-only" checked={repricing} onChange={(e) => setRepricing(e.target.checked)} />
                <span aria-hidden className="relative h-7 w-12 shrink-0 rounded-full bg-line-strong transition peer-checked:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-ink after:absolute after:top-1 after:left-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
              </label>

              <dl className="space-y-2 rounded-xl bg-canvas p-4 text-sm">
                <Row label="Gewinn je Stück (nach Gebühren)" value={signedEur(profitPerUnit)} strong tone={profitPerUnit < 0 ? "bad" : "good"} />
                {mode === "autopilot" && <Row label={`Gewinn bei ${qty} Stück`} value={signedEur(profitPerUnit * qty)} />}
              </dl>
            </section>
          )}

          {problem && (
            <p className="rounded-xl bg-bad-soft p-4 text-[13px] text-[#b42a22]">
              {problem}{" "}
              {/verbunden/i.test(problem) && (
                <Link href="/konto/verbindungen/" className="font-semibold underline">
                  eBay verbinden
                </Link>
              )}
            </p>
          )}
          <Button size="lg" className="w-full" disabled={!canSubmit || busy} onClick={submit}>
            {busy && "Wird veröffentlicht …"}
            {!busy && mode === "kauf" && `Händlerangebot öffnen · ${eur(total)}`}
            {!busy && mode === "inserat" && (live ? "Auf eBay veröffentlichen" : "Im Portfolio vermerken")}
            {!busy && mode === "autopilot" && `Angebot öffnen & einstellen · ${eur(total)}`}
          </Button>
          <p className="-mt-3 text-center text-[11px] text-muted">
            {mode === "inserat" ? listingHint : mode === "autopilot" ? `Das Händlerangebot öffnet sich in einem neuen Tab. ${listingHint}` : "Das Händlerangebot öffnet sich in einem neuen Tab; den Kauf schließt du dort selbst ab."}
          </p>
        </div>
      )}
    </Sheet>
  );
}

function needsListingFor(mode: TradeMode) {
  return mode === "inserat" || mode === "autopilot";
}

function Row({ label, value, strong, tone }: { label: string; value: string; strong?: boolean; tone?: "good" | "bad" }) {
  const color = tone === "bad" ? "text-bad" : tone === "good" ? "text-[#0b7a43]" : "text-ink";
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-ink-2">{label}</dt>
      <dd className={`tabular ${strong ? "font-semibold" : ""} ${color}`}>{value}</dd>
    </div>
  );
}
