import { notFound } from "next/navigation";
import Link from "next/link";
import { meta, ldProduct } from "@/lib/seo";
import { products, getProduct, getBrand, rub, turnkeyFrom, objects } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import StationScheme from "@/components/StationScheme";
import FAQ from "@/components/FAQ";
import LeadSection from "@/components/LeadSection";
import ProductGrid from "@/components/ProductGrid";
import ObjectCard from "@/components/ObjectCard";
import Draft from "@/components/Draft";

export const dynamicParams = false;
export function generateStaticParams() { return products.map((p) => ({ slug: p.slug })); }

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getProduct(params.slug); if (!p) return {};
  const b = getBrand(p.brand)!;
  return meta({
    title: `${p.name} — купить в Иркутске, цена ${rub(p.price)}, установка под ключ`,
    description: `${p.name}: станция биологической очистки на ${p.users}, ${p.capacity}, залповый сброс ${p.salvo}. Цена завода ${rub(p.price)}, под ключ от ${rub(turnkeyFrom(p))}. Официальный дилер ${b.name} в Иркутске, монтаж 1–2 дня.`,
    path: `/stancii/${p.slug}/`,
  });
}

export default function Page({ params }: { params: { slug: string } }) {
  const p = getProduct(params.slug); if (!p) notFound();
  const b = getBrand(p.brand)!;
  const others = products.filter((x) => x.slug !== p.slug && (x.brand === p.brand || x.hit)).slice(0, 3).map((x) => x.slug);
  const objs = objects.filter((o) => o.product === p.slug);
  const chambers = p.brand === "kolo-vesi" ? 5 : 3;
  return (
    <>
      <JsonLd data={ldProduct({ name: p.name, description: p.summary, path: `/stancii/${p.slug}/`, price: p.price, brand: b.name, image: p.image })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Станции", href: "/stancii/" }, { name: b.name, href: `/${b.slug}/` }, { name: p.name, href: `/stancii/${p.slug}/` }]} />
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="card p-6 md:p-8 shadow-card">
            {p.hit && <span className="inline-block rounded-btn bg-brand text-white text-[13px] font-bold px-3 py-1 mb-4">{p.hitLabel}</span>}
            <h1>{p.name} в Иркутске</h1>
            <p className="mt-4 text-[18px] text-ink/85">{p.summary}</p>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-[15px]">
              <dt className="text-muted">Пользователей</dt><dd className="font-bold">{p.users}</dd>
              <dt className="text-muted">Производительность</dt><dd className="font-bold">{p.capacity}</dd>
              <dt className="text-muted">Залповый сброс</dt><dd className="font-bold">{p.salvo}</dd>
              <dt className="text-muted">Обслуживание</dt><dd className="font-bold">{p.service}</dd>
            </dl>
            <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-2">
              <div><div className="text-[13px] text-muted">Станция, цена завода</div><div className="text-3xl font-extrabold tracking-tight">{rub(p.price)}</div></div>
              <Draft on={p.installFromDraft} note="монтаж от — уточнить" className="mt-3"><div><div className="text-[13px] text-muted">Под ключ</div><div className="text-2xl font-bold tracking-tight">от {rub(turnkeyFrom(p))}</div></div></Draft>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href="#lead" className="btn-primary">Рассчитать под ключ</a>
              <Link href="/septik-v-rassrochku/" className="btn-outline">В рассрочку 0-0-24</Link>
            </div>
          </div>
          <div className="card p-4 md:p-6">
            <Draft note="заменить схему на фото станции с завода">
              <StationScheme chambers={chambers} label={p.shortName} className="w-full h-auto" />
            </Draft>
            <p className="text-[13px] text-muted mt-2">Схема работы: приёмная камера → аэротенк с биофильтром → отстойник → отвод чистой воды. Блок управления — снаружи.</p>
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16"><div className="container-site grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="prose-site">
          <h2>Что это за станция</h2>
          {p.body.map((t, i) => <p key={i}>{t}</p>)}
          <h2>Комплектации и цены</h2>
          <table>
            <thead><tr><th>Модель</th><th>Цена завода</th><th>Когда нужна</th></tr></thead>
            <tbody>{p.variants.map((v) => <tr key={v.name}><td className="font-medium">{v.name}</td><td className="whitespace-nowrap">{rub(v.price)}</td><td>{v.note}</td></tr>)}</tbody>
          </table>
          <p className="text-[14px] text-muted">Цены рекомендованные заводом-производителем, действуют у официального дилера. Монтаж — по смете после бесплатного замера.</p>
        </div>
        <aside>
          <div className="card p-6">
            <h3>Характеристики</h3>
            <dl className="mt-4 text-[15px] divide-y divide-line">
              {p.specs.map(([k, v]) => <div key={k} className="py-2 grid grid-cols-[1fr_1fr] gap-3"><dt className="text-muted">{k}</dt><dd className="font-medium">{v}</dd></div>)}
            </dl>
            <a href={p.manufacturerUrl} rel="noopener nofollow" target="_blank" className="mt-4 inline-block text-[14px] text-brand underline">Страница модели на сайте завода</a>
          </div>
        </aside>
      </div></section>

      {objs.length > 0 && (
        <section className="py-6"><div className="container-site"><h2 className="mb-6">Объекты с {p.shortName}</h2><div className="grid gap-5 md:grid-cols-2">{objs.map((o) => <ObjectCard key={o.slug} o={o} />)}</div></div></section>
      )}
      <FAQ items={p.faq} title={`Вопросы про ${p.name}`} />
      <LeadSection source={`станция ${p.name}`} title={`Посчитать ${p.name} под ключ на вашем участке`} />
      <ProductGrid slugs={others} title="Сравните с другими" />
    </>
  );
}
