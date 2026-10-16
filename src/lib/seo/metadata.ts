import type { Metadata } from "next";

import type { Alternates } from "@/lib/content/queries";
import {
  defaultLocale,
  type Locale,
  localeMeta,
  locales,
} from "@/lib/i18n/config";

type PageMetadataInput = {
  locale: Locale;
  title: string;
  description: string;
  /** Chemin de la page courante, préfixé par la langue. */
  path: string;
  /** Traductions réellement disponibles : seules celles-ci produisent un hreflang. */
  alternates: Alternates;
  type?: "website" | "article";
  publishedAt?: string;
  updatedAt?: string;
  image?: { url: string; alt: string };
};

/**
 * Métadonnées d'une page : title, description, canonical, hreflang
 * (+ x-default vers la langue par défaut si elle existe), Open Graph, Twitter.
 * Les URL relatives sont résolues via `metadataBase` défini dans le layout.
 */
export const buildPageMetadata = (input: PageMetadataInput): Metadata => {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    const href = input.alternates[locale];
    if (href) languages[localeMeta[locale].hreflang] = href;
  }
  const defaultHref = input.alternates[defaultLocale];
  if (Object.keys(languages).length > 1 && defaultHref)
    languages["x-default"] = defaultHref;

  const images = input.image
    ? [{ url: input.image.url, alt: input.image.alt }]
    : undefined;

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: input.path,
      languages: Object.keys(languages).length > 1 ? languages : undefined,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: input.path,
      locale: localeMeta[input.locale].ogLocale,
      alternateLocale: locales
        .filter((locale) => locale !== input.locale && input.alternates[locale])
        .map((locale) => localeMeta[locale].ogLocale),
      type: input.type ?? "website",
      ...(input.type === "article"
        ? { publishedTime: input.publishedAt, modifiedTime: input.updatedAt }
        : {}),
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: input.title,
      description: input.description,
      images,
    },
  };
};
