import matter from "gray-matter";
import { z } from "zod";

import type { Locale } from "@/lib/i18n/config";

export type ParseContext = {
  /** Chemin du fichier, pour des messages d'erreur exploitables. */
  file: string;
  /** Langue déduite du dossier (`content/<locale>/…`). */
  locale: Locale;
  /** Slug déduit du nom de fichier. */
  slug: string;
};

export class ContentValidationError extends Error {
  constructor(file: string, details: string) {
    super(`Contenu invalide : ${file}\n${details}`);
    this.name = "ContentValidationError";
  }
}

const validate = <S extends z.ZodType<object>>(
  schema: S,
  data: unknown,
  context: ParseContext,
): z.infer<S> => {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new ContentValidationError(
      context.file,
      z.prettifyError(parsed.error),
    );
  }
  const value = parsed.data as { slug: string; locale: Locale };
  if (value.slug !== context.slug) {
    throw new ContentValidationError(
      context.file,
      `Le slug « ${value.slug} » doit correspondre au nom du fichier « ${context.slug} ».`,
    );
  }
  if (value.locale !== context.locale) {
    throw new ContentValidationError(
      context.file,
      `La locale « ${value.locale} » doit correspondre au dossier « ${context.locale} ».`,
    );
  }
  return parsed.data;
};

/** Lit un fichier Markdown : frontmatter validé + corps brut. */
export const parseMarkdownEntry = <S extends z.ZodType<object>>(
  source: string,
  schema: S,
  context: ParseContext,
): z.infer<S> & { body: string } => {
  const { data, content } = matter(source);
  return { ...validate(schema, data, context), body: content };
};

/** Lit un fichier JSON validé (quiz). */
export const parseJsonEntry = <S extends z.ZodType<object>>(
  source: string,
  schema: S,
  context: ParseContext,
): z.infer<S> => {
  let data: unknown;
  try {
    data = JSON.parse(source);
  } catch (error) {
    throw new ContentValidationError(
      context.file,
      `JSON invalide : ${String(error)}`,
    );
  }
  return validate(schema, data, context);
};
