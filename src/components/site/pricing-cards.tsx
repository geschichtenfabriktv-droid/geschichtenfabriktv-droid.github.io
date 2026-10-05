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
    <div className="inline-flex items-center rounded-full bg-canvas p-1 ring-1 ring-line" role="group" aria-label="Abrechnung">
      {(["monat", "jahr"] as const).map((i) => (
        <button
          key={i}
          type="button"
          aria-pressed={value === i}
          onClick={() => onChange(i)}
          className={`h-10 rounded-full px-5 text-[13px] font-medium transition ${value === i ? "bg-white text-ink shadow-sm ring-1 ring-line" : "text-ink-2"}`}
        >
          {i === "monat" ? "Monatlich" : "Jährlich"}
          {i === "jahr" && <span className="ml-2 rounded-full bg-good-soft px-2 py-0.5 text-[11px] font-semibold text-[#0b7a43]">2 Monate gratis</span>}
        </button>
      ))}
    </div>
  );
}

export function PricingCards({ compact = false, headingLevel = 3 }: { compact?: boolean; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const [interval, setInterval] = useState<BillingInterval>("jahr");
  return (
    <div>
      <div className="flex justify-center">
        <IntervalToggle value={interval} onChange={setInterval} />
      </div>
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {PLANS.map((p) => {
          const perMonth = interval === "jahr" ? p.yearly / 12 : p.monthly;
          return (
            <article
              key={p.id}
              className={`relative flex flex-col rounded-[28px] p-7 md:p-8 ${p.highlight ? "bg-ink text-white shadow-[var(--shadow-float)]" : "bg-white ring-1 ring-line"}`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-8 rounded-full bg-[#0b7a43] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">Beliebteste Wahl</span>
              )}
              <Heading className="font-display text-[34px] leading-none tracking-tight">{p.name}</Heading>
              <p className={`mt-2 text-[14px] ${p.highlight ? "text-white/65" : "text-ink-2"}`}>{p.tagline}</p>
              <p className="mt-8 flex items-baseline gap-1.5">
                <span className="tabular text-[48px] font-semibold leading-none tracking-tight">{eur(perMonth, { cents: perMonth % 1 !== 0 })}</span>
                <span className={`text-[14px] ${p.highlight ? "text-white/60" : "text-muted"}`}>/ Monat</span>
              </p>
              <p className={`mt-2 h-5 text-[12px] ${p.highlight ? "text-white/60" : "text-muted"}`}>
                {interval === "jahr" ? `${eur(p.yearly, { cents: false })} jährlich abgerechnet` : "monatlich kündbar"} · inkl. MwSt.
              </p>
              <Link
                href={BACKEND ? `/checkout/?plan=${p.id}&intervall=${interval}` : `/registrieren/?plan=${p.id}&intervall=${interval}`}
                className={buttonClass(p.highlight ? "inverse" : "primary", "lg", "mt-7 w-full")}
              >
                {p.name} wählen
              </Link>
              {!compact && (
                <ul className="mt-8 space-y-3 text-[14px]">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5">
                      <IconCheck size={17} className={`mt-0.5 shrink-0 ${p.highlight ? "text-[#5ee39b]" : "text-good"}`} />
                      <span className={p.highlight ? "text-white/85" : "text-ink-2"}>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
      <p className="mt-6 text-center text-[13px] text-muted">
        {GUARANTEE_DAYS} Tage Geld-zurück-Garantie · jederzeit zum Laufzeitende kündbar · sichere Zahlung per Karte, PayPal & SEPA über Mollie
      </p>
    </div>
  );
}
