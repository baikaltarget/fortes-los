import { notFound } from "next/navigation";
import Link from "next/link";
import { meta, ldArticle, ldFaq } from "@/lib/seo";
import { AUTHORS, CATEGORIES, authorPath, categoryPath, fmtDate, getPost, getPosts, neighbours, relatedTo, type AuthorKey } from "@/lib/blog";
import { SITE } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import LeadSection from "@/components/LeadSection";
import ProductGrid from "@/components/ProductGrid";
import PostCard from "@/components/blog/PostCard";
import AuthorBadge, { AuthorBox } from "@/components/blog/AuthorBadge";

export const dynamicParams = false;
export function generateStaticParams() { return getPosts().map((p) => ({ slug: p.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug); if (!p) return {};
  return meta({ title: p.title, description: p.description, path: `/blog/${p.slug}/`, type: "article", image: p.image });
}

export default function Page({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug); if (!p) notFound();
  const cat = CATEGORIES[p.category];
  const a = AUTHORS[p.author as AuthorKey] || AUTHORS["egor-zybarev"];
  const { newer, older } = neighbours(p);
  const related = relatedTo(p, 3);
  const path = `/blog/${p.slug}/`;
  const updated = p.updated !== p.date;
  return (
    <>
      <JsonLd data={ldArticle({ title: p.h1, description: p.description, path, date: p.date, updated: p.updated, image: p.image, section: cat.name, words: p.words, author: { name: a.name, role: a.role, path: authorPath(p.author), image: (a as { photo?: string }).photo } })} />
      {p.faq.length > 0 && <JsonLd data={ldFaq(p.faq)} />}
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Статьи", href: "/blog/" }, { name: cat.name, href: categoryPath(p.category) }, { name: p.h1, href: path }]} />
        <article className="grid gap-8 lg:gap-12 lg:grid-cols-[minmax(0,1fr)_300px] items-start">
          <div className="min-w-0">
            <Link href={categoryPath(p.category)} className="text-[13px] font-bold uppercase tracking-wide text-brand hover:underline">{cat.name}</Link>
            <h1 className="mt-2 max-w-[24ch]">{p.h1}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <AuthorBadge k={p.author} />
              <div className="text-[14px] text-muted leading-snug">
                <div>Опубликовано <time dateTime={p.date}>{fmtDate(p.date)}</time></div>
                {updated && <div>Обновлено <time dateTime={p.updated}>{fmtDate(p.updated)}</time></div>}
              </div>
              <div className="text-[14px] text-muted">{p.minutes} мин чтения</div>
            </div>

            <img src={p.image} alt={p.imageAlt} width={1200} height={630} className="mt-6 w-full aspect-[1200/630] object-cover rounded-card bg-page" />

            {p.answer && (
              <section className="mt-6 card p-5 md:p-7 border-l-4 border-brand" aria-label="Коротко">
                <div className="text-[13px] font-bold uppercase tracking-wide text-brand">Коротко</div>
                <p className="mt-2 text-[17px] md:text-[18px] leading-relaxed text-ink">{p.answer}</p>
              </section>
            )}

            {p.toc.length > 2 && (
              <details className="lg:hidden mt-4 card px-5 py-4">
                <summary className="font-bold cursor-pointer">Содержание</summary>
                <ol className="mt-3 space-y-2 text-[15px] list-decimal pl-5">
                  {p.toc.map((t) => <li key={t.id}><a href={`#${t.id}`} className="hover:text-brand">{t.text}</a></li>)}
                </ol>
              </details>
            )}

            <div className="prose-site mt-8" dangerouslySetInnerHTML={{ __html: p.html }} />

            {p.faq.length > 0 && (
              <section className="mt-10" aria-labelledby="faq">
                <h2 id="faq" className="mb-5">Частые вопросы</h2>
                <div className="grid gap-3">
                  {p.faq.map((f) => (
                    <details key={f.q} className="faq card px-5 md:px-6 py-4 group">
                      <summary className="flex items-center justify-between gap-4 font-bold text-[17px]">
                        <span>{f.q}</span>
                        <span className="faq-icon shrink-0 w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center text-xl leading-none transition-transform" aria-hidden>+</span>
                      </summary>
                      <p className="pt-3 text-ink/85 leading-relaxed max-w-[70ch]">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            <AuthorBox k={p.author} />

            <nav aria-label="Соседние статьи" className="mt-6 grid gap-3 sm:grid-cols-2">
              {older ? (
                <Link href={`/blog/${older.slug}/`} className="card p-5 hover:shadow-card block">
                  <span className="text-[13px] text-muted">← Предыдущая статья</span>
                  <span className="mt-1 block font-bold leading-snug">{older.h1}</span>
                </Link>
              ) : <span />}
              {newer ? (
                <Link href={`/blog/${newer.slug}/`} className="card p-5 hover:shadow-card block sm:text-right">
                  <span className="text-[13px] text-muted">Следующая статья →</span>
                  <span className="mt-1 block font-bold leading-snug">{newer.h1}</span>
                </Link>
              ) : null}
            </nav>
          </div>

          <aside className="lg:sticky lg:top-28 grid gap-4">
            {p.toc.length > 2 && (
              <nav className="hidden lg:block card p-6" aria-label="Содержание статьи">
                <div className="font-bold text-[17px]">Содержание</div>
                <ol className="mt-3 space-y-2 text-[15px] list-decimal pl-5 marker:text-muted">
                  {p.toc.map((t) => <li key={t.id}><a href={`#${t.id}`} className="hover:text-brand leading-snug">{t.text}</a></li>)}
                  {p.faq.length > 0 && <li><a href="#faq" className="hover:text-brand">Частые вопросы</a></li>}
                </ol>
              </nav>
            )}
            <div className="card p-6 bg-ink text-white">
              <div className="font-bold text-lg">{cat.calcText}</div>
              <p className="mt-1 text-white/75 text-[14px]">Ориентир цены под ключ за минуту. Точную смету инженер составит бесплатно на выезде.</p>
              <Link href={cat.calc} className="btn-primary mt-4 w-full">Открыть калькулятор</Link>
            </div>
            <Link href={cat.hub} className="card p-5 hover:shadow-card block">
              <span className="text-[13px] text-muted">Раздел</span>
              <span className="mt-1 block font-bold">{cat.name} в Иркутске →</span>
            </Link>
          </aside>
        </article>
      </div>

      {related.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container-site">
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6"><h2>Читайте также</h2><Link href="/blog/" className="text-brand underline underline-offset-2 text-[15px]">Все статьи</Link></div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => <PostCard key={r.slug} p={r} headingLevel={3} />)}
            </div>
          </div>
        </section>
      )}
      {p.category === "kanalizaciya" && <ProductGrid slugs={SITE.topPicks} title="Станции, о которых идёт речь" />}
      <LeadSection source={`статья ${p.slug}`} />
    </>
  );
}
