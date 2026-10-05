import "server-only";
import { env } from "./env";

/** Versand über Resend. Ohne API-Schlüssel wird die Mail nur protokolliert (Entwicklung). */
export async function sendMail(to: string, subject: string, text: string): Promise<void> {
  if (!env.resendApiKey) {
    // In Produktion nie den Inhalt protokollieren (enthält z. B. Links zum Zurücksetzen des Passworts).
    if (env.isProduction) console.warn(`[mail] RESEND_API_KEY fehlt, nicht versendet: ${subject}`);
    else console.info(`[mail] an ${to}: ${subject}\n${text}`);
    return;
  }
  // Ein Mailfehler darf Zahlung, Kündigung oder Registrierung nie abbrechen.
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.mailFrom, to, subject, text }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error(`[mail] Versand fehlgeschlagen (${res.status})`);
  } catch (e) {
    console.error(`[mail] Versand fehlgeschlagen (${e instanceof Error ? e.name : "Fehler"})`);
  }
}
