import Link from "next/link";
import { meta, ldService } from "@/lib/seo";
import { HEAT, heatGeo, heatObjects, heatServicesByCluster, HP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import LeadSection from "@/components/LeadSection";
import Steps from "@/components/Steps";
import FAQ from "@/components/FAQ";
import Reasons from "@/components/Reasons";
import ObjectCard from "@/components/ObjectCard";
import HeatBrands from "@/components/HeatBrands";
import HeatLead from "@/components/HeatLead";

const H = HEAT.hub;
export const metadata = meta({ title: H.title, description: H.description, path: HP.hub, image: H.ogImage });

export default function Page() {
  return (
    <>
      <JsonLd data={ldService({ name: "Монтаж систем отопления в Иркутске", description: "Котельные, водяной тёплый пол, радиаторное отопление под ключ для частных домов и коммерческих объектов", path: HP.hub })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Отопление", href: HP.hub }]} />
        {/* HERO — та же сетка, что на главной: карточка слева, реальное фото справа */}
        <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          <div className="card p-6 md:p-10 shadow-card flex flex-col">
            <h1>{H.h1}</h1>
            <p className="mt-4 text-[17px] leading-relaxed text-ink/85 max-w-[58ch]">{H.lead}</p>
            <div className="mt-5 flex flex-wrap gap-2">{H.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>
            <div className="mt-auto pt-6 flex flex-wrap gap-3 items-center">
              <a href="#lead" className="btn-primary">Записаться на замер</a>
              <Link href={HP.calc} className="btn-outline">Рассчитать стоимость</Link>
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
        <p className="text-muted max-w-[70ch] mb-8">Четыре направления работ и решения под тип дома. Каждая страница — с описанием, ценами и ответами на вопросы.</p>
        <div className="grid gap-8">
          {HEAT.clusters.map((c) => {
            const list = heatServicesByCluster(c.slug);
            if (!list.length) return null;
            return (
              <div key={c.slug}>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3"><h3 className="text-[20px]">{c.title}</h3><span className="text-[14px] text-muted">{c.sub}</span></div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((s) => (
                    <Link key={s.slug} href={HP.page(s.slug)} className="card px-5 py-4 hover:shadow-card border border-transparent hover:border-line flex items-center justify-between gap-3">
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
        <p className="text-muted max-w-[70ch] mb-8">Шесть реальных объектов от бани до коттеджа 450 м² — что сделали, из чего и сколько это стоило. Фото с монтажей.</p>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{heatObjects.map((o) => <ObjectCard key={o.slug} o={o} />)}</div>
      </div></section>

      <Reasons items={HEAT.reasons} title="Почему отопление заказывают у Фортес" />
      <HeatBrands />

      {/* ГЕО */}
      <section id="geo" className="py-12 md:py-16 scroll-mt-28"><div className="container-site">
        <h2 className="mb-2">Монтаж отопления в Иркутском районе</h2>
        <p className="text-muted max-w-[70ch] mb-6">Выезд инженера бесплатный. Знаем, где какие сети и лимиты мощности, — от этого зависит, какой котёл ставить и нужен ли резерв.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {heatGeo.map((g) => (
            <Link key={g.slug} href={HP.geo(g.slug)} className="card p-4 hover:shadow-card block">
              <div className="font-bold">Отопление {g.prep}</div>
              <div className="text-[13px] text-muted mt-1">{g.distance} · {g.tract}</div>
            </Link>
          ))}
        </div>
      </div></section>

      <Steps items={HEAT.steps} title="Как проходит монтаж отопления" />
      <FAQ items={HEAT.faq} />
      <HeatLead source="хаб отопление" />
    </>
  );
}
