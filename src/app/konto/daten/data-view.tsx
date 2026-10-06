"use client";

import { useState } from "react";
import { Field, FormMessage } from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/client/api";
import { dateDe } from "@/lib/format";
import { useAccount } from "../use-account";

export function DataView() {
  const { data, error, reload } = useAccount();
  const [msg, setMsg] = useState<{ tone: "good" | "bad"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  if (error) return <FormMessage>{error}</FormMessage>;
  if (!data) return <div className="h-64 animate-pulse rounded-[var(--radius-card)] bg-white ring-1 ring-line" />;

  const run = async (fn: () => Promise<unknown>, ok: string, form?: HTMLFormElement) => {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
      form?.reset();
      setMsg({ tone: "good", text: ok });
      await reload();
    } catch (e) {
      setMsg({ tone: "bad", text: e instanceof ApiError ? e.message : "Das hat nicht geklappt." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {msg && <FormMessage tone={msg.tone}>{msg.text}</FormMessage>}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form
          className="min-w-0 space-y-4 rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line"
          onSubmit={(e) => {
            e.preventDefault();
            const name = new FormData(e.currentTarget).get("name");
            void run(() => api("/api/account/", { method: "PATCH", body: { name } }), "Profil gespeichert.");
          }}
        >
          <h2 className="text-lg font-semibold tracking-tight">Profil</h2>
          <Field label="Name" name="name" defaultValue={data.user.name} autoComplete="name" />
          <Field label="E-Mail" value={data.user.email} disabled readOnly hint={`Konto seit ${dateDe(data.user.createdAt)}`} />
          <Button type="submit" disabled={busy}>
            Speichern
          </Button>
        </form>

        <form
          className="min-w-0 space-y-4 rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const f = new FormData(form);
            void run(() => api("/api/account/password/", { body: { current: f.get("current"), next: f.get("next") } }), "Passwort geändert. Andere Geräte wurden abgemeldet.", form);
          }}
        >
          <h2 className="text-lg font-semibold tracking-tight">Passwort ändern</h2>
          <Field label="Aktuelles Passwort" name="current" type="password" autoComplete="current-password" required />
          <Field label="Neues Passwort" name="next" type="password" autoComplete="new-password" minLength={10} required hint="Mindestens 10 Zeichen." />
          <Button type="submit" disabled={busy}>
            Passwort ändern
          </Button>
        </form>
      </div>

      <section className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line">
        <h2 className="text-lg font-semibold tracking-tight">Deine Daten</h2>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-2">
          Lade alle Daten herunter, die wir zu deinem Konto speichern (Auskunft und Datenübertragbarkeit nach Art. 15 und 20 DSGVO). Zugangsschlüssel deiner
          Marktplätze sind aus Sicherheitsgründen nicht enthalten.
        </p>
        <a href="/api/account/export/" download className="mt-4 inline-flex h-11 items-center rounded-[10px] px-5 text-sm font-medium ring-1 ring-line-strong hover:bg-canvas">
          Daten als JSON herunterladen
        </a>
      </section>

      <section className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-semibold">Abmelden</h2>
          <p className="text-[13px] text-muted">Beendet die Sitzung auf diesem Gerät.</p>
        </div>
        <Button
          variant="secondary"
          onClick={async () => {
            await api("/api/auth/logout/", { body: {} });
            window.location.assign("/");
          }}
        >
          Abmelden
        </Button>
      </section>

      <form
        className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-bad/30"
        onSubmit={(e) => {
          e.preventDefault();
          const password = new FormData(e.currentTarget).get("password");
          if (!window.confirm("Konto endgültig löschen? Ein laufendes Abo wird gekündigt. Das kann nicht rückgängig gemacht werden.")) return;
          setBusy(true);
          api("/api/account/delete/", { body: { password } })
            .then(() => window.location.assign("/?konto=geloescht"))
            .catch((err) => {
              setMsg({ tone: "bad", text: err instanceof ApiError ? err.message : "Löschen fehlgeschlagen." });
              setBusy(false);
            });
        }}
      >
        <h2 className="font-semibold text-[#b42a22]">Konto löschen</h2>
        <p className="mt-1 max-w-2xl text-[13px] text-ink-2">
          Löscht dein Konto, alle Verbindungen samt Zugangsschlüsseln, dein Portfolio und den Zahlungsverlauf bei uns. Ein laufendes Abo wird gekündigt.
          Rechnungen bewahren wir nur so lange auf, wie es das Steuerrecht verlangt.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Field label="Passwort zur Bestätigung" name="password" type="password" autoComplete="current-password" required />
          </div>
          <Button type="submit" variant="secondary" disabled={busy} className="!text-[#b42a22]">
            Endgültig löschen
          </Button>
        </div>
      </form>
    </div>
  );
}
