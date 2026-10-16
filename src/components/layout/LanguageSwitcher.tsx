import Link from "next/link";

import type { Alternates } from "@/lib/content/queries";
import { type Locale, localeMeta, locales } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { localizedPath } from "@/lib/i18n/paths";

type LanguageSwitcherProps = {
  locale: Locale;
  dict: Dictionary;
  /** Chemin de la page courante dans chaque langue, `null` si non traduite. */
  alternates: Alternates;
};

/**
 * Sélecteur de langue rendu côté serveur (simples liens, aucun JavaScript).
 * Si la page n'est pas traduite, on le dit explicitement et on propose
 * l'accueil de la langue cible plutôt qu'une page sans rapport.
 */
export const LanguageSwitcher = ({
  locale,
  dict,
  alternates,
}: LanguageSwitcherProps) => {
  return (
    <nav aria-label={dict.a11y.languageSwitcher} className="text-sm">
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {locales.map((target) => {
          const { label, hreflang } = localeMeta[target];
          if (target === locale) {
            return (
              <li key={target}>
                <span aria-current="true" className="font-semibold">
                  <span className="sr-only">{dict.language.current} : </span>
                  {label}
                </span>
              </li>
            );
          }
          const href = alternates[target];
          if (href) {
            return (
              <li key={target}>
                <Link href={href} hrefLang={hreflang} lang={hreflang}>
                  {label}
                </Link>
              </li>
            );
          }
          return (
            <li key={target} className="text-muted">
              <span lang={hreflang}>{label}</span> (
              {dict.language.notTranslated}) ·{" "}
              <Link href={localizedPath(target)} hrefLang={hreflang}>
                {dict.language.goToHome(label)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
