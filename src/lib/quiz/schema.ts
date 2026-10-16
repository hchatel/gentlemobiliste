import { z } from "zod";

import { baseFields } from "@/lib/content/schemas";

const optionSchema = z.strictObject({
  id: z.string().min(1),
  label: z.string().min(1),
});

const questionSchema = z
  .strictObject({
    id: z.string().min(1),
    prompt: z.string().min(1),
    options: z.array(optionSchema).min(2, "Au moins deux réponses possibles"),
    correctOptionId: z.string().min(1),
    /** Retour affiché après la réponse, qu'elle soit juste ou non. */
    explanation: z.string().min(1),
  })
  .superRefine((question, ctx) => {
    const ids = question.options.map((option) => option.id);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: "Identifiants de réponse en double",
      });
    }
    if (!ids.includes(question.correctOptionId)) {
      ctx.addIssue({
        code: "custom",
        path: ["correctOptionId"],
        message: `correctOptionId « ${question.correctOptionId} » ne correspond à aucune réponse`,
      });
    }
  });

const resultSchema = z.strictObject({
  /** Score minimal (inclus) pour obtenir ce résultat. */
  minScore: z.number().int().min(0),
  title: z.string().min(1),
  message: z.string().min(1),
});

export const quizSchema = z
  .strictObject({
    ...baseFields,
    intro: z.string().min(1),
    questions: z.array(questionSchema).min(1),
    results: z.array(resultSchema).min(1),
  })
  .superRefine((quiz, ctx) => {
    const ids = quiz.questions.map((question) => question.id);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: "custom",
        path: ["questions"],
        message: "Identifiants de question en double",
      });
    }
    if (!quiz.results.some((result) => result.minScore === 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["results"],
        message:
          "Un résultat avec minScore: 0 est requis pour couvrir tous les scores",
      });
    }
    if (
      quiz.results.some((result) => result.minScore > quiz.questions.length)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["results"],
        message: "Un minScore dépasse le nombre de questions",
      });
    }
  });

export type Quiz = z.infer<typeof quizSchema>;
export type QuizQuestion = Quiz["questions"][number];
export type QuizResult = Quiz["results"][number];
