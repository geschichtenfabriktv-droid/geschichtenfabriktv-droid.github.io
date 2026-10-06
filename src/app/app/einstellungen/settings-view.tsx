"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shell/app-shell";
import { Button, LinkButton } from "@/components/ui/button";
import { IconPlug } from "@/components/ui/icons";
import { portfolio, usePortfolio } from "@/lib/client/portfolio-store";
import { eur, parseAmount } from "@/lib/format";
import { PROVIDERS } from "@/lib/providers";


const PLATFORMS = ["eBay", "Amazon", "Kleinanzeigen", "StockX", "Cardmarket", "Vinted"];

export function SettingsView() {
  const { settings } = usePortfolio();
  const [budget, setBudget] = useState<string | null>(null);
  const budgetValue = budget ?? String(settings.budget);

  const saveBudget = () => {
    const n = parseAmount(budgetValue);
    if (Number.isFinite(n) && n >= 0) portfolio.updateSettings({ budget: Math.round(n) });
    setBudget(null);
  };

  return (
    <>
      <PageHeader eyebrow="Strategie" title="Einstellungen" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="min-w-0 rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line md:p-6">
          <h2 className="text-lg font-semibold tracking-tight">Strategie</h2>
          <p className="mt-1 text-[13px] text-muted">Gilt für Filter, Kaufen auf Knopfdruck und den Autopiloten.</p>

          <label className="mt-6 block">
            <span className="text-sm font-medium">Budget für Einkäufe</span>
            <div className="mt-2 flex gap-2">
              <div className="flex flex-1 items-center rounded-xl ring-1 ring-line focus-within:ring-ink">
                <input
                  inputMode="numeric"
                  value={budgetValue}
                  onChange={(e) => setBudget(e.target.value)}
                  onBlur={saveBudget}
                  onKeyDown={(e) => e.key === "Enter" && saveBudget()}
                  className="tabular h-12 w-full bg-transparent px-4 font-semibold outline-none"
                />
                <span className="pr-4 text-muted">€</span>
              </div>
            </div>
            <span className="mt-1.5 block text-[12px] text-muted">Aktuell {eur(settings.budget, { cents: false })}</span>
          </label>

          <fieldset className="mt-6">
            <legend className="text-sm font-medium">Standard-Filter Gewinnwahrscheinlichkeit</legend>
            <div className="mt-2 inline-flex rounded-[12px] bg-canvas p-1">
              {[0, 0.45, 0.7].map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={settings.minProbability === m}
                  onClick={() => portfolio.updateSettings({ minProbability: m })}
                  className={`h-9 rounded-[9px] px-4 text-[13px] font-medium transition ${settings.minProbability === m ? "bg-ink text-white" : "text-ink-2"}`}
                >
                  {m === 0 ? "Alle" : `ab ${m * 100} %`}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="text-sm font-medium">Bevorzugte Marktplätze</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {PLATFORMS.map((p) => {
                const on = settings.defaultPlatforms.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      portfolio.updateSettings({
                        defaultPlatforms: on ? settings.defaultPlatforms.filter((x) => x !== p) : [...settings.defaultPlatforms, p],
                      })
                    }
                    className={`h-9 rounded-[9px] px-3.5 text-[13px] font-medium transition ${on ? "bg-ink text-white" : "ring-1 ring-line text-ink-2"}`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="mt-6 flex cursor-pointer items-center justify-between gap-4 rounded-xl ring-1 ring-line p-4">
            <span>
              <span className="block text-sm font-medium">Preisuntergrenze standardmäßig merken</span>
              <span className="block text-[12px] text-muted">Neue Inserate speichern den Break-even als Untergrenze. Preise werden nicht automatisch angepasst.</span>
            </span>
            <input type="checkbox" className="peer sr-only" checked={settings.autoRepricing} onChange={(e) => portfolio.updateSettings({ autoRepricing: e.target.checked })} />
            <span aria-hidden className="relative h-7 w-12 shrink-0 rounded-full bg-line-strong transition peer-checked:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-ink after:absolute after:top-1 after:left-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
          </label>
        </section>

        <section className="min-w-0 rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line md:p-6">
          <h2 className="text-lg font-semibold tracking-tight">Marktplätze verbinden</h2>
          <p className="mt-1 text-[13px] text-muted">Verbinde dein eigenes eBay- oder Amazon-Konto über die offizielle Freigabe des Marktplatzes. Dein Passwort bleibt bei dir.</p>
          <ul className="mt-5 divide-y divide-line">
            {PROVIDERS.map((c) => (
              <li key={c.id} className="flex items-center gap-3 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-canvas text-ink-2" aria-hidden>
                  <IconPlug size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="truncate text-[12px] text-muted">{c.purpose}</p>
                </div>
              </li>
            ))}
          </ul>
          <LinkButton href="/konto/verbindungen/" className="mt-4 w-full">
            Verbindungen verwalten
          </LinkButton>
        </section>
      </div>

      <section className="mt-6 flex flex-col items-start justify-between gap-4 rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line md:flex-row md:items-center md:p-6">
        <div>
          <h2 className="font-semibold">Portfolio zurücksetzen</h2>
          <p className="text-[13px] text-muted">Löscht alle Bestellungen, Inserate und Strategie-Einstellungen in deinem Portfolio.</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            if (window.confirm("Alle Bestellungen, Inserate und Einstellungen im Portfolio löschen?")) portfolio.reset();
          }}
        >
          Zurücksetzen
        </Button>
      </section>
    </>
  );
}
