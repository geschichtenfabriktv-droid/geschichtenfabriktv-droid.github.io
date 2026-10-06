import { hashPassword } from "@/server/crypto";
import { clientIp, error, handler, json, rateLimit, readJson } from "@/server/http";
import { sendMail } from "@/server/mail";
import { startSession } from "@/server/session";
import { createUser, findUserByEmail, publicUser } from "@/server/users";
import * as v from "@/server/validate";

export const POST = handler(async (req) => {
  await rateLimit(`register:${clientIp(req)}`, 10);
  const body = await readJson(req);
  const email = v.email(body.email);
  const password = v.password(body.password);
  const name = v.text(body.name, 120, "Name");
  v.accepted(body.terms, "Bitte akzeptiere die AGB und nimm die Datenschutzerklärung zur Kenntnis.");
  if (await findUserByEmail(email)) return error("Für diese E-Mail-Adresse gibt es bereits ein Konto.", 409);
  const user = await createUser(email, await hashPassword(password), name);
  await startSession(user);
  await sendMail(email, "Willkommen bei Arbitrage Radar", `Hallo${name ? ` ${name}` : ""},\n\ndein Konto ist angelegt. Wähle jetzt deinen Tarif und starte mit den ersten Chancen.\n\nArbitrage Radar`);
  return json({ user: publicUser(user) }, 201);
});
