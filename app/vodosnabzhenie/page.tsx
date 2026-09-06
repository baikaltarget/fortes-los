import Link from "next/link";
import { meta, ldService } from "@/lib/seo";
import { VODA, vodaGeo, vodaObjects, vodaServicesByCluster, VP, BP, P } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Steps from "@/components/Steps";
import FAQ from "@/components/FAQ";
import Reasons from "@/components/Reasons";
import ObjectCard from "@/components/ObjectCard";
import WaterBrands from "@/components/WaterBrands";
import WaterLead from "@/components/WaterLead";

const H = VODA.hub;
export const metadata = meta({ title: H.title, description: H.description, path: VP.hub, image: H.ogImage });

export default function Page() {
  return (
    <>
      <JsonLd data={ldService({ name: "Водоснабжение и канализация частного дома в Иркутске", description: "Монтаж водоснабжения и канализации в частных домах под ключ: ввод воды, разводка ХВС и ГВС, внутренняя и наружная канализация, бойлеры, автоматика, подключение к Водоканалу — Иркутск и Иркутский район", path: VP.hub, priceFrom: 4500 })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Водоснабжение", href: VP.hub }]} />
        <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          <div className="card p-6 md:p-10 shadow-card flex flex-col">
            <h1>{H.h1}</h1>
            <p className="mt-4 text-[17px] leading-relaxed text-ink/85 max-w-[58ch]">{H.lead}</p>
            <div className="mt-5 flex flex-wrap gap-2">{H.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>
            <div className="mt-auto pt-6 flex flex-wrap gap-3 items-center">
              <a href="#lead" className="btn-primary">Узнать цену за точку</a>
              <Link href={VP.calc} className="btn-outline">Рассчитать стоимость</Link>
            </div>
            <p className="mt-4 text-[14px] text-muted">{H.priceNote}</p>
          </div>
          <div className="card p-4 md:p-6 flex flex-col">
            <img src={H.heroImage} alt={H.heroImageAlt} className="w-full h-auto rounded-card" width="1254" height="1254" fetchPriority="high" />
            <div className="grid grid-cols-3 gap-2 mt-2 text-center">
              {H.stats.map(([a, b]) => <div key={a} className="rounded-btn bg-page p-3"><div className="text-2xl font-extrabold tracking-tight">{a}</div><div className="text-[12px] text-muted">{b}</div></div>)}
            </div>
          </div>
        </div>
      </div>

      {/* УСЛУГИ ПО КЛАСТЕРАМ */}
      <section className="py-12 md:py-16"><div className="container-site">
        <h2 className="mb-2">Что делаем</h2>
        <p className="text-muted max-w-[70ch] mb-8">Всё, что течёт в доме: от трубы в траншее до смесителя. У каждой страницы — цена, что входит и ответы на вопросы. Скважины и кессоны — в <Link href={BP.hub} className="text-brand underline">разделе «Бурение»</Link>, септики и станции — в <Link href={P.hub} className="text-brand underline">разделе «Канализация»</Link>.</p>
        <div className="grid gap-8">
          {VODA.clusters.map((c) => {
            const list = vodaServicesByCluster(c.slug);
            if (!list.length) return null;
            return (
              <div key={c.slug}>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3"><h3 className="text-[20px]">{c.title}</h3><span className="text-[14px] text-muted">{c.sub}</span></div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((s) => (
                    <Link key={s.slug} href={VP.page(s.slug)} className="card px-5 py-4 hover:shadow-card border border-transparent hover:border-line flex items-center justify-between gap-3">
                      <span><span className="font-medium block">{s.name}</span>{s.priceFrom && <span className="text-[13px] text-muted">{s.priceFrom}</span>}</span><span className="text-brand" aria-hidden>›</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div></section>

      {/* ОБЪЕКТЫ */}
      <section className="py-6"><div className="container-site">
        <h2 className="mb-2">Объекты с водой и канализацией — цены под ключ</h2>
        <p className="text-muted max-w-[70ch] mb-8">Баня с бойлером и коллектором, дом с рециркуляцией ГВС на два этажа, 183 м трубопроводов на четыре постройки, кессон с вводом за 90 957 ₽ — что сделали и сколько это стоило.</p>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{vodaObjects.map((o) => <ObjectCard key={o.slug} o={o} />)}</div>
      </div></section>

      <Reasons items={VODA.reasons} title="Почему воду и канализацию заказывают у Фортес" />
      <WaterBrands />

      {/* ГЕО */}
      <section id="geo" className="py-12 md:py-16 scroll-mt-28"><div className="container-site">
        <h2 className="mb-2">Водоснабжение в Иркутском районе</h2>
        <p className="text-muted max-w-[70ch] mb-6">Выезд инженера бесплатный. По каждому посёлку знаем, откуда там вода — своя скважина, колодец или сеть — и куда уходит канализация.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {vodaGeo.map((g) => (
            <Link key={g.slug} href={VP.geo(g.slug)} className="card p-4 hover:shadow-card block">
              <div className="font-bold">Вода и канализация {g.prep}</div>
              <div className="text-[13px] text-muted mt-1">{g.distance} · {g.tract}</div>
            </Link>
          ))}
        </div>
      </div></section>

      <Steps items={VODA.steps} title="Как проходит монтаж" />
      <FAQ items={VODA.faq} />
      <WaterLead source="хаб водоснабжение" />
    </>
  );
}
