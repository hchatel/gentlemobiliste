/**
 * Dictionnaire de référence : sa forme définit le type `Dictionary`.
 * Toute autre langue doit fournir exactement les mêmes clés.
 */
export const fr = {
  site: {
    name: "Gentlemobiliste",
    tagline: "Chacun sa route. Tous la même rue.",
    description:
      "Gentlemobiliste est un mouvement qui propose des gestes simples pour mieux partager la rue, quel que soit notre mode de déplacement.",
  },
  a11y: {
    skipToContent: "Aller au contenu principal",
    mainNav: "Navigation principale",
    breadcrumbs: "Fil d’Ariane",
    tableOfContents: "Sommaire",
    languageSwitcher: "Choisir la langue",
    openInNewTab: "(nouvel onglet)",
  },
  theme: {
    toDark: "Mode sombre",
    toLight: "Mode clair",
  },
  nav: {
    home: "Accueil",
    concepts: "Concepts",
    mobilites: "Mobilités",
    articles: "Articles",
    parcours: "Parcours",
    legal: "Mentions légales",
  },
  language: {
    current: "Langue actuelle",
    notTranslated: "pas encore traduit",
    goToHome: (label: string) => `Aller à l’accueil (${label})`,
  },
  home: {
    title: "Mieux partager la rue, en commençant par ce qui est à notre portée",
    lead: "Piéton le matin, cycliste à midi, automobiliste le soir : nous changeons de rôle plusieurs fois par jour. Gentlemobiliste propose des gestes concrets pour se déplacer plus sereinement, et rendre la rue plus agréable pour tout le monde au passage.",
    primaryCta: "Découvrir les concepts",
    secondaryCta: "Tester un parcours",
    cooperation: {
      title: "Coopérer, c’est aussi se faciliter la vie",
      paragraphs: [
        "Laisser de la marge, rendre ses intentions lisibles, anticiper ce que l’autre va faire : ces gestes ne sont pas des sacrifices. Ils réduisent les surprises, donc les situations tendues, et rendent le trajet plus agréable pour soi d’abord.",
        "Les comportements ne remplacent ni de bons aménagements ni des règles adaptées. Ils agissent simplement là où chacun peut agir dès aujourd’hui, en complément des choix collectifs.",
      ],
    },
    conceptsTitle: "Les idées clés",
    conceptsIntro:
      "Quelques notions simples qui changent la façon de lire la rue.",
    mobilitesTitle: "Selon votre façon de vous déplacer",
    mobilitesIntro:
      "Des repères adaptés à chaque mode, sans hiérarchie ni procès.",
    articlesTitle: "À lire",
    parcoursTitle: "Mettez vos réflexes à l’épreuve",
    parcoursIntro:
      "De courts parcours interactifs pour se poser les bonnes questions, sans note sanction.",
    seeAll: "Tout voir",
  },
  concepts: {
    title: "Concepts",
    description:
      "Les notions clés du mouvement Gentlemobiliste pour mieux lire et partager l’espace public.",
    intro:
      "Des idées simples, applicables quel que soit votre mode de déplacement.",
    empty: "Aucun concept publié pour le moment.",
  },
  mobilites: {
    title: "Mobilités",
    description:
      "Des repères pour chaque mode de déplacement : à pied, à vélo, en voiture et au-delà.",
    intro:
      "Chaque mode a ses contraintes. Comprendre celles des autres aide à mieux circuler.",
    empty: "Aucune page publiée pour le moment.",
  },
  articles: {
    title: "Articles",
    description: "Articles de fond et billets du mouvement Gentlemobiliste.",
    intro:
      "Analyses, retours d’expérience et réflexions sur le partage de la rue.",
    empty: "Aucun article publié pour le moment.",
    publishedOn: "Publié le",
    updatedOn: "Mis à jour le",
    by: "Par",
  },
  parcours: {
    title: "Parcours",
    description:
      "Des quiz courts pour tester et affiner ses réflexes dans l’espace public.",
    intro:
      "Quelques minutes, quelques situations, et des explications à chaque étape.",
    empty: "Aucun parcours publié pour le moment.",
    questionsCount: (n: number) => `${n} question${n > 1 ? "s" : ""}`,
    start: "Commencer le parcours",
  },
  content: {
    sources: "Sources",
    accessedOn: "consulté le",
    draft: "Brouillon",
    draftNotice: "Brouillon : cette page n’est visible qu’en développement.",
    readMore: "Lire",
  },
  quiz: {
    noscript:
      "Ce parcours interactif nécessite JavaScript. Les questions restent lisibles ci-dessous.",
    questionOf: (current: number, total: number) =>
      `Question ${current} sur ${total}`,
    validate: "Valider ma réponse",
    next: "Question suivante",
    seeResult: "Voir le résultat",
    restart: "Recommencer",
    correct: "Bonne réponse.",
    incorrect: "Ce n’est pas la réponse attendue.",
    expected: "Réponse attendue :",
    chooseAnswer: "Choisissez une réponse avant de valider.",
    resultTitle: "Votre résultat",
    score: (score: number, total: number) =>
      `${score} bonne${score > 1 ? "s" : ""} réponse${score > 1 ? "s" : ""} sur ${total}`,
  },
  legal: {
    title: "Mentions légales",
    description: "Mentions légales du site Gentlemobiliste.",
  },
  notFound: {
    title: "Page introuvable",
    description:
      "Cette page n’existe pas, ou plus. Voici quelques points de départ :",
    backHome: "Revenir à l’accueil",
  },
  footer: {
    about:
      "Un mouvement pour mieux partager la rue et l’espace public, quel que soit notre mode de déplacement.",
    noTracking: "Ce site n’utilise ni cookie ni traceur.",
  },
};

type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => R
    : T extends readonly (infer U)[]
      ? Widen<U>[]
      : { [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof fr>;
