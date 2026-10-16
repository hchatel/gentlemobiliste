import Link from "next/link";
import type { ReactNode } from "react";

import { DraftBadge } from "./DraftBadge";

type ContentCardProps = {
  href: string;
  title: string;
  description: string;
  /** Niveau du titre de carte, selon la hiérarchie de la page. */
  headingLevel?: 2 | 3;
  meta?: ReactNode;
  draftLabel?: string;
};

/** Carte discrète, entièrement cliquable via le lien du titre (étendu en CSS). */
export const ContentCard = ({
  href,
  title,
  description,
  headingLevel = 2,
  meta,
  draftLabel,
}: ContentCardProps) => {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="relative flex h-full flex-col gap-3 rounded-xl border border-border bg-surface p-6 transition-colors focus-within:border-accent hover:border-accent">
      {draftLabel ? <DraftBadge label={draftLabel} /> : null}
      <Heading className="text-xl font-semibold">
        <Link
          href={href}
          className="text-ink no-underline after:absolute after:inset-0 after:content-[''] hover:text-accent"
        >
          {title}
        </Link>
      </Heading>
      <p className="text-muted">{description}</p>
      {meta ? <p className="mt-auto text-sm text-muted">{meta}</p> : null}
    </article>
  );
};

export const CardGrid = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
};
