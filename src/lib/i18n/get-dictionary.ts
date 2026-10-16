import "server-only";

import { notFound } from "next/navigation";

import { isLocale, type Locale } from "./config";
import { en } from "./dictionaries/en";
import { fr } from "./dictionaries/fr";

const dictionaries = { fr, en } as const;

export const getDictionary = (locale: Locale) => {
  return dictionaries[locale];
};

/** Valide le segment `[locale]` ; toute valeur inconnue produit une 404. */
export const resolveLocale = (value: string): Locale => {
  if (!isLocale(value)) notFound();
  return value;
};
