import { LegalAddress, LegalEmail, LegalVatId } from "@/components/legal/legal-contact";
import { LegalPage, legalMetadata } from "@/components/legal/legal-page";

export const metadata = legalMetadata("Impressum");

export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum" updated="Oktober 2026">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        <LegalAddress withContact={false} />
      </p>

      <h2>Kontakt</h2>
      <p>
        E-Mail: <LegalEmail />
      </p>
      <LegalVatId />

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>
        <LegalAddress withContact={false} />
      </p>

      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
        teilzunehmen.
      </p>

      <h2>Haftung für Inhalte und Links</h2>
      <p>
        Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt. Marktanalysen und Gewinnwahrscheinlichkeiten sind
        Schätzungen auf Basis öffentlich verfügbarer Marktdaten und stellen keine Anlage-, Rechts- oder Steuerberatung dar.
        Für Inhalte externer Seiten, auf die wir verlinken (z. B. Händler, Marktplätze, Insolvenzportale), sind ausschließlich
        deren Betreiber verantwortlich. Bei Bekanntwerden von Rechtsverletzungen entfernen wir entsprechende Links umgehend.
      </p>
    </LegalPage>
  );
}
