import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { env } from "./env";
import { findUserById, type User } from "./users";

const COOKIE = "ar_session";
const MAX_AGE = 60 * 60 * 24 * 30;

function secret() {
  return new TextEncoder().encode(env.authSecret);
}

export async function createSessionToken(user: Pick<User, "id" | "sessionVersion">): Promise<string> {
  return new SignJWT({ v: user.sessionVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

export async function startSession(user: Pick<User, "id" | "sessionVersion">) {
  const jar = await cookies();
  jar.set(COOKIE, await createSessionToken(user), {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function readSession(token: string | undefined): Promise<{ userId: string; version: number } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    if (!payload.sub) return null;
    return { userId: payload.sub, version: Number(payload.v ?? 0) };
  } catch {
    return null;
  }
}

/** Angemeldeter Nutzer oder null. Sitzungen werden bei Passwortänderung ungültig (session_version). */
export async function getCurrentUser(): Promise<User | null> {
  const jar = await cookies();
  const session = await readSession(jar.get(COOKIE)?.value);
  if (!session) return null;
  const user = await findUserById(session.userId);
  if (!user || user.sessionVersion !== session.version) return null;
  return user;
}
