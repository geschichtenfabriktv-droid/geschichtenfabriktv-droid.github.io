import type { LandingPage } from "./types";

export const LANDINGS: LandingPage[] = [
  // ---------------------------------------------------------------------------
  // 1. Arbitrage Software
  // ---------------------------------------------------------------------------
  {
    slug: "arbitrage-software",
    title: "Arbitrage Software – Preisdifferenzen automatisch finden",
    description:
      "Arbitrage Software, die Preisdifferenzen zwischen Shops und Marktplätzen findet und Gewinn nach Gebühren berechnet. Jetzt kostenlos die Demo testen.",
    eyebrow: "Online-Arbitrage",
    h1: "Arbitrage Software, die Deals findet, bevor andere sie sehen",
    intro:
      "Arbitrage Radar durchsucht Händler und Marktplätze nach Preisdifferenzen und rechnet jede Chance bis auf den Cent durch: Einkauf, Gebühren, Versand, Steuern. Du siehst auf einen Blick, wie wahrscheinlich sich ein Deal lohnt – und kaufst oder stellst ihn per Knopfdruck ein.",
    keywords: [
      "arbitrage software",
      "online arbitrage tool",
      "arbitrage finder",
      "arbitrage deals finden",
      "online arbitrage deutschland",
      "preisdifferenzen finden",
    ],
    benefits: [
      {
        title: "Echte Marktpreise",
        text: "Zielpreise basieren auf aktuellen Angeboten und Verkäufen, live über die offizielle eBay-API – nicht auf Schätzungen aus dem Bauch.",
      },
      {
        title: "Break-even inklusive Gebühren",
        text: "Jede Chance zeigt den Preis, ab dem du keinen Verlust machst – mit Marktplatzgebühren, Versand und Steuern eingerechnet.",
      },
      {
        title: "Gewinnwahrscheinlichkeit in Prozent",
        text: "Eine Leiste von Rot bis Grün zeigt, wie wahrscheinlich der Wiederverkauf über deinem Mindestgewinn liegt.",
      },
      {
        title: "Kaufen und einstellen",
        text: "Ein Klick öffnet das Händlerangebot und bucht den Kauf ins Portfolio, ein zweiter erstellt das eBay-Angebot über die API.",
      },
    ],
    sections: [
      { type: "h2", text: "Was eine Arbitrage Software leisten muss" },
      {
        type: "p",
        text: "Online-Arbitrage klingt einfach: günstig im Shop kaufen, teurer auf einem Marktplatz verkaufen. In der Praxis scheitert es selten am Finden eines niedrigen Preises, sondern an der Rechnung danach. Gebühren, Versandkosten, Umsatzsteuer und vor allem die Frage, ob sich der Artikel überhaupt zum erhofften Preis verkauft, entscheiden über Gewinn oder Lagerhüter. Ein gutes **Online-Arbitrage-Tool** beantwortet deshalb drei Fragen gleichzeitig: Wo ist die Preisdifferenz? Was bleibt nach allen Kosten übrig? Und wie schnell dreht sich die Ware?",
      },
      {
        type: "p",
        text: "Arbitrage Radar vergleicht dafür Händlerpreise mit Marktplätzen wie eBay, Amazon, Kaufland, StockX und Cardmarket. Jede gefundene Differenz wird als Chance angelegt und vollständig durchgerechnet, bevor sie in deinem Dashboard erscheint.",
      },
      { type: "h2", text: "So arbeitet der Arbitrage Finder" },
      {
        type: "ol",
        items: [
          "**Scannen:** Händlerangebote und Marktplatz-Listings werden laufend abgeglichen, sortiert nach neun anklickbaren Kategorien.",
          "**Rechnen:** Für jede Preisdifferenz ermittelt das System den Break-even inklusive Gebühren, Versand und Steuern sowie einen Zielpreis aus aktuellen Marktangeboten.",
          "**Bewerten:** Aus Zielpreis, Break-even und Abverkaufsquote der letzten 30 Tage entsteht eine Gewinnwahrscheinlichkeit zwischen 1 und 97 %.",
          "**Handeln:** Mit „Kaufen auf Knopfdruck“ öffnest du das Händlerangebot, mit „Einstellen auf Knopfdruck“ entsteht dein eBay-Listing.",
        ],
      },
      { type: "h3", text: "Wie die Gewinnwahrscheinlichkeit entsteht" },
      {
        type: "p",
        text: "Die Prozentzahl beschreibt, wie wahrscheinlich der erzielbare Verkaufspreis mindestens den Break-even plus Mindestgewinn erreicht. Als Mindestgewinn gilt der höhere Wert aus 5 € oder 5 % des Einkaufs. Gewichtet wird das Ergebnis mit der Abverkaufsquote: Ein Artikel mit großer Marge, der sich kaum verkauft, landet bewusst weiter im roten Bereich als ein knapper, aber schnell drehender Deal. Nach oben ist der Wert bei 97 % gedeckelt, weil es im Handel keine Sicherheit gibt.",
      },
      { type: "h2", text: "Arbitrage Deals finden: neun Kategorien im Überblick" },
      {
        type: "table",
        head: ["Kategorie", "Typische Chancen", "Ab Tarif"],
        rows: [
          ["Elektronik", "Kopfhörer, Smartwatches, Zubehör aus Aktionen", "Starter"],
          ["Gaming", "Konsolen, Controller, Spiele-Editionen", "Starter"],
          ["Sneaker & Mode", "Releases und Restgrößen mit StockX-Bezug", "Starter"],
          ["Sammlerstücke", "Trading Cards, LEGO, Figuren", "Starter"],
          ["Haushalt", "Küchengeräte und Markenartikel im Abverkauf", "Starter"],
          ["Werkzeug", "Akkugeräte und Sets aus Baumarkt-Aktionen", "Starter"],
          ["Dienstleistungen", "Leistungen mit Preisgefälle zwischen Anbietern", "Starter"],
          ["Vorbestellungen", "Limitierte Artikel vor Erscheinen", "Pro"],
          ["Insolvenzmassen", "Warenlager und Maschinen aus Verwertungen", "Business oder Add-on"],
        ],
      },
      {
        type: "p",
        text: "Du klickst eine Kategorie an und siehst nur die Chancen, die zu deinem Sortiment und Lager passen. Wer gerade erst anfängt, findet in der [Online-Arbitrage-Anleitung](/ratgeber/online-arbitrage-anleitung/) einen strukturierten Einstieg.",
      },
      {
        type: "tip",
        title: "Tipp: Erst filtern, dann kaufen",
        text: "Sortiere nach Gewinnwahrscheinlichkeit statt nach absoluter Marge. Zehn Deals mit 80 % und 15 € Gewinn sind meist planbarer als ein einzelner Deal mit 30 % und 120 € Gewinn.",
      },
      { type: "h2", text: "Eigene Marktplatz-Konten sicher verbinden" },
      {
        type: "p",
        text: "Deine eBay- und Amazon-Verkäuferkonten verbindest du über das offizielle OAuth-Verfahren der Plattformen. Arbitrage Radar speichert keine Passwörter, Zugriffstoken liegen verschlüsselt auf Servern in Frankfurt, und du kannst die Verbindung jederzeit trennen. Für tiefere Amazon-Preishistorien hinterlegst du optional deinen eigenen Keepa-API-Schlüssel.",
      },
      { type: "h2", text: "Ehrlich zum Risiko" },
      {
        type: "p",
        text: "Auch die beste Arbitrage Software ist kein Gewinnversprechen. Preise ändern sich, Händler stornieren, Marktplätze passen Gebühren an. Die Gewinnwahrscheinlichkeit ist eine Schätzung auf Basis aktueller Marktdaten – sie hilft dir, bessere Entscheidungen zu treffen, ersetzt aber nicht dein Urteil. Wer regelmäßig mit Gewinnabsicht verkauft, betreibt in der Regel ein Gewerbe; was das steuerlich bedeutet, erklärt der Ratgeber zu [Reselling, Gewerbe und Steuern](/ratgeber/reselling-gewerbe-steuern/).",
      },
      { type: "h2", text: "Welcher Tarif passt?" },
      {
        type: "p",
        text: "Starter für 29 € im Monat deckt sieben Kategorien und einen Marktplatz ab. Pro für 79 € ergänzt Vorbestellungen, Autopilot, Preisautomatik mit Break-even-Schutz und drei Marktplätze. Business für 199 € bringt den Insolvenz-Finder, unbegrenzte Marktplätze, fünf Nutzer und API-Zugang. Alle Details findest du auf der [Preisseite](/preise/).",
      },
      {
        type: "cta",
        title: "Sieh dir echte Chancen an – ohne Anmeldung",
        text: "Das [Test-Dashboard](/demo/) zeigt dir die Top 3 Chancen je Kategorie inklusive Gewinnwahrscheinlichkeit. Wenn es passt, [startest du hier](/registrieren/) – monatlich kündbar, mit 14 Tagen Geld-zurück-Garantie.",
      },
    ],
    faq: [
      {
        q: "Was ist Online-Arbitrage?",
        a: "Bei Online-Arbitrage kaufst du Ware bei einem Onlinehändler günstig ein und verkaufst sie auf einem anderen Marktplatz teurer weiter. Der Gewinn ist die Differenz nach Abzug von Gebühren, Versand und Steuern. Entscheidend ist, dass sich die Ware zum erwarteten Preis auch tatsächlich verkauft.",
      },
      {
        q: "Ist Arbitrage in Deutschland legal?",
        a: "Ja, der Weiterverkauf regulär gekaufter Ware ist grundsätzlich erlaubt. Beachten musst du Markenrechte, Plattformregeln und bei regelmäßigem Verkauf die Pflicht zur Gewerbeanmeldung und Versteuerung. Einzelne Händler begrenzen außerdem Abgabemengen pro Kunde.",
      },
      {
        q: "Welche Arbitrage Software ist für Anfänger geeignet?",
        a: "Für den Einstieg eignet sich ein Tool, das Gebühren und Steuern automatisch einrechnet und die Erfolgschance verständlich darstellt. Arbitrage Radar zeigt dafür eine Leiste von Rot bis Grün mit Prozentwert. In der kostenlosen Demo siehst du ohne Anmeldung, wie das aussieht.",
      },
      {
        q: "Wie viel Startkapital brauche ich für Online-Arbitrage?",
        a: "Das hängt von deinen Kategorien ab, viele starten mit wenigen hundert Euro. Wichtiger als das Budget ist, Kapital nur in Deals mit hoher Abverkaufsquote zu binden. So kommt das Geld schnell zurück und kann erneut eingesetzt werden.",
      },
      {
        q: "Kann ich mit der Software automatisch kaufen und verkaufen?",
        a: "Im Pro-Tarif gibt es einen Autopiloten, der passende Chancen sofort kauft und einstellt. Ohne Autopilot öffnet „Kaufen auf Knopfdruck“ das Händlerangebot und „Einstellen auf Knopfdruck“ erstellt das eBay-Listing über die offizielle API.",
      },
    ],
    related: [
      "online-arbitrage-anleitung",
      "reselling-gewinn-berechnen",
      "reselling-gewerbe-steuern",
    ],
  },

  // ---------------------------------------------------------------------------
  // 2. Reselling Tool
  // ---------------------------------------------------------------------------
  {
    slug: "reselling-tool",
    title: "Reselling Tool – Produkte zum Wiederverkaufen finden",
    description:
      "Reselling Tool mit Gewinnwahrscheinlichkeit: Finde Produkte, die sich gewinnbringend weiterverkaufen lassen, und stelle sie per Klick ein. Demo ansehen.",
    eyebrow: "Reselling & Flipping",
    h1: "Das Reselling Tool für alle, die mit System weiterverkaufen",
    intro:
      "Reselling lebt von guten Einkäufen. Arbitrage Radar zeigt dir, welche Produkte sich gerade gewinnbringend weiterverkaufen lassen, wie schnell sie drehen und ab welchem Preis du im Plus bist. Vom Fund bis zum fertigen eBay-Angebot bleibt alles in einer Oberfläche.",
    keywords: [
      "reselling tool",
      "reseller software",
      "produkte zum wiederverkaufen finden",
      "flipping app",
      "was kann man gewinnbringend weiterverkaufen",
      "reselling app",
    ],
    benefits: [
      {
        title: "Ein Dashboard für alles",
        text: "Chancen, Käufe, Listings und Portfolio liegen an einem Ort – im Browser und optimiert fürs Smartphone.",
      },
      {
        title: "Abverkauf statt Bauchgefühl",
        text: "Die 30-Tage-Abverkaufsquote zeigt, ob ein Artikel wirklich gefragt ist oder nur viele Angebote hat.",
      },
      {
        title: "Listing in Sekunden",
        text: "„Einstellen auf Knopfdruck“ erzeugt dein eBay-Angebot über die offizielle API, ohne Copy-and-paste.",
      },
      {
        title: "Preise, die sich anpassen",
        text: "Die Preisautomatik im Pro-Tarif reagiert auf den Markt und fällt nie unter deinen Break-even.",
      },
    ],
    sections: [
      { type: "h2", text: "Was kann man gewinnbringend weiterverkaufen?" },
      {
        type: "p",
        text: "Die ehrliche Antwort: Es hängt vom Moment ab. Ein Akkuschrauber kann in einer Baumarkt-Aktion ein Schnäppchen sein und zwei Wochen später zum Normalpreis keinen Spielraum mehr bieten. Trading Cards steigen nach einem Turnier, Sneaker fallen nach einem Restock. Wer dauerhaft erfolgreich resellt, braucht deshalb keinen statischen Produkttipp, sondern einen aktuellen Blick auf Angebot, Nachfrage und Kosten. Genau das liefert eine **Reseller Software**, die Händler- und Marktplatzpreise laufend abgleicht.",
      },
      {
        type: "p",
        text: "Arbitrage Radar ordnet alle Funde in neun Kategorien – von Elektronik über Sneaker & Mode bis zu Werkzeug und Sammlerstücken. Du klickst die Bereiche an, in denen du dich auskennst, und blendest den Rest aus.",
      },
      { type: "h2", text: "Vom Fund zum Verkauf: der Reselling-Workflow" },
      {
        type: "table",
        head: ["Schritt", "Ohne Tool", "Mit Arbitrage Radar"],
        rows: [
          ["Produkt finden", "Prospekte, Foren, Zufall", "Chancen nach Kategorie, sortiert nach Wahrscheinlichkeit"],
          ["Preis prüfen", "Verkaufte Angebote manuell durchsuchen", "Zielpreis aus aktuellen Marktangeboten"],
          ["Kosten rechnen", "Tabelle, oft ohne Steuern", "Break-even inkl. Gebühren, Versand und Steuern"],
          ["Kaufen", "Shop suchen, Kauf notieren", "Händlerangebot öffnen, Kauf landet im Portfolio"],
          ["Einstellen", "Listing von Hand anlegen", "eBay-Angebot per API mit einem Klick"],
          ["Preis pflegen", "Regelmäßig nachsehen", "Preisautomatik mit Break-even-Schutz (Pro)"],
        ],
      },
      { type: "h3", text: "Warum die Abverkaufsquote so wichtig ist" },
      {
        type: "p",
        text: "Viele Reseller schauen nur auf die Marge. Gefährlicher als eine kleine Marge ist aber Ware, die liegen bleibt: Sie bindet Geld, Lagerplatz und Aufmerksamkeit. Deshalb gewichtet Arbitrage Radar die Gewinnwahrscheinlichkeit mit der Abverkaufsquote der letzten 30 Tage. Ein Produkt mit vielen aktiven Angeboten und wenigen Verkäufen rutscht automatisch Richtung Rot – auch wenn der Preisabstand verlockend aussieht.",
      },
      {
        type: "tip",
        title: "Tipp: Starte mit einer Nische",
        text: "Wähle zum Start ein bis zwei Kategorien, in denen du Zustand und Echtheit sicher beurteilen kannst. Fachwissen schützt dich vor Fehlkäufen besser als jede Statistik.",
      },
      { type: "h2", text: "Welche Produkte sich für den Einstieg eignen" },
      {
        type: "ul",
        items: [
          "**Kleine, robuste Artikel:** Zubehör, Spiele oder Werkzeugsets lassen sich günstig versenden und kommen selten beschädigt an.",
          "**Bekannte Marken:** Käufer suchen gezielt nach Markennamen, das erhöht die Abverkaufsquote und erleichtert die Preisfindung.",
          "**Neuware mit Rechnung:** Originalverpackte Ware mit Kaufbeleg lässt sich ehrlicher beschreiben und sorgt für weniger Rückfragen.",
          "**Mittlere Preisklasse:** Artikel zwischen etwa 30 und 150 € binden wenig Kapital und lassen trotzdem genug Spielraum für Gebühren.",
        ],
      },
      {
        type: "p",
        text: "Sperrige oder sehr teure Ware ist nicht verboten, erhöht aber Versandaufwand und Risiko. Steigere dich lieber Schritt für Schritt, sobald du deine Zahlen kennst.",
      },
      { type: "h2", text: "Flipping App für unterwegs" },
      {
        type: "p",
        text: "Das Dashboard ist für Smartphones optimiert. Du siehst neue Chancen unterwegs, prüfst die rot-grüne Leiste und entscheidest direkt. Mit dem Add-on Sofort-Alarm für 12 € im Monat wirst du benachrichtigt, sobald in deinen Kategorien eine neue Chance auftaucht – praktisch bei knappen Aktionen, die nach Minuten ausverkauft sind.",
      },
      { type: "h2", text: "Mehrere Marktplätze, ein Überblick" },
      {
        type: "p",
        text: "Du verbindest deine eigenen Verkäuferkonten bei eBay und Amazon über das offizielle OAuth-Verfahren – ohne Passwortweitergabe, mit verschlüsselten Tokens und jederzeit trennbar. Für Preisvergleiche berücksichtigt das System zusätzlich Kaufland, StockX und Cardmarket. Im Starter-Tarif nutzt du einen Marktplatz, im Pro-Tarif drei; jeder weitere kostet als Add-on 9 € im Monat.",
      },
      { type: "h3", text: "Gewinn realistisch einschätzen" },
      {
        type: "p",
        text: "Reselling ist Handel, und Handel hat Risiken: Rücksendungen, Preisstürze, Versandschäden. Die Prozentanzeige ist eine Schätzung, kein Versprechen. Wie du deine Marge sauber kalkulierst, zeigt der Ratgeber [Reselling-Gewinn berechnen](/ratgeber/reselling-gewinn-berechnen/). Sobald du regelmäßig verkaufst, gelten zudem gewerbliche Pflichten wie Gewerbeanmeldung, Umsatzsteuer und Widerrufsrecht für deine Kunden – mehr dazu unter [Reselling, Gewerbe und Steuern](/ratgeber/reselling-gewerbe-steuern/).",
      },
      { type: "h2", text: "Für Einzelkämpfer und Teams" },
      {
        type: "p",
        text: "Starter (29 €/Monat) ist für den Nebenerwerb gedacht, Pro (79 €/Monat) für alle, die Autopilot und Preisautomatik nutzen wollen. Business (199 €/Monat) erlaubt fünf Nutzer, unbegrenzte Marktplätze und API-Zugang für eigene Auswertungen. Im Jahrestarif zahlst du zehn Monatspreise für zwölf Monate. Alle Optionen im Vergleich findest du auf der [Preisseite](/preise/).",
      },
      {
        type: "cta",
        title: "Teste das Reselling Tool kostenlos",
        text: "Öffne das [Test-Dashboard](/demo/) und sieh dir die Top 3 Chancen jeder Kategorie an – ohne Konto. Überzeugt? Dann [registriere dich](/registrieren/) mit 14 Tagen Geld-zurück-Garantie.",
      },
    ],
    faq: [
      {
        q: "Was lohnt sich zum Wiederverkaufen?",
        a: "Lohnend sind Produkte mit stabiler Nachfrage und einem Preisabstand, der nach Gebühren, Versand und Steuern noch Gewinn lässt. Das ändert sich ständig, typisch sind Elektronik, Gaming, Sneaker, LEGO und Trading Cards. Ein Tool mit aktuellen Marktpreisen zeigt dir, was gerade funktioniert.",
      },
      {
        q: "Wie finde ich Produkte zum Wiederverkaufen?",
        a: "Du vergleichst Einkaufspreise bei Händlern mit tatsächlich erzielbaren Preisen auf Marktplätzen. Manuell ist das sehr zeitaufwendig. Arbitrage Radar erledigt den Abgleich automatisch und sortiert die Ergebnisse nach Kategorie und Gewinnwahrscheinlichkeit.",
      },
      {
        q: "Muss ich als Reseller ein Gewerbe anmelden?",
        a: "Wer regelmäßig und mit Gewinnabsicht Ware einkauft und weiterverkauft, handelt in der Regel gewerblich und muss ein Gewerbe anmelden. Damit kommen Steuerpflichten und Verbraucherrechte wie das Widerrufsrecht hinzu. Im Zweifel klärst du das mit deinem Steuerberater.",
      },
      {
        q: "Gibt es eine Reselling App für das Handy?",
        a: "Arbitrage Radar läuft als Web-App im Browser und ist für Smartphones optimiert. Du brauchst keine Installation, sondern meldest dich einfach an. Mit dem Add-on Sofort-Alarm erfährst du neue Chancen sofort.",
      },
      {
        q: "Wie viel kostet die Reseller Software?",
        a: "Die Tarife beginnen bei 29 € im Monat (Starter), Pro kostet 79 € und Business 199 €. Alle Tarife sind monatlich kündbar, und es gilt eine 14-tägige Geld-zurück-Garantie.",
      },
    ],
    related: [
      "reselling-gewinn-berechnen",
      "reselling-gewerbe-steuern",
      "ebay-gebuehren-reselling",
    ],
  },

  // ---------------------------------------------------------------------------
  // 3. Amazon eBay Arbitrage
  // ---------------------------------------------------------------------------
  {
    slug: "amazon-ebay-arbitrage",
    title: "Amazon eBay Arbitrage – Preise vergleichen, Gewinn sehen",
    description:
      "Amazon eBay Arbitrage mit Live-Daten: Vergleiche Preise, analysiere eBay-Verkaufspreise und sieh deinen Gewinn nach Gebühren. Jetzt Demo öffnen.",
    eyebrow: "Marktplatz-Arbitrage",
    h1: "Amazon eBay Arbitrage mit echten Verkaufsdaten",
    intro:
      "Zwischen Amazon und eBay liegen oft spürbare Preisunterschiede – in beide Richtungen. Arbitrage Radar vergleicht die Preise automatisch, zieht aktuelle eBay-Marktdaten über die offizielle API und zeigt dir, was nach allen Gebühren übrig bleibt.",
    keywords: [
      "amazon ebay arbitrage",
      "preisvergleich ebay amazon",
      "ebay verkaufspreise analysieren",
      "amazon zu ebay",
      "ebay zu amazon",
      "marktplatz arbitrage",
    ],
    benefits: [
      {
        title: "Offizielle eBay-API",
        text: "Marktpreise kommen live über die offizielle Schnittstelle von eBay – kein Scraping, keine veralteten Listen.",
      },
      {
        title: "Deine Konten, sicher verbunden",
        text: "eBay und Amazon verbindest du per OAuth. Es werden keine Passwörter gespeichert, Tokens liegen verschlüsselt in Frankfurt.",
      },
      {
        title: "Keepa auf Wunsch",
        text: "Mit deinem eigenen Keepa-API-Schlüssel fließen Amazon-Preisverläufe direkt in die Bewertung ein.",
      },
      {
        title: "Gebühren beider Seiten",
        text: "Der Break-even berücksichtigt die Gebühren des Zielmarktplatzes, Versand und Steuern – für jede Richtung separat.",
      },
    ],
    sections: [
      { type: "h2", text: "Warum Amazon und eBay unterschiedlich bepreist sind" },
      {
        type: "p",
        text: "Amazon und eBay sprechen unterschiedliche Käufer an und funktionieren nach eigenen Regeln. Auf Amazon entscheidet oft die Buy Box, Preise schwanken mit Lagerbestand und Algorithmen. Auf eBay prägen Sofort-Kaufen-Angebote, Auktionen und private Verkäufer das Bild. Dadurch entstehen regelmäßig Lücken: Ein Artikel ist bei Amazon kurzfristig reduziert und auf eBay stabil teurer – oder umgekehrt, wenn bei eBay ein Restposten günstig angeboten wird, während Amazon knapp ist.",
      },
      { type: "h2", text: "Preisvergleich eBay Amazon: beide Richtungen" },
      {
        type: "table",
        head: ["Richtung", "Typischer Anlass", "Worauf du achten musst"],
        rows: [
          ["Amazon zu eBay", "Blitzangebote, Preisfehler, Aktionsrabatte", "Abgabemengen, Lieferzeit, eBay-Gebühren"],
          ["eBay zu Amazon", "Restposten, Neuware von Händlern mit Überbestand", "Zustand, Rechnung, Amazon-Kategoriefreigaben"],
          ["Shop zu eBay/Amazon", "Händleraktionen bei Elektronik, Werkzeug, Haushalt", "Versandkosten und Retourenquote"],
        ],
      },
      {
        type: "p",
        text: "Arbitrage Radar zieht zusätzlich Kaufland, StockX und Cardmarket heran. So erkennst du, ob ein Preisabstand nur zwischen zwei Plattformen existiert oder ob der Artikel generell unterbewertet ist.",
      },
      { type: "h2", text: "eBay-Verkaufspreise analysieren – ohne Handarbeit" },
      {
        type: "p",
        text: "Wer eBay-Preise manuell prüft, filtert nach verkauften Artikeln, sortiert Ausreißer aus und schätzt einen fairen Wert. Das dauert pro Produkt mehrere Minuten. Arbitrage Radar übernimmt diesen Schritt: Aus aktuellen Marktangeboten wird ein Zielpreis gebildet, ergänzt um die Abverkaufsquote der letzten 30 Tage. Beides fließt in die Gewinnwahrscheinlichkeit, die als Leiste von Rot bis Grün mit Prozentwert angezeigt wird.",
      },
      { type: "h3", text: "Rechenbeispiel Amazon zu eBay" },
      {
        type: "table",
        head: ["Posten", "Betrag"],
        rows: [
          ["Einkauf bei Amazon", "84,99 €"],
          ["Zielpreis eBay laut Marktdaten", "119,00 €"],
          ["eBay-Gebühren (beispielhaft)", "ca. 15,50 €"],
          ["Versand und Verpackung", "6,50 €"],
          ["Gewinn vor Steuern", "ca. 12,00 €"],
          ["Mindestgewinn (5 € oder 5 %)", "5,00 €"],
        ],
      },
      {
        type: "p",
        text: "Die Zahlen sind ein vereinfachtes Beispiel; je nach Kategorie, Verkäuferstatus und Steuersituation fällt das Ergebnis anders aus. Die aktuellen Gebührenmodelle erklärt der Ratgeber zu [eBay-Gebühren beim Reselling](/ratgeber/ebay-gebuehren-reselling/).",
      },
      {
        type: "tip",
        title: "Tipp: Lieferzeit mitdenken",
        text: "Stelle bei Amazon-zu-eBay-Deals erst ein, wenn die Ware bei dir angekommen ist – oder gib eine realistische Bearbeitungszeit an. Verspätete Lieferungen kosten schneller Bewertungen als ein paar Euro Marge.",
      },
      { type: "h3", text: "Mehr als zwei Plattformen im Blick" },
      {
        type: "p",
        text: "Nicht jeder Artikel verkauft sich auf eBay oder Amazon am besten. Sneaker erzielen auf StockX oft andere Preise, Trading Cards werden auf Cardmarket gehandelt, und Kaufland bietet bei Haushalt und Elektronik eine wachsende Käuferschaft mit eigenen Gebühren. Arbitrage Radar bezieht diese Marktplätze in den Preisvergleich ein und zeigt dir, wo der Zielpreis am höchsten liegt. So entscheidest du nicht nur, ob ein Deal lohnt, sondern auch, wo du ihn verkaufst. Mit dem Add-on für zusätzliche Marktplätze (9 € pro Monat) erweiterst du dein Kontingent, ohne den Tarif zu wechseln.",
      },
      { type: "h2", text: "Vom Vergleich zum Listing" },
      {
        type: "ol",
        items: [
          "Du verbindest dein eBay-Verkäuferkonto und optional dein Amazon-Konto per OAuth.",
          "Im Dashboard filterst du nach Kategorie und Gewinnwahrscheinlichkeit.",
          "„Kaufen auf Knopfdruck“ öffnet das Angebot beim Händler und erfasst den Kauf im Portfolio.",
          "„Einstellen auf Knopfdruck“ erstellt das eBay-Angebot über die API.",
          "Im Pro-Tarif hält die Preisautomatik dein Angebot marktgerecht, ohne den Break-even zu unterschreiten.",
        ],
      },
      { type: "h2", text: "Risiken und Pflichten" },
      {
        type: "p",
        text: "Marktplatz-Arbitrage ist kein Selbstläufer. Plattformen können Angebote einschränken, Preise drehen innerhalb von Stunden, und manche Marken sind auf Amazon nur mit Freigabe verkäuflich. Die Prozentanzeige bleibt eine Schätzung auf Basis aktueller Daten. Als gewerblicher Verkäufer musst du außerdem Impressum, Widerrufsbelehrung und Steuern im Griff haben – Hinweise dazu im Ratgeber [Reselling, Gewerbe und Steuern](/ratgeber/reselling-gewerbe-steuern/).",
      },
      {
        type: "p",
        text: "Starter (29 €/Monat) enthält einen Marktplatz, Pro (79 €/Monat) drei – ideal, um eBay und Amazon parallel zu bedienen. Alle Tarife und Add-ons stehen auf der [Preisseite](/preise/).",
      },
      {
        type: "cta",
        title: "Prüfe die aktuellen Amazon-eBay-Chancen",
        text: "Im kostenlosen [Test-Dashboard](/demo/) siehst du die Top 3 Chancen je Kategorie mit Live-Marktpreisen. Mehr Hintergrund zur Methode liefert die Seite zur [Arbitrage Software](/arbitrage-software/).",
      },
    ],
    faq: [
      {
        q: "Lohnt sich Arbitrage zwischen Amazon und eBay noch?",
        a: "Ja, aber nur mit sauberer Kalkulation. Preisunterschiede gibt es weiterhin, sie sind aber oft klein und schnell wieder weg. Wer Gebühren, Versand und Abverkauf exakt einrechnet und schnell handelt, findet regelmäßig lohnende Deals.",
      },
      {
        q: "Darf ich Ware von Amazon auf eBay weiterverkaufen?",
        a: "Grundsätzlich ja, wenn du die Ware regulär gekauft hast und sie selbst versendest. Problematisch ist Dropshipping direkt von Amazon an deinen eBay-Kunden, das eBay in vielen Fällen untersagt. Bei regelmäßigen Verkäufen gelten zudem gewerbliche Pflichten.",
      },
      {
        q: "Wie finde ich heraus, für wie viel ein Artikel auf eBay verkauft wurde?",
        a: "Manuell nutzt du in der eBay-Suche den Filter für verkaufte Artikel. Arbitrage Radar bildet den Zielpreis automatisch aus aktuellen Marktdaten der offiziellen eBay-API und ergänzt die Abverkaufsquote der letzten 30 Tage.",
      },
      {
        q: "Muss ich mein Amazon-Passwort eingeben?",
        a: "Nein. Die Verbindung läuft über das offizielle OAuth-Verfahren von Amazon und eBay. Arbitrage Radar speichert keine Passwörter, die Zugriffstoken sind verschlüsselt, und du kannst die Verbindung jederzeit trennen.",
      },
      {
        q: "Brauche ich Keepa für Amazon-Arbitrage?",
        a: "Keepa ist hilfreich, um Preisverläufe bei Amazon zu sehen, aber nicht zwingend. Wenn du einen eigenen Keepa-API-Schlüssel hast, kannst du ihn in Arbitrage Radar hinterlegen, damit die Historie in die Bewertung einfließt.",
      },
    ],
    related: [
      "ebay-gebuehren-reselling",
      "online-arbitrage-anleitung",
      "reselling-gewinn-berechnen",
    ],
  },

  // ---------------------------------------------------------------------------
  // 4. Insolvenzmasse kaufen
  // ---------------------------------------------------------------------------
  {
    slug: "insolvenzmasse-kaufen",
    title: "Insolvenzmasse kaufen – Warenlager & Maschinen finden",
    description:
      "Insolvenzmasse kaufen mit Plan: Finde Warenlager und Maschinen aus Insolvenzauktionen und erhalte ein empfohlenes Maximalgebot. Jetzt Demo ansehen.",
    eyebrow: "Insolvenz-Finder",
    h1: "Insolvenzmasse kaufen, ohne blind zu bieten",
    intro:
      "Wenn Unternehmen aufgeben, werden Warenlager, Restposten und Maschinen verwertet – oft deutlich unter Marktwert. Der Insolvenz-Finder von Arbitrage Radar sammelt passende Verwertungen, schätzt den Wiederverkaufswert und berechnet, bis zu welchem Gebot sich ein Los noch lohnt.",
    keywords: [
      "insolvenzmasse kaufen",
      "insolvenzware kaufen",
      "insolvenzauktionen finden",
      "insolvenz restposten",
      "warenlager aus insolvenz",
      "insolvenzversteigerung",
    ],
    benefits: [
      {
        title: "Verwertungen gebündelt",
        text: "Hinweise aus Insolvenzbekanntmachungen und Auktionen von Verwertern landen sortiert in einer Liste.",
      },
      {
        title: "Empfohlenes Maximalgebot",
        text: "Für jedes Los rechnet das System ein Höchstgebot, das rund 20 % Marge nach allen Kosten lassen soll.",
      },
      {
        title: "Wiederverkaufswert geprüft",
        text: "Enthaltene Artikel werden mit aktuellen Marktpreisen abgeglichen, inklusive Abverkaufsquote.",
      },
      {
        title: "Bietlimit gespeichert",
        text: "Dein Limit bleibt am Los hinterlegt, damit du im Auktionsfieber nicht über dein Budget gehst.",
      },
    ],
    sections: [
      { type: "h2", text: "Was ist Insolvenzmasse – und wer verkauft sie?" },
      {
        type: "p",
        text: "Zur Insolvenzmasse gehört alles, was ein insolventes Unternehmen besitzt: Lagerware, Fahrzeuge, Büroausstattung, Maschinen. Der Insolvenzverwalter muss diese Werte zugunsten der Gläubiger zu Geld machen. Häufig beauftragt er dafür spezialisierte Verwerter, die Lose online versteigern oder per Freihandverkauf anbieten. Für Käufer entsteht so ein eigener Markt, in dem **Insolvenzware** oft unter dem Preis landet, den sie im regulären Handel erzielt.",
      },
      {
        type: "p",
        text: "Das Problem: Die Angebote sind über viele Auktionshäuser verstreut, die Losbeschreibungen knapp und die Fristen kurz. Wer Insolvenzauktionen finden will, verbringt viel Zeit mit Suchen – und weiß am Ende trotzdem nicht, ob sich ein Gebot lohnt.",
      },
      { type: "h2", text: "So hilft der Insolvenz-Finder" },
      {
        type: "ol",
        items: [
          "**Finden:** Relevante Verwertungen aus Insolvenzbekanntmachungen und Verwerter-Auktionen werden gesammelt und nach Warengruppen sortiert.",
          "**Bewerten:** Enthaltene Artikel werden mit aktuellen Marktpreisen verglichen, inklusive Abverkaufsquote und Gebühren für den späteren Verkauf.",
          "**Limit setzen:** Das System schlägt ein Maximalgebot vor, das nach Aufgeld, Transport und Verkaufskosten etwa 20 % Marge übrig lassen soll.",
          "**Bieten:** Du bietest selbst beim Auktionshaus. Arbitrage Radar speichert dein Bietlimit und das Ergebnis im Portfolio.",
        ],
      },
      { type: "h3", text: "Welche Kosten in das Maximalgebot einfließen" },
      {
        type: "table",
        head: ["Kostenblock", "Typischer Inhalt"],
        rows: [
          ["Aufgeld", "Prozentualer Zuschlag des Auktionshauses auf den Zuschlagspreis"],
          ["Umsatzsteuer", "Auf Zuschlag und Aufgeld, abhängig vom Verfahren"],
          ["Abholung und Transport", "Spedition, Verladung, ggf. Demontage bei Maschinen"],
          ["Lager und Aufbereitung", "Sortieren, Prüfen, Fotografieren, Verpacken"],
          ["Verkaufskosten", "Marktplatzgebühren, Versand, Retouren"],
        ],
      },
      {
        type: "p",
        text: "Den genauen Ablauf einer Verwertung – von der Besichtigung bis zur Abholung – beschreibt der Ratgeber [Insolvenzversteigerung: Ablauf](/ratgeber/insolvenzversteigerung-ablauf/).",
      },
      {
        type: "tip",
        title: "Tipp: Besichtigungstermine nutzen",
        text: "Viele Verwerter bieten Besichtigungen an. Gerade bei Maschinen und gemischten Warenlagern lohnt sich der Blick vor Ort: Zustand, Vollständigkeit und Abbauaufwand lassen sich aus Fotos selten sicher beurteilen.",
      },
      { type: "h2", text: "Insolvenz-Restposten: Wofür sich das lohnt" },
      {
        type: "ul",
        items: [
          "**Warenlager im Einzelhandel:** Neuware in Originalverpackung lässt sich oft direkt über Marktplätze weiterverkaufen.",
          "**Werkzeug und Maschinen:** Gewerbliche Käufer suchen gezielt gebrauchte Markengeräte, die Nachfrage ist stabil.",
          "**Elektronik und Zubehör:** Hohe Stückzahlen, aber genau auf Vollständigkeit und Garantielage achten.",
          "**Gemischte Lose:** Höheres Risiko, dafür oft niedrige Zuschläge – hier ist das Bietlimit besonders wichtig.",
        ],
      },
      { type: "h3", text: "Checkliste vor dem ersten Gebot" },
      {
        type: "ul",
        items: [
          "Auktionsbedingungen lesen: Höhe des Aufgelds, Zahlungsfrist, Abholfenster.",
          "Prüfen, ob das Los an Privatpersonen oder nur an Gewerbetreibende verkauft wird.",
          "Transport vorab klären, besonders bei Paletten und schweren Maschinen.",
          "Lagerplatz für die gesamte Menge sicherstellen, bevor der Zuschlag kommt.",
          "Bietlimit aus dem Insolvenz-Finder übernehmen und nicht nachträglich anheben.",
        ],
      },
      { type: "h2", text: "Risiken realistisch einschätzen" },
      {
        type: "p",
        text: "Insolvenzware wird meist wie besehen verkauft, ohne Gewährleistung. Losbeschreibungen können unvollständig sein, Abholfristen sind streng, und große Mengen brauchen Lagerplatz und Zeit für den Abverkauf. Das empfohlene Maximalgebot ist eine Kalkulationshilfe, keine Zusage über das Ergebnis. Wenn du Lose gewerblich weiterverkaufst, gelten die üblichen steuerlichen Pflichten; einen Überblick gibt der Artikel zu [Reselling, Gewerbe und Steuern](/ratgeber/reselling-gewerbe-steuern/).",
      },
      {
        type: "p",
        text: "Gerade bei gemischten Losen lohnt es sich, die Bewertung im Dashboard nicht nur als Ja-Nein-Signal zu lesen. Schau dir an, welche Positionen den Wert tragen: Oft machen wenige gefragte Artikel den Großteil des erwarteten Erlöses aus, während der Rest kaum Abnehmer findet. Diese Restmenge solltest du mit Lagerkosten und Zeitaufwand bewusst einplanen.",
      },
      { type: "h2", text: "Verfügbarkeit und Preis" },
      {
        type: "p",
        text: "Der Insolvenz-Finder ist im Business-Tarif für 199 € im Monat enthalten, zusammen mit unbegrenzten Marktplätzen, fünf Nutzern und API-Zugang. Nutzt du Starter oder Pro, buchst du ihn als Add-on für 49 € im Monat dazu. Alle Kombinationen findest du auf der [Preisseite](/preise/). Wer Lose zerlegt und einzeln verkauft, profitiert zusätzlich vom Preisvergleich der [Amazon-eBay-Arbitrage](/amazon-ebay-arbitrage/).",
      },
      {
        type: "cta",
        title: "Sieh dir aktuelle Insolvenzmassen an",
        text: "Das [Test-Dashboard](/demo/) zeigt auch in der Kategorie Insolvenzmassen die Top 3 Chancen samt Maximalgebot – kostenlos und ohne Anmeldung. Danach kannst du dich direkt [registrieren](/registrieren/).",
      },
    ],
    faq: [
      {
        q: "Wo kann man Insolvenzmasse kaufen?",
        a: "Insolvenzmasse wird über Insolvenzverwalter und von ihnen beauftragte Verwerter verkauft, meist in Online-Auktionen oder per Freihandverkauf. Hinweise auf Verfahren finden sich in den amtlichen Insolvenzbekanntmachungen. Der Insolvenz-Finder bündelt passende Verwertungen an einer Stelle.",
      },
      {
        q: "Kann man als Privatperson Insolvenzware kaufen?",
        a: "Ja, viele Insolvenzauktionen stehen auch Privatpersonen offen. Manche Lose richten sich ausschließlich an gewerbliche Käufer. Beachte, dass Insolvenzware meist ohne Gewährleistung verkauft wird.",
      },
      {
        q: "Wie viel sollte ich bei einer Insolvenzauktion bieten?",
        a: "Dein Gebot sollte nach Aufgeld, Steuern, Transport und Verkaufskosten noch genügend Marge lassen. Arbitrage Radar empfiehlt ein Maximalgebot, das rund 20 % Marge übrig lassen soll, und speichert es als Bietlimit. Bieten musst du selbst beim Auktionshaus.",
      },
      {
        q: "Was ist das Aufgeld bei Insolvenzversteigerungen?",
        a: "Das Aufgeld ist ein prozentualer Zuschlag, den das Auktionshaus zusätzlich zum Zuschlagspreis berechnet. Seine Höhe steht in den Auktionsbedingungen. Es gehört unbedingt in deine Kalkulation.",
      },
      {
        q: "Ist Insolvenzware neu oder gebraucht?",
        a: "Beides kommt vor. Warenlager aus dem Handel enthalten oft Neuware, Betriebsausstattung und Maschinen sind meist gebraucht. Die Losbeschreibung und eine Besichtigung geben Aufschluss über den Zustand.",
      },
    ],
    related: [
      "insolvenzversteigerung-ablauf",
      "reselling-gewinn-berechnen",
      "reselling-gewerbe-steuern",
    ],
  },

  // ---------------------------------------------------------------------------
  // 5. Vorbestellung Arbitrage
  // ---------------------------------------------------------------------------
  {
    slug: "vorbestellung-arbitrage",
    title: "Limitierte Vorbestellungen gewinnbringend wiederverkaufen",
    description:
      "Vorbestellen und teurer verkaufen: Erkenne limitierte Konsolen, Sneaker und LEGO-Sets mit Resell-Potenzial früh und bewerte das Risiko. Demo testen.",
    eyebrow: "Vorbestellungen",
    h1: "Limitierte Vorbestellungen erkennen, bevor der Resell-Preis steigt",
    intro:
      "Manche limitierten Artikel werden nach Erscheinen deutlich über dem Ladenpreis gehandelt – einzelne bis etwa zum Doppelten. Arbitrage Radar zeigt dir Vorbestellungen mit Resell-Potenzial, schätzt den späteren Marktpreis und bewertet, wie wahrscheinlich sich die Vorbestellung lohnt.",
    keywords: [
      "limitierte vorbestellung wiederverkaufen",
      "vorbestellen und teurer verkaufen",
      "limited edition reselling",
      "konsole vorbestellen resell",
      "sneaker vorbestellen resell",
      "lego vorbestellen wiederverkaufen",
    ],
    benefits: [
      {
        title: "Früh informiert",
        text: "Vorbestellchancen erscheinen in einer eigenen Kategorie, sobald Händler sie anbieten.",
      },
      {
        title: "Resell-Preis geschätzt",
        text: "Der Zielpreis orientiert sich an aktuellen Marktangeboten, etwa auf eBay, StockX oder Cardmarket.",
      },
      {
        title: "Risiko sichtbar",
        text: "Die Leiste von Rot bis Grün zeigt, wie wahrscheinlich der spätere Preis über Break-even plus Mindestgewinn liegt.",
      },
      {
        title: "Kapital im Blick",
        text: "Alle Vorbestellungen landen im Portfolio – mit Lieferdatum, Einkaufspreis und aktuellem Marktwert.",
      },
    ],
    sections: [
      { type: "h2", text: "Warum limitierte Vorbestellungen im Wert steigen können" },
      {
        type: "p",
        text: "Wenn ein Hersteller eine Sonderedition ankündigt, ist die Stückzahl oft begrenzt und die Nachfrage größer als das Angebot. Wer am Erscheinungstag leer ausgeht, kauft auf dem Zweitmarkt – und zahlt dort einen Aufschlag. Das betrifft regelmäßig Konsolen-Bundles, Sneaker-Collabs, LEGO-Sets mit Sammlerwert, Trading-Card-Displays oder Figuren. Bei einzelnen Artikeln lag der Marktpreis nach Erscheinen beim Doppelten des Ladenpreises; bei vielen anderen fällt der Aufschlag deutlich kleiner aus oder bleibt ganz aus.",
      },
      { type: "h2", text: "Vorbestellen und teurer verkaufen: worauf es ankommt" },
      {
        type: "table",
        head: ["Signal", "Spricht für Resell-Potenzial", "Spricht dagegen"],
        rows: [
          ["Stückzahl", "Offiziell limitiert oder nummeriert", "Unbegrenzte Produktion, Nachproduktion angekündigt"],
          ["Vertrieb", "Nur über wenige Händler oder per Verlosung", "Breit im Handel verfügbar"],
          ["Marke und Lizenz", "Starke Sammler-Community", "Neue Lizenz ohne Fanbasis"],
          ["Vorverkauf", "Händler schnell ausverkauft", "Lange lieferbar, Rabatte vor Release"],
          ["Zweitmarkt", "Vorab-Angebote über Ladenpreis", "Viele Angebote zum Ladenpreis"],
        ],
      },
      {
        type: "p",
        text: "Arbitrage Radar wertet solche Signale zusammen mit vorhandenen Marktangeboten aus und berechnet daraus die Gewinnwahrscheinlichkeit. Hintergrundwissen zu Editionen, Sammlermärkten und Timing liefert der Ratgeber [Limitierte Editionen wiederverkaufen](/ratgeber/limitierte-editionen-wiederverkaufen/).",
      },
      { type: "h3", text: "Konsole, Sneaker, LEGO: drei Märkte, drei Dynamiken" },
      {
        type: "ul",
        items: [
          "**Konsolen und Gaming-Editionen:** Der Aufschlag ist meist kurz nach Release am höchsten und sinkt, sobald nachgeliefert wird. Schneller Verkauf ist hier wichtiger als Abwarten.",
          "**Sneaker:** Preise hängen stark von Größe und Colorway ab. StockX-Daten zeigen, welche Größen gefragt sind.",
          "**LEGO und Sammlerstücke:** Oft eher ein Markt für Geduld – Wertsteigerungen zeigen sich häufig erst, wenn ein Set aus dem Handel verschwindet.",
        ],
      },
      {
        type: "tip",
        title: "Tipp: Exit-Zeitpunkt vorher festlegen",
        text: "Entscheide schon bei der Vorbestellung, ob du direkt nach Lieferung verkaufst oder bewusst lagerst. Ohne Plan wartet man leicht auf den Höchstpreis und verpasst das Fenster.",
      },
      { type: "h2", text: "Wie Arbitrage Radar Vorbestellungen bewertet" },
      {
        type: "p",
        text: "Bei bereits erhältlicher Ware gibt es einen laufenden Markt. Bei Vorbestellungen fehlt dieser noch, deshalb arbeitet die Bewertung mit den Daten, die vor Release verfügbar sind: aktuelle Angebotspreise auf Marktplätzen (etwa frühe Angebote auf eBay) und der erwartete Preistrend bis nach Release. Daraus entsteht ein geschätzter Zielpreis. Die Gewinnwahrscheinlichkeit gibt an, wie wahrscheinlich dieser Preis nach Gebühren, Versand und Steuern mindestens deinen Break-even plus Mindestgewinn erreicht – mindestens 5 € oder 5 % des Einkaufs. Weil die Unsicherheit mit dem Abstand zum Release wächst, rechnet das Modell mit einer breiteren Preisstreuung, und die Werte fallen tendenziell vorsichtiger aus als bei sofort lieferbarer Ware. Nach Erscheinen aktualisiert sich die Einschätzung mit echten Marktdaten.",
      },
      { type: "h2", text: "Vom Vorbestellen bis zum Verkauf" },
      {
        type: "ol",
        items: [
          "In der Kategorie Vorbestellungen filterst du nach Gewinnwahrscheinlichkeit und Erscheinungstermin.",
          "„Kaufen auf Knopfdruck“ öffnet die Vorbestellung beim Händler und legt sie in deinem Portfolio ab.",
          "Bis zur Lieferung siehst du, wie sich der Marktpreis entwickelt.",
          "Nach Eingang erstellst du das eBay-Angebot per Knopfdruck; die Preisautomatik hält es über deinem Break-even.",
        ],
      },
      { type: "h2", text: "Risiken offen benannt" },
      {
        type: "p",
        text: "Vorbestellungen binden Kapital über Wochen oder Monate, und niemand kennt den Marktpreis am Erscheinungstag sicher. Hersteller produzieren nach, Händler stornieren, Hypes kühlen ab. Die Prozentanzeige ist deshalb ausdrücklich eine Schätzung. Plane nur mit Geld, das du binden kannst, und beachte die Abgabebeschränkungen der Händler. Regelmäßiger Weiterverkauf ist in der Regel gewerblich – siehe [Reselling, Gewerbe und Steuern](/ratgeber/reselling-gewerbe-steuern/).",
      },
      { type: "h2", text: "In welchem Tarif enthalten?" },
      {
        type: "p",
        text: "Die Kategorie Vorbestellungen ist ab dem Pro-Tarif für 79 € im Monat verfügbar, zusammen mit Autopilot, Preisautomatik und drei Marktplätzen. Im Jahrestarif zahlst du 790 € für zwölf Monate. Auch Business enthält Vorbestellungen. Details stehen auf der [Preisseite](/preise/); wer allgemein nach Preisdifferenzen sucht, findet mehr auf der Seite zum [Reselling Tool](/reselling-tool/).",
      },
      {
        type: "cta",
        title: "Sieh dir die aktuellen Vorbestellchancen an",
        text: "Im [Test-Dashboard](/demo/) zeigen wir dir die Top 3 Vorbestellungen mit Gewinnwahrscheinlichkeit – kostenlos und ohne Konto. Pro testest du mit 14 Tagen Geld-zurück-Garantie.",
      },
    ],
    faq: [
      {
        q: "Lohnt es sich, limitierte Sachen vorzubestellen und weiterzuverkaufen?",
        a: "Bei manchen Artikeln ja, bei vielen nicht. Entscheidend sind echte Knappheit, eine starke Nachfrage und ein Verkauf zum richtigen Zeitpunkt. Eine Bewertung auf Basis aktueller Marktdaten hilft, die aussichtsreichen Vorbestellungen von reinen Hype-Produkten zu unterscheiden.",
      },
      {
        q: "Welche Produkte steigen nach Release im Wert?",
        a: "Häufig sind es limitierte Konsolen-Editionen, Sneaker-Collabs, LEGO-Sets mit Sammlerfokus sowie Trading-Card-Displays. Garantiert ist das nie: Nachproduktionen oder nachlassender Hype können den Preis schnell drücken.",
      },
      {
        q: "Darf ich Vorbestellungen weiterverkaufen?",
        a: "Ja, regulär gekaufte Ware darfst du grundsätzlich weiterverkaufen. Manche Händler begrenzen allerdings die Stückzahl pro Kunde oder stornieren Mehrfachbestellungen. Wer regelmäßig resellt, muss außerdem ein Gewerbe anmelden und Gewinne versteuern.",
      },
      {
        q: "Wann verkaufe ich eine limitierte Edition am besten?",
        a: "Das hängt vom Markt ab. Bei Konsolen und Sneakern sind die Preise oft direkt nach Release am höchsten, bei LEGO und Sammlerstücken eher, wenn das Produkt aus dem Handel verschwindet. Lege den Zeitpunkt am besten schon vor dem Kauf fest.",
      },
    ],
    related: [
      "limitierte-editionen-wiederverkaufen",
      "reselling-gewinn-berechnen",
      "ebay-gebuehren-reselling",
    ],
  },
];
