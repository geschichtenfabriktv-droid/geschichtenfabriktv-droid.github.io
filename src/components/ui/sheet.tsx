"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { IconClose } from "./icons";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/** Bottom-Sheet auf dem Smartphone, zentrierter Dialog ab Tablet. */
export function Sheet({ open, onClose, title, subtitle, children }: Props) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const focusables = panel.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), a[href], select, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" aria-label="Schließen" className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] animate-fade" onClick={onClose} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[28px] bg-white shadow-[var(--shadow-float)] outline-none animate-sheet sm:max-w-lg sm:rounded-[28px]"
      >
        <div className="flex justify-center pt-3 pb-2 sm:pt-4" aria-hidden>
          <div className="h-1 w-10 rounded-full bg-line-strong sm:hidden" />
        </div>
        <div className="flex items-start justify-between gap-4 px-6">
          <div>
            <h2 className="font-display text-[22px] leading-tight">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="-mr-2 grid size-10 shrink-0 place-items-center rounded-full text-ink-2 hover:bg-canvas" aria-label="Schließen">
            <IconClose />
          </button>
        </div>
        <div className="px-6 pt-5 pb-[max(env(safe-area-inset-bottom),24px)]">{children}</div>
      </div>
    </div>
  );
}
