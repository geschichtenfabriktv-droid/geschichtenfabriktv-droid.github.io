"use client";

import { useMemo, useRef, useState } from "react";
import type { PricePoint } from "@/lib/domain/types";
import { eur } from "@/lib/format";

interface ReferenceLine {
  value: number;
  label: string;
  tone: "ink" | "muted";
}

interface Props {
  history: PricePoint[];
  references?: ReferenceLine[];
  height?: number;
}

const W = 1000;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;

/** Preisverlauf der letzten 90 Tage mit Fadenkreuz und Referenzlinien (Einkauf, Break-even). */
export function PriceChart({ history, references = [], height = 240 }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const { path, area, yOf, ticks } = useMemo(() => {
    const values = [...history.map((p) => p.price), ...references.map((r) => r.value)];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = (max - min) * 0.12 || max * 0.05;
    const lo = min - pad;
    const hi = max + pad;
    const innerH = height - PAD_TOP - PAD_BOTTOM;
    const yOf = (v: number) => PAD_TOP + (1 - (v - lo) / (hi - lo)) * innerH;
    const xOf = (i: number) => (i / Math.max(1, history.length - 1)) * W;
    const path = history.map((p, i) => `${i ? "L" : "M"}${xOf(i).toFixed(1)},${yOf(p.price).toFixed(1)}`).join("");
    const area = `${path}L${W},${height - PAD_BOTTOM}L0,${height - PAD_BOTTOM}Z`;
    const ticks = [lo + (hi - lo) * 0.2, lo + (hi - lo) * 0.5, lo + (hi - lo) * 0.8];
    return { path, area, yOf, ticks };
  }, [history, references, height]);

  if (history.length < 2) return null;

  const onMove = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setHover(Math.round(ratio * (history.length - 1)));
  };

  const point = hover !== null ? history[hover] : undefined;
  const hoverX = hover !== null ? (hover / (history.length - 1)) * 100 : 0;
  const first = history[0];
  const last = history[history.length - 1];

  return (
    <figure className="relative select-none">
      <div
        ref={ref}
        className="relative touch-pan-y"
        style={{ height }}
        onPointerMove={(e) => onMove(e.clientX)}
        onPointerDown={(e) => onMove(e.clientX)}
        onPointerLeave={() => setHover(null)}
      >
        <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id="pc-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0b0b0c" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0b0b0c" stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map((t) => (
            <line key={t} x1={0} x2={W} y1={yOf(t)} y2={yOf(t)} stroke="#efefec" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          ))}
          {references.map((r) => (
            <line
              key={r.label}
              x1={0}
              x2={W}
              y1={yOf(r.value)}
              y2={yOf(r.value)}
              stroke={r.tone === "ink" ? "#0b0b0c" : "#a1a1a8"}
              strokeWidth={1}
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path d={area} fill="url(#pc-area)" />
          <path d={path} fill="none" stroke="#0b0b0c" strokeWidth={2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Achsen- und Referenzbeschriftung als HTML, damit Text nicht verzerrt wird */}
        {ticks.map((t) => (
          <span key={t} className="tabular pointer-events-none absolute right-0 -translate-y-full pb-0.5 text-[10px] text-muted" style={{ top: yOf(t) }}>
            {eur(t, { cents: false })}
          </span>
        ))}
        {references.map((r) => (
          <span
            key={r.label}
            className={`tabular pointer-events-none absolute left-0 -translate-y-full rounded bg-white/90 pb-0.5 pr-1 text-[10px] font-medium ${r.tone === "ink" ? "text-ink" : "text-muted"}`}
            style={{ top: yOf(r.value) }}
          >
            {r.label} {eur(r.value, { cents: false })}
          </span>
        ))}

        {point && (
          <>
            <div className="pointer-events-none absolute top-0 bottom-[28px] w-px bg-ink/25" style={{ left: `${hoverX}%` }} />
            <div
              className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink ring-2 ring-white"
              style={{ left: `${hoverX}%`, top: yOf(point.price) }}
            />
            <div
              className="pointer-events-none absolute top-0 z-10 rounded-xl bg-ink px-3 py-2 text-white shadow-lg animate-fade"
              style={{ left: `${hoverX}%`, transform: `translateX(${hoverX > 70 ? "-105%" : "8px"})` }}
            >
              <p className="text-[10px] text-white/60">{new Date(point.date).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })}</p>
              <p className="tabular text-sm font-semibold">{eur(point.price)}</p>
            </div>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] text-muted">
          <span>{first && new Date(first.date).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })}</span>
          <span>Heute{last ? ` · ${eur(last.price)}` : ""}</span>
        </div>
      </div>
      <figcaption className="sr-only">
        Preisverlauf der letzten {history.length} Tage, von {first && eur(first.price)} auf {last && eur(last.price)}.
      </figcaption>
    </figure>
  );
}
