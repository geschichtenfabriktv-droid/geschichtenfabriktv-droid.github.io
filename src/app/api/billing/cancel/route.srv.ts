import { cancelSubscription } from "@/server/billing";
import { handler, json, requireUser } from "@/server/http";
import { sendMail } from "@/server/mail";
import { findUserById, publicUser } from "@/server/users";

export const POST = handler(async () => {
  const user = await requireUser();
  await cancelSubscription(user);
  const fresh = await findUserById(user.id);
  const end = fresh?.currentPeriodEnd ? new Date(fresh.currentPeriodEnd).toLocaleDateString("de-DE", { timeZone: "Europe/Berlin" }) : null;
  await sendMail(
    user.email,
    "Kündigungsbestätigung",
    `Hallo${user.name ? ` ${user.name}` : ""},\n\ndein Abo ist gekündigt. ${end ? `Dein Zugang bleibt bis zum ${end} bestehen.` : "Dein Zugang endet sofort."}\nEs werden keine weiteren Beträge abgebucht.\n\nArbitrage Radar`,
  );
  return json({ user: fresh ? publicUser(fresh) : null });
});
