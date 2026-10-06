import { ProbabilityBar } from "@/components/ui/probability-bar";
import type { AnalyzedDeal } from "@/lib/domain/types";
import { getCategory } from "@/lib/domain/categories";
import { eur, signedEur } from "@/lib/format";

/**
 * Das Preisschild: Einkaufspreis durchgestrichen, erzielbarer Preis groß, darunter Gewinn und
 * Gewinnwahrscheinlichkeit. Die Form ist ein gelochtes Etikett, wie es an Ware im Laden hängt.
 */
export function PriceTag({ deal, note, className = "" }: { deal: AnalyzedDeal; note?: string; className?: string }) {
  const a = deal.analysis;
  return (
    <figure className={`relative drop-shadow-[0_30px_40px_rgb(23_26_43/0.18)] ${className}`}>
      <div className="relative bg-tag py-7 pr-7 pl-14 text-ink [clip-path:polygon(34px_0,100%_0,100%_100%,34px_100%,0_50%)] sm:py-9 sm:pr-9 sm:pl-16">
        <span aria-hidden className="absolute top-1/2 left-[22px] size-3.5 -translate-y-1/2 rounded-full bg-white ring-2 ring-ink/80" />
        <figcaption className="flex items-start justify-between gap-4 text-[13px] font-semibold">
          <span>{getCategory(deal.categoryId).name}</span>
          <span className="text-tag-ink">{deal.source.platform} → {deal.target.platform}</span>
        </figcaption>
        <p className="mt-3 max-w-[22ch] text-[19px] leading-snug font-semibold sm:text-[21px]">{deal.title}</p>
        <div className="mt-6 flex flex-wrap items-end gap-x-5 gap-y-1 border-t-2 border-ink pt-5">
          <p className="tabular text-[17px] font-semibold text-tag-ink line-through decoration-2">{eur(a.totalCost)}</p>
          <p className="tabular font-display text-[52px] leading-[0.9] sm:text-[64px]">{eur(a.recommendedPrice)}</p>
        </div>
        <p className="tabular mt-3 text-[15px] font-semibold">
          Gewinn je Stück {signedEur(a.expectedProfit)} nach allen Gebühren
        </p>
        <div className="mt-6 rounded-[10px] bg-white px-4 py-3.5">
          <ProbabilityBar probability={a.probability} size="md" animate />
        </div>
        {note && <p className="mt-4 text-[12px] font-medium text-tag-ink">{note}</p>}
      </div>
    </figure>
  );
}
