import { notFound } from "next/navigation";
import Link from "next/link";
import { meta, ldArticle } from "@/lib/seo";
import { getPosts, getPost } from "@/lib/blog";
import { SITE } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import LeadSection from "@/components/LeadSection";
import ProductGrid from "@/components/ProductGrid";

export const dynamicParams = false;
export function generateStaticParams() { return getPosts().map((p) => ({ slug: p.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug); if (!p) return {};
  return meta({ title: p.title, description: p.description, path: `/blog/${p.slug}/`, type: "article" });
}

export default function Page({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug); if (!p) notFound();
  const others = getPosts().filter((x) => x.slug !== p.slug).slice(0, 3);
  return (
    <>
      <JsonLd data={ldArticle({ title: p.h1, description: p.description, path: `/blog/${p.slug}/`, date: p.date })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Статьи", href: "/blog/" }, { name: p.h1, href: `/blog/${p.slug}/` }]} />
        <article className="grid gap-8 lg:grid-cols-[1fr_320px] items-start">
          <div>
            <h1>{p.h1}</h1>
            <div className="mt-3 text-[14px] text-muted">{new Date(p.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })} · Фортес, Иркутск</div>
            <div className="prose-site mt-6" dangerouslySetInnerHTML={{ __html: p.html }} />
          </div>
          <aside className="lg:sticky lg:top-24 grid gap-4">
            <div className="card p-6">
              <h3>Ещё по теме</h3>
              <ul className="mt-3 space-y-3 text-[15px]">
                {others.map((o) => <li key={o.slug}><Link href={`/blog/${o.slug}/`} className="hover:text-brand font-medium">{o.h1}</Link></li>)}
              </ul>
            </div>
            <div className="card p-6 bg-ink text-white">
              <div className="font-bold text-lg">Подобрать станцию за минуту</div>
              <p className="mt-1 text-white/75 text-[14px]">Калькулятор по числу жильцов и грунту.</p>
              <Link href="/kalkulyator/" className="btn-primary mt-4 w-full">Открыть калькулятор</Link>
            </div>
          </aside>
        </article>
      </div>
      <ProductGrid slugs={SITE.topPicks} title="Станции, о которых идёт речь" />
      <LeadSection source={`статья ${p.slug}`} />
    </>
  );
}
