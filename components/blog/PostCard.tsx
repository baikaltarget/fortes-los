import Link from "next/link";
import { CATEGORIES, fmtDate, type Post } from "@/lib/blog";

/** Карточка статьи: обложка, тема, заголовок, анонс, дата · время чтения · «Читать». */
export default function PostCard({ p, headingLevel = 2, big = false, eager = false }: { p: Post; headingLevel?: 2 | 3; big?: boolean; eager?: boolean }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className={`card overflow-hidden flex flex-col group hover:shadow-card transition-shadow ${big ? "md:col-span-2 lg:col-span-3 lg:grid lg:grid-cols-[1.25fr_1fr]" : ""}`}>
      <Link href={`/blog/${p.slug}/`} className="block overflow-hidden bg-page" tabIndex={-1} aria-hidden>
        <img src={p.image} alt="" width={1200} height={630} loading={eager ? "eager" : "lazy"} className={`w-full object-cover aspect-[1200/630] group-hover:scale-[1.02] transition-transform duration-300 ${big ? "lg:h-full lg:aspect-auto" : ""}`} />
      </Link>
      <div className={`flex flex-col flex-1 p-5 md:p-6 ${big ? "lg:p-10 lg:justify-center" : ""}`}>
        <Link href={`/blog/tema/${p.category}/`} className="self-start text-[13px] font-bold uppercase tracking-wide text-brand hover:underline">{CATEGORIES[p.category].short}</Link>
        <H className={`mt-2 ${big ? "text-2xl md:text-[32px] leading-tight" : "text-[19px] leading-snug"}`}>
          <Link href={`/blog/${p.slug}/`} className="hover:text-brand">{p.h1}</Link>
        </H>
        <p className="mt-2 text-[15px] text-ink/75 leading-relaxed">{p.excerpt}</p>
        <div className="mt-auto pt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
          <time dateTime={p.date}>{fmtDate(p.date)}</time>
          <span aria-hidden>·</span>
          <span>{p.minutes} мин чтения</span>
          <Link href={`/blog/${p.slug}/`} className="ml-auto text-brand font-bold text-[14px] hover:underline" aria-label={`Читать: ${p.h1}`}>Читать →</Link>
        </div>
      </div>
    </article>
  );
}
