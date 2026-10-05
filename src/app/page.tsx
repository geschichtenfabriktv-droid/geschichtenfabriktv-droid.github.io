import Link from "next/link";
import { Reveal } from "@/components/site/reveal";
import { PricingCards } from "@/components/site/pricing-cards";
import { SiteLayout } from "@/components/site/site-layout";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { IconArrowRight, IconArrowUpRight, IconBolt, IconCalendar, IconCheck, IconGavel, IconRadar, IconShield } from "@/components/ui/icons";
import { ProbabilityBar } from "@/components/ui/probability-bar";
import { getAnalyzedDeals, getAnalyzedLots, summarizeCategories } from "@/lib/data/repository";
import { eur, signedEur } from "@/lib/format";

const SOURCES = ["eBay", "Amazon", "StockX", "Cardmarket", "Kleinanzeigen", "Vinted", "Händler-Feeds", "Keepa", "Insolvenzbekanntmachungen", "Verwerter-Auktionen"];

const FEATURES = [
  {
    icon: IconRadar,
    title: "Arbitrage-Scanner",
    text: "Vergleicht laufend Einkaufspreise mit realen Verkaufspreisen auf allen großen Marktplätzen, inklusive Gebühren und Versand.",
  },
  {
    icon: IconCalendar,
    title: "Vorbestell-Radar",
    text: "Findet limitierte Releases, die heute zum Normalpreis vorbestellbar sind und auf dem Zweitmarkt zum doppelten Preis gehandelt werden.",
  },
  {
    icon: IconGavel,
    title: "Insolvenz-Finder",
    text: "Liest Insolvenzverfahren und Verwerter-Auktionen und berechnet das Maximalgebot, bis zu dem sich eine Masse lohnt.",
  },
  {
    icon: IconBolt,
    title: "Autopilot",
    text: "Kauft auf Knopfdruck und stellt die Ware direkt mit Preisautomatik auf den passenden Marktplätzen ein.",
  },
];

const STEPS = [
  { n: "01", title: "Scannen", text: "Tausende Angebote, Vorverkäufe und Verfahren werden fortlaufend erfasst und Produkten eindeutig zugeordnet." },
  { n: "02", title: "Bewerten", text: "Für jede Chance entsteht eine Marktanalyse: Preisverteilung, Nachfrage, Konkurrenz, Trend und alle Gebühren." },
  { n: "03", title: "Handeln", text: "Ein Klick kauft, ein zweiter stellt ein. Der Autopilot erledigt beides und hält den Preis über dem Break-even." },
];

const FAQ = [
  {
    q: "Wie wird die Gewinnwahrscheinlichkeit berechnet?",
    a: "Die erzielbaren Verkaufspreise werden als Verteilung um den Marktmedian modelliert und um den Trend bis zum voraussichtlichen Verkauf korrigiert. Daraus ergibt sich die Wahrscheinlichkeit, nach allen Gebühren mindestens 5 % Gewinn zu erzielen, gewichtet mit der Chance, innerhalb von 30 Tagen einen Käufer zu finden.",
  },
  {
    q: "Wird wirklich automatisch gekauft und verkauft?",
    a: "Du verbindest dein eigenes eBay- oder Amazon-Verkäuferkonto über die offizielle Freigabe des Marktplatzes, ohne uns dein Passwort zu geben. Danach stellt Arbitrage Radar Angebote in deinem Namen ein und hält den Preis über deinem Break-even. Eingekauft wird mit einem Klick beim Händler; jede Aktion löst du selbst aus oder gibst sie für den Autopiloten frei.",
  },
  {
    q: "Was sind Insolvenzmassen?",
    a: "Vermögen insolventer Unternehmen, das der Insolvenzverwalter verwertet: Warenlager, Maschinen, Fahrzeuge, IT oder Markenrechte. Häufig wird es deutlich unter dem Gutachterwert versteigert.",
  },
  {
    q: "Was kostet Arbitrage Radar und wie kündige ich?",
    a: "Ab 29 € im Monat oder 24,17 € im Monat bei jährlicher Zahlung. Du kannst jederzeit zum Ende der Laufzeit kündigen, im Kundenkonto oder über „Verträge hier kündigen“ im Footer. In den ersten 14 Tagen gibt es dein Geld ohne Angabe von Gründen zurück.",
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
  const now = new Date();
  const [deals, lots] = await Promise.all([getAnalyzedDeals(now), getAnalyzedLots(now)]);
  const categories = summarizeCategories(deals, lots);
  const hero = deals.find((d) => d.id === "aj1-chicago-reimagined") ?? deals[0];
  const preorder = deals.find((d) => d.kind === "vorbestellung" && d.analysis.doubleUp);
  const examples = [deals.find((d) => d.analysis.chance === "hoch"), deals.find((d) => d.analysis.chance === "mittel"), deals.find((d) => d.analysis.chance === "niedrig")].filter(
    (d): d is NonNullable<typeof d> => Boolean(d),
  );

  return (
    <SiteLayout>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-14 px-4 pt-10 pb-32 sm:px-6 md:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10 lg:px-10 lg:pt-20 lg:pb-32">
          <div className="animate-rise">
            <Badge tone="outline" className="!px-3 !py-1.5">
              <span className="size-1.5 rounded-full bg-good animate-pulse-dot" aria-hidden /> {deals.length + lots.length} Chancen gerade im Scan
            </Badge>
            <h1 className="mt-6 font-display text-[54px] leading-[0.95] tracking-[-0.02em] sm:text-[76px] lg:text-[104px]">
              Gewinne finden, <span className="italic text-muted">bevor der Markt sie sieht.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-2 md:text-lg">
              Arbitrage Radar erkennt Preisgefälle, Vorbestell-Chancen und Insolvenzmassen, analysiert den Markt und zeigt dir für jede Gelegenheit, wie
              wahrscheinlich sie sich lohnt. Kaufen und Einstellen auf Knopfdruck.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/demo/" size="lg">
                Kostenlos ansehen <IconArrowRight size={17} />
              </LinkButton>
              <LinkButton href="/preise/" variant="secondary" size="lg">
                Tarife ansehen
              </LinkButton>
            </div>
            <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
              <span className="inline-flex items-center gap-1.5"><IconCheck size={14} className="text-good" /> Test-Dashboard ohne Anmeldung</span>
              <span className="inline-flex items-center gap-1.5"><IconCheck size={14} className="text-good" /> 14 Tage Geld zurück</span>
              <span className="inline-flex items-center gap-1.5"><IconCheck size={14} className="text-good" /> Monatlich kündbar</span>
            </p>
          </div>

          {/* Produktbühne */}
          {hero && (
            <div className="relative mx-auto w-full max-w-[460px] animate-rise [animation-delay:150ms]">
              <div aria-hidden className="absolute -inset-10 -z-10 rounded-[48px] bg-[radial-gradient(60%_60%_at_60%_40%,#f1f1ee_0%,transparent_70%)]" />
              <div className="rounded-[28px] bg-white p-6 shadow-[var(--shadow-float)] ring-1 ring-line">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Sneaker & Mode</p>
                </div>
                <p className="mt-3 text-xl font-semibold leading-snug tracking-tight">{hero.title}</p>
                <p className="mt-1 text-[13px] text-muted">
                  {hero.source.platform} → {hero.target.platform}
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-4">
                  {[
                    ["Einkauf", eur(hero.analysis.totalCost)],
                    ["Verkauf", eur(hero.analysis.recommendedPrice)],
                    ["Gewinn", signedEur(hero.analysis.expectedProfit)],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-[11px] text-muted">{k}</p>
                      <p className="tabular mt-0.5 font-semibold">{v}</p>
                    </div>
                  ))}
                </div>
                <ProbabilityBar probability={hero.analysis.probability} size="md" className="mt-5" />
                <div className="mt-6 flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-medium text-white">
                  <IconBolt size={16} /> Autopilot: kaufen & einstellen
                </div>
              </div>

              <div className="absolute -top-10 -right-2 rounded-2xl bg-white px-4 py-3 shadow-[var(--shadow-float)] ring-1 ring-line sm:-right-10">
                <p className="flex items-center gap-2 text-[13px] font-semibold">
                  <span className="grid size-6 place-items-center rounded-full bg-good-soft text-good">
                    <IconCheck size={14} />
                  </span>
                  Auf {hero.target.platform} eingestellt
                </p>
                <p className="mt-0.5 pl-8 text-[11px] text-muted">Preisautomatik aktiv</p>
              </div>

              {preorder && (
                <div className="absolute -bottom-24 -left-2 w-[230px] rounded-2xl bg-ink p-4 text-white shadow-[var(--shadow-float)] sm:-left-12">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">Vorbestellung · 2× Preis</p>
                  <p className="mt-1.5 line-clamp-2 text-[13px] font-medium leading-snug">{preorder.title.replace(" (Vorbestellung)", "")}</p>
                  <p className="tabular mt-2 text-[13px] text-white/70">
                    {eur(preorder.source.price)} → <span className="font-semibold text-white">{eur(preorder.market.medianPrice)}</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Quellen-Laufband */}
      <section aria-label="Angebundene Quellen" className="border-y border-line bg-canvas py-5">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-[13px] font-medium text-muted sm:px-6 lg:px-10">
          <span className="text-ink">Scannt</span>
          {SOURCES.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </section>

      {/* Funktionen */}
      <section id="funktionen" className="scroll-mt-20">
        <div className="mx-auto max-w-[1320px] px-4 py-24 sm:px-6 lg:px-10 lg:py-36">
          <Reveal>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">Funktionen</p>
            <h2 className="mt-4 max-w-3xl font-display text-[44px] leading-[1] tracking-tight md:text-[68px]">
              Vier Wege zum Gewinn. <span className="italic text-muted">Ein Dashboard.</span>
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] bg-line ring-1 ring-line md:grid-cols-2">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 80} className="bg-white">
                <article className="flex h-full flex-col p-8 md:p-10">
                  <span className="grid size-12 place-items-center rounded-2xl bg-canvas">
                    <f.icon size={22} />
                  </span>
                  <h3 className="mt-8 text-2xl font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-2">{f.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Analyse */}
      <section id="analyse" className="scroll-mt-20 bg-canvas">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-14 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10 lg:py-36">
          <Reveal>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">Marktanalyse</p>
            <h2 className="mt-4 font-display text-[44px] leading-[1] tracking-tight md:text-[64px]">
              Von Rot bis Grün. <span className="italic text-muted">Auf einen Blick.</span>
            </h2>
            <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-ink-2">
              Jede Chance bekommt eine Gewinnwahrscheinlichkeit in Prozent. Dahinter stehen echte Marktmechanik und keine Bauchgefühle: wie breit die
              Verkaufspreise streuen, wie schnell Ware abverkauft wird, wie viel Konkurrenz es gibt, wohin der Trend zeigt und was Gebühren und Versand
              kosten.
            </p>
            <ul className="mt-8 grid gap-3 text-[15px] sm:grid-cols-2">
              {["Preisverteilung & Trend", "Nachfrage & Konkurrenz", "Gebühren & Versand", "Break-even & Zielpreis"].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <IconCheck size={16} className="text-good" /> {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <div className="space-y-4 rounded-[28px] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line md:p-8">
              {examples.map((d) => (
                <div key={d.id} className="rounded-2xl p-4 ring-1 ring-line">
                  <div className="mb-3 flex items-baseline justify-between gap-4">
                    <p className="truncate text-[15px] font-semibold">{d.title}</p>
                    <p className="tabular shrink-0 text-[13px] text-muted">{signedEur(d.analysis.expectedProfit)}</p>
                  </div>
                  <ProbabilityBar probability={d.analysis.probability} />
                </div>
              ))}
              <div className="flex items-center gap-3 pt-2 text-[12px] text-muted">
                <span>0 %</span>
                <span className="h-1.5 flex-1 rounded-full [background-image:var(--probability-gradient)]" aria-hidden />
                <span>100 %</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Kategorien */}
      <section id="kategorien" className="scroll-mt-20">
        <div className="mx-auto max-w-[1320px] px-4 py-24 sm:px-6 lg:px-10 lg:py-36">
          <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">Kategorien</p>
              <h2 className="mt-4 max-w-2xl font-display text-[44px] leading-[1] tracking-tight md:text-[64px]">
                Sortiert, wie du denkst. <span className="italic text-muted">Ein Klick genügt.</span>
              </h2>
            </div>
            <LinkButton href="/demo/" variant="secondary">
              Im Test-Dashboard ansehen
            </LinkButton>
          </Reveal>
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <Reveal key={c.id} delay={(i % 3) * 70}>
                <Link
                  href={c.id === "insolvenz" ? "/demo/insolvenzen/" : `/demo/?kategorie=${c.id}`}
                  className={`group flex h-full flex-col rounded-[24px] p-6 ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-float)] ${
                    c.id === "insolvenz" ? "bg-ink text-white ring-ink" : "bg-white ring-line"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`tabular text-[12px] font-semibold ${c.id === "insolvenz" ? "text-white/50" : "text-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <IconArrowUpRight size={18} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <h3 className="mt-10 font-display text-[32px] leading-none tracking-tight">{c.name}</h3>
                  <p className={`mt-3 text-[14px] leading-snug ${c.id === "insolvenz" ? "text-white/65" : "text-ink-2"}`}>{c.claim}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ablauf */}
      <section id="ablauf" className="scroll-mt-20 border-t border-line">
        <div className="mx-auto max-w-[1320px] px-4 py-24 sm:px-6 lg:px-10 lg:py-36">
          <Reveal>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">Ablauf</p>
            <h2 className="mt-4 max-w-3xl font-display text-[44px] leading-[1] tracking-tight md:text-[64px]">
              Scannen. Bewerten. <span className="italic text-muted">Handeln.</span>
            </h2>
          </Reveal>
          <ol className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <li className="border-t border-ink pt-6">
                  <span className="tabular font-display text-[56px] leading-none text-muted">{s.n}</span>
                  <h3 className="mt-6 text-2xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{s.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Sicherheit */}
      <section className="bg-canvas">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-8 px-4 py-20 sm:px-6 md:grid-cols-3 lg:px-10">
          {[
            ["Budget-Grenzen", "Der Autopilot kauft nie über dein freies Budget hinaus."],
            ["Break-even-Schutz", "Die Preisautomatik geht nie unter den Punkt, an dem du Geld verlierst."],
            ["Volle Transparenz", "Jede Bewertung zeigt die Faktoren, die für und gegen den Kauf sprechen."],
          ].map(([t, d]) => (
            <Reveal key={t}>
              <div className="flex gap-4">
                <IconShield size={22} className="mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold">{t}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink-2">{d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Preise */}
      <section id="preise" className="scroll-mt-20 border-t border-line bg-canvas">
        <div className="mx-auto max-w-[1320px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <Reveal className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">Preise</p>
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-[44px] leading-[1] tracking-tight md:text-[64px]">
              Ein guter Deal <span className="italic text-muted">zahlt den Monat.</span>
            </h2>
          </Reveal>
          <div className="mt-12">
            <PricingCards />
          </div>
          <p className="mt-8 text-center">
            <Link href="/preise/" className="text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
              Alle Funktionen und Add-ons vergleichen
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-36">
          <Reveal>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">FAQ</p>
            <h2 className="mt-4 font-display text-[44px] leading-[1] tracking-tight md:text-[64px]">Gut zu wissen.</h2>
          </Reveal>
          <div className="divide-y divide-line border-y border-line">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold tracking-tight [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full ring-1 ring-line transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Abschluss */}
      <section className="px-4 pb-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px] overflow-hidden rounded-[32px] bg-ink px-6 py-20 text-center text-white md:py-28">
          <h2 className="mx-auto max-w-4xl font-display text-[48px] leading-[0.98] tracking-tight md:text-[88px]">
            Der nächste Deal <span className="italic text-white/50">läuft schon.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[16px] text-white/65">Sieh dir kostenlos an, was der Scanner heute gefunden hat, und starte, wenn du überzeugt bist.</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <LinkButton href="/demo/" variant="inverse" size="lg">
              Test-Dashboard öffnen <IconArrowRight size={17} />
            </LinkButton>
            <LinkButton href="/preise/" size="lg" className="!bg-white/10 hover:!bg-white/20">
              Tarif wählen
            </LinkButton>
          </div>
        </div>
      </section>

    </SiteLayout>
  );
}
