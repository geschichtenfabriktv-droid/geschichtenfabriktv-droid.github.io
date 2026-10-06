import { hashPassword, verifyPassword } from "@/server/crypto";
import { getDb } from "@/server/db";
import { error, handler, json, rateLimit, readJson, requireUser } from "@/server/http";
import { startSession } from "@/server/session";
import { findUserByEmail, findUserById, updateUser } from "@/server/users";
import * as v from "@/server/validate";

export const POST = handler(async (req) => {
  const user = await requireUser();
  await rateLimit(`passwort:${user.id}`, 10);
  const body = await readJson(req);
  const full = await findUserByEmail(user.email);
  if (!full || !(await verifyPassword(String(body.current ?? ""), full.passwordHash))) return error("Das aktuelle Passwort stimmt nicht.", 400);
  await updateUser(user.id, { passwordHash: await hashPassword(v.password(body.next)), bumpSession: true });
  await (await getDb()).query("delete from password_resets where user_id = $1", [user.id]);
  const fresh = await findUserById(user.id);
  if (fresh) await startSession(fresh); // andere Geräte werden abgemeldet, dieses bleibt angemeldet
  return json({ ok: true });
});
