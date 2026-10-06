import type { CategoryId } from "./domain/types";

export type PlanId = "starter" | "pro" | "business";
export type BillingInterval = "monat" | "jahr";
export type AddonId = "insolvenz" | "marktplatz";
export type Feature = "autopilot" | "inserat" | "kauf" | "insolvenz" | "vorbestellung";

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
    features: ["kauf", "inserat"],
    bullets: [
      "7 Kategorien inkl. Dienstleistungen",
      "Gewinnwahrscheinlichkeit & Marktanalyse",
      "Einstellen auf eBay mit einem Klick",
      "1 verbundener Marktplatz",
      "Empfohlener Verkaufspreis je Chance",
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
    features: ["kauf", "inserat", "autopilot", "vorbestellung"],
    bullets: [
      "Alles aus Starter",
      "Autopilot: Angebot öffnen & sofort einstellen",
      "Vorbestell-Radar mit 2×-Kandidaten",
      "3 verbundene Marktplätze",
    ],
  },
  {
    id: "business",
    name: "Business",
    tagline: "Für Händler mit Insolvenzankäufen",
    monthly: 199,
    yearly: 1990,
    marketplaces: 99,
    features: ["kauf", "inserat", "autopilot", "vorbestellung", "insolvenz"],
    bullets: [
      "Alles aus Pro",
      "Insolvenz-Finder mit Maximalgebot",
      "Unbegrenzte Marktplätze",
      "Bevorzugter Support per E-Mail",
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
  { id: "marktplatz", name: "Zusätzlicher Marktplatz", description: "Einen zweiten Marktplatz verbinden", monthly: 9, plans: ["starter"] },
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

/** Wie viele Verkaufsplattformen (eBay, Amazon) gleichzeitig verbunden sein dürfen. */
export function marketplaceLimit(plan: PlanId | null | undefined, addons: AddonId[]): number {
  const p = getPlan(plan);
  if (!p) return 0;
  return p.marketplaces + (addons.includes("marktplatz") ? 1 : 0);
}

export const GUARANTEE_DAYS = 14;

export type Country = "DE" | "AT" | "CH";
export const COUNTRIES: readonly { id: Country; name: string }[] = [
  { id: "DE", name: "Deutschland" },
  { id: "AT", name: "Österreich" },
  { id: "CH", name: "Schweiz" },
];

export function isCountry(v: unknown): v is Country {
  return v === "DE" || v === "AT" || v === "CH";
}

/** Deutschland in jedem Tarif; Österreich und die Schweiz im Business-Tarif. */
export function countriesAllowed(plan: PlanId | null | undefined): Country[] {
  if (!getPlan(plan)) return [];
  return plan === "business" ? ["DE", "AT", "CH"] : ["DE"];
}
