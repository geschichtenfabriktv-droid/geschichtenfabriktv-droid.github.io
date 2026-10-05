import { hashPassword, verifyPassword } from "@/server/crypto";
import { error, handler, json, readJson, requireUser } from "@/server/http";
import { startSession } from "@/server/session";
import { findUserByEmail, findUserById, updateUser } from "@/server/users";
import * as v from "@/server/validate";

export const POST = handler(async (req) => {
  const user = await requireUser();
  const body = await readJson(req);
  const full = await findUserByEmail(user.email);
  if (!full || !(await verifyPassword(String(body.current ?? ""), full.passwordHash))) return error("Das aktuelle Passwort stimmt nicht.", 400);
  await updateUser(user.id, { passwordHash: await hashPassword(v.password(body.next)), bumpSession: true });
  const fresh = await findUserById(user.id);
  if (fresh) await startSession(fresh); // andere Geräte werden abgemeldet, dieses bleibt angemeldet
  return json({ ok: true });
});
