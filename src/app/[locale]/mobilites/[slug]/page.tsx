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

const section = sections.mobilites;

export const dynamicParams = false;

export const generateStaticParams = () => {
  return staticParamsFor(section);
};

const load = async (
  params: PageProps<"/[locale]/mobilites/[slug]">["params"],
) => {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const entry = await getEntry("mobilites", locale, slug);
  if (!entry) notFound();
  const alternates = await getEntryAlternates(
    "mobilites",
    entry.translationKey,
  );
  return { locale, entry, alternates };
};

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/mobilites/[slug]">): Promise<Metadata> => {
  const { locale, entry, alternates } = await load(params);
  return buildPageMetadata({
    locale,
    title: entry.title,
    description: entry.description,
    path: localizedPath(locale, section, entry.slug),
    alternates,
  });
};

const MobilityPage = async ({
  params,
}: PageProps<"/[locale]/mobilites/[slug]">) => {
  const { locale, entry, alternates } = await load(params);
  const dict = getDictionary(locale);

  return (
    <EditorialPage
      locale={locale}
      dict={dict}
      alternates={alternates}
      breadcrumbs={[
        { name: dict.nav.home, path: localizedPath(locale) },
        { name: dict.mobilites.title, path: localizedPath(locale, section) },
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

export default MobilityPage;
