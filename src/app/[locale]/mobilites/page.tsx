import type { Metadata } from "next";

import { CardGrid, ContentCard } from "@/components/content/ContentCard";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { getEntries } from "@/lib/content/loader";
import { allLocalesAlternates } from "@/lib/content/queries";
import { getDictionary, resolveLocale } from "@/lib/i18n/get-dictionary";
import { localizedPath, sections } from "@/lib/i18n/paths";
import { buildPageMetadata } from "@/lib/seo/metadata";

const section = sections.mobilites;

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/mobilites">): Promise<Metadata> => {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    title: dict.mobilites.title,
    description: dict.mobilites.description,
    path: localizedPath(locale, section),
    alternates: allLocalesAlternates(section),
  });
};

const MobilitesPage = async ({ params }: PageProps<"/[locale]/mobilites">) => {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const mobilites = await getEntries("mobilites", locale);

  return (
    <Container>
      <PageHeader
        locale={locale}
        dict={dict}
        alternates={allLocalesAlternates(section)}
        title={dict.mobilites.title}
        lead={dict.mobilites.intro}
        breadcrumbs={[
          { name: dict.nav.home, path: localizedPath(locale) },
          { name: dict.mobilites.title, path: localizedPath(locale, section) },
        ]}
      />
      {mobilites.length > 0 ? (
        <CardGrid>
          {mobilites.map((mobility) => (
            <ContentCard
              key={mobility.slug}
              href={localizedPath(locale, section, mobility.slug)}
              title={mobility.title}
              description={mobility.summary}
              draftLabel={mobility.draft ? dict.content.draft : undefined}
            />
          ))}
        </CardGrid>
      ) : (
        <p className="text-muted">{dict.mobilites.empty}</p>
      )}
    </Container>
  );
};

export default MobilitesPage;
