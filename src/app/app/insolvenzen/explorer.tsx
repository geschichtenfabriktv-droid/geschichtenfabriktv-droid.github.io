"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LotCard } from "@/components/market/lot-card";
import { AuctionList } from "@/components/market/auction-list";
import { EmptyMarket } from "@/components/market/source-status";
import { PageHeader } from "@/components/shell/app-shell";
import { ScanStatus } from "@/components/shell/scan-status";
import { CardSkeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/lib/client/dashboard-mode";
import { useMarket } from "@/lib/client/use-market";
import type { LotType } from "@/lib/domain/types";
import { eur } from "@/lib/format";

const TYPES: (LotType | "Alle")[] = ["Alle", "Warenlager", "Maschinen", "Fahrzeuge", "Büro & IT", "Marken & Domains"];

export function LotExplorer() {
  const routes = useDashboard();
  const { market, scanning, refresh } = useMarket(routes.mode);
  const [type, setType] = useState<LotType | "Alle">("Alle");

  const lots = useMemo(() => (market ? market.lots.filter((l) => type === "Alle" || l.lotType === type) : []), [market, type]);
  const totalAppraised = lots.reduce((s, l) => s + l.appraisedValue, 0);
  const totalBids = lots.reduce((s, l) => s + l.currentBid, 0);
  // Bewertete Verfahren (Gebot, Gutachterwert) gibt es bisher nur im Test-Dashboard.
  const analyzed = !market || market.demo || market.lots.length > 0;

  return (
    <>
      <PageHeader eyebrow="Insolvenzmassen" title="Werte aus Verfahren, unter Gutachterpreis">
        <ScanStatus scannedAt={market?.scannedAt} scanning={scanning} onRefresh={refresh} />
      </PageHeader>

      <p className="-mt-4 mb-6 max-w-2xl text-[15px] leading-relaxed text-ink-2">
        Der Insolvenz-Finder bewertet Insolvenzmasse-Posten mit Maximalgebot: Er ordnet die Massen nach Art und berechnet, bis zu welchem Gebot sich ein
        Kauf noch lohnt.{market?.demo && " Die angezeigten Verfahren sind Beispieldaten."}
      </p>

      {analyzed && (
      <div className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0" role="toolbar" aria-label="Art der Masse">
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={type === t}
            onClick={() => setType(t)}
            className={`h-10 shrink-0 rounded-[10px] px-4 text-[13px] font-medium transition ${type === t ? "bg-ink text-white" : "bg-white text-ink-2 ring-1 ring-line hover:text-ink"}`}
          >
            {t}
          </button>
        ))}
      </div>
      )}

      {market && analyzed && (
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { k: "Verfahren", v: String(lots.length) },
            { k: "Gutachterwert", v: eur(totalAppraised, { cents: false }) },
            { k: "Aktuelle Gebote", v: eur(totalBids, { cents: false }) },
          ].map((s) => (
            <div key={s.k} className="rounded-xl bg-white p-4 ring-1 ring-line">
              <p className="text-[12px] text-muted">{s.k}</p>
              <p className="tabular mt-1 text-base font-semibold md:text-xl">{s.v}</p>
            </div>
          ))}
        </div>
      )}

      {market && routes.mode === "app" && market.lots.length === 0 && market.locked.lots > 0 && (
        <div className="mb-6 rounded-[var(--radius-card)] bg-ink p-6 text-white">
          <p className="font-display text-3xl">Insolvenz-Finder freischalten</p>
          <p className="mt-2 text-sm text-white/70">{market.locked.lots === 1 ? "1 Verfahren wartet" : `${market.locked.lots} Verfahren warten`}. Im Tarif Business enthalten oder als Erweiterung zu Starter und Pro buchbar.</p>
          <Link href="/konto/" className="mt-5 inline-flex h-10 items-center rounded-[10px] bg-white px-5 text-sm font-medium text-ink">Im Konto hinzubuchen</Link>
        </div>
      )}
      {market && !market.demo && market.auctions.length > 0 && (
        <section className="mb-8" aria-labelledby="justiz">
          <h2 id="justiz" className="mb-3 text-xl font-semibold tracking-tight">
            Laufende Justiz- und Insolvenzauktionen ({market.auctions.length})
          </h2>
          <AuctionList auctions={market.auctions} filters />
        </section>
      )}
      {market && !market.demo && market.lots.length === 0 && market.auctions.length === 0 && market.locked.lots === 0 && (
        <div className="mb-6">
          <EmptyMarket
            title="Gerade keine Auktionen abrufbar"
            text="Hier erscheinen nur echte Insolvenz- und Justizauktionen, nie erfundene Verfahren."
            sources={market.sources.filter((s) => s.id === "justiz" || s.id === "netbid")}
          />
        </div>
      )}
      {!market ? (
        <CardSkeleton count={3} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {lots.map((l, i) => (
            <LotCard key={l.id} lot={l} now={market.scannedAt} index={i} href={routes.lot(l.id)} />
          ))}
        </div>
      )}

      {market?.demo && (
        <p className="mt-8 text-[12px] leading-relaxed text-muted">
          Beispieldaten: Alle Verfahren, Schuldner und Aktenzeichen sind fiktiv und dienen nur zur Veranschaulichung des Insolvenz-Finders.
        </p>
      )}
    </>
  );
}
