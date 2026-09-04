import { notFound } from "next/navigation";
import Link from "next/link";
import { meta, ldService } from "@/lib/seo";
import { brands, services, getBrand, getService, productsByBrand, getProduct, rub, objects } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import ProductGrid from "@/components/ProductGrid";
import LeadSection from "@/components/LeadSection";
import JsonLd from "@/components/JsonLd";
import Steps from "@/components/Steps";
import FAQ from "@/components/FAQ";
import ServiceLinks from "@/components/ServiceLinks";
import GeoLinks from "@/components/GeoLinks";
import ObjectCard from "@/components/ObjectCard";
import Draft from "@/components/Draft";
import Calculator from "@/components/Calculator";

export const dynamicParams = false;
export function generateStaticParams() {
  return [...brands.map((b) => ({ slug: b.slug })), ...services.map((s) => ({ slug: s.slug }))];
}
export function generateMetadata({ params }: { params: { slug: string } }) {
  const b = getBrand(params.slug);
  if (b) return meta({ title: b.title, description: b.description, path: `/${b.slug}/` });
  const s = getService(params.slug);
  if (s) return meta({ title: s.title, description: s.description, path: `/${s.slug}/` });
  return {};
}

function BrandPage({ slug }: { slug: string }) {
  const b = getBrand(slug)!;
  const list = productsByBrand(b.slug);
  return (
    <>
      <JsonLd data={ldService({ name: `${b.name} в Иркутске`, description: b.description, path: `/${b.slug}/`, priceFrom: list[0]?.price })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Станции", href: "/stancii/" }, { name: b.name, href: `/${b.slug}/` }]} />
        <h1>{b.h1}</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[64ch]">{b.intro}</p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 max-w-[1000px]">
          {b.points.map((t) => <li key={t} className="card px-4 py-3 text-[15px] flex gap-3"><span className="w-2 h-2 mt-2 rounded-sm bg-brand shrink-0" />{t}</li>)}
        </ul>
      </div>
      <section className="py-12 md:py-16"><div className="container-site">
        <h2 className="mb-6">Модели {b.name} с ценами</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      </div></section>
      <Steps />
      <LeadSection source={`бренд ${b.name}`} />
      <ServiceLinks />
    </>
  );
}

function ServicePage({ slug }: { slug: string }) {
  const s = getService(slug)!;
  const svc = s;
  const first = s.products?.[0] ? getProduct(s.products[0]) : undefined;
  const priceFrom = svc.kessons?.[0]?.price ?? svc.koloIlma?.priceFrom ?? (first ? first.price : undefined);
  const relatedObjects = objects.filter((o) => s.products?.includes(o.product)).slice(0, 2);
  return (
    <>
      <JsonLd data={ldService({ name: s.name, description: s.description, path: `/${s.slug}/`, priceFrom })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: s.name, href: `/${s.slug}/` }]} />
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="card p-6 md:p-10 shadow-card">
            <h1>{s.h1}</h1>
            <p className="mt-5 text-[18px] leading-relaxed text-ink/85 max-w-[58ch]">{s.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3 items-center">
              <a href="#lead" className="btn-primary">Записаться на замер</a>
              <Link href="/kalkulyator/" className="btn-outline">Подобрать станцию</Link>
              {priceFrom && <span className="text-[15px] text-muted">от {rub(priceFrom)}</span>}
            </div>
          </div>
          {svc.heroImage ? (
            <div className="card p-3 md:p-4">
              <img src={svc.heroImage} alt={svc.heroImageAlt || s.h1} className="w-full h-auto rounded-card" width="1254" height="1254" fetchPriority="high" />
            </div>
          ) : (
            <div className="grid gap-3">
              {[["1–2 дня", "монтаж на участке"], ["25 лет", "гарантия на корпус"], ["банки РФ", "рассрочка и кредит"], ["бесплатно", "выезд инженера"]].map(([a, b]) => (
                <div key={a} className="card px-5 py-4 flex items-baseline gap-3"><span className="text-2xl font-extrabold tracking-tight">{a}</span><span className="text-muted text-[15px]">{b}</span></div>
              ))}
            </div>
          )}
        </div>
      </div>

      {s.products?.length > 0 && <ProductGrid slugs={s.products} title="Что ставим" sub="Модели, которые подходят под эту задачу. Первые — самые заказываемые." />}

      {svc.kessons && (
        <section className="py-12 md:py-16"><div className="container-site">
          <h2 className="mb-6">Модели и цены</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {svc.kessons.map((k) => (
              <div key={k.name} className="card p-6 relative shadow-card">
                {k.hit && <span className="absolute top-4 right-4 rounded-btn bg-brand text-white text-[12px] font-bold px-2.5 py-1">Хит</span>}
                {k.image && <img src={k.image} alt={k.name} className="w-full aspect-square object-contain rounded-card bg-page mb-4" width="800" height="800" loading="lazy" />}
                <h3>{k.name}</h3>
                <div className="text-muted text-[15px] mt-1">{k.d}</div>
                <p className="mt-3 text-[15px] text-ink/80">{k.note}</p>
                <div className="mt-4 text-2xl font-extrabold tracking-tight">{rub(k.price)}</div>
                <a href="#lead" className="btn-primary mt-4 w-full">Рассчитать с монтажом</a>
              </div>
            ))}
          </div>
          <p className="text-[14px] text-muted mt-4">Рекомендованные розничные цены завода «Экомир». Монтаж — по смете.</p>
        </div></section>
      )}

      {svc.koloIlma && (
        <section className="py-12 md:py-16"><div className="container-site card p-6 md:p-8">
          <h2>Kolo Ilma 75–500</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-4 text-[15px]">
            <div><dt className="text-muted">Цена станции</dt><dd className="text-xl font-extrabold">от {rub(svc.koloIlma.priceFrom)}</dd></div>
            <div><dt className="text-muted">Производительность</dt><dd className="text-xl font-extrabold">{svc.koloIlma.capacity}</dd></div>
            <div><dt className="text-muted">Срок службы</dt><dd className="text-xl font-extrabold">{svc.koloIlma.life}</dd></div>
            <div><dt className="text-muted">Сервис</dt><dd className="text-xl font-extrabold">{svc.koloIlma.service}</dd></div>
          </dl>
        </div></section>
      )}

      {svc.servicePrices && (
        <section className="py-12 md:py-16"><div className="container-site">
          <h2 className="mb-6">Стоимость обслуживания</h2>
          <div className="card divide-y divide-line max-w-[760px]">
            {svc.servicePrices.map((r) => (
              <Draft key={r.name} on={!!r.draft} note="цена — уточнить"><div className="flex justify-between gap-4 px-6 py-4"><span>{r.name}</span><span className="font-bold whitespace-nowrap">{r.price}</span></div></Draft>
            ))}
          </div>
        </div></section>
      )}

      <section className="py-12 md:py-16"><div className="container-site prose-site">
        {s.sections.map((sec) => (
          <div key={sec.h2}><h2>{sec.h2}</h2>{sec.p.map((t, i) => <p key={i}>{t}</p>)}</div>
        ))}
      </div></section>

      {slug === "septik-dlya-chastnogo-doma" && (
        <section className="py-12 md:py-16"><div className="container-site"><h2 className="mb-6">Подберите станцию за минуту</h2><Calculator /></div></section>
      )}

      {relatedObjects.length > 0 && (
        <section className="py-6"><div className="container-site"><h2 className="mb-6">Похожие объекты со сметой</h2><div className="grid gap-5 md:grid-cols-2">{relatedObjects.map((o) => <ObjectCard key={o.slug} o={o} />)}</div></div></section>
      )}

      <Steps />
      <FAQ items={s.faq} />
      <LeadSection source={s.name} />
      <ServiceLinks exclude={s.slug} title="Смежные задачи" />
      <GeoLinks />
    </>
  );
}

export default function Page({ params }: { params: { slug: string } }) {
  if (getBrand(params.slug)) return <BrandPage slug={params.slug} />;
  if (getService(params.slug)) return <ServicePage slug={params.slug} />;
  notFound();
}
