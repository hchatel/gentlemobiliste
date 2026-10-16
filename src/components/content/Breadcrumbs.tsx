import Link from "next/link";

import { JsonLd } from "@/components/seo/JsonLd";
import { type BreadcrumbItem, breadcrumbJsonLd } from "@/lib/seo/json-ld";

type BreadcrumbsProps = { items: readonly BreadcrumbItem[]; label: string };

/** Fil d'Ariane visible + données structurées BreadcrumbList correspondantes. */
export const Breadcrumbs = ({ items, label }: BreadcrumbsProps) => {
  return (
    <nav aria-label={label} className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="text-ink">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.path}>{item.name}</Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd data={breadcrumbJsonLd(items)} />
    </nav>
  );
};
