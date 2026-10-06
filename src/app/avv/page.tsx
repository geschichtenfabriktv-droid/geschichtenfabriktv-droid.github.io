import Link from "next/link";
import { LegalEmail } from "@/components/legal/legal-contact";
import { LegalPage, legalMetadata } from "@/components/legal/legal-page";

export const metadata = legalMetadata("Auftragsverarbeitung");

const SUBPROCESSORS = [
  ["Vercel Inc., USA", "Hosting der Anwendung (Region Frankfurt am Main)", "DPF / Standardvertragsklauseln"],
  ["Neon Inc., USA", "Datenbank (Rechenzentrum Frankfurt am Main)", "DPF / Standardvertragsklauseln"],
  ["Resend Inc., USA", "Versand von Systemmails", "DPF / Standardvertragsklauseln"],
];

export default function AvvPage() {
  return (
    <LegalPage title="Auftragsverarbeitungsvertrag" updated="Oktober 2026">
      <p>
        Dieser Vertrag nach Art. 28 DSGVO gilt zwischen dir als Unternehmer und Verantwortlichem („Auftraggeber“) und dem im{" "}
        <Link href="/impressum/">Impressum</Link> genannten Anbieter („Auftragnehmer“), soweit wir im Rahmen von Arbitrage Radar
        personenbezogene Daten in deinem Auftrag verarbeiten, z. B. Käufer- und Bestelldaten aus deinen verbundenen
        Marktplatz-Konten. Er wird mit Abschluss eines Abos Vertragsbestandteil; eine
        unterschriebene Fassung erhältst du auf Anfrage an <LegalEmail />.
      </p>

      <h2>1. Gegenstand, Dauer, Art und Zweck</h2>
      <ul>
        <li>Gegenstand: Bereitstellung der SaaS-Anwendung Arbitrage Radar gemäß AGB.</li>
        <li>Dauer: Laufzeit des Hauptvertrags.</li>
        <li>Art der Verarbeitung: Speichern, Abrufen, Übermitteln an die vom Auftraggeber verbundenen Marktplätze, Löschen.</li>
        <li>Zweck: Einstellen und Verwalten von Angeboten, Abgleich von Beständen und Bestellungen.</li>
        <li>Datenarten: Bestell- und Käuferdaten (Name, Lieferanschrift, Bestellinhalt), soweit über verbundene Konten abgerufen.</li>
        <li>Betroffene: Käufer des Auftraggebers.</li>
      </ul>

      <h2>2. Weisungen</h2>
      <p>
        Der Auftragnehmer verarbeitet Daten nur auf dokumentierte Weisung des Auftraggebers. Weisungen ergeben sich aus dem
        Hauptvertrag und den Einstellungen in der Anwendung; weitere Weisungen erfolgen in Textform. Hält der Auftragnehmer eine
        Weisung für rechtswidrig, informiert er den Auftraggeber unverzüglich.
      </p>

      <h2>3. Vertraulichkeit</h2>
      <p>Alle zur Verarbeitung befugten Personen sind zur Vertraulichkeit verpflichtet.</p>

      <h2>4. Technische und organisatorische Maßnahmen (Art. 32 DSGVO)</h2>
      <ul>
        <li>Verschlüsselung: TLS für alle Verbindungen; Marktplatz-Token mit AES-256-GCM verschlüsselt; Passwörter mit scrypt gehasht.</li>
        <li>Zugriffskontrolle: signierte Sitzungen, Beendigung bei Passwortwechsel, Zugriff auf Kundendaten nur durch die Anwendung.</li>
        <li>Mandantentrennung: Daten jedes Kunden sind an dessen Konto gebunden; Token werden nur serverseitig verwendet.</li>
        <li>Verfügbarkeit: Hosting in Rechenzentren in Frankfurt am Main mit Backups des Datenbankanbieters.</li>
        <li>Datenminimierung: nur die für die Funktion nötigen Berechtigungen und Daten werden angefragt und gespeichert.</li>
        <li>Löschung: Trennen einer Verbindung löscht deren Token sofort; Kontolöschung entfernt alle Kundendaten.</li>
      </ul>

      <h2>5. Unterauftragsverarbeiter</h2>
      <p>Der Auftraggeber stimmt dem Einsatz folgender Unterauftragsverarbeiter zu:</p>
      <table>
        <thead>
          <tr>
            <th>Anbieter</th>
            <th>Leistung</th>
            <th>Garantie Drittland</th>
          </tr>
        </thead>
        <tbody>
          {SUBPROCESSORS.map(([a, b, c]) => (
            <tr key={a}>
              <td>{a}</td>
              <td>{b}</td>
              <td>{c}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Über beabsichtigte Änderungen informiert der Auftragnehmer mindestens vier Wochen vorher; der Auftraggeber kann aus
        wichtigem datenschutzrechtlichem Grund widersprechen. Die Marktplätze selbst (eBay, Amazon) sind keine
        Unterauftragsverarbeiter, sondern Empfänger auf Veranlassung des Auftraggebers.
      </p>

      <h2>6. Unterstützung und Meldepflichten</h2>
      <p>
        Der Auftragnehmer unterstützt den Auftraggeber bei Betroffenenanfragen (Export und Löschung sind im Kundenkonto
        selbst möglich), bei Datenschutz-Folgenabschätzungen und meldet Verletzungen des Schutzes personenbezogener Daten
        unverzüglich, möglichst binnen 24 Stunden nach Kenntnis.
      </p>

      <h2>7. Löschung und Rückgabe</h2>
      <p>
        Nach Vertragsende werden alle Daten des Auftraggebers spätestens 30 Tage nach Vertragsende auf Anfrage oder durch
        Löschung des Kontos gelöscht, soweit keine gesetzliche Aufbewahrungspflicht besteht. Vorher kann der Auftraggeber seine Daten im Kundenkonto exportieren.
      </p>

      <h2>8. Kontrollen</h2>
      <p>
        Der Auftragnehmer stellt die zum Nachweis nötigen Informationen bereit und ermöglicht Überprüfungen nach angemessener
        Vorankündigung, vorrangig durch Vorlage von Dokumentation und Zertifikaten der Unterauftragsverarbeiter.
      </p>
    </LegalPage>
  );
}
