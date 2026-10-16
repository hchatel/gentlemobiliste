import { describe, expect, it } from "vitest";

import { computeQuizOutcome, isCorrectAnswer } from "./score";

const question = (id: string, correctOptionId: string) => ({
  id,
  prompt: id,
  options: [
    { id: "a", label: "A" },
    { id: "b", label: "B" },
  ],
  correctOptionId,
  explanation: "",
});

const quiz = {
  questions: [question("q1", "a"), question("q2", "b"), question("q3", "a")],
  results: [
    { minScore: 3, title: "Parfait", message: "" },
    { minScore: 0, title: "Débutant", message: "" },
    { minScore: 2, title: "Bien", message: "" },
  ],
};

describe("computeQuizOutcome", () => {
  it("compte les bonnes réponses et choisit le seuil atteint le plus élevé", () => {
    expect(
      computeQuizOutcome(quiz, { q1: "a", q2: "b", q3: "b" }),
    ).toMatchObject({
      score: 2,
      total: 3,
      result: { title: "Bien" },
    });
  });

  it("gère le score parfait", () => {
    expect(
      computeQuizOutcome(quiz, { q1: "a", q2: "b", q3: "a" }).result.title,
    ).toBe("Parfait");
  });

  it("compte les questions sans réponse comme fausses", () => {
    expect(computeQuizOutcome(quiz, {})).toMatchObject({
      score: 0,
      result: { title: "Débutant" },
    });
  });

  it("ignore les réponses à des questions inconnues", () => {
    expect(computeQuizOutcome(quiz, { inconnue: "a" }).score).toBe(0);
  });
});

describe("isCorrectAnswer", () => {
  it("compare avec la bonne réponse", () => {
    expect(isCorrectAnswer({ correctOptionId: "a" }, "a")).toBe(true);
    expect(isCorrectAnswer({ correctOptionId: "a" }, "b")).toBe(false);
    expect(isCorrectAnswer({ correctOptionId: "a" }, undefined)).toBe(false);
  });
});
