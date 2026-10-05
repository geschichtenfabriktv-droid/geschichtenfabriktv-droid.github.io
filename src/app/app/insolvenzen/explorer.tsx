"use client";

import { useMemo, useState } from "react";
import { LotCard } from "@/components/market/lot-card";
import { PageHeader } from "@/components/shell/app-shell";
import { ScanStatus } from "@/components/shell/scan-status";
import { CardSkeleton } from "@/components/ui/skeleton";
import { useMarket } from "@/lib/client/use-market";
import type { LotType } from "@/lib/domain/types";
import { eur } from "@/lib/format";

const TYPES: (LotType | "Alle")[] = ["Alle", "Warenlager", "Maschinen", "Fahrzeuge", "Büro & IT", "Marken & Domains"];

export function LotExplorer() {
  const { market, scanning, refresh } = useMarket();
  const [type, setType] = useState<LotType | "Alle">("Alle");

  const lots = useMemo(() => (market ? market.lots.filter((l) => type === "Alle" || l.lotType === type) : []), [market, type]);
  const totalAppraised = lots.reduce((s, l) => s + l.appraisedValue, 0);
  const totalBids = lots.reduce((s, l) => s + l.currentBid, 0);

  return (
    <>
      <PageHeader eyebrow="Insolvenzmassen" title={<>Werte aus Verfahren, <span className="italic text-muted">unter Gutachterpreis.</span></>}>
        <ScanStatus scannedAt={market?.scannedAt} scanning={scanning} onRefresh={refresh} />
      </PageHeader>

      <p className="-mt-4 mb-6 max-w-2xl text-[15px] leading-relaxed text-ink-2">
        Der Scanner liest Insolvenzbekanntmachungen und Verwerter-Auktionen, ordnet die Massen nach Art und berechnet, bis zu welchem Gebot sich ein Kauf
        noch lohnt.
      </p>

      <div className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0" role="toolbar" aria-label="Art der Masse">
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={type === t}
            onClick={() => setType(t)}
            className={`h-10 shrink-0 rounded-full px-4 text-[13px] font-medium transition ${type === t ? "bg-ink text-white" : "bg-white text-ink-2 ring-1 ring-line hover:text-ink"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {market && (
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { k: "Verfahren", v: String(lots.length) },
            { k: "Gutachterwert", v: eur(totalAppraised, { cents: false }) },
            { k: "Aktuelle Gebote", v: eur(totalBids, { cents: false }) },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl bg-white p-4 ring-1 ring-line">
              <p className="text-[12px] text-muted">{s.k}</p>
              <p className="tabular mt-1 text-base font-semibold md:text-xl">{s.v}</p>
            </div>
          ))}
        </div>
      )}

      {!market ? (
        <CardSkeleton count={3} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {lots.map((l, i) => (
            <LotCard key={l.id} lot={l} now={market.scannedAt} index={i} />
          ))}
        </div>
      )}

      <p className="mt-8 text-[12px] leading-relaxed text-muted">
        Demo-Daten: Schuldner und Aktenzeichen sind fiktiv. Im Live-Betrieb stammen Verfahren aus insolvenzbekanntmachungen.de und den angebundenen
        Verwertungsplattformen.
      </p>
    </>
  );
}
