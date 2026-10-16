import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { allLocalesAlternates } from "@/lib/content/queries";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary, resolveLocale } from "@/lib/i18n/get-dictionary";
import { localizedPath, sections } from "@/lib/i18n/paths";
import { buildPageMetadata } from "@/lib/seo/metadata";

const section = sections.mentionsLegales;

/**
 * Squelette des mentions légales (LCEN, art. 6). Les valeurs entre crochets
 * DOIVENT être complétées avant la mise en production : aucune n'est inventée.
 */
const legalContent: Record<
  Locale,
  {
    intro: string;
    blocks: { title: string; items: { label: string; value: string }[] }[];
    privacy: { title: string; paragraphs: string[] };
  }
> = {
  fr: {
    intro:
      "Informations prévues par la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique (LCEN).",
    blocks: [
      {
        title: "Éditeur du site",
        items: [
          { label: "Nom ou raison sociale", value: "[À compléter]" },
          {
            label:
              "Forme juridique et numéro d’immatriculation (le cas échéant)",
            value: "[À compléter]",
          },
          { label: "Adresse", value: "[À compléter]" },
        ],
      },
      {
        title: "Direction de la publication",
        items: [
          {
            label: "Directeur ou directrice de la publication",
            value: "[À compléter]",
          },
        ],
      },
      {
        title: "Hébergement",
        items: [
          {
            label: "Hébergeur",
            value: "[À compléter : nom ou raison sociale]",
          },
          { label: "Adresse", value: "[À compléter]" },
          { label: "Téléphone", value: "[À compléter]" },
        ],
      },
      {
        title: "Contact",
        items: [{ label: "Adresse de contact", value: "[À compléter]" }],
      },
    ],
    privacy: {
      title: "Cookies, traceurs et données personnelles",
      paragraphs: [
        "Ce site n’utilise aucun cookie, aucun traceur et aucun outil de mesure d’audience. Il ne propose ni compte utilisateur ni formulaire : les réponses aux parcours restent dans votre navigateur et ne sont ni enregistrées ni transmises.",
        "[À compléter : informations sur les journaux techniques éventuellement conservés par l’hébergeur.]",
      ],
    },
  },
  en: {
    intro:
      "Information required by French law (LCEN, law no. 2004-575 of 21 June 2004).",
    blocks: [
      {
        title: "Publisher",
        items: [
          { label: "Name or company name", value: "[To be completed]" },
          {
            label: "Legal form and registration number (if applicable)",
            value: "[To be completed]",
          },
          { label: "Address", value: "[To be completed]" },
        ],
      },
      {
        title: "Publication director",
        items: [{ label: "Publication director", value: "[To be completed]" }],
      },
      {
        title: "Hosting",
        items: [
          {
            label: "Hosting provider",
            value: "[To be completed: name or company name]",
          },
          { label: "Address", value: "[To be completed]" },
          { label: "Phone", value: "[To be completed]" },
        ],
      },
      {
        title: "Contact",
        items: [{ label: "Contact address", value: "[To be completed]" }],
      },
    ],
    privacy: {
      title: "Cookies, trackers and personal data",
      paragraphs: [
        "This site uses no cookies, no trackers and no audience measurement tools. It offers no user account and no form: quiz answers stay in your browser and are neither stored nor sent anywhere.",
        "[To be completed: information about technical logs that may be kept by the hosting provider.]",
      ],
    },
  },
};

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/mentions-legales">): Promise<Metadata> => {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    title: dict.legal.title,
    description: dict.legal.description,
    path: localizedPath(locale, section),
    alternates: allLocalesAlternates(section),
  });
};

const LegalPage = async ({
  params,
}: PageProps<"/[locale]/mentions-legales">) => {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const content = legalContent[locale];

  return (
    <Container>
      <PageHeader
        locale={locale}
        dict={dict}
        alternates={allLocalesAlternates(section)}
        title={dict.legal.title}
        lead={content.intro}
        breadcrumbs={[
          { name: dict.nav.home, path: localizedPath(locale) },
          { name: dict.legal.title, path: localizedPath(locale, section) },
        ]}
      />
      <div className="prose">
        {content.blocks.map((block) => (
          <section key={block.title}>
            <h2>{block.title}</h2>
            <dl className="mt-3 space-y-2">
              {block.items.map((item) => (
                <div key={item.label}>
                  <dt className="font-semibold">{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
        <section>
          <h2>{content.privacy.title}</h2>
          {content.privacy.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-3">
              {paragraph}
            </p>
          ))}
        </section>
      </div>
    </Container>
  );
};

export default LegalPage;
