/**
 * A/B-Tests ohne Cookies und ohne Drittanbieter.
 *
 * Jeder Seitenaufruf bekommt per Zufall eine Variante (Inline-Skript im <head>, vor dem ersten
 * Zeichnen, daher kein Flackern). Gespeichert wird nichts im Browser; gezählt werden nur Summen pro
 * Tag, Test, Variante und Ereignis. Bis zum Kauf wird die Variante als URL-Parameter `ab`
 * mitgegeben (z. B. `start.b~karten.a`).
 */

export const EXPERIMENTS = {
  /** Startseite: Überschrift und Haupt-Button. */
  start: { label: "Startseite: Überschrift und Button", variants: ["a", "b"] },
  /** Tarifkarten (Preisseite und Startseite): Button-Text und Garantiehinweis am Button. */
  karten: { label: "Tarifkarten: Button-Text", variants: ["a", "b"] },
} as const;

export type ExperimentId = keyof typeof EXPERIMENTS;
export const EXPERIMENT_IDS = Object.keys(EXPERIMENTS) as ExperimentId[];

export const AB_EVENTS = ["ansicht", "klick", "checkout", "kauf"] as const;
export type AbEvent = (typeof AB_EVENTS)[number];

export const AB_EVENT_LABELS: Record<AbEvent, string> = {
  ansicht: "Ansichten",
  klick: "Klicks",
  checkout: "Checkout geöffnet",
  kauf: "Käufe",
};

export function isExperimentId(v: unknown): v is ExperimentId {
  return typeof v === "string" && Object.hasOwn(EXPERIMENTS, v);
}

export function isVariant(exp: ExperimentId, v: unknown): v is string {
  return typeof v === "string" && (EXPERIMENTS[exp].variants as readonly string[]).includes(v);
}

export function isAbEvent(v: unknown): v is AbEvent {
  return typeof v === "string" && (AB_EVENTS as readonly string[]).includes(v);
}

export type Assignment = Partial<Record<ExperimentId, string>>;

/** `start.b~karten.a` → { start: "b", karten: "a" }; Unbekanntes wird verworfen. */
export function parseAbTag(tag: unknown): Assignment {
  const out: Assignment = {};
  if (typeof tag !== "string" || tag.length > 200) return out;
  for (const part of tag.split("~")) {
    const [exp, variant] = part.split(".");
    if (isExperimentId(exp) && isVariant(exp, variant)) out[exp] = variant;
  }
  return out;
}

export function formatAbTag(a: Assignment): string {
  return EXPERIMENT_IDS.filter((e) => a[e])
    .map((e) => `${e}.${a[e]}`)
    .join("~");
}

/** Wird als Inline-Skript in den <head> geschrieben: setzt html[data-ab-<test>] zufällig. */
export const AB_HEAD_SCRIPT = `(function(){try{var e=${JSON.stringify(
  Object.fromEntries(EXPERIMENT_IDS.map((id) => [id, EXPERIMENTS[id].variants])),
)},d=document.documentElement;for(var k in e){var v=e[k];d.setAttribute("data-ab-"+k,v[Math.floor(Math.random()*v.length)])}}catch(_){}})();`;

/** CSS: Variante A ist ohne JavaScript sichtbar, B nur bei gesetztem Attribut. */
export const AB_CSS = EXPERIMENT_IDS.flatMap((id) =>
  EXPERIMENTS[id].variants.map((v, i) =>
    i === 0
      ? `html[data-ab-${id}]:not([data-ab-${id}="${v}"]) .ab-${id}-${v}{display:none!important}`
      : `html:not([data-ab-${id}="${v}"]) .ab-${id}-${v}{display:none!important}`,
  ),
).join("");

/** Zweiseitiger z-Test für zwei Anteile; liefert die Konfidenz (0–1), dass sich B von A unterscheidet. */
export function confidence(convA: number, nA: number, convB: number, nB: number): number | null {
  if (nA < 1 || nB < 1) return null;
  const pA = convA / nA;
  const pB = convB / nB;
  const p = (convA + convB) / (nA + nB);
  const se = Math.sqrt(p * (1 - p) * (1 / nA + 1 / nB));
  if (!se) return null;
  const z = Math.abs(pB - pA) / se;
  return 1 - 2 * (1 - normalCdf(z));
}

function normalCdf(z: number) {
  // Abramowitz-Stegun 26.2.17
  const t = 1 / (1 + 0.2316419 * z);
  const d = 0.3989422804014327 * Math.exp((-z * z) / 2);
  const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return 1 - p;
}
