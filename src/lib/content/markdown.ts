import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export type Heading = { id: string; text: string; level: 2 | 3 };

// Le HTML brut du Markdown (dont les commentaires `<!-- TODO -->`) n'est pas
// rendu : remark-rehype l'ignore par défaut, ce qui évite aussi toute injection.
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeStringify);

const HEADING_PATTERN = /<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g;

const stripTags = (html: string): string => {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&#x26;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .trim();
};

/** Convertit le Markdown en HTML (au build) et extrait les titres h2/h3 pour le sommaire. */
export const renderMarkdown = async (
  markdown: string,
): Promise<{ html: string; headings: Heading[] }> => {
  const html = String(await processor.process(markdown));
  const headings = [...html.matchAll(HEADING_PATTERN)].map(
    ([, level, id, inner]) => ({
      id: id ?? "",
      text: stripTags(inner ?? ""),
      level: level === "2" ? (2 as const) : (3 as const),
    }),
  );
  return { html, headings };
};
