"use client";

import { useState, type FormEvent } from "react";
import { Field, FormMessage } from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import { api, ApiError, BACKEND } from "@/lib/client/api";

type Result = { reference: string; receivedAt: string };

export function CancelForm() {
  const [kind, setKind] = useState<"ordentlich" | "ausserordentlich" | "widerruf">("ordentlich");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<Result | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setErr(null);
    if (!BACKEND) {
      setErr("In dieser Vorschau ist keine Kündigung möglich. Bitte nutze die Live-Version oder schreibe uns eine E-Mail (siehe Impressum).");
      return;
    }
    setBusy(true);
    try {
      const res = await api<Result>("/api/kuendigung/", {
        body: { name: f.get("name"), email: f.get("email"), contract: f.get("contract"), reason: f.get("reason"), kind },
      });
      setDone(res);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Die Kündigung konnte nicht gesendet werden. Bitte versuche es erneut.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-[24px] bg-good-soft p-6 text-[#0b7a43]" role="status">
        <p className="text-[17px] font-semibold">Kündigung eingegangen</p>
        <p className="mt-2 text-[14px]">
          Eingang: {new Date(done.receivedAt).toLocaleString("de-DE")} · Referenz: {done.reference}
        </p>
        <p className="mt-2 text-[14px]">Gehört die E-Mail-Adresse zu einem Konto, schicken wir die Bestätigung dorthin. Bitte bewahre die Referenz auf.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-4 rounded-[24px] p-6 ring-1 ring-line">
      <fieldset>
        <legend className="text-[13px] font-medium">Art der Kündigung</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {(
            [
              ["ordentlich", "Ordentlich zum nächstmöglichen Zeitpunkt"],
              ["ausserordentlich", "Außerordentlich (fristlos)"],
              ["widerruf", "Widerruf (innerhalb von 14 Tagen)"],
            ] as const
          ).map(([k, label]) => (
            <label
              key={k}
              className={`cursor-pointer rounded-2xl p-3 text-[13px] ring-1 transition ${kind === k ? "bg-ink text-white ring-ink" : "ring-line hover:ring-line-strong"}`}
            >
              <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} className="sr-only" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="Vor- und Nachname" name="name" autoComplete="name" required maxLength={120} />
      <Field label="E-Mail-Adresse deines Kontos" name="email" type="email" autoComplete="email" required />
      <Field label="Vertrag" name="contract" defaultValue="Arbitrage Radar Abo" maxLength={200} hint="Zum Beispiel Tarif oder Kundennummer, falls bekannt." />
      {kind === "ausserordentlich" && (
        <label className="block">
          <span className="text-[13px] font-medium">Kündigungsgrund</span>
          <textarea
            name="reason"
            rows={3}
            maxLength={1000}
            required
            className="mt-1.5 w-full rounded-2xl bg-white p-4 text-[15px] ring-1 ring-line outline-none focus:ring-2 focus:ring-ink"
          />
        </label>
      )}
      {err && <FormMessage>{err}</FormMessage>}
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? "Wird gesendet …" : "Jetzt kündigen"}
      </Button>
    </form>
  );
}
