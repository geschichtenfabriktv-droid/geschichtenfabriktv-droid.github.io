import type { Article } from "./types";

export const ARTICLES: Article[] = [
  // ───────────────────────────────────────────────────────────── 1
  {
    slug: "online-arbitrage-anleitung",
    title: "Online Arbitrage Anleitung 2026: Schritt für Schritt",
    description:
      "Online Arbitrage in Deutschland: So findest du Preisdifferenzen, prüfst die Nachfrage, rechnest Gebühren ein und verkaufst mit Gewinn. Anleitung mit Beispiel.",
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
        text: "Eine hilfreiche Kennzahl ist die **Sell-Through-Rate**: verkaufte Einheiten im Verhältnis zu angebotenen Einheiten in einem Zeitraum, etwa 30 Tagen. Liegt sie niedrig, konkurrierst du mit vielen Anbietern um wenige Käufer – und landest schnell in einem Preiskampf.",
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
        text: "Willst du sehen, wie das in der Praxis aussieht? Im kostenlosen [Test-Dashboard](/demo/) zeigt Arbitrage Radar ohne Anmeldung die drei besten aktuellen Chancen pro Kategorie – inklusive Break-even und Gewinnwahrscheinlichkeit. Die Tarife findest du unter [Preise](/preise/).",
      },
      {
        type: "cta",
        title: "Preisdifferenzen finden, ohne stundenlang zu vergleichen",
        text: "Arbitrage Radar durchsucht Händler und Marktplätze in 9 Kategorien, rechnet den Break-even inklusive Gebühren, Versand und Steuern und zeigt dir die Gewinnwahrscheinlichkeit als Balken von Rot bis Grün.",
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
        type: "p",
        text: "Arbitrage Radar berücksichtigt deinen Steuerstatus (Kleinunternehmer oder regelbesteuert) direkt im Break-even jedes Deals. Wie das aussieht, kannst du im [Test-Dashboard](/demo/) ohne Anmeldung ansehen; mehr über die Funktionen steht auf der Seite [Reselling-Tool](/reselling-tool/).",
      },
      {
        type: "cta",
        title: "Steuern im Deal schon mitrechnen",
        text: "Arbitrage Radar zeigt dir für jede Chance den Break-even inklusive Gebühren, Versand und Steuern – passend zu deinem Steuerstatus. So siehst du vor dem Einkauf, was wirklich übrig bleibt.",
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
      "Insolvenzmasse ersteigern: So läuft eine Insolvenzversteigerung ab, was Aufgeld und Abholung kosten und wie du dein Maximalgebot mit Gewinnpuffer festlegst.",
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
          "**Spezialisierte Suchdienste**, die Auktionen mehrerer Verwerter bündeln – etwa die Insolvenz-Kategorie von [Arbitrage Radar](/insolvenzmasse-kaufen/).",
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
        text: "Wer regelmäßig Insolvenzware kauft und weiterverkauft, ist gewerblich tätig. Was das steuerlich bedeutet, erklärt der Ratgeber [Reselling: Gewerbe und Steuern](/ratgeber/reselling-gewerbe-steuern/). Im kostenlosen [Test-Dashboard](/demo/) siehst du ohne Anmeldung, wie Arbitrage Radar aktuelle Insolvenzlose mit Maximalgebot und Gewinnwahrscheinlichkeit bewertet; die Tarife stehen unter [Preise](/preise/).",
      },
      {
        type: "cta",
        title: "Insolvenzmassen finden – mit Maximalgebot",
        text: "Arbitrage Radar sammelt Insolvenzauktionen, schätzt den Wiederverkaufswert aus Live-Marktdaten und empfiehlt dir ein Maximalgebot mit rund 20 % Marge. So bietest du mit klarer Grenze statt aus dem Bauch.",
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
];
