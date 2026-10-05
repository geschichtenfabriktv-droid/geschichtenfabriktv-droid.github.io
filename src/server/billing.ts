import "server-only";
import { getPlan, isInterval, isPlanId, priceFor, sanitizeAddons, type AddonId, type BillingInterval, type PlanId } from "@/lib/pricing";
import { getDb } from "./db";
import { env } from "./env";
import { HttpError } from "./http";
import { amount, mollie as defaultClient, type MollieClient, type MolliePayment } from "./mollie";
import { findUserById, findUserByMollieCustomer, updateUser, type User } from "./users";

const DAY = 86_400_000;

function addInterval(from: Date, interval: BillingInterval): Date {
  const d = new Date(from);
  if (interval === "jahr") d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1);
  return d;
}

function webhookUrl(): string | undefined {
  const url = `${env.appUrl}/api/mollie/webhook/`;
  // Mollie erreicht localhost nicht; dort wird der Status beim Zurückkehren abgeglichen.
  return /localhost|127\.0\.0\.1/.test(url) ? undefined : url;
}

export function describe(plan: PlanId, interval: BillingInterval, addons: AddonId[]) {
  const p = getPlan(plan)!;
  return `Arbitrage Radar ${p.name} (${interval === "jahr" ? "jährlich" : "monatlich"})${addons.length ? ` + ${addons.length} Add-on${addons.length > 1 ? "s" : ""}` : ""}`;
}

async function recordPayment(userId: string, p: MolliePayment) {
  const db = await getDb();
  await db.query(
    `insert into payments (id, user_id, amount, description, status, sequence_type, created_at, paid_at)
     values ($1, $2, $3, $4, $5, $6, $7, $8)
     on conflict (id) do update set status = excluded.status, paid_at = excluded.paid_at`,
    [p.id, userId, Number(p.amount.value), p.description, p.status, p.sequenceType, p.createdAt, p.paidAt ?? null],
  );
}

async function previousStatus(paymentId: string): Promise<string | null> {
  const db = await getDb();
  const rows = await db.query<{ status: string }>("select status from payments where id = $1", [paymentId]);
  return rows[0]?.status ?? null;
}

export async function startCheckout(
  user: User,
  input: { plan: unknown; interval: unknown; addons: unknown },
  client: MollieClient = defaultClient,
): Promise<{ checkoutUrl: string }> {
  if (!isPlanId(input.plan) || !isInterval(input.interval)) throw new HttpError(400, "Bitte wähle einen gültigen Tarif.");
  if (user.status === "active" && user.mollieSubscriptionId) throw new HttpError(409, "Du hast bereits ein aktives Abo. Ändere es im Kundenkonto.");
  const plan = input.plan;
  const interval = input.interval;
  const addons = sanitizeAddons(plan, input.addons);
  const total = priceFor(plan, interval, addons);

  let customerId = user.mollieCustomerId;
  if (!customerId) {
    customerId = (await client.createCustomer({ name: user.name || user.email, email: user.email, metadata: { userId: user.id } })).id;
    await updateUser(user.id, { mollieCustomerId: customerId });
  }

  const payment = await client.createPayment({
    amount: amount(total),
    description: describe(plan, interval, addons),
    customerId,
    sequenceType: "first",
    redirectUrl: `${env.appUrl}/konto/?checkout=zurueck`,
    webhookUrl: webhookUrl(),
    metadata: { userId: user.id, plan, interval, addons },
    locale: "de_DE",
  });
  await recordPayment(user.id, payment);
  if (user.status === "none") await updateUser(user.id, { status: "pending" });
  const url = payment._links.checkout?.href;
  if (!url) throw new HttpError(502, "Mollie hat keinen Bezahllink geliefert.");
  return { checkoutUrl: url };
}

/** Verarbeitet einen Zahlungsstatus. Idempotent: mehrfach gemeldete Zahlungen ändern nichts doppelt. */
export async function processPayment(paymentId: string, client: MollieClient = defaultClient, now = new Date()): Promise<void> {
  const payment = await client.getPayment(paymentId);
  const meta = (payment.metadata ?? {}) as { userId?: string; plan?: string; interval?: string; addons?: unknown };
  const user =
    (meta.userId ? await findUserById(meta.userId) : null) ?? (payment.customerId ? await findUserByMollieCustomer(payment.customerId) : null);
  if (!user) return;

  const before = await previousStatus(payment.id);
  await recordPayment(user.id, payment);
  if (before === payment.status) return;

  if (payment.sequenceType === "first") {
    if (payment.status === "paid" && isPlanId(meta.plan) && isInterval(meta.interval)) {
      const plan = meta.plan;
      const interval = meta.interval;
      const addons = sanitizeAddons(plan, meta.addons);
      const periodEnd = addInterval(now, interval);
      const customerId = payment.customerId ?? user.mollieCustomerId;
      let subscriptionId = user.mollieSubscriptionId;
      if (customerId && !subscriptionId) {
        subscriptionId = (
          await client.createSubscription(customerId, {
            amount: amount(priceFor(plan, interval, addons)),
            interval: interval === "jahr" ? "12 months" : "1 month",
            startDate: periodEnd.toISOString().slice(0, 10),
            description: `${describe(plan, interval, addons)} · ${user.id.slice(0, 8)}-${now.getTime().toString(36)}`,
            webhookUrl: webhookUrl(),
            metadata: { userId: user.id, plan, interval, addons },
          })
        ).id;
      }
      await updateUser(user.id, {
        plan,
        planInterval: interval,
        addons,
        status: "active",
        currentPeriodEnd: periodEnd.toISOString(),
        mollieCustomerId: customerId ?? null,
        mollieSubscriptionId: subscriptionId ?? null,
      });
    } else if (["failed", "canceled", "expired"].includes(payment.status) && user.status === "pending") {
      await updateUser(user.id, { status: "none" });
    }
    return;
  }

  if (payment.subscriptionId) {
    if (payment.status === "paid" && user.planInterval) {
      const base = user.currentPeriodEnd && new Date(user.currentPeriodEnd) > now ? new Date(user.currentPeriodEnd) : now;
      await updateUser(user.id, { status: user.status === "canceled" ? "canceled" : "active", currentPeriodEnd: addInterval(base, user.planInterval).toISOString() });
    } else if (payment.status === "failed" || payment.status === "expired") {
      await updateUser(user.id, { status: "past_due" });
    }
  }
}

/** Gleicht offene Zahlungen ab, wenn der Kunde von Mollie zurückkommt (falls der Webhook noch fehlt). */
export async function syncOpenPayments(user: User, client: MollieClient = defaultClient) {
  const db = await getDb();
  const rows = await db.query<{ id: string }>(
    "select id from payments where user_id = $1 and status in ('open','pending','authorized') order by created_at desc limit 3",
    [user.id],
  );
  for (const r of rows) await processPayment(r.id, client);
}

export async function cancelSubscription(user: User, client: MollieClient = defaultClient) {
  if (user.mollieCustomerId && user.mollieSubscriptionId) {
    await client.cancelSubscription(user.mollieCustomerId, user.mollieSubscriptionId);
  }
  await updateUser(user.id, { status: user.plan ? "canceled" : "none", mollieSubscriptionId: null });
}

/** Tarif oder Add-ons ändern: neuer Betrag gilt ab der nächsten Abbuchung, Funktionen sofort. */
export async function changePlan(user: User, input: { plan: unknown; addons: unknown }, client: MollieClient = defaultClient) {
  if (!isPlanId(input.plan)) throw new HttpError(400, "Ungültiger Tarif.");
  if (user.status !== "active" || !user.mollieCustomerId || !user.mollieSubscriptionId || !user.planInterval) {
    throw new HttpError(409, "Für einen Tarifwechsel wird ein aktives Abo benötigt.");
  }
  const addons = sanitizeAddons(input.plan, input.addons);
  await client.updateSubscription(user.mollieCustomerId, user.mollieSubscriptionId, {
    amount: amount(priceFor(input.plan, user.planInterval, addons)),
    description: `${describe(input.plan, user.planInterval, addons)} · ${user.id.slice(0, 8)}-${Date.now().toString(36)}`,
  });
  await updateUser(user.id, { plan: input.plan, addons });
}

export async function listPayments(userId: string) {
  const db = await getDb();
  const rows = await db.query<{ id: string; amount: string | number; description: string; status: string; created_at: string | Date; paid_at: string | Date | null }>(
    "select id, amount, description, status, created_at, paid_at from payments where user_id = $1 order by created_at desc limit 50",
    [userId],
  );
  return rows.map((r) => ({
    id: r.id,
    amount: Number(r.amount),
    description: r.description,
    status: r.status,
    createdAt: new Date(r.created_at).toISOString(),
    paidAt: r.paid_at ? new Date(r.paid_at).toISOString() : null,
  }));
}

export const _test = { addInterval, DAY };
