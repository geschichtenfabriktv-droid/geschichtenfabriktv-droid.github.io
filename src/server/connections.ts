import "server-only";
import type { ProviderId } from "@/lib/providers";
import { decrypt, encrypt, randomToken } from "./crypto";
import { getDb } from "./db";

export interface StoredTokens {
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  accountId?: string;
}

export interface Connection {
  provider: ProviderId;
  status: "verbunden" | "abgelaufen" | "fehler";
  accountLabel: string | null;
  scopes: string | null;
  tokenExpiresAt: string | null;
  consentAt: string;
  updatedAt: string;
}

export async function listConnections(userId: string): Promise<Connection[]> {
  const db = await getDb();
  const rows = await db.query<{
    provider: ProviderId;
    status: Connection["status"];
    account_label: string | null;
    scopes: string | null;
    token_expires_at: Date | null;
    consent_at: Date;
    updated_at: Date;
  }>("select provider, status, account_label, scopes, token_expires_at, consent_at, updated_at from connections where user_id = $1", [userId]);
  return rows.map((r) => ({
    provider: r.provider,
    status: r.status,
    accountLabel: r.account_label,
    scopes: r.scopes,
    tokenExpiresAt: r.token_expires_at ? new Date(r.token_expires_at).toISOString() : null,
    consentAt: new Date(r.consent_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  }));
}

/** Tokens werden ausschließlich verschlüsselt (AES-256-GCM) gespeichert. */
export async function saveConnection(
  userId: string,
  provider: ProviderId,
  tokens: StoredTokens,
  meta: { accountLabel?: string | null; scopes?: string | null; expiresAt?: Date | null; consentAt: Date },
) {
  const db = await getDb();
  await db.query(
    `insert into connections (user_id, provider, status, account_label, scopes, token_ciphertext, token_expires_at, consent_at, updated_at)
     values ($1, $2, 'verbunden', $3, $4, $5, $6, $7, now())
     on conflict (user_id, provider) do update set status = 'verbunden', account_label = excluded.account_label, scopes = excluded.scopes,
       token_ciphertext = excluded.token_ciphertext, token_expires_at = excluded.token_expires_at, consent_at = excluded.consent_at, updated_at = now()`,
    [userId, provider, meta.accountLabel ?? null, meta.scopes ?? null, encrypt(JSON.stringify(tokens)), meta.expiresAt ?? null, meta.consentAt],
  );
}

export async function getTokens(userId: string, provider: ProviderId): Promise<StoredTokens | null> {
  const db = await getDb();
  const rows = await db.query<{ token_ciphertext: string | null }>(
    "select token_ciphertext from connections where user_id = $1 and provider = $2",
    [userId, provider],
  );
  const c = rows[0]?.token_ciphertext;
  return c ? (JSON.parse(decrypt(c)) as StoredTokens) : null;
}

export async function setConnectionStatus(userId: string, provider: ProviderId, status: Connection["status"]) {
  const db = await getDb();
  await db.query("update connections set status = $3, updated_at = now() where user_id = $1 and provider = $2", [userId, provider, status]);
}

export async function deleteConnection(userId: string, provider: ProviderId) {
  const db = await getDb();
  await db.query("delete from connections where user_id = $1 and provider = $2", [userId, provider]);
}

/** CSRF-Schutz für OAuth: einmaliger State, 15 Minuten gültig, an Nutzer und Anbieter gebunden. */
export async function createOAuthState(userId: string, provider: ProviderId): Promise<string> {
  const db = await getDb();
  const state = randomToken(24);
  await db.query("delete from oauth_states where created_at < now() - interval '1 hour'");
  await db.query("insert into oauth_states (state, user_id, provider) values ($1, $2, $3)", [state, userId, provider]);
  return state;
}

export async function consumeOAuthState(state: string, provider: ProviderId): Promise<string | null> {
  const db = await getDb();
  const rows = await db.query<{ user_id: string }>(
    "delete from oauth_states where state = $1 and provider = $2 and created_at > now() - interval '15 minutes' returning user_id",
    [state, provider],
  );
  return rows[0]?.user_id ?? null;
}
