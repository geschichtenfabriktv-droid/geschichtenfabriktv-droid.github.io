import "server-only";
import { randomUUID } from "node:crypto";
import type { AddonId, BillingInterval, PlanId } from "@/lib/pricing";
import { isPlanId } from "@/lib/pricing";
import { getDb } from "./db";
import { env } from "./env";

export type SubscriptionStatus = "none" | "pending" | "active" | "canceled" | "past_due";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  plan: PlanId | null;
  planInterval: BillingInterval | null;
  addons: AddonId[];
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  mollieCustomerId: string | null;
  mollieSubscriptionId: string | null;
  /** Günstigerer Tarif, der ab der nächsten Abbuchung gilt */
  pendingPlan: PlanId | null;
  pendingAddons: AddonId[] | null;
  sessionVersion: number;
}

interface Row {
  id: string;
  email: string;
  name: string;
  created_at: Date | string;
  plan: string | null;
  plan_interval: string | null;
  addons: unknown;
  status: string;
  current_period_end: Date | string | null;
  mollie_customer_id: string | null;
  mollie_subscription_id: string | null;
  pending_plan: string | null;
  pending_addons: unknown;
  session_version: number;
  password_hash?: string;
}

const iso = (d: Date | string | null) => (d ? new Date(d).toISOString() : null);

function parseList(v: unknown): AddonId[] | null {
  const list = typeof v === "string" ? JSON.parse(v) : v;
  return Array.isArray(list) ? (list as AddonId[]) : null;
}

function map(r: Row): User {
  const addons = typeof r.addons === "string" ? JSON.parse(r.addons) : r.addons;
  const user: User = {
    id: r.id,
    email: r.email,
    name: r.name,
    createdAt: iso(r.created_at) ?? "",
    plan: (r.plan as PlanId) ?? null,
    planInterval: (r.plan_interval as BillingInterval) ?? null,
    addons: Array.isArray(addons) ? addons : [],
    status: r.status as SubscriptionStatus,
    currentPeriodEnd: iso(r.current_period_end),
    mollieCustomerId: r.mollie_customer_id,
    mollieSubscriptionId: r.mollie_subscription_id,
    pendingPlan: (r.pending_plan as PlanId) ?? null,
    pendingAddons: parseList(r.pending_addons),
    sessionVersion: r.session_version,
  };
  // Freigeschaltete Testzugänge: voller Zugriff ohne Zahlung, solange kein bezahltes Abo besteht.
  const free = env.complimentary.get(r.email.toLowerCase());
  if (free && isPlanId(free) && !user.mollieSubscriptionId) {
    Object.assign(user, { plan: free, planInterval: "jahr", status: "active", currentPeriodEnd: null, pendingPlan: null, pendingAddons: null });
  }
  return user;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function createUser(email: string, passwordHash: string, name: string): Promise<User> {
  const db = await getDb();
  const rows = await db.query<Row>(
    "insert into users (id, email, password_hash, name) values ($1, $2, $3, $4) returning *",
    [randomUUID(), normalizeEmail(email), passwordHash, name.trim()],
  );
  return map(rows[0]!);
}

export async function findUserByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
  const db = await getDb();
  const rows = await db.query<Row>("select * from users where email = $1", [normalizeEmail(email)]);
  const r = rows[0];
  return r ? { ...map(r), passwordHash: r.password_hash ?? "" } : null;
}

export async function findUserById(id: string): Promise<User | null> {
  const db = await getDb();
  const rows = await db.query<Row>("select * from users where id = $1", [id]);
  return rows[0] ? map(rows[0]) : null;
}

export async function findUserByMollieCustomer(customerId: string): Promise<User | null> {
  const db = await getDb();
  const rows = await db.query<Row>("select * from users where mollie_customer_id = $1", [customerId]);
  return rows[0] ? map(rows[0]) : null;
}

export async function updateUser(
  id: string,
  patch: Partial<{
    name: string;
    passwordHash: string;
    plan: PlanId | null;
    planInterval: BillingInterval | null;
    addons: AddonId[];
    status: SubscriptionStatus;
    currentPeriodEnd: string | null;
    mollieCustomerId: string | null;
    mollieSubscriptionId: string | null;
    pendingPlan: PlanId | null;
    pendingAddons: AddonId[] | null;
    bumpSession: boolean;
  }>,
): Promise<void> {
  const cols: Record<string, unknown> = {};
  if (patch.name !== undefined) cols.name = patch.name;
  if (patch.passwordHash !== undefined) cols.password_hash = patch.passwordHash;
  if (patch.plan !== undefined) cols.plan = patch.plan;
  if (patch.planInterval !== undefined) cols.plan_interval = patch.planInterval;
  if (patch.addons !== undefined) cols.addons = JSON.stringify(patch.addons);
  if (patch.status !== undefined) cols.status = patch.status;
  if (patch.currentPeriodEnd !== undefined) cols.current_period_end = patch.currentPeriodEnd;
  if (patch.mollieCustomerId !== undefined) cols.mollie_customer_id = patch.mollieCustomerId;
  if (patch.mollieSubscriptionId !== undefined) cols.mollie_subscription_id = patch.mollieSubscriptionId;
  if (patch.pendingPlan !== undefined) cols.pending_plan = patch.pendingPlan;
  if (patch.pendingAddons !== undefined) cols.pending_addons = patch.pendingAddons === null ? null : JSON.stringify(patch.pendingAddons);
  const keys = Object.keys(cols);
  const sets = keys.map((k, i) => `${k} = $${i + 2}`);
  if (patch.bumpSession) sets.push("session_version = session_version + 1");
  if (!sets.length) return;
  const db = await getDb();
  await db.query(`update users set ${sets.join(", ")} where id = $1`, [id, ...keys.map((k) => cols[k])]);
}

export async function deleteUser(id: string): Promise<void> {
  const db = await getDb();
  await db.query("delete from users where id = $1", [id]);
}

/** Zugang zum Dashboard: aktives oder gekündigtes Abo bis Laufzeitende, bei Zahlungsproblem 7 Tage Kulanz. */
export function hasAccess(user: User, now = new Date()): boolean {
  if (!user.plan) return false;
  const end = user.currentPeriodEnd ? new Date(user.currentPeriodEnd).getTime() : 0;
  if (user.status === "active") return end === 0 || end > now.getTime() - 3 * 86_400_000;
  if (user.status === "canceled") return end > now.getTime();
  if (user.status === "past_due") return end + 7 * 86_400_000 > now.getTime();
  return false;
}

export function publicUser(u: User) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    createdAt: u.createdAt,
    plan: u.plan,
    planInterval: u.planInterval,
    addons: u.addons,
    status: u.status,
    currentPeriodEnd: u.currentPeriodEnd,
    pendingPlan: u.pendingPlan,
    pendingAddons: u.pendingAddons,
    hasAccess: hasAccess(u),
  };
}
export type PublicUser = ReturnType<typeof publicUser>;
