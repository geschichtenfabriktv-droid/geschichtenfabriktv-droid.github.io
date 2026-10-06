import Link from "next/link";
import { IconArrowUpRight } from "@/components/ui/icons";

export function CardLinks({ title, items }: { title: string; items: { href: string; label: string; text: string }[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-16">
      <h2 className="font-display text-[26px] leading-[1.08] md:text-[32px]">{title}</h2>
      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((it) => (
          <li key={it.href} className="min-w-0">
            <Link href={it.href} className="group flex h-full flex-col rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line transition hover:ring-ink">
              <span className="flex items-start justify-between gap-3 text-[17px] font-semibold tracking-tight">
                {it.label}
                <IconArrowUpRight size={18} className="shrink-0 text-muted transition group-hover:text-ink" />
              </span>
              <span className="mt-2 text-[14px] leading-relaxed text-ink-2">{it.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
