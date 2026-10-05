import type { CategoryId } from "./domain/types";

export type PlanId = "starter" | "pro" | "business";
export type BillingInterval = "monat" | "jahr";
export type AddonId = "insolvenz" | "marktplatz" | "alarm" | "team";
export type Feature = "autopilot" | "inserat" | "kauf" | "insolvenz" | "api" | "vorbestellung";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  /** Monatspreis brutto in EUR */
  monthly: number;
  /** Jahrespreis brutto in EUR (zwei Monate geschenkt) */
  yearly: number;
  highlight?: boolean;
  marketplaces: number;
  seats: number;
  features: Feature[];
  bullets: string[];
}

/**
 * Preislogik: Einstieg unter den gängigen Arbitrage-Tools (Keepa, SellerAmp ~ 20–30 €),
 * Pro mit Autopilot im Bereich von Tactical Arbitrage (~ 60–130 $), Business für Händler mit
 * Insolvenzankäufen. Jahresabo = 10 Monatspreise. Ein einziger guter Deal deckt den Monatspreis.
 */
export const PLANS: readonly Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Für den Einstieg in Arbitrage",
    monthly: 29,
    yearly: 290,
    marketplaces: 1,
    seats: 1,
    features: ["kauf", "inserat"],
    bullets: [
      "7 Produkt-Kategorien inkl. Dienstleistungen",
      "Gewinnwahrscheinlichkeit & Marktanalyse",
      "Kaufen & Einstellen auf Knopfdruck",
      "1 verbundener Marktplatz",
      "Tägliche E-Mail mit Top-Chancen",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Für Reseller mit System",
    monthly: 79,
    yearly: 790,
    highlight: true,
    marketplaces: 3,
    seats: 1,
    features: ["kauf", "inserat", "autopilot", "vorbestellung"],
    bullets: [
      "Alles aus Starter",
      "Autopilot: kaufen & sofort einstellen",
      "Vorbestell-Radar mit 2×-Kandidaten",
      "Preisautomatik mit Break-even-Schutz",
      "3 verbundene Marktplätze",
    ],
  },
  {
    id: "business",
    name: "Business",
    tagline: "Für Händler und Teams",
    monthly: 199,
    yearly: 1990,
    marketplaces: 99,
    seats: 5,
    features: ["kauf", "inserat", "autopilot", "vorbestellung", "insolvenz", "api"],
    bullets: [
      "Alles aus Pro",
      "Insolvenz-Finder mit Maximalgebot",
      "Unbegrenzte Marktplätze",
      "5 Team-Zugänge",
      "API-Zugriff & Priorität im Support",
    ],
  },
] as const;

export interface Addon {
  id: AddonId;
  name: string;
  description: string;
  monthly: number;
  /** Für welche Pläne das Add-on buchbar ist */
  plans: PlanId[];
}

export const ADDONS: readonly Addon[] = [
  { id: "insolvenz", name: "Insolvenz-Finder", description: "Insolvenzmassen mit Maximalgebot und Bietlimit", monthly: 49, plans: ["starter", "pro"] },
  { id: "marktplatz", name: "Zusätzlicher Marktplatz", description: "Einen weiteren Marktplatz verbinden", monthly: 9, plans: ["starter", "pro"] },
  { id: "alarm", name: "Sofort-Alarm", description: "Push-Benachrichtigung in Echtzeit bei Top-Chancen", monthly: 12, plans: ["starter", "pro", "business"] },
  { id: "team", name: "Team-Zugang", description: "Ein weiterer Nutzer im Konto", monthly: 19, plans: ["pro", "business"] },
] as const;

export function getPlan(id: string | null | undefined): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function isPlanId(v: unknown): v is PlanId {
  return PLANS.some((p) => p.id === v);
}

export function isInterval(v: unknown): v is BillingInterval {
  return v === "monat" || v === "jahr";
}

export function sanitizeAddons(plan: PlanId, addons: unknown): AddonId[] {
  if (!Array.isArray(addons)) return [];
  const allowed = new Set(ADDONS.filter((a) => a.plans.includes(plan)).map((a) => a.id));
  return [...new Set(addons.filter((a): a is AddonId => typeof a === "string" && allowed.has(a as AddonId)))].sort();
}

/** Abo-Betrag je Abrechnungszeitraum. Add-ons im Jahresabo ebenfalls mit zwei Gratismonaten. */
export function priceFor(plan: PlanId, interval: BillingInterval, addons: AddonId[] = []): number {
  const p = getPlan(plan);
  if (!p) throw new Error("Unbekannter Plan");
  const base = interval === "jahr" ? p.yearly : p.monthly;
  const addonMonthly = sanitizeAddons(plan, addons).reduce((s, id) => s + (ADDONS.find((a) => a.id === id)?.monthly ?? 0), 0);
  return Math.round((base + addonMonthly * (interval === "jahr" ? 10 : 1)) * 100) / 100;
}

export function hasFeature(plan: PlanId | null | undefined, addons: AddonId[], feature: Feature): boolean {
  const p = getPlan(plan);
  if (!p) return false;
  if (p.features.includes(feature)) return true;
  return feature === "insolvenz" && addons.includes("insolvenz");
}

export function categoryAllowed(plan: PlanId | null | undefined, addons: AddonId[], category: CategoryId): boolean {
  if (category === "insolvenz") return hasFeature(plan, addons, "insolvenz");
  if (category === "vorbestellung") return hasFeature(plan, addons, "vorbestellung");
  return Boolean(getPlan(plan));
}

export const GUARANTEE_DAYS = 14;
