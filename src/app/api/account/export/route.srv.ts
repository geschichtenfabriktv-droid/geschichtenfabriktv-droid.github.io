import { listPayments } from "@/server/billing";
import { listConnections } from "@/server/connections";
import { getDb } from "@/server/db";
import { handler, requireUser } from "@/server/http";
import { publicUser } from "@/server/users";

/** Datenauskunft nach Art. 15/20 DSGVO als JSON-Download. Tokens werden nicht ausgegeben. */
export const GET = handler(async () => {
  const user = await requireUser();
  const db = await getDb();
  const [payments, connections, portfolio] = await Promise.all([
    listPayments(user.id),
    listConnections(user.id),
    db.query<{ data: unknown }>("select data from portfolios where user_id = $1", [user.id]),
  ]);
  const body = JSON.stringify(
    { exportiertAm: new Date().toISOString(), konto: publicUser(user), zahlungen: payments, verbindungen: connections, portfolio: portfolio[0]?.data ?? null },
    null,
    2,
  );
  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="arbitrage-radar-daten-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
});
