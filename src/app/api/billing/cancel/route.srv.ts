import { cancelSubscription } from "@/server/billing";
import { handler, json, requireUser } from "@/server/http";
import { sendMail } from "@/server/mail";
import { findUserById, publicUser } from "@/server/users";

export const POST = handler(async () => {
  const user = await requireUser();
  await cancelSubscription(user);
  const fresh = await findUserById(user.id);
  const end = fresh?.currentPeriodEnd ? new Date(fresh.currentPeriodEnd).toLocaleDateString("de-DE") : "sofort";
  await sendMail(user.email, "Kündigungsbestätigung", `Hallo,\n\ndein Abo ist gekündigt. Dein Zugang bleibt bis ${end} bestehen.\n\nArbitrage Radar`);
  return json({ user: fresh ? publicUser(fresh) : null });
});
