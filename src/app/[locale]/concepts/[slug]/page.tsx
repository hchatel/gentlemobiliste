import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EditorialPage } from "@/components/content/EditorialPage";
import {
  getEntry,
  getEntryAlternates,
  staticParamsFor,
} from "@/lib/content/loader";
import { getDictionary, resolveLocale } from "@/lib/i18n/get-dictionary";
import { localizedPath, sections } from "@/lib/i18n/paths";
import { buildPageMetadata } from "@/lib/seo/metadata";

const section = sections.concepts;

export const dynamicParams = false;

export const generateStaticParams = () => {
  return staticParamsFor(section);
};

const load = async (
  params: PageProps<"/[locale]/concepts/[slug]">["params"],
) => {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const entry = await getEntry("concepts", locale, slug);
  if (!entry) notFound();
  const alternates = await getEntryAlternates("concepts", entry.translationKey);
  return { locale, entry, alternates };
};

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/concepts/[slug]">): Promise<Metadata> => {
  const { locale, entry, alternates } = await load(params);
  return buildPageMetadata({
    locale,
    title: entry.title,
    description: entry.description,
    path: localizedPath(locale, section, entry.slug),
    alternates,
  });
};

const ConceptPage = async ({
  params,
}: PageProps<"/[locale]/concepts/[slug]">) => {
  const { locale, entry, alternates } = await load(params);
  const dict = getDictionary(locale);

  return (
    <EditorialPage
      locale={locale}
      dict={dict}
      alternates={alternates}
      breadcrumbs={[
        { name: dict.nav.home, path: localizedPath(locale) },
        { name: dict.concepts.title, path: localizedPath(locale, section) },
        { name: entry.title, path: localizedPath(locale, section, entry.slug) },
      ]}
      title={entry.title}
      lead={entry.summary}
      body={entry.body}
      sources={entry.sources}
      draft={entry.draft}
    />
  );
};

export default ConceptPage;
