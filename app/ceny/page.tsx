import Link from "next/link";
import { meta } from "@/lib/seo";
import {
  brandDirections, BRAND, COMPLEX_PATH, HEAT, BUR, VODA, ELEK, VENT, HP, BP, VP, EP, NP, P,
  topPicks, rub, turnkeyFrom, allObjects, brandObjects, pickObjects, type HeatPrice,
} from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import Draft from "@/components/Draft";
import ObjectGrid from "@/components/ObjectGrid";
import FAQ from "@/components/FAQ";
import LeadSection from "@/components/LeadSection";

/**
 * v35: общая страница цен бренда. До v35 здесь были только септики — они переехали на /kanalizaciya/ceny/.
 * Строки берутся из prices[] каждого раздела (первые 4), у канализации — из станций и ЖБИ.
 */
export const metadata = meta({
  title: "Цены на инженерные системы для частного дома в Иркутске | Фортес",
  description: "Цены под ключ на скважину, водоснабжение, септик, отопление, вентиляцию и электрику частного дома в Иркутске. Ориентиры «от» и реальные сметы с объектов.",
  path: "/ceny/",
});

type Row = { name: string; price: string; draft?: boolean; href: string };
const top = (list: HeatPrice[]): Row[] => list.slice(0, 4).map((p) => ({ name: p.name, price: p.price, draft: p.draft, href: p.href }));

const SEPTIK_ROWS: Row[] = [
  { name: `${topPicks[0]?.name} или ${topPicks[2]?.name ?? "Zörde 4"} — станция на 3–4 человека`, price: `от ${rub(turnkeyFrom(topPicks[0]))}`, href: P.product(topPicks[0].slug) },
  { name: `${topPicks[1]?.name} — станция на 4–6 человек`, price: `от ${rub(turnkeyFrom(topPicks[1]))}`, href: P.product(topPicks[1].slug) },
  { name: "Септик из бетонных колец своего производства", price: `от ${rub(80000)}`, href: P.page("septik-iz-betonnyh-kolec") },
  { name: "Плановое обслуживание станции", price: `от ${rub(10000)}`, href: P.page("obsluzhivanie-septika") },
];

const BLOCKS: Record<string, { rows: Row[]; ceny: string }> = {
  burenie: { rows: top(BUR.prices), ceny: BP.ceny },
  vodosnabzhenie: { rows: top(VODA.prices), ceny: VP.ceny },
  kanalizaciya: { rows: SEPTIK_ROWS, ceny: P.ceny },
  otoplenie: { rows: top(HEAT.prices), ceny: HP.ceny },
  ventilyaciya: { rows: top(VENT.prices), ceny: NP.ceny },
  elektrika: { rows: top(ELEK.prices), ceny: EP.ceny },
};

const faq = [
  { q: "Почему на сайте цены «от»?", a: "Цена зависит от площади, материала стен, грунта и глубины воды на участке. «От» — нижняя граница под ключ для типового дома. Точную смету инженер делает после бесплатного выезда, и она фиксируется в договоре." },
  { q: "Можно ли заказать одну систему, а не все?", a: "Да. Каждое направление — отдельная смета и отдельный договор. Если делаем несколько систем, их сразу увязываем между собой: мощность котла с электрикой, ввод воды со скважиной, выпуск канализации с септиком." },
  { q: "Есть ли рассрочка?", a: "Рассрочка и кредит — через банки РФ на условиях банка, на всю смету: оборудование, материалы и работы. Работаем с НДС." },
];

export default function Page() {
  const objects = pickObjects(brandObjects(BRAND.featuredObjects), "kompleks", 4);
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Цены", href: "/ceny/" }]} />
        <h1>Цены на инженерные системы для частного дома в Иркутске</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[64ch]">Шесть направлений — от скважины до электрики. У каждого ниже главные позиции «от» под ключ и ссылка на полный прайс раздела. Если нужно всё сразу, есть <Link href={COMPLEX_PATH} className="text-brand underline underline-offset-2">дом целиком одной бригадой</Link> — {BRAND.complex.priceFrom}.</p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {brandDirections.map((d) => {
            const b = BLOCKS[d.slug];
            if (!b) return null;
            return (
              <section key={d.slug} className="card p-5 md:p-6 shadow-card flex flex-col">
                <h2 className="text-[22px] leading-tight"><Link href={`/${d.slug}/`} className="hover:text-brand">{d.name}</Link></h2>
                <Draft on={!!d.priceDraft} note="цена — ориентир" className="mt-2">
                  <div className="text-[26px] font-extrabold tracking-tight leading-none">{d.priceFrom}</div>
                  <div className="text-[13px] text-muted mt-1">{d.priceNote}</div>
                </Draft>
                <ul className="mt-4 divide-y divide-line text-[14px]">
                  {b.rows.map((r) => (
                    <li key={r.name} className="py-2.5 flex items-baseline justify-between gap-4">
                      <Link href={r.href} className="hover:text-brand">{r.name}</Link>
                      <Draft on={!!r.draft} note="ориентир" className="shrink-0"><span className="font-bold whitespace-nowrap">{r.price}</span></Draft>
                    </li>
                  ))}
                </ul>
                <Link href={b.ceny} className="mt-auto pt-4 text-[14px] text-brand underline underline-offset-2">Все цены — {d.name.toLowerCase()} →</Link>
              </section>
            );
          })}
        </div>

        <h2 className="mt-14 mb-2">Реальные сметы с объектов</h2>
        <p className="text-muted max-w-[70ch] mb-6">Что сделали и сколько это стоило под ключ — с раскладкой сметы на странице объекта. Всего на сайте {allObjects.length} объектов.</p>
        <ObjectGrid items={objects} section="kompleks" />
      </div>
      <FAQ items={faq} title="Вопросы про цены" />
      <LeadSection source="цены" title="Точная смета — после бесплатного выезда инженера" />
    </>
  );
}
