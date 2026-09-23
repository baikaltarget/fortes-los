import Link from "next/link";
import { pagePath } from "@/lib/blog";

export default function Pagination({ page, total }: { page: number; total: number }) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const cls = "min-w-11 h-11 px-3 inline-flex items-center justify-center rounded-btn text-[15px] font-bold";
  return (
    <nav aria-label="Страницы блога" className="mt-10 flex flex-wrap items-center gap-2">
      {page > 1 ? <Link href={pagePath(page - 1)} rel="prev" className={`${cls} bg-card hover:bg-ink hover:text-white`}>← Новее</Link> : null}
      {pages.map((n) => n === page
        ? <span key={n} aria-current="page" className={`${cls} bg-ink text-white`}>{n}</span>
        : <Link key={n} href={pagePath(n)} className={`${cls} bg-card hover:bg-ink hover:text-white`}>{n}</Link>)}
      {page < total ? <Link href={pagePath(page + 1)} rel="next" className={`${cls} bg-card hover:bg-ink hover:text-white`}>Старше →</Link> : null}
    </nav>
  );
}
