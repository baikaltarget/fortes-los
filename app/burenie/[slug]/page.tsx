import { notFound } from "next/navigation";
import Link from "next/link";
import { meta, ldService } from "@/lib/seo";
import { BUR, burServices, burGeo, burObjects, getBurService, getBurGeo, getAnyObject, burServicesByCluster, BP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Steps from "@/components/Steps";
import FAQ from "@/components/FAQ";
import ServiceLinks from "@/components/ServiceLinks";
import GeoLinks from "@/components/GeoLinks";
import ObjectCard from "@/components/ObjectCard";
import Draft from "@/components/Draft";
import MdTable from "@/components/MdTable";
import DrillLead from "@/components/DrillLead";
import DrillBrands from "@/components/DrillBrands";
import WellScheme from "@/components/WellScheme";

export const dynamicParams = false;
export function generateStaticParams() {
  return [...burServices.map((s) => ({ slug: s.slug })), ...burGeo.map((g) => ({ slug: g.slug }))];
}
export function generateMetadata({ params }: { params: { slug: string } }) {
  const s = getBurService(params.slug);
  if (s) return meta({ title: s.title, description: s.description, path: BP.page(s.slug) });
  const g = getBurGeo(params.slug);
  if (g) return meta({
    title: `Бурение скважин на воду ${g.prep} — цена за метр, глубина, под ключ | Фортес`,
    description: `Бурение скважин ${g.prep}: вода на ${g.depth}, грунт — ${g.soil}, конструкция — ${g.construction}. От 2 300 ₽ за метр, обустройство кессоном, насос, ввод в дом. Гарантия 5 лет, выезд инженера бесплатно.`,
    path: BP.geo(g.slug),
  });
  return {};
}

const GEO_TEXT = "Выезд инженера бесплатный. По каждому посёлку знаем, на какой глубине вода, какой грунт и какая обсадка нужна.";
const HERO_FACTS = [["1–2", "дня — бурение с прокачкой"], ["5 лет", "гарантия на скважину"], ["паспорт", "и акт на каждую скважину"], ["бесплатно", "выезд инженера"]];

/** Схема по умолчанию для страницы услуги — по кластеру */
function schemeFor(slug: string, cluster: string) {
  if (slug === "skvazhina-na-pesok" || slug === "skvazhina-dlya-dachi" || slug === "letnee-obustrojstvo-skvazhiny") return { depth: 28, steel: 0, water: 9, kesson: false, title: "Скважина на первый горизонт: одна колонна, летний оголовок" };
  if (slug === "artezianskaya-skvazhina") return { depth: 90, steel: 40, water: 30, kesson: true, title: "Глубокая скважина: сталь на верхние горизонты, пластик до напорного" };
  if (slug === "skvazhinnyj-adapter") return { depth: 45, steel: 20, water: 15, kesson: false, title: "Обустройство с адаптером: без кессона, вывод ниже промерзания" };
  if (slug === "burenie-dlya-snt-i-predpriyatij") return { depth: 100, steel: 45, water: 30, kesson: true, title: "Скважина СНТ: Ø159–219, напорный горизонт, насос ЭЦВ" };
  if (cluster === "burenie" || cluster === "obustrojstvo") return { depth: 52, steel: 28, water: 19, kesson: true, title: "Наша базовая конструкция: сталь Ø159 до 28 м, пластик Ø125 до 52 м" };
  return null;
}

function ServicePage({ slug }: { slug: string }) {
  const s = getBurService(slug)!;
  const related = (s.objects || []).map((o) => getAnyObject(o)).filter(Boolean) as typeof burObjects;
  const siblings = burServicesByCluster(s.cluster).filter((x) => x.slug !== s.slug);
  const others = burServices.filter((x) => x.cluster !== s.cluster);
  const links = [...siblings, ...others].slice(0, 9);
  const cluster = BUR.clusters.find((c) => c.slug === s.cluster);
  const scheme = s.heroImage ? null : schemeFor(s.slug, s.cluster);
  return (
    <>
      <JsonLd data={ldService({ name: s.name, description: s.description, path: BP.page(s.slug) })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Бурение", href: BP.hub }, { name: s.name, href: BP.page(s.slug) }]} />
        <div className={`grid gap-5 lg:grid-cols-[1.2fr_1fr] ${s.heroImage || scheme ? "items-stretch" : "items-start"}`}>
          <div className="card p-6 md:p-10 shadow-card flex flex-col">
            <h1>{s.h1}</h1>
            <p className="mt-5 text-[18px] leading-relaxed text-ink/85 max-w-[58ch]">{s.lead}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {(s.chips || BUR.hub.chips).map((c) => <span key={c} className="chip">{c}</span>)}
            </div>
            <div className="mt-auto pt-8 flex flex-wrap gap-3 items-center">
              <a href="#lead" className="btn-primary">Узнать цену</a>
              <Link href={BP.calc} className="btn-outline">Рассчитать стоимость</Link>
              {s.priceFrom && <Draft on={!!s.priceDraft} note="цена — ориентир, уточнить"><span className="text-[15px] text-muted">{s.priceFrom}</span></Draft>}
            </div>
          </div>
          {s.heroImage ? (
            <div className="card p-3 md:p-4 flex">
              <img src={s.heroImage} alt={s.heroImageAlt || s.h1} className="w-full h-full rounded-card object-cover" width="1254" height="1254" fetchPriority="high" />
            </div>
          ) : scheme ? (
            <div className="card p-4 md:p-6 flex items-center"><WellScheme {...scheme} /></div>
          ) : (
            <div className="grid gap-3">
              {HERO_FACTS.map(([a, b]) => <div key={a} className="card px-5 py-4 flex items-baseline gap-3"><span className="text-2xl font-extrabold tracking-tight">{a}</span><span className="text-muted text-[15px]">{b}</span></div>)}
            </div>
          )}
        </div>
      </div>

      <Draft on={!!s.confirmWithClient} note={s.confirmWithClient || ""}>
        <section className="py-12 md:py-16"><div className="container-site prose-site">
          {s.sections.map((sec) => (
            <div key={sec.h2}><h2>{sec.h2}</h2>{sec.p.map((t, i) => t.startsWith("|") ? <MdTable key={i} md={t} /> : <p key={i}>{t}</p>)}</div>
          ))}
        </div></section>
      </Draft>

      {related.length > 0 && (
        <section className="py-6"><div className="container-site"><h2 className="mb-2">Похожие объекты с ценой</h2><p className="text-muted mb-6 max-w-[70ch]">Реальные скважины и обустройство с тем, что вошло в стоимость.</p><div className="grid gap-5 md:grid-cols-2">{related.map((o) => <ObjectCard key={o.slug} o={o} />)}</div></div></section>
      )}

      {(s.cluster === "obustrojstvo" || s.slug === "konstrukciya-skvazhiny") && <DrillBrands />}
      <Steps items={BUR.steps} title="Как проходит работа" />
      <FAQ items={s.faq} />
      <DrillLead source={`бурение: ${s.name}`} />
      <ServiceLinks items={links} href={BP.page} title={cluster ? `${cluster.title}: смежные задачи` : "Смежные задачи"} />
      <GeoLinks items={burGeo} href={BP.geo} title="Бурение скважин в Иркутском районе" text={GEO_TEXT} />
    </>
  );
}

function GeoPage({ slug }: { slug: string }) {
  const g = getBurGeo(slug)!;
  const objs = (g.objects || []).map((o) => getAnyObject(o)).filter(Boolean) as typeof burObjects;
  const iron = /желез|марган/i.test(g.water);
  const deep = g.depthMax >= 70;
  const shallow = g.depthMax <= 45;
  const faq = [
    { q: `Сколько стоит скважина ${g.prep}?`, a: `Бурение — от 2 300 ₽ за метр стальной колонной и от 2 900 ₽ за металл + пластик. При типичной глубине ${g.depth} само бурение обходится ${deep ? "от 180 000–250 000 ₽" : shallow ? "от 60 000–110 000 ₽" : "от 100 000–150 000 ₽"}, с кессоном, насосом и вводом в дом — ${deep ? "от 320 000 ₽" : shallow ? "от 200 000 ₽" : "от 250 000 ₽"}. Точную цену метра называем после бесплатного выезда.` },
    { q: `На какой глубине вода ${g.prep}?`, a: `По нашим и соседним скважинам — ${g.depth}. Грунт: ${g.soil}. ${shallow ? "Первый горизонт близко, но для дома берём второй — он стабильнее и чище." : deep ? "Верхний горизонт слабый, бурим сразу на рабочий — с двойной обсадкой и насосом на высокий напор." : "Для дома бурим на второй горизонт, для дачи хватает первого."} Перед выездом сверяем вашу улицу по карте глубин.` },
    { q: `Какая вода ${g.prep}, нужен ли фильтр?`, a: `${g.water[0].toUpperCase() + g.water.slice(1)}. ${iron ? "Фильтр обезжелезивания скорее всего понадобится — закладываем анализ и колонну в смету сразу, окончательно решаем по протоколу." : "Фильтр чаще не нужен, но анализ после прокачки делаем всегда — это входит в работу."}` },
    { q: `Как быстро приедете ${g.prep}?`, a: `Инженер — в течение 2–3 дней после заявки, ${g.distance} от Иркутска для нас рабочая зона. Бурение — 1–2 дня, обустройство с кессоном и вводом в дом — ещё 2–3 дня. Обсадные трубы, кессоны и насосы есть на складе в Иркутске.` },
  ];
  return (
    <>
      <JsonLd data={ldService({ name: `Бурение скважин ${g.prep}`, description: `Бурение и обустройство скважин на воду под ключ ${g.prep}: вода на ${g.depth}, ${g.construction}`, path: BP.geo(g.slug), area: g.name, priceFrom: 2300 })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Бурение", href: BP.hub }, { name: g.name, href: BP.geo(g.slug) }]} />
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="card p-6 md:p-10 shadow-card">
            <h1>Бурение скважин на воду {g.prep}</h1>
            <p className="mt-5 text-[18px] leading-relaxed text-ink/85 max-w-[58ch]">Бурим под ключ {g.prep}: вода на {g.depth}, конструкция — {g.construction}. Кессон или адаптер, насос, ввод в дом с греющим кабелем. Цену метра называем до выезда буровой и фиксируем в договоре.</p>
            <div className="mt-5 flex flex-wrap gap-2">{BUR.hub.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#lead" className="btn-primary">Вызвать инженера {g.prep}</a><Link href={BP.calc} className="btn-outline">Рассчитать стоимость</Link></div>
            <Draft on={BUR.geoNote.depthDraft} note="глубины по посёлкам — ориентир, уточнить у клиента" className="mt-6">
              <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-[15px] border-t border-line pt-5">
                <div><dt className="text-muted">Расстояние от Иркутска</dt><dd className="font-bold">{g.distance}, {g.tract}</dd></div>
                <div><dt className="text-muted">Глубина воды</dt><dd className="font-bold">{g.depth}</dd></div>
                <div><dt className="text-muted">Грунт</dt><dd className="font-bold">{g.soil}</dd></div>
                <div><dt className="text-muted">Вода</dt><dd className="font-bold">{g.water}</dd></div>
                <div className="sm:col-span-2"><dt className="text-muted">Что обычно ставим</dt><dd className="font-bold">{g.construction}</dd></div>
              </dl>
            </Draft>
          </div>
          <div className="card p-4 md:p-6">
            <WellScheme depth={g.depthMax} steel={g.steelDepth} kesson title={`Типовая скважина ${g.prep}: ~${g.depthMax} м`} />
            <p className="text-[13px] text-muted mt-2">{BUR.geoNote.text}</p>
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16"><div className="container-site prose-site">
        <h2>Что важно знать про бурение {g.prep}</h2>
        {g.about.map((t, i) => <p key={i}>{t}</p>)}
        <h2>Что входит в скважину под ключ</h2>
        <p>Бурение с обсадкой и фильтром, прокачка до чистой воды, замер дебита и уровней, паспорт и акт. Обустройство: кессон или скважинный адаптер, насос по паспорту, гидроаккумулятор и автоматика с защитой от сухого хода, ввод в дом в гильзе с утеплением и греющим кабелем, проход фундамента. Анализ воды после прокачки. Одна бригада, один договор с ценой метра, гарантия на скважину 5 лет.</p>
      </div></section>

      {objs.length > 0 && <section className="py-6"><div className="container-site"><h2 className="mb-6">Наши объекты рядом</h2><div className="grid gap-5 md:grid-cols-2">{objs.map((o) => <ObjectCard key={o.slug} o={o} />)}</div></div></section>}

      <Steps items={BUR.steps} title="Как проходит бурение" />
      <FAQ items={faq} title={`Вопросы про скважины ${g.prep}`} />
      <DrillLead source={`бурение гео ${g.name}`} title={`Инженер приедет ${g.prep} бесплатно`} />
      <ServiceLinks items={burServices.filter((x) => ["burenie", "obustrojstvo"].includes(x.cluster)).slice(0, 9)} href={BP.page} title="Решения под задачу" />
      <GeoLinks items={burGeo} href={BP.geo} current={g.slug} title="Бурение скважин в Иркутском районе" text={GEO_TEXT} />
    </>
  );
}

export default function Page({ params }: { params: { slug: string } }) {
  if (getBurService(params.slug)) return <ServicePage slug={params.slug} />;
  if (getBurGeo(params.slug)) return <GeoPage slug={params.slug} />;
  notFound();
}
