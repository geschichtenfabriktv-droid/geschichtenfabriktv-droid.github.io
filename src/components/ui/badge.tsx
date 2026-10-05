import type { ReactNode } from "react";

type Tone = "neutral" | "ink" | "good" | "warn" | "bad" | "outline";

const tones: Record<Tone, string> = {
  neutral: "bg-canvas text-ink-2",
  ink: "bg-ink text-white",
  good: "bg-good-soft text-[#0b7a43]",
  warn: "bg-warn-soft text-[#8a5d00]",
  bad: "bg-bad-soft text-[#b42a22]",
  outline: "ring-1 ring-line-strong text-ink-2",
};

export function Badge({ tone = "neutral", children, className = "" }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-tight ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
