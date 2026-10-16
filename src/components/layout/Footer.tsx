import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { localizedPath, sections } from "@/lib/i18n/paths";

import { Container } from "./Container";

type FooterProps = { locale: Locale; dict: Dictionary };

export const Footer = ({ locale, dict }: FooterProps) => {
  const links = [
    {
      href: localizedPath(locale, sections.concepts),
      label: dict.nav.concepts,
    },
    {
      href: localizedPath(locale, sections.mobilites),
      label: dict.nav.mobilites,
    },
    {
      href: localizedPath(locale, sections.articles),
      label: dict.nav.articles,
    },
    {
      href: localizedPath(locale, sections.parcours),
      label: dict.nav.parcours,
    },
    {
      href: localizedPath(locale, sections.mentionsLegales),
      label: dict.nav.legal,
    },
  ];

  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <Container className="grid gap-8 py-10 sm:grid-cols-[2fr_1fr]">
        <div className="space-y-3">
          <p className="font-serif text-lg font-semibold">
            {dict.site.tagline}
          </p>
          <div className="road-mark" aria-hidden="true" />
          <p className="max-w-md text-muted">{dict.footer.about}</p>
          <p className="text-sm text-muted">{dict.footer.noTracking}</p>
        </div>
        <nav aria-label={dict.site.name}>
          <ul className="space-y-1.5">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
};
