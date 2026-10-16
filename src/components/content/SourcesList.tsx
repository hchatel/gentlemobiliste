import type { Source } from "@/lib/content/schemas";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";

import { FormattedDate } from "./FormattedDate";

type SourcesListProps = {
  sources: readonly Source[];
  locale: Locale;
  dict: Dictionary;
};

export const SourcesList = ({ sources, locale, dict }: SourcesListProps) => {
  if (sources.length === 0) return null;
  return (
    <section
      aria-labelledby="sources-title"
      className="mt-12 border-t border-border pt-8"
    >
      <h2 id="sources-title" className="mb-4 text-2xl font-semibold">
        {dict.content.sources}
      </h2>
      <ol className="list-decimal space-y-2 pl-5 text-sm">
        {sources.map((source) => (
          <li key={source.url}>
            <a href={source.url} rel="noopener">
              {source.title}
            </a>
            , {source.publisher} ({dict.content.accessedOn}{" "}
            <FormattedDate date={source.accessedAt} locale={locale} />)
          </li>
        ))}
      </ol>
    </section>
  );
};
