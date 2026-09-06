import Link from "next/link";
import { meta } from "@/lib/seo";
import { VODA, vodaObjects, rub, VP } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQ from "@/components/FAQ";
import Draft from "@/components/Draft";
import WaterLead from "@/components/WaterLead";
import ObjectCard from "@/components/ObjectCard";

export const metadata = meta({
  title: "Цены на водоснабжение и канализацию в доме, Иркутск 2026 — за точку и метр",
  description: "Сколько стоит вода и канализация в частном доме в Иркутске: точка воды от 4 500 ₽, точка канализации от 3 500 ₽, ввод от 1 800 ₽/м, коллектор от 25 000 ₽. Дом 120 м² — от 250 000 ₽.",
  path: VP.ceny,
});

const faq = [
  { q: "Почему цена за точку, а не за дом?", a: "Потому что в доме 120 м² может быть один санузел, а может три и постирочная — разница в два раза. Точка — понятная единица: раковина, унитаз, душ, машина. Считаете точки по плану — умножаете, получаете ориентир. Точную смету составит инженер после бесплатного выезда." },
  { q: "Что входит в цену точки?", a: "Труба от коллектора или магистрали до прибора, фитинги, гофра, крепёж, водорозетка или вывод канализации под прибор, работа. Отдельно — коллекторный узел, узел ввода, оборудование и сама сантехника." },
  { q: "Что может увеличить стоимость?", a: "Сшитый полиэтилен Rehau вместо Stout, бесшумная канализация в спальной зоне, длинные наружные трассы, свайный фундамент (утеплённые подъёмы с кабелем), зимний монтаж наружных сетей с отогревом, встраиваемые смесители и инсталляции, водоочистка по анализу." },
  { q: "Действует ли рассрочка?", a: "Да, в рассрочку или кредит через банки РФ на условиях банка — на весь комплекс. Организациям — договор с НДС." },
];

export default function Page() {
  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Водоснабжение", href: VP.hub }, { name: "Цены", href: VP.ceny }]} />
        <h1>Цены на водоснабжение и канализацию в доме, Иркутск</h1>
        <p className="mt-4 text-[18px] text-ink/85 max-w-[62ch]">Главные цифры — от 4 500 ₽ за точку воды и от 3 500 ₽ за точку канализации. Ниже — ориентиры по всем видам работ и реальные объекты, чтобы было с чем сравнить.</p>
        <div className="mt-5 flex flex-wrap gap-2">{VODA.hub.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>

        <h2 className="mt-12 mb-4">Ориентиры по видам работ</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-[15px] min-w-[640px]">
            <thead className="text-left text-muted"><tr><th className="p-4">Работа</th><th className="p-4">Цена</th><th className="p-4">Примечание</th></tr></thead>
            <tbody>
              {VODA.prices.map((r) => (
                <tr key={r.name} className="border-t border-line">
                  <td className="p-4 font-bold"><Link href={r.href} className="hover:text-brand">{r.name}</Link></td>
                  <td className="p-4 whitespace-nowrap font-bold"><Draft on={r.draft} note="уточнить">{r.price}</Draft></td>
                  <td className="p-4 text-muted">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[14px] text-muted mt-3">Цены ориентировочные для Иркутска и Иркутского района, с материалами. Точная смета — после бесплатного выезда инженера, фиксируется в договоре. Быстрая прикидка по точкам — в <Link href={VP.calc} className="text-brand underline">калькуляторе</Link>.</p>

        <h2 className="mt-12 mb-4">Реальные объекты с ценой под ключ</h2>
        <p className="text-muted max-w-[70ch] mb-4">Вода и канализация редко бывают отдельной сметой — обычно они идут вместе с отоплением или скважиной. Ниже объекты, где они были в составе работ, с общей ценой.</p>
        <div className="grid gap-4 md:grid-cols-3">
          {vodaObjects.map((o) => (
            <Link key={o.slug} href={VP.object(o.slug)} className="card p-5 block hover:shadow-card h-full">
              <div className="text-[13px] text-muted">{o.type}</div>
              <div className="font-bold mt-1">{o.title}</div>
              <div className="text-[14px] text-muted">{o.place}</div>
              <div className="text-xl font-extrabold tracking-tight mt-2">{rub(o.price)}</div>
            </Link>
          ))}
        </div>

        <h2 className="mt-12 mb-6">Подробнее — со сметами</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{vodaObjects.map((o) => <ObjectCard key={o.slug} o={o} />)}</div>
      </div>
      <FAQ items={faq} title="Вопросы про цены" />
      <WaterLead source="цены водоснабжение" />
    </>
  );
}
