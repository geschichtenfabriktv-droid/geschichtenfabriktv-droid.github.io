import Link from "next/link";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { FaqList } from "@/components/content/faq-list";
import { JsonLd } from "@/components/seo/json-ld";
import { ProfitCalculator } from "@/components/site/profit-calculator";
import { PageIntro, SiteLayout } from "@/components/site/site-layout";
import { LinkButton } from "@/components/ui/button";
import type { Faq } from "@/lib/content/types";
import { absoluteUrl, BRAND, breadcrumbLd, faqLd, graph, pageMetadata } from "@/lib/seo";

const PATH = "/rechner/";

export const metadata = pageMetadata({
  path: PATH,
  title: "Reselling-Rechner: Gewinn & eBay-Gebühren berechnen",
  description: "Kostenloser Reselling-Rechner: Gewinn, Marge, Rendite und Mindest-Verkaufspreis nach eBay-Gebühren und Versand berechnen. Ohne Anmeldung, Rechnung als Link teilbar.",
  absoluteTitle: true,
});

const FAQ: Faq[] = [
  {
    q: "Welche Gebührensätze sind voreingestellt?",
    a: "Beispielwerte von 11 % Provision und 0,35 € Fixgebühr pro Bestellung, wie im Ratgeber [eBay-Gebühren für gewerbliche Verkäufer](/ratgeber/ebay-gebuehren-reselling/). Die Sätze unterscheiden sich je Kategorie und ändern sich; trag die aktuellen Werte deiner Kategorie ein.",
  },
  {
    q: "Warum zählt der Versand bei der Provision mit?",
    a: "Die Verkaufsprovision bezieht sich auf den Gesamtbetrag, den der Käufer zahlt, also Artikelpreis plus Versand. Der Rechner berücksichtigt das automatisch.",
  },
  {
    q: "Was ist der Mindest-Verkaufspreis?",
    a: "Der Artikelpreis ohne Versand, bei dem nach Gebühren, Versand und Einkauf genau null übrig bleibt. Darunter machst du Verlust.",
  },
  {
    q: "Sind Steuern eingerechnet?",
    a: "Nein. Umsatzsteuer und Einkommensteuer hängen von deiner Situation ab, etwa ob du Kleinunternehmer bist. Mehr dazu im Ratgeber [Reselling: Gewerbe und Steuern](/ratgeber/reselling-gewerbe-steuern/).",
  },
  {
    q: "Speichert der Rechner meine Eingaben?",
    a: "Nein. Gerechnet wird nur in deinem Browser. Wenn du die Rechnung teilst, stehen die Zahlen im Link und sonst nirgends.",
  },
];

export default function RechnerPage() {
  const trail = [
    { name: "Start", path: "/" },
    { name: "Reselling-Rechner", path: PATH },
  ];
  return (
    <SiteLayout>
      <JsonLd
        data={graph(
          breadcrumbLd(trail),
          {
            "@type": "WebApplication",
            name: "Reselling-Rechner",
            url: absoluteUrl(PATH),
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            inLanguage: "de-DE",
            isAccessibleForFree: true,
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            publisher: { "@type": "Organization", name: BRAND },
          },
          faqLd(FAQ),
        )}
      />
      <div className="mx-auto max-w-[1240px] px-4 pt-10 sm:px-6 lg:px-10">
        <Breadcrumbs trail={trail} />
      </div>
      <PageIntro title="Lohnt sich der Weiterverkauf?">
        Trag Einkauf, Verkaufspreis und Gebühren ein. Der Rechner zeigt sofort, was nach Provision und Versand übrig bleibt und ab welchem Preis du keinen Verlust machst.
      </PageIntro>
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-10">
        <ProfitCalculator />
      </div>
      <section className="mx-auto mt-16 max-w-[1240px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-8 rounded-[var(--radius-card)] bg-tag p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <h2 className="font-display text-[30px] leading-[1.08] md:text-[38px]">Den Rechner für jeden Deal, automatisch.</h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink">
              {BRAND} vergleicht Angebote mit den Verkaufspreisen am Markt und rechnet Gebühren, Versand und Gewinnwahrscheinlichkeit für dich aus. Im Test-Dashboard siehst du es an Beispieldaten, ohne Anmeldung.
            </p>
          </div>
          <LinkButton href="/demo/" size="lg" data-ab-goal="start">
            Test-Dashboard öffnen
          </LinkButton>
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 lg:px-0">
        <section className="prose-ar mt-16">
          <h2 className="font-display text-[30px] leading-[1.08] text-ink md:text-[38px]">So rechnet der Rechner</h2>
          <p className="mt-5">
            Gewinn = Verkaufspreis + Versand vom Käufer − Provision − Fixgebühr − Anzeigenkosten − deine Versandkosten − Einkaufspreis. Provision und Anzeigensatz werden auf den Gesamtbetrag inklusive Versand berechnet.
          </p>
          <p className="mt-4">
            Die Marge setzt den Gewinn ins Verhältnis zum Gesamtbetrag, die Rendite ins Verhältnis zum Einkauf. Ausführliche Beispiele stehen im Ratgeber{" "}
            <Link href="/ratgeber/reselling-gewinn-berechnen/" className="font-medium text-ink underline underline-offset-4">
              Reselling-Gewinn berechnen
            </Link>
            .
          </p>
        </section>
        <FaqList faq={FAQ} />
      </div>
    </SiteLayout>
  );
}
