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
    description: `Отопление частного дома ${g.prep} под ключ: электрокотёл, водяной тёплый пол, радиаторы, котельная. ${g.power[0].toUpperCase() + g.power.slice(1)} — подбираем котёл под сети посёлка. Выезд инженера бесплатно, смета и проект до договора.`,
    path: HP.geo(g.slug),
  });
  return {};
}

const GEO_TEXT = "Выезд инженера бесплатный. Знаем, где какие сети и лимиты мощности, — от этого зависит, какой котёл ставить и нужен ли резерв.";
const HERO_FACTS = [["5–10", "дней монтаж дома до 200 м²"], ["проект", "и смета до договора"], ["банки РФ", "рассрочка и кредит"], ["бесплатно", "выезд инженера"]];

/** v32: реальный проект п. Лесной — PDF в public/docs/ + превью листов в public/img/otoplenie/proekt/ */
const PROJECT_PDF = "/docs/fortes-proekt-otopleniya-lesnoj-2025.pdf";
const PROJECT_SHEETS: [string, string][] = [
  ["teplyj-pol-1-etazh", "Схема отопления 1 этажа: 20 контуров тёплого пола с площадью, шагом и длиной"],
  ["aksonometriya-otopleniya", "Аксонометрическая схема отопления с настройкой расходомеров"],
  ["shema-itp", "Схема котельной: ТТ-котёл 37 кВт, два электрокотла 18 кВт, коллектор, бойлер 300 л"],
  ["pirog-teplogo-pola", "Разрез пирога тёплого пола: EPS 60 мм, труба PE-RT 16×2, стяжка 70 мм"],
];
function ProjectDownload() {
  return (
    <section className="py-6"><div className="container-site">
      <div className="card p-6 md:p-10 shadow-card">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <h2>Скачать реальный проект (PDF, 2,3 МБ)</h2>
            <p className="mt-3 text-ink/85 max-w-[62ch]">Проектная документация отопления, водоснабжения и водоотведения дома 404 м² в п. Лесной, 2025 год: 18 листов ОВиК, 4 листа котельной, спецификация, пояснительная записка с теплотехническим расчётом. Такой комплект получает каждый заказчик монтажа под ключ.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={PROJECT_PDF} download className="btn-primary" data-goal="project_download">Скачать проект PDF</a>
              <a href={PROJECT_PDF} target="_blank" rel="noopener" className="btn-outline">Открыть в браузере</a>
            </div>
          </div>
          <a href={PROJECT_PDF} target="_blank" rel="noopener" className="block"><img src="/img/otoplenie/proekt/oblozhka.webp" alt="Обложка проекта Фортес: проектная документация отопления, водоснабжения и водоотведения дома в п. Лесной" className="w-full rounded-card border border-line" width="1400" height="990" loading="lazy" /></a>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROJECT_SHEETS.map(([f, alt]) => (
            <figure key={f}>
              <a href={`/img/otoplenie/proekt/${f}.webp`} target="_blank" rel="noopener"><img src={`/img/otoplenie/proekt/${f}.webp`} alt={alt} className="w-full rounded-btn border border-line" width="1400" height="990" loading="lazy" /></a>
              <figcaption className="mt-2 text-[13px] text-muted leading-snug">{alt}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div></section>
  );
}

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

      {s.slug === "proektirovanie-otopleniya" && <ProjectDownload />}

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
    { q: `Сколько стоит отопление дома ${g.prep}?`, a: `Ориентир по нашему объекту: дом 120 м² с водяным тёплым полом, котельной на электрокотле и конвекторами под окна — 470 680 ₽ под ключ (2024 год). Сейчас считаем: радиаторы под ключ с котлом, материалами и работой — от 2 500 ₽/м², тёплый пол — от 4 500 ₽/м². Для дома ${g.prep} смету считаем после бесплатного выезда: она зависит от площади, утепления, лимита мощности и того, нужен ли резервный котёл.` },
    { q: `Какой котёл ставить ${g.prep}?`, a: `${g.power[0].toUpperCase() + g.power.slice(1)}. ${weakGrid ? "Поэтому один электрокотёл здесь — риск: собираем связку с твердотопливным котлом или теплоаккумулятором и ставим защиту от просадок напряжения." : bigHouses ? "На дома от 200 м² электрокотёл дополняем тепловым насосом, чтобы уложиться в лимит и снизить счета в межсезонье." : "Для дома до 150 м² с нормальным утеплением хватает электрокотла Zota или Kospel на 9–12 кВт."}` },
    { q: `Как быстро приедете и сделаете ${g.prep}?`, a: `Инженер — в течение 2–3 дней после заявки, ${g.distance} от Иркутска для нас рабочая зона. Монтаж дома 100–150 м² — 5–7 дней, до 100 м² — 3–5 дней. Оборудование Zota, Stout, RoyalThermo есть на складе в Иркутске.` },
    { q: "Работаете зимой?", a: "Да, монтаж внутри дома — круглый год. Стяжку тёплого пола заливаем при плюсовой температуре внутри, при необходимости ставим временный обогрев." },
  ];
  return (
    <>
      <JsonLd data={ldService({ name: `Монтаж отопления ${g.prep}`, description: `Отопление частного дома под ключ ${g.prep}: котельная, тёплый пол, радиаторы`, path: HP.geo(g.slug), area: g.name })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Отопление", href: HP.hub }, { name: g.name, href: HP.geo(g.slug) }]} />
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] items-stretch">
          <div className="card p-6 md:p-10 shadow-card">
            <h1>Монтаж отопления {g.prep}</h1>
            <p className="mt-5 text-[18px] leading-relaxed text-ink/85 max-w-[58ch]">Котельная, водяной тёплый пол, радиаторы под ключ для домов {g.prep}. Подбираем котёл под сети посёлка, проект и смету показываем до договора.</p>
            <div className="mt-5 flex flex-wrap gap-2">{HEAT.hub.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#lead" className="btn-primary">Вызвать инженера {g.prep}</a><Link href={HP.calc} className="btn-outline">Рассчитать стоимость</Link></div>
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-[15px] border-t border-line pt-5 mt-6">
              <div><dt className="text-muted">Расстояние от Иркутска</dt><dd className="font-bold">{g.distance}, {g.tract}</dd></div>
              <div><dt className="text-muted">Электросети</dt><dd className="font-bold">{g.power}</dd></div>
              <div className="sm:col-span-2"><dt className="text-muted">Какие дома</dt><dd className="font-bold">{g.housing}</dd></div>
              <div className="sm:col-span-2"><dt className="text-muted">Что обычно ставим</dt><dd className="font-bold">{weakGrid ? "Электрокотёл + ТТ-котёл или теплоаккумулятор, тёплый пол в стяжке" : bigHouses ? "Тёплый пол по всему дому, конвекторы под витражи, котельная с гидрострелкой, тепловой насос" : "Электрокотёл Zota / Kospel, тёплый пол на первом этаже, радиаторы на втором"}</dd></div>
            </dl>
          </div>
          <div className="card overflow-hidden">
            <img src="/img/otoplenie/hero-master-radiator-2.webp" alt="Инженер Фортес монтирует радиатор отопления в фирменной форме" className="w-full h-full object-cover" width="1254" height="1254" />
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
