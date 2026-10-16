import { z } from "zod";

import { locales } from "@/lib/i18n/config";

/**
 * Date ISO `YYYY-MM-DD`. YAML convertit les dates non quotées en objets
 * `Date` : on les ramène à leur forme ISO avant validation.
 */
export const isoDateSchema = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date attendue au format YYYY-MM-DD")
    .refine((value) => {
      const date = new Date(`${value}T00:00:00Z`);
      return (
        !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value)
      );
    }, "Date inexistante"),
);

const kebabCase = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Attendu : minuscules, chiffres et tirets (kebab-case)",
  );

export const sourceSchema = z.strictObject({
  title: z.string().min(1),
  url: z.url({ protocol: /^https?$/ }),
  publisher: z.string().min(1),
  accessedAt: isoDateSchema,
});

/** Champs communs à tous les contenus éditoriaux et aux quiz. */
export const baseFields = {
  title: z.string().min(1),
  description: z
    .string()
    .min(1)
    .max(200, "Description trop longue pour le SEO (200 max.)"),
  slug: kebabCase,
  locale: z.enum(locales),
  /** Identifiant stable partagé par toutes les traductions d'un même contenu. */
  translationKey: kebabCase,
  draft: z.boolean().default(false),
};

const editorialFields = {
  ...baseFields,
  updatedAt: isoDateSchema.optional(),
  sources: z.array(sourceSchema).default([]),
};

export const conceptSchema = z.strictObject({
  ...editorialFields,
  /** Introduction affichée en tête de page et sur les cartes. */
  summary: z.string().min(1),
  order: z.number().int().optional(),
});

export const mobilitySchema = conceptSchema;

export const articleSchema = z
  .strictObject({
    ...editorialFields,
    publishedAt: isoDateSchema,
    author: z.string().min(1).optional(),
    tags: z.array(z.string().min(1)).default([]),
    /** Chemin d'une image locale dans `public/` (ex. `/images/articles/x.webp`). */
    image: z.string().startsWith("/").optional(),
    imageAlt: z.string().min(1).optional(),
  })
  .superRefine((article, ctx) => {
    if (article.image && !article.imageAlt) {
      ctx.addIssue({
        code: "custom",
        path: ["imageAlt"],
        message: "imageAlt est obligatoire lorsqu'une image est fournie",
      });
    }
    if (article.updatedAt && article.updatedAt < article.publishedAt) {
      ctx.addIssue({
        code: "custom",
        path: ["updatedAt"],
        message: "updatedAt ne peut pas précéder publishedAt",
      });
    }
  });

export type ConceptMeta = z.infer<typeof conceptSchema>;
export type MobilityMeta = z.infer<typeof mobilitySchema>;
export type ArticleMeta = z.infer<typeof articleSchema>;
export type Source = z.infer<typeof sourceSchema>;
