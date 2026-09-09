import { notFound } from "next/navigation";
import Link from "next/link";
import { meta, ldService } from "@/lib/seo";
import { ELEK, elekServices, elekGeo, elekObjects, getElekService, getElekGeo, getAnyObject, elekServicesByCluster, EP, HP, VP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Steps from "@/components/Steps";
import FAQ from "@/components/FAQ";
import ServiceLinks from "@/components/ServiceLinks";
import GeoLinks from "@/components/GeoLinks";
import ObjectCard from "@/components/ObjectCard";
import Draft from "@/components/Draft";
import MdTable from "@/components/MdTable";
import ElectroLead from "@/components/ElectroLead";
import ElectroBrands from "@/components/ElectroBrands";
import ElectroScheme, { SCHEME_BY_SLUG } from "@/components/ElectroScheme";

export const dynamicParams = false;
export function generateStaticParams() {
  return [...elekServices.map((s) => ({ slug: s.slug })), ...elekGeo.map((g) => ({ slug: g.slug }))];
}
export function generateMetadata({ params }: { params: { slug: string } }) {
  const s = getElekService(params.slug);
  if (s) return meta({ title: s.title, description: s.description, path: EP.page(s.slug) });
  const g = getElekGeo(params.slug);
  if (g) return meta({
    title: `Электромонтаж в частном доме ${g.prep} под ключ | Фортес`,
    description: `Электрика в частном доме ${g.prep}: ввод 15 кВт, щит с реле напряжения, разводка под электрокотёл, заземление. Сети: ${g.grid.split(/[;,(]/)[0].trim()}. Инженер бесплатно.`,
    path: EP.geo(g.slug),
  });
  return {};
}

const GEO_TEXT = "Выезд инженера бесплатный. По каждому посёлку знаем состояние сетей и типовые лимиты мощности.";
const MAIN_CLUSTERS = ["dom", "raboty"];

function ServicePage({ slug }: { slug: string }) {
  const s = getElekService(slug)!;
  const related = (s.objects || []).map((o) => getAnyObject(o)).filter(Boolean) as typeof elekObjects;
  const siblings = elekServicesByCluster(s.cluster).filter((x) => x.slug !== s.slug);
  const others = elekServices.filter((x) => x.cluster !== s.cluster);
  const links = [...siblings, ...others].slice(0, 9);
  const cluster = ELEK.clusters.find((c) => c.slug === s.cluster);
  const sch = SCHEME_BY_SLUG[s.slug] || { highlight: "panel" as const };
  return (
    <>
      <JsonLd data={ldService({ name: s.name, description: s.description, path: EP.page(s.slug) })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Электрика", href: EP.hub }, { name: s.name, href: EP.page(s.slug) }]} />
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] items-stretch">
          <div className="card p-6 md:p-10 shadow-card flex flex-col">
            <h1>{s.h1}</h1>
            <p className="mt-5 text-[18px] leading-relaxed text-ink/85 max-w-[58ch]">{s.lead}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {(s.chips || ELEK.hub.chips).map((c) => <span key={c} className="chip">{c}</span>)}
            </div>
            <div className="mt-auto pt-8 flex flex-wrap gap-3 items-center">
              <a href="#lead" className="btn-primary">Узнать цену</a>
              <Link href={EP.calc} className="btn-outline">Рассчитать стоимость</Link>
              {s.priceFrom && <Draft on={!!s.priceDraft} note="цена — ориентир, уточнить"><span className="text-[15px] text-muted">{s.priceFrom}</span></Draft>}
            </div>
            {s.confirmWithClient && <Draft note={s.confirmWithClient} className="mt-4"><p className="text-[13px] text-muted">Уточнить у клиента: {s.confirmWithClient}</p></Draft>}
          </div>
          <div className="card p-3 md:p-4 flex">
            {s.heroImage ? (
              <img src={s.heroImage} alt={s.heroImageAlt || s.h1} className="w-full h-full rounded-card object-cover" width="1254" height="1254" fetchPriority="high" />
            ) : (
              <Draft note={`фото от клиента: ${s.photoWanted || "hero-" + s.slug + ".webp"} — пока схема`} className="w-full">
                <ElectroScheme highlight={sch.highlight} groups={sch.groups} avr={sch.avr} phases={sch.phases} title={s.h1} />
              </Draft>
            )}
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16"><div className="container-site prose-site">
        {s.sections.map((sec) => (
          <div key={sec.h2}><h2>{sec.h2}</h2>{sec.p.map((t, i) => t.startsWith("|") ? <MdTable key={i} md={t} /> : <p key={i}>{t}</p>)}</div>
        ))}
        {(s.slug === "elektrika-pod-elektrootoplenie" || s.slug === "elektrika-v-chastnom-dome-pod-klyuch") && (
          <p className="text-[15px] text-muted">Сам электрокотёл, тёплые полы и котельная — в разделе <Link href={HP.hub} className="text-brand underline">«Отопление»</Link>: <Link href={HP.page("ustanovka-elektrokotla")} className="text-brand underline">установка электрокотла</Link>, <Link href={HP.page("montazh-teplogo-pola")} className="text-brand underline">монтаж тёплого пола</Link>. Электрику и отопление делаем одним договором.</p>
        )}
        {s.slug === "elektrika-v-bane" && (
          <p className="text-[15px] text-muted">Вода, канализация и тёплый пол в бане — в разделе <Link href={VP.hub} className="text-brand underline">«Водоснабжение»</Link>. Баню 60 м² в «Ангарском Береге» сделали одной бригадой целиком.</p>
        )}
      </div></section>

      {related.length > 0 && (
        <section className="py-6"><div className="container-site"><h2 className="mb-2">Дома с электроотоплением, которые мы делали</h2><Draft note="свои объекты по электрике — ждём от клиента"><p className="text-muted mb-6 max-w-[70ch]">Котельные и тёплые полы на этих объектах — наши; под такую нагрузку считаем щит и проводку.</p></Draft><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{related.map((o) => <ObjectCard key={o.slug} o={o} />)}</div></div></section>
      )}

      {(s.cluster === "raboty" || s.cluster === "zashchita") && <ElectroBrands />}
      <Steps items={ELEK.steps} title="Как проходит работа" />
      <FAQ items={s.faq} />
      <ElectroLead source={`электрика: ${s.name}`} />
      <ServiceLinks items={links} href={EP.page} title={cluster ? `${cluster.title}: смежные задачи` : "Смежные задачи"} />
      <GeoLinks items={elekGeo} href={EP.geo} title="Электромонтаж в Иркутском районе" text={GEO_TEXT} />
    </>
  );
}

function GeoPage({ slug }: { slug: string }) {
  const g = getElekGeo(slug)!;
  const objs = (g.objects || []).map((o) => getAnyObject(o)).filter(Boolean) as typeof elekObjects;
  const weak = /просад|перегруж|слаб|170|180/i.test(g.grid);
  const big = /30 кВт|30–|до 30|запас/i.test(g.grid);
  const wood = /брус|бревн|дерев/i.test(g.housing);
  const rock = /скал|камен/i.test(g.grid + g.housing);
  const faq = [
    { q: `Сколько стоит электрика в доме ${g.prep}?`, a: `Дом под ключ — от 3 500 ₽/м² с котельной, всеми материалами и работой: дом 120 м² — от 420 000 ₽. По точкам: от 1 400 ₽ в газобетоне и каркасе, от 2 000 ₽ в брусе; щит на 380 В от 45 000 ₽, ввод от 30 000 ₽, заземление от 18 000 ₽. ${g.distance} от Иркутска — рабочая зона, выезд инженера бесплатный, смета фиксируется в договоре.` },
    { q: `Какие сети ${g.prep} и хватит ли мощности?`, a: `${g.grid[0].toUpperCase() + g.grid.slice(1)}. ${weak ? "При просадках напряжения ставим реле контроля на каждую фазу с задержкой включения, нагрузку котла и бойлера раскидываем по фазам, при необходимости — стабилизатор." : ""} ${big ? "Если планируете дом от 180 м² на электроотоплении — подаём заявку на увеличение мощности вместе с вводом." : "Для дома до 150 м² с электрокотлом 15 кВт на 380 В хватает при правильной разбивке по фазам."}`.replace(/\s+/g, " ") },
    { q: `Какая проводка нужна для домов ${g.prep}?`, a: `${g.housing[0].toUpperCase() + g.housing.slice(1)}. ${wood ? "В брусе и бревне — кабель ВВГнг-LS в металлорукаве с локализационной способностью или стальной трубе, металлические подрозетники, запас на усадку; открытый вариант — кабель-канал или ретро на изоляторах." : "В газобетоне и каркасе — скрытая проводка в гофре до штукатурки или обшивки, штробы с пылесосом, подрозетники на гипс."} ${rock ? "Заземление в каменистом грунте — треугольник из уголка или горизонтальный контур с замером." : "Заземление — модульно-штыревое, 6 м в глину или суглинок, с протоколом."}` },
    { q: `Как быстро сделаете ${g.prep}?`, a: `Инженер — в течение 2–3 дней после заявки. Ввод и щит учёта — день. Черновая разводка дома 100–150 м² — 3–6 дней до отделки, чистовой монтаж механизмов и светильников — 1–2 дня после. Материалы на складе в Иркутске.` },
  ];
  return (
    <>
      <JsonLd data={ldService({ name: `Электромонтаж в частном доме ${g.prep}`, description: `Ввод, щит, разводка под электроотопление, заземление, освещение под ключ ${g.prep}`, path: EP.geo(g.slug), area: g.name, priceFrom: 1400 })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Электрика", href: EP.hub }, { name: g.name, href: EP.geo(g.slug) }]} />
        <div className="card p-6 md:p-10 shadow-card">
          <h1>Электромонтаж в частном доме {g.prep} под ключ</h1>
          <p className="mt-5 text-[18px] leading-relaxed text-ink/85 max-w-[62ch]">Делаем электрику домов {g.prep} целиком — от ввода до розеток, а не разовые выезды: ввод от опоры на 15 кВт, щит с реле напряжения, разводку по комнатам с расчётом под электрокотёл и тёплые полы, заземление, освещение в доме и на участке, при желании — резерв от генератора. Одна бригада с отоплением и водой, цена за точку известна до начала работ.</p>
          <div className="mt-5 flex flex-wrap gap-2">{ELEK.hub.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#lead" className="btn-primary">Инженер {g.prep} бесплатно</a><Link href={EP.calc} className="btn-outline">Рассчитать стоимость</Link></div>
          <Draft on={ELEK.geoNote.draft} note="сети / лимиты по посёлку — сверить с клиентом" className="mt-6">
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-[15px] border-t border-line pt-5">
              <div><dt className="text-muted">Расстояние от Иркутска</dt><dd className="font-bold">{g.distance}, {g.tract}</dd></div>
              <div><dt className="text-muted">Застройка</dt><dd className="font-bold">{g.housing}</dd></div>
              <div className="sm:col-span-2"><dt className="text-muted">Сети и мощность</dt><dd className="font-bold">{g.grid}</dd></div>
            </dl>
          </Draft>
          <p className="text-[13px] text-muted mt-3">{ELEK.geoNote.text}</p>
        </div>
      </div>

      <section className="py-12 md:py-16"><div className="container-site prose-site">
        <h2>Что важно знать про электрику {g.prep}</h2>
        {g.about.map((t, i) => <p key={i}>{t}</p>)}
        <h2>Что входит в электрику под ключ</h2>
        <p>Ввод от опоры сетевой организации: СИП на фасад или трубостойку, либо кабель в земле; щит учёта по техусловиям, помощь с заявкой на 15 кВт. Распределительный щит на 380 В: вводной автомат, УЗИП, реле напряжения на каждую фазу, УЗО и автоматы по группам, контактор на котёл, схема на дверце. Разводка по комнатам кабелем ВВГнг-LS по плану мебели, отдельные линии на котёл, тёплые полы, бойлер, кухню, санузлы, улицу и баню. Контур заземления с протоколом, система уравнивания потенциалов в санузлах. Освещение, розетки и свет на участке. Исполнительная схема, проверка УЗО и реле, гарантия на работы до 5 лет, дом застрахован на сумму договора.</p>
      </div></section>

      {objs.length > 0 && <section className="py-6"><div className="container-site"><h2 className="mb-6">Наши объекты рядом</h2><div className="grid gap-5 md:grid-cols-2">{objs.map((o) => <ObjectCard key={o.slug} o={o} />)}</div></div></section>}

      <Steps items={ELEK.steps} title="Как проходит электромонтаж" />
      <FAQ items={faq} title={`Вопросы про электрику ${g.prep}`} />
      <ElectroLead source={`электрика гео ${g.name}`} title={`Инженер приедет ${g.prep} бесплатно`} />
      <ServiceLinks items={elekServices.filter((x) => MAIN_CLUSTERS.includes(x.cluster)).slice(0, 9)} href={EP.page} title="Решения под задачу" />
      <GeoLinks items={elekGeo} href={EP.geo} current={g.slug} title="Электромонтаж в Иркутском районе" text={GEO_TEXT} />
    </>
  );
}

export default function Page({ params }: { params: { slug: string } }) {
  if (getElekService(params.slug)) return <ServicePage slug={params.slug} />;
  if (getElekGeo(params.slug)) return <GeoPage slug={params.slug} />;
  notFound();
}
