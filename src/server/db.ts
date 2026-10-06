import "server-only";
import { env } from "./env";

/**
 * Minimaler SQL-Zugriff mit Platzhaltern ($1, $2 …). In Produktion Postgres (z. B. Neon in
 * Frankfurt), in Entwicklung und Tests eine eingebettete Postgres-Instanz (PGlite).
 */
export interface Db {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
}

const SCHEMA = `
create table if not exists users (
  id uuid primary key,
  email text not null unique,
  password_hash text not null,
  name text not null default '',
  created_at timestamptz not null default now(),
  plan text,
  plan_interval text,
  addons jsonb not null default '[]',
  status text not null default 'none',
  current_period_end timestamptz,
  mollie_customer_id text,
  mollie_subscription_id text,
  session_version integer not null default 1
);
create table if not exists payments (
  id text primary key,
  user_id uuid not null references users(id) on delete cascade,
  amount numeric(10,2) not null,
  description text not null,
  status text not null,
  sequence_type text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create table if not exists connections (
  user_id uuid not null references users(id) on delete cascade,
  provider text not null,
  status text not null,
  account_label text,
  scopes text,
  token_ciphertext text,
  token_expires_at timestamptz,
  consent_at timestamptz not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, provider)
);
create table if not exists oauth_states (
  state text primary key,
  user_id uuid not null references users(id) on delete cascade,
  provider text not null,
  created_at timestamptz not null default now()
);
create table if not exists password_resets (
  token_hash text primary key,
  user_id uuid not null references users(id) on delete cascade,
  expires_at timestamptz not null,
  used boolean not null default false
);
create table if not exists portfolios (
  user_id uuid primary key references users(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table users add column if not exists pending_plan text;
alter table users add column if not exists pending_addons jsonb;
create table if not exists rate_limits (
  key text primary key,
  count integer not null,
  reset_at timestamptz not null
);
create table if not exists cancellations (
  id uuid primary key,
  email text not null,
  name text not null,
  contract text not null,
  reason text,
  kind text not null,
  user_id uuid,
  created_at timestamptz not null default now()
);
create table if not exists ab_counts (
  day date not null,
  experiment text not null,
  variant text not null,
  event text not null,
  count integer not null default 0,
  primary key (day, experiment, variant, event)
);
`;

let instance: Promise<Db> | null = null;

async function create(): Promise<Db> {
  const url = env.databaseUrl;
  let db: Db;
  if (url) {
    const postgres = (await import("postgres")).default;
    const sql = postgres(url, { max: 5, idle_timeout: 20, prepare: false });
    db = { query: async (text, params = []) => (await sql.unsafe(text, params as never[])) as never };
  } else {
    if (env.isProduction && !process.env.ALLOW_EMBEDDED_DB) {
      throw new Error("DATABASE_URL fehlt. In Produktion wird eine Postgres-Datenbank benötigt.");
    }
    const { PGlite } = await import("@electric-sql/pglite");
    const pg = new PGlite(process.env.PGLITE_DIR || undefined);
    db = { query: async (text, params = []) => (await pg.query(text, params)).rows as never };
  }
  for (const stmt of SCHEMA.split(";").map((s) => s.trim()).filter(Boolean)) await db.query(stmt);
  return db;
}

export function getDb(): Promise<Db> {
  instance ??= create().catch((e) => {
    instance = null;
    throw e;
  });
  return instance;
}

/** Nur für Tests: frische Datenbank. */
export function resetDbForTests() {
  instance = null;
}
