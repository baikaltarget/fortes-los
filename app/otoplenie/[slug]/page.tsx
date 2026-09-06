import { notFound } from "next/navigation";
import Link from "next/link";
import { meta, ldService } from "@/lib/seo";
import { HEAT, heatServices, heatGeo, heatObjects, getHeatService, getHeatGeo, getAnyObject, heatServicesByCluster, HP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Steps from "@/components/Steps";
import FAQ from "@/components/FAQ";
import ServiceLinks from "@/components/ServiceLinks";
import GeoLinks from "@/components/GeoLinks";
import ObjectCard from "@/components/ObjectCard";
import Draft from "@/components/Draft";
import MdTable from "@/components/MdTable";
import HeatLead from "@/components/HeatLead";
import HeatBrands from "@/components/HeatBrands";

export const dynamicParams = false;
export function generateStaticParams() {
  return [...heatServices.map((s) => ({ slug: s.slug })), ...heatGeo.map((g) => ({ slug: g.slug }))];
}
export function generateMetadata({ params }: { params: { slug: string } }) {
  const s = getHeatService(params.slug);
  if (s) return meta({ title: s.title, description: s.description, path: HP.page(s.slug) });
  const g = getHeatGeo(params.slug);
  if (g) return meta({
    title: `Монтаж отопления ${g.prep} — под ключ, тёплый пол, котельная | Фортес`,
    description: `Отопление дома ${g.prep} под ключ: электрокотёл, тёплый пол, радиаторы, котельная. ${g.power[0].toUpperCase() + g.power.slice(1)} — котёл под сети посёлка. Инженер бесплатно, смета до договора.`,
    path: HP.geo(g.slug),
  });
  return {};
}

const GEO_TEXT = "Выезд инженера бесплатный. Знаем, где какие сети и лимиты мощности, — от этого зависит, какой котёл ставить и нужен ли резерв.";
const HERO_FACTS = [["5–10", "дней монтаж дома до 200 м²"], ["проект", "и смета до договора"], ["банки РФ", "рассрочка и кредит"], ["бесплатно", "выезд инженера"]];

function ServicePage({ slug }: { slug: string }) {
  const s = getHeatService(slug)!;
  const related = (s.objects || []).map((o) => getAnyObject(o)).filter(Boolean) as typeof heatObjects;
  const siblings = heatServicesByCluster(s.cluster).filter((x) => x.slug !== s.slug);
  const others = heatServices.filter((x) => x.cluster !== s.cluster);
  const links = [...siblings, ...others].slice(0, 9);
  const cluster = HEAT.clusters.find((c) => c.slug === s.cluster);
  return (
    <>
      <JsonLd data={ldService({ name: s.name, description: s.description, path: HP.page(s.slug) })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Отопление", href: HP.hub }, { name: s.name, href: HP.page(s.slug) }]} />
        <div className={`grid gap-5 lg:grid-cols-[1.2fr_1fr] ${s.heroImage ? "items-stretch" : "items-start"}`}>
          <div className="card p-6 md:p-10 shadow-card flex flex-col">
            <h1>{s.h1}</h1>
            <p className="mt-5 text-[18px] leading-relaxed text-ink/85 max-w-[58ch]">{s.lead}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {(s.chips || HEAT.hub.chips).map((c) => <span key={c} className="chip">{c}</span>)}
            </div>
            <div className="mt-auto pt-8 flex flex-wrap gap-3 items-center">
              <a href="#lead" className="btn-primary">Записаться на замер</a>
              <Link href={HP.calc} className="btn-outline">Рассчитать стоимость</Link>
              {s.priceFrom && <Draft on={!!s.priceDraft} note="цена — ориентир, уточнить"><span className="text-[15px] text-muted">{s.priceFrom}</span></Draft>}
            </div>
          </div>
          {s.heroImage ? (
            <div className="card p-3 md:p-4 flex">
              <img src={s.heroImage} alt={s.heroImageAlt || s.h1} className="w-full h-full rounded-card object-cover" width="1254" height="1254" fetchPriority="high" />
            </div>
          ) : (
            <div className="grid gap-3">
              {HERO_FACTS.map(([a, b]) => <div key={a} className="card px-5 py-4 flex items-baseline gap-3"><span className="text-2xl font-extrabold tracking-tight">{a}</span><span className="text-muted text-[15px]">{b}</span></div>)}
            </div>
          )}
        </div>
      </div>

      <section className="py-12 md:py-16"><div className="container-site prose-site">
        {s.sections.map((sec) => (
          <div key={sec.h2}><h2>{sec.h2}</h2>{sec.p.map((t, i) => t.startsWith("|") ? <MdTable key={i} md={t} /> : <p key={i}>{t}</p>)}</div>
        ))}
      </div></section>

      {related.length > 0 && (
        <section className="py-6"><div className="container-site"><h2 className="mb-2">Похожие объекты с ценой</h2><p className="text-muted mb-6 max-w-[70ch]">Реальные дома с фото монтажа и тем, что вошло в стоимость.</p><div className="grid gap-5 md:grid-cols-2">{related.map((o) => <ObjectCard key={o.slug} o={o} />)}</div></div></section>
      )}

      {s.cluster === "kotel" && <HeatBrands />}
      <Steps items={HEAT.steps} title="Как проходит монтаж" />
      <FAQ items={s.faq} />
      <HeatLead source={`отопление: ${s.name}`} />
      <ServiceLinks items={links} href={HP.page} title={cluster ? `${cluster.title}: смежные задачи` : "Смежные задачи"} />
      <GeoLinks items={heatGeo} href={HP.geo} title="Монтаж отопления в Иркутском районе" text={GEO_TEXT} />
    </>
  );
}

function GeoPage({ slug }: { slug: string }) {
  const g = getHeatGeo(slug)!;
  const objs = (g.objects || []).map((o) => getAnyObject(o)).filter(Boolean) as typeof heatObjects;
  const weakGrid = /перегруж|отключ|просад|ограничен|слаб/i.test(g.power);
  const bigHouses = /200|300|400|коттедж/i.test(g.housing);
  const faq = [
    { q: `Сколько стоит отопление дома ${g.prep}?`, a: `Ориентир по нашему объекту: дом 120 м² с водяным тёплым полом, котельной на электрокотле и конвекторами под окна — 470 680 ₽ под ключ, около 3 900 ₽ за м² с оборудованием. Для дома ${g.prep} смету считаем после бесплатного выезда: она зависит от площади, утепления, лимита мощности и того, нужен ли резервный котёл.` },
    { q: `Какой котёл ставить ${g.prep}?`, a: `${g.power[0].toUpperCase() + g.power.slice(1)}. ${weakGrid ? "Поэтому один электрокотёл здесь — риск: собираем связку с твердотопливным котлом или теплоаккумулятором и ставим защиту от просадок напряжения." : bigHouses ? "На дома от 200 м² электрокотёл дополняем тепловым насосом, чтобы уложиться в лимит и снизить счета в межсезонье." : "Для дома до 150 м² с нормальным утеплением хватает электрокотла Zota или Kospel на 9–12 кВт."}` },
    { q: `Как быстро приедете и сделаете ${g.prep}?`, a: `Инженер — в течение 2–3 дней после заявки, ${g.distance} от Иркутска для нас рабочая зона. Монтаж дома 100–150 м² — 5–7 дней, до 100 м² — 3–5 дней. Оборудование Zota, Stout, RoyalThermo есть на складе в Иркутске.` },
    { q: "Работаете зимой?", a: "Да, монтаж внутри дома — круглый год. Стяжку тёплого пола заливаем при плюсовой температуре внутри, при необходимости ставим временный обогрев." },
  ];
  return (
    <>
      <JsonLd data={ldService({ name: `Монтаж отопления ${g.prep}`, description: `Отопление частного дома под ключ ${g.prep}: котельная, тёплый пол, радиаторы`, path: HP.geo(g.slug), area: g.name })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Отопление", href: HP.hub }, { name: g.name, href: HP.geo(g.slug) }]} />
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="card p-6 md:p-10 shadow-card">
            <h1>Монтаж отопления {g.prep}</h1>
            <p className="mt-5 text-[18px] leading-relaxed text-ink/85 max-w-[58ch]">Котельная, водяной тёплый пол, радиаторы под ключ для домов {g.prep}. Подбираем котёл под сети посёлка, проект и смету показываем до договора.</p>
            <div className="mt-5 flex flex-wrap gap-2">{HEAT.hub.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#lead" className="btn-primary">Вызвать инженера {g.prep}</a><Link href={HP.calc} className="btn-outline">Рассчитать стоимость</Link></div>
          </div>
          <div className="card p-6">
            <h2 className="text-xl">Дома {g.prep}</h2>
            <dl className="mt-4 text-[15px] space-y-3">
              <div><dt className="text-muted">Расстояние от Иркутска</dt><dd className="font-bold">{g.distance}, {g.tract}</dd></div>
              <div><dt className="text-muted">Электросети</dt><dd className="font-bold">{g.power}</dd></div>
              <div><dt className="text-muted">Какие дома</dt><dd className="font-bold">{g.housing}</dd></div>
              <div><dt className="text-muted">Что обычно ставим</dt><dd className="font-bold">{weakGrid ? "Электрокотёл + ТТ-котёл или теплоаккумулятор, тёплый пол в стяжке" : bigHouses ? "Тёплый пол по всему дому, конвекторы под витражи, котельная с гидрострелкой, тепловой насос" : "Электрокотёл Zota / Kospel, тёплый пол на первом этаже, радиаторы на втором"}</dd></div>
            </dl>
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16"><div className="container-site prose-site">
        <h2>Что важно знать про отопление {g.prep}</h2>
        {g.about.map((t, i) => <p key={i}>{t}</p>)}
        <h2>Что входит в отопление под ключ</h2>
        <p>Расчёт теплопотерь по каждой комнате для −36 °C, схема котельной и раскладка тёплого пола — до договора. Котёл с группой безопасности, расширительным баком и насосами, разводка по дому, тёплый пол или радиаторы, опрессовка, заполнение, настройка автоматики. Одна бригада, один договор, смета не растёт в процессе.</p>
      </div></section>

      {objs.length > 0 && <section className="py-6"><div className="container-site"><h2 className="mb-6">Наши объекты рядом</h2><div className="grid gap-5 md:grid-cols-2">{objs.map((o) => <ObjectCard key={o.slug} o={o} />)}</div></div></section>}

      <Steps items={HEAT.steps} title="Как проходит монтаж" />
      <FAQ items={faq} title={`Вопросы про отопление ${g.prep}`} />
      <HeatLead source={`отопление гео ${g.name}`} title={`Инженер приедет ${g.prep} бесплатно`} />
      <ServiceLinks items={heatServices.filter((x) => ["dom", "pol", "kotel"].includes(x.cluster)).slice(0, 9)} href={HP.page} title="Решения под задачу" />
      <GeoLinks items={heatGeo} href={HP.geo} current={g.slug} title="Монтаж отопления в Иркутском районе" text={GEO_TEXT} />
    </>
  );
}

export default function Page({ params }: { params: { slug: string } }) {
  if (getHeatService(params.slug)) return <ServicePage slug={params.slug} />;
  if (getHeatGeo(params.slug)) return <GeoPage slug={params.slug} />;
  notFound();
}
