/**
 * Liste centralisée des langues. Ajouter une langue :
 * 1. l'ajouter ici (et dans `localeMeta`) ;
 * 2. créer `dictionaries/<code>.ts` ;
 * 3. créer `content/<code>/…` pour les contenus traduits.
 */
export const locales = ["fr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export const localeMeta: Record<
  Locale,
  { label: string; hreflang: string; ogLocale: string }
> = {
  fr: { label: "Français", hreflang: "fr", ogLocale: "fr_FR" },
  en: { label: "English", hreflang: "en", ogLocale: "en_GB" },
};

export const isLocale = (value: unknown): value is Locale => {
  return (
    typeof value === "string" && (locales as readonly string[]).includes(value)
  );
};
