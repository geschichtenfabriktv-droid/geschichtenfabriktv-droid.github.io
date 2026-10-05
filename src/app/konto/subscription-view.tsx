"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Checkbox, FormMessage } from "@/components/forms/fields";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { api, ApiError } from "@/lib/client/api";
import { dateDe, eur } from "@/lib/format";
import { ADDONS, getPlan, PLANS, priceFor, type AddonId, type PlanId } from "@/lib/pricing";
import { useAccount } from "./use-account";

const STATUS: Record<string, { label: string; tone: "good" | "warn" | "bad" | "neutral" }> = {
  active: { label: "Aktiv", tone: "good" },
  canceled: { label: "Gekündigt", tone: "warn" },
  past_due: { label: "Zahlung offen", tone: "bad" },
  pending: { label: "Zahlung ausstehend", tone: "warn" },
  none: { label: "Kein Abo", tone: "neutral" },
};

const PAYMENT_STATUS: Record<string, string> = { paid: "Bezahlt", open: "Offen", pending: "In Bearbeitung", failed: "Fehlgeschlagen", canceled: "Abgebrochen", expired: "Abgelaufen", authorized: "Autorisiert" };

export function SubscriptionView() {
  const params = useSearchParams();
  const { data, error, reload } = useAccount();
  const [message, setMessage] = useState<{ tone: "good" | "bad"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [plan, setPlan] = useState<PlanId | null>(null);
  const [addons, setAddons] = useState<AddonId[] | null>(null);
  const synced = useRef(false);

  // Rückkehr von Mollie: Zahlungsstatus sofort abgleichen.
  useEffect(() => {
    if (params.get("checkout") && !synced.current) {
      synced.current = true;
      api("/api/billing/sync/", { body: {} })
        .then(() => reload())
        .then((next) =>
          setMessage(
            next?.user.hasAccess
              ? { tone: "good", text: "Zahlung erhalten. Dein Abo ist aktiv und das Dashboard freigeschaltet." }
              : { tone: "good", text: "Danke! Sobald Mollie die Zahlung bestätigt, ist dein Dashboard freigeschaltet. Das kann bei Lastschrift etwas dauern." },
          ),
        )
        .catch(() => undefined);
    }
  }, [params, reload]);

  if (error) return <FormMessage>{error}</FormMessage>;
  if (!data) return <div className="h-64 animate-pulse rounded-[var(--radius-card)] bg-white ring-1 ring-line" />;

  const u = data.user;
  const current = getPlan(u.plan);
  const status = STATUS[u.status] ?? STATUS.none!;
  const selPlan = plan ?? u.plan ?? "pro";
  const selAddons = (addons ?? u.addons).filter((a) => ADDONS.find((x) => x.id === a)?.plans.includes(selPlan));
  const changed = current && (selPlan !== u.plan || selAddons.slice().sort().join() !== u.addons.slice().sort().join());

  const act = async <T,>(fn: () => Promise<T>, ok: string | ((result: T) => string)) => {
    setBusy(true);
    setMessage(null);
    try {
      const result = await fn();
      await reload();
      setMessage({ tone: "good", text: typeof ok === "function" ? ok(result) : ok });
    } catch (e) {
      setMessage({ tone: "bad", text: e instanceof ApiError ? e.message : "Das hat nicht geklappt." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {params.get("hinweis") === "abo" && !u.hasAccess && <FormMessage tone="bad">Für das Dashboard brauchst du einen aktiven Tarif. Wähle unten einen aus.</FormMessage>}
      {params.get("hinweis") === "autopilot" && <FormMessage tone="bad">Der Autopilot ist ab dem Tarif Pro enthalten. Du kannst unten direkt wechseln.</FormMessage>}
      {message && <FormMessage tone={message.tone}>{message.text}</FormMessage>}

      <section className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[13px] text-muted">Dein Tarif</p>
            <p className="mt-1 font-display text-[40px] leading-none tracking-tight">{current?.name ?? "Noch kein Tarif"}</p>
            {current && (
              <p className="mt-2 text-[14px] text-ink-2">
                {eur(priceFor(current.id, u.planInterval ?? "monat", u.addons))} {u.planInterval === "jahr" ? "jährlich" : "monatlich"}
                {u.currentPeriodEnd && <> · {u.status === "canceled" ? "Zugang bis" : "nächste Abbuchung"} {dateDe(u.currentPeriodEnd)}</>}
              </p>
            )}
          </div>
          <Badge tone={status.tone}>{status.label}</Badge>
        </div>
        {u.hasAccess ? (
          <LinkButton href="/app/" className="mt-6">
            Zum Dashboard
          </LinkButton>
        ) : (
          <LinkButton href="/checkout/" className="mt-6">
            Tarif wählen
          </LinkButton>
        )}
      </section>

      {current && u.status === "active" && (
        <section className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line">
          <h2 className="text-lg font-semibold tracking-tight">Tarif oder Erweiterungen ändern</h2>
          <p className="mt-1 text-[13px] text-muted">
            Ein Upgrade ist sofort aktiv, der Unterschied für die restliche Laufzeit wird anteilig abgebucht. Ein günstigerer Tarif gilt ab der nächsten
            Abbuchung.
          </p>
          {u.pendingPlan && (
            <p className="mt-3 rounded-2xl bg-canvas px-4 py-3 text-[13px] text-ink-2">
              Vorgemerkt ab {u.currentPeriodEnd ? dateDe(u.currentPeriodEnd) : "der nächsten Abbuchung"}: {getPlan(u.pendingPlan)?.name}
            </p>
          )}
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {PLANS.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={selPlan === p.id}
                onClick={() => setPlan(p.id)}
                className={`rounded-2xl p-4 text-left transition ${selPlan === p.id ? "bg-ink text-white" : "ring-1 ring-line hover:ring-ink"}`}
              >
                <p className="font-semibold">{p.name}</p>
                <p className="tabular text-[13px] opacity-70">{eur(u.planInterval === "jahr" ? p.yearly : p.monthly, { cents: false })}</p>
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {ADDONS.filter((a) => a.plans.includes(selPlan)).map((a) => (
              <Checkbox
                key={a.id}
                checked={selAddons.includes(a.id)}
                onChange={(e) => setAddons(e.target.checked ? [...selAddons, a.id] : selAddons.filter((x) => x !== a.id))}
              >
                <span className="font-medium text-ink">{a.name}</span> · +{eur(u.planInterval === "jahr" ? a.monthly * 10 : a.monthly, { cents: false })} /{" "}
                {u.planInterval === "jahr" ? "Jahr" : "Monat"}
              </Checkbox>
            ))}
          </div>
          <p className="tabular mt-4 text-sm">
            Neuer Betrag: <strong>{eur(priceFor(selPlan, u.planInterval ?? "monat", selAddons))}</strong> {u.planInterval === "jahr" ? "jährlich" : "monatlich"}
          </p>
          <Button className="mt-4" disabled={!changed || busy} onClick={() => act(
                () => api<{ effective: "now" | "next_period"; charged: number }>("/api/billing/change/", { body: { plan: selPlan, addons: selAddons } }),
                (r) =>
                  r.effective === "now"
                    ? `Dein Tarif ist geändert und sofort aktiv.${r.charged ? ` Für die restliche Laufzeit buchen wir anteilig ${eur(r.charged)} ab.` : ""}`
                    : "Die Änderung ist vorgemerkt und gilt ab der nächsten Abbuchung.",
              )}>
            Änderung übernehmen
          </Button>
        </section>
      )}

      <section className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line">
        <h2 className="text-lg font-semibold tracking-tight">Zahlungen</h2>
        {data.payments.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Noch keine Zahlungen.</p>
        ) : (
          <table className="mt-4 w-full text-[13px] md:text-sm">
            <thead>
              <tr className="text-left text-[12px] text-muted">
                <th className="pb-2 font-medium">Datum</th>
                <th className="pb-2 font-medium">Leistung</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 text-right font-medium">Betrag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.payments.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 pr-3 whitespace-nowrap">{dateDe(p.createdAt)}</td>
                  <td className="py-3 pr-3 text-ink-2">{p.description}</td>
                  <td className="py-3 pr-3">{PAYMENT_STATUS[p.status] ?? p.status}</td>
                  <td className="tabular py-3 text-right font-medium">{eur(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="mt-4 text-[12px] text-muted">Für jede Zahlung bekommst du eine Bestätigung per E-Mail. Fragen zur Abrechnung beantworten wir über die Kontaktdaten im Impressum.</p>
      </section>

      {current && u.status !== "canceled" && u.status !== "none" && (
        <section className="flex flex-col items-start justify-between gap-4 rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line md:flex-row md:items-center">
          <div>
            <h2 className="font-semibold">Abo kündigen</h2>
            <p className="text-[13px] text-muted">Dein Zugang bleibt bis zum Ende der bezahlten Laufzeit bestehen.</p>
          </div>
          <Button
            variant="secondary"
            disabled={busy}
            onClick={() => {
              if (window.confirm("Abo zum Ende der Laufzeit kündigen?")) void act(() => api("/api/billing/cancel/", { body: {} }), "Dein Abo ist gekündigt. Die Bestätigung kommt per E-Mail.");
            }}
          >
            Jetzt kündigen
          </Button>
        </section>
      )}
      <p className="text-[12px] text-muted">
        Ohne Anmeldung geht es auch über die Seite{" "}
        <Link href="/kuendigen/" className="underline">
          „Verträge hier kündigen“
        </Link>
        .
      </p>
    </div>
  );
}
