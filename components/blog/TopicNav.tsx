import Link from "next/link";
import { CATEGORIES, getPosts, postsByCategory, usedCategories, type CategoryKey } from "@/lib/blog";

/** Фильтр по темам — обычные ссылки на статические страницы /blog/tema/<тема>/. */
export default function TopicNav({ active }: { active?: CategoryKey }) {
  const base = "inline-flex items-center gap-2 rounded-btn px-4 h-10 text-[15px] font-medium border whitespace-nowrap";
  return (
    <nav aria-label="Темы блога" className="mt-6 -mx-4 px-4 overflow-x-auto">
      <ul className="flex gap-2 pb-1">
        <li><Link href="/blog/" className={`${base} ${!active ? "bg-ink text-white border-ink" : "bg-card border-line hover:border-ink"}`} aria-current={!active ? "page" : undefined}>Все <span className="opacity-60">{getPosts().length}</span></Link></li>
        {usedCategories().map((c) => (
          <li key={c}><Link href={`/blog/tema/${c}/`} className={`${base} ${active === c ? "bg-ink text-white border-ink" : "bg-card border-line hover:border-ink"}`} aria-current={active === c ? "page" : undefined}>{CATEGORIES[c].short} <span className="opacity-60">{postsByCategory(c).length}</span></Link></li>
        ))}
      </ul>
    </nav>
  );
}
