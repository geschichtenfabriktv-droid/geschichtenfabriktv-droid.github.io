import { randomUUID } from "node:crypto";
import { cancelSubscription } from "@/server/billing";
import { getDb } from "@/server/db";
import { clientIp, handler, json, rateLimit, readJson } from "@/server/http";
import { sendMail } from "@/server/mail";
import { findUserByEmail } from "@/server/users";
import * as v from "@/server/validate";

/**
 * Kündigungsbutton nach § 312k BGB: ohne Anmeldung nutzbar. Passt die E-Mail zu einem Konto mit
 * laufendem Abo, wird es gekündigt; in jedem Fall geht eine Eingangsbestätigung per E-Mail raus.
 */
export const POST = handler(async (req) => {
  rateLimit(`kuendigung:${clientIp(req)}`, 10);
  const body = await readJson(req);
  const email = v.email(body.email);
  const name = v.text(body.name, 120, "Name");
  const contract = v.text(body.contract, 200, "Vertrag") || "Arbitrage Radar Abo";
  const reason = v.text(body.reason, 1000, "Grund");
  const kind = body.kind === "ausserordentlich" ? "ausserordentlich" : "ordentlich";

  const user = await findUserByEmail(email);
  if (user?.mollieSubscriptionId) await cancelSubscription(user);
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
  const end = user?.currentPeriodEnd ? new Date(user.currentPeriodEnd).toLocaleDateString("de-DE") : null;
  await sendMail(
    email,
    "Eingangsbestätigung deiner Kündigung",
    `Hallo ${name},\n\nwir haben deine ${kind}e Kündigung am ${at.toLocaleString("de-DE")} erhalten.\nVertrag: ${contract}\n${
      end ? `Dein Zugang endet am ${end}.` : "Wir bestätigen dir das Vertragsende in Kürze."
    }\nReferenz: ${id}\n\nArbitrage Radar`,
  );
  return json({ ok: true, reference: id, receivedAt: at.toISOString() });
});
