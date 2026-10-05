import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { CardLinks } from "@/components/content/card-links";
import { FaqList } from "@/components/content/faq-list";
import { Blocks } from "@/components/content/rich-text";
import { Toc } from "@/components/content/toc";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteLayout } from "@/components/site/site-layout";
import { LinkButton } from "@/components/ui/button";
import { IconArrowRight, IconCheck } from "@/components/ui/icons";
import { articlePath, getArticle, getLanding, LANDINGS, landingPath } from "@/lib/content";
import { breadcrumbLd, faqLd, graph, pageMetadata, softwareLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return LANDINGS.map((l) => ({ landing: l.slug }));
}

type Props = { params: Promise<{ landing: string }> };

export async function generateMetadata({ params }: Props) {
  const page = getLanding((await params).landing);
  if (!page) return {};
  return { ...pageMetadata({ path: landingPath(page.slug), title: page.title, description: page.description }), keywords: page.keywords };
}

export default async function LandingPageRoute({ params }: Props) {
  const page = getLanding((await params).landing);
  if (!page) notFound();
  const path = landingPath(page.slug);
  const trail = [
    { name: "Start", path: "/" },
    { name: page.eyebrow, path },
  ];
  const related = page.related
    .map(getArticle)
    .filter((a) => a !== undefined)
    .map((a) => ({ href: articlePath(a.slug), label: a.h1, text: a.description }));
  const others = LANDINGS.filter((l) => l.slug !== page.slug).map((l) => ({ href: landingPath(l.slug), label: l.eyebrow, text: l.description }));

  return (
    <SiteLayout>
      <JsonLd data={graph(breadcrumbLd(trail), softwareLd(), faqLd(page.faq))} />
      <article>
        <header className="mx-auto max-w-[1320px] px-4 pt-10 sm:px-6 md:pt-14 lg:px-10">
          <Breadcrumbs trail={trail} />
          <p className="mt-10 text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">{page.eyebrow}</p>
          <h1 className="mt-4 max-w-5xl font-display text-[44px] leading-[0.98] tracking-tight md:text-[80px]">{page.h1}</h1>
          <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-ink-2">{page.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/demo/" size="lg">
              Kostenlos Chancen ansehen <IconArrowRight size={17} />
            </LinkButton>
            <LinkButton href="/preise/" size="lg" variant="secondary">
              Preise ab 29 €
            </LinkButton>
          </div>
          <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.benefits.map((b) => (
              <li key={b.title} className="rounded-[24px] bg-canvas p-6">
                <span className="grid size-9 place-items-center rounded-full bg-white ring-1 ring-line">
                  <IconCheck size={16} />
                </span>
                <p className="mt-4 text-[17px] font-semibold tracking-tight">{b.title}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{b.text}</p>
              </li>
            ))}
          </ul>
        </header>

        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-10 lg:py-24">
          <div className="min-w-0 max-w-3xl">
            <Blocks blocks={page.sections} />
            <FaqList faq={page.faq} />
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-4">
              <Toc blocks={page.sections} />
              <div className="rounded-[24px] p-6 ring-1 ring-line">
                <p className="font-semibold">Erst ansehen, dann entscheiden</p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-2">Das Test-Dashboard zeigt die Top-3-Chancen je Kategorie, ohne Anmeldung.</p>
                <LinkButton href="/demo/" className="mt-4 w-full">
                  Test-Dashboard öffnen
                </LinkButton>
              </div>
            </div>
          </aside>
        </div>

        <div className="mx-auto max-w-[1320px] px-4 pb-24 sm:px-6 lg:px-10">
          <CardLinks title="Weiterlesen im Ratgeber" items={related} />
          <CardLinks title="Weitere Lösungen" items={others.slice(0, 3)} />
        </div>
      </article>
    </SiteLayout>
  );
}
