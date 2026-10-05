import { ARTICLES } from "./articles";
import { LANDINGS } from "./landings";

export { ARTICLES, LANDINGS };

export const getLanding = (slug: string) => LANDINGS.find((l) => l.slug === slug);
export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
export const landingPath = (slug: string) => `/${slug}/`;
export const articlePath = (slug: string) => `/ratgeber/${slug}/`;
