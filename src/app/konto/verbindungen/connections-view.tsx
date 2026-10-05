"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Checkbox, Field, FormMessage } from "@/components/forms/fields";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconPlug, IconShield } from "@/components/ui/icons";
import { Sheet } from "@/components/ui/sheet";
import { api, ApiError } from "@/lib/client/api";
import { dateDe } from "@/lib/format";
import { PROVIDERS, type ProviderInfo } from "@/lib/providers";
import { useAccount } from "../use-account";

const RETURN: Record<string, { tone: "good" | "bad"; text: string }> = {
  verbunden: { tone: "good", text: "Verbindung hergestellt." },
  abgelehnt: { tone: "bad", text: "Die Freigabe wurde beim Anbieter abgelehnt. Es wurde nichts gespeichert." },
  ungueltig: { tone: "bad", text: "Die Anfrage war abgelaufen oder ungültig. Bitte starte die Verbindung erneut." },
  fehler: { tone: "bad", text: "Die Verbindung ist fehlgeschlagen. Bitte versuche es erneut." },
};

export function ConnectionsView() {
  const params = useSearchParams();
  const { data, error, reload } = useAccount();
  const [target, setTarget] = useState<ProviderInfo | null>(null);
  const [consent, setConsent] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const returned = RETURN[params.get("status") ?? ""];

  if (error) return <FormMessage>{error}</FormMessage>;
  if (!data) return <div className="h-64 animate-pulse rounded-[var(--radius-card)] bg-white ring-1 ring-line" />;

  const open = (p: ProviderInfo) => {
    setTarget(p);
    setConsent(false);
    setApiKey("");
    setProblem(null);
  };

  const connect = async () => {
    if (!target) return;
    setBusy(true);
    setProblem(null);
    try {
      const r = await api<{ redirect?: string }>(`/api/verbindungen/${target.id}/start/`, { body: { consent, apiKey: apiKey || undefined } });
      if (r.redirect) {
        window.location.assign(r.redirect);
        return;
      }
      setTarget(null);
      setNotice(`${target.name} ist verbunden.`);
      await reload();
    } catch (e) {
      setProblem(e instanceof ApiError ? e.message : "Verbindung fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  };

  const disconnect = async (p: ProviderInfo) => {
    if (!window.confirm(`${p.name} trennen? Die gespeicherten Zugangsdaten werden sofort gelöscht.`)) return;
    await api(`/api/verbindungen/${p.id}/`, { method: "DELETE" });
    setNotice(`${p.name} ist getrennt, die Zugangsdaten sind gelöscht.`);
    await reload();
  };

  const available = (p: ProviderInfo) => (p.id === "ebay" ? data.integrations.ebay : p.id === "amazon" ? data.integrations.amazon : p.method === "apikey");

  return (
    <div className="space-y-6">
      {returned && <FormMessage tone={returned.tone}>{returned.text}</FormMessage>}
      {notice && <FormMessage tone="good">{notice}</FormMessage>}

      <section className="flex gap-4 rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line">
        <IconShield size={22} className="mt-0.5 shrink-0" />
        <div className="text-[14px] leading-relaxed text-ink-2">
          <p className="font-semibold text-ink">So schützen wir deine Konten</p>
          <p className="mt-1">
            Du meldest dich direkt beim Marktplatz an und gibst nur die nötigen Rechte frei. Wir sehen dein Passwort nie. Zugangsschlüssel werden verschlüsselt
            (AES-256) auf Servern in der EU gespeichert, nur für die genannten Zwecke genutzt und beim Trennen sofort gelöscht.
          </p>
        </div>
      </section>

      <ul className="grid gap-3 md:grid-cols-2">
        {PROVIDERS.map((p) => {
          const c = data.connections.find((x) => x.provider === p.id);
          const ready = available(p);
          return (
            <li key={p.id} className="flex flex-col rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-canvas" aria-hidden>
                  <IconPlug size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{p.name}</p>
                    {c ? (
                      <Badge tone={c.status === "verbunden" ? "good" : "bad"}>{c.status === "verbunden" ? "Verbunden" : "Erneut verbinden"}</Badge>
                    ) : p.method === "none" ? (
                      <Badge tone="neutral">Kein offizieller Zugang</Badge>
                    ) : (
                      <Badge tone="outline">Nicht verbunden</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-[13px] text-ink-2">{p.purpose}</p>
                  {c?.accountLabel && <p className="mt-1 text-[12px] text-muted">Konto: {c.accountLabel} · seit {dateDe(c.consentAt)}</p>}
                  {p.note && !c && <p className="mt-1 text-[12px] text-muted">{p.note}</p>}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                {c ? (
                  <>
                    {c.status !== "verbunden" && <Button size="sm" onClick={() => open(p)}>Neu verbinden</Button>}
                    <Button size="sm" variant="secondary" onClick={() => disconnect(p)}>
                      Trennen & löschen
                    </Button>
                  </>
                ) : p.method !== "none" ? (
                  <Button size="sm" onClick={() => open(p)} disabled={!ready}>
                    {ready ? "Verbinden" : "Freischaltung läuft"}
                  </Button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      <Sheet open={target !== null} onClose={() => setTarget(null)} title={`${target?.name ?? ""} verbinden`} subtitle="Einwilligung zur Datenverarbeitung">
        {target && (
          <div className="space-y-5">
            <dl className="space-y-3 rounded-2xl bg-canvas p-4 text-[13px]">
              <div>
                <dt className="font-semibold">Zweck</dt>
                <dd className="text-ink-2">{target.purpose}.</dd>
              </div>
              <div>
                <dt className="font-semibold">Verarbeitete Daten</dt>
                <dd className="text-ink-2">{target.dataUsed}.</dd>
              </div>
              <div>
                <dt className="font-semibold">Speicherung</dt>
                <dd className="text-ink-2">Verschlüsselt in der EU, bis du die Verbindung trennst oder dein Konto löschst.</dd>
              </div>
            </dl>
            {target.method === "apikey" && (
              <Field label="Dein Keepa-API-Schlüssel" value={apiKey} onChange={(e) => setApiKey(e.target.value.trim())} autoComplete="off" hint="Zu finden unter keepa.com > API." />
            )}
            <Checkbox checked={consent} onChange={(e) => setConsent(e.target.checked)}>
              Ich willige ein, dass Arbitrage Radar die genannten Daten meines {target.name}-Kontos zu den genannten Zwecken verarbeitet. Die Einwilligung kann ich
              jederzeit durch Trennen der Verbindung widerrufen (
              <Link href="/datenschutz/" target="_blank" className="underline">
                Datenschutzerklärung
              </Link>
              ).
            </Checkbox>
            {problem && <FormMessage>{problem}</FormMessage>}
            <Button size="lg" className="w-full" disabled={!consent || busy || (target.method === "apikey" && !apiKey)} onClick={connect}>
              {target.method === "oauth" ? `Weiter zu ${target.name}` : "Verbinden"}
            </Button>
          </div>
        )}
      </Sheet>
    </div>
  );
}
