import { changePlan } from "@/server/billing";
import { handler, json, readJson, requireUser } from "@/server/http";
import { findUserById, publicUser } from "@/server/users";

export const POST = handler(async (req) => {
  const user = await requireUser();
  const body = await readJson(req);
  await changePlan(user, { plan: body.plan, addons: body.addons });
  const fresh = await findUserById(user.id);
  return json({ user: fresh ? publicUser(fresh) : null });
});
