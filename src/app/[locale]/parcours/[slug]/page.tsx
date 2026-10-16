import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DraftBadge } from "@/components/content/DraftBadge";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Quiz, type QuizLabels } from "@/components/quizzes/Quiz";
import {
  getQuiz,
  getQuizAlternates,
  staticParamsFor,
} from "@/lib/content/loader";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { getDictionary, resolveLocale } from "@/lib/i18n/get-dictionary";
import { localizedPath, sections } from "@/lib/i18n/paths";
import { buildPageMetadata } from "@/lib/seo/metadata";

const section = sections.parcours;

export const dynamicParams = false;

export const generateStaticParams = () => {
  return staticParamsFor(section);
};

const load = async (
  params: PageProps<"/[locale]/parcours/[slug]">["params"],
) => {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const quiz = await getQuiz(locale, slug);
  if (!quiz) notFound();
  const alternates = await getQuizAlternates(quiz.translationKey);
  return { locale, quiz, alternates };
};

/** Les fonctions du dictionnaire ne traversent pas la frontière client : on pré-calcule les libellés. */
const quizLabels = (dict: Dictionary, total: number): QuizLabels => {
  const { quiz } = dict;
  const range = (length: number) => Array.from({ length }, (_, i) => i);
  return {
    questionOf: range(total).map((i) => quiz.questionOf(i + 1, total)),
    scores: range(total + 1).map((score) => quiz.score(score, total)),
    validate: quiz.validate,
    next: quiz.next,
    seeResult: quiz.seeResult,
    restart: quiz.restart,
    correct: quiz.correct,
    incorrect: quiz.incorrect,
    expected: quiz.expected,
    chooseAnswer: quiz.chooseAnswer,
    resultTitle: quiz.resultTitle,
  };
};

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/parcours/[slug]">): Promise<Metadata> => {
  const { locale, quiz, alternates } = await load(params);
  return buildPageMetadata({
    locale,
    title: quiz.title,
    description: quiz.description,
    path: localizedPath(locale, section, quiz.slug),
    alternates,
  });
};

const QuizPage = async ({ params }: PageProps<"/[locale]/parcours/[slug]">) => {
  const { locale, quiz, alternates } = await load(params);
  const dict = getDictionary(locale);

  return (
    <Container>
      <PageHeader
        locale={locale}
        dict={dict}
        alternates={alternates}
        title={quiz.title}
        lead={quiz.intro}
        meta={
          <>
            {quiz.draft ? <DraftBadge label={dict.content.draft} /> : null}
            <span>{dict.parcours.questionsCount(quiz.questions.length)}</span>
          </>
        }
        breadcrumbs={[
          { name: dict.nav.home, path: localizedPath(locale) },
          { name: dict.parcours.title, path: localizedPath(locale, section) },
          { name: quiz.title, path: localizedPath(locale, section, quiz.slug) },
        ]}
      />
      <div className="max-w-2xl">
        <noscript>
          <p className="mb-4 rounded-xl border border-ochre p-4">
            {dict.quiz.noscript}
          </p>
        </noscript>
        <Quiz
          quiz={{ questions: quiz.questions, results: quiz.results }}
          labels={quizLabels(dict, quiz.questions.length)}
        />
      </div>
    </Container>
  );
};

export default QuizPage;
