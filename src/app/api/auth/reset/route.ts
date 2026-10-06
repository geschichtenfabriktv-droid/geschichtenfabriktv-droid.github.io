import { hashPassword, sha256 } from "@/server/crypto";
import { getDb } from "@/server/db";
import { error, handler, json, readJson } from "@/server/http";
import { updateUser } from "@/server/users";
import * as v from "@/server/validate";

export const POST = handler(async (req) => {
  const body = await readJson(req);
  const password = v.password(body.password);
  const db = await getDb();
  const rows = await db.query<{ user_id: string }>(
    "update password_resets set used = true where token_hash = $1 and used = false and expires_at > now() returning user_id",
    [sha256(String(body.token ?? ""))],
  );
  const userId = rows[0]?.user_id;
  if (!userId) return error("Der Link ist ungültig oder abgelaufen. Fordere bitte einen neuen an.", 400);
  // Alle bestehenden Sitzungen werden ungültig.
  await updateUser(userId, { passwordHash: await hashPassword(password), bumpSession: true });
  await db.query("delete from password_resets where user_id = $1", [userId]);
  return json({ ok: true });
});
