import { LinkButton } from "@/components/ui/button";
import { IconBolt } from "@/components/ui/icons";

export function UpsellCard({ title, text, cta = "Tarife ansehen", href = "/preise/" }: { title: string; text: string; cta?: string; href?: string }) {
  return (
    <div className="rounded-[var(--radius-card)] bg-ink p-6 text-white">
      <span className="grid size-10 place-items-center rounded-full bg-white/10">
        <IconBolt size={18} />
      </span>
      <p className="mt-4 font-display text-3xl leading-tight">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{text}</p>
      <LinkButton href={href} variant="inverse" className="mt-5">
        {cta}
      </LinkButton>
    </div>
  );
}
