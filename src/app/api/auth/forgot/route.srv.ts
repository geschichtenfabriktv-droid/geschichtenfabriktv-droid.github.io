import { randomToken, sha256 } from "@/server/crypto";
import { getDb } from "@/server/db";
import { env } from "@/server/env";
import { clientIp, handler, json, rateLimit, readJson } from "@/server/http";
import { sendMail } from "@/server/mail";
import { findUserByEmail } from "@/server/users";
import * as v from "@/server/validate";

/** Antwortet immer gleich, damit nicht erkennbar ist, ob ein Konto existiert. */
export const POST = handler(async (req) => {
  rateLimit(`forgot:${clientIp(req)}`, 5);
  const email = v.email((await readJson(req)).email);
  const user = await findUserByEmail(email);
  if (user) {
    const token = randomToken();
    const db = await getDb();
    await db.query("insert into password_resets (token_hash, user_id, expires_at) values ($1, $2, now() + interval '1 hour')", [sha256(token), user.id]);
    await sendMail(
      email,
      "Passwort zurücksetzen",
      `Hallo,\n\nüber diesen Link setzt du dein Passwort zurück (1 Stunde gültig):\n${env.appUrl}/passwort-zuruecksetzen/?token=${token}\n\nWenn du das nicht angefordert hast, ignoriere diese E-Mail.\n\nArbitrage Radar`,
    );
  }
  return json({ ok: true });
});
