import "server-only";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/lib/client/user-context";
import { getCurrentUser } from "./session";
import { hasAccess, publicUser, type User } from "./users";

export function toSessionUser(u: User): SessionUser {
  const p = publicUser(u);
  return {
    id: p.id,
    email: p.email,
    name: p.name,
    plan: p.plan,
    planInterval: p.planInterval,
    addons: p.addons,
    status: p.status,
    currentPeriodEnd: p.currentPeriodEnd,
    hasAccess: p.hasAccess,
  };
}

export async function requirePageUser(next: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login/?weiter=${encodeURIComponent(next)}`);
  return user;
}

export async function requireSubscriber(next: string): Promise<User> {
  const user = await requirePageUser(next);
  if (!hasAccess(user)) redirect("/konto/?hinweis=abo");
  return user;
}
