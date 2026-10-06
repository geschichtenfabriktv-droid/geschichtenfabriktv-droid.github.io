import type { Metadata } from "next";
import { GUARANTEE_DAYS, PLANS } from "@/lib/pricing";
import { SITE_URL } from "@/lib/site";
import type { Faq } from "@/lib/content/types";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const BRAND = "Arbitrage Radar";

/** Absolute URL für einen Pfad mit abschließendem Schrägstrich. */
export function absoluteUrl(path: string) {
  return `${SITE_URL}${base}${path}`;
}

/**
 * Einheitliche Metadaten je indexierbarer Seite: Canonical, hreflang (nur Deutsch) und Open Graph.
 * Rechtstexte nutzen das nicht, sie bleiben noindex und ohne Anbieterangaben.
 */
export function pageMetadata({
  path,
  title,
  description,
  type = "website",
  absoluteTitle: absolute = false,
  published,
  updated,
}: {
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  absoluteTitle?: boolean;
  published?: string;
  updated?: string;
}): Metadata {
  const url = absoluteUrl(path);
  // Markenname nur anhängen, wenn der Titel dann noch in die Suchergebnisse passt (ca. 60 Zeichen).
  const absoluteTitle = absolute || title.length + BRAND.length + 3 > 62;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: { "de-DE": url, "x-default": url } },
    openGraph: {
      type,
      locale: "de_DE",
      siteName: BRAND,
      url,
      title: absoluteTitle ? title : `${title} · ${BRAND}`,
      description,
      ...(type === "article" && published ? { publishedTime: published, modifiedTime: updated ?? published } : {}),
    },
    twitter: { card: "summary_large_image", title: absoluteTitle ? title : `${title} · ${BRAND}`, description },
  };
}

type Json = Record<string, unknown>;

/** Organisation nur mit Markenname, ohne Personendaten. */
export function organizationLd(): Json {
  return {
    "@type": "Organization",
    "@id": absoluteUrl("/#organisation"),
    name: BRAND,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon-512.png"),
  };
}

export function websiteLd(): Json {
  return {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: BRAND,
    url: absoluteUrl("/"),
    inLanguage: "de-DE",
    publisher: { "@id": absoluteUrl("/#organisation") },
  };
}

export function softwareLd(): Json {
  return {
    "@type": "SoftwareApplication",
    "@id": absoluteUrl("/#software"),
    name: BRAND,
    url: absoluteUrl("/"),
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Arbitrage- und Reselling-Software",
    operatingSystem: "Web, iOS, Android (Browser)",
    inLanguage: "de-DE",
    description:
      "Software für Online-Arbitrage und Reselling: bewertet Preisgefälle, Vorbestellungen und Insolvenzmasse-Posten, berechnet Break-even und Gewinnwahrscheinlichkeit und stellt Angebote mit einem Klick auf eBay ein.",
    featureList: [
      "Gewinnwahrscheinlichkeit je Chance",
      "Live-Marktpreise über die eBay-API",
      "Einstellen auf eBay per Knopfdruck",
      "Vorbestell-Radar",
      "Insolvenz-Finder mit Maximalgebot",
      "Autopilot: Angebot öffnen und einstellen",
    ],
    publisher: { "@id": absoluteUrl("/#organisation") },
    offers: PLANS.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.monthly.toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: absoluteUrl("/preise/"),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: p.monthly.toFixed(2),
        priceCurrency: "EUR",
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "DE",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: GUARANTEE_DAYS,
      },
    })),
  };
}

export function faqLd(faq: readonly Faq[] | readonly (readonly string[])[]): Json {
  const items = faq.map((f) => (Array.isArray(f) ? { q: String(f[0]), a: String(f[1]) } : (f as Faq)));
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: stripMarkup(f.a) } })),
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: absoluteUrl(t.path) })),
  };
}

export function articleLd(a: { path: string; h1: string; description: string; published: string; updated: string }): Json {
  return {
    "@type": "Article",
    headline: a.h1,
    description: a.description,
    datePublished: a.published,
    dateModified: a.updated,
    inLanguage: "de-DE",
    mainEntityOfPage: absoluteUrl(a.path),
    image: absoluteUrl(`${a.path}opengraph-image`),
    author: { "@type": "Organization", name: `Redaktion ${BRAND}`, url: absoluteUrl("/ratgeber/") },
    publisher: { "@id": absoluteUrl("/#organisation") },
  };
}

/** Entfernt **fett** und [Link](/pfad/) für reinen Text (JSON-LD, Meta). */
export function stripMarkup(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

export function graph(...nodes: Json[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
