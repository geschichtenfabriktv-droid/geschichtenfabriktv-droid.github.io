import "server-only";
import { NextResponse } from "next/server";
import { sha256 } from "./crypto";
import { getDb } from "./db";
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
  let originHost: string | null = null;
  try {
    originHost = new URL(origin).host;
  } catch {
    // z. B. "Origin: null" aus Sandbox-Frames
  }
  if (!originHost || !allowed.has(originHost)) throw new HttpError(403, "Ungültige Herkunft der Anfrage.");
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

/**
 * Begrenzung von Versuchen (Login, Registrierung, Kündigung …) über die Datenbank, damit sie auch
 * über mehrere Server-Instanzen hinweg gilt. Schlüssel werden gehasht gespeichert.
 */
export async function rateLimit(key: string, max = 8, windowMs = 15 * 60_000) {
  const db = await getDb();
  const rows = await db.query<{ count: number }>(
    `insert into rate_limits (key, count, reset_at) values ($1, 1, now() + ($2 || ' milliseconds')::interval)
     on conflict (key) do update set
       count = case when rate_limits.reset_at < now() then 1 else rate_limits.count + 1 end,
       reset_at = case when rate_limits.reset_at < now() then excluded.reset_at else rate_limits.reset_at end
     returning count`,
    [sha256(key), String(windowMs)],
  );
  if (Math.random() < 0.01) await db.query("delete from rate_limits where reset_at < now() - interval '1 day'");
  if (Number(rows[0]?.count ?? 0) > max) throw new HttpError(429, "Zu viele Versuche. Bitte warte einige Minuten.");
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "lokal";
}
