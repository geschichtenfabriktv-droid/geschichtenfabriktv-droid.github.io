import type { ReactNode } from "react";

type Tone = "neutral" | "ink" | "good" | "warn" | "bad" | "outline" | "tag";

const tones: Record<Tone, string> = {
  neutral: "bg-canvas text-ink-2",
  ink: "bg-ink text-white",
  good: "bg-good-soft text-[#0a7442]",
  warn: "bg-warn-soft text-[#8a5d00]",
  bad: "bg-bad-soft text-[#b42a22]",
  outline: "ring-1 ring-inset ring-line-strong text-ink-2",
  tag: "bg-tag text-ink",
};

export function Badge({ tone = "neutral", children, className = "" }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-semibold leading-none ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
