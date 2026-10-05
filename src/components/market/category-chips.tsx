"use client";

import type { CategorySummary } from "@/lib/data/repository";
import type { CategoryId } from "@/lib/domain/types";

interface Props {
  categories: CategorySummary[];
  active: CategoryId | "alle";
  total: number;
  onSelect: (id: CategoryId | "alle") => void;
}

export function CategoryChips({ categories, active, total, onSelect }: Props) {
  const chip = (id: CategoryId | "alle", label: string, count: number) => {
    const selected = active === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => onSelect(id)}
        aria-pressed={selected}
        className={`flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[13px] font-medium transition-all duration-200 ${
          selected ? "bg-ink text-white shadow-sm" : "bg-white text-ink-2 ring-1 ring-line hover:ring-line-strong hover:text-ink"
        }`}
      >
        {label}
        <span className={`tabular text-[11px] ${selected ? "text-white/60" : "text-muted"}`}>{count}</span>
      </button>
    );
  };

  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:flex-wrap md:px-0" role="toolbar" aria-label="Kategorien">
      {chip("alle", "Alle", total)}
      {categories.map((c) => chip(c.id, c.name, c.count))}
    </div>
  );
}
