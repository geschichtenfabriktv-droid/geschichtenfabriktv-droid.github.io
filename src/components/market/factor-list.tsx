import type { Factor } from "@/lib/domain/types";
import { IconMinus, IconTrendDown, IconTrendUp } from "@/components/ui/icons";

const STYLE = {
  positiv: { icon: IconTrendUp, cls: "bg-good-soft text-[#0b7a43]", label: "spricht dafür" },
  neutral: { icon: IconMinus, cls: "bg-canvas text-ink-2", label: "neutral" },
  negativ: { icon: IconTrendDown, cls: "bg-bad-soft text-[#b42a22]", label: "Risiko" },
} as const;

export function FactorList({ factors }: { factors: Factor[] }) {
  return (
    <ul className="divide-y divide-line">
      {factors.map((f) => {
        const s = STYLE[f.impact];
        const Icon = s.icon;
        return (
          <li key={f.label} className="flex gap-3 py-3.5 first:pt-0 last:pb-0">
            <span className={`grid size-8 shrink-0 place-items-center rounded-full ${s.cls}`} aria-hidden>
              <Icon size={15} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">
                {f.label} <span className="ml-1 text-[11px] font-medium text-muted">{s.label}</span>
              </p>
              <p className="mt-0.5 text-[13px] leading-snug text-ink-2">{f.detail}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
