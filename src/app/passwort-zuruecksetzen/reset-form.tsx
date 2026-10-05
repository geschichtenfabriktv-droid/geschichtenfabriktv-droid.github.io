"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthLayout, StaticNotice } from "@/components/forms/auth-layout";
import { Field, FormMessage } from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import { api, ApiError, BACKEND } from "@/lib/client/api";

export function ResetForm() {
  const token = useSearchParams().get("token") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/api/auth/reset/", { body: { token, password: new FormData(e.currentTarget).get("password") } });
      window.location.assign("/login/?hinweis=zurueckgesetzt");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Bitte versuche es erneut.");
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Neues Passwort" subtitle="Alle anderen Geräte werden danach abgemeldet.">
      {!BACKEND ? (
        <StaticNotice />
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Field label="Neues Passwort" name="password" type="password" autoComplete="new-password" minLength={10} required hint="Mindestens 10 Zeichen." />
          {error && <FormMessage>{error}</FormMessage>}
          <Button type="submit" size="lg" className="w-full" disabled={busy || !token}>
            Passwort speichern
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
