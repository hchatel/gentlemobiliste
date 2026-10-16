import type { Heading } from "@/lib/content/markdown";

type TableOfContentsProps = { headings: readonly Heading[]; label: string };

export const TableOfContents = ({ headings, label }: TableOfContentsProps) => {
  if (headings.length < 2) return null;
  return (
    <nav
      aria-labelledby="toc-title"
      className="rounded-xl border border-border bg-surface p-5 text-sm"
    >
      <h2
        id="toc-title"
        className="mb-3 font-sans text-sm font-semibold tracking-wide uppercase"
      >
        {label}
      </h2>
      <ol className="space-y-1.5">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? "pl-4" : undefined}
          >
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
};
