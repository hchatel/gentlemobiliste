import { describe, expect, it } from "vitest";

import {
  ContentValidationError,
  parseJsonEntry,
  parseMarkdownEntry,
} from "./parse";
import { articleSchema, conceptSchema } from "./schemas";
import { quizSchema } from "@/lib/quiz/schema";

const context = {
  file: "content/fr/articles/exemple.md",
  locale: "fr" as const,
  slug: "exemple",
};

const article = (frontmatter: string) => {
  return `---\n${frontmatter}\n---\n\nCorps de l’article.`;
};

const validArticle = `title: Exemple
description: Une description.
slug: exemple
locale: fr
translationKey: article-exemple
publishedAt: 2026-01-15
tags: [rue]`;

describe("articleSchema", () => {
  it("accepte un article valide et applique les valeurs par défaut", () => {
    const entry = parseMarkdownEntry(
      article(validArticle),
      articleSchema,
      context,
    );
    expect(entry.publishedAt).toBe("2026-01-15"); // Date YAML ramenée en ISO
    expect(entry.draft).toBe(false);
    expect(entry.sources).toEqual([]);
    expect(entry.body.trim()).toBe("Corps de l’article.");
  });

  it("accepte des sources complètes", () => {
    const entry = parseMarkdownEntry(
      article(`${validArticle}
sources:
  - title: Un texte
    url: https://exemple.org/texte
    publisher: Éditeur
    accessedAt: "2026-02-01"`),
      articleSchema,
      context,
    );
    expect(entry.sources[0]?.accessedAt).toBe("2026-02-01");
  });

  it("refuse une date mal formée ou inexistante", () => {
    expect(() =>
      parseMarkdownEntry(
        article(validArticle.replace("2026-01-15", '"15/01/2026"')),
        articleSchema,
        context,
      ),
    ).toThrow(ContentValidationError);
    expect(() =>
      parseMarkdownEntry(
        article(validArticle.replace("2026-01-15", '"2026-02-30"')),
        articleSchema,
        context,
      ),
    ).toThrow(/Date inexistante/);
  });

  it("exige imageAlt lorsqu’une image est fournie", () => {
    expect(() =>
      parseMarkdownEntry(
        article(`${validArticle}\nimage: /images/x.webp`),
        articleSchema,
        context,
      ),
    ).toThrow(/imageAlt/);
  });

  it("refuse une source sans URL valide", () => {
    expect(() =>
      parseMarkdownEntry(
        article(`${validArticle}
sources:
  - title: Un texte
    url: pas-une-url
    publisher: Éditeur
    accessedAt: 2026-02-01`),
        articleSchema,
        context,
      ),
    ).toThrow(ContentValidationError);
  });

  it("refuse un champ inconnu (faute de frappe)", () => {
    expect(() =>
      parseMarkdownEntry(
        article(`${validArticle}\nautor: Quelqu’un`),
        articleSchema,
        context,
      ),
    ).toThrow(ContentValidationError);
  });

  it("vérifie la cohérence slug/nom de fichier et locale/dossier", () => {
    expect(() =>
      parseMarkdownEntry(article(validArticle), articleSchema, {
        ...context,
        slug: "autre",
      }),
    ).toThrow(/nom du fichier/);
    expect(() =>
      parseMarkdownEntry(article(validArticle), articleSchema, {
        ...context,
        locale: "en",
      }),
    ).toThrow(/dossier/);
  });
});

describe("conceptSchema", () => {
  it("exige un résumé", () => {
    const result = conceptSchema.safeParse({
      title: "Concept",
      description: "Description",
      slug: "concept",
      locale: "fr",
      translationKey: "concept",
    });
    expect(result.success).toBe(false);
  });
});

describe("quizSchema", () => {
  const quiz = {
    title: "Quiz",
    description: "Description",
    slug: "quiz",
    locale: "fr",
    translationKey: "quiz",
    intro: "Intro",
    questions: [
      {
        id: "q1",
        prompt: "Question ?",
        options: [
          { id: "a", label: "A" },
          { id: "b", label: "B" },
        ],
        correctOptionId: "a",
        explanation: "Parce que.",
      },
    ],
    results: [{ minScore: 0, title: "Résultat", message: "Message" }],
  };
  const quizContext = {
    file: "quiz.json",
    locale: "fr" as const,
    slug: "quiz",
  };

  it("accepte un quiz valide", () => {
    expect(
      parseJsonEntry(JSON.stringify(quiz), quizSchema, quizContext).questions,
    ).toHaveLength(1);
  });

  it("refuse une bonne réponse qui ne correspond à aucune option", () => {
    const invalid = {
      ...quiz,
      questions: [{ ...quiz.questions[0], correctOptionId: "z" }],
    };
    expect(() =>
      parseJsonEntry(JSON.stringify(invalid), quizSchema, quizContext),
    ).toThrow(/correctOptionId/);
  });

  it("exige un résultat couvrant le score 0", () => {
    const invalid = {
      ...quiz,
      results: [{ minScore: 1, title: "R", message: "M" }],
    };
    expect(() =>
      parseJsonEntry(JSON.stringify(invalid), quizSchema, quizContext),
    ).toThrow(/minScore/);
  });

  it("signale un JSON mal formé", () => {
    expect(() => parseJsonEntry("{", quizSchema, quizContext)).toThrow(
      /JSON invalide/,
    );
  });
});
