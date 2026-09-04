import { notFound } from "next/navigation";
import Link from "next/link";
import { meta, ldService } from "@/lib/seo";
import { geo, getGeo, SITE, objects, topPicks, rub, turnkeyFrom } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ProductGrid from "@/components/ProductGrid";
import LeadSection from "@/components/LeadSection";
import GeoLinks from "@/components/GeoLinks";
import Steps from "@/components/Steps";
import FAQ from "@/components/FAQ";
import ObjectCard from "@/components/ObjectCard";
import ServiceLinks from "@/components/ServiceLinks";

export const dynamicParams = false;
export function generateStaticParams() { return geo.map((g) => ({ geo: g.slug })); }
export function generateMetadata({ params }: { params: { geo: string } }) {
  const g = getGeo(params.geo); if (!g) return {};
  return meta({
    title: `Септик под ключ ${g.prep} — установка, цена с монтажом | Фортес`,
    description: `Септик без откачки и автономная канализация ${g.prep}: Novo Eko, Zörde, Kolo Vesi под ключ от ${rub(turnkeyFrom(topPicks[0]))}. Грунт: ${g.soil}. Выезд инженера бесплатно, монтаж 1–2 дня, рассрочка и кредит через банки.`,
    path: `/septik/${g.slug}/`,
  });
}

export default function Page({ params }: { params: { geo: string } }) {
  const g = getGeo(params.geo); if (!g) notFound();
  const objs = objects.filter((o) => o.geo === g.slug);
  const clay = /глин|вода|пойм/i.test(g.soil);
  const rock = /скал/i.test(g.soil);
  const faq = [
    { q: `Сколько стоит септик под ключ ${g.prep}?`, a: `От ${rub(turnkeyFrom(topPicks[0]))} за Novo Eko 3 с монтажом. Novo Eko 5 — от ${rub(turnkeyFrom(topPicks[1]))}, Zörde 4 — от ${rub(turnkeyFrom(topPicks[2]))}. Выезд инженера ${g.prep} бесплатный, смета фиксируется в договоре.` },
    { q: `Какой грунт ${g.prep} и что это меняет?`, a: `${g.soil[0].toUpperCase() + g.soil.slice(1)}. ${clay ? "На глине и при высокой воде ставим станцию с принудительным отводом и усиленной засыпкой против всплытия." : rock ? "На скальнике котлован дороже, подойдёт низкий корпус Kolo Vesi или принудительный сброс на рельеф." : "Обычно достаточно самотёчной схемы с дренажным колодцем."}` },
    { q: `Как быстро приедете ${g.prep}?`, a: `Инженер — в течение 1–3 дней после заявки, ${g.distance} от Иркутска для нас рабочая зона. Монтаж — после доставки станции, около 3 недель.` },
    { q: "Работаете зимой?", a: "Да, ставим круглый год. Мёрзлый грунт учитывается в смете." },
  ];
  return (
    <>
      <JsonLd data={ldService({ name: `Септик под ключ ${g.prep}`, description: `Установка септиков и станций биологической очистки ${g.prep}`, path: `/septik/${g.slug}/`, priceFrom: turnkeyFrom(topPicks[0]), area: g.name })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Иркутский район", href: "/septik/" }, { name: g.name, href: `/septik/${g.slug}/` }]} />
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="card p-6 md:p-10 shadow-card">
            <h1>Септик под ключ {g.prep}</h1>
            <p className="mt-5 text-[18px] leading-relaxed text-ink/85 max-w-[58ch]">Станции биологической очистки Novo Eko, Zörde и Kolo Vesi с монтажом за 1–2 дня. {g.note}</p>
            <div className="mt-6 flex flex-wrap gap-2">{SITE.home.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#lead" className="btn-primary">Вызвать инженера {g.prep}</a><Link href="/kalkulyator/" className="btn-outline">Подобрать станцию</Link></div>
          </div>
          <div className="card p-6">
            <h2 className="text-xl">Участки {g.prep}</h2>
            <dl className="mt-4 text-[15px] space-y-3">
              <div><dt className="text-muted">Расстояние от Иркутска</dt><dd className="font-bold">{g.distance}</dd></div>
              <div><dt className="text-muted">Грунт</dt><dd className="font-bold">{g.soil}</dd></div>
              <div><dt className="text-muted">Что обычно ставим</dt><dd className="font-bold">{clay ? "Novo Eko 5 или Zörde 4 с принудительным отводом" : rock ? "Kolo Vesi низкий корпус или Novo Eko с отводом на рельеф" : "Novo Eko 3 / 5 с дренажным колодцем"}</dd></div>
            </dl>
          </div>
        </div>
      </div>

      <ProductGrid slugs={SITE.topPicks} title={`Станции для домов ${g.prep}`} sub="Три самые заказываемые модели. Полная линейка — в каталоге." />

      <section className="py-12 md:py-16"><div className="container-site prose-site">
        <h2>Автономная канализация {g.prep}: что учитываем</h2>
        <p>Перед сметой инженер приезжает на участок бесплатно: замеряет глубину выхода трубы из дома, смотрит рельеф и соседские колодцы, делает пробный шурф под уровень грунтовых вод. От этого зависит, нужна ли удлинённая горловина Midi/Long и как отводить воду — самотёком в дренаж или насосом в канаву.</p>
        <h2>Септик без откачки {g.prep}</h2>
        <p>Станции Novo Eko и Kolo Vesi требуют ассенизатора раз в год, Zörde — раз в два года. Для сравнения, выгребная яма {g.prep} — это машина 2–4 раза в месяц и 100–140 тысяч рублей в год. Станция окупается за 2–3 года.</p>
        <h2>Сроки {g.prep}</h2>
        <p>Выезд инженера — 1–3 дня. Доставка станции из Санкт-Петербурга — около 3 недель. Монтаж — 1–2 дня. Обслуживание и гарантия — наша бригада в Иркутске, {g.distance} до вас.</p>
      </div></section>

      {objs.length > 0 && <section className="py-6"><div className="container-site"><h2 className="mb-6">Наши объекты {g.prep}</h2><div className="grid gap-5 md:grid-cols-2">{objs.map((o) => <ObjectCard key={o.slug} o={o} />)}</div></div></section>}

      <Steps />
      <FAQ items={faq} title={`Вопросы про септики ${g.prep}`} />
      <LeadSection source={`гео ${g.name}`} title={`Инженер приедет ${g.prep} бесплатно`} />
      <ServiceLinks title="Решения под задачу" />
      <GeoLinks current={g.slug} />
    </>
  );
}
