import { notFound } from "next/navigation";
import Link from "next/link";
import { meta, ldProduct } from "@/lib/seo";
import { objects, getObject, getProduct, getGeo, rub, P } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import LeadSection from "@/components/LeadSection";
import ProductGrid from "@/components/ProductGrid";
import Draft from "@/components/Draft";
import ObjectCard from "@/components/ObjectCard";

export const dynamicParams = false;
export function generateStaticParams() { return objects.map((o) => ({ slug: o.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }) {
  const o = getObject(params.slug); if (!o) return {};
  return meta({ title: `${o.title}, ${o.place} — смета и цена под ключ ${rub(o.price)}`, description: `${o.type}, ${o.place}. ${o.task.slice(0, 140).replace(/\s\S*$/, "")}… Поставили ${o.productName}. Итого под ключ ${rub(o.price)}.`, path: `/obekty/${o.slug}/`, type: "article" });
}

export default function Page({ params }: { params: { slug: string } }) {
  const o = getObject(params.slug); if (!o) notFound();
  const p = getProduct(o.product); const g = getGeo(o.geo);
  const others = objects.filter((x) => x.slug !== o.slug).slice(0, 2);
  return (
    <>
      <JsonLd data={ldProduct({ name: `${o.title} под ключ, ${o.place}`, description: o.solution, path: `/obekty/${o.slug}/`, price: o.price, brand: "Фортес" })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Объекты", href: "/obekty/" }, { name: o.title, href: `/obekty/${o.slug}/` }]} />
        <Draft on={o.draft} note="объект придуман для примера — заменить на реальный">
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div>
              <div className="text-muted">{o.type} · {o.place}</div>
              <h1 className="mt-2">{o.title}</h1>
              <div className="mt-6 grid gap-5 prose-site">
                <div><h3>Задача</h3><p>{o.task}</p></div>
                <div><h3>Решение</h3><p>{o.solution}</p></div>
                <div><h3>Результат</h3><p>{o.result}</p></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {p && <Link href={P.product(p.slug)} className="chip hover:border-ink">{p.name}</Link>}
                {g && <Link href={P.geo(g.slug)} className="chip hover:border-ink">Септик {g.prep}</Link>}
              </div>
            </div>
            <div className="grid gap-4">
              <Draft on={o.images[0].endsWith(".svg")} note="заменить на живые фото объекта">
                <img src={o.images[0]} alt={`${o.title}, ${o.place}`} className="card w-full max-w-full aspect-[16/10] object-cover" width="960" height="600" />
                {o.images.length > 1 && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {o.images.slice(1).map((src, i) => <img key={src} src={src} alt={`${o.title}, фото ${i + 2}`} className="card w-full aspect-[16/10] object-cover" width="960" height="600" loading="lazy" />)}
                  </div>
                )}
              </Draft>
              <Draft on={o.estimateDraft} note="смета — проверить позиции"><div className="card p-6">
                <h3>Смета</h3>
                <table className="w-full mt-3 text-[15px]">
                  <tbody>{o.estimate.map(([k, v], i) => <tr key={k} className={i === o.estimate.length - 1 ? "font-extrabold text-[17px]" : "border-b border-line"}><td className="py-2 pr-3">{k}</td><td className="py-2 text-right whitespace-nowrap">{v}</td></tr>)}</tbody>
                </table>
              </div></Draft>
            </div>
          </div>
        </Draft>
      </div>
      <LeadSection source={`объект ${o.slug}`} title="Похожий участок? Посчитаем так же подробно" />
      {p && <ProductGrid slugs={[p.slug]} title="Станция с этого объекта" />}
      <section className="py-6"><div className="container-site"><h2 className="mb-6">Другие объекты</h2><div className="grid gap-5 md:grid-cols-2">{others.map((x) => <ObjectCard key={x.slug} o={x} />)}</div></div></section>
    </>
  );
}
