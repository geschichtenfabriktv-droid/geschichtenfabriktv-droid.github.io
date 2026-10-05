import Link from "next/link";
import { LegalAddress } from "@/components/legal/legal-contact";
import { LegalPage, legalMetadata } from "@/components/legal/legal-page";

export const metadata = legalMetadata("Datenschutz");

export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutzerklärung" updated="Oktober 2026">
      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlich für die Datenverarbeitung auf dieser Webseite und in der Web-App „Arbitrage Radar“ im Sinne der DSGVO ist:
      </p>
      <p>
        <LegalAddress />
      </p>

      <h2>2. Grundsätze</h2>
      <p>
        Wir verarbeiten nur die Daten, die für den jeweiligen Zweck nötig sind (Datenminimierung), nutzen sie nur für den
        Zweck, für den sie erhoben wurden (Zweckbindung), und speichern sie in der EU. Wir setzen keine Werbe- oder
        Analyse-Cookies, kein Tracking und keine Social-Media-Plugins ein. Schriften werden von unserem eigenen Server
        geladen, nicht von Google oder anderen Drittanbietern.
      </p>

      <h2>3. Aufruf der Webseite und Server-Protokolle</h2>
      <p>
        Beim Aufruf verarbeitet unser Hosting-Anbieter technisch notwendige Daten (IP-Adresse, Datum und Uhrzeit, angefragte
        Seite, Browser-Kennung) zur Auslieferung der Seite und zur Abwehr von Angriffen. Rechtsgrundlage ist Art. 6 Abs. 1
        lit. f DSGVO (sicherer und stabiler Betrieb). Protokolle werden nach spätestens 30 Tagen gelöscht.
      </p>

      <h2>4. Kundenkonto</h2>
      <p>
        Für das Kundenkonto speichern wir E-Mail-Adresse, Name, ein mit scrypt gehashtes Passwort (nie im Klartext),
        gewählten Tarif, Add-ons, Abo-Status sowie deine Einstellungen und dein Portfolio im Dashboard. Rechtsgrundlage ist
        Art. 6 Abs. 1 lit. b DSGVO (Vertrag). Die Daten werden gelöscht, sobald du dein Konto löschst; gesetzliche
        Aufbewahrungspflichten für Rechnungsdaten (§ 147 AO, § 257 HGB: bis zu 10 Jahre) bleiben unberührt.
      </p>
      <p>
        Zur Anmeldung setzen wir ein einziges, technisch notwendiges Cookie („ar_session“, httpOnly, 30 Tage). Hierfür ist
        nach § 25 Abs. 2 Nr. 2 TDDDG keine Einwilligung erforderlich. Das Test-Dashboard speichert Beispieldaten nur lokal
        in deinem Browser (localStorage); sie werden nicht an uns übertragen.
      </p>

      <h2>5. Zahlungen über Mollie</h2>
      <p>
        Zahlungen und Abos wickeln wir über Mollie B.V., Keizersgracht 126, 1015 CW Amsterdam, Niederlande ab. Dabei werden
        Name, E-Mail-Adresse, Zahlungsdaten (z. B. IBAN oder Kartendaten) und Betrag an Mollie übermittelt. Zahlungsdaten
        selbst erhalten wir nicht; wir speichern nur Zahlungs-ID, Betrag, Status und Datum. Rechtsgrundlage ist Art. 6 Abs. 1
        lit. b DSGVO. Mollie ist für die Zahlungsabwicklung eigener Verantwortlicher; Datenschutzhinweise:{" "}
        <a href="https://www.mollie.com/de/privacy" rel="noopener noreferrer" target="_blank">mollie.com/de/privacy</a>.
      </p>

      <h2>6. Verbindung deiner Marktplatz-Konten (eBay, Amazon, Keepa)</h2>
      <p>
        Du kannst im Kundenkonto unter „Verbindungen“ freiwillig eigene Marktplatz-Konten verbinden, damit Arbitrage Radar in
        deinem Auftrag Angebote einstellen und Bestände abgleichen kann. Dabei gilt:
      </p>
      <ul>
        <li>
          Die Verbindung erfolgt ausschließlich über die offiziellen Autorisierungsverfahren der Marktplätze (OAuth: eBay
          „Sign in with eBay“, Amazon Seller Central). Deine Passwörter sehen und speichern wir nie.
        </li>
        <li>
          Vor jeder Verbindung holen wir deine ausdrückliche Einwilligung ein (Art. 6 Abs. 1 lit. a DSGVO) und zeigen dir, welche
          Berechtigungen angefragt werden. Die Verarbeitung im Rahmen der Funktionen erfolgt zur Vertragserfüllung (Art. 6 Abs. 1
          lit. b DSGVO).
        </li>
        <li>
          Wir speichern nur Zugriffs- und Aktualisierungs-Token, den Kontonamen bzw. die Händler-ID, die erteilten
          Berechtigungen und den Verbindungsstatus. Token werden mit AES-256-GCM verschlüsselt gespeichert und nur auf dem
          Server verwendet, nie im Browser.
        </li>
        <li>
          Zweck ist ausschließlich das Einstellen und Verwalten von Angeboten, die du selbst auslöst oder per Autopilot
          freigibst. Keine Weitergabe, kein Verkauf, keine Auswertung zu anderen Zwecken.
        </li>
        <li>
          Du kannst eine Verbindung jederzeit unter „Verbindungen“ trennen; die Token werden dann sofort gelöscht. Zusätzlich
          kannst du die Freigabe direkt bei eBay bzw. Amazon widerrufen.
        </li>
      </ul>
      <p>
        Empfänger sind die jeweiligen Marktplätze: eBay GmbH bzw. eBay Inc. und Amazon EU S.à r.l. bzw. Amazon Services
        Europe S.à r.l. sowie Keepa GmbH, soweit du einen eigenen Keepa-Schlüssel hinterlegst.
      </p>

      <h2>7. Marktdaten</h2>
      <p>
        Für Preisanalysen rufen wir öffentliche Angebotsdaten über die offiziellen Schnittstellen der Marktplätze ab
        (z. B. eBay Browse API). Dabei werden keine personenbezogenen Daten von dir übermittelt.
      </p>

      <h2>8. E-Mails</h2>
      <p>
        Für Systemmails (Passwort zurücksetzen, Zahlungs- und Kündigungsbestätigungen) nutzen wir den Versanddienst Resend
        (Resend Inc., USA). Übermittelt werden E-Mail-Adresse und Inhalt der Nachricht. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b
        DSGVO. Die Übermittlung in die USA stützt sich auf das EU-US Data Privacy Framework bzw. Standardvertragsklauseln. Wir
        versenden keine Newsletter ohne deine gesonderte Einwilligung.
      </p>

      <h2>9. Hosting und Datenbank</h2>
      <p>
        Die Anwendung läuft bei Vercel Inc. (USA) in der Region Frankfurt am Main; die Datenbank liegt bei Neon Inc. (USA) in
        einem Rechenzentrum in Frankfurt am Main. Mit beiden Anbietern bestehen Auftragsverarbeitungsverträge nach Art. 28
        DSGVO einschließlich Standardvertragsklauseln; Vercel und Neon sind zudem nach dem EU-US Data Privacy Framework
        zertifiziert bzw. stützen Übermittlungen auf Standardvertragsklauseln.
      </p>

      <h2>10. Kündigung und Kontakt</h2>
      <p>
        Bei Kündigungen über „Verträge hier kündigen“ und bei Anfragen per E-Mail verarbeiten wir die angegebenen Daten zur
        Bearbeitung (Art. 6 Abs. 1 lit. b und c DSGVO) und bewahren den Nachweis bis zu drei Jahre auf.
      </p>

      <h2>11. Deine Rechte</h2>
      <p>Du hast das Recht auf</p>
      <ul>
        <li>Auskunft (Art. 15 DSGVO) – im Kundenkonto unter „Daten“ als JSON-Export jederzeit selbst abrufbar,</li>
        <li>Berichtigung (Art. 16 DSGVO),</li>
        <li>Löschung (Art. 17 DSGVO) – im Kundenkonto unter „Daten“ mit einem Klick,</li>
        <li>Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO),</li>
        <li>Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO),</li>
        <li>Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO), z. B. durch Trennen einer Verbindung,</li>
        <li>
          Beschwerde bei einer Datenschutz-Aufsichtsbehörde, etwa beim Unabhängigen Landeszentrum für Datenschutz
          Schleswig-Holstein (ULD).
        </li>
      </ul>

      <h2>12. Sicherheit</h2>
      <p>
        Alle Verbindungen sind TLS-verschlüsselt. Passwörter werden gehasht, Marktplatz-Token verschlüsselt gespeichert,
        Sitzungen sind signiert und werden bei Passwortänderung beendet. Für Geschäftskunden stellen wir einen{" "}
        <Link href="/avv/">Auftragsverarbeitungsvertrag</Link> bereit.
      </p>

      <h2>13. Keine automatisierte Entscheidung</h2>
      <p>
        Gewinnwahrscheinlichkeiten werden für Produkte berechnet, nicht für Personen. Es findet keine automatisierte
        Entscheidungsfindung oder Profilbildung im Sinne von Art. 22 DSGVO statt.
      </p>
    </LegalPage>
  );
}
