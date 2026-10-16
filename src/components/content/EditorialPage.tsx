import type { ReactNode } from "react";

import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { renderMarkdown } from "@/lib/content/markdown";
import type { Alternates } from "@/lib/content/queries";
import type { Source } from "@/lib/content/schemas";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import type { BreadcrumbItem } from "@/lib/seo/json-ld";

import { DraftBadge } from "./DraftBadge";
import { SourcesList } from "./SourcesList";
import { TableOfContents } from "./TableOfContents";

type EditorialPageProps = {
  locale: Locale;
  dict: Dictionary;
  alternates: Alternates;
  breadcrumbs: readonly BreadcrumbItem[];
  title: string;
  lead?: string;
  body: string;
  sources: readonly Source[];
  draft: boolean;
  meta?: ReactNode;
  /** Contenu inséré avant le texte (ex. image d'article). */
  media?: ReactNode;
};

/** Gabarit unique des pages de contenu Markdown (concepts, mobilités, articles). */
export const EditorialPage = async ({
  locale,
  dict,
  alternates,
  breadcrumbs,
  title,
  lead,
  body,
  sources,
  draft,
  meta,
  media,
}: EditorialPageProps) => {
  const { html, headings } = await renderMarkdown(body);
  return (
    <Container>
      <article>
        <PageHeader
          locale={locale}
          dict={dict}
          alternates={alternates}
          breadcrumbs={breadcrumbs}
          title={title}
          lead={lead}
          meta={
            draft || meta ? (
              <>
                {draft ? <DraftBadge label={dict.content.draft} /> : null}
                {meta}
              </>
            ) : undefined
          }
        />
        {media}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="lg:order-2">
            <div className="lg:sticky lg:top-6">
              <TableOfContents
                headings={headings}
                label={dict.a11y.tableOfContents}
              />
            </div>
          </div>
          <div>
            <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
            <SourcesList sources={sources} locale={locale} dict={dict} />
          </div>
        </div>
      </article>
    </Container>
  );
};
