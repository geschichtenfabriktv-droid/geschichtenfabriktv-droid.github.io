"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";

export function Field({ label, hint, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: ReactNode; error?: string | null }) {
  const id = useId();
  return (
    <label htmlFor={id} className="block">
      <span className="text-[13px] font-medium">{label}</span>
      <input
        id={id}
        {...props}
        aria-invalid={Boolean(error) || undefined}
        className="mt-1.5 h-12 w-full rounded-2xl bg-white px-4 text-[15px] ring-1 ring-line outline-none transition placeholder:text-muted focus:ring-2 focus:ring-ink aria-[invalid]:ring-bad"
      />
      {hint && <span className="mt-1.5 block text-[12px] text-muted">{hint}</span>}
    </label>
  );
}

export function Checkbox({ children, ...props }: InputHTMLAttributes<HTMLInputElement> & { children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-ink-2">
      <input type="checkbox" {...props} className="mt-0.5 size-[18px] shrink-0 cursor-pointer rounded accent-[#0b0b0c]" />
      <span>{children}</span>
    </label>
  );
}

export function FormMessage({ tone = "bad", children }: { tone?: "bad" | "good"; children: ReactNode }) {
  return (
    <p role={tone === "bad" ? "alert" : "status"} className={`rounded-2xl p-4 text-[13px] ${tone === "bad" ? "bg-bad-soft text-[#b42a22]" : "bg-good-soft text-[#0b7a43]"}`}>
      {children}
    </p>
  );
}
