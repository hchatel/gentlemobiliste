import type { Locale } from "@/lib/i18n/config";

import { absoluteUrl, siteUrl } from "./site";

/**
 * Données structurées schema.org. Seules des informations vérifiables sont
 * déclarées : ni adresse, ni réseaux sociaux, ni contact tant qu'ils
 * n'existent pas réellement.
 */
export const organizationJsonLd = (name: string, description: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl.origin}/#organization`,
    name,
    description,
    url: siteUrl.origin,
  };
};

export const websiteJsonLd = (
  name: string,
  locale: Locale,
  homePath: string,
) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl.origin}/#website`,
    name,
    url: absoluteUrl(homePath),
    inLanguage: locale,
    publisher: { "@id": `${siteUrl.origin}/#organization` },
  };
};

export type BreadcrumbItem = { name: string; path: string };

export const breadcrumbJsonLd = (items: readonly BreadcrumbItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
};

export const blogPostingJsonLd = (article: {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  image?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    url: absoluteUrl(article.path),
    mainEntityOfPage: absoluteUrl(article.path),
    inLanguage: article.locale,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: article.author
      ? { "@type": "Person", name: article.author }
      : { "@id": `${siteUrl.origin}/#organization` },
    publisher: { "@id": `${siteUrl.origin}/#organization` },
    ...(article.image ? { image: absoluteUrl(article.image) } : {}),
  };
};
