import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { IconCalendar } from "@/components/ui/icons";
import { ProbabilityBar } from "@/components/ui/probability-bar";
import { getCategory } from "@/lib/domain/categories";
import type { AnalyzedDeal } from "@/lib/domain/types";
import { dateDe, eur, relativeTime, signedEur, percent } from "@/lib/format";

export function DealCard({ deal, now, index = 0, href }: { deal: AnalyzedDeal; now: Date; index?: number; href: string }) {
  const a = deal.analysis;
  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-line transition-[box-shadow] duration-150 hover:ring-ink"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-muted">{getCategory(deal.categoryId).name}</p>
        <div className="flex shrink-0 gap-1.5">
          {a.doubleUp && <Badge tone="tag">2× Preis</Badge>}
          {deal.limited && !a.doubleUp && <Badge tone="outline">Limitiert</Badge>}
        </div>
      </div>

      <h3 className="mt-2 line-clamp-2 text-[17px] font-semibold leading-snug tracking-tight text-ink">{deal.title}</h3>
      <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[13px] text-muted">
        <span>
          {deal.source.platform} <span aria-hidden>→</span> {deal.target.platform}
        </span>
        <span aria-hidden>·</span>
        {deal.releaseDate ? (
          <span className="inline-flex items-center gap-1">
            <IconCalendar size={13} /> Release {dateDe(deal.releaseDate)}
          </span>
        ) : (
          <span suppressHydrationWarning>{relativeTime(deal.detectedAt, now)}</span>
        )}
      </p>

      <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4">
        <div>
          <dt className="text-[11px] text-muted">Einkauf</dt>
          <dd className="tabular mt-0.5 text-[15px] font-semibold">{eur(a.totalCost)}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-muted">Verkauf</dt>
          <dd className="tabular mt-0.5 text-[15px] font-semibold">{eur(a.recommendedPrice)}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-muted">Gewinn</dt>
          <dd className="tabular mt-0.5 text-[15px] font-semibold">
            {signedEur(a.expectedProfit)}
            <span className="block text-[11px] font-medium text-muted">{percent(a.roi)} Rendite</span>
          </dd>
        </div>
      </dl>

      <ProbabilityBar probability={a.probability} size="sm" className="mt-4" />

    </Link>
  );
}
