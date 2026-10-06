import { isAbEvent, parseAbTag } from "@/lib/experiments";
import { clientIp, handler, json, rateLimit, readJson } from "@/server/http";
import { recordAb } from "@/server/experiments";

/** Nimmt Ansichten und Klicks der A/B-Tests entgegen. Kauf und Checkout zählt der Server selbst. */
export const POST = handler(async (req) => {
  const body = await readJson<{ ab?: unknown; event?: unknown }>(req);
  const assignment = parseAbTag(body.ab);
  if (!Object.keys(assignment).length || (body.event !== "ansicht" && body.event !== "klick") || !isAbEvent(body.event)) {
    return json({ ok: false }, 400);
  }
  await rateLimit(`ab:${clientIp(req)}`, 300, 60 * 60_000);
  await recordAb(assignment, body.event);
  return json({ ok: true });
});
