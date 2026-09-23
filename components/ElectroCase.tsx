import Link from "next/link";
import ObjectGrid from "./ObjectGrid";
import { rub, objectCover, elekOwnObjects, type SiteObject } from "@/lib/content";

/**
 * v40: кейсы в разделе «Электрика» — только объекты, где делали именно электрику.
 * Пока свой объект один (Новолисиха) — показываем его крупно с фото монтажа, а не сеткой
 * с домами отопления (там на обложках котлы и тёплые полы). Когда своих станет 4+ — обычная сетка.
 */
export default function ElectroCase({ items = elekOwnObjects, title = "Наш объект по электрике", text }: { items?: SiteObject[]; title?: string; text?: string }) {
  if (!items.length) return null;
  if (items.length >= 4) {
    return (
      <section className="py-6"><div className="container-site">
        <h2 className="mb-6">{title}</h2>
        <ObjectGrid items={items.slice(0, 4)} section="elektrika" />
      </div></section>
    );
  }
  return (
    <section className="py-6"><div className="container-site">
      <h2 className="mb-2">{title}</h2>
      {text && <p className="text-muted max-w-[70ch] mb-6">{text}</p>}
      <div className="grid gap-5">
        {items.map((o) => {
          const cover = objectCover(o);
          const thumbs = o.images.filter((i) => i !== cover).slice(0, 4);
          const href = `/obekty/${o.slug}/`;
          return (
            <article key={o.slug} className="card shadow-card p-3 md:p-4 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
              <div className="grid gap-2">
                <Link href={href} className="block aspect-[16/10] rounded-card overflow-hidden bg-frost">
                  <img src={cover} alt={`${o.title}, ${o.place}`} className="w-full h-full object-cover" loading="lazy" width="1200" height="750" />
                </Link>
                {thumbs.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {thumbs.map((src, i) => (
                      <Link key={src} href={href} className="block aspect-square rounded-[12px] overflow-hidden bg-frost">
                        <img src={src} alt={`${o.title}: фото с монтажа ${i + 2}`} className="w-full h-full object-cover" loading="lazy" width="300" height="300" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col p-1 md:p-3">
                <div className="text-[13px] text-muted">{o.type}</div>
                <h3 className="mt-1 text-[22px] leading-tight"><Link href={href} className="hover:text-brand">{o.title}</Link></h3>
                <div className="text-[15px] text-muted">{o.place}</div>
                {o.system && <p className="mt-4 text-[15px] font-bold">{o.system}</p>}
                <p className="mt-3 text-[15px] text-ink/80 leading-relaxed">{o.solution}</p>
                <div className="mt-auto pt-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <div className="text-[13px] text-muted">Под ключ с материалами</div>
                    <div className="text-2xl font-extrabold tracking-tight">{rub(o.price)}</div>
                  </div>
                  <Link href={href} className="btn-outline">Смета и все фото</Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <div className="mt-4 text-[14px] text-right">
        <Link href="/obekty/#elektrika" className="text-brand underline underline-offset-2">Все объекты со сметой →</Link>
      </div>
    </div></section>
  );
}
