import { notFound } from "next/navigation";
import Link from "next/link";
import { meta, ldProduct } from "@/lib/seo";
import { allObjects, getAnyObject, getProduct, getGeo, getHeatGeo, getBurGeo, rub, objectCover, P, HP, BP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import LeadSection from "@/components/LeadSection";
import ProductGrid from "@/components/ProductGrid";
import Draft from "@/components/Draft";
import ObjectCard from "@/components/ObjectCard";

export const dynamicParams = false;
export function generateStaticParams() { return allObjects.map((o) => ({ slug: o.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }) {
  const o = getAnyObject(params.slug); if (!o) return {};
  const heat = o.section === "otoplenie" || o.section === "burenie";
  const did = heat ? `Смонтировали: ${o.system}.` : `Поставили ${o.productName}.`;
  const title = `${o.title} — ${rub(o.price)} под ключ`;
  return meta({ title, description: `${o.type}, ${o.place}. ${did.length > 95 ? did.slice(0, 95).replace(/[\s,;]\S*$/, "") + "…" : did} Итого под ключ ${rub(o.price)}.`, path: `/obekty/${o.slug}/`, type: "article" });
}

export default function Page({ params }: { params: { slug: string } }) {
  const o = getAnyObject(params.slug); if (!o) notFound();
  const heat = o.section === "otoplenie" || o.section === "burenie";
  const bur = o.section === "burenie";
  const p = !heat && o.product ? getProduct(o.product) : undefined;
  const g = !heat ? getGeo(o.geo) : undefined;
  const hg = heat && !bur ? getHeatGeo(o.geo) : undefined;
  const bg = bur ? getBurGeo(o.geo) : undefined;
  const others = allObjects.filter((x) => x.slug !== o.slug && (x.section === o.section)).slice(0, 2);
  const sectionCrumb = bur ? { name: "Бурение", href: BP.hub } : heat ? { name: "Отопление", href: HP.hub } : { name: "Канализация", href: P.hub };
  return (
    <>
      <JsonLd data={ldProduct({ name: `${o.title} под ключ, ${o.place}`, description: o.solution, path: `/obekty/${o.slug}/`, price: o.price, brand: "Фортес", image: objectCover(o) })} />
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Объекты", href: "/obekty/" }, sectionCrumb, { name: o.title, href: `/obekty/${o.slug}/` }]} />
        <Draft on={o.draft} note="объект придуман для примера — заменить на реальный">
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div>
              <div className="text-muted">{o.type} · {o.place}</div>
              <h1 className="mt-2">{o.title}</h1>
              {heat && o.system && <p className="mt-3 text-[15px] text-muted">{o.system}</p>}
              <div className="mt-6 grid gap-5 prose-site">
                <div><h3>Задача</h3><p>{o.task}</p></div>
                <div><h3>Решение</h3><p>{o.solution}</p></div>
                <div><h3>Результат</h3><p>{o.result}</p></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {p && <Link href={P.product(p.slug)} className="chip hover:border-ink">{p.name}</Link>}
                {g && <Link href={P.geo(g.slug)} className="chip hover:border-ink">Септик {g.prep}</Link>}
                {hg && <Link href={HP.geo(hg.slug)} className="chip hover:border-ink">Отопление {hg.prep}</Link>}
                {bg && <Link href={BP.geo(bg.slug)} className="chip hover:border-ink">Скважины {bg.prep}</Link>}
                {heat && !bur && <Link href={HP.hub} className="chip hover:border-ink">Все услуги по отоплению</Link>}
                {bur && <Link href={BP.hub} className="chip hover:border-ink">Все услуги по бурению</Link>}
              </div>
              <Draft on={o.estimateDraft} note="смета — проверить позиции" className="mt-6"><div className="card p-6">
                <h3>{heat ? "Что вошло в стоимость" : "Смета"}</h3>
                <table className="w-full mt-3 text-[15px]">
                  <tbody>{o.estimate.map(([k, v], i) => <tr key={k} className={i === o.estimate.length - 1 ? "font-extrabold text-[17px]" : "border-b border-line"}><td className="py-2 pr-3">{k}</td><td className="py-2 text-right whitespace-nowrap">{v}</td></tr>)}</tbody>
                </table>
              </div></Draft>
            </div>
            <div className="grid gap-3 content-start">
              <Draft on={o.images[0].endsWith(".svg")} note="заменить на живые фото объекта">
                <img src={objectCover(o)} alt={`${o.title}, ${o.place}`} className="card w-full max-w-full aspect-[16/10] object-cover" width="1200" height="750" fetchPriority="high" />
              </Draft>
              {o.images.length > 1 && (
                <div className="columns-2 gap-3">
                  {o.images.slice(1).map((src, i) => <img key={src} src={src} alt={`${o.title}, фото ${i + 2}`} className="card w-full h-auto mb-3 break-inside-avoid" loading="lazy" />)}
                </div>
              )}
            </div>
          </div>
        </Draft>
      </div>
      <LeadSection source={`объект ${o.slug}`} title={bur ? "Похожий участок? Посчитаем так же подробно" : heat ? "Похожий дом? Посчитаем так же подробно" : "Похожий участок? Посчитаем так же подробно"} text={bur ? "Инженер приедет бесплатно, посмотрит участок и дом, сверит глубину по соседним скважинам и составит смету с теми же строками. Смета фиксируется в договоре." : heat ? "Инженер приедет бесплатно, посмотрит дом или проект, посчитает теплопотери и составит смету с теми же строками. Проект и смета — до договора." : undefined} />
      {p && <ProductGrid slugs={[p.slug]} title="Станция с этого объекта" />}
      {others.length > 0 && <section className="py-6"><div className="container-site"><h2 className="mb-6">Другие объекты</h2><div className="grid gap-5 md:grid-cols-2">{others.map((x) => <ObjectCard key={x.slug} o={x} />)}</div></div></section>}
    </>
  );
}
