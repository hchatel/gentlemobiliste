import { type Locale, locales } from "@/lib/i18n/config";
import { localizedPath, type Section } from "@/lib/i18n/paths";

/** Fonctions pures de sélection : testées unitairement, sans accès disque. */

type Draftable = { draft: boolean };
type Translatable = { locale: Locale; slug: string; translationKey: string };

/** Les brouillons ne sont inclus qu'en développement. */
export const shouldIncludeDrafts = (
  env: string | undefined = process.env.NODE_ENV,
): boolean => {
  return env !== "production";
};

export const filterPublished = <T extends Draftable>(
  items: readonly T[],
  includeDrafts: boolean,
): T[] => {
  return includeDrafts ? [...items] : items.filter((item) => !item.draft);
};

/** Du plus récent au plus ancien ; à date égale, ordre alphabétique du slug. */
export const sortByPublishedDesc = <
  T extends { publishedAt: string; slug: string },
>(
  items: readonly T[],
): T[] => {
  return [...items].sort(
    (a, b) =>
      b.publishedAt.localeCompare(a.publishedAt) ||
      a.slug.localeCompare(b.slug),
  );
};

/** Par `order` croissant (absent = en dernier), puis par titre. */
export const sortByOrder = <T extends { order?: number; title: string }>(
  items: readonly T[],
  locale: Locale,
): T[] => {
  return [...items].sort(
    (a, b) =>
      (a.order ?? Number.POSITIVE_INFINITY) -
        (b.order ?? Number.POSITIVE_INFINITY) ||
      a.title.localeCompare(b.title, locale),
  );
};

export const findTranslation = <T extends Translatable>(
  items: readonly T[],
  translationKey: string,
  locale: Locale,
): T | undefined => {
  return items.find(
    (item) => item.translationKey === translationKey && item.locale === locale,
  );
};

/** Chemin vers chaque traduction disponible ; `null` si la traduction n'existe pas. */
export type Alternates = Record<Locale, string | null>;

export const buildAlternates = <T extends Translatable>(
  items: readonly T[],
  translationKey: string,
  section: Section,
): Alternates => {
  return Object.fromEntries(
    locales.map((locale) => {
      const translation = findTranslation(items, translationKey, locale);
      return [
        locale,
        translation ? localizedPath(locale, section, translation.slug) : null,
      ];
    }),
  ) as Alternates;
};

/** Pour les pages qui existent dans toutes les langues (accueil, listes…). */
export const allLocalesAlternates = (section?: Section): Alternates => {
  return Object.fromEntries(
    locales.map((locale) => [locale, localizedPath(locale, section)]),
  ) as Alternates;
};
