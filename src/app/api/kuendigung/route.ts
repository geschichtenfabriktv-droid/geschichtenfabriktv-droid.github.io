import { randomUUID } from "node:crypto";
import { cancelSubscription } from "@/server/billing";
import { getDb } from "@/server/db";
import { clientIp, handler, json, rateLimit, readJson } from "@/server/http";
import { sendMail } from "@/server/mail";
import { findUserByEmail } from "@/server/users";
import * as v from "@/server/validate";

const KINDS = {
  ordentlich: "ordentliche Kündigung",
  ausserordentlich: "außerordentliche Kündigung",
  widerruf: "Widerruf",
} as const;

/**
 * Kündigungsbutton nach § 312k BGB: ohne Anmeldung nutzbar. Jede Erklärung wird mit Zeitstempel
 * gespeichert. Passt die E-Mail zu einem Konto, wird ein laufendes Abo beendet und die Bestätigung
 * an die Kontoadresse geschickt. Die Antwort ist immer gleich, damit niemand Konten ausforschen kann.
 */
export const POST = handler(async (req) => {
  await rateLimit(`kuendigung:${clientIp(req)}`, 10);
  const body = await readJson(req);
  const email = v.email(body.email);
  await rateLimit(`kuendigung-konto:${email}`, 5, 24 * 60 * 60 * 1000);
  const name = v.text(body.name, 120, "Name");
  const contract = v.text(body.contract, 200, "Vertrag") || "Arbitrage Radar Abo";
  const reason = v.text(body.reason, 1000, "Grund");
  const kind: keyof typeof KINDS = body.kind === "ausserordentlich" || body.kind === "widerruf" ? body.kind : "ordentlich";

  const user = await findUserByEmail(email);
  const db = await getDb();
  const id = randomUUID();
  const at = new Date();
  await db.query("insert into cancellations (id, email, name, contract, reason, kind, user_id, created_at) values ($1,$2,$3,$4,$5,$6,$7,$8)", [
    id,
    email,
    name,
    contract,
    reason || null,
    kind,
    user?.id ?? null,
    at,
  ]);

  if (user) {
    let ended = !user.mollieSubscriptionId;
    if (user.mollieSubscriptionId) {
      try {
        await cancelSubscription(user);
        ended = true;
      } catch (e) {
        // Erklärung ist gespeichert und wird manuell nachbearbeitet.
        console.error(`[kuendigung] Abo ${id} konnte nicht automatisch beendet werden`, e instanceof Error ? e.message : e);
      }
    }
    const end = user.currentPeriodEnd ? new Date(user.currentPeriodEnd).toLocaleDateString("de-DE", { timeZone: "Europe/Berlin" }) : null;
    const outcome =
      kind === "widerruf"
        ? "Dein Abo ist beendet. Den bezahlten Betrag erstatten wir dir innerhalb von 14 Tagen über die ursprüngliche Zahlungsart."
        : ended && end
          ? `Es werden keine weiteren Beträge abgebucht. Dein Zugang bleibt bis zum ${end} bestehen.`
          : "Wir bestätigen dir das Vertragsende in Kürze.";
    await sendMail(
      user.email,
      `Eingangsbestätigung: ${KINDS[kind]}`,
      `Hallo${name ? ` ${name}` : ""},\n\nwir haben deine ${KINDS[kind]} am ${at.toLocaleString("de-DE", { timeZone: "Europe/Berlin" })} erhalten.\nVertrag: ${contract}\n${outcome}\nReferenz: ${id}\n\nArbitrage Radar`,
    );
  }
  return json({ ok: true, reference: id, receivedAt: at.toISOString() });
});
