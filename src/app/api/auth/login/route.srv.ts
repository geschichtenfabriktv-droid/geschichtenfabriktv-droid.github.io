import { hashPassword, verifyPassword } from "@/server/crypto";
import { clientIp, error, handler, json, rateLimit, readJson } from "@/server/http";
import { startSession } from "@/server/session";
import { findUserByEmail, publicUser } from "@/server/users";
import * as v from "@/server/validate";

let dummy: Promise<string> | null = null;
const dummyHash = () => (dummy ??= hashPassword("kein-konto-vorhanden"));

export const POST = handler(async (req) => {
  const body = await readJson(req);
  const email = v.email(body.email);
  await rateLimit(`login:${clientIp(req)}`, 30);
  await rateLimit(`login-konto:${email}`, 10);
  const user = await findUserByEmail(email);
  // Auch ohne Konto wird ein Hash geprüft, damit die Antwortzeit nichts über bestehende Konten verrät.
  const ok = await verifyPassword(String(body.password ?? ""), user?.passwordHash ?? (await dummyHash()));
  if (!user || !ok) return error("E-Mail oder Passwort ist falsch.", 401);
  await startSession(user);
  return json({ user: publicUser(user) });
});
