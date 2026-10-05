import Link from "next/link";
import { Fragment } from "react";

export function Breadcrumbs({ trail }: { trail: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Brotkrümel" className="text-[13px] text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {trail.map((t, i) => (
          <Fragment key={t.path}>
            {i > 0 && <li aria-hidden>/</li>}
            <li>
              {i < trail.length - 1 ? (
                <Link href={t.path} className="hover:text-ink">
                  {t.name}
                </Link>
              ) : (
                <span aria-current="page" className="text-ink-2">
                  {t.name}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
