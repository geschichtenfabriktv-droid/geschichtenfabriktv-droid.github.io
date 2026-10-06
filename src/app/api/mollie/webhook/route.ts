import { processPayment } from "@/server/billing";
import { MollieError } from "@/server/mollie";

/**
 * Mollie meldet nur die Zahlungs-ID. Der Status wird immer direkt bei Mollie abgefragt,
 * daher kann ein gefälschter Aufruf nichts freischalten.
 */
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const id = String(form.get("id") ?? "");
    if (/^tr_[A-Za-z0-9]+$/.test(id)) await processPayment(id);
  } catch (e) {
    // Unbekannte Zahlung (z. B. aus einem anderen Mollie-Profil): nichts zu tun, nicht erneut senden lassen.
    if (e instanceof MollieError && e.status === 404) return new Response("ok");
    console.error("[mollie-webhook]", e);
    return new Response("error", { status: 500 });
  }
  return new Response("ok");
}
