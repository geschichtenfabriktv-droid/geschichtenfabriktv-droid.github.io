"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthLayout, StaticNotice } from "@/components/forms/auth-layout";
import { Field, FormMessage } from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import { api, ApiError, BACKEND } from "@/lib/client/api";

export default function ForgotPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/api/auth/forgot/", { body: { email: new FormData(e.currentTarget).get("email") } });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Bitte versuche es erneut.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Passwort vergessen" subtitle="Wir schicken dir einen Link, mit dem du ein neues Passwort setzt.">
      {!BACKEND ? (
        <StaticNotice />
      ) : sent ? (
        <FormMessage tone="good">Wenn ein Konto zu dieser Adresse existiert, ist die E-Mail unterwegs. Der Link ist eine Stunde gültig.</FormMessage>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Field label="E-Mail" name="email" type="email" autoComplete="email" required />
          {error && <FormMessage>{error}</FormMessage>}
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            Link senden
          </Button>
          <p className="text-center text-[13px]">
            <Link href="/login/" className="text-ink-2 hover:text-ink">
              Zurück zur Anmeldung
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
