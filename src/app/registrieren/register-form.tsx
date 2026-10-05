"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthLayout, safeNext, StaticNotice } from "@/components/forms/auth-layout";
import { Checkbox, Field, FormMessage } from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import { api, ApiError, BACKEND } from "@/lib/client/api";
import { getPlan, isInterval, isPlanId } from "@/lib/pricing";

export function RegisterForm() {
  const params = useSearchParams();
  const plan = params.get("plan");
  const interval = params.get("intervall");
  const chosen = isPlanId(plan) && isInterval(interval) ? `/checkout/?plan=${plan}&intervall=${interval}` : null;
  const next = safeNext(params.get("weiter"), chosen ?? "/preise/");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [terms, setTerms] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await api("/api/auth/register/", { body: { name: form.get("name"), email: form.get("email"), password: form.get("password"), terms } });
      window.location.assign(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registrierung fehlgeschlagen.");
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Konto erstellen"
      subtitle={
        <>
          {isPlanId(plan) ? <>Danach geht es direkt zur Bezahlung für {getPlan(plan)?.name}. </> : null}
          Schon registriert?{" "}
          <Link href={`/login/?weiter=${encodeURIComponent(next)}`} className="font-medium text-ink underline underline-offset-4">
            Anmelden
          </Link>
        </>
      }
    >
      {!BACKEND ? (
        <StaticNotice />
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Field label="Name" name="name" autoComplete="name" required />
          <Field label="E-Mail" name="email" type="email" autoComplete="email" required />
          <Field label="Passwort" name="password" type="password" autoComplete="new-password" minLength={10} required hint="Mindestens 10 Zeichen." />
          <Checkbox checked={terms} onChange={(e) => setTerms(e.target.checked)} required>
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
          {error && <FormMessage>{error}</FormMessage>}
          <Button type="submit" size="lg" className="w-full" disabled={busy || !terms}>
            {busy ? "Konto wird erstellt …" : "Kostenlos registrieren"}
          </Button>
          <p className="text-center text-[12px] text-muted">Die Registrierung ist kostenlos. Kosten entstehen erst mit der Wahl eines Tarifs.</p>
        </form>
      )}
    </AuthLayout>
  );
}
