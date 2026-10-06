import type { Block } from "@/lib/content/types";
import { anchor } from "./rich-text";

export function Toc({ blocks }: { blocks: Block[] }) {
  const heads = blocks.filter((b): b is { type: "h2"; text: string } => b.type === "h2");
  if (heads.length < 3) return null;
  return (
    <nav aria-label="Inhalt" className="rounded-[var(--radius-card)] bg-canvas p-6">
      <p className="text-[13px] font-medium text-muted">Inhalt</p>
      <ol className="mt-3 space-y-2 text-[14px]">
        {heads.map((h) => (
          <li key={h.text}>
            <a href={`#${anchor(h.text)}`} className="text-ink-2 hover:text-ink">
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
