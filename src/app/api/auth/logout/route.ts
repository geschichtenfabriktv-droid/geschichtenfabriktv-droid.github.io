import { handler, json } from "@/server/http";
import { endSession } from "@/server/session";

export const POST = handler(async () => {
  await endSession();
  return json({ ok: true });
});
