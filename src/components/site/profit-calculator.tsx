"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { eur } from "@/lib/format";
import { calcProfit, type ProfitInput } from "@/lib/profit-calc";

type Key = keyof ProfitInput;

/** Beispielwerte; Gebührensätze sind ausdrücklich Beispiele, keine aktuellen eBay-Sätze. */
const DEFAULTS: ProfitInput = { buy: 40, sell: 79, buyerShipping: 4.99, ownShipping: 4.5, feePct: 11, fixedFee: 0.35, adPct: 0 };

const FIELDS: { key: Key; label: string; unit: "€" | "%"; hint?: string }[] = [
  { key: "buy", label: "Einkaufspreis", unit: "€", hint: "inkl. Lieferung zu dir" },
  { key: "sell", label: "Verkaufspreis", unit: "€", hint: "Artikelpreis ohne Versand" },
  { key: "buyerShipping", label: "Versand, den der Käufer zahlt", unit: "€" },
  { key: "ownShipping", label: "Deine Versandkosten", unit: "€", hint: "Porto und Verpackung" },
  { key: "feePct", label: "Verkaufsprovision", unit: "%", hint: "vom Gesamtbetrag inkl. Versand" },
  { key: "fixedFee", label: "Fixgebühr pro Bestellung", unit: "€" },
  { key: "adPct", label: "Anzeigensatz", unit: "%", hint: "0, wenn du keine Anzeige schaltest" },
];

const parse = (s: string) => Number(s.replace(",", "."));
const toText = (n: number) => String(n).replace(".", ",");

function NumberField({ label, unit, hint, value, onChange }: { label: string; unit: string; hint?: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <label htmlFor={id} className="block">
      <span className="text-[13px] font-medium">{label}</span>
      <span className="mt-1.5 flex h-12 items-center rounded-[var(--radius-control)] bg-white ring-1 ring-line transition focus-within:ring-2 focus-within:ring-ink">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full min-w-0 flex-1 bg-transparent px-4 text-[15px] tabular-nums outline-none"
        />
        <span className="pr-4 text-[14px] text-muted">{unit}</span>
      </span>
      {hint && <span className="mt-1 block text-[12px] text-muted">{hint}</span>}
    </label>
  );
}

export function ProfitCalculator() {
  const [text, setText] = useState<Record<Key, string>>(() => Object.fromEntries(FIELDS.map((f) => [f.key, toText(DEFAULTS[f.key])])) as Record<Key, string>);

  // Werte aus dem Link übernehmen, damit Nutzer eine Rechnung teilen können.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const fromUrl = FIELDS.filter((f) => q.has(f.key) && Number.isFinite(parse(q.get(f.key)!)));
    if (fromUrl.length) setText((t) => ({ ...t, ...Object.fromEntries(fromUrl.map((f) => [f.key, q.get(f.key)!])) }));
  }, []);

  const input = useMemo(() => Object.fromEntries(FIELDS.map((f) => [f.key, parse(text[f.key])])) as unknown as ProfitInput, [text]);
  const r = calcProfit(input);
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const q = new URLSearchParams(FIELDS.map((f) => [f.key, String(Number.isFinite(input[f.key]) ? input[f.key] : 0)]));
    const url = `${window.location.origin}${window.location.pathname}?${q}`;
    window.history.replaceState(null, "", url);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* Link steht trotzdem in der Adresszeile */
    }
  };

  const tone = r.profit > 0 ? "bg-good-soft text-[#0b7a43]" : r.profit < 0 ? "bg-bad-soft text-[#b42a22]" : "bg-canvas text-ink";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="grid grid-cols-1 gap-4 rounded-[var(--radius-card)] bg-canvas p-6 sm:grid-cols-2 md:p-8">
        {FIELDS.map((f) => (
          <NumberField key={f.key} label={f.label} unit={f.unit} hint={f.hint} value={text[f.key]} onChange={(v) => setText((t) => ({ ...t, [f.key]: v }))} />
        ))}
      </div>
      <div className="flex flex-col rounded-[var(--radius-card)] p-6 ring-1 ring-line md:p-8" aria-live="polite">
        <p className="text-[14px] text-muted">Gewinn pro Verkauf</p>
        <p className={`mt-2 inline-flex w-fit rounded-[var(--radius-control)] px-3 py-1 font-display text-[44px] leading-tight tabular-nums ${tone}`}>{eur(r.profit)}</p>
        <dl className="mt-6 divide-y divide-line border-y border-line text-[15px]">
          {[
            ["Käufer zahlt insgesamt", eur(r.total)],
            ["Gebühren gesamt", eur(r.fees)],
            ["Marge auf den Verkauf", `${toText(r.margin)} %`],
            ["Rendite auf den Einkauf", r.roi === null ? "–" : `${toText(r.roi)} %`],
            ["Mindest-Verkaufspreis ohne Verlust", r.breakEven === null ? "–" : eur(r.breakEven)],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-ink-2">{k}</dt>
              <dd className="font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
        <button type="button" onClick={share} className="mt-6 h-11 rounded-[var(--radius-control)] bg-white px-5 text-sm font-semibold ring-1 ring-inset ring-line-strong transition-colors hover:ring-ink">
          {copied ? "Link kopiert" : "Rechnung als Link teilen"}
        </button>
        <p className="mt-4 text-[12px] leading-relaxed text-muted">
          Ohne Umsatz- und Einkommensteuer. Die voreingestellten Gebühren sind Beispielwerte; die aktuellen Sätze deiner Kategorie stehen in der Gebührenübersicht des Marktplatzes.
        </p>
      </div>
    </div>
  );
}
