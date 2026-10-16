import type { Dictionary } from "./fr";

export const en: Dictionary = {
  site: {
    name: "Gentlemobiliste",
    tagline: "Each our own way. All the same street.",
    description:
      "Gentlemobiliste is a movement offering simple habits to share the street better, whatever way we get around.",
  },
  a11y: {
    skipToContent: "Skip to main content",
    mainNav: "Main navigation",
    breadcrumbs: "Breadcrumb",
    tableOfContents: "Contents",
    languageSwitcher: "Choose language",
    openInNewTab: "(opens in a new tab)",
  },
  theme: {
    toDark: "Dark mode",
    toLight: "Light mode",
  },
  nav: {
    home: "Home",
    concepts: "Concepts",
    mobilites: "Ways to travel",
    articles: "Articles",
    parcours: "Quizzes",
    legal: "Legal notice",
  },
  language: {
    current: "Current language",
    notTranslated: "not translated yet",
    goToHome: (label: string) => `Go to the home page (${label})`,
  },
  home: {
    title: "Sharing the street better, starting with what is within our reach",
    lead: "On foot in the morning, cycling at noon, driving in the evening: we switch roles several times a day. Gentlemobiliste suggests concrete habits to travel more calmly, and make the street nicer for everyone along the way.",
    primaryCta: "Explore the concepts",
    secondaryCta: "Try a quiz",
    cooperation: {
      title: "Cooperating also makes life easier for you",
      paragraphs: [
        "Leaving some margin, making your intentions readable, anticipating what others will do: these are not sacrifices. They reduce surprises, and therefore tense moments, and make the trip more pleasant for you first.",
        "Behaviour does not replace good infrastructure or sensible rules. It simply acts where each of us can act today, alongside collective choices.",
      ],
    },
    conceptsTitle: "Key ideas",
    conceptsIntro: "A few simple notions that change how you read the street.",
    mobilitesTitle: "Depending on how you travel",
    mobilitesIntro: "Guidance for each mode, with no ranking and no blame.",
    articlesTitle: "Reading",
    parcoursTitle: "Put your reflexes to the test",
    parcoursIntro:
      "Short interactive quizzes to ask yourself the right questions, with no grades.",
    seeAll: "See all",
  },
  concepts: {
    title: "Concepts",
    description:
      "The key ideas of the Gentlemobiliste movement to better read and share public space.",
    intro: "Simple ideas that apply whatever way you travel.",
    empty: "No concept has been published in English yet.",
  },
  mobilites: {
    title: "Ways to travel",
    description:
      "Guidance for each way of getting around: walking, cycling, driving and more.",
    intro:
      "Each mode has its constraints. Understanding other people’s helps everyone move better.",
    empty: "No page has been published in English yet.",
  },
  articles: {
    title: "Articles",
    description:
      "In-depth articles and posts from the Gentlemobiliste movement.",
    intro: "Analysis, experience and thoughts on sharing the street.",
    empty: "No article has been published in English yet.",
    publishedOn: "Published on",
    updatedOn: "Updated on",
    by: "By",
  },
  parcours: {
    title: "Quizzes",
    description:
      "Short quizzes to test and sharpen your reflexes in public space.",
    intro: "A few minutes, a few situations, and explanations at every step.",
    empty: "No quiz has been published in English yet.",
    questionsCount: (n: number) => `${n} question${n > 1 ? "s" : ""}`,
    start: "Start the quiz",
  },
  content: {
    sources: "Sources",
    accessedOn: "accessed on",
    draft: "Draft",
    draftNotice: "Draft: this page is only visible in development.",
    readMore: "Read",
  },
  quiz: {
    noscript:
      "This interactive quiz requires JavaScript. The questions remain readable below.",
    questionOf: (current: number, total: number) =>
      `Question ${current} of ${total}`,
    validate: "Check my answer",
    next: "Next question",
    seeResult: "See my result",
    restart: "Start again",
    correct: "Correct.",
    incorrect: "That is not the expected answer.",
    expected: "Expected answer:",
    chooseAnswer: "Choose an answer before checking.",
    resultTitle: "Your result",
    score: (score: number, total: number) =>
      `${score} correct answer${score > 1 ? "s" : ""} out of ${total}`,
  },
  legal: {
    title: "Legal notice",
    description: "Legal notice for the Gentlemobiliste website.",
  },
  notFound: {
    title: "Page not found",
    description:
      "This page does not exist, or no longer does. Here are a few places to start:",
    backHome: "Back to the home page",
  },
  footer: {
    about:
      "A movement to share the street and public space better, whatever way we travel.",
    noTracking: "This site uses no cookies and no trackers.",
  },
};
