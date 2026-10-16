import type { Locale } from "./config";

/**
 * Segments de section : identiques dans toutes les langues (non traduits).
 * Seuls les slugs de contenu peuvent varier d'une langue à l'autre.
 */
export const sections = {
  concepts: "concepts",
  mobilites: "mobilites",
  articles: "articles",
  parcours: "parcours",
  mentionsLegales: "mentions-legales",
} as const;

export type Section = (typeof sections)[keyof typeof sections];

/** Construit un chemin public, toujours préfixé par la langue. */
export const localizedPath = (
  locale: Locale,
  section?: Section,
  slug?: string,
): string => {
  return "/" + [locale, section, slug].filter(Boolean).join("/");
};
