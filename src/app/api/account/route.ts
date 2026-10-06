import { listPayments } from "@/server/billing";
import { listConnections } from "@/server/connections";
import { handler, json, readJson, requireUser } from "@/server/http";
import { isMollieConfigured } from "@/server/mollie";
import { isAmazonConfigured, isEbayConfigured } from "@/server/marketplaces";
import { publicUser, updateUser } from "@/server/users";
import * as v from "@/server/validate";

export const GET = handler(async () => {
  const user = await requireUser();
  const [payments, connections] = await Promise.all([listPayments(user.id), listConnections(user.id)]);
  return json({
    user: publicUser(user),
    payments,
    connections,
    integrations: { mollie: isMollieConfigured(), ebay: isEbayConfigured(), amazon: isAmazonConfigured(), keepa: true },
  });
});

export const PATCH = handler(async (req) => {
  const user = await requireUser();
  const body = await readJson(req);
  await updateUser(user.id, { name: v.text(body.name, 120, "Name") });
  return json({ ok: true });
});
