import Link from "next/link";
import { meta } from "@/lib/seo";
import { SITE, company, topPicks, objects, rub } from "@/lib/content";
import ProductCard from "@/components/ProductCard";
import Reasons from "@/components/Reasons";
import Steps from "@/components/Steps";
import ObjectCard from "@/components/ObjectCard";
import FAQ from "@/components/FAQ";
import LeadSection from "@/components/LeadSection";
import GeoLinks from "@/components/GeoLinks";
import ServiceLinks from "@/components/ServiceLinks";
import { getPosts } from "@/lib/blog";

export const metadata = meta({ title: SITE.home.title, description: SITE.home.description, path: "/" });

export default function Home() {
  const posts = getPosts().slice(0, 3);
  return (
    <>
      {/* HERO — как на teplo.fortes-dom.ru: белая карточка слева, визуал справа */}
      <section className="container-site pt-6 md:pt-10">
        <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          <div className="card p-6 md:p-10 shadow-card">
            <h1>{SITE.home.h1}</h1>
            <p className="mt-5 text-[18px] leading-relaxed text-ink/85 max-w-[58ch]">{SITE.home.lead}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SITE.home.chips.map((c) => <span key={c} className="chip">{c}</span>)}
            </div>
            <div className="mt-8 flex flex-wrap gap-3 items-center">
              <a href="#lead" className="btn-primary">Записаться на замер</a>
              <Link href="/kalkulyator/" className="btn-outline">Подобрать станцию</Link>
              <span className="text-[15px] text-muted">Станции от {rub(SITE.home.heroPriceFrom)}</span>
            </div>
          </div>
          <div className="card p-4 md:p-6 flex flex-col">
            <img src="/img/hero.webp" alt="Станция Kolo Vesi в котловане перед засыпкой на участке в Иркутском районе" className="w-full h-auto rounded-card" width="1254" height="1254" fetchPriority="high" />
            <div className="grid grid-cols-3 gap-2 mt-2 text-center">
              <div className="rounded-btn bg-page p-3"><div className="text-2xl font-extrabold tracking-tight">98%</div><div className="text-[12px] text-muted">очистка стоков</div></div>
              <div className="rounded-btn bg-page p-3"><div className="text-2xl font-extrabold tracking-tight">1–2</div><div className="text-[12px] text-muted">дня монтаж</div></div>
              <div className="rounded-btn bg-page p-3"><div className="text-2xl font-extrabold tracking-tight">{company.warrantyYears}</div><div className="text-[12px] text-muted">лет корпус</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ХИТЫ */}
      <section className="py-12 md:py-16">
        <div className="container-site">
          <h2 className="mb-2">Три станции, которые заказывают чаще всего</h2>
          <p className="text-muted max-w-[70ch] mb-8">Novo Eko 3 для дач и небольших домов, Novo Eko 5 для семьи, Zörde 4 — когда хочется обслуживать раз в два года. Остальная линейка Kolo Vesi — в каталоге.</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topPicks.map((p) => <ProductCard key={p.slug} p={p} />)}
          </div>
          <div className="mt-6"><Link href="/stancii/" className="btn-ghost -ml-4">Вся линейка: Kolo Vesi, Zörde, Novo Eko ›</Link></div>
        </div>
      </section>

      <Reasons />

      {/* ЗИМА — сибирский аргумент */}
      <section className="py-12 md:py-16">
        <div className="container-site">
          <div className="card bg-frost p-6 md:p-10 grid gap-6 lg:grid-cols-[1fr_1fr] items-center">
            <div>
              <h2>Работает при −40 °C</h2>
              <p className="mt-4 text-ink/85 max-w-[56ch]">Рабочая часть станции — ниже глубины промерзания, стоки из дома тёплые, горловину утепляем. Ставим и обслуживаем круглый год, дачные станции Novo Eko зимуют без консервации.</p>
              <Link href="/septik-dlya-zimy/" className="btn-outline mt-6 bg-white">Как станция зимует в Иркутске</Link>
            </div>
            <ul className="grid gap-3 text-[15px]">
              {["Заглубление ниже 2,2 м — нормативная глубина промерзания в Иркутске", "Труба от дома с уклоном 2 см/м — сухая, замерзать нечему", "Утеплённая крышка и пеноплекс по периметру горловины", "Отключение света на сутки-двое станция переживает без последствий"].map((t) => (
                <li key={t} className="card px-4 py-3 flex gap-3"><span className="w-2 h-2 mt-2 rounded-sm bg-brand shrink-0" />{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ОБЪЕКТЫ */}
      <section className="py-12 md:py-16">
        <div className="container-site">
          <h2 className="mb-2">Объекты со сметой</h2>
          <p className="text-muted max-w-[70ch] mb-8">Реальные цены под ключ — чтобы вы понимали, во сколько обойдётся ваш участок ещё до звонка.</p>
          <div className="grid gap-5 md:grid-cols-2">
            {objects.slice(0, 4).map((o) => <ObjectCard key={o.slug} o={o} />)}
          </div>
        </div>
      </section>

      <Steps />
      <LeadSection source="главная" />
      <ServiceLinks />
      <GeoLinks />

      {posts.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container-site">
            <h2 className="mb-8">Разбираемся в септиках</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {posts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}/`} className="card p-5 md:p-6 hover:shadow-card block">
                  <h3 className="text-[18px]">{p.h1}</h3>
                  <p className="mt-2 text-[15px] text-ink/75 leading-relaxed">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <FAQ items={SITE.homeFaq} />
    </>
  );
}
