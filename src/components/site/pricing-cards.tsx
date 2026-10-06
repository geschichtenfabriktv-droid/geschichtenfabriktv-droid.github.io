"use client";

import Link from "next/link";
import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { IconCheck } from "@/components/ui/icons";
import { BACKEND } from "@/lib/client/api";
import { eur } from "@/lib/format";
import { GUARANTEE_DAYS, PLANS, type BillingInterval } from "@/lib/pricing";

export function IntervalToggle({ value, onChange }: { value: BillingInterval; onChange: (v: BillingInterval) => void }) {
  return (
    <div className="inline-flex items-center rounded-[12px] bg-white p-1 ring-1 ring-inset ring-line-strong" role="group" aria-label="Abrechnung">
      {(["monat", "jahr"] as const).map((i) => (
        <button
          key={i}
          type="button"
          aria-pressed={value === i}
          onClick={() => onChange(i)}
          className={`h-10 rounded-[9px] px-4 text-[14px] font-semibold transition-colors ${value === i ? "bg-ink text-white" : "text-ink-2 hover:text-ink"}`}
        >
          {i === "monat" ? "Monatlich" : "Jährlich"}
          {i === "jahr" && <span className={`ml-2 rounded-md px-1.5 py-0.5 text-[12px] font-semibold ${value === i ? "bg-tag text-ink" : "bg-tag-soft text-tag-ink"}`}>2 Monate gratis</span>}
        </button>
      ))}
    </div>
  );
}

export function PricingCards({ compact = false, headingLevel = 3 }: { compact?: boolean; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const [interval, setInterval] = useState<BillingInterval>("jahr");
  return (
    <div data-ab-exp="karten">
      <div className="flex">
        <IntervalToggle value={interval} onChange={setInterval} />
      </div>
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {PLANS.map((p) => {
          const perMonth = interval === "jahr" ? p.yearly / 12 : p.monthly;
          return (
            <article
              key={p.id}
              className={`relative flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-white p-7 md:p-8 lg:pt-16 ${p.highlight ? "pt-16 ring-2 ring-ink shadow-[var(--shadow-float)]" : "ring-1 ring-line"}`}
            >
              {p.highlight && (
                <span className="absolute inset-x-0 top-0 bg-tag px-7 py-2.5 text-[13px] font-semibold md:px-8">Beliebteste Wahl</span>
              )}
              <Heading className="font-display text-[28px] leading-none">{p.name}</Heading>
              <p className="mt-2 text-[15px] text-ink-2">{p.tagline}</p>
              <p className="mt-8 flex items-baseline gap-1.5">
                <span className="tabular font-display text-[46px] leading-none">{eur(perMonth, { cents: perMonth % 1 !== 0 })}</span>
                <span className="text-[15px] text-muted">pro Monat</span>
              </p>
              <p className="mt-2 min-h-5 text-[13px] text-muted">
                {interval === "jahr" ? `${eur(p.yearly, { cents: false })} jährlich abgerechnet, inkl. MwSt.` : "Monatlich kündbar, inkl. MwSt."}
              </p>
              <Link
                href={BACKEND ? `/checkout/?plan=${p.id}&intervall=${interval}` : `/registrieren/?plan=${p.id}&intervall=${interval}`}
                className={buttonClass(p.highlight ? "primary" : "secondary", "lg", "mt-7 w-full")}
                data-ab-goal="karten"
              >
                <span className="ab-karten-a">{p.name} wählen</span>
                <span className="ab-karten-b">{p.name} risikofrei starten</span>
              </Link>
              <p className="ab-karten-b mt-2.5 text-center text-[13px] text-muted">{GUARANTEE_DAYS} Tage Geld-zurück-Garantie</p>
              {!compact && (
                <ul className="mt-8 space-y-3 border-t border-line pt-6 text-[15px]">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5">
                      <IconCheck size={17} className="mt-0.5 shrink-0 text-good" />
                      <span className="text-ink-2">{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
      <p className="mt-6 text-[14px] text-muted">
        {GUARANTEE_DAYS} Tage Geld-zurück-Garantie. Jederzeit zum Laufzeitende kündbar. Zahlung per Karte, PayPal oder SEPA-Lastschrift über Mollie.
      </p>
    </div>
  );
}
