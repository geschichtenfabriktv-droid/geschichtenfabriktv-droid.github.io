import "server-only";
import { env } from "./env";

/** Versand über Resend. Ohne API-Schlüssel wird die Mail nur protokolliert (Entwicklung). */
export async function sendMail(to: string, subject: string, text: string): Promise<void> {
  if (!env.resendApiKey) {
    console.info(`[mail] an ${to}: ${subject}\n${text}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.resendApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.mailFrom, to, subject, text }),
  });
  if (!res.ok) console.error(`[mail] Versand fehlgeschlagen (${res.status})`);
}
