import Link from "next/link";
import { meta, ldService } from "@/lib/seo";
import { BUR, burGeo, burObjects, burServicesByCluster, BP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Steps from "@/components/Steps";
import FAQ from "@/components/FAQ";
import Reasons from "@/components/Reasons";
import ObjectCard from "@/components/ObjectCard";
import DrillBrands from "@/components/DrillBrands";
import DrillLead from "@/components/DrillLead";
import WellScheme from "@/components/WellScheme";

const H = BUR.hub;
export const metadata = meta({ title: H.title, description: H.description, path: BP.hub, image: H.ogImage });

export default function Page() {
  return (
    <>
      <JsonLd data={ldService({ name: "Бурение скважин на воду в Иркутске", description: "Бурение и обустройство скважин на воду под ключ для частных домов, дач, СНТ и предприятий в Иркутске и Иркутском районе", path: BP.hub, priceFrom: 2300 })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Бурение", href: BP.hub }]} />
        {/* HERO — карточка слева, разрез реальной скважины из Патронов справа */}
        <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          <div className="card p-6 md:p-10 shadow-card flex flex-col">
            <h1>{H.h1}</h1>
            <p className="mt-4 text-[17px] leading-relaxed text-ink/85 max-w-[58ch]">{H.lead}</p>
            <div className="mt-5 flex flex-wrap gap-2">{H.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>
            <div className="mt-auto pt-6 flex flex-wrap gap-3 items-center">
              <a href="#lead" className="btn-primary">Узнать цену метра</a>
              <Link href={BP.calc} className="btn-outline">Рассчитать стоимость</Link>
            </div>
            <p className="mt-4 text-[14px] text-muted">{H.priceNote}</p>
          </div>
          <div className="card p-4 md:p-6 flex flex-col">
            {H.heroImage ? (
              <img src={H.heroImage} alt={H.heroImageAlt} className="w-full h-auto rounded-card" width="1254" height="1254" fetchPriority="high" />
            ) : (
              <WellScheme depth={52} steel={28} water={19} title="Скважина в Патронах: сталь Ø159 до 28 м, пластик Ø125 до 52 м" />
            )}
            <div className="grid grid-cols-3 gap-2 mt-2 text-center">
              {H.stats.map(([a, b]) => <div key={a} className="rounded-btn bg-page p-3"><div className="text-2xl font-extrabold tracking-tight">{a}</div><div className="text-[12px] text-muted">{b}</div></div>)}
            </div>
          </div>
        </div>
      </div>

      {/* УСЛУГИ ПО КЛАСТЕРАМ */}
      <section className="py-12 md:py-16"><div className="container-site">
        <h2 className="mb-2">Что делаем</h2>
        <p className="text-muted max-w-[70ch] mb-8">Бурение под задачу, обустройство до крана в доме, ремонт старых скважин. У каждой страницы — цена, что входит и ответы на вопросы.</p>
        <div className="grid gap-8">
          {BUR.clusters.map((c) => {
            const list = burServicesByCluster(c.slug);
            if (!list.length) return null;
            return (
              <div key={c.slug}>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3"><h3 className="text-[20px]">{c.title}</h3><span className="text-[14px] text-muted">{c.sub}</span></div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((s) => (
                    <Link key={s.slug} href={BP.page(s.slug)} className="card px-5 py-4 hover:shadow-card border border-transparent hover:border-line flex items-center justify-between gap-3">
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
        <h2 className="mb-2">Объекты с ценами под ключ</h2>
        <p className="text-muted max-w-[70ch] mb-8">Скважина 52 м с кессоном и разводкой на четыре постройки, обустройство скважины 80 м, бюджетный кессон из колец — что сделали и сколько это стоило.</p>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{burObjects.map((o) => <ObjectCard key={o.slug} o={o} />)}</div>
      </div></section>

      <Reasons items={BUR.reasons} title="Почему скважину заказывают у Фортес" />
      <DrillBrands />

      {/* ГЕО */}
      <section id="geo" className="py-12 md:py-16 scroll-mt-28"><div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-2"><h2>Бурение в Иркутском районе</h2><Link href={BP.map} className="text-brand underline text-[15px]">Карта глубин →</Link></div>
        <p className="text-muted max-w-[70ch] mb-6">Выезд инженера бесплатный. По каждому посёлку знаем, на какой глубине вода, какой грунт и какая обсадка нужна.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {burGeo.map((g) => (
            <Link key={g.slug} href={BP.geo(g.slug)} className="card p-4 hover:shadow-card block">
              <div className="font-bold">Скважина {g.prep}</div>
              <div className="text-[13px] text-muted mt-1">{g.distance} · вода {g.depth}</div>
            </Link>
          ))}
        </div>
      </div></section>

      <Steps items={BUR.steps} title="Как проходит бурение" />
      <FAQ items={BUR.faq} />
      <DrillLead source="хаб бурение" />
    </>
  );
}
