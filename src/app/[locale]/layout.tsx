import "../globals.css";

import type { Metadata, Viewport } from "next";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { locales } from "@/lib/i18n/config";
import { getDictionary, resolveLocale } from "@/lib/i18n/get-dictionary";
import { siteUrl } from "@/lib/seo/site";
import { themeInitScript } from "@/lib/theme";

export const dynamicParams = false;

export const generateStaticParams = () => {
  return locales.map((locale) => ({ locale }));
};

export const generateMetadata = async ({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> => {
  const dict = getDictionary(resolveLocale((await params).locale));
  return {
    metadataBase: siteUrl,
    title: { default: dict.site.name, template: `%s · ${dict.site.name}` },
    description: dict.site.description,
    applicationName: dict.site.name,
    openGraph: { siteName: dict.site.name },
  };
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#11171c" },
  ],
};

const LocaleLayout = async ({ children, params }: LayoutProps<"/[locale]">) => {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-ink px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {dict.a11y.skipToContent}
        </a>
        <Header locale={locale} dict={dict} />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
};

export default LocaleLayout;
