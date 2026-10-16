type JsonLdProps = { data: Record<string, unknown> };

/** Données structurées sérialisées ; `<` échappé pour empêcher toute fermeture de balise. */
export const JsonLd = ({ data }: JsonLdProps) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
};
