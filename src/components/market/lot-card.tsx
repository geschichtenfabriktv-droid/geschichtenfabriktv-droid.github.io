import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { IconClock } from "@/components/ui/icons";
import { ProbabilityBar } from "@/components/ui/probability-bar";
import type { AnalyzedLot } from "@/lib/domain/types";
import { countdown, eur, signedEur } from "@/lib/format";

export function LotCard({ lot, now, index = 0 }: { lot: AnalyzedLot; now: Date; index?: number }) {
  const a = lot.analysis;
  return (
    <Link
      href={`/app/insolvenzen/${lot.id}/`}
      className="group flex flex-col rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)] hover:ring-line-strong animate-rise"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          {lot.lotType} · {lot.city}
        </p>
        <Badge tone="outline" className="shrink-0">
          <IconClock size={12} />
          <span suppressHydrationWarning>{countdown(lot.auctionEnd, now)}</span>
        </Badge>
      </div>
      <h3 className="mt-2 line-clamp-2 text-[17px] font-semibold leading-snug tracking-tight">{lot.title}</h3>
      <p className="mt-1 text-[13px] text-muted">
        {lot.court} · {lot.caseNumber}
      </p>

      <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4">
        <div>
          <dt className="text-[11px] text-muted">Gebot</dt>
          <dd className="tabular mt-0.5 text-[15px] font-semibold">{eur(lot.currentBid)}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-muted">Schätzwert</dt>
          <dd className="tabular mt-0.5 text-[15px] font-semibold">{eur(lot.appraisedValue)}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-muted">Gewinn</dt>
          <dd className="tabular mt-0.5 text-[15px] font-semibold">{signedEur(a.expectedProfit)}</dd>
        </div>
      </dl>
      <ProbabilityBar probability={a.probability} size="sm" className="mt-4" />
    </Link>
  );
}
