import "server-only";
import { AB_EVENTS, EXPERIMENT_IDS, EXPERIMENTS, type AbEvent, type Assignment, type ExperimentId } from "@/lib/experiments";
import { getDb } from "./db";
import { env } from "./env";
import type { User } from "./users";

/** Zählt ein Ereignis je Test und Variante für den heutigen Tag (nur Summen, keine Personendaten). */
export async function recordAb(assignment: Assignment, event: AbEvent, now = new Date()) {
  const entries = EXPERIMENT_IDS.filter((id) => assignment[id]).map((id) => [id, assignment[id]!] as const);
  if (!entries.length) return;
  const db = await getDb();
  const day = now.toISOString().slice(0, 10);
  for (const [exp, variant] of entries) {
    await db.query(
      `insert into ab_counts (day, experiment, variant, event, count) values ($1, $2, $3, $4, 1)
       on conflict (day, experiment, variant, event) do update set count = ab_counts.count + 1`,
      [day, exp, variant, event],
    );
  }
}

export type AbStats = {
  id: ExperimentId;
  label: string;
  variants: { variant: string; counts: Record<AbEvent, number> }[];
};

export async function abStats(sinceDays = 90): Promise<AbStats[]> {
  const db = await getDb();
  const rows = await db.query<{ experiment: string; variant: string; event: string; total: number | string }>(
    `select experiment, variant, event, sum(count) as total from ab_counts
     where day >= current_date - ($1::int) group by experiment, variant, event`,
    [sinceDays],
  );
  return EXPERIMENT_IDS.map((id) => ({
    id,
    label: EXPERIMENTS[id].label,
    variants: EXPERIMENTS[id].variants.map((variant) => ({
      variant,
      counts: Object.fromEntries(
        AB_EVENTS.map((ev) => [ev, Number(rows.find((r) => r.experiment === id && r.variant === variant && r.event === ev)?.total ?? 0)]),
      ) as Record<AbEvent, number>,
    })),
  }));
}

export function isAdmin(user: Pick<User, "email">) {
  return env.adminEmails.includes(user.email.toLowerCase());
}
