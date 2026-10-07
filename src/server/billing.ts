import "server-only";
import { getPlan, isInterval, isPlanId, priceFor, sanitizeAddons, type AddonId, type BillingInterval, type PlanId } from "@/lib/pricing";
import { getDb } from "./db";
import { formatAbTag, parseAbTag } from "@/lib/experiments";
import { env } from "./env";
import { recordAb } from "./experiments";
import { sendMail } from "./mail";
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

/** Zahlungsstatus inklusive Erstattung und Rückbuchung, die Mollie bei „paid“ nur als Betrag meldet. */
function effectiveStatus(p: MolliePayment): string {
  if (Number(p.amountChargedBack?.value ?? 0) > 0) return "charged_back";
  if (p.status === "paid" && Number(p.amountRefunded?.value ?? 0) >= Number(p.amount.value)) return "refunded";
  return p.status;
}

/**
 * Speichert den neuen Status nur, wenn er sich geändert hat, und liefert den vorherigen zurück.
 * Webhook und Rückkehr-Abgleich können gleichzeitig laufen: nur einer bekommt die Änderung.
 */
async function claimStatus(userId: string, p: MolliePayment, status: string): Promise<{ claimed: boolean; before: string | null }> {
  const db = await getDb();
  const prev = await db.query<{ status: string }>("select status from payments where id = $1", [p.id]);
  const before = prev[0]?.status ?? null;
  const rows = await db.query<{ id: string }>(
    `insert into payments (id, user_id, amount, description, status, sequence_type, created_at, paid_at)
     values ($1, $2, $3, $4, $5, $6, $7, $8)
     on conflict (id) do update set status = excluded.status, paid_at = excluded.paid_at
       where payments.status is distinct from excluded.status and payments.status is not distinct from $9
     returning id`,
    [p.id, userId, Number(p.amount.value), p.description, status, p.sequenceType, p.createdAt, p.paidAt ?? null, before],
  );
  return { claimed: rows.length > 0, before };
}

async function restoreStatus(paymentId: string, status: string | null) {
  const db = await getDb();
  if (status === null) await db.query("delete from payments where id = $1", [paymentId]);
  else await db.query("update payments set status = $2 where id = $1", [paymentId, status]);
}

async function confirmPaid(user: User, payment: MolliePayment, extra = "") {
  const value = Number(payment.amount.value).toLocaleString("de-DE", { style: "currency", currency: "EUR" });
  const date = new Date(payment.paidAt ?? Date.now()).toLocaleDateString("de-DE", { timeZone: "Europe/Berlin" });
  await sendMail(
    user.email,
    "Zahlungsbestätigung",
    `Hallo${user.name ? ` ${user.name}` : ""},\n\nwir haben deine Zahlung erhalten.\n\nLeistung: ${payment.description}\nBetrag: ${value}\nDatum: ${date}\nZahlungsreferenz: ${payment.id}\n${extra}\nDie AGB findest du jederzeit unter ${env.appUrl}/agb/.\nKündigen kannst du in deinem Kundenkonto oder unter ${env.appUrl}/kuendigen/.\n\nArbitrage Radar`,
  );
}

export async function startCheckout(
  user: User,
  input: { plan: unknown; interval: unknown; addons: unknown; ab?: unknown },
  client: MollieClient = defaultClient,
): Promise<{ checkoutUrl: string }> {
  if (!isPlanId(input.plan) || !isInterval(input.interval)) throw new HttpError(400, "Bitte wähle einen gültigen Tarif.");
  // Ein bestehendes Abo (auch mit Zahlungsproblem) wird im Kundenkonto geändert, nicht doppelt abgeschlossen.
  if (user.mollieSubscriptionId) throw new HttpError(409, "Du hast bereits ein Abo. Ändere es im Kundenkonto.");
  const plan = input.plan;
  const interval = input.interval;
  const addons = sanitizeAddons(plan, input.addons);
  const total = priceFor(plan, interval, addons);
  const ab = formatAbTag(parseAbTag(input.ab));

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
    metadata: { userId: user.id, plan, interval, addons, ...(ab ? { ab } : {}) },
    locale: "de_DE",
  });
  await claimStatus(user.id, payment, payment.status);
  if (user.status === "none") await updateUser(user.id, { status: "pending" });
  const url = payment._links.checkout?.href;
  if (!url) throw new HttpError(502, "Mollie hat keinen Bezahllink geliefert.");
  return { checkoutUrl: url };
}

/**
 * Verarbeitet einen Zahlungsstatus. Idempotent und nebenläufigkeitssicher: Jede Statusänderung wird
 * genau einmal verarbeitet; schlägt ein Folgeschritt fehl, wird sie zurückgenommen, damit Mollie
 * den Webhook erneut zustellen kann.
 */
export async function processPayment(paymentId: string, client: MollieClient = defaultClient, now = new Date()): Promise<void> {
  const payment = await client.getPayment(paymentId);
  const meta = (payment.metadata ?? {}) as { userId?: string; plan?: string; interval?: string; addons?: unknown; kind?: string; ab?: string };
  const user =
    (meta.userId ? await findUserById(meta.userId) : null) ?? (payment.customerId ? await findUserByMollieCustomer(payment.customerId) : null);
  if (!user) return;

  const status = effectiveStatus(payment);
  const { claimed, before } = await claimStatus(user.id, payment, status);
  if (!claimed) return;
  try {
    await applyPayment(user, payment, status, meta, client, now);
  } catch (e) {
    await restoreStatus(payment.id, before);
    throw e;
  }
}

async function applyPayment(
  user: User,
  payment: MolliePayment,
  status: string,
  meta: { plan?: string; interval?: string; addons?: unknown; kind?: string; ab?: string },
  client: MollieClient,
  now: Date,
) {
  // Die anteilige Upgrade-Nachberechnung ist nicht das Abo: Erstattung ändert nichts, Rückbuchung ist ein Zahlungsproblem.
  if (meta.kind === "upgrade" && (status === "charged_back" || status === "refunded")) {
    if (status === "charged_back") await updateUser(user.id, { status: "past_due" });
    return;
  }

  // Rückbuchung oder volle Erstattung (z. B. Geld-zurück-Garantie): Abo beenden, Zugang entziehen.
  if (status === "charged_back" || status === "refunded") {
    if (user.mollieCustomerId && user.mollieSubscriptionId) await client.cancelSubscription(user.mollieCustomerId, user.mollieSubscriptionId);
    await updateUser(user.id, { status: "none", mollieSubscriptionId: null, currentPeriodEnd: now.toISOString(), pendingPlan: null, pendingAddons: null });
    return;
  }

  if (payment.sequenceType === "first") {
    if (status === "paid" && isPlanId(meta.plan) && isInterval(meta.interval)) {
      const plan = meta.plan;
      const interval = meta.interval;
      const addons = sanitizeAddons(plan, meta.addons);
      const price = priceFor(plan, interval, addons);
      if (Math.abs(Number(payment.amount.value) - price) > 0.009) throw new Error(`Betrag ${payment.amount.value} passt nicht zum Tarif (${price}).`);
      const periodEnd = addInterval(now, interval);
      const customerId = payment.customerId ?? user.mollieCustomerId;
      let subscriptionId = user.mollieSubscriptionId;
      if (customerId && !subscriptionId) {
        subscriptionId = (
          await client.createSubscription(
            customerId,
            {
              amount: amount(price),
              interval: interval === "jahr" ? "12 months" : "1 month",
              startDate: periodEnd.toISOString().slice(0, 10),
              description: `${describe(plan, interval, addons)} · ${user.id.slice(0, 8)}-${now.getTime().toString(36)}`,
              webhookUrl: webhookUrl(),
              metadata: { userId: user.id, plan, interval, addons },
            },
            `abo-${payment.id}`,
          )
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
        pendingPlan: null,
        pendingAddons: null,
      });
      await confirmPaid(user, payment, `Dein Abo läuft bis ${periodEnd.toLocaleDateString("de-DE", { timeZone: "Europe/Berlin" })} und verlängert sich automatisch.\n`);
      await recordAb(parseAbTag(meta.ab), "kauf", now).catch((e) => console.error(e));
    } else if (["failed", "canceled", "expired"].includes(status) && user.status === "pending") {
      await updateUser(user.id, { status: "none" });
    }
    return;
  }

  // Einmalige Nachberechnung beim Tarif-Upgrade
  if (meta.kind === "upgrade") {
    if (status === "paid") await confirmPaid(user, payment);
    if (status === "failed" || status === "expired") await updateUser(user.id, { status: "past_due" });
    return;
  }

  if (payment.subscriptionId) {
    if (status === "paid" && user.planInterval) {
      const base = user.currentPeriodEnd && new Date(user.currentPeriodEnd) > now ? new Date(user.currentPeriodEnd) : now;
      await updateUser(user.id, {
        status: user.status === "canceled" ? "canceled" : "active",
        currentPeriodEnd: addInterval(base, user.planInterval).toISOString(),
        // Vorgemerkter günstigerer Tarif gilt ab dieser Abbuchung.
        ...(user.pendingPlan ? { plan: user.pendingPlan, addons: user.pendingAddons ?? [], pendingPlan: null, pendingAddons: null } : {}),
      });
      await confirmPaid(user, payment);
    } else if (status === "failed" || status === "expired") {
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
  await updateUser(user.id, { status: user.plan ? "canceled" : "none", mollieSubscriptionId: null, pendingPlan: null, pendingAddons: null });
}

/**
 * Tarif oder Add-ons ändern.
 * - Teurer: sofort freigeschaltet, der Unterschied für den Rest der Laufzeit wird anteilig abgebucht.
 * - Günstiger: gilt ab der nächsten Abbuchung, bis dahin bleibt der bezahlte Umfang.
 */
export async function changePlan(user: User, input: { plan: unknown; addons: unknown }, client: MollieClient = defaultClient, now = new Date()) {
  if (!isPlanId(input.plan)) throw new HttpError(400, "Ungültiger Tarif.");
  if (user.status !== "active" || !user.plan || !user.mollieCustomerId || !user.mollieSubscriptionId || !user.planInterval) {
    throw new HttpError(409, "Für einen Tarifwechsel wird ein aktives Abo benötigt.");
  }
  const plan = input.plan;
  const interval = user.planInterval;
  const addons = sanitizeAddons(plan, input.addons);
  const oldPrice = priceFor(user.plan, interval, user.addons);
  const newPrice = priceFor(plan, interval, addons);

  await client.updateSubscription(user.mollieCustomerId, user.mollieSubscriptionId, {
    amount: amount(newPrice),
    description: `${describe(plan, interval, addons)} · ${user.id.slice(0, 8)}-${now.getTime().toString(36)}`,
  });

  if (newPrice <= oldPrice) {
    await updateUser(user.id, { pendingPlan: plan, pendingAddons: addons });
    return { effective: "next_period" as const, charged: 0 };
  }

  const end = user.currentPeriodEnd ? new Date(user.currentPeriodEnd).getTime() : now.getTime();
  const length = addInterval(new Date(end), interval).getTime() - end;
  const share = Math.min(1, Math.max(0, (end - now.getTime()) / length));
  const charge = Math.round((newPrice - oldPrice) * share * 100) / 100;
  if (charge >= 1) {
    await client.createPayment({
      amount: amount(charge),
      description: `Upgrade auf ${describe(plan, interval, addons)} (anteilig)`,
      customerId: user.mollieCustomerId,
      sequenceType: "recurring",
      webhookUrl: webhookUrl(),
      metadata: { userId: user.id, kind: "upgrade", plan, addons },
    });
  }
  await updateUser(user.id, { plan, addons, pendingPlan: null, pendingAddons: null });
  return { effective: "now" as const, charged: charge >= 1 ? charge : 0 };
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
