import { notFound } from "next/navigation";
import { meta } from "@/lib/seo";
import { pageCount, pagePath, postsPage } from "@/lib/blog";
import BlogListing from "@/components/blog/BlogListing";

export const dynamicParams = false;
export function generateStaticParams() {
  return Array.from({ length: Math.max(0, pageCount() - 1) }, (_, i) => ({ n: String(i + 2) }));
}
export function generateMetadata({ params }: { params: { n: string } }) {
  const n = Number(params.n);
  return meta({
    title: `Блог Фортес об инженерных системах дома — страница ${n}`,
    description: `Статьи об отоплении, септиках, скважинах, воде и электрике в частном доме в Иркутске — страница ${n} из ${pageCount()}.`,
    path: pagePath(n),
  });
}

export default function Page({ params }: { params: { n: string } }) {
  const n = Number(params.n);
  if (!Number.isInteger(n) || n < 2 || n > pageCount()) notFound();
  return (
    <BlogListing
      posts={postsPage(n)} page={n} total={pageCount()} path={pagePath(n)}
      h1={`Статьи об инженерных системах дома — страница ${n}`}
      lead="Более ранние статьи блога: выбор и обслуживание септиков, нормы, зимовка станций."
      crumbs={[{ name: "Статьи", href: "/blog/" }, { name: `Страница ${n}`, href: pagePath(n) }]}
    />
  );
}
