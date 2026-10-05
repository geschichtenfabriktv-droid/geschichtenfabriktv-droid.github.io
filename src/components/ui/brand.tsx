import Link from "next/link";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="9" fill="#0b0b0c" />
      <path d="M9 21.5 14 15l3.5 3.5L23 11" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="23" cy="11" r="2.2" fill="#11a05a" />
    </svg>
  );
}

export function Brand({ href = "/", compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5" aria-label={compact ? "Arbitrage Radar, zur Startseite" : undefined}>
      <BrandMark className="size-8 transition-transform duration-300 group-hover:-rotate-6" />
      {!compact && (
        <span className="flex items-baseline gap-1.5 leading-none">
          <span className="font-display text-[22px] tracking-tight">Arbitrage</span>{" "}
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Radar</span>
          <span className="sr-only">, zur Startseite</span>
        </span>
      )}
    </Link>
  );
}
