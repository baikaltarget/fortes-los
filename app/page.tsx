import Link from "next/link";
import { meta } from "@/lib/seo";
import { BRAND, brandObjects, brandGeo, COMPLEX_PATH } from "@/lib/content";
import { getPosts } from "@/lib/blog";
import HouseSystems from "@/components/HouseSystems";
import ObjectCard from "@/components/ObjectCard";
import Reasons from "@/components/Reasons";
import Steps from "@/components/Steps";
import FAQ from "@/components/FAQ";
import LeadSection from "@/components/LeadSection";
import Certificates from "@/components/Certificates";

const H = BRAND.home;
export const metadata = meta({ title: H.title, description: H.description, path: "/", image: H.ogImage });

const GEO_LINKS: Record<string, string> = { burenie: "Скважина", vodosnabzhenie: "Вода", kanalizaciya: "Септик", otoplenie: "Отопление", elektrika: "Электрика" };

/**
 * Главная бренда (v28). Все пять направлений живые; посадочная «септик под ключ»
 * переехала на /kanalizaciya/septik-pod-klyuch/. Контент — content/brand.json.
 */
export default function Home() {
  const posts = getPosts().slice(0, 3);
  const featured = brandObjects(BRAND.featuredObjects);
  return (
    <>
      {/* HERO: фото котельной во всю карточку, текст на серой стене слева (фото зеркальное — оборудование справа) */}
      <section className="container-site pt-6 md:pt-8">
        <div className="card overflow-hidden shadow-card relative">
          <img src={H.heroImageMobile} alt={H.heroImageAlt} className="lg:hidden w-full h-auto" width="1000" height="729" fetchPriority="high" />
          <div className="hidden lg:block absolute inset-0 bg-cover bg-right" style={{ backgroundImage: `url(${H.heroImage})` }} role="img" aria-label={H.heroImageAlt} />
          <div className="hidden lg:block absolute inset-0" style={{ background: "linear-gradient(90deg, #F2F2F2 0%, #F2F2F2 28%, rgba(242,242,242,.93) 48%, rgba(242,242,242,.6) 66%, rgba(242,242,242,0) 80%)" }} aria-hidden />
          <div className="relative p-6 md:p-10 lg:p-14 lg:min-h-[620px] flex flex-col justify-center lg:max-w-[680px]">
            <h1>{H.h1}</h1>
            <p className="mt-4 text-[17px] leading-relaxed text-ink/85 max-w-[52ch]">{H.lead}</p>
            <div className="mt-5 flex flex-wrap gap-2">{H.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>
            <div className="mt-7 flex flex-wrap gap-3 items-center">
              <a href="#lead" className="btn-primary">Вызвать инженера</a>
              <Link href={COMPLEX_PATH} className="btn-outline bg-white/70">Дом целиком</Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-2 max-w-[520px]">
              {H.stats.map(([a, b]) => (
                <div key={a} className="rounded-btn bg-white/90 border border-line p-3 text-center">
                  <div className="text-2xl font-extrabold tracking-tight">{a}</div>
                  <div className="text-[12px] text-muted leading-tight">{b}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HouseSystems title={BRAND.chain.title} text={BRAND.chain.text} cta={BRAND.chain.cta} href={BRAND.chain.href} />

      {/* ОБЪЕКТЫ СО СМЕТОЙ — по одному-два из каждого направления */}
      <section className="py-6">
        <div className="container-site">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2"><h2>Объекты с ценами под ключ</h2><Link href="/obekty/" className="text-brand underline underline-offset-2 text-[15px]">Все объекты</Link></div>
          <p className="text-muted max-w-[70ch] mb-8">Реальные дома, бани и скважины в Иркутском районе с полной раскладкой сметы. Так вы понимаете, во сколько обойдётся ваш дом, ещё до звонка.</p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{featured.map((o) => <ObjectCard key={o.slug} o={o} />)}</div>
        </div>
      </section>

      <Reasons items={BRAND.reasons} title="Почему инженерные системы заказывают у Фортес" />
      <Certificates compact />

      {/* ГЕО: посёлок → пять направлений */}
      <section id="geo" className="py-12 md:py-16 scroll-mt-28">
        <div className="container-site">
          <h2 className="mb-2">Работаем в Иркутске и по всем трактам</h2>
          <p className="text-muted max-w-[70ch] mb-6">У каждого посёлка своя глубина воды, грунт, сети и лимит мощности — под каждое направление есть страница с местной фактурой. Выезд инженера бесплатный.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {brandGeo.map((g) => (
              <div key={g.slug} className="card p-4">
                <div className="font-bold">{g.name}</div>
                <div className="text-[13px] text-muted mt-0.5">{g.tract}</div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[13px]">
                  {g.sections.map((s) => <Link key={s} href={`/${s}/${g.slug}/`} className="underline underline-offset-2 decoration-line hover:text-brand hover:decoration-brand">{GEO_LINKS[s]}</Link>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Steps items={BRAND.steps} title="Как проходит заказ" />

      <LeadSection source="главная бренда" title="Инженер приедет бесплатно и посчитает дом по разделам" text="Один выезд закрывает все направления: смотрим дом, участок, сети посёлка и лимит мощности. Смета — по системам, цену фиксируем в договоре." />

      <FAQ items={BRAND.faq} />

      {posts.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container-site">
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-8"><h2>Статьи</h2><Link href="/blog/" className="text-brand underline underline-offset-2 text-[15px]">Все статьи</Link></div>
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
    </>
  );
}
