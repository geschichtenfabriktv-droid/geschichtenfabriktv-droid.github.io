import Link from "next/link";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { PageIntro, SiteLayout } from "@/components/site/site-layout";
import { IconArrowUpRight } from "@/components/ui/icons";
import { ARTICLES, articlePath } from "@/lib/content";
import { absoluteUrl, breadcrumbLd, graph, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/ratgeber/",
  title: "Ratgeber: Online-Arbitrage & Reselling",
  description: "Anleitungen zu Online-Arbitrage, Reselling, Gewinn berechnen, eBay-Gebühren, Gewerbe und Insolvenzversteigerungen. Praxisnah und verständlich erklärt.",
});

export default function RatgeberIndex() {
  const trail = [
    { name: "Start", path: "/" },
    { name: "Ratgeber", path: "/ratgeber/" },
  ];
  return (
    <SiteLayout>
      <JsonLd
        data={graph(breadcrumbLd(trail), {
          "@type": "CollectionPage",
          name: "Ratgeber",
          url: absoluteUrl("/ratgeber/"),
          hasPart: ARTICLES.map((a) => ({ "@type": "Article", headline: a.h1, url: absoluteUrl(articlePath(a.slug)) })),
        })}
      />
      <div className="mx-auto max-w-[1240px] px-4 pt-10 sm:px-6 lg:px-10">
        <Breadcrumbs trail={trail} />
      </div>
      <PageIntro eyebrow="Ratgeber" title="Wissen für Reseller.">
        Wie Online-Arbitrage funktioniert, wie du Gewinn und Gebühren richtig rechnest und worauf du bei Gewerbe, Steuern und Insolvenzversteigerungen achten musst.
      </PageIntro>
      <ul className="mx-auto grid max-w-[1240px] grid-cols-1 gap-4 px-4 pb-24 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-10">
        {ARTICLES.map((a) => (
          <li key={a.slug} className="min-w-0">
            <Link href={articlePath(a.slug)} className="group flex h-full flex-col rounded-[var(--radius-card)] bg-white p-7 ring-1 ring-line transition hover:ring-ink">
              <span className="text-[12px] text-muted">{a.readingMinutes} Min. Lesezeit</span>
              <span className="mt-3 flex items-start justify-between gap-3 text-[22px] font-semibold leading-tight tracking-tight">
                {a.h1}
                <IconArrowUpRight size={20} className="mt-1 shrink-0 text-muted transition group-hover:text-ink" />
              </span>
              <span className="mt-3 text-[15px] leading-relaxed text-ink-2">{a.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </SiteLayout>
  );
}
