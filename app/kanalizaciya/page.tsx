import Link from "next/link";
import { meta, ldService } from "@/lib/seo";
import { SITE, geo, services, brands, topPicks, rub, turnkeyFrom, P } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ProductCard from "@/components/ProductCard";
import LeadSection from "@/components/LeadSection";
import RelatedPosts, { RELATED_POSTS } from "@/components/RelatedPosts";
import Steps from "@/components/Steps";
import FAQ from "@/components/FAQ";
import ServiceLinks from "@/components/ServiceLinks";
import Reasons from "@/components/Reasons";

export const metadata = meta({
  title: "Автономная канализация и септики в Иркутске — все решения Фортес",
  description: "Станции Novo Eko, Zörde, Kolo Vesi под ключ от 350 000 ₽, кессоны, обслуживание, решения для дачи, глины, скальника и высокой воды. 20 посёлков Иркутского района, инженер бесплатно.",
  path: P.hub,
});

export default function Page() {
  return (
    <>
      <JsonLd data={ldService({ name: "Автономная канализация в Иркутске", description: "Станции биологической очистки, септики, кессоны под ключ", path: P.hub, priceFrom: turnkeyFrom(topPicks[0]) })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Канализация", href: P.hub }]} />
        <h1>Автономная канализация и септики в Иркутске</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[64ch]">Всё направление на одной странице: станции с ценами под ключ, решения под ваш дом и грунт, кессоны, сервис и посёлки, куда выезжаем. Не знаете, с чего начать — <Link href="/kalkulyator/" className="text-brand underline">калькулятор</Link> за минуту.</p>
      </div>
      <section className="py-12 md:py-16"><div className="container-site">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6"><h2>Три станции, которые заказывают чаще всего</h2><Link href={P.stancii} className="text-brand underline underline-offset-2 text-[15px]">Вся линейка</Link></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{topPicks.map((p) => <ProductCard key={p.slug} p={p} compact />)}</div>
        <div className="mt-4 flex flex-wrap gap-2">{brands.map((b) => <Link key={b.slug} href={P.page(b.slug)} className="chip hover:border-ink">{b.name}</Link>)}</div>
      </div></section>
      <ServiceLinks title="Решения под задачу" />
      <Reasons />
      <section id="geo" className="py-12 md:py-16 scroll-mt-28"><div className="container-site">
        <h2 className="mb-2">Септик под ключ в Иркутском районе</h2>
        <p className="text-muted max-w-[70ch] mb-6">Выезд инженера бесплатный по всем направлениям. Знаем грунты и воду в каждом посёлке — ставили не раз.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {geo.map((g) => (
            <Link key={g.slug} href={P.geo(g.slug)} className="card p-4 hover:shadow-card block">
              <div className="font-bold">Септик {g.prep}</div>
              <div className="text-[13px] text-muted mt-1">{g.distance} · {g.soil}</div>
            </Link>
          ))}
        </div>
      </div></section>
      <Steps />
      <FAQ items={SITE.homeFaq} />
      <LeadSection source="хаб канализация" />
      <RelatedPosts slugs={RELATED_POSTS.hub} />
    </>
  );
}
