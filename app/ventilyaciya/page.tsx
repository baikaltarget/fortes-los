import Link from "next/link";
import { meta, ldService } from "@/lib/seo";
import { VENT, ventGeo, ventObjects, ventServicesByCluster, NP, HP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Steps from "@/components/Steps";
import FAQ from "@/components/FAQ";
import Reasons from "@/components/Reasons";
import ObjectCard from "@/components/ObjectCard";
import Draft from "@/components/Draft";
import VentBrands from "@/components/VentBrands";
import VentLead from "@/components/VentLead";
import VentScheme from "@/components/VentScheme";

const H = VENT.hub;
export const metadata = meta({ title: H.title, description: H.description, path: NP.hub, image: H.ogImage });

/** Группировка гео по трактам */
function byTract() {
  const m = new Map<string, typeof ventGeo>();
  for (const g of ventGeo) m.set(g.tract, [...(m.get(g.tract) || []), g]);
  return [...m.entries()];
}

export default function Page() {
  return (
    <>
      <JsonLd data={ldService({ name: "Монтаж вентиляции в Иркутске", description: "Вентиляция частных домов и бань под ключ, приточно-вытяжные установки с рекуперацией Turkov, промышленная вентиляция и аспирация — Иркутск и Иркутский район", path: NP.hub, priceFrom: 50000 })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Вентиляция", href: NP.hub }]} />
        <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          <div className="card p-6 md:p-10 shadow-card flex flex-col">
            <h1>{H.h1}</h1>
            <p className="mt-4 text-[17px] leading-relaxed text-ink/85 max-w-[58ch]">{H.lead}</p>
            <div className="mt-5 flex flex-wrap gap-2">{H.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>
            <div className="mt-auto pt-6 flex flex-wrap gap-3 items-center">
              <a href="#lead" className="btn-primary">Узнать цену</a>
              <Link href={NP.calc} className="btn-outline">Рассчитать стоимость</Link>
            </div>
            <p className="mt-4 text-[14px] text-muted">{H.priceNote}</p>
          </div>
          <div className="card p-4 md:p-6 flex flex-col">
            <Draft note={`фото установки/воздуховодов от клиента (${H.photoWanted}) — пока фирменная схема`}>
              <VentScheme highlight="all" title="Схема воздухообмена дома с приточно-вытяжной установкой с рекуперацией" />
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
        <p className="text-muted max-w-[70ch] mb-8">Частные дома и бани — под ключ с расчётом воздухообмена; коммерческие и промышленные объекты — с проектом, паспортами и НДС. Отопление, под которое считаем приточный воздух, — в <Link href={HP.hub} className="text-brand underline">разделе «Отопление»</Link>.</p>
        <div className="grid gap-8">
          {VENT.clusters.map((c) => {
            const list = ventServicesByCluster(c.slug);
            if (!list.length) return null;
            return (
              <div key={c.slug}>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3"><h3 className="text-[20px]">{c.title}</h3><span className="text-[14px] text-muted">{c.sub}</span></div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((s) => (
                    <Link key={s.slug} href={NP.page(s.slug)} className="card px-5 py-4 hover:shadow-card border border-transparent hover:border-line flex items-center justify-between gap-3">
                      <span><span className="font-medium block">{s.name}</span>{s.priceFrom && <span className="text-[13px] text-muted">{s.priceFrom}</span>}</span><span className="text-brand" aria-hidden>›</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div></section>

      {/* РЕКУПЕРАЦИЯ — почему для Иркутска */}
      <section className="py-6"><div className="container-site">
        <div className="card p-6 md:p-10 grid gap-6 lg:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <h2>Рекуперация: зачем она в −35 °C</h2>
            <p className="mt-4 text-ink/85 max-w-[60ch]">Дом 150 м² с нормальным воздухообменом выбрасывает на улицу 300 м³ тёплого воздуха в час. Греть столько же свежего с −35 °C — 3–4 кВт постоянно, а лимит ввода в посёлке 15 кВт и котёл уже занят. Приточно-вытяжная установка с рекуперацией отдаёт тепло вытяжного воздуха приточному: возвращается до 80%, догрев — меньше киловатта, окна и стены сухие, в спальне тихо и свежо. Ставим Turkov — российские установки с защитой от обмерзания, как официальный дилер.</p>
            <div className="mt-6 flex flex-wrap gap-3"><Link href={NP.page("pritochno-vytyazhnaya-ventilyaciya-s-rekuperaciej")} className="btn-primary">Приточно-вытяжная с рекуперацией</Link><Link href={NP.page("ventilyaciya-v-chastnom-dome")} className="btn-outline">Схемы для дома</Link></div>
          </div>
          <VentScheme highlight="unit" title="Установка с рекуперацией на чердаке: приток в спальни, вытяжка из санузлов и кухни" />
        </div>
      </div></section>

      {/* ОБЪЕКТЫ */}
      {ventObjects.length > 0 && (
        <section className="py-6"><div className="container-site">
          <h2 className="mb-2">Дома и помещения, где делали инженерку целиком</h2>
          <Draft note="свои объекты по вентиляции с фото и сметой — ждём от клиента"><p className="text-muted max-w-[70ch] mb-8">{VENT.objectsNote}</p></Draft>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{ventObjects.map((o) => <ObjectCard key={o.slug} o={o} />)}</div>
        </div></section>
      )}

      <Reasons items={VENT.reasons} title="Почему вентиляцию заказывают у Фортес" />
      <VentBrands />

      {/* ГЕО */}
      <section id="geo" className="py-12 md:py-16 scroll-mt-28"><div className="container-site">
        <h2 className="mb-2">Вентиляция в Иркутском районе — по трактам и посёлкам</h2>
        <p className="text-muted max-w-[70ch] mb-6">Выезд инженера бесплатный. Знаем застройку каждого посёлка: где в первую зиму текут окна у газобетона, где сырые цоколи у воды, а где нужны фильтры от дыма и пыли.</p>
        <div className="grid gap-6">
          {byTract().map(([tract, list]) => (
            <div key={tract}>
              <h3 className="text-[17px] mb-2">{tract}</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {list.map((g) => (
                  <Link key={g.slug} href={NP.geo(g.slug)} className="card p-4 hover:shadow-card block">
                    <div className="font-bold">Вентиляция {g.prep}</div>
                    <div className="text-[13px] text-muted mt-1">{g.distance} · {g.housing.split(/[;,]/)[0]}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div></section>

      <Steps items={VENT.steps} title="Как проходит монтаж вентиляции" />
      <FAQ items={VENT.faq} />
      <VentLead source="хаб вентиляция" />
    </>
  );
}
