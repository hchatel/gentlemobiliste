import type { Quiz, QuizResult } from "./schema";

/** Réponses de l'utilisateur : identifiant de question → identifiant de réponse. */
export type QuizAnswers = Readonly<Record<string, string | undefined>>;

export type QuizOutcome = {
  score: number;
  total: number;
  result: QuizResult;
};

export const isCorrectAnswer = (
  question: Pick<Quiz["questions"][number], "correctOptionId">,
  optionId: string | undefined,
): boolean => {
  return optionId !== undefined && optionId === question.correctOptionId;
};

/** Calcule le score et sélectionne le résultat au seuil le plus élevé atteint. */
export const computeQuizOutcome = (
  quiz: Pick<Quiz, "questions" | "results">,
  answers: QuizAnswers,
): QuizOutcome => {
  const score = quiz.questions.filter((question) =>
    isCorrectAnswer(question, answers[question.id]),
  ).length;

  const result = [...quiz.results]
    .sort((a, b) => b.minScore - a.minScore)
    .find((candidate) => score >= candidate.minScore);

  if (!result) {
    // Impossible avec un quiz validé (un résultat à minScore 0 est exigé).
    throw new Error("Aucun résultat ne couvre ce score");
  }

  return { score, total: quiz.questions.length, result };
};
