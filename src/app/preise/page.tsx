import type { Metadata } from "next";
import { PricingCards } from "@/components/site/pricing-cards";
import { PageIntro, SiteLayout } from "@/components/site/site-layout";
import { LinkButton } from "@/components/ui/button";
import { IconCheck, IconMinus } from "@/components/ui/icons";
import { eur } from "@/lib/format";
import { ADDONS, GUARANTEE_DAYS, PLANS } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Preise & Tarife",
  description: "Arbitrage Radar ab 29 € im Monat: Starter, Pro mit Autopilot und Business mit Insolvenz-Finder. Monatlich kündbar, 14 Tage Geld-zurück-Garantie.",
};

const ROWS: { label: string; values: (string | boolean)[] }[] = [
  { label: "Gewinnwahrscheinlichkeit & Marktanalyse", values: [true, true, true] },
  { label: "Produkt-Kategorien", values: ["7", "8 inkl. Vorbestellungen", "alle 9"] },
  { label: "Kaufen & Einstellen auf Knopfdruck", values: [true, true, true] },
  { label: "Autopilot (kaufen & sofort einstellen)", values: [false, true, true] },
  { label: "Preisautomatik mit Break-even-Schutz", values: [false, true, true] },
  { label: "Vorbestell-Radar mit 2×-Kandidaten", values: [false, true, true] },
  { label: "Insolvenz-Finder mit Maximalgebot", values: ["Add-on", "Add-on", true] },
  { label: "Verbundene Marktplätze", values: ["1", "3", "unbegrenzt"] },
  { label: "Nutzer", values: ["1", "1", "5"] },
  { label: "Live-Marktpreise", values: [true, true, true] },
  { label: "API-Zugriff", values: [false, false, true] },
  { label: "Support", values: ["E-Mail", "E-Mail, 24 h", "Priorität"] },
];

const FAQ = [
  ["Kann ich jederzeit kündigen?", "Ja. Monatsabos sind monatlich, Jahresabos jährlich zum Laufzeitende kündbar, im Kundenkonto oder über „Verträge hier kündigen“."],
  ["Wie funktioniert die Geld-zurück-Garantie?", `Schreib uns innerhalb von ${GUARANTEE_DAYS} Tagen nach dem ersten Kauf, du bekommst den vollen Betrag zurück.`],
  ["Welche Zahlungsarten gibt es?", "Kreditkarte, PayPal und SEPA-Lastschrift. Die Zahlung wird sicher über Mollie abgewickelt."],
  ["Kann ich den Tarif wechseln?", "Jederzeit im Kundenkonto. Neue Funktionen sind sofort aktiv, der neue Preis gilt ab der nächsten Abrechnung."],
  ["Brauche ich eigene Marktplatz-Konten?", "Ja. Du verbindest dein eigenes eBay- oder Amazon-Verkäuferkonto, damit Inserate in deinem Namen erscheinen und Erlöse direkt an dich gehen."],
];

function Cell({ v }: { v: string | boolean }) {
  if (v === true) return <IconCheck size={18} className="mx-auto text-good" aria-label="enthalten" />;
  if (v === false) return <IconMinus size={18} className="mx-auto text-line-strong" aria-label="nicht enthalten" />;
  return <span className="text-[13px] font-medium">{v}</span>;
}

export default function PreisePage() {
  return (
    <SiteLayout>
      <PageIntro eyebrow="Preise" title={<>Einfach. Fair. <span className="italic text-muted">Monatlich kündbar.</span></>}>
        Ein einziger guter Deal deckt den Monatspreis. Starte mit dem Tarif, der zu deinem Volumen passt, und wechsle jederzeit.
      </PageIntro>

      <section className="mx-auto max-w-[1320px] px-4 pb-20 sm:px-6 lg:px-10">
        <PricingCards />
      </section>

      <section className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:px-10">
          <h2 className="font-display text-[40px] leading-none tracking-tight md:text-[56px]">Erweiterungen</h2>
          <p className="mt-3 max-w-xl text-ink-2">Buchbar zu jedem passenden Tarif, monatlich kündbar mit dem Abo.</p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ADDONS.map((a) => (
              <div key={a.id} className="rounded-[24px] bg-white p-6 ring-1 ring-line">
                <p className="text-lg font-semibold tracking-tight">{a.name}</p>
                <p className="mt-1 text-[14px] text-ink-2">{a.description}</p>
                <p className="tabular mt-6 text-2xl font-semibold">
                  +{eur(a.monthly, { cents: false })}
                  <span className="text-[13px] font-normal text-muted"> / Monat</span>
                </p>
                <p className="mt-1 text-[12px] text-muted">für {a.plans.map((p) => PLANS.find((x) => x.id === p)?.name).join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:px-10">
        <h2 className="font-display text-[40px] leading-none tracking-tight md:text-[56px]">Alle Funktionen im Vergleich</h2>
        <div className="mt-10 overflow-x-auto rounded-[24px] ring-1 ring-line">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead className="bg-canvas">
              <tr>
                <th className="p-4 font-medium text-muted">Funktion</th>
                {PLANS.map((p) => (
                  <th key={p.id} className="p-4 text-center font-semibold">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ROWS.map((r) => (
                <tr key={r.label}>
                  <td className="p-4 text-ink-2">{r.label}</td>
                  {r.values.map((v, i) => (
                    <td key={i} className="p-4 text-center">
                      <Cell v={v} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <div>
            <h2 className="font-display text-[40px] leading-none tracking-tight md:text-[56px]">Fragen zum Abo</h2>
            <LinkButton href="/demo/" variant="secondary" className="mt-8">
              Erst kostenlos ansehen
            </LinkButton>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[17px] font-semibold tracking-tight [&::-webkit-details-marker]:hidden">
                  {q}
                  <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full ring-1 ring-line transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
