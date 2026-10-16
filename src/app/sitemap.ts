import type { MetadataRoute } from "next";

import { getEntries, getQuizzes } from "@/lib/content/loader";
import {
  allLocalesAlternates,
  type Alternates,
  buildAlternates,
} from "@/lib/content/queries";
import { localeMeta, locales } from "@/lib/i18n/config";
import { localizedPath, sections, type Section } from "@/lib/i18n/paths";
import { absoluteUrl } from "@/lib/seo/site";

const languagesOf = (alternates: Alternates) => {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    const href = alternates[locale];
    if (href) languages[localeMeta[locale].hreflang] = absoluteUrl(href);
  }
  return Object.keys(languages).length > 1 ? { languages } : undefined;
};

/** Sitemap généré au build à partir des contenus publiés (brouillons exclus en production). */
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const staticSections: (Section | undefined)[] = [
    undefined,
    sections.concepts,
    sections.mobilites,
    sections.articles,
    sections.parcours,
    sections.mentionsLegales,
  ];

  const routes: MetadataRoute.Sitemap = staticSections.flatMap((section) => {
    const alternates = allLocalesAlternates(section);
    return locales.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, section)),
      alternates: languagesOf(alternates),
    }));
  });

  for (const collection of ["concepts", "mobilites", "articles"] as const) {
    const entries = (
      await Promise.all(locales.map((locale) => getEntries(collection, locale)))
    ).flat();
    for (const entry of entries) {
      routes.push({
        url: absoluteUrl(
          localizedPath(entry.locale, sections[collection], entry.slug),
        ),
        lastModified:
          "publishedAt" in entry
            ? (entry.updatedAt ?? entry.publishedAt)
            : entry.updatedAt,
        alternates: languagesOf(
          buildAlternates(entries, entry.translationKey, sections[collection]),
        ),
      });
    }
  }

  const quizzes = (
    await Promise.all(locales.map((locale) => getQuizzes(locale)))
  ).flat();
  for (const quiz of quizzes) {
    routes.push({
      url: absoluteUrl(
        localizedPath(quiz.locale, sections.parcours, quiz.slug),
      ),
      alternates: languagesOf(
        buildAlternates(quizzes, quiz.translationKey, sections.parcours),
      ),
    });
  }

  return routes;
};

export default sitemap;
