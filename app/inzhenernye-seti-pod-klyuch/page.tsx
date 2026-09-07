import Link from "next/link";
import { meta, ldService } from "@/lib/seo";
import { BRAND, brandObjects, brandGeo, COMPLEX_PATH } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Draft from "@/components/Draft";
import RichP from "@/components/RichP";
import ObjectCard from "@/components/ObjectCard";
import Reasons from "@/components/Reasons";
import Steps from "@/components/Steps";
import FAQ from "@/components/FAQ";
import LeadSection from "@/components/LeadSection";

const C = BRAND.complex;
const H = BRAND.home;
export const metadata = meta({ title: C.title, description: C.description, path: COMPLEX_PATH, image: H.ogImage });

/** Комплекс «дом целиком одной бригадой» — отдельный кластер, общий для всех направлений (план, раздел 7). Контент — content/brand.json → complex */
export default function Page() {
  const objects = brandObjects(C.objects);
  return (
    <>
      <JsonLd data={ldService({ name: C.h1, description: C.description, path: COMPLEX_PATH })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Инженерные сети под ключ", href: COMPLEX_PATH }]} />
        <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          <div className="card p-6 md:p-10 shadow-card flex flex-col">
            <h1>{C.h1}</h1>
            <p className="mt-4 text-[17px] leading-relaxed text-ink/85 max-w-[58ch]">{C.lead}</p>
            <div className="mt-5 flex flex-wrap gap-2">{C.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>
            <div className="mt-auto pt-6 flex flex-wrap gap-3 items-center">
              <a href="#lead" className="btn-primary">Вызвать инженера</a>
              <Link href="/obekty/" className="btn-outline">Сметы объектов</Link>
            </div>
            <Draft on={!!C.priceDraft} note="ориентир — подтвердить" className="mt-5 inline-block">
              <div className="text-[26px] font-extrabold tracking-tight leading-none">{C.priceFrom}</div>
              <div className="text-[14px] text-muted mt-1 max-w-[52ch]">{C.priceNote}</div>
            </Draft>
          </div>
          <div className="card p-4 md:p-6">
            <img src={H.heroImageMobile} alt={H.heroImageAlt} className="w-full h-auto rounded-card" width="1000" height="729" fetchPriority="high" />
            <div className="grid grid-cols-3 gap-2 mt-2 text-center">
              {H.stats.map(([a, b]) => <div key={a} className="rounded-btn bg-page p-3"><div className="text-2xl font-extrabold tracking-tight">{a}</div><div className="text-[12px] text-muted">{b}</div></div>)}
            </div>
          </div>
        </div>
      </div>

      {/* ЭТАПЫ В ПОРЯДКЕ СТРОЙКИ — это последовательность, поэтому нумерация уместна */}
      <section className="py-12 md:py-16"><div className="container-site">
        <h2 className="mb-2">Пять систем в порядке стройки</h2>
        <p className="text-muted max-w-[70ch] mb-8">Каждый этап — отдельная страница с ценами и подробностями. Сроки — для дома 120–150 м² при готовых стенах и кровле.</p>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {C.stages.map((s) => (
            <li key={s.n} className="card p-5 flex flex-col">
              <div className="flex items-center justify-between"><span className="w-10 h-10 rounded-btn bg-ink text-white font-extrabold flex items-center justify-center">{s.n}</span><span className="text-[13px] text-muted">{s.time}</span></div>
              <h3 className="mt-4 text-[18px]"><Link href={s.href} className="hover:text-brand">{s.title}</Link></h3>
              <p className="mt-2 text-[14px] text-ink/80 leading-relaxed">{s.text}</p>
              <Link href={s.href} className="mt-auto pt-3 text-[14px] text-brand underline underline-offset-2">Подробнее</Link>
            </li>
          ))}
        </ol>
      </div></section>

      {/* ТЕКСТ */}
      <section className="py-6"><div className="container-site grid gap-6">
        {C.sections.map((sec) => (
          <div key={sec.h2} className="card p-6 md:p-10 prose-site">
            <h2 className="!mt-0">{sec.h2}</h2>
            {sec.p.map((t, i) => <RichP key={i} text={t} />)}
          </div>
        ))}
      </div></section>

      {/* ОБЪЕКТЫ, где было несколько систем */}
      <section className="py-12 md:py-16"><div className="container-site">
        <h2 className="mb-2">Объекты, где делали несколько систем сразу</h2>
        <p className="text-muted max-w-[70ch] mb-8">Реальные сметы: отопление с водой и канализацией, скважина с разводкой на четыре постройки, баня со всеми сетями.</p>
        <div className="grid gap-5 md:grid-cols-2">{objects.map((o) => <ObjectCard key={o.slug} o={o} />)}</div>
      </div></section>

      <Reasons items={BRAND.reasons} title="Почему дом целиком заказывают у Фортес" />
      <Steps items={BRAND.steps} title="Как проходит заказ комплекса" />
      <FAQ items={C.faq} />
      <LeadSection source="инженерные сети под ключ" title="Инженер приедет бесплатно и посчитает дом по разделам" text="Один выезд закрывает все направления: смотрим дом, участок, сети посёлка и лимит мощности. Смета — по системам, цену фиксируем в договоре." />

      {/* ГЕО — на страницы направлений */}
      <section className="py-12 md:py-16"><div className="container-site">
        <h2 className="mb-2">Посёлки, где делаем дома целиком</h2>
        <p className="text-muted max-w-[70ch] mb-6">Локальная фактура по каждому направлению — на страницах посёлков; здесь — куда выезжаем.</p>
        <div className="flex flex-wrap gap-2">
          {brandGeo.map((g) => <Link key={g.slug} href={`/otoplenie/${g.slug}/`} className="chip hover:border-ink">{g.name}</Link>)}
        </div>
      </div></section>
    </>
  );
}
