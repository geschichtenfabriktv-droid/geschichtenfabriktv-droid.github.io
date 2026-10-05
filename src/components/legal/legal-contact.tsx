"use client";

import { useEffect, useState } from "react";

type LegalData = Partial<Record<"name" | "street" | "city" | "country" | "email" | "phone" | "vat_id", string>>;

/** Dekodiert die kodiert eingebetteten Anbieterangaben erst im Browser (kein Klartext im HTML). */
function decode(): LegalData {
  const raw = process.env.NEXT_PUBLIC_LEGAL_DATA ?? "";
  if (!raw) return {};
  try {
    const bin = atob(raw.split("").reverse().join(""));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as LegalData;
  } catch {
    return {};
  }
}

function useLegalData() {
  const [data, setData] = useState<LegalData | null>(null);
  useEffect(() => setData(decode()), []);
  return data;
}

const MISSING = "[wird vom Betreiber ergänzt]";

/** Vollständige Anbieterkennzeichnung (nur im Impressum und wo rechtlich nötig). */
export function LegalAddress({ withContact = true }: { withContact?: boolean }) {
  const d = useLegalData();
  if (!d) return <span className="inline-block h-20 w-56 animate-pulse rounded-xl bg-canvas" aria-label="Wird geladen" />;
  return (
    <span className="block" data-nosnippet>
      {d.name ?? MISSING}
      <br />
      {d.street ?? MISSING}
      <br />
      {d.city ?? MISSING}
      {d.country && (
        <>
          <br />
          {d.country}
        </>
      )}
      {withContact && (
        <>
          <br />
          <br />
          E-Mail: {d.email ? <a href={`mailto:${d.email}`} className="underline underline-offset-4">{d.email}</a> : MISSING}
          {d.phone && (
            <>
              <br />
              Telefon: {d.phone}
            </>
          )}
        </>
      )}
    </span>
  );
}

export function LegalName() {
  const d = useLegalData();
  return <span data-nosnippet>{d ? (d.name ?? MISSING) : "…"}</span>;
}

export function LegalEmail() {
  const d = useLegalData();
  if (!d) return <span>…</span>;
  return d.email ? (
    <a href={`mailto:${d.email}`} className="underline underline-offset-4" data-nosnippet>
      {d.email}
    </a>
  ) : (
    <span>{MISSING}</span>
  );
}

export function LegalVatId() {
  const d = useLegalData();
  if (!d?.vat_id) return null;
  return (
    <p data-nosnippet>
      Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: {d.vat_id}
    </p>
  );
}
