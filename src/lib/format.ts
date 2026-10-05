const eur0 = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const eur2 = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const num = new Intl.NumberFormat("de-DE");

/** Beträge ab 1.000 € ohne Cent, darunter mit Cent. */
export function eur(value: number, opts: { cents?: boolean } = {}): string {
  const cents = opts.cents ?? Math.abs(value) < 1000;
  return (cents ? eur2 : eur0).format(value);
}

export function signedEur(value: number): string {
  return `${value >= 0 ? "+" : "−"}${eur(Math.abs(value))}`;
}

export function percent(value: number, digits = 0): string {
  return `${(value * 100).toLocaleString("de-DE", { maximumFractionDigits: digits, minimumFractionDigits: digits })} %`;
}

export function signedPercent(value: number): string {
  return `${value >= 0 ? "+" : "−"}${percent(Math.abs(value))}`;
}

export function number(value: number): string {
  return num.format(value);
}

export function relativeTime(iso: string, now: Date): string {
  const diffMin = Math.round((now.getTime() - new Date(iso).getTime()) / 60_000);
  if (diffMin < 1) return "gerade eben";
  if (diffMin < 60) return `vor ${diffMin} Min.`;
  const h = Math.round(diffMin / 60);
  if (h < 24) return `vor ${h} Std.`;
  const d = Math.round(h / 24);
  return `vor ${d} ${d === 1 ? "Tag" : "Tagen"}`;
}

export function countdown(iso: string, now: Date): string {
  const diffMin = Math.round((new Date(iso).getTime() - now.getTime()) / 60_000);
  if (diffMin <= 0) return "beendet";
  if (diffMin < 60) return `noch ${diffMin} Min.`;
  const h = Math.floor(diffMin / 60);
  if (h < 48) return `noch ${h} Std.`;
  return `noch ${Math.floor(h / 24)} Tage`;
}

export function dateDe(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" });
}

/** Liest Beträge in deutscher oder englischer Schreibweise: „1.234,56“, „1234,56“, „1234.56“. */
export function parseAmount(input: string): number {
  const s = input.trim().replace(/\s|€/g, "");
  if (!s) return Number.NaN;
  const normalized = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  return /^-?\d+(\.\d+)?$/.test(normalized) ? Number(normalized) : Number.NaN;
}

/** Betrag für Eingabefelder, z. B. „366,99“. */
export function amountInput(value: number, decimals = 2): string {
  return value.toFixed(decimals).replace(".", ",");
}
