import { verifyPassword } from "@/server/crypto";
import { clientIp, error, handler, json, rateLimit, readJson } from "@/server/http";
import { startSession } from "@/server/session";
import { findUserByEmail, publicUser } from "@/server/users";
import * as v from "@/server/validate";

export const POST = handler(async (req) => {
  const body = await readJson(req);
  const email = v.email(body.email);
  rateLimit(`login:${clientIp(req)}:${email}`, 8);
  const user = await findUserByEmail(email);
  const ok = user ? await verifyPassword(String(body.password ?? ""), user.passwordHash) : false;
  if (!user || !ok) return error("E-Mail oder Passwort ist falsch.", 401);
  await startSession(user);
  return json({ user: publicUser(user) });
});
