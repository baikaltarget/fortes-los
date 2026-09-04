import Link from "next/link";
import JsonLd from "./JsonLd";
import { ldBreadcrumbs, type Crumb } from "@/lib/seo";

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ name: "Главная", href: "/" }, ...items];
  return (
    <nav aria-label="Хлебные крошки" className="text-[14px] text-muted py-4">
      <JsonLd data={ldBreadcrumbs(all)} />
      <ol className="flex flex-wrap gap-x-2 gap-y-1">
        {all.map((c, i) => (
          <li key={c.href} className="flex items-center gap-2">
            {i < all.length - 1 ? (
              <Link href={c.href} className="hover:text-ink">{c.name}</Link>
            ) : (
              <span className="text-ink" aria-current="page">{c.name}</span>
            )}
            {i < all.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
