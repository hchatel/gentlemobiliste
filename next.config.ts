import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Le contenu est entièrement statique (fichiers du dépôt). On reste sur le
  // modèle de rendu classique pour pouvoir utiliser `dynamicParams = false`
  // (indisponible avec `cacheComponents`). Voir README > Décisions.
  poweredByHeader: false,
  images: {
    // AVIF puis WebP : formats modernes plus légers, servis selon le navigateur.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // 404 globale pour les URL hors de l'arbre `[locale]` (ex. /de/...).
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    // Pas de détection de langue : la racine pointe vers la langue par défaut.
    return [{ source: "/", destination: "/fr", permanent: true }];
  },
};

export default nextConfig;
