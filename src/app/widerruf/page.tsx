import { LegalAddress, LegalEmail } from "@/components/legal/legal-contact";
import { LegalPage, legalMetadata } from "@/components/legal/legal-page";
import { GUARANTEE_DAYS } from "@/lib/pricing";

export const metadata = legalMetadata("Widerrufsbelehrung");

export default function WiderrufPage() {
  return (
    <LegalPage title="Widerrufsbelehrung" updated="Oktober 2026">
      <p>Verbraucherinnen und Verbrauchern steht ein gesetzliches Widerrufsrecht zu.</p>

      <h2>Widerrufsrecht</h2>
      <p>
        Du hast das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist
        beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
      </p>
      <p>Um dein Widerrufsrecht auszuüben, musst du uns</p>
      <p>
        <LegalAddress />
      </p>
      <p>
        mittels einer eindeutigen Erklärung (z. B. eine E-Mail an <LegalEmail /> oder über „Verträge hier kündigen“) über deinen
        Entschluss, diesen Vertrag zu widerrufen, informieren. Du kannst dafür das unten stehende Muster-Widerrufsformular
        verwenden, das jedoch nicht vorgeschrieben ist. Zur Wahrung der Widerrufsfrist reicht es aus, dass du die Mitteilung
        über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absendest.
      </p>

      <h2>Folgen des Widerrufs</h2>
      <p>
        Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von dir erhalten haben, unverzüglich und
        spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über deinen Widerruf dieses Vertrags
        bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das du bei der ursprünglichen
        Transaktion eingesetzt hast, es sei denn, mit dir wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden
        dir wegen dieser Rückzahlung Entgelte berechnet.
      </p>
      <p>
        Hast du verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, so hast du uns einen angemessenen
        Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem du uns von der Ausübung des Widerrufsrechts
        hinsichtlich dieses Vertrags unterrichtest, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im
        Vertrag vorgesehenen Dienstleistungen entspricht.
      </p>
      <p>
        Hinweis: Bei der ersten Bestellung eines Tarifs erstatten wir dir innerhalb der ersten {GUARANTEE_DAYS} Tage dank unserer
        Geld-zurück-Garantie freiwillig den vollen Betrag, auch für bereits genutzte Tage.
      </p>

      <h2>Muster-Widerrufsformular</h2>
      <p>(Wenn du den Vertrag widerrufen willst, fülle bitte dieses Formular aus und sende es zurück.)</p>
      <div className="mt-4 rounded-xl bg-canvas p-5 ring-1 ring-line">
        <p className="mt-0">
          An: <LegalAddress />
        </p>
        <p>
          Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden
          Dienstleistung: Abonnement „Arbitrage Radar“, Tarif: ____________
        </p>
        <p>Bestellt am (*) ____________</p>
        <p>Name des/der Verbraucher(s) ____________</p>
        <p>Anschrift des/der Verbraucher(s) ____________</p>
        <p>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier) ____________</p>
        <p>Datum ____________</p>
        <p className="text-[13px] text-muted">(*) Unzutreffendes streichen.</p>
      </div>
    </LegalPage>
  );
}
