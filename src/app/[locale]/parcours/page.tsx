import type { Metadata } from "next";

import { CardGrid, ContentCard } from "@/components/content/ContentCard";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { getQuizzes } from "@/lib/content/loader";
import { allLocalesAlternates } from "@/lib/content/queries";
import { getDictionary, resolveLocale } from "@/lib/i18n/get-dictionary";
import { localizedPath, sections } from "@/lib/i18n/paths";
import { buildPageMetadata } from "@/lib/seo/metadata";

const section = sections.parcours;

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/parcours">): Promise<Metadata> => {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    title: dict.parcours.title,
    description: dict.parcours.description,
    path: localizedPath(locale, section),
    alternates: allLocalesAlternates(section),
  });
};

const ParcoursPage = async ({ params }: PageProps<"/[locale]/parcours">) => {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const quizzes = await getQuizzes(locale);

  return (
    <Container>
      <PageHeader
        locale={locale}
        dict={dict}
        alternates={allLocalesAlternates(section)}
        title={dict.parcours.title}
        lead={dict.parcours.intro}
        breadcrumbs={[
          { name: dict.nav.home, path: localizedPath(locale) },
          { name: dict.parcours.title, path: localizedPath(locale, section) },
        ]}
      />
      {quizzes.length > 0 ? (
        <CardGrid>
          {quizzes.map((quiz) => (
            <ContentCard
              key={quiz.slug}
              href={localizedPath(locale, section, quiz.slug)}
              title={quiz.title}
              description={quiz.description}
              meta={dict.parcours.questionsCount(quiz.questions.length)}
              draftLabel={quiz.draft ? dict.content.draft : undefined}
            />
          ))}
        </CardGrid>
      ) : (
        <p className="text-muted">{dict.parcours.empty}</p>
      )}
    </Container>
  );
};

export default ParcoursPage;
