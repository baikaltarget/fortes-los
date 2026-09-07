import Link from "next/link";
import { meta, ldService } from "@/lib/seo";
import { ELEK, elekGeo, elekObjects, elekServicesByCluster, EP, HP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Steps from "@/components/Steps";
import FAQ from "@/components/FAQ";
import Reasons from "@/components/Reasons";
import ObjectCard from "@/components/ObjectCard";
import Draft from "@/components/Draft";
import ElectroBrands from "@/components/ElectroBrands";
import ElectroLead from "@/components/ElectroLead";
import ElectroScheme from "@/components/ElectroScheme";

const H = ELEK.hub;
export const metadata = meta({ title: H.title, description: H.description, path: EP.hub, image: H.ogImage });

/** Группировка гео по трактам — так удобнее искать свой посёлок */
function byTract() {
  const m = new Map<string, typeof elekGeo>();
  for (const g of elekGeo) m.set(g.tract, [...(m.get(g.tract) || []), g]);
  return [...m.entries()];
}

export default function Page() {
  return (
    <>
      <JsonLd data={ldService({ name: "Электромонтаж в частном доме в Иркутске", description: "Электрика частных домов, коттеджей и дач под ключ: ввод 15 кВт, щит, разводка под электроотопление, заземление, освещение, генератор с АВР — Иркутск и Иркутский район", path: EP.hub, priceFrom: 1200 })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Электрика", href: EP.hub }]} />
        <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          <div className="card p-6 md:p-10 shadow-card flex flex-col">
            <h1>{H.h1}</h1>
            <p className="mt-4 text-[17px] leading-relaxed text-ink/85 max-w-[58ch]">{H.lead}</p>
            <div className="mt-5 flex flex-wrap gap-2">{H.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>
            <div className="mt-auto pt-6 flex flex-wrap gap-3 items-center">
              <a href="#lead" className="btn-primary">Узнать цену за точку</a>
              <Link href={EP.calc} className="btn-outline">Рассчитать стоимость</Link>
            </div>
            <Draft note="ориентир по цене — подтвердить у клиента" className="mt-4"><p className="text-[14px] text-muted">{H.priceNote}</p></Draft>
          </div>
          <div className="card p-4 md:p-6 flex flex-col">
            <Draft note={`фото щита/монтажа от клиента (${H.photoWanted}) — пока фирменная схема`}>
              <ElectroScheme highlight="panel" title="Однолинейная схема щита дома 120 м² с электроотоплением" />
            </Draft>
            <div className="grid grid-cols-3 gap-2 mt-2 text-center">
              {H.stats.map(([a, b]) => <div key={a} className="rounded-btn bg-page p-3"><div className="text-2xl font-extrabold tracking-tight">{a}</div><div className="text-[12px] text-muted">{b}</div></div>)}
            </div>
          </div>
        </div>
      </div>

      {/* УСЛУГИ ПО КЛАСТЕРАМ */}
      <section className="py-12 md:py-16"><div className="container-site">
        <h2 className="mb-2">Что делаем</h2>
        <p className="text-muted max-w-[70ch] mb-8">Только частные дома, коттеджи, бани и дачи — квартирами не занимаемся. У каждой страницы — цена, что входит и ответы на вопросы. Котельные и тёплые полы, под которые считаем проводку, — в <Link href={HP.hub} className="text-brand underline">разделе «Отопление»</Link>.</p>
        <div className="grid gap-8">
          {ELEK.clusters.map((c) => {
            const list = elekServicesByCluster(c.slug);
            if (!list.length) return null;
            return (
              <div key={c.slug}>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3"><h3 className="text-[20px]">{c.title}</h3><span className="text-[14px] text-muted">{c.sub}</span></div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((s) => (
                    <Link key={s.slug} href={EP.page(s.slug)} className="card px-5 py-4 hover:shadow-card border border-transparent hover:border-line flex items-center justify-between gap-3">
                      <span><span className="font-medium block">{s.name}</span>{s.priceFrom && <span className="text-[13px] text-muted">{s.priceFrom}</span>}</span><span className="text-brand" aria-hidden>›</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div></section>

      {/* ЭЛЕКТРООТОПЛЕНИЕ — региональная специфика */}
      <section className="py-6"><div className="container-site">
        <div className="card p-6 md:p-10 grid gap-6 lg:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <h2>Проводка с расчётом под электроотопление</h2>
            <p className="mt-4 text-ink/85 max-w-[60ch]">В Иркутском районе газа нет, а электричество дешёвое — почти каждый дом греется электрокотлом, тёплыми полами и бойлером. Это 12–15 кВт постоянной нагрузки в −35 °C, а не чайник с телевизором. Поэтому щит собираем на 380 В с разбивкой по фазам, реле напряжения на каждую фазу и контактором на котёл, а линии к котлу, полам и бойлеру ведём отдельно медью 4–6 мм². Автоматы не выбивает, ТЭНы живут.</p>
            <div className="mt-6 flex flex-wrap gap-3"><Link href={EP.page("elektrika-pod-elektrootoplenie")} className="btn-primary">Как считаем нагрузку</Link><Link href={HP.page("ustanovka-elektrokotla")} className="btn-outline">Установка электрокотла</Link></div>
          </div>
          <ElectroScheme highlight="heating" title="Щит с выделенными линиями под электрокотёл, тёплый пол и бойлер" />
        </div>
      </div></section>

      {/* ОБЪЕКТЫ */}
      {elekObjects.length > 0 && (
        <section className="py-6"><div className="container-site">
          <h2 className="mb-2">Дома, где мы считали проводку под электроотопление</h2>
          <Draft note="свои объекты по электрике с фото и сметой — ждём от клиента"><p className="text-muted max-w-[70ch] mb-8">{ELEK.objectsNote}</p></Draft>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{elekObjects.map((o) => <ObjectCard key={o.slug} o={o} />)}</div>
        </div></section>
      )}

      <Reasons items={ELEK.reasons} title="Почему электрику заказывают у Фортес" />
      <ElectroBrands />

      {/* ГЕО */}
      <section id="geo" className="py-12 md:py-16 scroll-mt-28"><div className="container-site">
        <h2 className="mb-2">Электрик в Иркутском районе — по трактам и посёлкам</h2>
        <p className="text-muted max-w-[70ch] mb-6">Выезд инженера бесплатный. По каждому посёлку знаем, какие там сети: где просаживается напряжение зимой, где дают 15 кВт без вопросов, а где лучше сразу закладывать генератор.</p>
        <div className="grid gap-6">
          {byTract().map(([tract, list]) => (
            <div key={tract}>
              <h3 className="text-[17px] mb-2">{tract}</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {list.map((g) => (
                  <Link key={g.slug} href={EP.geo(g.slug)} className="card p-4 hover:shadow-card block">
                    <div className="font-bold">Электрик {g.prep}</div>
                    <div className="text-[13px] text-muted mt-1">{g.distance} · {g.grid.split(/[;,]/)[0]}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div></section>

      <Steps items={ELEK.steps} title="Как проходит электромонтаж" />
      <FAQ items={ELEK.faq} />
      <ElectroLead source="хаб электрика" />
    </>
  );
}
