import { notFound } from "next/navigation";
import Link from "next/link";
import { meta, ldService } from "@/lib/seo";
import { VENT, ventServices, ventGeo, ventObjects, getVentService, getVentGeo, getAnyObject, ventServicesByCluster, NP, HP, EP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Steps from "@/components/Steps";
import FAQ from "@/components/FAQ";
import ServiceLinks from "@/components/ServiceLinks";
import GeoLinks from "@/components/GeoLinks";
import ObjectCard from "@/components/ObjectCard";
import Draft from "@/components/Draft";
import MdTable from "@/components/MdTable";
import RichP from "@/components/RichP";
import VentLead from "@/components/VentLead";
import VentBrands from "@/components/VentBrands";
import VentScheme, { VENT_SCHEME_BY_SLUG } from "@/components/VentScheme";

export const dynamicParams = false;
export function generateStaticParams() {
  return [...ventServices.map((s) => ({ slug: s.slug })), ...ventGeo.map((g) => ({ slug: g.slug }))];
}
export function generateMetadata({ params }: { params: { slug: string } }) {
  const s = getVentService(params.slug);
  if (s) return meta({ title: s.title, description: s.description, path: NP.page(s.slug) });
  const g = getVentGeo(params.slug);
  if (g) return meta({
    title: `Вентиляция в частном доме ${g.prep} под ключ | Фортес`,
    description: `Вентиляция частного дома ${g.prep}: вытяжки санузлов и кухни, приток или установка с рекуперацией Turkov, воздуховоды до потолков. От 50 000 ₽, инженер бесплатно.`,
    path: NP.geo(g.slug),
  });
  return {};
}

const GEO_TEXT = "Выезд инженера бесплатный. Знаем застройку каждого посёлка и типовые проблемы с воздухом в домах.";

function ServicePage({ slug }: { slug: string }) {
  const s = getVentService(slug)!;
  const related = (s.objects || []).map((o) => getAnyObject(o)).filter(Boolean) as typeof ventObjects;
  const siblings = ventServicesByCluster(s.cluster).filter((x) => x.slug !== s.slug);
  const others = ventServices.filter((x) => x.cluster !== s.cluster);
  const links = [...siblings, ...others].slice(0, 9);
  const cluster = VENT.clusters.find((c) => c.slug === s.cluster);
  const sch = VENT_SCHEME_BY_SLUG[s.slug] || { highlight: "all" as const };
  const ownPhoto = s.heroImage && !s.heroImage.includes("/img/ventilyaciya/");
  return (
    <>
      <JsonLd data={ldService({ name: s.name, description: s.description, path: NP.page(s.slug) })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Вентиляция", href: NP.hub }, { name: s.name, href: NP.page(s.slug) }]} />
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] items-stretch">
          <div className="card p-6 md:p-10 shadow-card flex flex-col">
            <h1>{s.h1}</h1>
            <p className="mt-5 text-[18px] leading-relaxed text-ink/85 max-w-[58ch]">{s.lead}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {(s.chips || VENT.hub.chips).map((c) => <span key={c} className="chip">{c}</span>)}
            </div>
            <div className="mt-auto pt-8 flex flex-wrap gap-3 items-center">
              <a href="#lead" className="btn-primary">Узнать цену</a>
              <Link href={NP.calc} className="btn-outline">Рассчитать стоимость</Link>
              {s.priceFrom && <Draft on={!!s.priceDraft} note="цена — ориентир, уточнить"><span className="text-[15px] text-muted">{s.priceFrom}</span></Draft>}
            </div>
            {s.confirmWithClient && <Draft note={s.confirmWithClient} className="mt-4"><p className="text-[13px] text-muted">Уточнить у клиента: {s.confirmWithClient}</p></Draft>}
          </div>
          <div className="card p-3 md:p-4 flex">
            {ownPhoto ? (
              <img src={s.heroImage} alt={s.heroImageAlt || s.h1} className="w-full h-full rounded-card object-cover" width="1254" height="1254" fetchPriority="high" />
            ) : (
              <Draft note={`фото от клиента: ${s.heroImage || "hero-" + s.slug + ".webp"} — пока схема`} className="w-full">
                <VentScheme highlight={sch.highlight} recuperator={sch.recuperator !== false} title={s.h1} />
              </Draft>
            )}
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16"><div className="container-site prose-site">
        {s.sections.map((sec) => (
          <div key={sec.h2}><h2>{sec.h2}</h2>{sec.p.map((t, i) => t.startsWith("|") ? <MdTable key={i} md={t} /> : <RichP key={i} text={t} />)}</div>
        ))}
        {s.cluster === "dom" && (
          <p className="text-[15px] text-muted">Отопление, под которое считаем приточный воздух, — в разделе <Link href={HP.hub} className="text-brand underline">«Отопление»</Link>; электрика под установку и вытяжки — в <Link href={EP.hub} className="text-brand underline">«Электрике»</Link>. Делаем одним договором.</p>
        )}
      </div></section>

      {related.length > 0 && (
        <section className="py-6"><div className="container-site"><h2 className="mb-2">Объекты, где делали инженерку целиком</h2><Draft note="свои объекты по вентиляции — ждём от клиента"><p className="text-muted mb-6 max-w-[70ch]">{VENT.objectsNote}</p></Draft><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{related.map((o) => <ObjectCard key={o.slug} o={o} />)}</div></div></section>
      )}

      {s.cluster !== "proekt" && <VentBrands />}
      <Steps items={VENT.steps} title="Как проходит работа" />
      <FAQ items={s.faq} />
      <VentLead source={`вентиляция: ${s.name}`} />
      <ServiceLinks items={links} href={NP.page} title={cluster ? `${cluster.title}: смежные задачи` : "Смежные задачи"} />
      <GeoLinks items={ventGeo} href={NP.geo} title="Вентиляция в Иркутском районе" text={GEO_TEXT} />
    </>
  );
}

function GeoPage({ slug }: { slug: string }) {
  const g = getVentGeo(slug)!;
  const objs = (g.objects || []).map((o) => getAnyObject(o)).filter(Boolean) as typeof ventObjects;
  const wood = /брус|бревн|дерев/i.test(g.housing);
  const big = /200|250|300|400|450|коттедж/i.test(g.housing);
  const wet = /сыр|вод|пойм|низк|туман/i.test(g.air);
  const faq = [
    { q: `Сколько стоит вентиляция в доме ${g.prep}?`, a: `От 50 000 ₽ под ключ за вытяжки санузлов и кухни с приточными клапанами. ${big ? "Для домов от 200 м² с бассейном или сауной считаем приточно-вытяжную установку Turkov на 500 м³/ч и больше — по расчёту." : "Приточно-вытяжная установка с рекуперацией Turkov и воздуховоды в каждую комнату — по расчёту после выезда."} ${g.distance} от Иркутска — рабочая зона, выезд инженера бесплатный, смета фиксируется в договоре.` },
    { q: `Какая вентиляция нужна домам ${g.prep}?`, a: `${g.housing[0].toUpperCase() + g.housing.slice(1)}. ${wood ? "В брусе и бревне обязательно приток на горение к печи или ТТ-котлу и защита от опрокидывания тяги; воздуховоды ведём по чердаку с запасом на усадку." : "В газобетоне и каркасе контур герметичный — без принудительной вентиляции конденсат на окнах в первую же зиму; закладываем воздуховоды до потолков."} ${wet ? "Участок сырой — отдельная вытяжка цоколя и подполья, влагозащищённые вентиляторы." : "Забор воздуха — с фильтром F7 от пыли и дыма."}` },
    { q: `Специфика по воздуху ${g.prep}?`, a: `${g.air[0].toUpperCase() + g.air.slice(1)}. Учитываем это при выборе схемы и оборудования на бесплатном выезде.` },
    { q: `Как быстро сделаете ${g.prep}?`, a: `Инженер — в течение 2–3 дней после заявки. Вытяжки и клапаны — 1–2 дня, приточно-вытяжная установка с воздуховодами — 3–5 дней на этапе до потолков. Оборудование Turkov — со склада или под заказ 1–2 недели.` },
  ];
  return (
    <>
      <JsonLd data={ldService({ name: `Вентиляция в частном доме ${g.prep}`, description: `Вытяжки, приток, приточно-вытяжная установка с рекуперацией, воздуховоды под ключ ${g.prep}`, path: NP.geo(g.slug), area: g.name, priceFrom: 50000 })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Вентиляция", href: NP.hub }, { name: g.name, href: NP.geo(g.slug) }]} />
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] items-stretch">
        <div className="card p-6 md:p-10 shadow-card">
          <h1>Вентиляция в частном доме {g.prep} под ключ</h1>
          <p className="mt-5 text-[18px] leading-relaxed text-ink/85 max-w-[62ch]">Считаем воздухообмен по комнатам и делаем вентиляцию домов {g.prep} целиком: вытяжки санузлов, кухни и котельной, приток через клапаны, бризеры или приточно-вытяжную установку с рекуперацией Turkov, воздуховоды в утеплении до потолков, пусконаладка с паспортом. Одна бригада с отоплением и электрикой, цена известна до начала работ.</p>
          <div className="mt-5 flex flex-wrap gap-2">{VENT.hub.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#lead" className="btn-primary">Инженер {g.prep} бесплатно</a><Link href={NP.calc} className="btn-outline">Рассчитать стоимость</Link></div>
          <Draft on={VENT.geoNote.draft} note="специфика по посёлку — сверить с клиентом" className="mt-6">
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-[15px] border-t border-line pt-5">
              <div><dt className="text-muted">Расстояние от Иркутска</dt><dd className="font-bold">{g.distance}, {g.tract}</dd></div>
              <div><dt className="text-muted">Застройка</dt><dd className="font-bold">{g.housing}</dd></div>
              <div className="sm:col-span-2"><dt className="text-muted">Специфика по воздуху</dt><dd className="font-bold">{g.air}</dd></div>
            </dl>
          </Draft>
          <p className="text-[13px] text-muted mt-3">{VENT.geoNote.text}</p>
        </div>
        <div className="card p-3 md:p-4 flex">
          <Draft note="фото объекта в посёлке — пока схема" className="w-full">
            <VentScheme highlight={wet ? "exhaust" : "all"} title={`Схема вентиляции дома ${g.prep}`} />
          </Draft>
        </div>
        </div>
      </div>

      <section className="py-12 md:py-16"><div className="container-site prose-site">
        <h2>Что важно знать про вентиляцию {g.prep}</h2>
        {g.about.map((t, i) => <p key={i}>{t}</p>)}
        <h2>Что входит в вентиляцию под ключ</h2>
        <p>Расчёт воздухообмена по СП 60 для каждого помещения. Вытяжка санузлов, кухни, котельной и постирочной канальными вентиляторами с таймерами и датчиками влажности, утеплённые воздуховоды на чердаке, проход кровли выше конька, обратные клапаны. Приток — клапаны в стенах спален, бризеры с подогревом или приточно-вытяжная установка с рекуперацией Turkov с воздуховодами и шумоглушителями в каждую жилую комнату. Электрика под установку и вентиляторы, автоматика с расписанием. Пусконаладка с замером расходов по каждой решётке, балансировка, паспорт системы и инструкция по замене фильтров.</p>
      </div></section>

      {objs.length > 0 && <section className="py-6"><div className="container-site"><h2 className="mb-6">Наши объекты рядом</h2><div className="grid gap-5 md:grid-cols-2">{objs.map((o) => <ObjectCard key={o.slug} o={o} />)}</div></div></section>}

      <Steps items={VENT.steps} title="Как проходит монтаж вентиляции" />
      <FAQ items={faq} title={`Вопросы про вентиляцию ${g.prep}`} />
      <VentLead source={`вентиляция гео ${g.name}`} title={`Инженер приедет ${g.prep} бесплатно`} />
      <ServiceLinks items={ventServices.filter((x) => x.cluster === "dom").slice(0, 9)} href={NP.page} title="Решения под задачу" />
      <GeoLinks items={ventGeo} href={NP.geo} current={g.slug} title="Вентиляция в Иркутском районе" text={GEO_TEXT} />
    </>
  );
}

export default function Page({ params }: { params: { slug: string } }) {
  if (getVentService(params.slug)) return <ServicePage slug={params.slug} />;
  if (getVentGeo(params.slug)) return <GeoPage slug={params.slug} />;
  notFound();
}
