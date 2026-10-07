import "server-only";
import type { NewsItem } from "@/lib/domain/types";
import { fetchCached } from "./fetch-cached";

/**
 * Erscheinungskalender für Spiele und Konsolen aus Wikidata (offene Daten, CC0, frei auch für
 * kommerzielle Nutzung). Übernommen werden nur Einträge mit tagesgenauem Termin in den nächsten
 * 120 Tagen; Link auf den deutschen, sonst englischen Wikipedia-Artikel. Für den Wiederverkauf zählen
 * nur Konsolen und Spiele mit Konsolenfassung (physische Ausgaben, Sammlereditionen), die einen
 * Wikipedia-Artikel haben (also öffentlich wahrgenommen werden).
 */
const ENDPOINT = "https://query.wikidata.org/sparql";
const DAYS_AHEAD = 120;
const TTL_S = 6 * 60 * 60;

/** Videospiel, Videospielkonsole, Handheld-Konsole. */
const GAME = "Q7889";
const KINDS = [`wd:${GAME}`, "wd:Q8076", "wd:Q941818"];
const CONSOLE_PLATFORM = /playstation|nintendo|switch|xbox/i;

export function calendarQuery(): string {
  return `SELECT ?item ?itemLabel ?kind ?date ?mod (GROUP_CONCAT(DISTINCT ?platLabel; separator=", ") AS ?platforms) (SAMPLE(?de) AS ?deArticle) (SAMPLE(?en) AS ?enArticle) WHERE {
  VALUES ?kind { ${KINDS.join(" ")} }
  ?item wdt:P31 ?kind; p:P577 ?st.
  ?st psv:P577 [ wikibase:timeValue ?date; wikibase:timePrecision 11 ].
  FILTER(?date > NOW() && ?date < NOW() + "P${DAYS_AHEAD}D"^^xsd:duration)
  ?item schema:dateModified ?mod.
  OPTIONAL { ?item wdt:P400 ?plat. ?plat rdfs:label ?platLabel. FILTER(LANG(?platLabel) = "en") }
  OPTIONAL { ?de schema:about ?item; schema:isPartOf <https://de.wikipedia.org/>. }
  OPTIONAL { ?en schema:about ?item; schema:isPartOf <https://en.wikipedia.org/>. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
} GROUP BY ?item ?itemLabel ?kind ?date ?mod LIMIT 600`;
}

interface Binding {
  [k: string]: { value: string } | undefined;
}

/** Ein Eintrag je Titel mit dem frühesten künftigen Termin. */
export function parseCalendar(data: { results?: { bindings?: Binding[] } }, now: Date): NewsItem[] {
  const byItem = new Map<string, NewsItem>();
  for (const b of data.results?.bindings ?? []) {
    const item = b.item?.value;
    const label = b.itemLabel?.value?.trim();
    const date = b.date?.value?.slice(0, 10);
    if (!item || !label || !date || /^Q\d+$/.test(label)) continue;
    const qid = item.split("/").pop()!;
    const platforms = b.platforms?.value?.trim();
    const isGame = b.kind?.value?.endsWith(`/${GAME}`) ?? true;
    if (isGame && !CONSOLE_PLATFORM.test(platforms ?? "")) continue;
    const url = b.deArticle?.value ?? b.enArticle?.value;
    if (!url?.startsWith("https://")) continue;
    const mod = b.mod?.value && Number.isFinite(Date.parse(b.mod.value)) ? new Date(Math.min(Date.parse(b.mod.value), now.getTime())) : now;
    const entry: NewsItem = {
      id: `cal-${qid}`,
      title: `${label}${platforms ? ` (${platforms})` : ""}: Erscheinungstermin`,
      url,
      topic: "Spiele & Konsolen",
      publishedAt: mod.toISOString(),
      releaseDate: date,
      preorder: true,
    };
    const prev = byItem.get(qid);
    if (!prev || date < prev.releaseDate!) byItem.set(qid, entry);
  }
  return [...byItem.values()].sort((a, b) => a.releaseDate!.localeCompare(b.releaseDate!));
}

export async function scanCalendar(now: Date): Promise<NewsItem[]> {
  const url = `${ENDPOINT}?format=json&query=${encodeURIComponent(calendarQuery())}`;
  const res = await fetchCached(url, TTL_S, { headers: { Accept: "application/sparql-results+json" } }, 20_000);
  return parseCalendar(await res.json(), now);
}
