import { startCheckout } from "@/server/billing";
import { error, handler, json, readJson, requireUser } from "@/server/http";
import { isMollieConfigured } from "@/server/mollie";
import * as v from "@/server/validate";

export const POST = handler(async (req) => {
  const user = await requireUser();
  const body = await readJson(req);
  v.accepted(body.terms, "Bitte akzeptiere die AGB.");
  v.accepted(body.waiver, "Bitte bestätige den sofortigen Beginn der Leistung.");
  if (!isMollieConfigured()) return error("Die Bezahlung ist noch nicht freigeschaltet. Bitte versuche es später erneut.", 503);
  return json(await startCheckout(user, { plan: body.plan, interval: body.interval, addons: body.addons }));
});
