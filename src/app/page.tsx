import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { faqLd, graph, organizationLd, pageMetadata, softwareLd, websiteLd } from "@/lib/seo";
import Link from "next/link";
import { PriceTag } from "@/components/site/price-tag";
import { LiveCoverage } from "@/components/site/live-coverage";
import { PricingCards } from "@/components/site/pricing-cards";
import { COUNTRY_FAQ } from "@/lib/pricing";
import { env } from "@/server/env";
import { SiteLayout } from "@/components/site/site-layout";
import { LinkButton } from "@/components/ui/button";
import { IconArrowUpRight } from "@/components/ui/icons";
import { ProbabilityBar } from "@/components/ui/probability-bar";
import { getAnalyzedDeals, getAnalyzedLots, summarizeCategories } from "@/lib/data/repository";
import { eur, signedEur } from "@/lib/format";

export const metadata: Metadata = pageMetadata({
  path: "/",
  title: "Arbitrage-Software für Reseller | Arbitrage Radar",
  absoluteTitle: true,
  description: "Finde Arbitrage-Deals, Vorbestell-Chancen und Insolvenzmassen mit Gewinnwahrscheinlichkeit in Prozent. Kostenlos im Test-Dashboard ansehen.",
});

const FEATURES = [
  {
    key: "arbitrage",
    title: "Arbitrage-Finder",
    text: "Vergleicht Händlerpreise mit den Marktpreisen auf eBay und Amazon und rechnet Gebühren und Versand direkt ein.",
  },
  {
    key: "vorbestellung",
    title: "Vorbestell-Radar",
    text: "Zeigt limitierte Releases, die zum Normalpreis vorbestellbar sind, und schätzt, ob sie auf dem Zweitmarkt mehr erzielen – manche bis zum doppelten Preis.",
  },
  {
    key: "insolvenz",
    title: "Insolvenz-Finder",
    text: "Bewertet Insolvenzmasse-Posten mit Maximalgebot – also bis zu welchem Gebot sich ein Los noch lohnt.",
  },
  {
    key: "autopilot",
    title: "Autopilot",
    text: "Öffnet das Händlerangebot und stellt die Ware mit einem Klick auf eBay ein.",
  },
];

const STEPS = [
  { n: "1", title: "Erfassen", text: "Händlerangebote, Vorbestellungen und Insolvenzposten werden Produkten eindeutig zugeordnet und mit Marktpreisen verknüpft." },
  { n: "2", title: "Bewerten", text: "Für jede Chance entsteht eine Marktanalyse: Preisverteilung, Nachfrage, Konkurrenz, Trend und alle Gebühren." },
  { n: "3", title: "Handeln", text: "Ein Klick öffnet das Händlerangebot, ein zweiter stellt die Ware auf eBay ein. Den Kauf beim Händler schließt du selbst ab." },
];

const BASE_FAQ = [
  {
    q: "Wie wird die Gewinnwahrscheinlichkeit berechnet?",
    a: "Die erzielbaren Verkaufspreise werden als Verteilung um den Marktmedian modelliert und um den Trend bis zum voraussichtlichen Verkauf korrigiert. Daraus ergibt sich die Wahrscheinlichkeit, nach allen Gebühren mindestens 5 € oder 5 % Gewinn (der höhere Wert) zu erzielen, gewichtet mit der Chance, innerhalb von 30 Tagen einen Käufer zu finden.",
  },
  {
    q: "Wird automatisch gekauft und verkauft?",
    a: "Nein, gekauft wird nie automatisch. Du verbindest dein eigenes eBay-Verkäuferkonto über die offizielle Freigabe des Marktplatzes, ohne uns dein Passwort zu geben. Danach stellt Arbitrage Radar Angebote auf Knopfdruck in deinem Namen ein. Das Händlerangebot öffnest du mit einem Klick, den Kauf schließt du dort selbst ab. Jede Aktion löst du selbst aus.",
  },
  {
    q: "Was sind Insolvenzmassen?",
    a: "Vermögen insolventer Unternehmen, das der Insolvenzverwalter verwertet: Warenlager, Maschinen, Fahrzeuge, IT oder Markenrechte. Häufig wird es deutlich unter dem Gutachterwert versteigert.",
  },
  {
    q: "Was kostet Arbitrage Radar und wie kündige ich?",
    a: "Ab 29 € im Monat oder 24,17 € im Monat bei jährlicher Zahlung. Du kannst jederzeit zum Ende der Laufzeit kündigen, im Kundenkonto oder über „Verträge hier kündigen“ im Footer. Ein bereits verlängertes Jahresabo kannst du als Verbraucher jederzeit mit einer Frist von einem Monat kündigen. In den ersten 14 Tagen gibt es dein Geld ohne Angabe von Gründen zurück.",
  },
  {
    q: "Sind meine Daten sicher?",
    a: "Server und Datenbank stehen in der EU. Zugangsschlüssel deiner Marktplätze werden verschlüsselt gespeichert, nur für die von dir freigegebenen Zwecke genutzt und beim Trennen sofort gelöscht. Deine Daten kannst du jederzeit exportieren oder dein Konto vollständig löschen.",
  },
  {
    q: "Funktioniert es auf dem Smartphone?",
    a: "Ja. Das Dashboard ist für das Smartphone gebaut und lässt sich wie eine App auf den Home-Bildschirm legen.",
  },
];

export default async function Home() {
  const countriesLive = env.countriesLive;
  const FAQ = countriesLive ? [...BASE_FAQ, COUNTRY_FAQ] : BASE_FAQ;
  const now = new Date();
  const [deals, lots] = await Promise.all([getAnalyzedDeals(now), getAnalyzedLots(now)]);
  const categories = summarizeCategories(deals, lots);
  const hero = deals.find((d) => d.id === "aj1-chicago-reimagined") ?? deals.find((d) => d.analysis.chance === "hoch") ?? deals[0];
  const examples = [deals.find((d) => d.analysis.chance === "hoch" && d.id !== hero?.id), deals.find((d) => d.analysis.chance === "mittel"), deals.find((d) => d.analysis.chance === "niedrig")].filter(
    (d): d is NonNullable<typeof d> => Boolean(d),
  );
  const counts: Record<string, string> = {
    arbitrage: `${deals.filter((d) => d.kind !== "vorbestellung").length} Chancen im Test-Dashboard`,
    vorbestellung: `${deals.filter((d) => d.kind === "vorbestellung").length} Releases im Test-Dashboard`,
    insolvenz: `${lots.length} Beispiel-Posten im Test-Dashboard`,
    autopilot: "ab Tarif Pro",
  };

  return (
    <SiteLayout>
      <JsonLd data={graph(organizationLd(), websiteLd(), softwareLd(countriesLive), faqLd(FAQ))} />

      {/* Hero: Aussage links, Preisschild rechts */}
      <section>
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-14 px-4 pt-12 pb-24 sm:px-6 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-10 lg:pt-24 lg:pb-32">
          <div data-ab-exp="start">
            <h1 className="font-display text-[40px] leading-[1.03] sm:text-[58px] lg:text-[68px]">
              <span className="ab-start-a">Gewinne finden, bevor der Markt sie sieht.</span>
              <span className="ab-start-b">Wisse vor dem Einkauf, ob sich ein Deal lohnt.</span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-ink-2 md:text-[18px]">
              Arbitrage Radar vergleicht Händlerpreise mit den Marktpreisen auf eBay und Amazon, rechnet alle Gebühren ein und zeigt dir für jede Chance, wie
              wahrscheinlich sie sich lohnt.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/demo/" size="lg" data-ab-goal="start">
                <span className="ab-start-a">Test-Dashboard öffnen</span>
                <span className="ab-start-b">Gewinnchancen kostenlos ansehen</span>
              </LinkButton>
              <LinkButton href="/preise/" variant="secondary" size="lg">
                Tarife ansehen
              </LinkButton>
            </div>
            <p className="mt-5 text-[14px] text-muted">Ohne Anmeldung ansehen. 14 Tage Geld-zurück-Garantie, monatlich kündbar.</p>
          </div>
          {hero && (
            <PriceTag deal={hero} note="Beispiel aus dem Test-Dashboard" className="mx-auto w-full max-w-[500px] lg:rotate-[-2deg]" />
          )}
        </div>
      </section>

      <LiveCoverage className="mx-auto -mt-8 max-w-[1240px] px-4 pb-20 sm:px-6 lg:px-10" />

      {/* Funktionen */}
      <section id="funktionen" className="scroll-mt-20 border-t border-line">
        <div className="mx-auto max-w-[1240px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <h2 className="max-w-3xl font-display text-[34px] leading-[1.05] md:text-[48px]">Vier Wege zum Gewinn in einem Dashboard</h2>
          <div className="mt-14 grid gap-x-16 md:grid-cols-2">
            {FEATURES.map((f) => (
              <article key={f.title} className="border-t border-line py-8">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="text-[22px] font-bold tracking-[-0.015em] [font-stretch:110%]">{f.title}</h3>
                  <p className="text-[13px] font-medium text-muted">{counts[f.key]}</p>
                </div>
                <p className="mt-3 max-w-[46ch] text-[16px] leading-relaxed text-ink-2">{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Analyse */}
      <section id="analyse" className="scroll-mt-20 bg-canvas">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-14 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10 lg:py-32">
          <div>
            <h2 className="font-display text-[34px] leading-[1.05] md:text-[48px]">Von Rot bis Grün auf einen Blick</h2>
            <p className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-ink-2">
              Jede Chance bekommt eine Gewinnwahrscheinlichkeit in Prozent. Sie ergibt sich aus der Streuung der Verkaufspreise, dem Abverkauf, der
              Konkurrenz, dem Trend und den Kosten für Gebühren und Versand. Jede Bewertung zeigt dir auch, welche Faktoren gegen den Kauf sprechen.
            </p>
          </div>
          <div className="rounded-[var(--radius-card)] bg-white p-2 shadow-[var(--shadow-card)]">
            <ul className="divide-y divide-line">
              {examples.map((d) => (
                <li key={d.id} className="px-5 py-5">
                  <div className="mb-3 flex items-baseline justify-between gap-4">
                    <p className="truncate text-[15px] font-semibold">{d.title}</p>
                    <p className="tabular shrink-0 text-[14px] font-semibold">{signedEur(d.analysis.expectedProfit)}</p>
                  </div>
                  <ProbabilityBar probability={d.analysis.probability} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Kategorien als Liste mit echten Zahlen */}
      <section id="kategorien" className="scroll-mt-20">
        <div className="mx-auto max-w-[1240px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="max-w-2xl font-display text-[34px] leading-[1.05] md:text-[48px]">Neun Kategorien, jede mit eigener Marktlogik</h2>
            <LinkButton href="/demo/" variant="secondary">
              Alle im Test-Dashboard ansehen
            </LinkButton>
          </div>
          <ul className="mt-12 border-t border-ink">
            {categories.map((c) => (
              <li key={c.id} className="border-b border-line">
                <Link
                  href={c.id === "insolvenz" ? "/demo/insolvenzen/" : `/demo/?kategorie=${c.id}`}
                  className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-5 transition-colors hover:bg-canvas md:grid-cols-[minmax(0,15rem)_1fr_auto_auto] md:px-3"
                >
                  <span className="text-[19px] font-bold tracking-[-0.01em] [font-stretch:108%]">{c.name}</span>
                  <span className="col-span-2 row-start-2 text-[15px] text-ink-2 md:col-span-1 md:row-start-auto">{c.claim}</span>
                  <span className="tabular col-start-2 row-start-1 text-[14px] text-muted md:col-start-auto md:row-start-auto">
                    {c.count} {c.count === 1 ? "Chance" : "Chancen"}
                  </span>
                  <IconArrowUpRight size={18} className="hidden text-muted transition-colors group-hover:text-ink md:block" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Ablauf: echte Reihenfolge, daher nummeriert */}
      <section id="ablauf" className="scroll-mt-20 border-t border-line">
        <div className="mx-auto max-w-[1240px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <h2 className="max-w-3xl font-display text-[34px] leading-[1.05] md:text-[48px]">So kommt eine Chance auf deinen Bildschirm</h2>
          <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-10">
            {STEPS.map((s) => (
              <li key={s.n}>
                <span className="tabular grid size-11 place-items-center rounded-full bg-tag font-display text-[20px]">{s.n}</span>
                <h3 className="mt-5 text-[22px] font-bold tracking-[-0.015em] [font-stretch:110%]">{s.title}</h3>
                <p className="mt-3 max-w-[38ch] text-[16px] leading-relaxed text-ink-2">{s.text}</p>
              </li>
            ))}
          </ol>
          <dl className="mt-20 grid gap-8 border-t border-line pt-10 md:grid-cols-3">
            {[
              ["Keine automatischen Käufe", "Gekauft wird nur, wenn du selbst beim Händler bestellst, auch mit Autopilot."],
              ["Break-even im Blick", "Jede Chance zeigt den Preis, ab dem du nach Gebühren und Versand im Plus bist."],
              ["Nachvollziehbar", "Jede Bewertung zeigt die Faktoren, die für und gegen den Kauf sprechen."],
            ].map(([t, d]) => (
              <div key={t}>
                <dt className="font-semibold">{t}</dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Preise */}
      <section id="preise" className="scroll-mt-20 bg-canvas">
        <div className="mx-auto max-w-[1240px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <h2 className="max-w-3xl font-display text-[34px] leading-[1.05] md:text-[48px]">Ein guter Deal zahlt den Monat</h2>
          <div className="mt-12">
            <PricingCards countriesLive={countriesLive} />
          </div>
          <p className="mt-8">
            <Link href="/preise/" className="text-[15px] font-semibold text-ink underline decoration-line-strong decoration-2 hover:decoration-ink">
              Alle Funktionen und Erweiterungen vergleichen
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16 lg:px-10 lg:py-32">
          <h2 className="font-display text-[34px] leading-[1.05] md:text-[48px]">Häufige Fragen</h2>
          <div className="divide-y divide-line border-y border-line">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-md text-[18px] leading-none ring-1 ring-line-strong transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-[62ch] text-[16px] leading-relaxed text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Abschluss: gelbe Fläche */}
      <section className="bg-tag">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-4 py-20 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-10 lg:py-24">
          <div>
            <h2 className="max-w-2xl font-display text-[38px] leading-[1.02] md:text-[56px]">Der nächste Deal läuft schon.</h2>
            <p className="mt-4 max-w-[34rem] text-[17px] text-tag-ink">Sieh dir im Test-Dashboard an, wie Arbitrage Radar Chancen bewertet, und starte, wenn du überzeugt bist.</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <LinkButton href="/demo/" size="lg">
              Test-Dashboard öffnen
            </LinkButton>
            <LinkButton href="/preise/" variant="secondary" size="lg" className="!ring-ink">
              Tarif wählen
            </LinkButton>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
