import "./globals.css";

import type { Metadata } from "next";
import Link from "next/link";

import { defaultLocale, localeMeta, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/paths";

export const metadata: Metadata = {
  title: "404 · Gentlemobiliste",
  robots: { index: false },
};

/**
 * 404 de toute URL hors des pages générées (langue inconnue, contenu
 * inexistant : `dynamicParams = false` les rejette au routage). La langue
 * n'étant pas connue à ce stade, le message est affiché dans chaque langue.
 */
const GlobalNotFound = () => {
  return (
    <html lang={defaultLocale}>
      <body className="flex min-h-dvh items-center">
        <main className="mx-auto w-full max-w-2xl space-y-10 px-5 py-16">
          <p className="font-serif text-6xl font-semibold text-accent">404</p>
          {locales.map((locale, index) => {
            const dict = getDictionary(locale);
            const Heading = index === 0 ? "h1" : "h2";
            return (
              <section
                key={locale}
                lang={localeMeta[locale].hreflang}
                className="space-y-3"
              >
                <Heading className="text-3xl font-semibold">
                  {dict.notFound.title}
                </Heading>
                <p className="text-lg text-muted">
                  {dict.notFound.description}
                </p>
                <Link href={localizedPath(locale)}>
                  {dict.notFound.backHome}
                </Link>
              </section>
            );
          })}
        </main>
      </body>
    </html>
  );
};

export default GlobalNotFound;
