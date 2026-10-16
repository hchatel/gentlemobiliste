import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { cache } from "react";
import type { z } from "zod";

import { type Locale, locales } from "@/lib/i18n/config";
import { sections, type Section } from "@/lib/i18n/paths";
import { quizSchema } from "@/lib/quiz/schema";

import { parseJsonEntry, parseMarkdownEntry } from "./parse";
import {
  buildAlternates,
  filterPublished,
  shouldIncludeDrafts,
  sortByOrder,
  sortByPublishedDesc,
} from "./queries";
import { articleSchema, conceptSchema, mobilitySchema } from "./schemas";

const CONTENT_DIR = path.join(process.cwd(), "content");

const markdownCollections = {
  concepts: conceptSchema,
  mobilites: mobilitySchema,
  articles: articleSchema,
} as const;

export type MarkdownCollection = keyof typeof markdownCollections;
export type Entry<C extends MarkdownCollection> = z.infer<
  (typeof markdownCollections)[C]
> & {
  body: string;
};

const listFiles = async (locale: Locale, dir: string, extension: string) => {
  const directory = path.join(CONTENT_DIR, locale, dir);
  let names: string[];
  try {
    names = await readdir(directory);
  } catch (error) {
    // Un dossier absent signifie simplement « aucun contenu dans cette langue ».
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  return names
    .filter((name) => name.endsWith(extension))
    .map((name) => ({
      file: path.join(directory, name),
      slug: path.basename(name, extension),
    }));
};

const assertUniqueTranslationKeys = (
  items: readonly { locale: Locale; translationKey: string; slug: string }[],
  dir: string,
) => {
  const seen = new Map<string, string>();
  for (const item of items) {
    const key = `${item.locale}:${item.translationKey}`;
    const previous = seen.get(key);
    if (previous) {
      throw new Error(
        `translationKey « ${item.translationKey} » utilisée deux fois en « ${item.locale} » dans ${dir} (${previous}, ${item.slug})`,
      );
    }
    seen.set(key, item.slug);
  }
};

/** Toutes les entrées d'une collection, toutes langues confondues, brouillons filtrés selon l'environnement. */
const loadCollection = cache(
  async <C extends MarkdownCollection>(collection: C): Promise<Entry<C>[]> => {
    const schema = markdownCollections[collection];
    const perLocale = await Promise.all(
      locales.map(async (locale) => {
        const files = await listFiles(locale, collection, ".md");
        return Promise.all(
          files.map(async ({ file, slug }) =>
            parseMarkdownEntry(await readFile(file, "utf8"), schema, {
              file,
              locale,
              slug,
            }),
          ),
        );
      }),
    );
    const all = perLocale.flat() as Entry<C>[];
    assertUniqueTranslationKeys(all, collection);
    return filterPublished(all, shouldIncludeDrafts());
  },
);

const sorters: {
  [C in MarkdownCollection]: (
    entries: Entry<C>[],
    locale: Locale,
  ) => Entry<C>[];
} = {
  concepts: sortByOrder,
  mobilites: sortByOrder,
  articles: (entries) => sortByPublishedDesc(entries),
};

/** Entrées d'une langue, triées : articles par date, autres collections par `order`. */
export const getEntries = async <C extends MarkdownCollection>(
  collection: C,
  locale: Locale,
): Promise<Entry<C>[]> => {
  const entries = (await loadCollection(collection)).filter(
    (entry) => entry.locale === locale,
  );
  const sort: (entries: Entry<C>[], locale: Locale) => Entry<C>[] =
    sorters[collection];
  return sort(entries, locale);
};

export const getEntry = async <C extends MarkdownCollection>(
  collection: C,
  locale: Locale,
  slug: string,
): Promise<Entry<C> | undefined> => {
  return (await getEntries(collection, locale)).find(
    (entry) => entry.slug === slug,
  );
};

export const getEntryAlternates = async (
  collection: MarkdownCollection,
  translationKey: string,
) => {
  return buildAlternates(
    await loadCollection(collection),
    translationKey,
    sections[collection],
  );
};

/* ----- Quiz (JSON) ----- */

export type QuizEntry = z.infer<typeof quizSchema>;

const loadQuizzes = cache(async (): Promise<QuizEntry[]> => {
  const perLocale = await Promise.all(
    locales.map(async (locale) => {
      const files = await listFiles(locale, sections.parcours, ".json");
      return Promise.all(
        files.map(async ({ file, slug }) =>
          parseJsonEntry(await readFile(file, "utf8"), quizSchema, {
            file,
            locale,
            slug,
          }),
        ),
      );
    }),
  );
  const all = perLocale.flat();
  assertUniqueTranslationKeys(all, sections.parcours);
  return filterPublished(all, shouldIncludeDrafts());
});

export const getQuizzes = async (locale: Locale): Promise<QuizEntry[]> => {
  return (await loadQuizzes())
    .filter((quiz) => quiz.locale === locale)
    .sort((a, b) => a.title.localeCompare(b.title, locale));
};

export const getQuiz = async (
  locale: Locale,
  slug: string,
): Promise<QuizEntry | undefined> => {
  return (await getQuizzes(locale)).find((quiz) => quiz.slug === slug);
};

export const getQuizAlternates = async (translationKey: string) => {
  return buildAlternates(
    await loadQuizzes(),
    translationKey,
    sections.parcours,
  );
};

/** Paramètres statiques communs aux routes `[locale]/<section>/[slug]`. */
export const staticParamsFor = async (section: Section) => {
  const items =
    section === sections.parcours
      ? await loadQuizzes()
      : section in markdownCollections
        ? await loadCollection(section as MarkdownCollection)
        : [];
  return items.map((item) => ({ locale: item.locale, slug: item.slug }));
};
