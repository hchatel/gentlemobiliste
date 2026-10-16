import { describe, expect, it } from "vitest";

import {
  buildAlternates,
  filterPublished,
  findTranslation,
  shouldIncludeDrafts,
  sortByOrder,
  sortByPublishedDesc,
} from "./queries";

const entries = [
  {
    locale: "fr" as const,
    slug: "anticipation",
    translationKey: "concept-anticipation",
  },
  {
    locale: "en" as const,
    slug: "anticipation",
    translationKey: "concept-anticipation",
  },
  {
    locale: "fr" as const,
    slug: "vulnerabilite",
    translationKey: "concept-vulnerabilite",
  },
];

describe("traductions", () => {
  it("trouve une traduction existante", () => {
    expect(findTranslation(entries, "concept-anticipation", "en")?.slug).toBe(
      "anticipation",
    );
  });

  it("renvoie undefined pour une traduction absente", () => {
    expect(
      findTranslation(entries, "concept-vulnerabilite", "en"),
    ).toBeUndefined();
  });

  it("construit les chemins alternatifs, null si non traduit", () => {
    expect(
      buildAlternates(entries, "concept-anticipation", "concepts"),
    ).toEqual({
      fr: "/fr/concepts/anticipation",
      en: "/en/concepts/anticipation",
    });
    expect(
      buildAlternates(entries, "concept-vulnerabilite", "concepts"),
    ).toEqual({
      fr: "/fr/concepts/vulnerabilite",
      en: null,
    });
  });

  it("gère des slugs différents selon la langue", () => {
    const items = [
      {
        locale: "fr" as const,
        slug: "cycliste",
        translationKey: "mobilite-cycliste",
      },
      {
        locale: "en" as const,
        slug: "cyclist",
        translationKey: "mobilite-cycliste",
      },
    ];
    expect(buildAlternates(items, "mobilite-cycliste", "mobilites").en).toBe(
      "/en/mobilites/cyclist",
    );
  });
});

describe("brouillons", () => {
  const items = [
    { slug: "publie", draft: false },
    { slug: "brouillon", draft: true },
  ];

  it("exclut les brouillons quand ils ne sont pas autorisés", () => {
    expect(filterPublished(items, false).map((item) => item.slug)).toEqual([
      "publie",
    ]);
  });

  it("conserve les brouillons en développement", () => {
    expect(filterPublished(items, true)).toHaveLength(2);
  });

  it("n’inclut les brouillons qu’hors production", () => {
    expect(shouldIncludeDrafts("production")).toBe(false);
    expect(shouldIncludeDrafts("development")).toBe(true);
    expect(shouldIncludeDrafts("test")).toBe(true);
  });
});

describe("tri", () => {
  it("trie les articles du plus récent au plus ancien, sans muter l’entrée", () => {
    const articles = [
      { slug: "b", publishedAt: "2025-03-01" },
      { slug: "c", publishedAt: "2026-01-10" },
      { slug: "a", publishedAt: "2025-03-01" },
    ];
    const sorted = sortByPublishedDesc(articles);
    expect(sorted.map((item) => item.slug)).toEqual(["c", "a", "b"]);
    expect(articles[0]?.slug).toBe("b");
  });

  it("trie par ordre puis par titre, les éléments sans ordre en dernier", () => {
    const items = [
      { title: "Zèbre", order: undefined },
      { title: "Bêta", order: 2 },
      { title: "Alpha", order: undefined },
      { title: "Gamma", order: 1 },
    ];
    expect(sortByOrder(items, "fr").map((item) => item.title)).toEqual([
      "Gamma",
      "Bêta",
      "Alpha",
      "Zèbre",
    ]);
  });
});
