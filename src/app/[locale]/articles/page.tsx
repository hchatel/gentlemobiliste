import type { Metadata } from "next";

import { CardGrid, ContentCard } from "@/components/content/ContentCard";
import { FormattedDate } from "@/components/content/FormattedDate";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { getEntries } from "@/lib/content/loader";
import { allLocalesAlternates } from "@/lib/content/queries";
import { getDictionary, resolveLocale } from "@/lib/i18n/get-dictionary";
import { localizedPath, sections } from "@/lib/i18n/paths";
import { buildPageMetadata } from "@/lib/seo/metadata";

const section = sections.articles;

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/articles">): Promise<Metadata> => {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    title: dict.articles.title,
    description: dict.articles.description,
    path: localizedPath(locale, section),
    alternates: allLocalesAlternates(section),
  });
};

const ArticlesPage = async ({ params }: PageProps<"/[locale]/articles">) => {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const articles = await getEntries("articles", locale);

  return (
    <Container>
      <PageHeader
        locale={locale}
        dict={dict}
        alternates={allLocalesAlternates(section)}
        title={dict.articles.title}
        lead={dict.articles.intro}
        breadcrumbs={[
          { name: dict.nav.home, path: localizedPath(locale) },
          { name: dict.articles.title, path: localizedPath(locale, section) },
        ]}
      />
      {articles.length > 0 ? (
        <CardGrid>
          {articles.map((article) => (
            <ContentCard
              key={article.slug}
              href={localizedPath(locale, section, article.slug)}
              title={article.title}
              description={article.description}
              meta={
                <FormattedDate date={article.publishedAt} locale={locale} />
              }
              draftLabel={article.draft ? dict.content.draft : undefined}
            />
          ))}
        </CardGrid>
      ) : (
        <p className="text-muted">{dict.articles.empty}</p>
      )}
    </Container>
  );
};

export default ArticlesPage;
