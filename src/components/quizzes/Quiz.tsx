"use client";

import { type FormEvent, useEffect, useId, useRef, useState } from "react";

import { buttonClass } from "@/components/ui/button";
import type { Quiz as QuizData } from "@/lib/quiz/schema";
import {
  computeQuizOutcome,
  isCorrectAnswer,
  type QuizAnswers,
} from "@/lib/quiz/score";

/** Libellés d'interface, passés par le Server Component (pas de dictionnaire côté client). */
export type QuizLabels = {
  questionOf: string[];
  validate: string;
  next: string;
  seeResult: string;
  restart: string;
  correct: string;
  incorrect: string;
  expected: string;
  chooseAnswer: string;
  resultTitle: string;
  scores: string[];
};

type QuizProps = {
  quiz: Pick<QuizData, "questions" | "results">;
  labels: QuizLabels;
};

type Phase = "answering" | "feedback" | "finished";

/**
 * Seul composant interactif du site. Une question à la fois, boutons radio
 * natifs groupés dans un fieldset, retour annoncé via une région live et
 * focus déplacé de façon prévisible. Aucune animation, aucune persistance.
 */
export const Quiz = ({ quiz, labels }: QuizProps) => {
  const baseId = useId();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [phase, setPhase] = useState<Phase>("answering");
  const [error, setError] = useState(false);

  const feedbackRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const hasInteracted = useRef(false);

  const total = quiz.questions.length;
  const question = quiz.questions[index];

  // Déplace le focus après chaque transition (sauf au premier rendu).
  useEffect(() => {
    if (!hasInteracted.current) return;
    if (phase === "feedback") feedbackRef.current?.focus();
    else if (phase === "finished") resultRef.current?.focus();
    else legendRef.current?.focus();
  }, [phase, index]);

  if (!question) return null;

  const errorId = `${baseId}-error`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    hasInteracted.current = true;
    if (phase === "feedback") {
      if (index + 1 < total) {
        setIndex(index + 1);
        setSelected(undefined);
        setPhase("answering");
      } else {
        setPhase("finished");
      }
      return;
    }
    if (!selected || !question) {
      setError(true);
      return;
    }
    setError(false);
    setAnswers({ ...answers, [question.id]: selected });
    setPhase("feedback");
  };

  const restart = () => {
    hasInteracted.current = true;
    setIndex(0);
    setAnswers({});
    setSelected(undefined);
    setError(false);
    setPhase("answering");
  };

  if (phase === "finished") {
    const outcome = computeQuizOutcome(quiz, answers);
    return (
      <section
        className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
        aria-labelledby={`${baseId}-result`}
      >
        <h2
          id={`${baseId}-result`}
          ref={resultRef}
          tabIndex={-1}
          className="text-2xl font-semibold"
        >
          {labels.resultTitle} : {outcome.result.title}
        </h2>
        <p className="mt-3 text-lg font-medium" role="status">
          {labels.scores[outcome.score]}
        </p>
        <p className="mt-3 text-muted">{outcome.result.message}</p>
        <button
          type="button"
          onClick={restart}
          className={`${buttonClass("secondary")} mt-6`}
        >
          {labels.restart}
        </button>
      </section>
    );
  }

  const answered = phase === "feedback";
  const givenAnswer = answers[question.id];
  const correct = isCorrectAnswer(question, givenAnswer);
  const expectedLabel = question.options.find(
    (option) => option.id === question.correctOptionId,
  )?.label;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
    >
      <fieldset aria-describedby={error ? errorId : undefined}>
        <legend className="w-full">
          <span className="block text-sm font-medium text-muted">
            {labels.questionOf[index]}
          </span>
          <h2
            ref={legendRef}
            tabIndex={-1}
            className="mt-2 text-2xl font-semibold"
          >
            {question.prompt}
          </h2>
        </legend>

        <div className="mt-6 space-y-3">
          {question.options.map((option) => {
            const inputId = `${baseId}-${question.id}-${option.id}`;
            const isExpected =
              answered && option.id === question.correctOptionId;
            const isWrongChoice =
              answered && option.id === givenAnswer && !correct;
            return (
              <div key={option.id}>
                <input
                  type="radio"
                  id={inputId}
                  name={`${baseId}-${question.id}`}
                  value={option.id}
                  checked={selected === option.id}
                  onChange={() => {
                    setSelected(option.id);
                    setError(false);
                  }}
                  disabled={answered}
                  className="peer sr-only"
                />
                <label
                  htmlFor={inputId}
                  className={[
                    "flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border-2 px-4 py-3",
                    "peer-checked:border-accent peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--focus)",
                    "peer-disabled:cursor-default",
                    isExpected
                      ? "border-success bg-success-soft"
                      : isWrongChoice
                        ? "border-danger bg-danger-soft"
                        : "border-border",
                  ].join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-current"
                  >
                    {selected === option.id ? (
                      <span className="size-2 rounded-full bg-current" />
                    ) : null}
                  </span>
                  <span className="flex-1">{option.label}</span>
                  {isExpected ? (
                    <span aria-hidden="true" className="font-bold text-success">
                      ✓
                    </span>
                  ) : null}
                  {isWrongChoice ? (
                    <span aria-hidden="true" className="font-bold text-danger">
                      ✗
                    </span>
                  ) : null}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>

      {error ? (
        <p id={errorId} role="alert" className="mt-4 font-medium text-danger">
          {labels.chooseAnswer}
        </p>
      ) : null}

      <div aria-live="polite">
        {answered ? (
          <div
            ref={feedbackRef}
            tabIndex={-1}
            className={`mt-6 rounded-xl border-l-4 p-4 ${correct ? "border-success bg-success-soft" : "border-danger bg-danger-soft"}`}
          >
            <p className="font-semibold">
              {correct ? labels.correct : labels.incorrect}
            </p>
            {!correct && expectedLabel ? (
              <p className="mt-1">
                {labels.expected} {expectedLabel}
              </p>
            ) : null}
            <p className="mt-2">{question.explanation}</p>
          </div>
        ) : null}
      </div>

      <button type="submit" className={`${buttonClass("primary")} mt-6`}>
        {answered
          ? index + 1 < total
            ? labels.next
            : labels.seeResult
          : labels.validate}
      </button>
    </form>
  );
};
