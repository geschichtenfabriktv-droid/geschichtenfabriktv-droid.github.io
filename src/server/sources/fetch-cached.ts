import "server-only";

/**
 * Abrufe für offene Quellen. `revalidate` nutzt den Daten-Cache von Next/Vercel, der über alle
 * Server-Instanzen hinweg gilt: Jede Adresse wird höchstens einmal je Zeitraum bei der Quelle gefragt.
 */
export const UA = { "User-Agent": "ArbitrageRadar/1.0 (+https://arbitrageradar.de)" };

type Init = RequestInit & { next?: { revalidate?: number } };

export async function fetchCached(url: string, revalidateSeconds: number, init: RequestInit = {}, timeoutMs = 12_000): Promise<Response> {
  const res = await fetch(url, {
    ...init,
    headers: { ...UA, ...(init.headers as Record<string, string> | undefined) },
    next: { revalidate: revalidateSeconds },
    signal: AbortSignal.timeout(timeoutMs),
  } as Init);
  if (!res.ok) throw new Error(`${new URL(url).host} ${res.status}`);
  return res;
}

/** Führt `fn` für alle Einträge mit begrenzter Parallelität aus und hört nach `deadline` (ms seit 1970) auf. */
export async function mapLimited<T, R>(items: readonly T[], limit: number, deadline: number, fn: (item: T) => Promise<R>) {
  const results: R[] = [];
  let failed = 0;
  let skipped = 0;
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const item = items[next++]!;
      if (Date.now() > deadline) {
        skipped++;
        continue;
      }
      try {
        results.push(await fn(item));
      } catch {
        failed++;
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return { results, failed, skipped };
}
