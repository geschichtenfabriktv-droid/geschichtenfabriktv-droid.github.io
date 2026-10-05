import { LegalPage, legalMetadata } from "@/components/legal/legal-page";
import { CancelForm } from "./cancel-form";

export const metadata = legalMetadata("Verträge hier kündigen");

export default function KuendigenPage() {
  return (
    <LegalPage title="Verträge hier kündigen" updated="Oktober 2026" draft={false}>
      <p>
        Hier kannst du dein Arbitrage-Radar-Abo ohne Anmeldung kündigen. Gib die E-Mail-Adresse deines Kontos an. Du erhältst
        sofort eine Eingangsbestätigung per E-Mail; dein Zugang bleibt bis zum Ende der bezahlten Laufzeit bestehen.
      </p>
      <div className="not-prose mt-8">
        <CancelForm />
      </div>
    </LegalPage>
  );
}
