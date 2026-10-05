import type { Faq } from "@/lib/content/types";
import { Inline } from "./rich-text";

export function FaqList({ faq, title = "Häufige Fragen" }: { faq: Faq[]; title?: string }) {
  return (
    <section aria-labelledby="faq-titel" className="mt-16">
      <h2 id="faq-titel" className="font-display text-[36px] leading-none tracking-tight md:text-[48px]">
        {title}
      </h2>
      <div className="mt-8 divide-y divide-line border-y border-line">
        {faq.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[17px] font-semibold tracking-tight [&::-webkit-details-marker]:hidden">
              <h3 className="text-[17px] font-semibold">{f.q}</h3>
              <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full ring-1 ring-line transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-2">
              <Inline text={f.a} />
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
