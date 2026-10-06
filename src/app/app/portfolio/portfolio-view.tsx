"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shell/app-shell";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { IconClose } from "@/components/ui/icons";
import { committedCapital, portfolio, usePortfolio, type ListingStatus, type OrderStatus } from "@/lib/client/portfolio-store";
import { eur, signedEur } from "@/lib/format";

const ORDER_FLOW: OrderStatus[] = ["bestellt", "unterwegs", "eingetroffen"];
const ORDER_LABEL: Record<OrderStatus, string> = { bestellt: "Bestellt", unterwegs: "Unterwegs", eingetroffen: "Eingetroffen" };
const LISTING_LABEL: Record<ListingStatus, string> = { aktiv: "Aktiv", pausiert: "Pausiert", verkauft: "Verkauft" };

export function PortfolioView() {
  const { orders, listings, settings } = usePortfolio();
  const [tab, setTab] = useState<"bestellungen" | "inserate">("bestellungen");

  const capital = committedCapital(orders);
  const openProfit = listings.filter((l) => l.status !== "verkauft").reduce((s, l) => s + l.expectedProfitPerUnit * l.quantity, 0);
  const realized = listings.filter((l) => l.status === "verkauft").reduce((s, l) => s + l.expectedProfitPerUnit * l.quantity, 0);

  return (
    <>
      <PageHeader eyebrow="Portfolio" title="Bestellungen & Inserate" />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Kennzahlen">
        {[
          { k: "Gebundenes Kapital", v: eur(capital, { cents: false }), n: `von ${eur(settings.budget, { cents: false })} Budget` },
          { k: "Offener Gewinn", v: signedEur(openProfit), n: "aus aktiven Inseraten" },
          { k: "Realisiert", v: signedEur(realized), n: "aus verkauften Inseraten" },
          { k: "Aktive Inserate", v: String(listings.filter((l) => l.status === "aktiv").length), n: `${orders.length} ${orders.length === 1 ? "Bestellung" : "Bestellungen"} gesamt` },
        ].map((s) => (
          <div key={s.k} className="rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line">
            <p className="text-[12px] text-muted">{s.k}</p>
            <p className="tabular mt-2 text-2xl font-semibold tracking-tight">{s.v}</p>
            <p className="mt-1 text-[12px] text-muted">{s.n}</p>
          </div>
        ))}
      </section>

      <div className="mt-8 inline-flex rounded-full bg-white p-1 ring-1 ring-line" role="tablist">
        {(["bestellungen", "inserate"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            type="button"
            onClick={() => setTab(t)}
            className={`h-10 rounded-full px-5 text-sm font-medium capitalize transition ${tab === t ? "bg-ink text-white" : "text-ink-2 hover:text-ink"}`}
          >
            {t} <span className="tabular ml-1 opacity-60">{t === "bestellungen" ? orders.length : listings.length}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3" role="tabpanel">
        {tab === "bestellungen" &&
          (orders.length === 0 ? (
            <Empty text="Noch keine Bestellungen. Wähle eine Chance und kaufe sie auf Knopfdruck." />
          ) : (
            orders.map((o) => {
              const step = ORDER_FLOW.indexOf(o.status);
              const next = ORDER_FLOW[step + 1];
              return (
                <article key={o.id} className="flex flex-col gap-4 rounded-2xl bg-white p-5 ring-1 ring-line md:flex-row md:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={o.status === "eingetroffen" ? "good" : "neutral"}>{o.mode === "gebot" ? "Bietlimit" : ORDER_LABEL[o.status]}</Badge>
                      <span className="text-[12px] text-muted">{new Date(o.createdAt).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" })}</span>
                    </div>
                    <h3 className="mt-2 truncate font-semibold">{o.title}</h3>
                    <p className="text-[13px] text-muted">
                      {o.quantity} × {eur(o.unitCost)} · {o.platform}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="tabular mr-2 font-semibold">{eur(o.unitCost * o.quantity)}</p>
                    {next && o.mode === "kauf" && (
                      <button type="button" onClick={() => portfolio.setOrderStatus(o.id, next)} className="h-9 rounded-full px-4 text-[13px] font-medium ring-1 ring-line hover:ring-ink">
                        Als {ORDER_LABEL[next].toLowerCase()} markieren
                      </button>
                    )}
                    <RemoveButton onClick={() => portfolio.removeOrder(o.id)} />
                  </div>
                </article>
              );
            })
          ))}

        {tab === "inserate" &&
          (listings.length === 0 ? (
            <Empty text="Noch keine Inserate. Mit „Einstellen“ legst du eines in Sekunden an." />
          ) : (
            listings.map((l) => (
              <article key={l.id} className="flex flex-col gap-4 rounded-2xl bg-white p-5 ring-1 ring-line md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={l.status === "verkauft" ? "good" : l.status === "aktiv" ? "ink" : "neutral"}>{LISTING_LABEL[l.status]}</Badge>
                    {l.autoRepricing && l.status === "aktiv" && <Badge tone="outline">Untergrenze {eur(l.floorPrice, { cents: false })}</Badge>}
                  </div>
                  <h3 className="mt-2 truncate font-semibold">{l.title}</h3>
                  <p className="text-[13px] text-muted">
                    {l.quantity} × {eur(l.price)} auf {l.platforms.join(", ")}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="tabular mr-2 font-semibold">{signedEur(l.expectedProfitPerUnit * l.quantity)}</p>
                  {l.status !== "verkauft" && (
                    <>
                      <button
                        type="button"
                        onClick={() => portfolio.setListingStatus(l.id, l.status === "aktiv" ? "pausiert" : "aktiv")}
                        className="h-9 rounded-full px-4 text-[13px] font-medium ring-1 ring-line hover:ring-ink"
                      >
                        {l.status === "aktiv" ? "Pausieren" : "Aktivieren"}
                      </button>
                      <button type="button" onClick={() => portfolio.setListingStatus(l.id, "verkauft")} className="h-9 rounded-full bg-ink px-4 text-[13px] font-medium text-white hover:bg-ink/85">
                        Verkauft
                      </button>
                    </>
                  )}
                  <RemoveButton onClick={() => portfolio.removeListing(l.id)} />
                </div>
              </article>
            ))
          ))}
      </div>
    </>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="Entfernen" className="grid size-9 place-items-center rounded-full text-muted hover:bg-canvas hover:text-ink">
      <IconClose size={16} />
    </button>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-[var(--radius-card)] bg-white px-6 py-14 text-center ring-1 ring-line">
      <p className="font-display text-3xl">Noch leer</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{text}</p>
      <LinkButton href="/app/chancen/" className="mt-6">
        Chancen ansehen
      </LinkButton>
    </div>
  );
}
