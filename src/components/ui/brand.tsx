import Link from "next/link";

/** Bildmarke: ein Preisschild, gelochtes Etikett in Gelb. */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M12.2 5H26a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H12.2a3 3 0 0 1-2.2-.96l-6.3-7a3 3 0 0 1 0-4.08l6.3-7A3 3 0 0 1 12.2 5Z" fill="#ffd43b" stroke="#171a2b" strokeWidth="2" />
      <circle cx="12" cy="16" r="2.4" fill="#171a2b" />
      <path d="M18 20.5 21.5 16 24 18.2" stroke="#171a2b" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Brand({ href = "/", compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2" aria-label={compact ? "Arbitrage Radar, zur Startseite" : undefined}>
      <BrandMark className="size-8" />
      {!compact && (
        <span className="font-display text-[15px] leading-none whitespace-nowrap sm:text-[17px]">
          Arbitrage Radar
          <span className="sr-only">, zur Startseite</span>
        </span>
      )}
    </Link>
  );
}
