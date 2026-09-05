import { notFound } from "next/navigation";
import Link from "next/link";
import { meta, ldService } from "@/lib/seo";
import { SITE, brands, services, geo, getBrand, getService, getGeo, productsByBrand, getProduct, rub, objects, turnkeyFrom, topPicks, P } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import ProductGrid from "@/components/ProductGrid";
import LeadSection from "@/components/LeadSection";
import JsonLd from "@/components/JsonLd";
import Steps from "@/components/Steps";
import FAQ from "@/components/FAQ";
import ServiceLinks from "@/components/ServiceLinks";
import GeoLinks from "@/components/GeoLinks";
import ObjectCard from "@/components/ObjectCard";
import Draft from "@/components/Draft";
import Calculator from "@/components/Calculator";
import MdTable from "@/components/MdTable";

export const dynamicParams = false;
export function generateStaticParams() {
  return [...brands.map((b) => ({ slug: b.slug })), ...services.map((s) => ({ slug: s.slug })), ...geo.map((g) => ({ slug: g.slug }))];
}
export function generateMetadata({ params }: { params: { slug: string } }) {
  const b = getBrand(params.slug);
  if (b) return meta({ title: b.title, description: b.description, path: P.page(b.slug) });
  const s = getService(params.slug);
  if (s) return meta({ title: s.title, description: s.description, path: P.page(s.slug) });
  const g = getGeo(params.slug);
  if (g) return meta({
    title: `Септик под ключ ${g.prep} — установка, цена с монтажом | Фортес`,
    description: `Септик без откачки и автономная канализация ${g.prep}: Novo Eko, Zörde, Kolo Vesi под ключ от ${rub(turnkeyFrom(topPicks[0]))}. Грунт: ${g.soil}. Выезд инженера бесплатно, монтаж 1–2 дня, рассрочка и кредит через банки.`,
    path: P.geo(g.slug),
  });
  return {};
}

function BrandPage({ slug }: { slug: string }) {
  const b = getBrand(slug)!;
  const list = productsByBrand(b.slug);
  return (
    <>
      <JsonLd data={ldService({ name: `${b.name} в Иркутске`, description: b.description, path: P.page(b.slug), priceFrom: list[0] ? turnkeyFrom(list[0]) : undefined })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Канализация", href: P.hub }, { name: "Станции", href: P.stancii }, { name: b.name, href: P.page(b.slug) }]} />
        <h1>{b.h1}</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[64ch]">{b.intro}</p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 max-w-[1000px]">
          {b.points.map((t) => <li key={t} className="card px-4 py-3 text-[15px] flex gap-3"><span className="w-2 h-2 mt-2 rounded-sm bg-brand shrink-0" />{t}</li>)}
        </ul>
      </div>
      <section className="py-12 md:py-16"><div className="container-site">
        <h2 className="mb-6">Модели {b.name} с ценами</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      </div></section>
      <Steps />
      <LeadSection source={`бренд ${b.name}`} />
      <ServiceLinks />
    </>
  );
}

function ServicePage({ slug }: { slug: string }) {
  const s = getService(slug)!;
  const svc = s;
  const first = s.products?.[0] ? getProduct(s.products[0]) : undefined;
  const priceFrom = svc.koloIlma ? undefined : svc.kessons?.[0]?.price ?? (first ? turnkeyFrom(first) : undefined);
  const relatedObjects = objects.filter((o) => s.products?.includes(o.product)).slice(0, 2);
  return (
    <>
      <JsonLd data={ldService({ name: s.name, description: s.description, path: P.page(s.slug), priceFrom })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Канализация", href: P.hub }, { name: s.name, href: P.page(s.slug) }]} />
        <div className={`grid gap-5 lg:grid-cols-[1.2fr_1fr] ${svc.heroImage ? "items-stretch" : "items-start"}`}>
          <div className="card p-6 md:p-10 shadow-card flex flex-col">
            <h1>{s.h1}</h1>
            <p className="mt-5 text-[18px] leading-relaxed text-ink/85 max-w-[58ch]">{s.lead}</p>
            {svc.heroImage && (
              <div className="mt-5 flex flex-wrap gap-2">
                {(svc.chips || SITE.home.chips).map((c) => <span key={c} className="chip">{c}</span>)}
              </div>
            )}
            <div className="mt-auto pt-8 flex flex-wrap gap-3 items-center">
              <a href="#lead" className="btn-primary">Записаться на замер</a>
              <Link href="/kalkulyator/" className="btn-outline">Подобрать станцию</Link>
              {priceFrom && <span className="text-[15px] text-muted">{svc.kessons || svc.koloIlma ? "от" : "под ключ от"} {rub(priceFrom)}</span>}
            </div>
          </div>
          {svc.heroImage ? (
            <div className="card p-3 md:p-4 flex">
              <img src={svc.heroImage} alt={svc.heroImageAlt || s.h1} className={`w-full h-full rounded-card ${svc.heroImageFit === "contain" ? "object-contain bg-page" : "object-cover"}`} width="1254" height="1254" fetchPriority="high" />
            </div>
          ) : (
            <div className="grid gap-3">
              {[["1–2 дня", "монтаж на участке"], ["25 лет", "гарантия на корпус"], ["банки РФ", "рассрочка и кредит"], ["бесплатно", "выезд инженера"]].map(([a, b]) => (
                <div key={a} className="card px-5 py-4 flex items-baseline gap-3"><span className="text-2xl font-extrabold tracking-tight">{a}</span><span className="text-muted text-[15px]">{b}</span></div>
              ))}
            </div>
          )}
        </div>
      </div>

      {s.products?.length > 0 && <ProductGrid slugs={s.products} title="Что ставим" sub="Модели, которые подходят под эту задачу. Первые — самые заказываемые." />}

      {svc.kessons && (
        <section className="py-12 md:py-16"><div className="container-site">
          <h2 className="mb-6">Модели и цены</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {svc.kessons.map((k) => (
              <div key={k.name} className="card p-6 relative shadow-card">
                {k.hit && <span className="absolute top-4 right-4 rounded-btn bg-brand text-white text-[12px] font-bold px-2.5 py-1">Хит</span>}
                {k.image && <img src={k.image} alt={k.name} className="w-full aspect-square object-contain rounded-card bg-page mb-4" width="800" height="800" loading="lazy" />}
                <h3>{k.name}</h3>
                <div className="text-muted text-[15px] mt-1">{k.d}</div>
                <p className="mt-3 text-[15px] text-ink/80">{k.note}</p>
                <div className="mt-4 text-2xl font-extrabold tracking-tight">{k.priceLabel || rub(k.price)}</div>
                <a href="#lead" className="btn-primary mt-4 w-full">{k.priceLabel ? "Запросить цену" : "Рассчитать с монтажом"}</a>
              </div>
            ))}
          </div>
          {!svc.koloIlma && <p className="text-[14px] text-muted mt-4">Рекомендованные розничные цены завода «Экомир». Монтаж — по смете.</p>}
        </div></section>
      )}

      {svc.koloIlma && (
        <section className="py-12 md:py-16"><div className="container-site card p-6 md:p-8">
          <h2>Kolo Ilma 75–500</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-4 text-[15px]">
            <div><dt className="text-muted">Цена</dt><dd className="text-xl font-extrabold">по запросу</dd></div>
            <div><dt className="text-muted">Производительность</dt><dd className="text-xl font-extrabold">{svc.koloIlma.capacity}</dd></div>
            <div><dt className="text-muted">Срок службы</dt><dd className="text-xl font-extrabold">{svc.koloIlma.life}</dd></div>
            <div><dt className="text-muted">Сервис</dt><dd className="text-xl font-extrabold">{svc.koloIlma.service}</dd></div>
          </dl>
        </div></section>
      )}

      {svc.servicePrices && (
        <section className="py-12 md:py-16"><div className="container-site">
          <h2 className="mb-6">Стоимость обслуживания</h2>
          <div className="card divide-y divide-line max-w-[760px]">
            {svc.servicePrices.map((r) => (
              <Draft key={r.name} on={!!r.draft} note="цена — уточнить"><div className="flex justify-between gap-4 px-6 py-4"><span>{r.name}</span><span className="font-bold whitespace-nowrap">{r.price}</span></div></Draft>
            ))}
          </div>
        </div></section>
      )}

      <section className="py-12 md:py-16"><div className="container-site prose-site">
        {s.sections.map((sec) => (
          <div key={sec.h2}><h2>{sec.h2}</h2>{sec.p.map((t, i) => t.startsWith("|") ? <MdTable key={i} md={t} /> : <p key={i}>{t}</p>)}</div>
        ))}
      </div></section>

      {slug === "septik-dlya-chastnogo-doma" && (
        <section className="py-12 md:py-16"><div className="container-site"><h2 className="mb-6">Подберите станцию за минуту</h2><Calculator /></div></section>
      )}

      {relatedObjects.length > 0 && (
        <section className="py-6"><div className="container-site"><h2 className="mb-6">Похожие объекты со сметой</h2><div className="grid gap-5 md:grid-cols-2">{relatedObjects.map((o) => <ObjectCard key={o.slug} o={o} />)}</div></div></section>
      )}

      <Steps />
      <FAQ items={s.faq} />
      <LeadSection source={s.name} />
      <ServiceLinks exclude={s.slug} title="Смежные задачи" />
      <GeoLinks />
    </>
  );
}


function GeoPage({ slug }: { slug: string }) {
  const g = getGeo(slug)!;
  const objs = objects.filter((o) => o.geo === g.slug);
  const clay = /глин|вода|пойм/i.test(g.soil);
  const rock = /скал/i.test(g.soil);
  const about = (g as { about?: string[] }).about || [];
  const faq = [
    { q: `Сколько стоит септик под ключ ${g.prep}?`, a: `От ${rub(turnkeyFrom(topPicks[0]))} за Novo Eko 3 или Zörde 4 с доставкой и монтажом. Novo Eko 5 — от ${rub(turnkeyFrom(topPicks[1]))}. Выезд инженера ${g.prep} бесплатный, смета фиксируется в договоре.` },
    { q: `Какой грунт ${g.prep} и что это меняет?`, a: `${g.soil[0].toUpperCase() + g.soil.slice(1)}. ${clay ? "На глине и при высоком уровне грунтовых вод ставим станцию с принудительным отводом и усиленной засыпкой против всплытия." : rock ? "На скальнике котлован дороже, подойдёт низкий корпус Kolo Vesi или принудительный сброс на рельеф." : "Обычно достаточно самотёчной схемы с дренажным колодцем."}` },
    { q: `Как быстро приедете ${g.prep}?`, a: `Инженер — в течение 1–3 дней после заявки, ${g.distance} от Иркутска для нас рабочая зона. Ходовые станции есть на складе в Иркутске — монтаж через несколько дней после замера; под заказ с завода — около 3 недель.` },
    { q: "Работаете зимой?", a: "Да, ставим круглый год. Мёрзлый грунт учитывается в смете." },
  ];
  return (
    <>
      <JsonLd data={ldService({ name: `Септик под ключ ${g.prep}`, description: `Установка септиков и станций биологической очистки ${g.prep}`, path: P.geo(g.slug), priceFrom: turnkeyFrom(topPicks[0]), area: g.name })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Канализация", href: P.hub }, { name: g.name, href: P.geo(g.slug) }]} />
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="card p-6 md:p-10 shadow-card">
            <h1>Септик под ключ {g.prep}</h1>
            <p className="mt-5 text-[18px] leading-relaxed text-ink/85 max-w-[58ch]">Станции биологической очистки Novo Eko, Zörde и Kolo Vesi с монтажом за 1–2 дня. {g.note}</p>
            <div className="mt-5 flex flex-wrap gap-2">{SITE.home.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>
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
        {about.length > 0 && <><h2>Что важно знать про участки {g.prep}</h2>{about.map((t, i) => <p key={i}>{t}</p>)}</>}
        <h2>Автономная канализация {g.prep}: что учитываем</h2>
        <p>Перед сметой инженер приезжает на участок бесплатно: замеряет глубину выхода трубы из дома, смотрит рельеф и соседские колодцы, делает пробный шурф под уровень грунтовых вод. От этого зависит, нужна ли удлинённая горловина Midi/Long и как отводить воду — самотёком в дренаж или насосом в канаву.</p>
        <h2>Септик без откачки {g.prep}</h2>
        <p>Станции Novo Eko и Kolo Vesi требуют ассенизатора раз в год, Zörde — раз в два года. Для сравнения, выгребная яма {g.prep} — это машина 2–4 раза в месяц и 100–140 тысяч рублей в год. Станция окупается за 3–4 года.</p>
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

export default function Page({ params }: { params: { slug: string } }) {
  if (getBrand(params.slug)) return <BrandPage slug={params.slug} />;
  if (getService(params.slug)) return <ServicePage slug={params.slug} />;
  if (getGeo(params.slug)) return <GeoPage slug={params.slug} />;
  notFound();
}
