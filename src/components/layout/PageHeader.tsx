import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import type { Alternates } from "@/lib/content/queries";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import type { BreadcrumbItem } from "@/lib/seo/json-ld";

import { LanguageSwitcher } from "./LanguageSwitcher";

type PageHeaderProps = {
  locale: Locale;
  dict: Dictionary;
  alternates: Alternates;
  title: string;
  lead?: string;
  /** Absent sur l'accueil. */
  breadcrumbs?: readonly BreadcrumbItem[];
  /** Métadonnées affichées sous le titre (date, badge…). */
  meta?: ReactNode;
};

/**
 * En-tête commun des pages : fil d'Ariane, sélecteur de langue (qui dépend
 * de la page, d'où sa place ici plutôt que dans le layout), titre, chapeau.
 */
export const PageHeader = ({
  locale,
  dict,
  alternates,
  title,
  lead,
  breadcrumbs,
  meta,
}: PageHeaderProps) => {
  return (
    <div className="space-y-8 pt-6 pb-10 sm:pt-8">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        {breadcrumbs ? (
          <Breadcrumbs items={breadcrumbs} label={dict.a11y.breadcrumbs} />
        ) : (
          <span />
        )}
        <LanguageSwitcher locale={locale} dict={dict} alternates={alternates} />
      </div>
      <div className="max-w-3xl space-y-4">
        <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
        {meta ? (
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            {meta}
          </div>
        ) : null}
        {lead ? <p className="text-lg text-muted sm:text-xl">{lead}</p> : null}
      </div>
    </div>
  );
};
