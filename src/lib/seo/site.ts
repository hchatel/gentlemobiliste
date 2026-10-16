/**
 * Domaine public du site : point unique de configuration.
 *
 * À définir via `NEXT_PUBLIC_SITE_URL` (ex. `https://www.exemple.fr`) dans
 * l'environnement de build de production. La valeur de repli utilise le TLD
 * réservé `.example` : elle n'est PAS un domaine de production, et les
 * canonical/sitemap générés avec elle ne doivent pas être publiés tels quels.
 */
const FALLBACK_SITE_URL = "https://gentlemobiliste.example";

const resolveSiteUrl = (): URL => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || FALLBACK_SITE_URL;
  try {
    return new URL(raw);
  } catch {
    throw new Error(`NEXT_PUBLIC_SITE_URL invalide : « ${raw} »`);
  }
};

export const siteUrl = resolveSiteUrl();

export const isFallbackSiteUrl =
  siteUrl.origin === new URL(FALLBACK_SITE_URL).origin;

export const absoluteUrl = (pathname: string): string => {
  return new URL(pathname, siteUrl).toString();
};
