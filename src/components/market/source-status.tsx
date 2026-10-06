import type { MarketSource } from "@/lib/domain/types";

/**
 * Ehrlicher Leerzustand im Kunden-Dashboard: zeigt, welche Quellen gerade echte Daten liefern.
 * Es werden nie Beispieldaten eingesetzt, wenn eine Quelle fehlt.
 */
export function EmptyMarket({ title, text, sources }: { title: string; text: string; sources: MarketSource[] }) {
  return (
    <div className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line">
      <p className="text-lg font-semibold tracking-tight">{title}</p>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-2">{text}</p>
      {sources.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm">
          {sources.map((s) => (
            <li key={s.id} className="flex flex-wrap items-baseline gap-x-2">
              <span className={`inline-block size-2 shrink-0 rounded-full ${s.live ? "bg-good" : "bg-line"}`} aria-hidden />
              <span className="font-medium">{s.name}</span>
              <span className="text-muted">{s.live ? "liefert Live-Daten" : "keine Daten"}{s.note ? ` · ${s.note}` : ""}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
