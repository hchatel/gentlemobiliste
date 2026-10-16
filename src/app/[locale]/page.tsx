import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { CardGrid, ContentCard } from "@/components/content/ContentCard";
import { FormattedDate } from "@/components/content/FormattedDate";
import { Container } from "@/components/layout/Container";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { JsonLd } from "@/components/seo/JsonLd";
import { buttonClass } from "@/components/ui/button";
import { getEntries, getQuizzes } from "@/lib/content/loader";
import { allLocalesAlternates } from "@/lib/content/queries";
import { getDictionary, resolveLocale } from "@/lib/i18n/get-dictionary";
import { localizedPath, sections } from "@/lib/i18n/paths";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> => {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  return {
    ...buildPageMetadata({
      locale,
      title: dict.site.name,
      description: dict.site.description,
      path: localizedPath(locale),
      alternates: allLocalesAlternates(),
    }),
    // L'accueil n'utilise pas le gabarit « … · Gentlemobiliste ».
    title: { absolute: `${dict.site.name} · ${dict.site.tagline}` },
  };
};

type SectionProps = {
  id: string;
  title: string;
  intro?: string;
  seeAll?: { href: string; label: string };
  children: ReactNode;
};

const HomeSection = ({ id, title, intro, seeAll, children }: SectionProps) => {
  return (
    <section aria-labelledby={id} className="py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 id={id} className="text-3xl font-semibold">
            {title}
          </h2>
          {intro ? <p className="text-muted">{intro}</p> : null}
        </div>
        {seeAll ? (
          <Link href={seeAll.href} className="font-medium">
            {seeAll.label}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
};

const HomePage = async ({ params }: PageProps<"/[locale]">) => {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const [concepts, mobilites, articles, quizzes] = await Promise.all([
    getEntries("concepts", locale),
    getEntries("mobilites", locale),
    getEntries("articles", locale),
    getQuizzes(locale),
  ]);
  const draftLabel = (draft: boolean) =>
    draft ? dict.content.draft : undefined;
  const seeAllLabel = (section: string) =>
    `${dict.home.seeAll} : ${section.toLowerCase()}`;

  return (
    <Container>
      <JsonLd
        data={organizationJsonLd(dict.site.name, dict.site.description)}
      />
      <JsonLd
        data={websiteJsonLd(dict.site.name, locale, localizedPath(locale))}
      />

      <div className="flex justify-end pt-6">
        <LanguageSwitcher
          locale={locale}
          dict={dict}
          alternates={allLocalesAlternates()}
        />
      </div>

      <section className="max-w-3xl space-y-6 pt-10 pb-14 sm:pt-16">
        <p className="font-serif text-lg text-accent italic">
          {dict.site.tagline}
        </p>
        <h1 className="text-4xl font-semibold sm:text-6xl">
          {dict.home.title}
        </h1>
        <div className="road-mark" aria-hidden="true" />
        <p className="text-lg text-muted sm:text-xl">{dict.home.lead}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href={localizedPath(locale, sections.concepts)}
            className={buttonClass("primary")}
          >
            {dict.home.primaryCta}
          </Link>
          <Link
            href={localizedPath(locale, sections.parcours)}
            className={buttonClass("secondary")}
          >
            {dict.home.secondaryCta}
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="cooperation"
        className="rounded-2xl border border-border bg-accent-soft px-6 py-10 sm:px-10"
      >
        <h2 id="cooperation" className="text-3xl font-semibold">
          {dict.home.cooperation.title}
        </h2>
        <div className="mt-5 grid gap-5 text-lg md:grid-cols-2">
          {dict.home.cooperation.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {concepts.length > 0 ? (
        <HomeSection
          id="concepts"
          title={dict.home.conceptsTitle}
          intro={dict.home.conceptsIntro}
          seeAll={{
            href: localizedPath(locale, sections.concepts),
            label: seeAllLabel(dict.nav.concepts),
          }}
        >
          <CardGrid>
            {concepts.slice(0, 3).map((concept) => (
              <ContentCard
                key={concept.slug}
                headingLevel={3}
                href={localizedPath(locale, sections.concepts, concept.slug)}
                title={concept.title}
                description={concept.summary}
                draftLabel={draftLabel(concept.draft)}
              />
            ))}
          </CardGrid>
        </HomeSection>
      ) : null}

      {mobilites.length > 0 ? (
        <HomeSection
          id="mobilites"
          title={dict.home.mobilitesTitle}
          intro={dict.home.mobilitesIntro}
          seeAll={{
            href: localizedPath(locale, sections.mobilites),
            label: seeAllLabel(dict.nav.mobilites),
          }}
        >
          <CardGrid>
            {mobilites.map((mobility) => (
              <ContentCard
                key={mobility.slug}
                headingLevel={3}
                href={localizedPath(locale, sections.mobilites, mobility.slug)}
                title={mobility.title}
                description={mobility.summary}
                draftLabel={draftLabel(mobility.draft)}
              />
            ))}
          </CardGrid>
        </HomeSection>
      ) : null}

      {articles.length > 0 ? (
        <HomeSection
          id="articles"
          title={dict.home.articlesTitle}
          seeAll={{
            href: localizedPath(locale, sections.articles),
            label: seeAllLabel(dict.nav.articles),
          }}
        >
          <CardGrid>
            {articles.slice(0, 3).map((article) => (
              <ContentCard
                key={article.slug}
                headingLevel={3}
                href={localizedPath(locale, sections.articles, article.slug)}
                title={article.title}
                description={article.description}
                meta={
                  <FormattedDate date={article.publishedAt} locale={locale} />
                }
                draftLabel={draftLabel(article.draft)}
              />
            ))}
          </CardGrid>
        </HomeSection>
      ) : null}

      <HomeSection
        id="parcours"
        title={dict.home.parcoursTitle}
        intro={dict.home.parcoursIntro}
      >
        {quizzes.length > 0 ? (
          <CardGrid>
            {quizzes.map((quiz) => (
              <ContentCard
                key={quiz.slug}
                headingLevel={3}
                href={localizedPath(locale, sections.parcours, quiz.slug)}
                title={quiz.title}
                description={quiz.description}
                meta={dict.parcours.questionsCount(quiz.questions.length)}
                draftLabel={draftLabel(quiz.draft)}
              />
            ))}
          </CardGrid>
        ) : (
          <p className="text-muted">{dict.parcours.empty}</p>
        )}
      </HomeSection>
    </Container>
  );
};

export default HomePage;
