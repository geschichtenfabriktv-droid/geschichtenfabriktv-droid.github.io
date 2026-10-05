import { beforeEach, describe, expect, it } from "vitest";
import { cancelSubscription, changePlan, processPayment, startCheckout } from "@/server/billing";
import { resetDbForTests } from "@/server/db";
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
        sequenceType: "first",
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
    const { checkoutUrl } = await startCheckout(user, { plan: "pro", interval: "monat", addons: ["alarm", "unbekannt"] }, m.client);
    expect(checkoutUrl).toMatch(/^https:\/\/mollie\.test/);
    const payment = [...m.payments.values()][0]!;
    expect(payment.amount.value).toBe("91.00");
    expect((await findUserById(user.id))!.status).toBe("pending");

    payment.status = "paid";
    const now = new Date("2026-10-05T12:00:00Z");
    await processPayment(payment.id, m.client, now);
    await processPayment(payment.id, m.client, now); // doppelter Webhook ändert nichts

    const after = (await findUserById(user.id))!;
    expect(after.status).toBe("active");
    expect(after.plan).toBe("pro");
    expect(after.addons).toEqual(["alarm"]);
    expect(after.currentPeriodEnd?.slice(0, 10)).toBe("2026-11-05");
    expect(m.subscriptions.size).toBe(1);
    const sub = [...m.subscriptions.values()][0]!;
    expect(sub).toMatchObject({ amount: "91.00", startDate: "2026-11-05" });
    expect(hasAccess(after, now)).toBe(true);
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

  it("ändert den Abo-Betrag beim Tarifwechsel", async () => {
    const m = fakeMollie();
    const user = await createUser(`d${Date.now()}@test.de`, "x", "Test");
    await startCheckout(user, { plan: "starter", interval: "monat", addons: [] }, m.client);
    const first = [...m.payments.values()][0]!;
    first.status = "paid";
    await processPayment(first.id, m.client);
    const u = (await findUserById(user.id))!;
    await changePlan(u, { plan: "business", addons: ["team"] }, m.client);
    expect(m.subscriptions.get(u.mollieSubscriptionId!)!.amount).toBe("218.00");
    expect((await findUserById(user.id))!.plan).toBe("business");
  });
});
