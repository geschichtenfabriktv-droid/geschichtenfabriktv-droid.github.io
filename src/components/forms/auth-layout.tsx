import Link from "next/link";
import type { ReactNode } from "react";
import { Brand } from "@/components/ui/brand";
import { IconCheck } from "@/components/ui/icons";

export function AuthLayout({ title, subtitle, children, aside }: { title: string; subtitle?: ReactNode; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-white lg:grid-cols-[1fr_1fr]">
      <div className="flex flex-col px-4 py-6 sm:px-10">
        <Brand />
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-12">
          <h1 className="font-display text-[34px] leading-[1.08]">{title}</h1>
          {subtitle && <div className="mt-3 text-[15px] text-ink-2">{subtitle}</div>}
          <div className="mt-8">{children}</div>
        </div>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted">
          <Link href="/impressum/" className="hover:text-ink">Impressum</Link>
          <Link href="/datenschutz/" className="hover:text-ink">Datenschutz</Link>
          <Link href="/agb/" className="hover:text-ink">AGB</Link>
        </p>
      </div>
      <aside className="relative hidden overflow-hidden bg-tag p-12 text-ink lg:flex lg:flex-col lg:justify-end">
        <div className="relative max-w-lg">
          {aside ?? (
            <>
              <p className="font-display text-[48px] leading-[1.02]">Gewinne finden, bevor der Markt sie sieht.</p>
              <ul className="mt-10 space-y-3 border-t-2 border-ink pt-8 text-[16px] font-medium">
                {["Gewinnwahrscheinlichkeit für jede Chance", "Einstellen auf eBay mit einem Klick", "Eigene Marktplatz-Konten sicher verbunden", "Server in der EU (Frankfurt)"].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <IconCheck size={17} /> {t}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

export function StaticNotice() {
  return (
    <div className="rounded-[var(--radius-card)] bg-canvas p-6">
      <p className="font-semibold">Kundenkonten starten in Kürze</p>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
        Diese Vorschau zeigt Webseite und Test-Dashboard. Anmeldung, Abo und Bezahlung sind auf der Live-Version aktiv.
      </p>
      <Link href="/demo/" className="mt-4 inline-flex text-sm font-medium underline underline-offset-4">
        Test-Dashboard ansehen
      </Link>
    </div>
  );
}

/** Nur relative Weiterleitungen innerhalb der App zulassen (Schutz vor Open Redirect). */
export function safeNext(value: string | null | undefined, fallback: string) {
  // Nur Pfade wie /app/…: kein //host, kein Backslash (Browser werten /\host als //host), keine Steuerzeichen.
  return value && /^\/(?![/\\])[^\\\s]*$/.test(value) && !/[\u0000-\u001f]/.test(value) ? value : fallback;
}
