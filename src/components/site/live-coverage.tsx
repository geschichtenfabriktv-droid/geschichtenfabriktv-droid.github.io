"use client";

import { useEffect, useState } from "react";
import { BACKEND } from "@/lib/client/api";

interface Coverage {
  scannedAt: string;
  sourcesLive: number;
  sourcesTotal: number;
  deals: number;
  auctions: number;
  countries: string[];
}

const time = new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" });
const num = new Intl.NumberFormat("de-DE");

/**
 * Das Abdeckungs-Versprechen, messbar: echte Live-Zahlen statt „alle Angebote am Markt“.
 * Ohne Server (statische Vorschau) oder ohne Antwort bleibt der Block weg.
 */
export function LiveCoverage({ className = "" }: { className?: string }) {
  const [data, setData] = useState<Coverage | null>(null);
  useEffect(() => {
    if (!BACKEND) return;
    let alive = true;
    fetch("/api/abdeckung/")
      .then((r) => (r.ok ? (r.json() as Promise<Coverage>) : null))
      .then((d) => alive && setData(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  if (!data || data.sourcesLive === 0) return null;

  const stats = [
    { value: data.sourcesLive, label: data.sourcesLive === 1 ? "Quelle live verbunden" : "Quellen live verbunden" },
    ...(data.auctions > 0 ? [{ value: data.auctions, label: "laufende Auktionen" }] : []),
    ...(data.deals > 0 ? [{ value: data.deals, label: data.deals === 1 ? "aktuelle Chance" : "aktuelle Chancen" }] : []),
  ];
  return (
    <section aria-labelledby="abdeckung" className={className}>
      <div className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line md:p-8">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-good">
          <span aria-hidden className="size-2 rounded-full bg-good" /> Live
        </p>
        <h2 id="abdeckung" className="mt-2 font-display text-[28px] leading-[1.08] md:text-[36px]">
          So viele echte Quellen wie möglich
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-2">
          Unser Ziel ist die größte Trefferzahl, die sich sauber erfassen lässt. Wir binden laufend weitere Quellen an, soweit wir sie rechtlich nutzen dürfen. Doppelte Treffer führen wir
          zusammen. Die Zahlen hier sind live und werden nicht geschätzt.
        </p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="border-t border-line pt-4">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="tabular block font-display text-[40px] leading-none">{num.format(s.value)}</span>
                <span className="mt-1 block text-[14px] text-muted">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-[13px] text-muted">
          Stand {time.format(new Date(data.scannedAt))} Uhr · {data.sourcesTotal - data.sourcesLive > 0 ? `${data.sourcesTotal - data.sourcesLive} weitere Quellen in Anbindung · ` : ""}
          Deutschland{data.countries.length > 1 ? ", Österreich, Schweiz" : ""}
        </p>
      </div>
    </section>
  );
}
