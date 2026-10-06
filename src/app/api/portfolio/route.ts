import { getDb } from "@/server/db";
import { error, handler, json, readJson, requireUser } from "@/server/http";

const MAX_BYTES = 200_000;

export const GET = handler(async () => {
  const user = await requireUser();
  const db = await getDb();
  const rows = await db.query<{ data: unknown }>("select data from portfolios where user_id = $1", [user.id]);
  const data = rows[0]?.data;
  return json({ portfolio: typeof data === "string" ? JSON.parse(data) : (data ?? null) });
});

export const PUT = handler(async (req) => {
  const user = await requireUser();
  const body = await readJson<{ portfolio?: unknown }>(req);
  const p = body.portfolio as { orders?: unknown; listings?: unknown; settings?: unknown } | undefined;
  if (!p || !Array.isArray(p.orders) || !Array.isArray(p.listings) || typeof p.settings !== "object") return error("Ungültige Daten.");
  const serialized = JSON.stringify({ orders: p.orders, listings: p.listings, settings: p.settings });
  if (serialized.length > MAX_BYTES) return error("Zu viele Einträge.", 413);
  const db = await getDb();
  await db.query(
    "insert into portfolios (user_id, data, updated_at) values ($1, $2, now()) on conflict (user_id) do update set data = excluded.data, updated_at = now()",
    [user.id, serialized],
  );
  return json({ ok: true });
});
