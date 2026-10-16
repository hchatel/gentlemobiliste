import { formatDate } from "@/lib/i18n/format";
import type { Locale } from "@/lib/i18n/config";

export const FormattedDate = ({
  date,
  locale,
}: {
  date: string;
  locale: Locale;
}) => {
  return <time dateTime={date}>{formatDate(date, locale)}</time>;
};
