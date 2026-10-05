import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { CardLinks } from "@/components/content/card-links";
import { FaqList } from "@/components/content/faq-list";
import { Blocks } from "@/components/content/rich-text";
import { Toc } from "@/components/content/toc";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteLayout } from "@/components/site/site-layout";
import { LinkButton } from "@/components/ui/button";
import { ARTICLES, articlePath, getArticle, getLanding, landingPath } from "@/lib/content";
import { articleLd, breadcrumbLd, faqLd, graph, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return {
    ...pageMetadata({ path: articlePath(a.slug), title: a.title, description: a.description, type: "article", published: a.published, updated: a.updated }),
    keywords: a.keywords,
  };
}

const dateDe = (iso: string) => new Date(iso).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });

export default async function ArticleRoute({ params }: Props) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const path = articlePath(a.slug);
  const trail = [
    { name: "Start", path: "/" },
    { name: "Ratgeber", path: "/ratgeber/" },
    { name: a.h1, path },
  ];
  const solutions = a.related
    .map(getLanding)
    .filter((l) => l !== undefined)
    .map((l) => ({ href: landingPath(l.slug), label: l.eyebrow, text: l.description }));
  const more = ARTICLES.filter((x) => x.slug !== a.slug)
    .slice(0, 3)
    .map((x) => ({ href: articlePath(x.slug), label: x.h1, text: x.description }));

  return (
    <SiteLayout>
      <JsonLd data={graph(articleLd({ path, h1: a.h1, description: a.description, published: a.published, updated: a.updated }), breadcrumbLd(trail), faqLd(a.faq))} />
      <article className="mx-auto max-w-[1320px] px-4 pt-10 pb-24 sm:px-6 md:pt-14 lg:px-10">
        <Breadcrumbs trail={trail} />
        <header className="mt-10 max-w-4xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">Ratgeber</p>
          <h1 className="mt-4 font-display text-[40px] leading-[1] tracking-tight md:text-[68px]">{a.h1}</h1>
          <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-ink-2">{a.intro}</p>
          <p className="mt-6 text-[13px] text-muted">
            Aktualisiert am <time dateTime={a.updated}>{dateDe(a.updated)}</time> · {a.readingMinutes} Min. Lesezeit · Redaktion Arbitrage Radar
          </p>
        </header>
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 max-w-3xl">
            <Blocks blocks={a.sections} />
            <FaqList faq={a.faq} />
            <p className="mt-10 text-[13px] leading-relaxed text-muted">
              Hinweis: Dieser Ratgeber dient der allgemeinen Information und ersetzt keine Steuer- oder Rechtsberatung. Gebühren und Grenzwerte können sich ändern.
            </p>
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-4">
              <Toc blocks={a.sections} />
              <div className="rounded-[24px] p-6 ring-1 ring-line">
                <p className="font-semibold">Chancen live ansehen</p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-2">Gewinnwahrscheinlichkeit, Break-even und Zielpreis für echte Produkte, kostenlos im Test-Dashboard.</p>
                <LinkButton href="/demo/" className="mt-4 w-full">
                  Test-Dashboard öffnen
                </LinkButton>
              </div>
            </div>
          </aside>
        </div>
        <CardLinks title="Passende Lösungen" items={solutions} />
        <CardLinks title="Mehr aus dem Ratgeber" items={more} />
      </article>
    </SiteLayout>
  );
}
