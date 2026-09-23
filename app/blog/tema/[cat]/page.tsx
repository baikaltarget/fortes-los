import Link from "next/link";
import { notFound } from "next/navigation";
import { meta } from "@/lib/seo";
import { CATEGORIES, categoryPath, postsByCategory, usedCategories, type CategoryKey } from "@/lib/blog";
import BlogListing from "@/components/blog/BlogListing";

const TOPIC: Record<CategoryKey, { title: string; description: string; h1: string; lead: string }> = {
  kanalizaciya: { title: "Статьи о септиках и автономной канализации в Иркутске", description: "Как выбрать септик для дома в Иркутске, сколько он стоит, правда ли «без откачки», нормы расстояний, зимовка станции и грунтовые воды — без маркетинга.", h1: "Статьи о септиках и автономной канализации", lead: "Выбор станции, цены под ключ, нормы расстояний, зимовка и высокие грунтовые воды — то, что спрашивают на замере в Иркутском районе." },
  otoplenie: { title: "Статьи об отоплении частного дома в Иркутске", description: "Сколько стоит отопление дома в Иркутске, тёплый пол или радиаторы, какой котёл без газа — статьи прораба Фортес с ценами из смет.", h1: "Статьи об отоплении частного дома", lead: "Цены за метр под ключ, тёплый пол и радиаторы, котлы для района без газа." },
  ventilyaciya: { title: "Статьи о вентиляции частного дома в Иркутске", description: "Нужна ли приточно-вытяжная вентиляция с рекуперацией в Сибири, клапаны, вытяжки и бризеры — разбираем для домов в Иркутском районе.", h1: "Статьи о вентиляции частного дома", lead: "Почему в новом доме душно и когда рекуператор окупается при −35 °C." },
  burenie: { title: "Статьи о бурении скважин в Иркутском районе", description: "Какой глубины скважина в посёлках Иркутского района, конструкции, обустройство и цены — статьи прораба Фортес.", h1: "Статьи о бурении скважин на воду", lead: "Глубины по посёлкам, конструкции обсадки и обустройство скважины." },
  vodosnabzhenie: { title: "Статьи о водоснабжении частного дома в Иркутске", description: "Разводка воды в доме: коллектор или тройники, полипропилен или PEX, горячая вода и рециркуляция — с ценами за точку.", h1: "Статьи о водоснабжении частного дома", lead: "Разводка, трубы, бойлеры и узел ввода — что закладывать до стяжки." },
  elektrika: { title: "Статьи об электрике в частном доме в Иркутске", description: "Электрика под электроотопление, лимит 15 кВт на 380 В, щит, заземление и резервное питание — статьи прораба Фортес.", h1: "Статьи об электрике в частном доме", lead: "Как уложиться в лимит мощности с электрокотлом и что ставить в щит." },
  dom: { title: "Статьи об инженерных сетях дома под ключ", description: "В каком порядке делать скважину, воду, септик, отопление, вентиляцию и электрику в новом доме — сроки этапов и частые ошибки.", h1: "Инженерные сети дома целиком", lead: "Порядок работ, сроки и стыки между системами." },
};

export const dynamicParams = false;
export function generateStaticParams() { return usedCategories().map((cat) => ({ cat })); }
export function generateMetadata({ params }: { params: { cat: string } }) {
  const t = TOPIC[params.cat as CategoryKey]; if (!t) return {};
  return meta({ title: t.title, description: t.description, path: categoryPath(params.cat) });
}

export default function Page({ params }: { params: { cat: string } }) {
  const c = params.cat as CategoryKey;
  const t = TOPIC[c]; const posts = postsByCategory(c);
  if (!t || !posts.length) notFound();
  const cat = CATEGORIES[c];
  return (
    <BlogListing posts={posts} active={c} path={categoryPath(c)} h1={t.h1} lead={t.lead}
      crumbs={[{ name: "Статьи", href: "/blog/" }, { name: cat.name, href: categoryPath(c) }]}>
      <div className="mt-5 flex flex-wrap gap-3 text-[15px]">
        <Link href={cat.hub} className="text-brand underline underline-offset-2">Раздел «{cat.name}» →</Link>
        <Link href={cat.calc} className="text-brand underline underline-offset-2">{cat.calcText} →</Link>
      </div>
    </BlogListing>
  );
}
