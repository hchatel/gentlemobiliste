import Link from "next/link";
import { locale as rootLocale } from "next/root-params";

import { Container } from "@/components/layout/Container";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath, sections } from "@/lib/i18n/paths";

/**
 * 404 rendue quand une page appelle `notFound()` sous une langue valide.
 * Les URL non générées au build sont, elles, servies par `global-not-found.tsx`.
 */
const NotFound = async () => {
  const value = await rootLocale();
  const locale = isLocale(value) ? value : defaultLocale;
  const dict = getDictionary(locale);
  const links = [
    { href: localizedPath(locale), label: dict.notFound.backHome },
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
    <Container className="py-16">
      <title>{`${dict.notFound.title} · ${dict.site.name}`}</title>
      <p className="font-serif text-6xl font-semibold text-accent">404</p>
      <h1 className="mt-4 text-4xl font-semibold">{dict.notFound.title}</h1>
      <p className="mt-4 text-lg text-muted">{dict.notFound.description}</p>
      <ul className="mt-6 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default NotFound;
