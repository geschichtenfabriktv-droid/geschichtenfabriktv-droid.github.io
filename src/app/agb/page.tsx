import Link from "next/link";
import { LegalEmail } from "@/components/legal/legal-contact";
import { LegalPage, legalMetadata } from "@/components/legal/legal-page";
import { GUARANTEE_DAYS } from "@/lib/pricing";

export const metadata = legalMetadata("AGB");

export default function AgbPage() {
  return (
    <LegalPage title="Allgemeine Geschäftsbedingungen" updated="Oktober 2026">
      <h2>§ 1 Geltungsbereich und Anbieter</h2>
      <p>
        Diese AGB gelten für alle Verträge über die Nutzung der Software „Arbitrage Radar“ (Webseite und Web-App) zwischen dem
        im <Link href="/impressum/">Impressum</Link> genannten Anbieter („wir“) und den Kundinnen und Kunden („du“). Sie gelten
        für Verbraucher (§ 13 BGB) und Unternehmer (§ 14 BGB); Regelungen nur für eine der beiden Gruppen sind gekennzeichnet.
        Abweichende Bedingungen von Unternehmern gelten nur, wenn wir ihnen ausdrücklich zustimmen.
      </p>

      <h2>§ 2 Leistungen</h2>
      <p>
        Arbitrage Radar ist eine Software als Dienst (SaaS). Sie analysiert öffentlich verfügbare Marktdaten, zeigt mögliche
        Preisgefälle, Vorbestell-Chancen und Insolvenzmassen an und schätzt für jede Chance eine Gewinnwahrscheinlichkeit.
        Je nach Tarif kannst du verbundene eigene Marktplatz-Konten (z. B. eBay, Amazon) nutzen, um Angebote einzustellen.
        Der genaue Funktionsumfang ergibt sich aus der <Link href="/preise/">Tarifübersicht</Link> zum Zeitpunkt der Bestellung.
      </p>
      <p>
        <strong>Keine Gewinngarantie.</strong> Gewinnwahrscheinlichkeiten, Preisprognosen und Maximalgebote sind statistische
        Schätzungen und keine Zusicherung. Käufe, Verkäufe und Gebote tätigst du im eigenen Namen und auf eigene Rechnung bei
        den jeweiligen Händlern, Marktplätzen oder Insolvenzverwaltern. Wir werden nicht Vertragspartei dieser Geschäfte.
        Für die Einhaltung von Marktplatz-Richtlinien, gewerberechtlichen und steuerlichen Pflichten bist du selbst
        verantwortlich.
      </p>

      <h2>§ 3 Vertragsschluss</h2>
      <p>
        Die Darstellung der Tarife ist kein bindendes Angebot. Mit Klick auf „Zahlungspflichtig abonnieren“ gibst du ein
        verbindliches Angebot ab. Der Vertrag kommt zustande, wenn die erste Zahlung über unseren Zahlungsdienstleister
        Mollie erfolgreich ist und wir den Zugang freischalten. Nach der Zahlung erhältst du eine Zahlungsbestätigung per
        E-Mail. Der Vertragstext (diese AGB) ist jederzeit unter <Link href="/agb/">/agb/</Link> abrufbar und kann dort
        gespeichert oder ausgedruckt werden; in deinem Kundenkonto wird er nicht gesondert gespeichert. Vertragssprache ist
        Deutsch.
      </p>

      <h2>§ 4 Preise, Zahlung und Laufzeit</h2>
      <ul>
        <li>Es gelten die bei Bestellung angezeigten Preise. Sie sind Endpreise inklusive gesetzlicher Umsatzsteuer, soweit diese anfällt.</li>
        <li>Abos werden monatlich oder jährlich im Voraus abgerechnet und per SEPA-Lastschrift, Kreditkarte oder PayPal über Mollie bezahlt.</li>
        <li>
          Monatsabos verlängern sich jeweils um einen Monat, Jahresabos um ein Jahr, wenn sie nicht vor Ablauf gekündigt
          werden. Verbraucher können ein verlängertes Jahresabo nach Ablauf der ersten Laufzeit jederzeit mit einer Frist von
          einem Monat kündigen.
        </li>
        <li>Erweiterungen (Add-ons) laufen mit dem gewählten Tarif und werden mit ihm abgerechnet und gekündigt.</li>
        <li>
          Tarifwechsel sind im Kundenkonto jederzeit möglich. Ein Wechsel in einen höheren Tarif gilt sofort; den Differenzbetrag
          für die laufende Abrechnungsperiode berechnen wir anteilig. Ein Wechsel in einen günstigeren Tarif gilt ab dem
          nächsten Abrechnungsdatum.
        </li>
        <li>
          Schlägt eine Zahlung fehl, bleibt der Zugang 7 Tage erhalten. Danach können wir den Zugang sperren, bis die Zahlung
          erfolgt ist. Kosten für Rücklastschriften, die du zu vertreten hast, können wir in Rechnung stellen.
        </li>
        <li>
          Preisänderungen kündigen wir mindestens sechs Wochen vorher per E-Mail an. Du kannst bis zum Inkrafttreten kündigen;
          darauf weisen wir in der Mitteilung hin.
        </li>
      </ul>

      <h2>§ 5 Geld-zurück-Garantie</h2>
      <p>
        Unabhängig vom gesetzlichen Widerrufsrecht erstatten wir bei der ersten Bestellung eines Tarifs auf Wunsch den vollen
        Betrag, wenn du innerhalb von {GUARANTEE_DAYS} Tagen nach Vertragsschluss per E-Mail an <LegalEmail /> oder über
        „Verträge hier kündigen“ kündigst und die Erstattung verlangst.
      </p>

      <h2>§ 6 Kündigung</h2>
      <p>
        Du kannst im Kundenkonto oder ohne Anmeldung über{" "}
        <Link href="/kuendigen/">Verträge hier kündigen</Link> kündigen (§ 312k BGB) sowie in Textform per E-Mail. Der Zugang
        bleibt bis zum Ende der bezahlten Laufzeit bestehen; eine anteilige Erstattung erfolgt nicht. Erstattungen gibt es nur
        im Rahmen der Geld-zurück-Garantie (§ 5) oder bei einem wirksamen Widerruf. Das Recht zur außerordentlichen Kündigung aus wichtigem Grund
        bleibt unberührt.
      </p>

      <h2>§ 7 Pflichten der Nutzer</h2>
      <ul>
        <li>Zugangsdaten sind geheim zu halten; ein Konto darf nur von der berechtigten Person verwendet werden.</li>
        <li>Die Software darf nicht missbräuchlich genutzt werden, insbesondere nicht für automatisierte Massenabfragen außerhalb der vorgesehenen Funktionen, zum Weiterverkauf der Daten oder für rechtswidrige Angebote.</li>
        <li>Verbundene Marktplatz-Konten müssen dir gehören oder du musst zur Nutzung berechtigt sein.</li>
      </ul>

      <h2>§ 8 Verfügbarkeit</h2>
      <p>
        Wir bemühen uns um eine Verfügbarkeit von 99 % im Jahresmittel, ausgenommen angekündigte Wartungen und Störungen, die
        wir nicht zu vertreten haben (z. B. Ausfälle von Marktplatz-Schnittstellen). Funktionen, die von Schnittstellen Dritter
        abhängen, können sich ändern, wenn diese Dritten ihre Schnittstellen ändern.
      </p>

      <h2>§ 9 Haftung</h2>
      <p>
        Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei Verletzung von Leben, Körper oder Gesundheit sowie
        nach dem Produkthaftungsgesetz. Bei leichter Fahrlässigkeit haften wir nur bei Verletzung wesentlicher
        Vertragspflichten (Kardinalpflichten), begrenzt auf den vertragstypischen, vorhersehbaren Schaden. Gegenüber
        Unternehmern ist diese Haftung zusätzlich auf die in den letzten zwölf Monaten gezahlte Vergütung begrenzt. Für
        Verluste aus Käufen, Verkäufen oder Geboten, die du aufgrund von Analysen der Software tätigst, haften wir nicht,
        soweit kein Fall der unbeschränkten Haftung vorliegt.
      </p>

      <h2>§ 10 Datenschutz</h2>
      <p>
        Wir verarbeiten personenbezogene Daten nach unserer <Link href="/datenschutz/">Datenschutzerklärung</Link>. Soweit du
        als Unternehmer personenbezogene Daten Dritter über die Software verarbeitest, gilt unser{" "}
        <Link href="/avv/">Auftragsverarbeitungsvertrag</Link>.
      </p>

      <h2>§ 11 Änderungen der AGB</h2>
      <p>
        Änderungen dieser AGB teilen wir mindestens sechs Wochen vor Inkrafttreten per E-Mail mit. Widersprichst du nicht
        innerhalb dieser Frist, gelten die Änderungen als angenommen; auf diese Folge und dein Kündigungsrecht weisen wir in
        der Mitteilung gesondert hin. Wesentliche Vertragspflichten und das Verhältnis von Leistung und Preis ändern wir so nicht.
      </p>

      <h2>§ 12 Schlussbestimmungen</h2>
      <p>
        Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts; gegenüber Verbrauchern nur, soweit dadurch nicht zwingende
        Verbraucherschutzvorschriften des Staates ihres gewöhnlichen Aufenthalts entzogen werden. Gerichtsstand für Kaufleute
        ist der Sitz des Anbieters. Sollten einzelne Bestimmungen unwirksam sein, bleibt der Vertrag im Übrigen wirksam.
      </p>
    </LegalPage>
  );
}
