import Link from "next/link";
import { meta } from "@/lib/seo";
import { getPosts } from "@/lib/blog";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadSection from "@/components/LeadSection";

export const metadata = meta({ title: "Статьи о септиках и автономной канализации — выбор, цены, нормы | Фортес", description: "Как выбрать септик для дома в Иркутске, сколько он стоит, правда ли «без откачки», нормы расстояний, зимовка станции — разбираем без маркетинга.", path: "/blog/" });

export default function Page() {
  const posts = getPosts();
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Статьи", href: "/blog/" }]} />
        <h1>Разбираемся в септиках</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">Отвечаем на вопросы, которые задают на замере. Без маркетинга — с цифрами и нормами.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}/`} className="card p-6 hover:shadow-card block">
              <h2 className="text-xl">{p.h1}</h2>
              <p className="mt-2 text-[15px] text-ink/75 leading-relaxed">{p.excerpt}</p>
              <div className="mt-3 text-[13px] text-muted">{new Date(p.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</div>
            </Link>
          ))}
        </div>
      </div>
      <LeadSection source="блог" />
    </>
  );
}
