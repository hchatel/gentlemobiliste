import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { localizedPath, sections } from "@/lib/i18n/paths";

import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";
import { LogoMark } from "./Logo";

type HeaderProps = { locale: Locale; dict: Dictionary };

export const Header = ({ locale, dict }: HeaderProps) => {
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
  ];

  return (
    <header className="border-b border-border">
      <Container className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-4">
        <Link
          href={localizedPath(locale)}
          className="flex items-center gap-2.5 font-serif text-xl font-semibold text-ink no-underline hover:text-accent"
        >
          <LogoMark className="size-8 shrink-0" />
          {dict.site.name}
        </Link>
        <nav aria-label={dict.a11y.mainNav}>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block py-1.5 font-medium text-ink no-underline hover:text-accent hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle labels={dict.theme} />
      </Container>
    </header>
  );
};
