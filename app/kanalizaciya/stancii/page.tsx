import { meta } from "@/lib/seo";
import { products, brands, productsByBrand, P } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import LeadSection from "@/components/LeadSection";
import RelatedPosts, { RELATED_POSTS } from "@/components/RelatedPosts";
import FAQ from "@/components/FAQ";
import Link from "next/link";

export const metadata = meta({
  title: "Станции биологической очистки в Иркутске — Novo Eko, Zörde, Kolo Vesi, цены",
  description: "Каталог станций биологической очистки для частного дома в Иркутске: Novo Eko 3/5/8, Zörde 4/7, Kolo Vesi 3/5/8. Цены завода, характеристики, подбор по числу жильцов. Официальный дилер.",
  path: P.stancii,
});

const faq = [
  { q: "Чем отличаются Novo Eko, Zörde и Kolo Vesi?", a: "Все три — продукция одного завода в Санкт-Петербурге. Novo Eko — оптимум по цене, создана для сезонного проживания и сложных грунтов. Zörde — европейские материалы и обслуживание раз в два года. Kolo Vesi — флагман с пятью камерами и итальянскими насосами." },
  { q: "Что такое условные пользователи?", a: "Расчётная нагрузка 200 литров стоков на человека в сутки. Станция «на 5» — это 1000 литров в сутки." },
  { q: "Что означают Midi и Long?", a: "Удлинённая горловина на 0,5 и 1 м для заглубления станции под глубокий выход трубы из дома." },
];

export default function Page() {
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Канализация", href: P.hub }, { name: "Станции", href: P.stancii }]} />
        <h1>Станции биологической очистки в Иркутске</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">Вся линейка завода Kolo Vesi по ценам завода. Три самые заказываемые модели — первые в списке. Не знаете, что выбрать — <Link href="/kalkulyator/" className="text-brand underline">калькулятор подбора</Link> за минуту.</p>
      </div>
      {brands.map((b) => (
        <section key={b.slug} className="py-10 md:py-14">
          <div className="container-site">
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
              <h2>{b.name}</h2>
              <Link href={P.page(b.slug)} className="text-brand underline underline-offset-2 text-[15px]">О линейке {b.name}</Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {productsByBrand(b.slug).map((p) => <ProductCard key={p.slug} p={p} />)}
            </div>
          </div>
        </section>
      ))}
      <section className="py-6"><div className="container-site card p-6 md:p-8">
        <h2 className="text-2xl">Нужно больше: 10–60 пользователей или посёлок</h2>
        <p className="mt-2 text-ink/80 max-w-[70ch]">Kolo Vesi 10, 15, 20, 30, 40, 50, 60 и станции Kolo Ilma на 15–100 м³ в сутки — под запрос. Смотрите <Link href="/kanalizaciya/kanalizaciya-dlya-poselka/" className="text-brand underline">канализацию для посёлка и турбазы</Link>.</p>
      </div></section>
      <FAQ items={faq} />
      <LeadSection source="каталог станций" />
      <RelatedPosts slugs={RELATED_POSTS.stancii} title="Сравнения и разборы" />
    </>
  );
}
