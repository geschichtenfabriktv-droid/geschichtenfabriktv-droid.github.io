import { getAnalyzedDeals, getAnalyzedLots } from "@/lib/data/repository";
import { categoryAllowed } from "@/lib/pricing";
import { error, handler, json, requireUser } from "@/server/http";
import { applyLiveMarketData } from "@/server/live-market";
import { hasAccess } from "@/server/users";

export const GET = handler(async () => {
  const user = await requireUser();
  if (!hasAccess(user)) return error("Für das Dashboard wird ein aktives Abo benötigt.", 402);
  const now = new Date();
  const [deals, lots] = await Promise.all([applyLiveMarketData(await getAnalyzedDeals(now), now), getAnalyzedLots(now)]);
  const allowedDeals = deals.filter((d) => categoryAllowed(user.plan, user.addons, d.categoryId));
  const allowedLots = categoryAllowed(user.plan, user.addons, "insolvenz") ? lots : [];
  return json({
    scannedAt: now.toISOString(),
    deals: allowedDeals,
    lots: allowedLots,
    locked: { deals: deals.length - allowedDeals.length, lots: lots.length - allowedLots.length },
  });
});
