import type { Locale } from "./config";

/** Formate une date ISO `YYYY-MM-DD` selon la langue, sans décalage de fuseau. */
export const formatDate = (isoDate: string, locale: Locale): string => {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
};
