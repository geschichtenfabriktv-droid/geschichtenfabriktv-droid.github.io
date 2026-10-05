/**
 * Redaktionelle Inhalte (Lösungsseiten und Ratgeber). Fließtext unterstützt **fett** und
 * interne Links im Format [Text](/pfad/).
 */
export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "tip"; title: string; text: string }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "cta"; title: string; text: string };

export interface Faq {
  q: string;
  a: string;
}

export interface LandingPage {
  slug: string;
  /** Meta-Titel, max. 60 Zeichen, ohne Markenname (wird angehängt) */
  title: string;
  /** Meta-Beschreibung, 120–155 Zeichen */
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  /** Haupt- und Nebensuchbegriffe, auf die die Seite zielt */
  keywords: string[];
  benefits: { title: string; text: string }[];
  sections: Block[];
  faq: Faq[];
  /** Slugs verwandter Ratgeber-Artikel */
  related: string[];
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  keywords: string[];
  published: string;
  updated: string;
  readingMinutes: number;
  sections: Block[];
  faq: Faq[];
  /** Slugs verwandter Lösungsseiten */
  related: string[];
}
