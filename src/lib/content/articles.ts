import type { Article } from "./types";

export const ARTICLES: Article[] = [
  // ───────────────────────────────────────────────────────────── 1
  {
    slug: "online-arbitrage-anleitung",
    title: "Online Arbitrage Anleitung 2026: Schritt für Schritt",
    description:
      "Online Arbitrage in Deutschland: So findest du Preisdifferenzen, prüfst die Nachfrage, rechnest Gebühren ein und verkaufst mit Gewinn. Mit Rechenbeispiel.",
    h1: "Online Arbitrage: Die Schritt-für-Schritt-Anleitung für Deutschland",
    intro:
      "Online Arbitrage bedeutet, ein Produkt bei einem Onlinehändler günstiger einzukaufen, als es auf einem Marktplatz wie eBay oder Amazon gerade verkauft wird, und die Differenz nach allen Kosten als Gewinn mitzunehmen. Entscheidend ist nicht der Preisunterschied allein, sondern ob nach Gebühren, Versand und Steuern noch genug übrig bleibt und ob sich der Artikel schnell genug verkauft. Diese Anleitung zeigt dir den kompletten Ablauf vom ersten Fund bis zum skalierbaren Prozess.",
    keywords: [
      "online arbitrage",
      "online arbitrage anleitung",
      "arbitrage deutschland",
      "retail arbitrage",
      "arbitrage ebay amazon",
      "produkte günstig kaufen teurer verkaufen",
    ],
    published: "2026-10-05",
    updated: "2026-10-05",
    readingMinutes: 7,
    sections: [
      { type: "h2", text: "Was ist Online Arbitrage – und wie unterscheidet sie sich von Retail Arbitrage?" },
      {
        type: "p",
        text: "Arbitrage nutzt Preisunterschiede für dasselbe Produkt auf verschiedenen Märkten. Bei **Online Arbitrage** kaufst du bei Onlineshops ein – etwa im Abverkauf, mit Gutscheincode oder bei einem Händler, der seinen Preis noch nicht angepasst hat – und verkaufst auf einem Marktplatz mit höherem Preisniveau. Bei **Retail Arbitrage** kommt die Ware aus dem stationären Handel: Restposten, Filialabverkäufe, regionale Aktionen.",
      },
      {
        type: "p",
        text: "Beide Varianten funktionieren nach derselben Logik. Online Arbitrage ist leichter zu skalieren, weil du hunderte Shops vom Schreibtisch aus vergleichen kannst; Retail Arbitrage bietet dafür oft Funde, die online niemand sieht. Wichtig: Es handelt sich um Handel mit Gewinnerzielungsabsicht. Wer das regelmäßig macht, ist in aller Regel gewerblich tätig – mehr dazu im Ratgeber [Reselling: Gewerbe und Steuern](/ratgeber/reselling-gewerbe-steuern/).",
      },
      {
        type: "table",
        head: ["Merkmal", "Online Arbitrage", "Retail Arbitrage"],
        rows: [
          ["Einkaufsquelle", "Onlineshops, Händler-Websites", "Filialen, Outlets, Restpostenmärkte"],
          ["Zeitaufwand pro Fund", "gering, gut automatisierbar", "hoch (Fahrten, Suche vor Ort)"],
          ["Konkurrenz", "höher, da Preise öffentlich sichtbar", "geringer, regional begrenzt"],
          ["Skalierbarkeit", "hoch", "begrenzt durch Zeit und Ort"],
          ["Typisches Risiko", "Preis wird schnell angepasst", "Ware nicht mehr vorrätig"],
        ],
      },
      { type: "h2", text: "Schritt 1: Produkte finden (Sourcing)" },
      {
        type: "p",
        text: "Gute Arbitrage-Produkte haben drei Eigenschaften: eine eindeutige Identifikation (EAN, Modellnummer), eine stabile Nachfrage auf dem Zielmarktplatz und einen Einkaufspreis, der deutlich unter dem aktuellen Marktpreis liegt. Typische Quellen sind:",
      },
      {
        type: "ul",
        items: [
          "**Abverkäufe und Sale-Bereiche** großer Elektronik-, Spielwaren- und Sporthändler",
          "**Preisfehler und verspätete Preisanpassungen**, wenn ein Händler einen Artikel noch zum alten Preis führt",
          "**Gutschein- und Cashback-Aktionen**, die den effektiven Einkaufspreis senken",
          "**Auslaufmodelle**, deren Nachfolger teurer ist, sodass das alte Modell gefragt bleibt",
          "**Vorbestellungen** limitierter Produkte (siehe [Vorbestellungs-Arbitrage](/vorbestellung-arbitrage/))",
        ],
      },
      {
        type: "tip",
        title: "Arbeite mit EAN statt Produktnamen",
        text: "Vergleiche immer über die EAN oder exakte Modellnummer. Farbvarianten, Bundles oder Länderversionen haben oft andere Marktpreise – ein falscher Abgleich ist der häufigste Anfängerfehler.",
      },
      { type: "h2", text: "Schritt 2: Nachfrage prüfen" },
      {
        type: "p",
        text: "Ein hoher Angebotspreis auf eBay sagt wenig. Entscheidend ist, **zu welchem Preis tatsächlich verkauft wird** und **wie viele Einheiten** in einem Zeitraum abgehen. Prüfe deshalb verkaufte Angebote statt aktiver Angebote, die Anzahl der Konkurrenzangebote und den Preisverlauf der letzten Wochen.",
      },
      {
        type: "p",
        text: "Eine hilfreiche Kennzahl ist die **Abverkaufsquote (Sell-Through)**: verkaufte Einheiten im Verhältnis zu angebotenen Einheiten in einem Zeitraum, etwa 30 Tagen. Liegt sie niedrig, konkurrierst du mit vielen Anbietern um wenige Käufer – und landest schnell in einem Preiskampf.",
      },
      { type: "h2", text: "Schritt 3: Gewinn und Break-even kalkulieren" },
      {
        type: "p",
        text: "Jetzt kommt der wichtigste Schritt. Ziehe vom erwarteten Verkaufspreis alle Kosten ab: Einkaufspreis, Marktplatzgebühren, Versand, Verpackung und – je nach Steuerstatus – die Umsatzsteuer. Wie du das sauber machst, steht ausführlich im Ratgeber [Reselling-Gewinn berechnen](/ratgeber/reselling-gewinn-berechnen/).",
      },
      { type: "h3", text: "Rechenbeispiel" },
      {
        type: "p",
        text: "Ein Kopfhörer kostet im Onlineshop 59,99 € (versandkostenfrei). Auf eBay wird er laut verkaufter Angebote für etwa 99 € inklusive Versand verkauft. Du bist Kleinunternehmer, weist also keine Umsatzsteuer aus. **Beispielrechnung mit 11 % + 0,35 € eBay-Gebühren** (die tatsächlichen Sätze hängen von Kategorie und Konditionen ab, siehe [eBay-Gebühren für Reseller](/ratgeber/ebay-gebuehren-reselling/)):",
      },
      {
        type: "table",
        head: ["Position", "Betrag"],
        rows: [
          ["Verkaufspreis inkl. Versand", "99,00 €"],
          ["eBay-Verkaufsprovision (Beispiel 11 %)", "− 10,89 €"],
          ["Fixgebühr pro Bestellung (Beispiel)", "− 0,35 €"],
          ["Versandkosten", "− 5,49 €"],
          ["Verpackung", "− 0,80 €"],
          ["Einkaufspreis", "− 59,99 €"],
          ["**Gewinn vor Einkommensteuer**", "**21,48 €**"],
        ],
      },
      {
        type: "p",
        text: "Das entspricht einer Marge von rund 21,7 % auf den Verkaufspreis und einem ROI von rund 35,8 % auf den Einkauf. Sinkt der Marktpreis bis zum Verkauf um 15 €, bleiben nur noch gut 8 € – ein guter Grund, nur Deals mit Puffer zu kaufen.",
      },
      { type: "h2", text: "Schritt 4: Einkaufen und Ware prüfen" },
      {
        type: "ol",
        items: [
          "Kaufe beim ersten Mal kleine Stückzahlen, bis du weißt, wie schnell der Artikel wirklich verkauft.",
          "Bezahle per Kreditkarte oder PayPal, um Käuferschutz und Rechnungsnachweis zu haben.",
          "Lass dir eine Rechnung auf deinen Gewerbenamen ausstellen – wichtig für Buchhaltung und Vorsteuer.",
          "Prüfe die Ware bei Ankunft auf Vollständigkeit und Originalverpackung, bevor du sie einstellst.",
        ],
      },
      { type: "h2", text: "Schritt 5: Angebot einstellen" },
      {
        type: "p",
        text: "Ein gutes Angebot hat einen klaren Titel mit Marke, Modell und Zustand, eigene Fotos, die korrekte EAN und einen Preis, der sich an verkauften Angeboten orientiert. Als gewerblicher Verkäufer brauchst du zusätzlich Impressum, Widerrufsbelehrung und AGB-konforme Angaben. Wer auf eBay und Amazon parallel verkauft, findet auf der Seite [Amazon-eBay-Arbitrage](/amazon-ebay-arbitrage/) die typischen Unterschiede der beiden Kanäle.",
      },
      { type: "h2", text: "Schritt 6: Skalieren" },
      {
        type: "p",
        text: "Sobald der Prozess funktioniert, ist Zeit der Engpass. Manuell vergleichst du vielleicht ein paar Dutzend Produkte am Tag. Skalierung bedeutet: Quellen automatisiert überwachen, Kalkulation standardisieren, Angebote per Vorlage erstellen und Preise regelmäßig anpassen. Hier setzt eine [Arbitrage-Software](/arbitrage-software/) an.",
      },
      {
        type: "ul",
        items: [
          "**Feste Mindestkriterien** definieren, z. B. mindestens 5 € oder 5 % Gewinn pro Artikel",
          "**Kapitalumschlag** im Blick behalten: Ein Artikel mit 10 € Gewinn, der in 5 Tagen verkauft, ist oft besser als einer mit 25 €, der drei Monate liegt",
          "**Kategorien fokussieren**, in denen du Produkte und Fälschungsmerkmale kennst",
          "**Buchhaltung von Anfang an** sauber führen: Einkaufsbelege, Gebührenabrechnungen, Versandkosten",
        ],
      },
      { type: "h2", text: "Wie viel Zeit und Kapital du einplanen solltest" },
      {
        type: "p",
        text: "Zwischen Einkauf und Auszahlung vergehen bei Online Arbitrage oft mehrere Wochen: Lieferzeit zu dir, Einstellen, Verkaufsdauer, Versand zum Käufer und die Auszahlungsfrist des Marktplatzes. In dieser Zeit ist dein Geld gebunden. Plane deshalb so, dass du auch dann handlungsfähig bleibst, wenn einzelne Artikel deutlich länger liegen als erwartet.",
      },
      {
        type: "p",
        text: "Zeit kostet vor allem die Suche. Wer manuell sourct, verbringt den größten Teil seiner Arbeitszeit mit Vergleichen, die zu keinem Kauf führen. Genau dieser Teil lässt sich am besten automatisieren – Einkauf, Qualitätsprüfung und Kundenservice bleiben dagegen deine Aufgabe.",
      },
      { type: "h2", text: "Die häufigsten Fehler bei Online Arbitrage" },
      {
        type: "table",
        head: ["Fehler", "Folge", "Besser"],
        rows: [
          ["Aktive statt verkaufte Preise vergleichen", "zu hohe Verkaufserwartung", "nur verkaufte Angebote werten"],
          ["Gebühren auf Versand vergessen", "Marge schrumpft unbemerkt", "Provision auf Gesamtbetrag rechnen"],
          ["Große Stückzahl beim ersten Kauf", "Kapital gebunden, Preisverfall", "klein testen, dann nachkaufen"],
          ["Markenrechte ignorieren", "Angebotssperre, Abmahnung", "Markenbeschränkungen vorab prüfen"],
          ["Steuern nicht einplanen", "Nachzahlungen", "Gewerbe anmelden, Rücklagen bilden"],
        ],
      },
      {
        type: "tip",
        title: "Rechne mit einem Sicherheitsabschlag",
        text: "Kalkuliere mit einem Verkaufspreis leicht unter dem aktuellen Durchschnitt. Wenn ein Deal nur bei Bestpreis funktioniert, ist er zu knapp.",
      },
      {
        type: "p",
        text: "Willst du sehen, wie das in der Praxis aussieht? Im kostenlosen [Test-Dashboard](/demo/) zeigt Arbitrage Radar ohne Anmeldung anhand von Beispieldaten die drei besten Chancen pro Kategorie – inklusive Break-even und Gewinnwahrscheinlichkeit. Die Tarife findest du unter [Preise](/preise/).",
      },
      {
        type: "cta",
        title: "Preisdifferenzen finden, ohne stundenlang zu vergleichen",
        text: "Arbitrage Radar vergleicht Händlerpreise in 9 Kategorien mit den Marktpreisen auf eBay und Amazon, rechnet den Break-even inklusive Gebühren und Versand und zeigt dir die Gewinnwahrscheinlichkeit als Balken von Rot bis Grün.",
      },
    ],
    faq: [
      {
        q: "Ist Online Arbitrage in Deutschland legal?",
        a: "Ja, der Weiterverkauf regulär gekaufter Ware ist grundsätzlich erlaubt. Du musst aber Markenrechte, Plattformregeln und steuerliche Pflichten beachten. Wer regelmäßig mit Gewinnabsicht einkauft und verkauft, braucht in aller Regel ein Gewerbe.",
      },
      {
        q: "Wie viel Startkapital brauche ich für Online Arbitrage?",
        a: "Du kannst mit wenigen hundert Euro starten, wenn du mit kleinen Stückzahlen testest. Wichtiger als die Höhe ist, dass du das Geld einige Wochen entbehren kannst, bis die Ware verkauft und ausgezahlt ist.",
      },
      {
        q: "Was ist der Unterschied zwischen Online Arbitrage und Dropshipping?",
        a: "Bei Online Arbitrage kaufst du die Ware selbst ein, hast sie auf Lager und versendest sie. Beim Dropshipping liefert der Lieferant direkt an deinen Kunden. Viele Marktplätze schränken Dropshipping über andere Händler ein, während Arbitrage mit eigenem Lager in der Regel zulässig ist.",
      },
      {
        q: "Wie viel Gewinn ist bei Online Arbitrage realistisch?",
        a: "Das hängt stark von Kategorie, Kapital und Zeiteinsatz ab, verlässliche Durchschnittswerte gibt es nicht. Viele Händler setzen sich eine Mindestgrenze pro Artikel, etwa 5 € oder 5 % Gewinn nach allen Kosten, und achten zusätzlich auf eine schnelle Verkaufsdauer.",
      },
      {
        q: "Welche Produkte eignen sich für Anfänger?",
        a: "Gut geeignet sind eindeutig identifizierbare Markenprodukte mit stabiler Nachfrage, etwa Elektronik-Zubehör, Spielwaren oder Haushaltsgeräte. Meiden solltest du anfangs fälschungsgefährdete Luxusartikel und Kategorien mit Markenbeschränkungen.",
      },
    ],
    related: ["arbitrage-software", "amazon-ebay-arbitrage", "reselling-tool"],
  },

  // ───────────────────────────────────────────────────────────── 2
  {
    slug: "reselling-gewerbe-steuern",
    title: "Reselling Gewerbe & Steuern 2026: Was du wissen musst",
    description:
      "Reselling Gewerbe anmelden, Kleinunternehmer bis 25.000 €, DAC7-Meldung ab 30 Verkäufen: Welche Steuern beim Weiterverkauf auf eBay und Amazon anfallen.",
    h1: "Reselling, Gewerbe und Steuern: Der Überblick für 2026",
    intro:
      "Wer Ware gezielt einkauft, um sie mit Gewinn weiterzuverkaufen, ist in aller Regel gewerblich tätig und muss ein Gewerbe anmelden – unabhängig davon, wie klein der Umsatz ist. Gewinne unterliegen der Einkommensteuer; Umsatzsteuer fällt an, sofern du nicht die Kleinunternehmerregelung nutzt (Vorjahresumsatz bis 25.000 €). Der private Verkauf eigener gebrauchter Sachen bleibt dagegen meist steuerfrei.",
    keywords: [
      "reselling gewerbe anmelden",
      "reselling steuern",
      "ebay verkäufe finanzamt",
      "kleinunternehmer reselling",
      "dac7 ebay",
      "gewerbe anmelden ebay",
    ],
    published: "2026-10-05",
    updated: "2026-10-05",
    readingMinutes: 7,
    sections: [
      {
        type: "tip",
        title: "Wichtiger Hinweis",
        text: "Dieser Ratgeber gibt einen allgemeinen Überblick über die Rechtslage in Deutschland (Stand 2026) und ersetzt keine Steuerberatung. Deine individuelle Situation solltest du mit einem Steuerberater oder einer Steuerberaterin klären.",
      },
      { type: "h2", text: "Privatverkauf oder Gewerbe? Die entscheidende Abgrenzung" },
      {
        type: "p",
        text: "Ein Gewerbe liegt vor, wenn eine Tätigkeit **selbstständig**, **nachhaltig** (also auf Wiederholung angelegt) und mit **Gewinnerzielungsabsicht** ausgeübt wird. Beim Reselling ist vor allem die Absicht beim Einkauf entscheidend: Kaufst du etwas, um es weiterzuverkaufen, spricht das klar für eine gewerbliche Tätigkeit. Verkaufst du dagegen deinen alten Fernseher oder Kleidung aus dem eigenen Schrank, ist das typischerweise privat.",
      },
      {
        type: "table",
        head: ["Situation", "Typische Einordnung"],
        rows: [
          ["Eigene gebrauchte Kleidung, Möbel, Elektronik verkaufen", "privat, meist steuerfrei"],
          ["Sammlung auflösen, die über Jahre privat aufgebaut wurde", "meist privat, Einzelfall prüfen"],
          ["Restposten oder Sale-Ware einkaufen und auf eBay verkaufen", "gewerblich"],
          ["Limitierte Sneaker oder Konsolen zum Weiterverkauf kaufen", "in der Regel gewerblich"],
          ["Insolvenzmasse ersteigern und weiterverkaufen", "gewerblich"],
        ],
      },
      {
        type: "p",
        text: "Indizien, die das Finanzamt bei der Abgrenzung heranzieht, sind unter anderem die Anzahl der Verkäufe, gleichartige Neuware in größeren Mengen, An- und Verkauf in kurzem Abstand sowie ein professioneller Auftritt. Eine feste Umsatz- oder Stückzahlgrenze, unterhalb der du automatisch privat bist, gibt es nicht.",
      },
      { type: "h2", text: "Was das Finanzamt über deine eBay-Verkäufe erfährt (DAC7)" },
      {
        type: "p",
        text: "Seit 2023 gilt in Deutschland das **Plattformen-Steuertransparenzgesetz** (Umsetzung der EU-Richtlinie DAC7). Online-Marktplätze wie eBay, Amazon, Vinted oder Kleinanzeigen-Plattformen mit Bezahlfunktion melden Verkäufer an das Bundeszentralamt für Steuern, wenn sie im Kalenderjahr **mindestens 30 Verkäufe** oder **mindestens 2.000 € Umsatz** erreichen. Die Daten werden an die zuständigen Finanzämter weitergegeben.",
      },
      {
        type: "p",
        text: "Die Meldung selbst löst noch keine Steuer aus – sie macht nur sichtbar, wer viel verkauft. Wer allerdings als Reseller ohne Gewerbe und ohne Steuererklärung aktiv ist, muss damit rechnen, dass das Finanzamt nachfragt.",
      },
      { type: "h2", text: "Gewerbe anmelden: So gehst du vor" },
      {
        type: "ol",
        items: [
          "**Gewerbeanmeldung** beim Gewerbeamt deiner Gemeinde, in vielen Städten auch online. Als Tätigkeit z. B. „Online-Handel mit Waren aller Art“ angeben. Die Gebühr ist je nach Gemeinde unterschiedlich.",
          "**Fragebogen zur steuerlichen Erfassung** über ELSTER ausfüllen. Hier schätzt du Umsatz und Gewinn und entscheidest dich für oder gegen die Kleinunternehmerregelung.",
          "**Steuernummer** abwarten; ggf. eine Umsatzsteuer-Identifikationsnummer beantragen, wenn du Waren aus dem EU-Ausland einkaufst.",
          "**Verpackungsregister LUCID**: Wer verpackte Ware an Endkunden versendet, muss sich in der Regel bei der Zentralen Stelle Verpackungsregister registrieren und sich an einem dualen System beteiligen.",
          "**Marktplatz-Konto umstellen**: Auf eBay und Amazon als gewerblicher Verkäufer mit Impressum und Widerrufsbelehrung auftreten.",
        ],
      },
      {
        type: "p",
        text: "Mit der Gewerbeanmeldung wirst du automatisch Mitglied der IHK. Kleine Gewerbetreibende sind je nach Gewinnhöhe häufig vom Beitrag befreit oder zahlen nur einen geringen Grundbeitrag.",
      },
      { type: "h2", text: "Umsatzsteuer: Kleinunternehmer oder Regelbesteuerung?" },
      {
        type: "p",
        text: "Seit 2025 gelten für die **Kleinunternehmerregelung nach § 19 UStG** neue Grenzen: Der Umsatz im **Vorjahr darf 25.000 €** nicht überschritten haben, und im **laufenden Jahr darf er 100.000 €** nicht überschreiten. Wird die 100.000-€-Grenze im laufenden Jahr überschritten, entfällt die Regelung bereits ab dem Umsatz, mit dem die Grenze überschritten wird.",
      },
      {
        type: "table",
        head: ["", "Kleinunternehmer (§ 19 UStG)", "Regelbesteuerung"],
        rows: [
          ["Umsatzsteuer auf Verkäufe", "keine", "19 % bzw. 7 %"],
          ["Vorsteuerabzug aus Einkäufen und Gebühren", "nein", "ja"],
          ["Umsatzsteuer-Voranmeldungen", "nein", "ja, monatlich oder quartalsweise"],
          ["Vorteil", "einfacher, Preise wirken günstiger für Privatkunden", "Vorsteuer aus teuren Einkäufen zurück"],
          ["Geeignet für", "Einstieg, kleine Umsätze", "wachsende Umsätze, gewerbliche Einkäufer"],
        ],
      },
      { type: "h3", text: "Differenzbesteuerung bei Gebrauchtware (§ 25a UStG)" },
      {
        type: "p",
        text: "Kaufst du gebrauchte Gegenstände von Privatpersonen (ohne Umsatzsteuerausweis) und verkaufst sie als regelbesteuerter Händler weiter, kannst du unter Voraussetzungen die **Differenzbesteuerung** nutzen. Dann zahlst du Umsatzsteuer nur auf die Differenz zwischen Einkaufs- und Verkaufspreis, nicht auf den vollen Verkaufspreis.",
      },
      {
        type: "p",
        text: "Beispiel: Du kaufst eine gebrauchte Kamera privat für 300 € und verkaufst sie für 480 €. Bei Regelbesteuerung wären im Verkaufspreis 76,64 € Umsatzsteuer enthalten (480 × 19/119). Mit Differenzbesteuerung wird nur die Differenz von 180 € besteuert: 180 × 19/119 = 28,74 €. Für Neuware aus dem Handel gilt die Differenzbesteuerung nicht.",
      },
      { type: "h2", text: "Einkommensteuer und Gewerbesteuer" },
      {
        type: "p",
        text: "Dein **Gewinn** – nicht dein Umsatz – unterliegt der Einkommensteuer. Ermittelt wird er bei kleinen Gewerbetreibenden in der Regel per **Einnahmen-Überschuss-Rechnung (EÜR)**: Einnahmen minus Betriebsausgaben wie Wareneinkauf, Marktplatzgebühren, Versand, Verpackung, Software und anteilige Kosten. Der Gewinn wird mit deinen übrigen Einkünften zusammengerechnet; der persönliche Grundfreibetrag gilt für das gesamte Einkommen.",
      },
      {
        type: "p",
        text: "**Gewerbesteuer** fällt für Einzelunternehmer erst an, wenn der Gewerbeertrag den **Freibetrag von 24.500 € pro Jahr** übersteigt. Darüber hinaus wird sie über § 35 EStG ganz oder weitgehend auf die Einkommensteuer angerechnet.",
      },
      {
        type: "tip",
        title: "Rücklagen bilden",
        text: "Lege einen festen Anteil jedes Gewinns für Steuern zurück, besonders im ersten Jahr: Nach der ersten Steuererklärung können Nachzahlung und Vorauszahlungen gleichzeitig fällig werden.",
      },
      { type: "h2", text: "Private Verkäufe: Wann sie doch steuerpflichtig werden" },
      {
        type: "p",
        text: "Auch ohne Gewerbe kann ein Verkauf steuerlich relevant sein. Nach **§ 23 EStG** sind **private Veräußerungsgeschäfte** steuerpflichtig, wenn zwischen Kauf und Verkauf **weniger als ein Jahr** liegt und der Gegenstand kein Gegenstand des täglichen Gebrauchs ist – etwa Sammlerstücke, Schmuck oder Kunst. Seit 2024 gilt dafür eine **Freigrenze von 1.000 € pro Jahr**: Liegt der Gesamtgewinn aus solchen Geschäften darunter, bleibt er steuerfrei; wird sie überschritten, ist der gesamte Gewinn steuerpflichtig.",
      },
      {
        type: "p",
        text: "Gegenstände des täglichen Gebrauchs wie Kleidung, Smartphones oder Möbel fallen nicht unter § 23 EStG. Wichtig: Diese Regel betrifft nur echte Privatverkäufe. Wer gezielt zum Weiterverkauf einkauft, ist gewerblich – dann zählt jeder Gewinn, unabhängig von Haltedauer oder Freigrenze.",
      },
      { type: "h3", text: "Einkauf im EU-Ausland" },
      {
        type: "p",
        text: "Kaufst du als Unternehmer Ware bei Händlern in anderen EU-Ländern ein, gelten besondere Regeln für den innergemeinschaftlichen Erwerb. Mit einer Umsatzsteuer-Identifikationsnummer kann der Lieferant unter Voraussetzungen ohne ausländische Umsatzsteuer liefern; die Besteuerung erfolgt dann in Deutschland. Verkaufst du umgekehrt an Privatkunden im EU-Ausland, können ab bestimmten Schwellen die Regeln des One-Stop-Shop-Verfahrens (OSS) relevant werden. Beides solltest du vor dem ersten grenzüberschreitenden Geschäft mit deiner Steuerberatung klären.",
      },
      { type: "h2", text: "Buchhaltung: Was du von Anfang an sammeln solltest" },
      {
        type: "ul",
        items: [
          "Einkaufsrechnungen, möglichst auf deinen Namen bzw. Gewerbenamen",
          "monatliche Gebührenrechnungen von eBay und Amazon",
          "Auszahlungsberichte der Marktplätze und Zahlungsdienste",
          "Versandbelege und Rechnungen für Verpackungsmaterial",
          "Rechnungen für Tools und Software, die du für den Handel nutzt",
        ],
      },
      {
        type: "p",
        text: "Für eine saubere Kalkulation pro Artikel – inklusive Umsatzsteuer, wenn du regelbesteuert bist – hilft der Ratgeber [Reselling-Gewinn berechnen](/ratgeber/reselling-gewinn-berechnen/). Wie sich die Marktplatzgebühren zusammensetzen, erklärt der Artikel zu [eBay-Gebühren für gewerbliche Verkäufer](/ratgeber/ebay-gebuehren-reselling/). Und wer Insolvenzware einkauft, findet die Besonderheiten zu Aufgeld und Umsatzsteuer im Ratgeber [Insolvenzversteigerung](/ratgeber/insolvenzversteigerung-ablauf/).",
      },
      {
        type: "cta",
        title: "Kosten im Deal schon mitrechnen",
        text: "Arbitrage Radar zeigt dir für jede Chance den Break-even inklusive Gebühren und Versand. So siehst du vor dem Einkauf, was vor Steuern übrig bleibt. Wie das aussieht, kannst du im [Test-Dashboard](/demo/) ohne Anmeldung ansehen.",
      },
    ],
    faq: [
      {
        q: "Ab wann muss ich beim Reselling ein Gewerbe anmelden?",
        a: "Sobald du nachhaltig und mit Gewinnerzielungsabsicht Ware einkaufst, um sie weiterzuverkaufen. Eine feste Mindestgrenze gibt es nicht; schon wenige gezielte Weiterverkäufe können gewerblich sein. Im Zweifel klärst du das mit dem Gewerbeamt oder einem Steuerberater.",
      },
      {
        q: "Meldet eBay meine Verkäufe an das Finanzamt?",
        a: "Ja, wenn du im Kalenderjahr mindestens 30 Verkäufe oder mindestens 2.000 € Umsatz erreichst. Grundlage ist das Plattformen-Steuertransparenzgesetz (DAC7). Die Meldung bedeutet nicht automatisch, dass Steuern anfallen.",
      },
      {
        q: "Wie hoch ist die Kleinunternehmergrenze 2026?",
        a: "Der Umsatz im Vorjahr darf höchstens 25.000 € betragen und im laufenden Jahr 100.000 € nicht überschreiten. Als Kleinunternehmer weist du keine Umsatzsteuer aus, kannst aber auch keine Vorsteuer abziehen.",
      },
      {
        q: "Muss ich private Verkäufe auf eBay versteuern?",
        a: "Der Verkauf eigener gebrauchter Gegenstände des täglichen Gebrauchs ist in der Regel steuerfrei. Steuerpflichtig können private Veräußerungsgeschäfte mit anderen Gegenständen sein, wenn zwischen Kauf und Verkauf weniger als ein Jahr liegt und der Gewinn die Freigrenze von 1.000 € pro Jahr übersteigt.",
      },
      {
        q: "Zahle ich als kleiner Reseller Gewerbesteuer?",
        a: "Als Einzelunternehmer erst, wenn dein Gewerbeertrag 24.500 € im Jahr übersteigt. Darüber hinaus wird die Gewerbesteuer ganz oder weitgehend auf die Einkommensteuer angerechnet.",
      },
    ],
    related: ["reselling-tool", "amazon-ebay-arbitrage", "insolvenzmasse-kaufen"],
  },

  // ───────────────────────────────────────────────────────────── 3
  {
    slug: "insolvenzversteigerung-ablauf",
    title: "Insolvenzversteigerung: Ablauf, Aufgeld & Tipps 2026",
    description:
      "Insolvenzmasse ersteigern: So läuft eine Insolvenzversteigerung ab, was Aufgeld und Abholung kosten und wie du dein Maximalgebot mit Puffer festlegst.",
    h1: "Insolvenzversteigerung: Ablauf, Kosten und Tipps zum Ersteigern",
    intro:
      "Bei einer Insolvenzversteigerung verkauft ein vom Insolvenzverwalter beauftragter Verwerter das Inventar eines insolventen Unternehmens, meist online an den Höchstbietenden. Zum Zuschlag kommen häufig 15–20 % Aufgeld plus Umsatzsteuer sowie Abholkosten hinzu, und die Ware wird typischerweise „gekauft wie gesehen“ ohne Gewährleistung verkauft. Gewinn macht, wer vorher besichtigt, alle Nebenkosten einrechnet und ein festes Maximalgebot setzt.",
    keywords: [
      "insolvenzversteigerung",
      "insolvenzmasse ersteigern",
      "insolvenzauktion tipps",
      "aufgeld auktion",
      "insolvenzware kaufen",
      "insolvenzverwerter",
    ],
    published: "2026-10-05",
    updated: "2026-10-05",
    readingMinutes: 7,
    sections: [
      { type: "h2", text: "Wer verkauft bei einer Insolvenzversteigerung?" },
      {
        type: "p",
        text: "Nach der Eröffnung eines Insolvenzverfahrens setzt das Insolvenzgericht einen **Insolvenzverwalter** ein. Seine Aufgabe ist es, das Vermögen des Schuldners – die **Insolvenzmasse** – bestmöglich zu verwerten, um die Gläubiger zu bedienen. Für bewegliche Gegenstände wie Maschinen, Fahrzeuge, Büroausstattung oder Warenbestände beauftragt er häufig einen spezialisierten **Verwerter** bzw. ein Auktionshaus, das die Versteigerung organisiert.",
      },
      {
        type: "p",
        text: "Davon zu unterscheiden ist die **Zwangsversteigerung**: Dort versteigert ein Gericht (bei Immobilien) oder ein Gerichtsvollzieher (bei beweglichen Sachen, z. B. über justiz-auktion.de) im Rahmen einer Einzelvollstreckung. Die Abläufe und Bedingungen sind anders – dieser Ratgeber behandelt Versteigerungen aus Insolvenzmassen.",
      },
      { type: "h2", text: "Wo du Insolvenzversteigerungen findest" },
      {
        type: "ul",
        items: [
          "**insolvenzbekanntmachungen.de** ist die offizielle Plattform der Länder für Bekanntmachungen der Insolvenzgerichte. Dort siehst du eröffnete Verfahren samt Insolvenzverwalter – die Auktionen selbst stehen dort nicht.",
          "**Websites der Verwerter und Auktionshäuser**, die im Auftrag von Insolvenzverwaltern versteigern, meist mit Online-Bietsystem.",
          "**Kanzlei-Websites von Insolvenzverwaltern**, die teilweise Verkaufsangebote oder Ansprechpartner nennen.",
          "**Spezialisierte Suchdienste**, die Auktionen mehrerer Verwerter bündeln. Zur Bewertung einzelner Posten mit Maximalgebot gibt es außerdem den [Insolvenz-Finder von Arbitrage Radar](/insolvenzmasse-kaufen/).",
        ],
      },
      { type: "h2", text: "Ablauf einer Online-Insolvenzauktion" },
      {
        type: "ol",
        items: [
          "**Katalog prüfen:** Positionen (Lose) mit Fotos, Beschreibung, Standort und Auktionsende ansehen.",
          "**Auktionsbedingungen lesen:** Aufgeld, Umsatzsteuer, Zahlungsfrist, Abholfrist, Gewährleistungsausschluss.",
          "**Besichtigung wahrnehmen:** Viele Verwerter bieten feste Besichtigungstermine vor Ort an.",
          "**Registrieren:** Für Online-Gebote ist ein Konto nötig, oft mit Identitätsnachweis oder Kaution.",
          "**Bieten:** Online mit Höchstgebot oder manuell; viele Auktionen verlängern sich bei späten Geboten.",
          "**Zuschlag und Rechnung:** Du erhältst eine Rechnung über Zuschlag, Aufgeld und Umsatzsteuer.",
          "**Zahlen und abholen:** Innerhalb der Frist zahlen und die Ware – meist selbst – am Standort abholen.",
        ],
      },
      {
        type: "tip",
        title: "Abholung vor dem Bieten planen",
        text: "Abholfristen sind oft kurz, und Demontage, Verladung und Transport sind deine Sache. Kläre vor dem ersten Gebot, wer abholt, welches Fahrzeug nötig ist und was das kostet.",
      },
      { type: "h2", text: "Was kostet ein ersteigertes Los wirklich?" },
      {
        type: "p",
        text: "Der Zuschlagspreis ist nur ein Teil der Rechnung. Typischerweise kommen hinzu:",
      },
      {
        type: "table",
        head: ["Kostenpunkt", "Typische Größenordnung", "Hinweis"],
        rows: [
          ["Aufgeld (Käuferprovision)", "häufig 15–20 % auf den Zuschlag", "steht in den Auktionsbedingungen"],
          ["Umsatzsteuer", "19 % auf Zuschlag und Aufgeld, sofern ausgewiesen", "für Regelbesteuerte als Vorsteuer abziehbar"],
          ["Demontage und Verladung", "stark abhängig vom Objekt", "teils Pflicht über Partnerfirmen"],
          ["Transport", "von eigener Abholung bis Spedition", "bei schweren Gütern erheblich"],
          ["Aufbereitung, Reinigung, Prüfung", "abhängig vom Zustand", "Zeit und Material einrechnen"],
          ["Verkaufskosten", "Marktplatzgebühren, Versand", "siehe Gewinnberechnung"],
        ],
      },
      { type: "h3", text: "Rechenbeispiel: Vom Zuschlag zum Gesamtpreis" },
      {
        type: "p",
        text: "Ein Los Werkzeugmaschinen erhält den Zuschlag bei 1.000 €. Aufgeld laut Bedingungen: 18 %. Betrachtung ohne Vorsteuerabzug, z. B. als Kleinunternehmer:",
      },
      {
        type: "table",
        head: ["Position", "Betrag"],
        rows: [
          ["Zuschlag", "1.000,00 €"],
          ["Aufgeld 18 %", "180,00 €"],
          ["Zwischensumme netto", "1.180,00 €"],
          ["Umsatzsteuer 19 %", "224,20 €"],
          ["Rechnungsbetrag", "1.404,20 €"],
          ["Transport (Beispiel)", "150,00 €"],
          ["**Einstandspreis gesamt**", "**1.554,20 €**"],
        ],
      },
      {
        type: "p",
        text: "Aus einem Zuschlag von 1.000 € werden also über 1.550 €. Wer nur auf den Zuschlag schaut, überschätzt seinen Gewinn massiv.",
      },
      { type: "h2", text: "Das Maximalgebot rückwärts berechnen" },
      {
        type: "p",
        text: "Die wichtigste Regel bei Auktionen: **Lege dein Maximalgebot vorher fest und halte dich daran.** Du rechnest dafür rückwärts – vom erwarteten Verkaufserlös über die gewünschte Marge bis zum Zuschlag.",
      },
      {
        type: "ol",
        items: [
          "Erwarteten Nettoerlös schätzen: realistische Verkaufspreise minus Marktplatzgebühren und Versand. Beispiel: 2.000 €.",
          "Gewünschte Marge abziehen, z. B. 20 %: Maximaler Einstandspreis = 2.000 € × 0,8 = 1.600 €.",
          "Transport und Nebenkosten abziehen: 1.600 € − 150 € = 1.450 € für die Auktionsrechnung.",
          "Aufgeld und Umsatzsteuer herausrechnen: 1.450 € ÷ (1,18 × 1,19) ≈ 1.032 €.",
          "Ergebnis: Dein Maximalgebot liegt bei rund **1.030 €**.",
        ],
      },
      {
        type: "p",
        text: "Genau diese Rechnung übernimmt Arbitrage Radar für Insolvenzlose: Das Tool schätzt den Wiederverkaufswert anhand aktueller Marktangebote und empfiehlt ein Maximalgebot, das rund 20 % Marge lässt. Bieten tust du selbst beim jeweiligen Auktionshaus. Wie du den Erlös pro Artikel sauber kalkulierst, steht im Ratgeber [Reselling-Gewinn berechnen](/ratgeber/reselling-gewinn-berechnen/).",
      },
      { type: "h2", text: "Rechtliches: „Gekauft wie gesehen“" },
      {
        type: "p",
        text: "In Insolvenzauktionen wird die **Gewährleistung** für Unternehmer als Käufer in der Regel ausgeschlossen. Mängel, fehlendes Zubehör oder nicht funktionierende Geräte gehen dann zu deinen Lasten. Lies die Auktionsbedingungen deshalb vollständig und beachte, ob Angaben zu Funktion und Zustand als ungeprüft gekennzeichnet sind.",
      },
      {
        type: "ul",
        items: [
          "**Besichtigung nutzen** – Fotos zeigen selten Verschleiß, Feuchtigkeitsschäden oder fehlende Teile.",
          "**Rechte Dritter beachten** – etwa Eigentumsvorbehalte von Lieferanten oder Leasinggut, das nicht zur Masse gehört; seriöse Verwerter klären das vorab.",
          "**Daten auf IT-Geräten** – Festplatten können personenbezogene Daten enthalten; vor Weiterverkauf sicher löschen.",
          "**Fristen ernst nehmen** – wer nicht fristgerecht zahlt oder abholt, riskiert Kosten und Rücktritt.",
        ],
      },
      { type: "h2", text: "Welche Lose sich für den Weiterverkauf eignen" },
      {
        type: "p",
        text: "Nicht jedes günstige Los ist ein gutes Arbitrage-Objekt. Am besten funktionieren Positionen, deren Wiederverkaufswert du anhand vergleichbarer Angebote zuverlässig einschätzen kannst, und die sich ohne großen Aufwand einzeln verkaufen lassen.",
      },
      {
        type: "table",
        head: ["Los-Typ", "Eignung", "Worauf achten"],
        rows: [
          ["Markenwerkzeug, Elektrowerkzeug", "oft gut", "Akkus, Ladegeräte, Funktion prüfen"],
          ["IT und Büroelektronik", "gut bei aktuellen Modellen", "Datenträger, Lizenzen, Netzteile"],
          ["Neuware aus Warenbeständen", "gut", "Vollständigkeit, Originalverpackung, Markenrechte"],
          ["Büromöbel", "eher regional", "Transport und Lagerplatz sind teuer"],
          ["Großmaschinen", "nur mit Erfahrung", "Demontage, Prüfpflichten, Spedition"],
        ],
      },
      {
        type: "p",
        text: "Gemischte Lose („Konvolut“) können lukrativ sein, weil einzelne Teile mehr wert sind als das ganze Paket. Sie bedeuten aber auch mehr Arbeit: sortieren, prüfen, fotografieren, einzeln einstellen. Rechne diesen Aufwand ehrlich mit ein und setze für den Rest, der sich nicht lohnt, einen Sammelverkauf oder die Entsorgung an.",
      },
      {
        type: "p",
        text: "Achte außerdem auf das Auktionsende. Viele Online-Auktionen eines Verwerters enden gestaffelt innerhalb weniger Stunden. Wer auf mehrere Lose bietet, sollte vorher festlegen, wie viel er insgesamt maximal ausgeben und abholen kann – sonst gewinnst du am Ende mehr Lose, als du transportieren oder finanzieren kannst.",
      },
      { type: "h2", text: "Tipps für Einsteiger" },
      {
        type: "table",
        head: ["Tipp", "Warum"],
        rows: [
          ["Mit kleinen, transportablen Losen starten", "geringeres Risiko, keine Spedition nötig"],
          ["Kategorien wählen, die du kennst", "Zustand und Wiederverkaufswert besser einschätzbar"],
          ["Verkaufspreise vorher recherchieren", "verkaufte Angebote statt Wunschpreise"],
          ["Nicht in den Bieterwettstreit einsteigen", "das Maximalgebot schützt die Marge"],
          ["Lagerplatz einplanen", "Verkauf großer Lose dauert oft Wochen"],
        ],
      },
      {
        type: "p",
        text: "Wer regelmäßig Insolvenzware kauft und weiterverkauft, ist gewerblich tätig. Was das steuerlich bedeutet, erklärt der Ratgeber [Reselling: Gewerbe und Steuern](/ratgeber/reselling-gewerbe-steuern/). Im kostenlosen [Test-Dashboard](/demo/) siehst du ohne Anmeldung an fiktiven Beispiel-Losen, wie Arbitrage Radar Insolvenzmasse-Posten mit Maximalgebot und Gewinnwahrscheinlichkeit bewertet; die Tarife stehen unter [Preise](/preise/).",
      },
      {
        type: "cta",
        title: "Insolvenzmassen finden – mit Maximalgebot",
        text: "Arbitrage Radar bewertet Insolvenzmasse-Posten mit Maximalgebot: Das Tool schätzt den Wiederverkaufswert anhand von Marktpreisen und empfiehlt dir ein Gebotslimit mit rund 20 % Marge. So bietest du mit klarer Grenze statt aus dem Bauch.",
      },
    ],
    faq: [
      {
        q: "Kann jeder bei einer Insolvenzversteigerung mitbieten?",
        a: "Viele Online-Auktionen stehen grundsätzlich allen offen, manche richten sich aber nur an gewerbliche Käufer. Du musst dich in der Regel registrieren und teilweise eine Kaution hinterlegen. Die genauen Bedingungen stehen im Katalog des Verwerters.",
      },
      {
        q: "Was ist das Aufgeld bei einer Auktion?",
        a: "Das Aufgeld ist eine Käuferprovision, die das Auktionshaus zusätzlich zum Zuschlagspreis berechnet. Bei Insolvenzauktionen liegt es häufig zwischen 15 und 20 %, hinzu kommt meist die Umsatzsteuer. Rechne es immer in dein Maximalgebot ein.",
      },
      {
        q: "Gibt es bei Insolvenzware Gewährleistung?",
        a: "In der Regel nicht, zumindest nicht gegenüber gewerblichen Käufern: Die Ware wird meist „gekauft wie gesehen“ verkauft. Deshalb ist die Besichtigung vor dem Bieten so wichtig.",
      },
      {
        q: "Wo finde ich aktuelle Insolvenzversteigerungen?",
        a: "Die offiziellen Insolvenzverfahren stehen auf insolvenzbekanntmachungen.de, die Auktionen selbst auf den Websites der beauftragten Verwerter und Auktionshäuser. Suchdienste bündeln Auktionen mehrerer Anbieter, damit du nicht jede Seite einzeln prüfen musst.",
      },
      {
        q: "Ist Insolvenzware wirklich günstig?",
        a: "Oft, aber nicht immer. Mit Aufgeld, Umsatzsteuer, Transport und fehlender Gewährleistung kann ein vermeintliches Schnäppchen teurer werden als Gebrauchtware vom Händler. Entscheidend ist ein vorab berechnetes Maximalgebot.",
      },
    ],
    related: ["insolvenzmasse-kaufen", "arbitrage-software", "reselling-tool"],
  },

  // ───────────────────────────────────────────────────────────── 4
  {
    slug: "reselling-gewinn-berechnen",
    title: "Reselling Gewinn berechnen: Break-even, Marge, ROI",
    description:
      "Reselling-Gewinn richtig berechnen: Formeln für Break-even, Marge und ROI inklusive eBay-Gebühren, Versand und Umsatzsteuer – mit Rechenbeispielen.",
    h1: "Reselling-Gewinn berechnen: So weißt du vor dem Kauf, ob es sich lohnt",
    intro:
      "Dein Reselling-Gewinn ist der Verkaufspreis minus Einkaufspreis, Marktplatzgebühren, Versand, Verpackung und – falls du regelbesteuert bist – die abzuführende Umsatzsteuer. Ob sich ein Weiterverkauf lohnt, zeigt der Break-even-Preis: der Verkaufspreis, ab dem du nach allen Kosten bei null landest. Liegt der realistische Marktpreis deutlich darüber, ist der Deal interessant.",
    keywords: [
      "reselling gewinn berechnen",
      "break even berechnen ebay",
      "lohnt sich weiterverkauf",
      "marge berechnen",
      "roi berechnen reselling",
      "ebay gewinn berechnen",
    ],
    published: "2026-10-05",
    updated: "2026-10-05",
    readingMinutes: 7,
    sections: [
      { type: "h2", text: "Die Grundformel für den Reselling-Gewinn" },
      {
        type: "p",
        text: "**Gewinn = Verkaufspreis − Marktplatzgebühren − Versand − Verpackung − Einkaufspreis − Umsatzsteuer-Zahllast**",
      },
      {
        type: "p",
        text: "Klingt einfach, aber in der Praxis wird fast immer etwas vergessen. Die häufigsten Lücken: Die Verkaufsprovision wird oft auch auf die Versandkosten berechnet, die der Käufer zahlt. Verpackung, Retouren und Zahlungsgebühren fehlen in der Rechnung. Und wer regelbesteuert ist, vergisst, dass ein Teil des Verkaufspreises gar nicht ihm gehört, sondern dem Finanzamt.",
      },
      {
        type: "table",
        head: ["Kostenblock", "Was dazugehört", "Oft vergessen"],
        rows: [
          ["Einkauf", "Kaufpreis, ggf. Versand zu dir", "Gutscheine erst nach Kauf gutgeschrieben"],
          ["Marktplatz", "Verkaufsprovision, Fixgebühr pro Bestellung", "Provision auf Versandanteil, Anzeigenkosten"],
          ["Versand", "Porto, Versicherung", "Übergröße, Nachporto"],
          ["Verpackung", "Karton, Polster, Klebeband", "bei vielen Sendungen spürbar"],
          ["Steuern", "Umsatzsteuer bei Regelbesteuerung", "Einkommensteuer auf den Gewinn"],
          ["Risiko", "Retouren, Beschädigung, Preisverfall", "gebundenes Kapital"],
        ],
      },
      {
        type: "tip",
        title: "Direkt nachrechnen",
        text: "Der kostenlose [Reselling-Rechner](/rechner/) nimmt dir die Rechnung ab: Gewinn, Marge, Rendite und Mindest-Verkaufspreis nach Gebühren und Versand, ohne Anmeldung.",
      },
      { type: "h2", text: "Marge und ROI: Zwei Kennzahlen, zwei Fragen" },
      {
        type: "ul",
        items: [
          "**Marge** = Gewinn ÷ Verkaufspreis. Sie beantwortet: Wie viel vom Umsatz bleibt hängen?",
          "**ROI (Return on Investment)** = Gewinn ÷ Einkaufspreis. Er beantwortet: Wie gut verzinst sich mein eingesetztes Kapital?",
        ],
      },
      {
        type: "p",
        text: "Beispiel: 20 € Gewinn bei 100 € Verkaufspreis und 60 € Einkauf ergeben 20 % Marge und 33,3 % ROI. Für Reseller ist der ROI oft aussagekräftiger, weil Kapital der Engpass ist. Noch besser ist es, den ROI mit der **Verkaufsdauer** zu verbinden: 15 % ROI in einer Woche schlagen 30 % ROI in drei Monaten, wenn du das Geld mehrfach umschlagen kannst.",
      },
      { type: "h2", text: "Break-even berechnen (eBay-Beispiel)" },
      {
        type: "p",
        text: "Weil die Verkaufsprovision prozentual vom Verkaufspreis abhängt, kannst du den Break-even nicht einfach durch Addieren ermitteln. Die Formel lautet:",
      },
      {
        type: "p",
        text: "**Break-even-Preis = (Einkauf + Versand + Verpackung + Fixgebühr) ÷ (1 − Provisionssatz)**",
      },
      {
        type: "p",
        text: "**Beispielrechnung mit 11 % + 0,35 €** (die echten eBay-Sätze hängen von Kategorie und Konditionen ab – mehr im Ratgeber [eBay-Gebühren für Reseller](/ratgeber/ebay-gebuehren-reselling/)): Einkauf 40,00 €, Versand 4,99 €, Verpackung 0,60 €, Verkauf versandkostenfrei, Kleinunternehmer.",
      },
      {
        type: "table",
        head: ["Schritt", "Rechnung", "Ergebnis"],
        rows: [
          ["Fixe Kosten addieren", "40,00 + 4,99 + 0,60 + 0,35", "45,94 €"],
          ["Durch (1 − 0,11) teilen", "45,94 ÷ 0,89", "51,62 €"],
          ["Probe: Provision", "51,62 × 11 % + 0,35", "6,03 €"],
          ["Probe: Rest", "51,62 − 6,03 − 4,99 − 0,60 − 40,00", "0,00 €"],
        ],
      },
      {
        type: "p",
        text: "Unter 51,62 € machst du Verlust. Willst du mindestens 5 € Gewinn, brauchst du (45,94 + 5) ÷ 0,89 = **57,24 €** Verkaufspreis. Liegen die verkauften Angebote stabil bei 65 €, hast du Puffer; schwanken sie zwischen 50 und 60 €, ist der Deal zu knapp.",
      },
      {
        type: "tip",
        title: "Mindestgewinn statt nur Break-even",
        text: "Break-even heißt: Du arbeitest umsonst. Lege eine feste Untergrenze fest, zum Beispiel den höheren Wert aus 5 € oder 5 % des Einkaufs. So deckst du auch Zeitaufwand und kleine Ausfälle ab.",
      },
      { type: "h2", text: "Mit Umsatzsteuer rechnen: Kleinunternehmer vs. Regelbesteuerung" },
      {
        type: "p",
        text: "Als **Kleinunternehmer** weist du keine Umsatzsteuer aus und rechnest mit Bruttopreisen. Bist du **regelbesteuert**, steckt im Verkaufspreis 19 % Umsatzsteuer, die du abführen musst – dafür bekommst du die Vorsteuer aus deinem Einkauf zurück. Du rechnest dann am einfachsten mit Nettobeträgen.",
      },
      {
        type: "p",
        text: "Beispiel: Einkauf 50,00 € brutto, Verkauf 79,00 € brutto, Versand 4,99 €, Gebühren nach Beispielsatz 11 % + 0,35 € = 9,04 € (vereinfacht ohne Vorsteuer auf Gebühren und Versand):",
      },
      {
        type: "table",
        head: ["Position", "Kleinunternehmer", "Regelbesteuert (netto)"],
        rows: [
          ["Verkaufspreis", "79,00 €", "66,39 €"],
          ["Einkauf", "− 50,00 €", "− 42,02 €"],
          ["Gebühren", "− 9,04 €", "− 9,04 €"],
          ["Versand", "− 4,99 €", "− 4,99 €"],
          ["**Gewinn**", "**14,97 €**", "**10,34 €**"],
        ],
      },
      {
        type: "p",
        text: "Der Unterschied entsteht, weil bei Regelbesteuerung die Umsatzsteuer auf die Wertschöpfung (hier 79 € − 50 €) abgeführt wird. In der Praxis verringert der Vorsteuerabzug auf Gebühren und Versand diesen Abstand etwas. Bei Gebrauchtware von Privatpersonen kann die Differenzbesteuerung helfen – Details im Ratgeber [Reselling: Gewerbe und Steuern](/ratgeber/reselling-gewerbe-steuern/).",
      },
      { type: "h2", text: "Lohnt sich der Weiterverkauf? Die Checkliste" },
      {
        type: "ol",
        items: [
          "**Realistischer Verkaufspreis:** Median der verkauften Angebote der letzten Wochen, nicht der höchste Angebotspreis.",
          "**Break-even und Mindestgewinn** berechnet – inklusive Provision auf den Versandanteil.",
          "**Verkaufsgeschwindigkeit:** Wie viele Einheiten wurden zuletzt verkauft, wie viele sind aktuell gelistet?",
          "**Preistrend:** Steigt, fällt oder schwankt der Preis? Droht ein Restock oder Nachfolgemodell?",
          "**Risiken:** Fälschungsgefahr, Markenbeschränkungen, hohe Retourenquote in der Kategorie.",
          "**Kapitalbindung:** Kannst du das Geld entbehren, falls der Verkauf länger dauert?",
        ],
      },
      { type: "h2", text: "Den realistischen Verkaufspreis ermitteln" },
      {
        type: "p",
        text: "Die beste Formel hilft nichts, wenn der angenommene Verkaufspreis falsch ist. Nutze deshalb **verkaufte Angebote** als Basis, nicht aktive. Aktive Angebote zeigen, was Verkäufer gern hätten; verkaufte Angebote zeigen, was Käufer tatsächlich zahlen. Achte dabei auf gleichen Zustand (neu, wie neu, gebraucht), gleiche Variante und vergleichbare Versandkosten.",
      },
      {
        type: "ul",
        items: [
          "**Median statt Durchschnitt:** Einzelne Ausreißer nach oben oder unten verzerren den Mittelwert.",
          "**Zeitraum begrenzen:** Verkäufe der letzten Wochen sind aussagekräftiger als die der letzten Monate.",
          "**Konkurrenz zählen:** Viele aktive Angebote bei wenigen Verkäufen drücken den Preis, wenn du schnell verkaufen willst.",
          "**Sicherheitsabschlag:** Rechne lieber mit einem Preis etwas unter dem Median.",
        ],
      },
      { type: "h3", text: "Sensitivität: Was passiert, wenn der Preis fällt?" },
      {
        type: "p",
        text: "Mit dem Beispiel von oben (Einkauf 40 €, Break-even 51,62 €) siehst du, wie empfindlich der Gewinn auf den Verkaufspreis reagiert – jeder Euro weniger kostet dich wegen der Provision zwar nur 0,89 € Gewinn – das summiert sich aber schnell:",
      },
      {
        type: "table",
        head: ["Verkaufspreis", "Gebühren (11 % + 0,35 €)", "Gewinn"],
        rows: [
          ["65,00 €", "7,50 €", "11,91 €"],
          ["60,00 €", "6,95 €", "7,46 €"],
          ["55,00 €", "6,40 €", "3,01 €"],
          ["50,00 €", "5,85 €", "− 1,44 €"],
        ],
      },
      { type: "h2", text: "Von der Rechnung zur Wahrscheinlichkeit" },
      {
        type: "p",
        text: "Eine einzelne Gewinnzahl täuscht Sicherheit vor. Marktpreise streuen, und nicht jeder Artikel verkauft zum Durchschnittspreis. Arbitrage Radar rechnet deshalb nicht nur den Break-even inklusive Gebühren und Versand, sondern schätzt aus aktuellen Marktangeboten die **Wahrscheinlichkeit**, dass du mindestens den Break-even plus einen Mindestgewinn von 5 € bzw. 5 % (der höhere Wert zählt) erzielst. Gewichtet wird mit der Abverkaufsquote der letzten 30 Tage; angezeigt wird das Ergebnis als Prozentwert zwischen 1 und 97 % auf einem Balken von Rot bis Grün.",
      },
      {
        type: "p",
        text: "So siehst du auf einen Blick, ob ein Deal solide oder nur auf dem Papier gut ist. Probier es im [Test-Dashboard](/demo/) mit den Top-3-Chancen jeder Kategorie aus – mit Beispieldaten und ohne Anmeldung. Mehr zur Kalkulation steht auf der Seite [Reselling-Tool](/reselling-tool/), einen Überblick über alle Funktionen bietet die Seite [Arbitrage-Software](/arbitrage-software/).",
      },
      {
        type: "cta",
        title: "Break-even und Gewinnchance für jeden Deal",
        text: "Arbitrage Radar rechnet Gebühren und Versand automatisch ein, ermittelt den Zielpreis aus Live-Marktpreisen von eBay und zeigt dir die Gewinnwahrscheinlichkeit in Prozent – bevor du einkaufst.",
      },
    ],
    faq: [
      {
        q: "Wie berechne ich den Break-even bei eBay?",
        a: "Addiere Einkaufspreis, Versand, Verpackung und die Fixgebühr pro Bestellung und teile die Summe durch (1 − Provisionssatz). Das Ergebnis ist der Verkaufspreis, bei dem du genau bei null landest. Prüfe die aktuellen Provisionssätze deiner Kategorie auf der Gebührenseite von eBay.",
      },
      {
        q: "Was ist der Unterschied zwischen Marge und ROI?",
        a: "Die Marge setzt den Gewinn ins Verhältnis zum Verkaufspreis, der ROI ins Verhältnis zum Einkaufspreis. 20 € Gewinn bei 100 € Verkauf und 60 € Einkauf sind 20 % Marge und rund 33 % ROI.",
      },
      {
        q: "Ab wann lohnt sich ein Weiterverkauf?",
        a: "Wenn der realistische Verkaufspreis deutlich über dem Break-even liegt und der Artikel zügig verkauft. Viele Reseller setzen sich einen Mindestgewinn pro Artikel, etwa 5 € oder 5 %, damit Zeitaufwand und kleine Ausfälle gedeckt sind.",
      },
      {
        q: "Muss ich die Umsatzsteuer in die Gewinnberechnung einbeziehen?",
        a: "Ja, wenn du regelbesteuert bist: Dann gehören 19 % des Bruttoverkaufspreises dem Finanzamt, während du die Vorsteuer aus Einkäufen zurückbekommst. Als Kleinunternehmer fällt keine Umsatzsteuer an, du kannst aber auch keine Vorsteuer abziehen.",
      },
      {
        q: "Berechnet eBay die Provision auch auf die Versandkosten?",
        a: "Ja, bei gewerblichen Verkäufern bezieht sich die Verkaufsprovision in der Regel auf den Gesamtbetrag inklusive Versand. Rechne den Versandanteil deshalb immer mit ein.",
      },
    ],
    related: ["reselling-tool", "arbitrage-software", "amazon-ebay-arbitrage"],
  },

  // ───────────────────────────────────────────────────────────── 5
  {
    slug: "limitierte-editionen-wiederverkaufen",
    title: "Limitierte Editionen wiederverkaufen: Chancen & Risiken",
    description:
      "Sneaker resell, LEGO-Wertsteigerung, Konsole vorbestellen und weiterverkaufen: Wann sich limitierte Editionen lohnen und welche Risiken du einplanen musst.",
    h1: "Limitierte Editionen wiederverkaufen: Sneaker, LEGO, Konsolen und mehr",
    intro:
      "Limitierte Editionen lassen sich mit Gewinn weiterverkaufen, wenn die Nachfrage das Angebot zum Erscheinungstermin deutlich übersteigt – typisch bei bestimmten Sneaker-Releases, auslaufenden LEGO-Sets oder neuen Konsolen. Der Aufschlag ist aber oft nur vorübergehend: Restocks, Nachproduktionen und Fälschungen können Preise schnell drücken. Wer vorher Break-even, Verkaufszeitpunkt und Plattformregeln kennt, reduziert das Risiko deutlich.",
    keywords: [
      "limitierte editionen wiederverkaufen",
      "sneaker resell",
      "lego wertsteigerung",
      "konsole vorbestellen weiterverkaufen",
      "limited edition resell",
      "vorbestellung weiterverkaufen",
    ],
    published: "2026-10-05",
    updated: "2026-10-05",
    readingMinutes: 7,
    sections: [
      { type: "h2", text: "Warum limitierte Produkte im Preis steigen können" },
      {
        type: "p",
        text: "Der Mechanismus ist simpel: Ein Hersteller legt eine begrenzte Menge zu einem festen Preis (UVP) auf, die Nachfrage ist größer, und wer leer ausgeht, zahlt auf dem Sekundärmarkt mehr. Der Aufschlag hängt davon ab, **wie knapp** das Produkt tatsächlich ist und **wie lange** diese Knappheit anhält. Genau hier liegt das Risiko: Ob eine Edition wirklich limitiert bleibt, weißt du beim Kauf oft nicht sicher.",
      },
      {
        type: "table",
        head: ["Kategorie", "Typischer Gewinnzeitpunkt", "Hauptrisiko"],
        rows: [
          ["Sneaker (limitierte Releases)", "kurz nach Release", "Restock, Fälschungen, Raffle-Glück"],
          ["LEGO (auslaufende Sets)", "Monate bis Jahre nach Produktionsende", "Lager, Kapitalbindung, Neuauflagen"],
          ["Konsolen und Hardware", "Launch-Phase bei knapper Ware", "schneller Preisverfall bei Nachlieferung"],
          ["Sammelkarten, Collector's Editions", "Release oder später", "Hype-Zyklen, Zustand, Fälschungen"],
          ["Event-Tickets", "vor dem Event", "Weiterverkaufsverbote, Personalisierung"],
        ],
      },
      { type: "h2", text: "Sneaker resell: Raffles, Release und Echtheit" },
      {
        type: "p",
        text: "Begehrte Sneaker-Releases werden häufig per Raffle (Verlosung) oder über Apps verkauft – an Ware zu kommen ist also selbst schon Glückssache. Hast du ein Paar, ist der Verkaufszeitpunkt entscheidend: Bei manchen Modellen ist der Preis direkt nach Release am höchsten, bei anderen steigt er, wenn die Größenläufe ausverkauft sind.",
      },
      {
        type: "ul",
        items: [
          "**Echtheitsprüfung:** Plattformen wie StockX prüfen Ware vor dem Versand an den Käufer; eBay bietet in bestimmten Kategorien und Preisklassen eine Echtheitsprüfung an. Das schafft Vertrauen und erleichtert höhere Preise.",
          "**Fälschungsrisiko beim Einkauf:** Kaufe nur bei offiziellen Händlern. Wer Ware aus zweiter Hand zum Weiterverkauf einkauft, trägt das Risiko, Fälschungen zu verkaufen – das kann rechtliche Folgen haben.",
          "**Größe zählt:** Gängige Herrengrößen verkaufen oft schneller, Randgrößen können deutlich abweichen.",
        ],
      },
      { type: "h3", text: "Rechenbeispiel Sneaker" },
      {
        type: "p",
        text: "Retail-Preis 180 €, erwarteter Verkaufspreis 260 €. **Beispielannahme: 10 % Gesamtgebühren** der Verkaufsplattform (Transaktions- und Zahlungsgebühr; die echten Sätze variieren je Plattform und Verkäuferstufe), Versand 5 €: 260 € − 26 € − 5 € − 180 € = **49 € Gewinn**. Kommt kurz darauf ein Restock und der Marktpreis fällt auf 210 €, bleiben nur noch 210 − 21 − 5 − 180 = **4 €**.",
      },
      { type: "h2", text: "LEGO: Wertsteigerung nach Produktionsende" },
      {
        type: "p",
        text: "Bei LEGO entsteht ein Aufschlag typischerweise nicht zum Release, sondern nach dem Produktionsende (EOL, „End of Life“), wenn der Handel leer ist. Das bedeutet aber: Kapital und Lagerplatz sind oft über ein bis mehrere Jahre gebunden, und nicht jedes Set steigt. Neuauflagen ähnlicher Modelle können den Wert älterer Sets drücken.",
      },
      {
        type: "p",
        text: "Beispiel: Ein Set wird im Abverkauf für 79,99 € gekauft und zwei Jahre später für 140 € auf eBay verkauft. **Beispielrechnung mit 11 % + 0,35 €** Gebühren (15,75 €) und 6,99 € Versand: 140 − 15,75 − 6,99 − 79,99 = **37,27 € Gewinn**. Auf zwei Jahre gerechnet ist das ein ROI von rund 47 % – also gut 20 % pro Jahr vor Steuern, sofern das Set unbeschädigt bleibt und der Preis tatsächlich steigt.",
      },
      {
        type: "tip",
        title: "Originalverpackung ist Teil des Werts",
        text: "Bei Sammlerware entscheiden Karton und Zustand mit über den Preis. Lagere trocken, lichtgeschützt und gestapelt nur so, dass nichts eingedrückt wird.",
      },
      { type: "h2", text: "Konsole vorbestellen und weiterverkaufen" },
      {
        type: "p",
        text: "Bei neuen Konsolen und begehrter Hardware ist die Ware zum Launch oft knapp. Wer vorbestellt hat, kann in dieser Phase über UVP verkaufen. Sobald die Händler regelmäßig nachliefern, nähert sich der Preis meist schnell wieder der UVP an. Das Zeitfenster ist also kurz.",
      },
      {
        type: "table",
        head: ["Position", "Betrag"],
        rows: [
          ["Vorbestellpreis (UVP)", "499,99 €"],
          ["Verkaufspreis in der Launch-Woche (Annahme)", "649,00 €"],
          ["eBay-Gebühren (Beispiel 11 % + 0,35 €)", "− 71,74 €"],
          ["Versicherter Versand", "− 9,99 €"],
          ["**Gewinn**", "**67,28 €**"],
          ["Break-even-Preis: (499,99 + 9,99 + 0,35) ÷ 0,89", "573,40 €"],
        ],
      },
      {
        type: "p",
        text: "Fällt der Marktpreis unter 573,40 €, verlierst du Geld. Achte außerdem darauf, dass Händler Vorbestellungen stornieren oder Mengen pro Kunde begrenzen können. Mehr zu Strategien rund um Vorbestellungen findest du auf der Seite [Vorbestellungs-Arbitrage](/vorbestellung-arbitrage/), die Formeln im Ratgeber [Reselling-Gewinn berechnen](/ratgeber/reselling-gewinn-berechnen/).",
      },
      { type: "h2", text: "Regeln und Grenzen: Was nicht erlaubt ist" },
      {
        type: "ul",
        items: [
          "**Event-Tickets:** Viele Veranstalter personalisieren Tickets oder verbieten den Weiterverkauf über dem Originalpreis in ihren AGB. Solche Tickets können ungültig werden. Auch Marktplätze beschränken den Ticketverkauf teilweise.",
          "**Plattformregeln:** Amazon und eBay haben eigene Richtlinien zu überhöhten Preisen und zu bestimmten Produkten; in Ausnahmesituationen werden Angebote mit stark überhöhten Preisen entfernt.",
          "**Händler-AGB:** Manche Shops begrenzen Stückzahlen oder schließen Wiederverkäufer aus und stornieren entsprechende Bestellungen.",
          "**Bots:** Automatisierte Kaufsoftware verstößt gegen die Nutzungsbedingungen vieler Shops und kann zu Kontosperren führen.",
        ],
      },
      { type: "h2", text: "Steuern bei limitierten Editionen" },
      {
        type: "p",
        text: "Wer gezielt limitierte Produkte kauft, um sie weiterzuverkaufen, handelt in aller Regel gewerblich – unabhängig davon, ob die Haltedauer über einem Jahr liegt. Die Ein-Jahres-Regel für private Veräußerungsgeschäfte greift nur bei echten Privatverkäufen, etwa wenn du eine über Jahre privat aufgebaute Sammlung auflöst. Details erklärt der Ratgeber [Reselling: Gewerbe und Steuern](/ratgeber/reselling-gewerbe-steuern/); für deinen Einzelfall ist ein Steuerberater die richtige Adresse. Welche Gebühren beim Verkauf auf eBay anfallen, zeigt der Artikel zu [eBay-Gebühren für Reseller](/ratgeber/ebay-gebuehren-reselling/).",
      },
      { type: "h2", text: "Der richtige Verkaufszeitpunkt" },
      {
        type: "p",
        text: "Bei limitierten Editionen entscheidet das Timing oft mehr als der Einkaufspreis. Die Preisspitze liegt je nach Kategorie an sehr unterschiedlichen Stellen: Bei Hardware meist in den ersten Tagen und Wochen nach Launch, bei Sneakern je nach Modell direkt nach Release oder nach dem Ausverkauf einzelner Größen, bei LEGO und vielen Sammlerprodukten erst lange nach Produktionsende.",
      },
      {
        type: "p",
        text: "Lege dir vor dem Kauf eine Ausstiegsregel fest, zum Beispiel: „Verkaufen, sobald der Preis den Zielwert erreicht“ oder „spätestens nach X Wochen verkaufen, auch mit kleinerem Gewinn“. Wer auf den perfekten Moment wartet, verpasst ihn häufig – besonders, wenn ein Hersteller kurzfristig nachproduziert.",
      },
      { type: "h2", text: "So reduzierst du das Risiko" },
      {
        type: "ol",
        items: [
          "Nur kaufen, wenn der aktuelle Marktpreis **deutlich** über dem Break-even liegt – nicht nur knapp.",
          "Den Verkaufszeitpunkt vorher festlegen und Hype-Phasen nicht aussitzen.",
          "Stückzahlen klein halten, solange unklar ist, ob ein Restock kommt.",
          "Echtheit und Zustand dokumentieren: Fotos, Rechnung, Originalverpackung.",
          "Preisentwicklung und Abverkaufsquote regelmäßig beobachten statt nach Bauchgefühl zu entscheiden.",
        ],
      },
      {
        type: "p",
        text: "Arbitrage Radar zeigt Vorbestellungs-Chancen mit Zielpreis aus aktuellen Marktangeboten, Break-even und einer Gewinnwahrscheinlichkeit, die mit der Abverkaufsquote der letzten 30 Tage gewichtet ist. Im [Test-Dashboard](/demo/) siehst du anhand von Beispieldaten die drei besten Chancen jeder Kategorie ohne Anmeldung.",
      },
      {
        type: "cta",
        title: "Vorbestellungen mit Gewinnchance erkennen",
        text: "Arbitrage Radar vergleicht Vorbestellpreise mit den aktuellen Marktpreisen und zeigt dir für jede Chance Break-even, Zielpreis und die Wahrscheinlichkeit, mit Gewinn zu verkaufen – von Rot bis Grün.",
      },
    ],
    faq: [
      {
        q: "Lohnt sich Sneaker-Resell noch?",
        a: "Bei einzelnen gefragten Releases kann es sich lohnen, bei vielen Modellen liegt der Wiederverkaufspreis aber nahe oder unter dem Retail-Preis plus Gebühren. Entscheidend sind Modell, Größe und Verkaufszeitpunkt. Rechne vorher den Break-even inklusive Plattformgebühren.",
      },
      {
        q: "Welche LEGO-Sets steigen im Wert?",
        a: "Häufig genannt werden beliebte, auslaufende Sets mit großer Fangemeinde, eine Garantie gibt es aber nicht. Preissteigerungen zeigen sich typischerweise erst nach Produktionsende und hängen stark vom Zustand der Verpackung ab.",
      },
      {
        q: "Darf ich eine vorbestellte Konsole teurer weiterverkaufen?",
        a: "Grundsätzlich ja, der Weiterverkauf regulär gekaufter Ware ist erlaubt. Händler können aber Stückzahlen begrenzen oder Bestellungen von Wiederverkäufern stornieren, und Marktplätze können extrem überhöhte Preise in Ausnahmesituationen entfernen. Wer das regelmäßig macht, braucht in der Regel ein Gewerbe.",
      },
      {
        q: "Darf ich Konzerttickets teurer weiterverkaufen?",
        a: "Das hängt von den Bedingungen des Veranstalters ab. Viele personalisieren Tickets oder verbieten den Weiterverkauf über dem Originalpreis; Verstöße können dazu führen, dass das Ticket ungültig wird. Prüfe die Ticket-AGB, bevor du kaufst.",
      },
      {
        q: "Wie schütze ich mich vor Fälschungen beim Resell?",
        a: "Kaufe nur bei offiziellen Händlern und bewahre die Rechnung auf. Verkaufe hochpreisige Ware bevorzugt über Plattformen mit Echtheitsprüfung, etwa StockX oder die Echtheitsprüfung von eBay in den unterstützten Kategorien.",
      },
    ],
    related: ["vorbestellung-arbitrage", "amazon-ebay-arbitrage", "reselling-tool"],
  },

  // ───────────────────────────────────────────────────────────── 6
  {
    slug: "ebay-gebuehren-reselling",
    title: "eBay Gebühren gewerblich 2026: Provision berechnen",
    description:
      "eBay-Gebühren für gewerbliche Verkäufer erklärt: Verkaufsprovision, Fixgebühr, Anzeigenkosten und Shop-Abo – mit Beispielrechnung und Tipps für Reseller.",
    h1: "eBay-Gebühren für gewerbliche Verkäufer: So berechnest du die Provision",
    intro:
      "Gewerbliche Verkäufer zahlen auf eBay.de vor allem eine Verkaufsprovision als Prozentsatz vom Gesamtbetrag inklusive Versand sowie eine feste Gebühr pro Bestellung; dazu kommen optional Anzeigenkosten und ein Shop-Abo. Private Verkäufer zahlen seit 2023 in Deutschland in der Regel keine Verkaufsprovision. Die genauen Sätze hängen von Kategorie und Konditionen ab und ändern sich regelmäßig – deshalb erklärt dieser Ratgeber die Bausteine und rechnet mit klar gekennzeichneten Beispielsätzen.",
    keywords: [
      "ebay gebühren gewerblich",
      "ebay verkaufsprovision",
      "ebay gebühren berechnen",
      "ebay gebühren 2026",
      "ebay provision versandkosten",
      "ebay shop abo",
    ],
    published: "2026-10-05",
    updated: "2026-10-05",
    readingMinutes: 6,
    sections: [
      {
        type: "tip",
        title: "Aktuelle Sätze immer bei eBay prüfen",
        text: "eBay passt Gebühren regelmäßig an, oft je nach Kategorie. Alle Prozentsätze in diesem Artikel sind Beispielwerte zur Veranschaulichung. Verbindlich ist die aktuelle Gebührenübersicht für gewerbliche Verkäufer auf eBay.de.",
      },
      { type: "h2", text: "Privat vs. gewerblich: Wer zahlt was?" },
      {
        type: "p",
        text: "Seit 2023 zahlen **private Verkäufer** auf eBay.de für reguläre Verkäufe keine Verkaufsprovision mehr; Kosten entstehen dort im Wesentlichen nur für optionale Zusatzleistungen. **Gewerbliche Verkäufer** zahlen dagegen Provision pro Verkauf. Das verleitet manche dazu, Handelsware über ein Privatkonto zu verkaufen – das ist keine gute Idee: Wer gewerblich handelt, muss sich auch auf eBay als gewerblicher Verkäufer registrieren, mit Impressum, Widerrufsbelehrung und allen Verbraucherrechten. Ab 30 Verkäufen oder 2.000 € Umsatz im Jahr meldet eBay Verkäufer zudem an die Steuerbehörden (DAC7).",
      },
      {
        type: "p",
        text: "Wann du gewerblich bist und was das steuerlich bedeutet, erklärt der Ratgeber [Reselling: Gewerbe und Steuern](/ratgeber/reselling-gewerbe-steuern/).",
      },
      { type: "h2", text: "Die Gebührenbausteine für gewerbliche Verkäufer" },
      {
        type: "table",
        head: ["Baustein", "Wie er berechnet wird", "Pflicht?"],
        rows: [
          ["Verkaufsprovision", "Prozentsatz vom Gesamtbetrag inkl. Versand, je nach Kategorie unterschiedlich", "ja, bei Verkauf"],
          ["Fixgebühr pro Bestellung", "fester Betrag je Bestellung", "ja, bei Verkauf"],
          ["Anzeigenkosten (Promoted Listings)", "Prozentsatz bei Verkauf über die Anzeige oder Kosten pro Klick", "optional"],
          ["Shop-Abo", "monatliche Grundgebühr je Shop-Stufe, teils mit Inklusiv-Angeboten und anderen Konditionen", "optional"],
          ["Angebotsgebühren", "für Angebote über Freikontingent hinaus oder Zusatzoptionen", "teilweise"],
          ["Internationale Verkäufe", "ggf. zusätzliche Gebühr bei Käufern aus dem Ausland", "situationsabhängig"],
        ],
      },
      { type: "h3", text: "Provision auch auf Versandkosten" },
      {
        type: "p",
        text: "Ein häufig übersehener Punkt: Die Verkaufsprovision bezieht sich auf den **Gesamtbetrag**, den der Käufer zahlt – also Artikelpreis plus Versandkosten (und je nach Regelung weitere Bestandteile). Wer niedrige Artikelpreise mit hohen Versandkosten kombiniert, spart deshalb keine Provision.",
      },
      { type: "h3", text: "Staffelungen und Höchstbeträge" },
      {
        type: "p",
        text: "In vielen Kategorien gilt der Provisionssatz nur bis zu einem bestimmten Betrag; für den darüber liegenden Teil des Verkaufspreises kann ein niedrigerer Satz gelten. Bei hochpreisigen Artikeln lohnt es sich daher besonders, die aktuelle Staffel deiner Kategorie nachzuschlagen.",
      },
      { type: "h2", text: "eBay-Gebühren berechnen: Beispielrechnung" },
      {
        type: "p",
        text: "**Beispielrechnung mit 11 % + 0,35 €** und optionaler Anzeige mit 3 % Anzeigensatz: Ein Artikel wird für 120,00 € plus 6,99 € Versand verkauft, der Käufer zahlt also 126,99 €.",
      },
      {
        type: "table",
        head: ["Position", "Rechnung", "Betrag"],
        rows: [
          ["Gesamtbetrag", "120,00 + 6,99", "126,99 €"],
          ["Verkaufsprovision (Beispiel 11 %)", "126,99 × 0,11", "13,97 €"],
          ["Fixgebühr (Beispiel)", "pro Bestellung", "0,35 €"],
          ["Anzeigenkosten (Beispiel 3 %)", "126,99 × 0,03", "3,81 €"],
          ["**Gebühren gesamt**", "", "**18,13 €**"],
          ["Anteil am Gesamtbetrag", "18,13 ÷ 126,99", "ca. 14,3 %"],
        ],
      },
      {
        type: "p",
        text: "Ohne Anzeige wären es 14,32 € bzw. rund 11,3 %. Die Anzeige lohnt sich also nur, wenn sie den Verkauf spürbar beschleunigt oder einen höheren Preis ermöglicht.",
      },
      {
        type: "p",
        text: "Mit deinen eigenen Zahlen rechnest du das im kostenlosen [Reselling-Rechner](/rechner/) nach: Provision, Fixgebühr und Anzeigensatz eintragen, Gewinn und Mindest-Verkaufspreis ablesen.",
      },
      { type: "h3", text: "Wie die Fixgebühr bei kleinen Preisen wirkt" },
      {
        type: "p",
        text: "Weil die Fixgebühr unabhängig vom Preis ist, belastet sie günstige Artikel prozentual stärker. Mit den Beispielsätzen 11 % + 0,35 € (Preise inkl. Versand):",
      },
      {
        type: "table",
        head: ["Gesamtbetrag", "Provision 11 %", "Fixgebühr", "Gebühren gesamt", "effektiver Satz"],
        rows: [
          ["20,00 €", "2,20 €", "0,35 €", "2,55 €", "12,8 %"],
          ["50,00 €", "5,50 €", "0,35 €", "5,85 €", "11,7 %"],
          ["100,00 €", "11,00 €", "0,35 €", "11,35 €", "11,4 %"],
          ["250,00 €", "27,50 €", "0,35 €", "27,85 €", "11,1 %"],
        ],
      },
      {
        type: "tip",
        title: "Kleinteile bündeln",
        text: "Bei sehr günstigen Artikeln fressen Fixgebühr und Versand schnell die Marge. Bündel mehrere Teile zu einem Angebot oder setze eine Mindestpreisgrenze für deine Einkäufe.",
      },
      { type: "h3", text: "Gebühren in der Buchhaltung" },
      {
        type: "p",
        text: "eBay stellt gewerblichen Verkäufern regelmäßig Rechnungen über die angefallenen Gebühren aus. Diese Gebühren sind für dich Betriebsausgaben und mindern deinen Gewinn. Bist du regelbesteuert, prüfe auf der Rechnung, ob und wie Umsatzsteuer ausgewiesen ist – davon hängt ab, ob du Vorsteuer ziehen kannst oder die Umsatzsteuer selbst schuldest. Lade die Rechnungen monatlich herunter und lege sie zu deinen Belegen, damit die Einnahmen-Überschuss-Rechnung am Jahresende vollständig ist.",
      },
      { type: "h2", text: "Lohnt sich ein eBay-Shop-Abo?" },
      {
        type: "p",
        text: "Ein Shop-Abo kostet eine monatliche Grundgebühr und bietet je nach Stufe Inklusiv-Angebote, Marketing-Werkzeuge und teilweise andere Gebührenkonditionen. Ob es sich rechnet, hängt von deiner Anzahl an Angeboten und Verkäufen ab. Faustregel: Vergleiche die Abo-Kosten mit den Angebotsgebühren und Konditionen, die du ohne Abo hättest – auf Basis deiner tatsächlichen Monatszahlen, nicht der erhofften.",
      },
      { type: "h2", text: "So senkst du deine Gebührenlast" },
      {
        type: "ul",
        items: [
          "**Kategorie korrekt wählen:** Provisionssätze unterscheiden sich je Kategorie; eine falsche Kategorie kann teurer sein und schadet zudem der Auffindbarkeit.",
          "**Anzeigen gezielt einsetzen:** nur für Artikel mit genug Marge oder langsamem Abverkauf.",
          "**Versand realistisch kalkulieren:** Überhöhte Versandkosten erhöhen die Provision und schrecken Käufer ab.",
          "**Verkäuferstandards halten:** Bei schlechten Verkäuferbewertungen kann eBay zusätzliche Gebühren erheben.",
          "**Gebührenrechnungen auswerten:** Monatlich prüfen, welche Kosten pro Artikel tatsächlich angefallen sind.",
        ],
      },
      { type: "h2", text: "Was sonst noch vom Verkaufserlös abgeht" },
      {
        type: "p",
        text: "Neben den eBay-Gebühren gibt es weitere Kosten, die du pro Verkauf einplanen solltest. Sie stehen nicht auf der Gebührenrechnung, schmälern aber genauso deinen Gewinn:",
      },
      {
        type: "ul",
        items: [
          "**Versandkosten** inklusive Versicherung für höherpreisige Artikel",
          "**Verpackungsmaterial** sowie die Kosten für die Teilnahme an einem dualen System nach dem Verpackungsgesetz",
          "**Retouren:** Als gewerblicher Verkäufer musst du Verbrauchern ein Widerrufsrecht einräumen; Rücksendungen kosten Porto und manchmal Wert",
          "**Umsatzsteuer**, sofern du nicht Kleinunternehmer bist",
          "**Währungsumrechnung** bei Auszahlungen in Fremdwährung, falls du international verkaufst",
        ],
      },
      {
        type: "p",
        text: "Ein realistischer Blick: Bei vielen Artikeln landen Gebühren, Versand und Verpackung zusammen schnell bei einem spürbaren Anteil des Verkaufspreises. Deshalb sollte die Preisdifferenz zwischen Einkauf und Verkauf deutlich größer sein als die Provision allein.",
      },
      { type: "h3", text: "eBay oder Amazon?" },
      {
        type: "p",
        text: "Auch Amazon berechnet gewerblichen Verkäufern Verkaufsgebühren als Prozentsatz vom Verkaufspreis, je nach Kategorie, dazu kommen Kontogebühren und bei Versand durch Amazon (FBA) Lager- und Versandgebühren. Welcher Kanal günstiger ist, hängt vom Produkt ab. Vergleiche deshalb immer den Nettoerlös nach allen Kosten, nicht nur den Provisionssatz.",
      },
      { type: "h2", text: "Gebühren in die Kalkulation einbauen" },
      {
        type: "p",
        text: "Gebühren sind nur ein Teil der Rechnung. Wie du daraus den Break-even-Preis und deine Marge ableitest, zeigt der Ratgeber [Reselling-Gewinn berechnen](/ratgeber/reselling-gewinn-berechnen/). Wenn du zwischen eBay und Amazon abwägst, findest du die Unterschiede auf der Seite [Amazon-eBay-Arbitrage](/amazon-ebay-arbitrage/).",
      },
      {
        type: "p",
        text: "Arbitrage Radar rechnet Marktplatzgebühren und Versand automatisch in den Break-even jeder Chance ein. Du verbindest dein eigenes eBay-Konto über die offizielle eBay-Anmeldung (OAuth) und stellst Angebote mit einem Klick ein. Im [Test-Dashboard](/demo/) siehst du ohne Anmeldung, wie das aussieht; ein Konto legst du unter [Registrieren](/registrieren/) an.",
      },
      {
        type: "cta",
        title: "Gebühren nie wieder vergessen",
        text: "Arbitrage Radar kalkuliert jeden Deal inklusive Provision und Versand, zeigt dir die Gewinnwahrscheinlichkeit und stellt Angebote per Klick in dein eigenes eBay-Konto ein.",
      },
    ],
    faq: [
      {
        q: "Wie hoch sind die eBay-Gebühren für gewerbliche Verkäufer?",
        a: "Sie bestehen aus einer kategorieabhängigen Verkaufsprovision in Prozent vom Gesamtbetrag inklusive Versand und einer Fixgebühr pro Bestellung, dazu optional Anzeigenkosten und ein Shop-Abo. Die aktuellen Sätze ändern sich regelmäßig und stehen auf der Gebührenseite von eBay.de.",
      },
      {
        q: "Zahlen private Verkäufer bei eBay Gebühren?",
        a: "Private Verkäufer zahlen auf eBay.de seit 2023 für reguläre Verkäufe keine Verkaufsprovision. Kosten können für optionale Zusatzleistungen anfallen. Wer jedoch gewerblich handelt, muss ein gewerbliches Konto nutzen.",
      },
      {
        q: "Berechnet eBay Provision auf die Versandkosten?",
        a: "Ja, bei gewerblichen Verkäufern wird die Verkaufsprovision auf den Gesamtbetrag erhoben, den der Käufer zahlt, also einschließlich Versand. Hohe Versandkosten senken die Provision deshalb nicht.",
      },
      {
        q: "Wie berechne ich meine eBay-Gebühren?",
        a: "Multipliziere den Gesamtbetrag inklusive Versand mit dem Provisionssatz deiner Kategorie und addiere die Fixgebühr pro Bestellung. Nutzt du Anzeigen, kommt der Anzeigensatz hinzu. Beispiel mit 11 % + 0,35 €: Bei 100 € Gesamtbetrag sind das 11,35 €.",
      },
      {
        q: "Lohnt sich ein eBay-Shop für Reseller?",
        a: "Das hängt von deinem Volumen ab. Vergleiche die monatliche Grundgebühr mit den Angebotsgebühren und Konditionen ohne Abo, basierend auf deinen tatsächlichen Verkaufszahlen. Für sehr wenige Angebote lohnt es sich meist nicht.",
      },
    ],
    related: ["amazon-ebay-arbitrage", "reselling-tool", "arbitrage-software"],
  },
];
