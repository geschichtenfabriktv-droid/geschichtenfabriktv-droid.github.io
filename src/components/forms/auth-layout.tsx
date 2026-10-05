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
          <h1 className="font-display text-[44px] leading-none tracking-tight">{title}</h1>
          {subtitle && <div className="mt-3 text-[15px] text-ink-2">{subtitle}</div>}
          <div className="mt-8">{children}</div>
        </div>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted">
          <Link href="/impressum/" className="hover:text-ink">Impressum</Link>
          <Link href="/datenschutz/" className="hover:text-ink">Datenschutz</Link>
          <Link href="/agb/" className="hover:text-ink">AGB</Link>
        </p>
      </div>
      <aside className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-end">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_20%,rgba(17,160,90,0.28),transparent_70%)]" />
        <div className="relative">
          {aside ?? (
            <>
              <p className="font-display text-[56px] leading-[0.98] tracking-tight">
                Gewinne finden, <span className="italic text-white/50">bevor der Markt sie sieht.</span>
              </p>
              <ul className="mt-10 space-y-3 text-[15px] text-white/80">
                {["Gewinnwahrscheinlichkeit für jede Chance", "Kaufen & Einstellen auf Knopfdruck", "Eigene Marktplatz-Konten sicher verbunden", "Server in der EU (Frankfurt)"].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <IconCheck size={16} className="text-[#5ee39b]" /> {t}
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
    <div className="rounded-[24px] bg-canvas p-6 ring-1 ring-line">
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
