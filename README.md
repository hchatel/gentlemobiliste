# Gentlemobiliste

Site éditorial du mouvement **Gentlemobiliste** : mieux partager la rue, quel que soit son mode de déplacement.
_Chacun sa route. Tous la même rue._

Site statique (SSG) en Next.js, multilingue (français, anglais), sans base de données, sans cookie ni traceur.

## Prérequis

- Node.js ≥ 20.9 (développé avec Node 24)
- pnpm (version épinglée dans `package.json` → `packageManager`)

## Installation et développement

```bash
pnpm install
pnpm dev          # http://localhost:3000 → redirige vers /fr
```

## Commandes

| Commande            | Rôle                                                   |
| ------------------- | ------------------------------------------------------ |
| `pnpm dev`          | Serveur de développement (brouillons visibles)         |
| `pnpm build`        | Build de production (brouillons exclus)                |
| `pnpm start`        | Sert le build de production                            |
| `pnpm lint`         | ESLint (le build ne lance plus le lint depuis Next 16) |
| `pnpm typecheck`    | Génère les types de routes puis `tsc --noEmit`         |
| `pnpm format`       | Formate le code avec Prettier                          |
| `pnpm format:check` | Vérifie le formatage                                   |
| `pnpm test`         | Tests unitaires Vitest (exécution unique)              |

Avant de pousser : `pnpm typecheck && pnpm lint && pnpm format:check && pnpm test && pnpm build`.

## Organisation du code

```
content/                    Contenus éditoriaux versionnés (données, pas du code)
  fr/ en/
    concepts/  mobilites/  articles/   → Markdown + frontmatter
    parcours/                          → quiz en JSON
src/
  app/
    [locale]/               Toutes les pages publiques, préfixées par la langue
      layout.tsx            Layout racine : <html lang>, en-tête, pied de page
      concepts/ mobilites/ articles/ parcours/   liste + [slug]
      mentions-legales/
      not-found.tsx         404 lors d'un appel à notFound()
    global-not-found.tsx    404 des URL inconnues (bilingue)
    sitemap.ts  robots.ts  icon.svg  globals.css
  components/
    layout/                 Header, Footer, PageHeader, LanguageSwitcher, Container,
                            ThemeToggle (Client Component)
    content/                Cartes, fil d'Ariane, sommaire, sources, gabarit EditorialPage
    quizzes/Quiz.tsx        Client Component (quiz interactif)
    seo/JsonLd.tsx  ui/button.ts
  lib/
    i18n/                   Langues, dictionnaires d'interface, chemins, formatage des dates
    content/                Schémas Zod, parsing, chargeur (fs), requêtes pures, rendu Markdown
    quiz/                   Schéma Zod du quiz et calcul du score (fonction pure)
    seo/                    Domaine public, métadonnées, JSON-LD
```

## Décisions d'architecture

- **Rendu 100 % statique.** Chaque route de contenu exporte `generateStaticParams` et `dynamicParams = false` : toute URL non générée au build renvoie une 404. Pas de `output: 'export'`, pour garder `next/image` et les redirections de `next.config.ts`.
- **`cacheComponents` désactivé.** `create-next-app` 16.4 l'active par défaut, mais il rend `dynamicParams` indisponible. Le contenu étant entièrement figé au build, le modèle classique suffit. Next annonce que ce mode deviendra la règle dans la prochaine version majeure : à réévaluer lors de la montée de version (`ensureStatic = 'navigation'` sera alors l'équivalent).
- **i18n maison, sans middleware.** `src/lib/i18n/config.ts` liste les langues ; les dictionnaires typés (`dictionaries/fr.ts` fait référence, `en.ts` doit avoir exactement la même forme) sont lus côté serveur. Aucun JavaScript client n'est ajouté. `/` redirige vers `/fr` dans `next.config.ts`, sans détection de la langue du navigateur.
- **Segments de section non traduits.** `concepts`, `mobilites`, `articles`, `parcours`, `mentions-legales` sont identiques dans toutes les langues (`/en/mobilites/…`). Seuls les slugs de contenu peuvent varier. Ça garde un routage unique et des liens simples ; on pourra traduire les segments plus tard si le SEO anglophone l'exige.
- **Correspondance des traductions par `translationKey`.** Deux fichiers qui partagent la même `translationKey` sont des traductions l'un de l'autre, même si leurs slugs diffèrent. Le sélecteur de langue et les balises `hreflang` n'utilisent que les traductions réellement présentes.
- **Sélecteur de langue rendu côté serveur.** Ce sont de simples liens. Si une page n'est pas traduite, le sélecteur l'indique (« pas encore traduit ») et propose l'accueil de l'autre langue, présenté comme tel. Comme le layout ne connaît pas la page courante, le sélecteur est placé dans `PageHeader`, en haut de chaque page.
- **Markdown + `unified`, sans MDX.** Le frontmatter est lu par `gray-matter` puis validé par Zod. Le corps est converti en HTML au build (`remark-gfm`, `rehype-slug` pour les ancres du sommaire). Le HTML brut du Markdown n'est pas rendu : les commentaires `<!-- TODO -->` restent invisibles et aucune injection n'est possible. MDX n'apporterait rien tant qu'aucun composant n'est nécessaire dans les contenus.
- **Validation stricte.** Un champ inconnu, une date invalide, un slug différent du nom de fichier ou une `translationKey` en double font échouer le build, avec un message qui indique le fichier et le champ en cause.
- **Brouillons.** `draft: true` : visible en `pnpm dev` (badge « Brouillon »), exclu en production (pages, listes, sitemap).

### Performance et sobriété

- HTML pré-généré pour toutes les pages ; le seul JavaScript applicatif est le quiz.
- Polices système : aucune requête, aucun poids de police.
- Aucune bibliothèque d'icônes, d'animation ou d'UI ; le logo est un SVG inline.
- `next/image` avec AVIF/WebP pour les images d'articles (champ `image`).
- Aucun script analytique ni traceur.
- Pour mesurer : `pnpm build && pnpm start`, puis Lighthouse ou PageSpeed Insights sur l'URL déployée. Les Core Web Vitals ne sont pas garantis tant qu'ils n'ont pas été mesurés en conditions réelles.

### Accessibilité

Lien d'évitement, hiérarchie de titres cohérente, `aria-current` dans le fil d'Ariane, focus visible très contrasté, `prefers-reduced-motion` respecté, thème sombre automatique. Le quiz utilise des radios natifs dans un `fieldset` ; le retour est annoncé dans une région `aria-live`, le focus est déplacé à chaque étape, et la justesse d'une réponse est signalée par un texte et une icône, pas seulement par la couleur.

## Ajouter du contenu

Le plus simple est de copier un fichier existant. Le nom du fichier **est** le slug, et il doit être identique au champ `slug`.

### Un concept

Créer `content/fr/concepts/mon-concept.md` (modèle : `content/fr/concepts/anticipation.md`) :

```markdown
---
title: Mon concept
description: "Une phrase pour les moteurs de recherche (200 caractères max.)."
slug: mon-concept
locale: fr
translationKey: concept-mon-concept
summary: Introduction affichée en tête de page et sur les cartes.
order: 3 # facultatif, ordre d'affichage
draft: true # passer à false pour publier
updatedAt: 2026-11-02 # facultatif
sources: # facultatif
  - title: "Titre exact de la source"
    url: "https://…"
    publisher: Éditeur
    accessedAt: 2026-11-02
---

## Premier intertitre

Le corps commence aux titres de niveau 2 (`##`) : le titre de page est déjà un h1.
```

### Une page « mobilité »

Même format que les concepts, dans `content/fr/mobilites/` (modèle : `cycliste.md`).

### Un article

Fichier `content/fr/articles/mon-article.md` (modèle : `presentation-du-mouvement.md`). Champs en plus : `publishedAt` (obligatoire), `author`, `tags`, et `image` + `imageAlt` (obligatoires ensemble ; l'image se place dans `public/images/…` et se référence par `/images/…`).

### Un quiz

Fichier `content/fr/parcours/mon-quiz.json` (modèle : `partager-un-carrefour.json`). Chaque question contient des `options` (au moins 2), un `correctOptionId` qui doit exister parmi les options, et une `explanation`. Les `results` sont des seuils `minScore` ; l'un d'eux doit valoir `0`.

### Règles éditoriales

Ton positif, concret, jamais moralisateur. **Aucune statistique, citation, source, URL ou témoignage inventé.** Si une affirmation demande une source et qu'on ne l'a pas encore, on laisse `<!-- TODO: source à trouver -->`. Avant de publier : `grep -rn "TODO: source" content/`.

## Traductions

### Publier une traduction

Créer le fichier dans `content/en/<section>/` avec **la même `translationKey`** que l'original. Le slug peut différer (`cycliste` → `cyclist`). Le sélecteur de langue, les `hreflang` et le sitemap s'en servent automatiquement. Exemple : `content/en/concepts/anticipation.md`.

### Ajouter une langue

1. Ajouter le code dans `locales` et `localeMeta` (`src/lib/i18n/config.ts`).
2. Créer `src/lib/i18n/dictionaries/<code>.ts`, typé `Dictionary`, et l'enregistrer dans `get-dictionary.ts`.
3. Ajouter le texte des mentions légales dans `src/app/[locale]/mentions-legales/page.tsx`.
4. Créer `content/<code>/…` pour les contenus traduits.

TypeScript signale toute clé manquante dans le dictionnaire.

## Domaine public

Le domaine se configure à un seul endroit : `src/lib/seo/site.ts`, qui lit la variable `NEXT_PUBLIC_SITE_URL` (voir `.env.example`).
**Tant qu'elle n'est pas définie, le site utilise `https://gentlemobiliste.example`**, un domaine réservé qui n'est pas publiable : les URL canoniques, `hreflang`, le sitemap et robots.txt pointeraient vers ce domaine. Il faut donc la définir dans l'environnement de build de production avant toute mise en ligne.

## Déploiement

N'importe quelle plateforme Node compatible avec Next.js convient. Sur Vercel :

1. Importer le dépôt Git (preset Next.js détecté automatiquement, build `pnpm build`).
2. Définir `NEXT_PUBLIC_SITE_URL` pour l'environnement Production.
3. Compléter les mentions légales (`[À compléter]`) avant d'ouvrir le site au public.

Aucune fonctionnalité propriétaire n'est utilisée et le site ne dépend d'aucun serveur dynamique : toutes les pages sont générées au build.

## Points en attente

- Mentions légales : éditeur, directeur ou directrice de la publication, hébergeur et contact à compléter.
- Domaine de production à définir.
- Sources à trouver (marqueurs `TODO` dans `content/`).
- Image Open Graph par défaut à créer (aucune pour l'instant).
