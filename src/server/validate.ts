import "server-only";
import { HttpError } from "./http";

export function email(v: unknown): string {
  const s = typeof v === "string" ? v.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) || s.length > 254) throw new HttpError(400, "Bitte gib eine gültige E-Mail-Adresse ein.");
  return s;
}

export function password(v: unknown): string {
  const s = typeof v === "string" ? v : "";
  if (s.length < 10) throw new HttpError(400, "Das Passwort muss mindestens 10 Zeichen haben.");
  if (s.length > 200) throw new HttpError(400, "Das Passwort ist zu lang.");
  return s;
}

export function text(v: unknown, max = 200, field = "Eingabe"): string {
  const s = typeof v === "string" ? v.trim() : "";
  if (s.length > max) throw new HttpError(400, `${field} ist zu lang.`);
  return s;
}

export function accepted(v: unknown, message: string) {
  if (v !== true) throw new HttpError(400, message);
}
