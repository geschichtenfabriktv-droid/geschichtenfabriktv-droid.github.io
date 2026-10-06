"use client";

import Link from "next/link";
import { useCountries } from "@/lib/client/countries";
import { COUNTRIES } from "@/lib/pricing";

/** Länderauswahl im Kunden-Dashboard: Deutschland immer, Österreich und Schweiz im Business-Tarif. */
export function CountryPicker() {
  const { countries, allowed, toggle } = useCountries();
  const locked = COUNTRIES.some((c) => !allowed.includes(c.id));
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Länder">
      {COUNTRIES.map((c) => {
        const ok = allowed.includes(c.id);
        const on = countries.includes(c.id);
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={on}
            disabled={!ok}
            title={ok ? undefined : "Im Tarif Business"}
            onClick={() => toggle(c.id)}
            className={`h-9 shrink-0 rounded-[10px] px-3 text-[13px] font-medium transition disabled:cursor-not-allowed disabled:opacity-45 ${on ? "bg-ink text-white" : "bg-white text-ink-2 ring-1 ring-line hover:text-ink"}`}
          >
            {c.name}
          </button>
        );
      })}
      {locked && (
        <Link href="/konto/" className="text-[12px] font-medium text-ink-2 underline underline-offset-4 hover:text-ink">
          Österreich und Schweiz im Tarif Business
        </Link>
      )}
    </div>
  );
}
