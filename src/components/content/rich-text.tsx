import Link from "next/link";
import type { ReactNode } from "react";
import { LinkButton } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icons";
import type { Block } from "@/lib/content/types";

/** Fließtext mit **fett** und [Link](/pfad/). Externe Links öffnen ohne Referrer. */
export function Inline({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={i++}>{m[1]}</strong>);
    else if (m[3]?.startsWith("/"))
      out.push(
        <Link key={i++} href={m[3]}>
          {m[2]}
        </Link>,
      );
    else if (/^https?:\/\//.test(m[3] ?? ""))
      out.push(
        <a key={i++} href={m[3]} rel="noopener noreferrer" target="_blank">
          {m[2]}
        </a>,
      );
    else
      out.push(
        <a key={i++} href={m[3]}>
          {m[2]}
        </a>,
      );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-ar">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} id={anchor(b.text)}>
                {b.text}
              </h2>
            );
          case "h3":
            return <h3 key={i}>{b.text}</h3>;
          case "p":
            return (
              <p key={i}>
                <Inline text={b.text} />
              </p>
            );
          case "ul":
          case "ol": {
            const Tag = b.type;
            return (
              <Tag key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>
                    <Inline text={it} />
                  </li>
                ))}
              </Tag>
            );
          }
          case "tip":
            return (
              <aside key={i} className="not-prose my-8 rounded-[24px] bg-good-soft p-6">
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#0b7a43]">{b.title}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink">
                  <Inline text={b.text} />
                </p>
              </aside>
            );
          case "table":
            return (
              <div key={i} className="not-prose my-8 overflow-x-auto rounded-[20px] ring-1 ring-line">
                <table className="w-full min-w-[480px] text-left text-[14px]">
                  <thead className="bg-canvas">
                    <tr>
                      {b.head.map((h) => (
                        <th key={h} scope="col" className="px-4 py-3 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) => (
                          <td key={k} className="px-4 py-3 align-top text-ink-2">
                            <Inline text={c} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "cta":
            return (
              <aside key={i} className="not-prose my-10 rounded-[28px] bg-ink p-8 text-white">
                <p className="font-display text-[32px] leading-[1.05] tracking-tight">{b.title}</p>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/70">
                  <Inline text={b.text} />
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <LinkButton href="/demo/" variant="inverse">
                    Test-Dashboard ansehen <IconArrowRight size={16} />
                  </LinkButton>
                  <LinkButton href="/preise/" className="!bg-white/10 hover:!bg-white/20">
                    Preise ansehen
                  </LinkButton>
                </div>
              </aside>
            );
        }
      })}
    </div>
  );
}

export function anchor(text: string) {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
