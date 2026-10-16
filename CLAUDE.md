@AGENTS.md

# Gentlemobiliste : repères pour le développement assisté

## Le mouvement

Gentlemobiliste aide à mieux partager la rue et l'espace public : piétons, cyclistes, automobilistes, motards, trottinettes et EDPM, bref tous ceux qui se déplacent. Chacun change de rôle plusieurs fois par jour.

Idée centrale : coopérer n'est pas un sacrifice. Anticiper, laisser de la marge, rendre ses intentions lisibles améliore d'abord **sa propre** sécurité, sa sérénité et son plaisir de se déplacer, et rend la rue plus agréable pour les autres. Le mouvement n'oppose jamais responsabilité individuelle et amélioration du système : infrastructures, règles et décisions publiques restent essentielles, et on agit en parallèle sur ce qui est à notre portée.

Signature : « Chacun sa route. Tous la même rue. », à utiliser avec parcimonie (accueil, pied de page).

Ton : positif, accessible, intelligent ; drôle sans être caricatural ; bienveillant sans être naïf ; concret et tourné vers l'action ; inclusif, sans culpabiliser. Jamais moralisateur, agressif ni donneur de leçons. Ni clichés hippies, ni jargon de développement personnel.

## Interdits éditoriaux

- Ne jamais inventer de statistique, citation, étude, source, URL, témoignage ou partenaire.
- Ne citer que des sources réellement consultées. Sinon, écrire `<!-- TODO: source à trouver -->` à l'endroit concerné.
- Ne déclarer aucune information fictive sur l'organisation (adresse, réseaux sociaux, contact) dans le JSON-LD ou les mentions légales.
- Pas de FAQ artificielle ni de « SEO pour LLM ».

## Principes techniques

- **Statique d'abord** : toutes les pages sont générées au build (`generateStaticParams` + `dynamicParams = false`). `cacheComponents` est volontairement désactivé. Pas de `output: 'export'`, pas de middleware/proxy.
- **Server Components par défaut.** Les Client Components sont réservés à l'interactivité réelle (aujourd'hui, uniquement `components/quizzes/Quiz.tsx` et `components/layout/ThemeToggle.tsx`). On ne passe jamais de fonction à un composant client.
- **Sobriété** : pas de dépendance lourde, pas de bibliothèque d'icônes ou d'animation, polices système, aucun traceur ni analytics, images locales via `next/image`.
- **Accessibilité WCAG 2.2 AA / RGAA** : HTML sémantique, titres hiérarchisés, focus visible, contrastes, `prefers-reduced-motion`, information jamais portée par la seule couleur.
- **SEO** : métadonnées via `buildPageMetadata` (`lib/seo/metadata.ts`), JSON-LD via `lib/seo/json-ld.ts`, domaine centralisé dans `lib/seo/site.ts` (`NEXT_PUBLIC_SITE_URL`).
- TypeScript strict (`noUncheckedIndexedAccess`), pas de `any` ni d'erreur masquée.

## Conventions du projet

- **Routes** : tout est sous `src/app/[locale]/`. Les segments de section (`concepts`, `mobilites`, `articles`, `parcours`, `mentions-legales`) ne sont pas traduits ; seuls les slugs de contenu peuvent varier. Les chemins se construisent avec `localizedPath()` (`lib/i18n/paths.ts`).
- **i18n** : langues dans `lib/i18n/config.ts`. Les textes d'interface vont dans `lib/i18n/dictionaries/{fr,en}.ts` (fr fait référence), jamais en dur dans les composants. Les traductions d'un contenu sont reliées par `translationKey` ; une traduction peut manquer, et le sélecteur de langue doit le gérer.
- **Contenus** : `content/<locale>/<section>/<slug>.md` (frontmatter validé par Zod dans `lib/content/schemas.ts`) ; les quiz sont dans `content/<locale>/parcours/<slug>.json` (`lib/quiz/schema.ts`). Le nom de fichier doit être égal au `slug`. Les dates sont au format `YYYY-MM-DD` et s'affichent avec `Intl.DateTimeFormat`. Dans le corps Markdown, les titres commencent au niveau `##`.
- **Logique pure et testée** dans `lib/content/queries.ts` et `lib/quiz/score.ts` ; l'accès disque est isolé dans `lib/content/loader.ts` (`server-only`).
- Pages de détail : réutiliser `EditorialPage` et `PageHeader` plutôt que dupliquer le balisage.

## Vérifications

```bash
pnpm typecheck && pnpm lint && pnpm format:check && pnpm test && pnpm build
```

Node ≥ 20.9 requis (développé avec Node 24) : avec une version plus ancienne, `pnpm` lui-même échoue. Vérifier `node -v` avant de lancer les commandes.

Ne jamais déclarer une vérification réussie sans l'avoir exécutée.
