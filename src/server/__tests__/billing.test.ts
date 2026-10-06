import { beforeEach, describe, expect, it } from "vitest";
import { cancelSubscription, changePlan, processPayment, startCheckout } from "@/server/billing";
import { resetDbForTests } from "@/server/db";
import { abStats } from "@/server/experiments";
import type { MollieClient, MolliePayment } from "@/server/mollie";
import { createUser, findUserById, hasAccess } from "@/server/users";

/** Mollie-Attrappe, die Zahlungen im Speicher hält. */
function fakeMollie() {
  const payments = new Map<string, MolliePayment>();
  const subscriptions = new Map<string, { amount: string; startDate: string; canceled: boolean }>();
  let n = 0;
  const client: MollieClient = {
    async createCustomer() {
      return { id: `cst_${++n}` };
    },
    async createPayment(input) {
      const p: MolliePayment = {
        id: `tr_${++n}`,
        status: "open",
        amount: input.amount,
        description: input.description,
        sequenceType: input.sequenceType ?? "first",
        customerId: input.customerId,
        metadata: input.metadata,
        createdAt: new Date().toISOString(),
        _links: { checkout: { href: `https://mollie.test/checkout/${n}` } },
      };
      payments.set(p.id, p);
      return p;
    },
    async getPayment(id) {
      const p = payments.get(id);
      if (!p) throw new Error("not found");
      return p;
    },
    async listCustomerPayments() {
      return [...payments.values()];
    },
    async createSubscription(_c, input) {
      const id = `sub_${++n}`;
      subscriptions.set(id, { amount: input.amount.value, startDate: input.startDate, canceled: false });
      return { id };
    },
    async updateSubscription(_c, id, input) {
      subscriptions.get(id)!.amount = input.amount.value;
    },
    async cancelSubscription(_c, id) {
      subscriptions.get(id)!.canceled = true;
    },
    async deleteCustomer() {},
  };
  const recurring = (customerId: string, subscriptionId: string, status: MolliePayment["status"]) => {
    const p: MolliePayment = {
      id: `tr_${++n}`,
      status,
      amount: { currency: "EUR", value: "79.00" },
      description: "Abo",
      sequenceType: "recurring",
      customerId,
      subscriptionId,
      createdAt: new Date().toISOString(),
      paidAt: status === "paid" ? new Date().toISOString() : undefined,
      _links: {},
    };
    payments.set(p.id, p);
    return p.id;
  };
  return { client, payments, subscriptions, recurring };
}

describe("Abrechnung mit Mollie", () => {
  beforeEach(() => resetDbForTests());

  it("schaltet nach bezahlter Erstzahlung frei und legt das Abo an", async () => {
    const m = fakeMollie();
    const user = await createUser(`a${Date.now()}@test.de`, "x", "Test");
    const { checkoutUrl } = await startCheckout(user, { plan: "pro", interval: "monat", addons: ["insolvenz", "unbekannt"] }, m.client);
    expect(checkoutUrl).toMatch(/^https:\/\/mollie\.test/);
    const payment = [...m.payments.values()][0]!;
    expect(payment.amount.value).toBe("128.00");
    expect((await findUserById(user.id))!.status).toBe("pending");

    payment.status = "paid";
    const now = new Date("2026-10-05T12:00:00Z");
    await processPayment(payment.id, m.client, now);
    await processPayment(payment.id, m.client, now); // doppelter Webhook ändert nichts

    const after = (await findUserById(user.id))!;
    expect(after.status).toBe("active");
    expect(after.plan).toBe("pro");
    expect(after.addons).toEqual(["insolvenz"]);
    expect(after.currentPeriodEnd?.slice(0, 10)).toBe("2026-11-05");
    expect(m.subscriptions.size).toBe(1);
    const sub = [...m.subscriptions.values()][0]!;
    expect(sub).toMatchObject({ amount: "128.00", startDate: "2026-11-05" });
    expect(hasAccess(after, now)).toBe(true);
  });

  it("ordnet einen Kauf der A/B-Variante zu, genau einmal", async () => {
    const m = fakeMollie();
    const user = await createUser(`ab${Date.now()}@test.de`, "x", "Test");
    await startCheckout(user, { plan: "starter", interval: "jahr", addons: [], ab: "start.b~karten.a~fremd.x" }, m.client);
    const payment = [...m.payments.values()][0]!;
    expect(payment.metadata).toMatchObject({ ab: "start.b~karten.a" });
    payment.status = "paid";
    await processPayment(payment.id, m.client);
    await processPayment(payment.id, m.client);
    const stats = await abStats();
    const kauf = (exp: string, v: string) => stats.find((e) => e.id === exp)!.variants.find((x) => x.variant === v)!.counts.kauf;
    expect(kauf("start", "b")).toBe(1);
    expect(kauf("start", "a")).toBe(0);
    expect(kauf("karten", "a")).toBe(1);
  });

  it("setzt bei fehlgeschlagener Erstzahlung zurück", async () => {
    const m = fakeMollie();
    const user = await createUser(`b${Date.now()}@test.de`, "x", "Test");
    await startCheckout(user, { plan: "starter", interval: "jahr", addons: [] }, m.client);
    const payment = [...m.payments.values()][0]!;
    expect(payment.amount.value).toBe("290.00");
    payment.status = "failed";
    await processPayment(payment.id, m.client);
    const after = (await findUserById(user.id))!;
    expect(after.status).toBe("none");
    expect(hasAccess(after)).toBe(false);
  });

  it("verlängert bei Folgezahlung, markiert Zahlungsprobleme, kündigt und wechselt Tarif", async () => {
    const m = fakeMollie();
    const user = await createUser(`c${Date.now()}@test.de`, "x", "Test");
    await startCheckout(user, { plan: "pro", interval: "monat", addons: [] }, m.client);
    const first = [...m.payments.values()][0]!;
    first.status = "paid";
    const t0 = new Date("2026-10-05T12:00:00Z");
    await processPayment(first.id, m.client, t0);
    let u = (await findUserById(user.id))!;

    await processPayment(m.recurring(u.mollieCustomerId!, u.mollieSubscriptionId!, "paid"), m.client, new Date("2026-11-05T08:00:00Z"));
    u = (await findUserById(user.id))!;
    expect(u.currentPeriodEnd?.slice(0, 10)).toBe("2026-12-05");

    await processPayment(m.recurring(u.mollieCustomerId!, u.mollieSubscriptionId!, "failed"), m.client);
    u = (await findUserById(user.id))!;
    expect(u.status).toBe("past_due");
    expect(hasAccess(u, new Date("2026-12-10T00:00:00Z"))).toBe(true);
    expect(hasAccess(u, new Date("2026-12-20T00:00:00Z"))).toBe(false);

    await expect(changePlan(u, { plan: "business", addons: [] }, m.client)).rejects.toThrow();

    const subId = u.mollieSubscriptionId!;
    await cancelSubscription(u, m.client);
    u = (await findUserById(user.id))!;
    expect(u.status).toBe("canceled");
    expect(m.subscriptions.get(subId)!.canceled).toBe(true);
    expect(hasAccess(u, new Date("2026-12-01T00:00:00Z"))).toBe(true);
  });

  async function activeUser(m: ReturnType<typeof fakeMollie>, plan: "starter" | "pro" | "business", t0: Date) {
    const user = await createUser(`${plan}${Math.random()}@test.de`, "x", "Test");
    await startCheckout(user, { plan, interval: "monat", addons: [] }, m.client);
    const first = [...m.payments.values()].at(-1)!;
    first.status = "paid";
    await processPayment(first.id, m.client, t0);
    return (await findUserById(user.id))!;
  }

  it("schaltet ein Upgrade sofort frei und bucht den Unterschied anteilig ab", async () => {
    const m = fakeMollie();
    const t0 = new Date("2026-10-05T12:00:00Z");
    const u = await activeUser(m, "starter", t0);
    // Halbe Laufzeit vorbei (Periode 05.10. bis 05.11.)
    const res = await changePlan(u, { plan: "business", addons: [] }, m.client, new Date("2026-10-21T00:00:00Z"));
    expect(res.effective).toBe("now");
    expect(m.subscriptions.get(u.mollieSubscriptionId!)!.amount).toBe("199.00");
    const upgrade = [...m.payments.values()].at(-1)!;
    expect(upgrade.sequenceType).toBe("recurring");
    expect(Number(upgrade.amount.value)).toBeGreaterThan(80);
    expect(Number(upgrade.amount.value)).toBeLessThan(170);
    expect((await findUserById(u.id))!.plan).toBe("business");
  });

  it("merkt ein Downgrade bis zur nächsten Abbuchung vor", async () => {
    const m = fakeMollie();
    const t0 = new Date("2026-10-05T12:00:00Z");
    const u = await activeUser(m, "business", t0);
    const before = m.payments.size;
    const res = await changePlan(u, { plan: "starter", addons: ["marktplatz"] }, m.client, t0);
    expect(res.effective).toBe("next_period");
    expect(m.payments.size).toBe(before);
    let now = (await findUserById(u.id))!;
    expect(now.plan).toBe("business");
    expect(now.pendingPlan).toBe("starter");
    await processPayment(m.recurring(u.mollieCustomerId!, u.mollieSubscriptionId!, "paid"), m.client, new Date("2026-11-05T08:00:00Z"));
    now = (await findUserById(u.id))!;
    expect(now.plan).toBe("starter");
    expect(now.addons).toEqual(["marktplatz"]);
    expect(now.pendingPlan).toBeNull();
  });

  it("verarbeitet gleichzeitige Webhooks nur einmal", async () => {
    const m = fakeMollie();
    const user = await createUser(`e${Date.now()}@test.de`, "x", "Test");
    await startCheckout(user, { plan: "pro", interval: "monat", addons: [] }, m.client);
    const first = [...m.payments.values()][0]!;
    first.status = "paid";
    await Promise.all([processPayment(first.id, m.client), processPayment(first.id, m.client), processPayment(first.id, m.client)]);
    expect(m.subscriptions.size).toBe(1);
  });

  it("lehnt einen zweiten Checkout mit laufendem Abo ab", async () => {
    const m = fakeMollie();
    const u = await activeUser(m, "pro", new Date());
    await expect(startCheckout(u, { plan: "business", interval: "monat", addons: [] }, m.client)).rejects.toThrow(/bereits ein Abo/);
  });

  it("beendet das Abo bei Rückbuchung", async () => {
    const m = fakeMollie();
    const u = await activeUser(m, "pro", new Date("2026-10-05T12:00:00Z"));
    const first = [...m.payments.values()][0]!;
    first.amountChargedBack = { currency: "EUR", value: "79.00" };
    const subId = u.mollieSubscriptionId!;
    await processPayment(first.id, m.client, new Date("2026-10-10T12:00:00Z"));
    const after = (await findUserById(u.id))!;
    expect(after.status).toBe("none");
    expect(m.subscriptions.get(subId)!.canceled).toBe(true);
    expect(hasAccess(after, new Date("2026-10-11T00:00:00Z"))).toBe(false);
  });

  it("schaltet nicht frei, wenn der Betrag nicht zum Tarif passt", async () => {
    const m = fakeMollie();
    const user = await createUser(`f${Date.now()}@test.de`, "x", "Test");
    await startCheckout(user, { plan: "starter", interval: "monat", addons: [] }, m.client);
    const first = [...m.payments.values()][0]!;
    first.status = "paid";
    first.metadata = { ...(first.metadata as object), plan: "business" };
    await expect(processPayment(first.id, m.client)).rejects.toThrow(/Betrag/);
    expect((await findUserById(user.id))!.status).not.toBe("active");
  });
});
