import { notFound } from "next/navigation";
import Link from "next/link";
import { meta, ldService } from "@/lib/seo";
import { VODA, vodaServices, vodaGeo, vodaObjects, getVodaService, getVodaGeo, getAnyObject, vodaServicesByCluster, VP, BP, P } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Steps from "@/components/Steps";
import FAQ from "@/components/FAQ";
import ServiceLinks from "@/components/ServiceLinks";
import GeoLinks from "@/components/GeoLinks";
import ObjectCard from "@/components/ObjectCard";
import Draft from "@/components/Draft";
import MdTable from "@/components/MdTable";
import WaterLead from "@/components/WaterLead";
import WaterBrands from "@/components/WaterBrands";

export const dynamicParams = false;
export function generateStaticParams() {
  return [...vodaServices.map((s) => ({ slug: s.slug })), ...vodaGeo.map((g) => ({ slug: g.slug }))];
}
export function generateMetadata({ params }: { params: { slug: string } }) {
  const s = getVodaService(params.slug);
  if (s) return meta({ title: s.title, description: s.description, path: VP.page(s.slug) });
  const g = getVodaGeo(params.slug);
  if (g) return meta({
    title: `Водоснабжение и канализация ${g.prep} — ввод, разводка, монтаж | Фортес`,
    description: `Вода и канализация в доме ${g.prep}: источник — ${g.source.split(/[;,(]/)[0].trim()}, стоки — ${g.sewer.split(/[;,(]/)[0].trim()}. Ввод, разводка ХВС/ГВС, канализация, бойлер. Гарантия 2 года, инженер бесплатно.`,
    path: VP.geo(g.slug),
  });
  return {};
}

const GEO_TEXT = "Выезд инженера бесплатный. По каждому посёлку знаем, откуда там вода и куда уходит канализация.";
const MAIN_CLUSTERS = ["voda", "kanal"];

function ServicePage({ slug }: { slug: string }) {
  const s = getVodaService(slug)!;
  const related = (s.objects || []).map((o) => getAnyObject(o)).filter(Boolean) as typeof vodaObjects;
  const siblings = vodaServicesByCluster(s.cluster).filter((x) => x.slug !== s.slug);
  const others = vodaServices.filter((x) => x.cluster !== s.cluster);
  const links = [...siblings, ...others].slice(0, 9);
  const cluster = VODA.clusters.find((c) => c.slug === s.cluster);
  return (
    <>
      <JsonLd data={ldService({ name: s.name, description: s.description, path: VP.page(s.slug) })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Водоснабжение", href: VP.hub }, { name: s.name, href: VP.page(s.slug) }]} />
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] items-stretch">
          <div className="card p-6 md:p-10 shadow-card flex flex-col">
            <h1>{s.h1}</h1>
            <p className="mt-5 text-[18px] leading-relaxed text-ink/85 max-w-[58ch]">{s.lead}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {(s.chips || VODA.hub.chips).map((c) => <span key={c} className="chip">{c}</span>)}
            </div>
            <div className="mt-auto pt-8 flex flex-wrap gap-3 items-center">
              <a href="#lead" className="btn-primary">Узнать цену</a>
              <Link href={VP.calc} className="btn-outline">Рассчитать стоимость</Link>
              {s.priceFrom && <Draft on={!!s.priceDraft} note="цена — ориентир, уточнить"><span className="text-[15px] text-muted">{s.priceFrom}</span></Draft>}
            </div>
          </div>
          <div className="card p-3 md:p-4 flex">
            <img src={s.heroImage} alt={s.heroImageAlt || s.h1} className="w-full h-full rounded-card object-cover" width="1254" height="1254" fetchPriority="high" />
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16"><div className="container-site prose-site">
        {s.sections.map((sec) => (
          <div key={sec.h2}><h2>{sec.h2}</h2>{sec.p.map((t, i) => t.startsWith("|") ? <MdTable key={i} md={t} /> : <p key={i}>{t}</p>)}</div>
        ))}
        {s.cluster === "kanal" && (
          <p className="text-[15px] text-muted">Сам септик или станция биологической очистки — в разделе <Link href={P.hub} className="text-brand underline">«Канализация»</Link>: подбор, цены под ключ, монтаж за 1–2 дня. Мы делаем и трубы в доме, и септик — одним договором.</p>
        )}
        {(s.slug === "vvod-vody-v-dom" || s.slug === "uzel-vvoda-vody") && (
          <p className="text-[15px] text-muted">Если скважины ещё нет — бурение, кессон и насос в разделе <Link href={BP.hub} className="text-brand underline">«Бурение»</Link>. Ввод считаем одной сметой со скважиной.</p>
        )}
      </div></section>

      {related.length > 0 && (
        <section className="py-6"><div className="container-site"><h2 className="mb-2">Похожие объекты с ценой</h2><p className="text-muted mb-6 max-w-[70ch]">Реальные дома и бани с тем, что вошло в стоимость.</p><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{related.map((o) => <ObjectCard key={o.slug} o={o} />)}</div></div></section>
      )}

      {(s.cluster === "voda" || s.cluster === "oborud") && <WaterBrands />}
      <Steps items={VODA.steps} title="Как проходит работа" />
      <FAQ items={s.faq} />
      <WaterLead source={`водоснабжение: ${s.name}`} />
      <ServiceLinks items={links} href={VP.page} title={cluster ? `${cluster.title}: смежные задачи` : "Смежные задачи"} />
      <GeoLinks items={vodaGeo} href={VP.geo} title="Вода и канализация в Иркутском районе" text={GEO_TEXT} />
    </>
  );
}

/** Фото для гео-страницы: по источнику воды — сеть → узел ввода, колодец → насосная станция, скважина → трасса ввода; чередуем, чтобы не было одного кадра на 26 страницах */
const GEO_PHOTOS: [RegExp, string, string][] = [
  [/водоканал|центральн|сет/i, "/img/vodosnabzhenie/hero-uzel-vvoda.webp", "Узел ввода воды из центрального водопровода: кран, фильтр, редуктор, счётчик"],
  [/колод/i, "/img/vodosnabzhenie/hero-nasos-rele.webp", "Насосная станция и реле давления на вводе воды в дом"],
];
const GEO_ROTATE = [
  ["/img/vodosnabzhenie/hero-vvod-trassa.webp", "Траншея с трубой ввода воды от скважины к дому"],
  ["/img/vodosnabzhenie/hero-razvodka-banya.webp", "Коллекторная разводка воды и канализации в бане"],
  ["/img/vodosnabzhenie/hero-bojler-kollektor.webp", "Бойлер и коллекторы водоснабжения в котельной частного дома"],
  ["/img/vodosnabzhenie/hero-transheya.webp", "Траншея под наружную канализацию до септика"],
  ["/img/vodosnabzhenie/hero-gidroakkumulyator.webp", "Гидроаккумулятор и автоматика водоснабжения из скважины"],
];
function geoPhoto(g: { slug: string; source: string }) {
  for (const [re, src, alt] of GEO_PHOTOS) if (re.test(g.source.split(/[;,(]/)[0])) return { src, alt };
  const i = vodaGeo.findIndex((x) => x.slug === g.slug);
  const [src, alt] = GEO_ROTATE[Math.max(0, i) % GEO_ROTATE.length];
  return { src, alt };
}

function GeoPage({ slug }: { slug: string }) {
  const g = getVodaGeo(slug)!;
  const objs = (g.objects || []).map((o) => getAnyObject(o)).filter(Boolean) as typeof vodaObjects;
  const central = /центральн|водоканал|от шелехова/i.test(g.source);
  const well = /скважин/i.test(g.source);
  const kolodec = /колодец/i.test(g.source);
  const centralSewer = /центральная канализация/i.test(g.sewer) && !/нет/.test(g.sewer.split(";")[0]);
  const faq = [
    { q: `Сколько стоит провести воду и канализацию в дом ${g.prep}?`, a: `Считаем по точкам: точка воды от 4 500 ₽, точка канализации от 3 500 ₽, ввод от 1 800 ₽/м, коллектор от 25 000 ₽. Дом 100–150 м² с двумя санузлами — от 250 000 ₽ без оборудования и сантехники. ${g.distance} от Иркутска — рабочая зона, выезд бесплатный, смета фиксируется в договоре.` },
    { q: `Откуда вода ${g.prep}?`, a: `${g.source[0].toUpperCase() + g.source.slice(1)}. ${well ? "Из скважины заводим через кессон или адаптер ниже промерзания, автоматика в кессоне или в доме." : ""} ${central ? "При подключении к сети собираем узел учёта со счётчиком и редуктором — давление в водопроводе прыгает." : ""} ${kolodec ? "Из колодца — насосная станция или погружной насос, ввод через кольцо с греющим кабелем." : ""} Если источника нет — бурим и обустраиваем сами.`.replace(/\s+/g, " ") },
    { q: `Куда уходит канализация ${g.prep}?`, a: `${g.sewer[0].toUpperCase() + g.sewer.slice(1)}. ${centralSewer ? "К сети подключаем с техусловиями и проектом, колодец на границе участка." : "Выводим трубу из дома с утеплением и ведём рыжую Ø110 с уклоном 2 см на метр до септика; сам септик — переливной из наших ЖБИ-колец или станция Novo Eko / Zörde — подбираем и ставим одним договором."}` },
    { q: `Как быстро сделаете ${g.prep}?`, a: `Инженер — в течение 2–3 дней после заявки. Наружные работы (ввод, труба к септику) — день экскаватором. Разводка воды и канализации в доме 100–150 м² — 2–4 дня до стяжки, сантехника — день после отделки. Материалы на складе в Иркутске.` },
  ];
  return (
    <>
      <JsonLd data={ldService({ name: `Водоснабжение и канализация ${g.prep}`, description: `Ввод воды, разводка ХВС и ГВС, внутренняя и наружная канализация, бойлер и автоматика под ключ ${g.prep}`, path: VP.geo(g.slug), area: g.name, priceFrom: 4500 })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Водоснабжение", href: VP.hub }, { name: g.name, href: VP.geo(g.slug) }]} />
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] items-stretch">
        <div className="card p-6 md:p-10 shadow-card">
          <h1>Водоснабжение и канализация дома {g.prep}</h1>
          <p className="mt-5 text-[18px] leading-relaxed text-ink/85 max-w-[62ch]">Заводим воду в дом {g.prep}, разводим холодную и горячую по санузлам и кухне, собираем канализацию с фановым стояком и выводим трубу к септику или в сеть. Бойлер, гидроаккумулятор, сантехника — одной бригадой. Цена за точку известна до начала работ.</p>
          <div className="mt-5 flex flex-wrap gap-2">{VODA.hub.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#lead" className="btn-primary">Вызвать инженера {g.prep}</a><Link href={VP.calc} className="btn-outline">Рассчитать стоимость</Link></div>
          <Draft on={VODA.geoNote.draft} note="источник воды / канализация по посёлку — сверить с клиентом" className="mt-6">
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-[15px] border-t border-line pt-5">
              <div><dt className="text-muted">Расстояние от Иркутска</dt><dd className="font-bold">{g.distance}, {g.tract}</dd></div>
              <div><dt className="text-muted">Застройка</dt><dd className="font-bold">{g.housing}</dd></div>
              <div><dt className="text-muted">Откуда вода</dt><dd className="font-bold">{g.source}</dd></div>
              <div><dt className="text-muted">Куда стоки</dt><dd className="font-bold">{g.sewer}</dd></div>
            </dl>
          </Draft>
          <p className="text-[13px] text-muted mt-3">{VODA.geoNote.text}</p>
        </div>
        {/* v32: фото на гео-страницах — реальные фото объектов раздела, по типу источника воды */}
        <div className="card p-3 md:p-4 flex">
          <img src={geoPhoto(g).src} alt={geoPhoto(g).alt} className="w-full h-full rounded-card object-cover" width="1254" height="1254" fetchPriority="high" />
        </div>
        </div>
      </div>

      <section className="py-12 md:py-16"><div className="container-site prose-site">
        <h2>Что важно знать про воду и канализацию {g.prep}</h2>
        {g.about.map((t, i) => <p key={i}>{t}</p>)}
        <h2>Что входит в воду и канализацию под ключ</h2>
        <p>Ввод воды от источника до дома с проходом фундамента и греющим кабелем. Узел ввода: кран, фильтр, редуктор, при сети — счётчик. Коллекторная разводка ХВС и ГВС сшитым полиэтиленом до каждой точки с водорозетками. Внутренняя канализация Ø50/110 с уклонами, ревизиями и фановым стояком, вывод из дома, труба до септика или сети. Опрессовка на 6 бар, проливка канализации, схема и акты. По желанию — бойлер, гидроаккумулятор, сантехника, водоочистка по анализу (анализ в подарок), скважина и септик одним договором. Гарантия на работы 2 года.</p>
      </div></section>

      {objs.length > 0 && <section className="py-6"><div className="container-site"><h2 className="mb-6">Наши объекты рядом</h2><div className="grid gap-5 md:grid-cols-2">{objs.map((o) => <ObjectCard key={o.slug} o={o} />)}</div></div></section>}

      <Steps items={VODA.steps} title="Как проходит монтаж" />
      <FAQ items={faq} title={`Вопросы про воду и канализацию ${g.prep}`} />
      <WaterLead source={`водоснабжение гео ${g.name}`} title={`Инженер приедет ${g.prep} бесплатно`} />
      <ServiceLinks items={vodaServices.filter((x) => MAIN_CLUSTERS.includes(x.cluster)).slice(0, 9)} href={VP.page} title="Решения под задачу" />
      <GeoLinks items={vodaGeo} href={VP.geo} current={g.slug} title="Вода и канализация в Иркутском районе" text={GEO_TEXT} />
    </>
  );
}

export default function Page({ params }: { params: { slug: string } }) {
  if (getVodaService(params.slug)) return <ServicePage slug={params.slug} />;
  if (getVodaGeo(params.slug)) return <GeoPage slug={params.slug} />;
  notFound();
}
