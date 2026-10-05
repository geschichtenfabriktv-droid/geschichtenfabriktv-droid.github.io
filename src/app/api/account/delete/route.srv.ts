import { cancelSubscription } from "@/server/billing";
import { verifyPassword } from "@/server/crypto";
import { error, handler, json, readJson, requireUser } from "@/server/http";
import { mollie } from "@/server/mollie";
import { endSession } from "@/server/session";
import { deleteUser, findUserByEmail } from "@/server/users";

/**
 * Löscht Konto, Verbindungen (inkl. Tokens), Portfolio und Zahlungsverlauf in unserer Datenbank.
 * Ein laufendes Abo wird vorher gekündigt. Rechnungsdaten bei Mollie unterliegen deren Aufbewahrungspflichten.
 */
export const POST = handler(async (req) => {
  const user = await requireUser();
  const body = await readJson(req);
  const full = await findUserByEmail(user.email);
  if (!full || !(await verifyPassword(String(body.password ?? ""), full.passwordHash))) return error("Das Passwort stimmt nicht.", 400);
  if (user.mollieSubscriptionId) await cancelSubscription(user);
  if (user.mollieCustomerId) await mollie.deleteCustomer(user.mollieCustomerId).catch(() => undefined);
  await deleteUser(user.id);
  await endSession();
  return json({ ok: true });
});
