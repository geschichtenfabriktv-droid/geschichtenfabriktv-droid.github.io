"use client";

import Link from "next/link";
import { useState } from "react";
import { Checkbox, FormMessage } from "@/components/forms/fields";
import { IntervalToggle } from "@/components/site/pricing-cards";
import { Brand } from "@/components/ui/brand";
import { Button } from "@/components/ui/button";
import { IconCheck, IconLock } from "@/components/ui/icons";
import { api, ApiError } from "@/lib/client/api";
import { eur } from "@/lib/format";
import { ADDONS, GUARANTEE_DAYS, isInterval, isPlanId, PLANS, priceFor, type AddonId, type BillingInterval, type PlanId } from "@/lib/pricing";

export function CheckoutForm({ ab, initialPlan, initialInterval, email, paymentsReady, paused = false }: { ab?: string; initialPlan?: string; initialInterval?: string; email: string; paymentsReady: boolean; paused?: boolean }) {
  const [plan, setPlan] = useState<PlanId>(isPlanId(initialPlan) ? initialPlan : "pro");
  const [interval, setInterval] = useState<BillingInterval>(isInterval(initialInterval) ? initialInterval : "jahr");
  const [addons, setAddons] = useState<AddonId[]>([]);
  const [terms, setTerms] = useState(false);
  const [waiver, setWaiver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const available = ADDONS.filter((a) => a.plans.includes(plan));
  const selected = addons.filter((a) => available.some((x) => x.id === a));
  const total = priceFor(plan, interval, selected);
  const p = PLANS.find((x) => x.id === plan)!;

  const pay = async () => {
    setBusy(true);
    setError(null);
    try {
      const { checkoutUrl } = await api<{ checkoutUrl: string }>("/api/billing/checkout/", { body: { plan, interval, addons: selected, terms, waiver, ab } });
      window.location.assign(checkoutUrl);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Die Bezahlung konnte nicht gestartet werden.");
      setBusy(false);
    }
  };

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-4 sm:px-6">
          <Brand />
          <span className="flex items-center gap-1.5 text-[12px] text-muted">
            <IconLock size={14} /> Sichere Zahlung über Mollie
          </span>
        </div>
      </header>
      <main className="mx-auto grid max-w-[1100px] grid-cols-1 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_400px]">
        <section className="min-w-0 space-y-6">
          <h1 className="font-display text-[34px] leading-[1.08]">Tarif buchen</h1>
          <IntervalToggle value={interval} onChange={setInterval} />
          <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Tarif">
            {PLANS.map((x) => (
              <button
                key={x.id}
                type="button"
                role="radio"
                aria-checked={plan === x.id}
                onClick={() => setPlan(x.id)}
                className={`rounded-[20px] p-5 text-left transition ${plan === x.id ? "bg-ink text-white" : "bg-white ring-1 ring-line hover:ring-ink"}`}
              >
                <p className="font-semibold">{x.name}</p>
                <p className={`tabular mt-2 text-2xl font-semibold ${plan === x.id ? "" : ""}`}>{eur(interval === "jahr" ? x.yearly : x.monthly, { cents: false })}</p>
                <p className={`text-[12px] ${plan === x.id ? "text-white/60" : "text-muted"}`}>{interval === "jahr" ? "pro Jahr" : "pro Monat"}</p>
              </button>
            ))}
          </div>
          <ul className="grid gap-2 rounded-[20px] bg-white p-5 text-[14px] ring-1 ring-line sm:grid-cols-2">
            {p.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <IconCheck size={16} className="mt-0.5 shrink-0 text-good" /> {b}
              </li>
            ))}
          </ul>
          {available.length > 0 && (
            <fieldset className="rounded-[20px] bg-white p-5 ring-1 ring-line">
              <legend className="sr-only">Erweiterungen</legend>
              <p className="font-semibold">Erweiterungen</p>
              <div className="mt-3 space-y-3">
                {available.map((a) => (
                  <Checkbox key={a.id} checked={selected.includes(a.id)} onChange={(e) => setAddons((cur) => (e.target.checked ? [...cur, a.id] : cur.filter((x) => x !== a.id)))}>
                    <span className="font-medium text-ink">{a.name}</span> · +{eur(a.monthly * (interval === "jahr" ? 10 : 1), { cents: false })}
                    {interval === "jahr" ? " / Jahr" : " / Monat"}
                    <span className="block text-[12px] text-muted">{a.description}</span>
                  </Checkbox>
                ))}
              </div>
            </fieldset>
          )}
        </section>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line">
            <p className="text-[13px] text-muted">Zusammenfassung</p>
            <dl className="mt-4 space-y-2 text-[14px]">
              <div className="flex justify-between">
                <dt>{p.name} ({interval === "jahr" ? "jährlich" : "monatlich"})</dt>
                <dd className="tabular">{eur(interval === "jahr" ? p.yearly : p.monthly)}</dd>
              </div>
              {selected.map((id) => {
                const a = ADDONS.find((x) => x.id === id)!;
                return (
                  <div key={id} className="flex justify-between text-ink-2">
                    <dt>{a.name}</dt>
                    <dd className="tabular">{eur(a.monthly * (interval === "jahr" ? 10 : 1))}</dd>
                  </div>
                );
              })}
              <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold">
                <dt>Heute fällig</dt>
                <dd className="tabular">{eur(total)}</dd>
              </div>
            </dl>
            <p className="mt-1 text-[12px] text-muted">
              inkl. MwSt. · danach {eur(total)} {interval === "jahr" ? "jährlich" : "monatlich"} · Konto: {email}
            </p>
            <div className="mt-6 space-y-3">
              <Checkbox checked={terms} onChange={(e) => setTerms(e.target.checked)}>
                Ich akzeptiere die{" "}
                <Link href="/agb/" target="_blank" className="underline">
                  AGB
                </Link>{" "}
                und habe die{" "}
                <Link href="/datenschutz/" target="_blank" className="underline">
                  Datenschutzerklärung
                </Link>{" "}
                zur Kenntnis genommen.
              </Checkbox>
              <Checkbox checked={waiver} onChange={(e) => setWaiver(e.target.checked)}>
                Ich verlange ausdrücklich, dass ihr vor Ablauf der Widerrufsfrist mit der Leistung beginnt. Mir ist bekannt, dass ich bei einem Widerruf einen
                anteiligen Betrag für die bis dahin erbrachte Leistung zahle (
                <Link href="/widerruf/" target="_blank" className="underline">
                  Widerrufsbelehrung
                </Link>
                ).
              </Checkbox>
            </div>
            {!paymentsReady && <div className="mt-4"><FormMessage>{paused ? "Neue Abos sind gerade pausiert, bis alle Datenquellen live sind. Wir starten in Kürze." : "Die Bezahlung wird gerade freigeschaltet. Bitte versuche es in Kürze erneut."}</FormMessage></div>}
            {error && <div className="mt-4"><FormMessage>{error}</FormMessage></div>}
            <Button size="lg" className="mt-6 w-full" disabled={!terms || !waiver || busy || !paymentsReady} onClick={pay}>
              {busy ? "Weiter zu Mollie …" : "Zahlungspflichtig abonnieren"}
            </Button>
            <p className="mt-3 text-center text-[12px] text-muted">
              {GUARANTEE_DAYS} Tage Geld-zurück-Garantie · jederzeit zum Laufzeitende kündbar
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
