import type { Metadata } from "next";

import { CardGrid, ContentCard } from "@/components/content/ContentCard";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { getEntries } from "@/lib/content/loader";
import { allLocalesAlternates } from "@/lib/content/queries";
import { getDictionary, resolveLocale } from "@/lib/i18n/get-dictionary";
import { localizedPath, sections } from "@/lib/i18n/paths";
import { buildPageMetadata } from "@/lib/seo/metadata";

const section = sections.concepts;

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/concepts">): Promise<Metadata> => {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    title: dict.concepts.title,
    description: dict.concepts.description,
    path: localizedPath(locale, section),
    alternates: allLocalesAlternates(section),
  });
};

const ConceptsPage = async ({ params }: PageProps<"/[locale]/concepts">) => {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const concepts = await getEntries("concepts", locale);

  return (
    <Container>
      <PageHeader
        locale={locale}
        dict={dict}
        alternates={allLocalesAlternates(section)}
        title={dict.concepts.title}
        lead={dict.concepts.intro}
        breadcrumbs={[
          { name: dict.nav.home, path: localizedPath(locale) },
          { name: dict.concepts.title, path: localizedPath(locale, section) },
        ]}
      />
      {concepts.length > 0 ? (
        <CardGrid>
          {concepts.map((concept) => (
            <ContentCard
              key={concept.slug}
              href={localizedPath(locale, section, concept.slug)}
              title={concept.title}
              description={concept.summary}
              draftLabel={concept.draft ? dict.content.draft : undefined}
            />
          ))}
        </CardGrid>
      ) : (
        <p className="text-muted">{dict.concepts.empty}</p>
      )}
    </Container>
  );
};

export default ConceptsPage;
