import "server-only";
import { env } from "./env";

// MOLLIE_API_BASE nur für lokale Tests mit einer Mollie-Attrappe.
const API = process.env.MOLLIE_API_BASE ?? "https://api.mollie.com/v2";

export interface MollieAmount {
  currency: "EUR";
  value: string;
}

export interface MolliePayment {
  id: string;
  status: "open" | "pending" | "authorized" | "paid" | "canceled" | "expired" | "failed";
  amount: MollieAmount;
  description: string;
  sequenceType: "oneoff" | "first" | "recurring";
  customerId?: string;
  subscriptionId?: string;
  metadata?: Record<string, unknown> | null;
  paidAt?: string;
  createdAt: string;
  amountRefunded?: MollieAmount;
  amountChargedBack?: MollieAmount;
  _links: { checkout?: { href: string } };
}

export interface MollieClient {
  createCustomer(input: { name: string; email: string; metadata?: Record<string, unknown> }): Promise<{ id: string }>;
  createPayment(input: {
    amount: MollieAmount;
    description: string;
    customerId: string;
    sequenceType: "first" | "recurring";
    redirectUrl?: string;
    webhookUrl?: string;
    metadata: Record<string, unknown>;
    locale?: string;
  }): Promise<MolliePayment>;
  getPayment(id: string): Promise<MolliePayment>;
  listCustomerPayments(customerId: string): Promise<MolliePayment[]>;
  createSubscription(
    customerId: string,
    input: { amount: MollieAmount; interval: string; startDate: string; description: string; webhookUrl?: string; metadata: Record<string, unknown> },
    idempotencyKey?: string,
  ): Promise<{ id: string }>;
  updateSubscription(customerId: string, subscriptionId: string, input: { amount: MollieAmount; description?: string }): Promise<void>;
  cancelSubscription(customerId: string, subscriptionId: string): Promise<void>;
  deleteCustomer(customerId: string): Promise<void>;
}

export function amount(value: number): MollieAmount {
  return { currency: "EUR", value: value.toFixed(2) };
}

export class MollieError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function call<T>(method: string, path: string, body?: unknown, headers: Record<string, string> = {}): Promise<T> {
  const key = env.mollieApiKey;
  if (!key) throw new Error("MOLLIE_API_KEY ist nicht gesetzt.");
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new MollieError(res.status, `Mollie ${method} ${path}: ${res.status} ${(data as { detail?: string }).detail ?? ""}`);
  return data as T;
}

export const mollie: MollieClient = {
  createCustomer: (input) => call("POST", "/customers", input),
  createPayment: (input) => call("POST", "/payments", input),
  getPayment: (id) => call("GET", `/payments/${encodeURIComponent(id)}`),
  listCustomerPayments: async (customerId) =>
    (await call<{ _embedded?: { payments: MolliePayment[] } }>("GET", `/customers/${encodeURIComponent(customerId)}/payments?limit=50`))._embedded
      ?.payments ?? [],
  createSubscription: (customerId, input, idempotencyKey) =>
    call("POST", `/customers/${encodeURIComponent(customerId)}/subscriptions`, input, idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
  updateSubscription: (customerId, id, input) =>
    call("PATCH", `/customers/${encodeURIComponent(customerId)}/subscriptions/${encodeURIComponent(id)}`, input),
  cancelSubscription: (customerId, id) =>
    call<void>("DELETE", `/customers/${encodeURIComponent(customerId)}/subscriptions/${encodeURIComponent(id)}`).catch((e) => {
      // Bereits gekündigt oder nicht mehr vorhanden: Ziel ist erreicht.
      if (e instanceof MollieError && [404, 410, 422].includes(e.status)) return;
      throw e;
    }),
  deleteCustomer: (customerId) => call("DELETE", `/customers/${encodeURIComponent(customerId)}`),
};

export function isMollieConfigured() {
  return Boolean(env.mollieApiKey);
}
