import "server-only";
import { NextResponse } from "next/server";
import { env } from "./env";
import { getCurrentUser } from "./session";
import type { User } from "./users";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export function error(message: string, status = 400) {
  return json({ error: message }, status);
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Schutz gegen Cross-Site-Requests bei zustandsändernden Aufrufen. */
export function assertSameOrigin(req: Request) {
  if (req.method === "GET" || req.method === "HEAD") return;
  const origin = req.headers.get("origin");
  if (!origin) return; // z. B. Server-zu-Server; Cookies sind SameSite=Lax
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const allowed = new Set([new URL(env.appUrl).host, host].filter(Boolean));
  if (!allowed.has(new URL(origin).host)) throw new HttpError(403, "Ungültige Herkunft der Anfrage.");
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new HttpError(401, "Bitte melde dich an.");
  return user;
}

export function handler<A extends unknown[]>(fn: (req: Request, ...args: A) => Promise<Response>) {
  return async (req: Request, ...args: A): Promise<Response> => {
    try {
      assertSameOrigin(req);
      return await fn(req, ...args);
    } catch (e) {
      if (e instanceof HttpError) return error(e.message, e.status);
      console.error(e);
      return error("Es ist ein Fehler aufgetreten. Bitte versuche es erneut.", 500);
    }
  };
}

export async function readJson<T = Record<string, unknown>>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new HttpError(400, "Ungültige Anfrage.");
  }
}

/** Einfache Begrenzung pro Instanz gegen Passwort-Raten. */
const attempts = new Map<string, { count: number; until: number }>();
export function rateLimit(key: string, max = 8, windowMs = 15 * 60_000) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.until < now) {
    attempts.set(key, { count: 1, until: now + windowMs });
    return;
  }
  entry.count++;
  if (entry.count > max) throw new HttpError(429, "Zu viele Versuche. Bitte warte einige Minuten.");
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "lokal";
}
