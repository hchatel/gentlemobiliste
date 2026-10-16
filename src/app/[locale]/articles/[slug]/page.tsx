import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { EditorialPage } from "@/components/content/EditorialPage";
import { FormattedDate } from "@/components/content/FormattedDate";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getEntry,
  getEntryAlternates,
  staticParamsFor,
} from "@/lib/content/loader";
import { getDictionary, resolveLocale } from "@/lib/i18n/get-dictionary";
import { localizedPath, sections } from "@/lib/i18n/paths";
import { blogPostingJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const section = sections.articles;

export const dynamicParams = false;

export const generateStaticParams = () => {
  return staticParamsFor(section);
};

const load = async (
  params: PageProps<"/[locale]/articles/[slug]">["params"],
) => {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const entry = await getEntry("articles", locale, slug);
  if (!entry) notFound();
  const alternates = await getEntryAlternates("articles", entry.translationKey);
  return { locale, entry, alternates };
};

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/articles/[slug]">): Promise<Metadata> => {
  const { locale, entry, alternates } = await load(params);
  return buildPageMetadata({
    locale,
    title: entry.title,
    description: entry.description,
    path: localizedPath(locale, section, entry.slug),
    alternates,
    type: "article",
    publishedAt: entry.publishedAt,
    updatedAt: entry.updatedAt,
    image:
      entry.image && entry.imageAlt
        ? { url: entry.image, alt: entry.imageAlt }
        : undefined,
  });
};

const ArticlePage = async ({
  params,
}: PageProps<"/[locale]/articles/[slug]">) => {
  const { locale, entry, alternates } = await load(params);
  const dict = getDictionary(locale);
  const path = localizedPath(locale, section, entry.slug);

  return (
    <>
      <JsonLd
        data={blogPostingJsonLd({
          title: entry.title,
          description: entry.description,
          path,
          locale,
          publishedAt: entry.publishedAt,
          updatedAt: entry.updatedAt,
          author: entry.author,
          image: entry.image,
        })}
      />
      <EditorialPage
        locale={locale}
        dict={dict}
        alternates={alternates}
        breadcrumbs={[
          { name: dict.nav.home, path: localizedPath(locale) },
          { name: dict.articles.title, path: localizedPath(locale, section) },
          { name: entry.title, path },
        ]}
        title={entry.title}
        lead={entry.description}
        body={entry.body}
        sources={entry.sources}
        draft={entry.draft}
        meta={
          <>
            <span>
              {dict.articles.publishedOn}{" "}
              <FormattedDate date={entry.publishedAt} locale={locale} />
            </span>
            {entry.updatedAt ? (
              <span>
                · {dict.articles.updatedOn}{" "}
                <FormattedDate date={entry.updatedAt} locale={locale} />
              </span>
            ) : null}
            {entry.author ? (
              <span>
                · {dict.articles.by} {entry.author}
              </span>
            ) : null}
          </>
        }
        media={
          entry.image && entry.imageAlt ? (
            <div className="relative mb-10 aspect-video overflow-hidden rounded-2xl bg-accent-soft">
              <Image
                src={entry.image}
                alt={entry.imageAlt}
                fill
                sizes="(min-width: 64rem) 64rem, 100vw"
                className="object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          ) : undefined
        }
      />
    </>
  );
};

export default ArticlePage;
