"use client";

import { useMemo, useState } from "react";
import type { NewsItem } from "@/lib/domain/types";

const day = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const TOPICS = ["Spiele & Konsolen", "Technik"] as const;

type SortKey = "neu" | "termin";
const chip = (active: boolean) =>
  `h-9 shrink-0 rounded-[10px] px-3 text-[13px] font-medium transition ${active ? "bg-ink text-white" : "bg-white text-ink-2 ring-1 ring-line hover:text-ink"}`;

/**
 * Neuheiten und Erscheinungstermine aus offiziellen Hersteller-News. Nur Titel, Termin und Link;
 * wo man vorbestellt, steht in der Meldung beim Hersteller.
 */
export function NewsList({ news, limit, filters = false }: { news: NewsItem[]; limit?: number; filters?: boolean }) {
  const [topic, setTopic] = useState<NewsItem["topic"] | "Alle">("Alle");
  const [onlyDates, setOnlyDates] = useState(false);
  const [sort, setSort] = useState<SortKey>("neu");

  const filtered = useMemo(
    () =>
      news
        .filter((n) => topic === "Alle" || n.topic === topic)
        .filter((n) => !onlyDates || n.releaseDate || n.preorder)
        .sort((a, b) =>
          sort === "termin" ? (a.releaseDate ?? "9999").localeCompare(b.releaseDate ?? "9999") || b.publishedAt.localeCompare(a.publishedAt) : b.publishedAt.localeCompare(a.publishedAt),
        ),
    [news, topic, onlyDates, sort],
  );
  const shown = limit ? filtered.slice(0, limit) : filtered;
  const dirty = topic !== "Alle" || onlyDates || sort !== "neu";

  return (
    <div>
      {filters && (
        <div className="mb-4 space-y-3">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0" role="toolbar" aria-label="Thema">
            {(["Alle", ...TOPICS] as const).map((t) => (
              <button key={t} type="button" aria-pressed={topic === t} onClick={() => setTopic(t)} className={chip(topic === t)}>
                {t}
              </button>
            ))}
            <button type="button" aria-pressed={onlyDates} onClick={() => setOnlyDates(!onlyDates)} className={chip(onlyDates)}>
              Nur Termine und Vorbestellungen
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 text-[13px] text-muted" aria-live="polite">
            <span>{filtered.length} Meldungen</span>
            <span className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <span className="sr-only">Sortieren nach</span>
                <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="h-9 rounded-[10px] bg-white px-3 text-[13px] font-medium text-ink ring-1 ring-line outline-none focus:ring-ink">
                  <option value="neu">Neueste zuerst</option>
                  <option value="termin">Nächster Termin zuerst</option>
                </select>
              </label>
              {dirty && (
                <button
                  type="button"
                  onClick={() => {
                    setTopic("Alle");
                    setOnlyDates(false);
                    setSort("neu");
                  }}
                  className="font-medium text-ink underline underline-offset-4"
                >
                  Zurücksetzen
                </button>
              )}
            </span>
          </div>
        </div>
      )}
      <ul className="divide-y divide-line rounded-[var(--radius-card)] bg-white ring-1 ring-line">
        {shown.map((n) => (
          <li key={n.id}>
            <a href={n.url} target="_blank" rel="noopener noreferrer nofollow" className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-canvas">
              <span className="min-w-0">
                <span className="block text-[15px] font-medium">{n.title}</span>
                <span className="block text-[12px] text-muted">
                  {n.topic} · {day.format(new Date(n.publishedAt))}
                  {n.releaseDate && <strong className="font-semibold text-ink"> · Termin {day.format(new Date(n.releaseDate))}</strong>}
                  {!n.releaseDate && n.preorder && <strong className="font-semibold text-ink"> · Erscheinen oder Vorbestellung</strong>}
                </span>
              </span>
              <span className="shrink-0 text-[13px] font-medium underline underline-offset-4">Lesen</span>
            </a>
          </li>
        ))}
        {shown.length === 0 && <li className="px-4 py-6 text-sm text-muted">Keine Meldung passt zu den Filtern.</li>}
      </ul>
      <p className="mt-2 text-[12px] leading-relaxed text-muted">Offizielle Meldungen der Hersteller. Wo und ab wann man vorbestellen kann, steht in der Meldung.</p>
    </div>
  );
}
