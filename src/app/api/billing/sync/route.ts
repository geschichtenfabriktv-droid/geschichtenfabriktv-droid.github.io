import { syncOpenPayments } from "@/server/billing";
import { handler, json, requireUser } from "@/server/http";
import { isMollieConfigured } from "@/server/mollie";
import { findUserById, publicUser } from "@/server/users";

export const POST = handler(async () => {
  const user = await requireUser();
  if (isMollieConfigured()) await syncOpenPayments(user);
  const fresh = await findUserById(user.id);
  return json({ user: fresh ? publicUser(fresh) : null });
});
