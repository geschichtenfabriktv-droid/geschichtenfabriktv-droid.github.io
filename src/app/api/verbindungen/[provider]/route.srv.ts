import { getProvider } from "@/lib/providers";
import { deleteConnection } from "@/server/connections";
import { error, handler, json, requireUser } from "@/server/http";

/** Trennt die Verbindung und löscht die gespeicherten Tokens sofort. */
export const DELETE = handler(async (_req, ctx: { params: Promise<{ provider: string }> }) => {
  const user = await requireUser();
  const { provider } = await ctx.params;
  const info = getProvider(provider);
  if (!info) return error("Unbekannter Anbieter.", 404);
  await deleteConnection(user.id, info.id);
  return json({ ok: true });
});
