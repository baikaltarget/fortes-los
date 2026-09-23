import { meta } from "@/lib/seo";
import { pageCount, postsPage } from "@/lib/blog";
import BlogListing from "@/components/blog/BlogListing";

export const metadata = meta({
  title: "Блог Фортес: септики, отопление, скважины, вода и электрика в доме",
  description: "Статьи прораба Фортес об инженерных системах частного дома в Иркутске: цены из реальных смет, нормы, глубины скважин по посёлкам, выбор септика и котла.",
  path: "/blog/",
});

export default function Page() {
  return (
    <BlogListing
      posts={postsPage(1)} page={1} total={pageCount()} featured path="/blog/"
      h1="Инженерные системы частного дома: разбираемся с прорабом"
      lead="Отвечаем на вопросы, которые задают на замере: сколько стоит, какой глубины, что выбрать и в каком порядке делать. С цифрами из смет и нормами — для Иркутска и Иркутского района."
      crumbs={[{ name: "Статьи", href: "/blog/" }]}
    />
  );
}
