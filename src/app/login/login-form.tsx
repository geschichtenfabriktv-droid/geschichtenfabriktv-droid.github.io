"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthLayout, safeNext, StaticNotice } from "@/components/forms/auth-layout";
import { Field, FormMessage } from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import { api, ApiError, BACKEND } from "@/lib/client/api";

export function LoginForm() {
  const params = useSearchParams();
  const next = safeNext(params.get("weiter"), "/app/");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await api("/api/auth/login/", { body: { email: form.get("email"), password: form.get("password") } });
      window.location.assign(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Anmeldung fehlgeschlagen.");
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Willkommen zurück"
      subtitle={
        <>
          Noch kein Konto?{" "}
          <Link href={`/registrieren/?weiter=${encodeURIComponent(next)}`} className="font-medium text-ink underline underline-offset-4">
            Jetzt registrieren
          </Link>
        </>
      }
    >
      {!BACKEND ? (
        <StaticNotice />
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          {params.get("hinweis") === "zurueckgesetzt" && <FormMessage tone="good">Dein Passwort ist geändert. Melde dich jetzt an.</FormMessage>}
          <Field label="E-Mail" name="email" type="email" autoComplete="email" required />
          <Field label="Passwort" name="password" type="password" autoComplete="current-password" required />
          <div className="flex justify-end">
            <Link href="/passwort-vergessen/" className="text-[13px] font-medium text-ink-2 hover:text-ink">
              Passwort vergessen?
            </Link>
          </div>
          {error && <FormMessage>{error}</FormMessage>}
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? "Anmelden …" : "Anmelden"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
